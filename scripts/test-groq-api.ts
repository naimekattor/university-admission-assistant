import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

async function testGroqApi() {
  const apiKey = process.env.GROQ_API_KEY;

  console.log('====================================================');
  console.log('            GROQ API CONNECTION TEST SCRIPT         ');
  console.log('====================================================');
  console.log('Configured GROQ_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : '❌ NOT SET IN .env');

  if (!apiKey) {
    console.error('\n❌ ERROR: GROQ_API_KEY environment variable is missing.');
    console.log('Please add GROQ_API_KEY=gsk_... to your .env file.\n');
    return;
  }

  const modelName = 'groq/compound-mini';
  console.log(`🤖 Model Target: ${modelName}`);

  try {
    const startTime = Date.now();
    console.log('⏳ Sending test prompt to Groq API...');

    const response = await generateText({
      model: groq(modelName),
      prompt: 'Respond with a short paragraph confirming that the Groq API connection is active and working properly.',
      temperature: 0.2,
    });

    const duration = Date.now() - startTime;

    console.log('\n====================================================');
    console.log('✅ STATUS: GROQ API CONNECTION SUCCESSFUL');
    console.log(`⏱️ Latency: ${duration}ms`);
    console.log('====================================================');
    console.log('💬 Groq Response:\n');
    console.log(response.text.trim());
    console.log('====================================================\n');
  } catch (err: any) {
    console.log('\n====================================================');
    console.log('❌ STATUS: GROQ API REQUEST FAILED');
    console.log('====================================================');
    console.error('Error Message:', err?.message || err);
    if (err?.status) console.error('HTTP Status:', err.status);
    console.log('====================================================\n');
  }
}

testGroqApi();
