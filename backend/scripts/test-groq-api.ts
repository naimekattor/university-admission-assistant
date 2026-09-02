import { config } from 'dotenv';
config();

import Groq from 'groq-sdk';

async function testGroqApi() {
  const apiKey = process.env.GROQ_API_KEY;

  console.log('====================================================');
  console.log('            GROQ API MODEL DISCOVERY SCRIPT         ');
  console.log('====================================================');

  if (!apiKey) {
    console.error('❌ ERROR: GROQ_API_KEY is not set');
    return;
  }

  const client = new Groq({ apiKey });

  try {
    const modelList = await client.models.list();
    console.log('Available models for your API key:');
    const modelIds = modelList.data.map((m) => m.id);
    console.log(modelIds);

    const testModel = 'openai/gpt-oss-120b';

    console.log(`\nTesting chat completion with: ${testModel}...`);
    const completion = await client.chat.completions.create({
      model: testModel,
      messages: [{ role: 'user', content: 'Say hello in Bangla and confirm you are running on Groq!' }],
    });

    console.log('\nResponse from Groq:');
    console.log(completion.choices[0]?.message?.content);
    console.log('\nRecommended GROQ_MODEL setting:', testModel);
  } catch (err: any) {
    console.error('Groq error:', err?.message || err);
  }
}

testGroqApi();

