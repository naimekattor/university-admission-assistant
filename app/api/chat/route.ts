import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { getOrCreateSession } from '@/lib/session';
import { db, chatMessages, activityLogs } from '@/lib/db';
import { buildAdmissionSystemPrompt, searchDocuments, formatDocumentsForContext } from '@/lib/services/rag-engine';
import { openai } from '@ai-sdk/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { groq } from '@ai-sdk/groq';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getOrCreateSession();
    const messages = await db
      .select({
        role: chatMessages.role,
        content: chatMessages.content,
      })
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, session.id))
      .orderBy(asc(chatMessages.createdAt));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to fetch session chat history:', error);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getOrCreateSession();
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.sessionId, session.id));

    return NextResponse.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Failed to clear chat history:', error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const session = await getOrCreateSession();

    // Save user message to database (non-blocking if DB down)
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        try {
          await db.insert(chatMessages).values({
            sessionId: session.id,
            role: 'user',
            content: lastMessage.content,
          });

          await db.insert(activityLogs).values({
            sessionId: session.id,
            action: 'chat_message',
            metadata: { messageLength: lastMessage.content.length },
          });
        } catch (dbErr) {
          console.warn('Chat message DB logging error:', dbErr);
        }
      }
    }

    // Extract query from latest user message
    const userQuery = messages[messages.length - 1]?.content || '';
    
    console.log(`\n--- [CHAT REQUEST START] ---`);
    console.log(`[Chat API] Processing message: "${userQuery}"`);

    // Search for relevant documents using RAG (fetch top 6 relevant chunks)
    const relevantDocs = await searchDocuments(userQuery, undefined, undefined, 6);
    const ragContext = formatDocumentsForContext(relevantDocs);
    
    console.log(`[Chat API] RAG Context injected: ${relevantDocs.length > 0 ? `${relevantDocs.length} chunk(s) included` : 'None (No relevant docs found)'}`);
    console.log(relevantDocs);
    // Detect language of user input
    const isPureEnglish = /^[a-zA-Z0-9\s\.,\?!'"\(\)\-\:\;\$\%\&\*\#\@\+\/\=\_\<\>\n\r]+$/.test(userQuery.trim());
    const hasBanglaScript = /[\u0980-\u09FF]/.test(userQuery);

    let languageDirective = '';
    if (isPureEnglish) {
      languageDirective = `\n\n[CRITICAL LANGUAGE INSTRUCTION]: The user's prompt is in ENGLISH. Respond ENTIRELY in clean, professional ENGLISH. Do NOT output any Chinese, Japanese, or foreign characters.`;
    } else if (hasBanglaScript) {
      languageDirective = `\n\n[CRITICAL LANGUAGE INSTRUCTION]: The user's prompt is in BANGLA script (বাংলা). Respond strictly in clear, polite, and natural BANGLA (বাংলা). ABSOLUTELY DO NOT output any Chinese characters (中文) or non-Bangla scripts!`;
    } else {
      languageDirective = `\n\n[CRITICAL LANGUAGE INSTRUCTION]: The user's prompt is written in BANGLISH / MIXED LANGUAGE. Respond in natural, helpful Bangla or Banglish. ABSOLUTELY DO NOT output any Chinese characters (中文) or foreign scripts!`;
    }

    // Build comprehensive system prompt with admission guidelines, language directive, and RAG context
    let systemPrompt = buildAdmissionSystemPrompt() + languageDirective;
    if (ragContext && ragContext !== 'No relevant documents found.') {
      systemPrompt += `\n\n${ragContext}`;
    }

    const mode = (process.env.AI_PROVIDER || 'auto').toLowerCase();
    let responseStream: Response | null = null;

    // 1. Try OpenAI
    if ((mode === 'openai' || mode === 'auto') && process.env.OPENAI_API_KEY) {
      try {
        console.log('[Chat API] Attempting OpenAI provider (gpt-4o-mini)...');
        responseStream = await tryStreamOpenAI(messages, systemPrompt, session.id);
      } catch (err) {
        console.warn('[Chat API] OpenAI failed, falling back to next provider:', err instanceof Error ? err.message : err);
      }
    }

    // 2. Try Gemini
    if (!responseStream && (mode === 'gemini' || mode === 'auto') && process.env.GEMINI_API_KEY) {
      try {
        console.log('[Chat API] Attempting Gemini provider (gemini-1.5-flash)...');
        responseStream = await tryStreamGemini(messages, systemPrompt, userQuery, session.id);
      } catch (err) {
        console.warn('[Chat API] Gemini failed, falling back to next provider:', err instanceof Error ? err.message : err);
      }
    }

    // 3. Try Grok (xAI)
    const grokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    if (!responseStream && (mode === 'grok' || mode === 'auto') && grokKey) {
      try {
        console.log('[Chat API] Attempting xAI Grok provider (grok-beta)...');
        responseStream = await tryStreamGrok(messages, systemPrompt, grokKey, session.id);
      } catch (err) {
        console.warn('[Chat API] Grok failed, falling back to next provider:', err instanceof Error ? err.message : err);
      }
    }

    // 4. Try Groq
    if (!responseStream && (mode === 'groq' || mode === 'auto') && process.env.GROQ_API_KEY) {
      try {
        console.log('[Chat API] Attempting Groq provider (llama-3.3-70b-versatile)...');
        responseStream = await tryStreamGroq(messages, systemPrompt, session.id);
      } catch (err) {
        console.warn('[Chat API] Groq failed, falling back to next provider:', err instanceof Error ? err.message : err);
      }
    }

    // 5. Guaranteed Fallback to Local Ollama
    if (!responseStream) {
      console.log('[Chat API] Using local Ollama fallback provider...');
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
      const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

      responseStream = new Response(
        await streamOllamaChat(
          messages.map((m: any) => ({ role: m.role, content: m.content })),
          systemPrompt,
          baseUrl,
          modelName,
          session.id,
        ),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        },
      );
    }

    return responseStream;
  } catch (error) {
    console.error('Chat API root error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ---------------------------------------------------------------------------
// Provider Helper Implementations
// ---------------------------------------------------------------------------

async function tryStreamOpenAI(messages: any[], systemPrompt: string, sessionId: string): Promise<Response> {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = '';
      const reader = result.toTextStreamResponse().body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = new TextDecoder().decode(value);
          fullContent += text;
          controller.enqueue(value);
        }
      }
      if (fullContent) {
        try {
          await db.insert(chatMessages).values({ sessionId, role: 'assistant', content: fullContent });
        } catch (dbErr) {
          console.warn('OpenAI DB insert error:', dbErr);
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function tryStreamGemini(messages: any[], systemPrompt: string, userQuery: string, sessionId: string): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const chat = geminiModel.startChat({ history });
  const resultStream = await chat.sendMessageStream(userQuery);

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = '';
      try {
        for await (const chunk of resultStream.stream) {
          const text = chunk.text();
          if (text) {
            fullContent += text;
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        if (fullContent) {
          try {
            await db.insert(chatMessages).values({ sessionId, role: 'assistant', content: fullContent });
          } catch (dbErr) {
            console.warn('Gemini DB insert error:', dbErr);
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function tryStreamGrok(messages: any[], systemPrompt: string, apiKey: string, sessionId: string): Promise<Response> {
  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages: messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    })),
    // Optional callback when stream finishes to save response into DB
    onFinish: async ({ text }) => {
      try {
        await db.insert(chatMessages).values({
          sessionId,
          role: 'assistant',
          content: text,
        });
      } catch (err) {
        console.warn('Failed to save assistant response to DB:', err);
      }
    },

  })

  return result.toTextStreamResponse();
} 

async function streamOllamaChat(
  messages: any[],
  systemPrompt: string,
  baseUrl: string,
  modelName: string,
  sessionId: string,
) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No Ollama response body');

        let fullContent = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                fullContent += data.message.content;
                controller.enqueue(new TextEncoder().encode(data.message.content));
              }
            } catch {
              // Ignore partial lines
            }
          }
        }

        if (fullContent) {
          try {
            await db.insert(chatMessages).values({ sessionId, role: 'assistant', content: fullContent });
          } catch (dbErr) {
            console.warn('Ollama assistant DB insert error:', dbErr);
          }
        }

        controller.close();
      } catch (error) {
        console.error('Ollama streaming error:', error);
        controller.error(error);
      }
    },
  });

  return stream;
}

async function tryStreamGroq(messages: any[], systemPrompt: string, sessionId: string): Promise<Response> {
  const result = await streamText({
    model: groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = '';
      const reader = result.toTextStreamResponse().body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = new TextDecoder().decode(value);
          fullContent += text;
          controller.enqueue(value);
        }
      }
      if (fullContent) {
        try {
          await db.insert(chatMessages).values({ sessionId, role: 'assistant', content: fullContent });
        } catch (dbErr) {
          console.warn('Groq DB insert error:', dbErr);
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

