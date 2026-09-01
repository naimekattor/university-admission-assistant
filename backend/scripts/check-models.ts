import { config } from 'dotenv';
config();

import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

async function check() {
  console.log('================ GROQ CHECK ================');
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
  console.log('GROQ_MODEL in env:', process.env.GROQ_MODEL);
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const list = await groq.models.list();
      console.log('Available Groq models:');
      list.data.forEach(m => console.log(' -', m.id));
    } catch (e: any) {
      console.error('Groq list error:', e?.message || e);
    }
  }

  console.log('\n================ GEMINI CHECK ================');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  console.log('GEMINI_CHAT_MODEL in env:', process.env.GEMINI_CHAT_MODEL);
  console.log('GEMINI_EMBEDDING_MODEL in env:', process.env.GEMINI_EMBEDDING_MODEL);

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const models = await ai.models.list();
      console.log('Available Gemini models:');
      for await (const m of models) {
        console.log(' -', m.name, '| methods:', m.supportedActions || m.supportedGenerationMethods);
      }
    } catch (e: any) {
      console.error('Gemini list error:', e?.message || e);
    }
  }
}

check();
