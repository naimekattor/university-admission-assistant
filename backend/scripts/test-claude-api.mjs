import dotenv from 'dotenv';
dotenv.config();

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

async function testClaudeApi() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  console.log('====================================================');
  console.log('         ANTHROPIC CLAUDE API TEST SCRIPT           ');
  console.log('====================================================');
  console.log('Configured ANTHROPIC_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : '❌ NOT SET IN .env');

  if (!apiKey) {
    console.error('\n❌ ERROR: ANTHROPIC_API_KEY environment variable is missing.');
    console.log('Please add ANTHROPIC_API_KEY=sk-ant-api03-... to your .env file.\n');
    return;
  }

  const modelName = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  console.log(`🤖 Model Target: ${modelName}`);

  try {
    const startTime = Date.now();
    console.log('⏳ Sending test prompt to Anthropic API...');

    const response = await generateText({
      model: anthropic(modelName),
      prompt: 'Respond with a short paragraph confirming that the Anthropic Claude API connection is active and working properly.',
      temperature: 0.2,
    });

    const duration = Date.now() - startTime;

    console.log('\n====================================================');
    console.log('✅ STATUS: CLAUDE API CONNECTION SUCCESSFUL');
    console.log(`⏱️ Latency: ${duration}ms`);
    console.log('====================================================');
    console.log('💬 Claude Response:\n');
    console.log(response.text.trim());
    console.log('====================================================\n');
  } catch (err) {
    console.log('\n====================================================');
    console.log('❌ STATUS: CLAUDE API REQUEST FAILED');
    console.log('====================================================');
    console.error('Error Message:', err?.message || err);
    if (err?.status) console.error('HTTP Status:', err.status);
    console.log('====================================================\n');
  }
}

testClaudeApi();
