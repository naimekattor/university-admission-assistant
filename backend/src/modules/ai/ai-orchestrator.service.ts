import { geminiProvider } from './providers/gemini.provider';
import { groqProvider } from './providers/groq.provider';
import { StructuredAiResponse } from './schemas/ai-response.schemas';
import { ragService } from '../rag/rag.service';
import { ENV } from '../../config';

export type AiRoleType = 'advisor' | 'tutor';

export interface AiOrchestratorRequest {
  roleType: AiRoleType;
  userQuery: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  studentContext?: {
    primaryGoal?: string;
    sscGpa?: number;
    hscGpa?: number;
    academicGroup?: string;
    weakTopics?: string[];
  };
}

export class AiOrchestratorService {
  public async processQuery(request: AiOrchestratorRequest): Promise<StructuredAiResponse> {
    const { roleType, userQuery, studentContext } = request;

    // 1. Perform filtered semantic RAG search in PostgreSQL pgvector
    let ragContextText = '';
    try {
      const ragDocs = await ragService.searchDocuments({
        query: userQuery,
        limit: 5,
      });
      ragContextText = ragService.formatContextForPrompt(ragDocs);
    } catch {
      // RAG offline fallback
    }

    // 2. Build specialized System Prompt based on role (Advisor vs Tutor)
    const systemPrompt = this.buildSystemPrompt(roleType, studentContext, ragContextText);

    // 3. Request structured JSON response with provider preference (Groq primary / Gemini fallback or vice versa)
    let rawAiResult: Record<string, any> | null = null;
    const preferGroq = ENV.AI_PROVIDER === 'groq' || (groqProvider.isConfigured() && ENV.AI_PROVIDER !== 'gemini');

    if (preferGroq && groqProvider.isConfigured()) {
      try {
        console.log(`[AiOrchestrator] Executing primary Groq query (${ENV.GROQ_MODEL})...`);
        rawAiResult = await groqProvider.generateStructuredResponse(userQuery, systemPrompt);
      } catch (groqError: any) {
        console.warn('[AiOrchestrator] Groq primary failed, switching to Gemini fallback:', groqError.message || groqError);
      }
    }

    if (!rawAiResult && geminiProvider.isConfigured()) {
      try {
        console.log(`[AiOrchestrator] Executing Gemini query (${ENV.GEMINI_CHAT_MODEL})...`);
        rawAiResult = await geminiProvider.generateStructuredResponse(userQuery, systemPrompt);
      } catch (geminiError: any) {
        console.warn('[AiOrchestrator] Gemini failed:', geminiError.message || geminiError);
      }
    }

    if (!rawAiResult && !preferGroq && groqProvider.isConfigured()) {
      try {
        console.log('[AiOrchestrator] Executing Groq fallback query...');
        rawAiResult = await groqProvider.generateStructuredResponse(userQuery, systemPrompt);
      } catch (groqError: any) {
        console.error('[AiOrchestrator] Groq fallback failed:', groqError.message || groqError);
      }
    }

    // 4. Validate or normalize structured response
    return this.normalizeStructuredResult(rawAiResult || {}, userQuery, roleType);
  }

  private buildSystemPrompt(roleType: AiRoleType, studentContext?: any, ragContextText?: string): string {
    const isTutor = roleType === 'tutor';

    let prompt = isTutor
      ? `You are an expert AI Admission Tutor for Bangladeshi HSC students preparing for BUET, DU, Medical, and Engineering admission tests.
Your goal is to explain difficult subject concepts (Physics, Chemistry, Math, Biology), solve problems step-by-step, derive equations clearly, analyze student mistakes, and recommend practice drills.`
      : `You are an expert AI Admission Advisor for Bangladeshi university admissions.
Your goal is to help students explore universities, check eligibility requirements, compare degree programs, track circular deadlines, and understand seat breakdowns.`;

    prompt += `\n\nCRITICAL CONSTRAINTS:
- Write strictly in BANGLA (বাংলা), ENGLISH, or natural BANGLISH matching the user's prompt language.
- DO NOT invent or fabricate eligibility GPA cutoffs, dates, application fees, or seat numbers.
- Base university and circular answers STRICTLY on the retrieved context provided below.`;

    if (studentContext) {
      prompt += `\n\nSTUDENT PROFILE CONTEXT:
Target Goal: ${studentContext.primaryGoal || 'General Admission'}
SSC GPA: ${studentContext.sscGpa || 'N/A'} | HSC GPA: ${studentContext.hscGpa || 'N/A'}
Group: ${studentContext.academicGroup || 'Science'}
Identified Weak Topics: ${(studentContext.weakTopics || []).join(', ') || 'None'}`;
    }

    if (ragContextText) {
      prompt += `\n\nOFFICIAL ADMISSION KNOWLEDGE & CIRCULAR CONTEXT:\n${ragContextText}`;
    }

    return prompt;
  }

  private normalizeStructuredResult(raw: Record<string, any>, userQuery: string, roleType: AiRoleType): StructuredAiResponse {
    if (raw && raw.type) {
      return raw as StructuredAiResponse;
    }

    if (roleType === 'tutor') {
      return {
        type: 'question_explanation',
        questionText: userQuery,
        correctAnswer: raw.correctAnswer || 'Step-by-step solution available.',
        stepByStepSolution: Array.isArray(raw.steps) ? raw.steps : [
          'Identify the fundamental physical/mathematical principle involved.',
          'Apply the standard formula and derive the required parameter.',
          'Double check calculation units and boundary conditions.',
        ],
        commonMistakesToAvoid: ['Watch out for SI unit conversions (cm to m, minutes to seconds).'],
        recommendedNextActions: [{ label: 'Practice Similar MCQs', action: 'practice_topic' }],
      };
    }

    return {
      type: 'general_answer',
      summary: raw.summary || `Analysis complete for: "${userQuery}".`,
      sections: Array.isArray(raw.sections) ? raw.sections : [
        { heading: 'Overview', content: 'Here is the relevant university admission and preparation guidance.' },
      ],
      recommendedNextActions: [
        { label: 'Check Eligibility', action: 'check_eligibility' },
        { label: 'Start Chapter Practice', action: 'start_practice' },
      ],
    };
  }
}

export const aiOrchestratorService = new AiOrchestratorService();
