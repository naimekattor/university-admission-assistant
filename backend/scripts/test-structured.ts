import { config } from 'dotenv';
config();

import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

async function test() {
  console.log('--- 1. Testing Gemini 3.6 Flash Structured Output ---');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Give admission advice for BUET CSE in JSON format with fields: summary, requirements (array of strings), advice.',
      config: {
        responseMimeType: 'application/json',
      }
    });
    console.log('Gemini JSON Result:', res.text);
  } catch (e: any) {
    console.error('Gemini JSON Error:', e.message || e);
  }

  console.log('\n--- 2. Testing Gemini Embedding with outputDimensionality 768 ---');
  try {
    const res: any = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: 'BUET Admission requirements',
      config: {
        outputDimensionality: 768,
      }
    });
    const values = res?.embedding?.values || res?.embeddings?.[0]?.values;
    console.log('Gemini Embedding (768 requested) dimension:', values?.length);
  } catch (e: any) {
    console.error('Gemini Embedding Error with config:', e.message || e);
  }

  console.log('\n--- 3. Testing Groq Models for Structured JSON ---');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const models = ['groq/compound-mini', 'groq/compound', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];

  for (const m of models) {
    try {
      const res = await groq.chat.completions.create({
        model: m,
        messages: [
          { role: 'system', content: 'You are an admission expert. Respond ONLY with valid JSON object.' },
          { role: 'user', content: 'Provide BUET CSE requirements in JSON.' }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1024,
      });
      console.log(`[Groq ${m}] JSON SUCCESS:`, res.choices[0]?.message?.content?.substring(0, 100) + '...');
    } catch (e: any) {
      console.error(`[Groq ${m}] JSON Error:`, e.message || e);
    }
  }
}

test();
