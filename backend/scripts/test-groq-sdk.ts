import { config } from 'dotenv';
config();

import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

async function testAll() {
  const models = ['groq/compound-mini', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];
  for (const m of models) {
    try {
      const res = await generateText({
        model: groq(m),
        prompt: 'Say hello in 3 words',
      });
      console.log(`[${m}] SUCCESS:`, res.text.trim());
    } catch (e: any) {
      console.error(`[${m}] FAILED:`, e.message || e);
    }
  }
}

testAll();
