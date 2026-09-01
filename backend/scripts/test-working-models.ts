import { config } from 'dotenv';
config();

import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

async function testWorkingModels() {
  console.log('--- Testing Groq Models ---');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const groqCandidates = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b', 'groq/compound-mini'];

  for (const model of groqCandidates) {
    try {
      const res = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Say hello in 5 words' }],
        max_tokens: 50,
      });
      console.log(`[Groq ${model}] SUCCESS:`, res.choices[0]?.message?.content);
    } catch (e: any) {
      console.error(`[Groq ${model}] FAILED:`, e.message);
    }
  }

  console.log('\n--- Testing Gemini Chat Models ---');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const geminiCandidates = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];

  for (const model of geminiCandidates) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: 'Say hello in 5 words',
      });
      console.log(`[Gemini ${model}] SUCCESS:`, res.text?.trim());
    } catch (e: any) {
      console.error(`[Gemini ${model}] FAILED:`, e.message);
    }
  }

  console.log('\n--- Testing Gemini Embedding Models ---');
  const embeddingCandidates = ['gemini-embedding-001', 'gemini-embedding-2-preview', 'gemini-embedding-2'];

  for (const model of embeddingCandidates) {
    try {
      const res: any = await ai.models.embedContent({
        model,
        contents: 'Admission requirements for computer science',
      });
      const values = res?.embedding?.values || res?.embeddings?.[0]?.values;
      console.log(`[Gemini Embedding ${model}] SUCCESS: Dim = ${values?.length}`);
    } catch (e: any) {
      console.error(`[Gemini Embedding ${model}] FAILED:`, e.message);
    }
  }
}

testWorkingModels();
