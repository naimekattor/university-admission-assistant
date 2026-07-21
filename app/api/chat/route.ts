import { streamText } from 'ai';
import { getOrCreateSession } from '@/lib/session';
import { db, chatMessages, activityLogs } from '@/lib/db';
import { buildSystemContext } from '@/lib/ai/context';
import { buildAdmissionSystemPrompt, searchDocuments, formatDocumentsForContext } from '@/lib/services/rag-engine';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

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
    
    // Search for relevant documents using RAG
    const relevantDocs = await searchDocuments(userQuery, undefined, undefined, 3);
    const ragContext = formatDocumentsForContext(relevantDocs);
    
    // Build comprehensive system prompt with admission guidelines and RAG context
    let systemPrompt = buildAdmissionSystemPrompt();
    if (ragContext && ragContext !== 'No relevant documents found.') {
      systemPrompt += `\n\n${ragContext}`;
    }

    // Determine which AI provider to use
    let provider = (process.env.AI_PROVIDER || 'ollama') as string;

    if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
      console.warn('[Chat] OPENAI_API_KEY is missing. Falling back to local Ollama instantly.');
      provider = 'ollama';
    }

    if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      console.warn('[Chat] ANTHROPIC_API_KEY is missing. Falling back to local Ollama instantly.');
      provider = 'ollama';
    }

    let model;

    if (provider === 'openai') {
      model = openai('gpt-4-turbo');
    } else if (provider === 'anthropic') {
      model = anthropic('claude-3-5-sonnet-20241022');
    } else if (provider === 'ollama') {
      // For Ollama, we'll use a custom fetch approach
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      const modelName = process.env.OLLAMA_MODEL || 'llama2';

      return new Response(
        await streamOllamaChat(
          messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
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

    // Use AI SDK for OpenAI and Anthropic
    const result = await streamText({
      model: model!,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Save assistant message to database
    let assistantContent = '';
    const reader = result.toTextStreamResponse().body?.getReader();
    if (reader) {
      let fullContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        fullContent += chunk;
      }

      try {
        await db.insert(chatMessages).values({
          sessionId: session.id,
          role: 'assistant',
          content: fullContent,
        });
      } catch (dbErr) {
        console.warn('Assistant DB insert error:', dbErr);
      }
    }

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helper function for Ollama streaming
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages,
            ],
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

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
                controller.enqueue(
                  new TextEncoder().encode(data.message.content),
                );
              }
            } catch (e) {
              // Skip malformed lines
            }
          }
        }

        // Save to database (non-blocking if DB down)
        if (fullContent) {
          try {
            await db.insert(chatMessages).values({
              sessionId,
              role: 'assistant',
              content: fullContent,
            });
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
