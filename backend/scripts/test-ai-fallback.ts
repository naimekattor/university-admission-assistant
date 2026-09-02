import { config } from 'dotenv';
config({ path: '.env' });

import { aiOrchestratorService } from '../src/modules/ai/ai-orchestrator.service';
import { groqProvider } from '../src/modules/ai/providers/groq.provider';
import { geminiProvider } from '../src/modules/ai/providers/gemini.provider';
import { huggingFaceProvider } from '../src/modules/ai/providers/huggingface.provider';
import { generateEmbedding, generateEmbeddings } from '../src/ai/embeddings';

async function testAiPipeline() {
  console.log('====================================================');
  console.log('   Testing EduGuide AI Pipeline (Groq + Gemini + HF) ');
  console.log('====================================================');

  console.log('Gemini Configured:', geminiProvider.isConfigured());
  console.log('Groq Configured:', groqProvider.isConfigured());
  console.log('Hugging Face Configured:', huggingFaceProvider.isConfigured());

  // Test 1: Direct Groq Chat Test
  if (groqProvider.isConfigured()) {
    console.log('\n[1] Testing Groq Chat Provider directly...');
    try {
      const groqRes = await groqProvider.generateStructuredResponse(
        'What are the eligibility requirements for BUET CSE?',
        'You are an expert admission advisor. Answer with JSON object containing summary and recommendedNextActions.'
      );
      console.log('✓ Groq Response received successfully:');
      console.log(JSON.stringify(groqRes, null, 2));
    } catch (err: any) {
      console.error('✗ Groq test failed:', err.message || err);
    }
  } else {
    console.log('\n[1] GROQ_API_KEY is not set in .env');
  }

  // Test 2: Embeddings Pipeline (Gemini Primary -> HF Fallback)
  console.log('\n[2] Testing Unified Embedding Pipeline (Gemini Primary / HF Fallback)...');
  try {
    const start = Date.now();
    const vec = await generateEmbedding('বুয়েট ভর্তি পরীক্ষা ২০২৩-২৪ যোগ্যতা এবং সিলেবাস');
    console.log(`✓ Embedding generated successfully in ${Date.now() - start}ms (Dimension: ${vec.length})`);
    console.log(`  Sample values: [${vec.slice(0, 5).map((v) => v.toFixed(4)).join(', ')}...]`);
  } catch (err: any) {
    console.error('✗ Embedding test failed:', err.message || err);
  }

  // Test 3: AI Orchestrator with Greeting ("hi")
  console.log('\n[3] Testing AI Orchestrator Service with greeting ("hi")...');
  try {
    const greetingResult = await aiOrchestratorService.processQuery({
      roleType: 'advisor',
      userQuery: 'hi',
    });
    console.log('✓ AI Orchestrator Greeting Result:');
    console.log(JSON.stringify(greetingResult, null, 2));
  } catch (err: any) {
    console.error('✗ Greeting test failed:', err.message || err);
  }

  // Test 4: AI Orchestrator with RAG Context (Advisor Mode)
  console.log('\n[4] Testing AI Orchestrator Service (Advisor Mode via Groq)...');
  try {
    const result = await aiOrchestratorService.processQuery({
      roleType: 'advisor',
      userQuery: 'BUET admission requirement for science group',
      studentContext: {
        primaryGoal: 'BUET CSE',
        sscGpa: 5.0,
        hscGpa: 5.0,
        academicGroup: 'Science',
      },
    });
    console.log('✓ AI Orchestrator Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error('✗ Orchestrator test failed:', err.message || err);
  }

  console.log('\n====================================================');
  console.log('AI Pipeline Test Complete!');
  console.log('====================================================');
}

testAiPipeline().catch(console.error);

