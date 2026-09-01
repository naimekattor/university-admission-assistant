import { config } from 'dotenv';
config({ path: '.env' });

import { aiOrchestratorService } from '../src/modules/ai/ai-orchestrator.service';
import { groqProvider } from '../src/modules/ai/providers/groq.provider';
import { geminiProvider } from '../src/modules/ai/providers/gemini.provider';

async function testAiPipeline() {
  console.log('==============================================');
  console.log('Testing EduGuide AI Pipeline (Gemini + Groq)');
  console.log('==============================================');

  console.log('Gemini Configured:', geminiProvider.isConfigured());
  console.log('Groq Configured:', groqProvider.isConfigured());

  // Test 1: Direct Groq Test (if key available)
  if (groqProvider.isConfigured()) {
    console.log('\n[1] Testing Groq Provider directly...');
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
    console.log('\n[1] GROQ_API_KEY is not set yet in .env');
  }

  // Test 2: AI Orchestrator with RAG Context + Fallback
  console.log('\n[2] Testing AI Orchestrator Service (Advisor Mode)...');
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

  // Test 3: AI Tutor Mode
  console.log('\n[3] Testing AI Orchestrator Service (Tutor Mode)...');
  try {
    const tutorResult = await aiOrchestratorService.processQuery({
      roleType: 'tutor',
      userQuery: "Explain Newton's second law momentum formula J = F * dt",
      studentContext: {
        primaryGoal: 'BUET CSE',
        weakTopics: ["Newton's Mechanics"],
      },
    });
    console.log('✓ AI Tutor Result:');
    console.log(JSON.stringify(tutorResult, null, 2));
  } catch (err: any) {
    console.error('✗ Tutor test failed:', err.message || err);
  }

  console.log('\n==============================================');
  console.log('AI Pipeline Test Complete!');
  console.log('==============================================');
}

testAiPipeline().catch(console.error);
