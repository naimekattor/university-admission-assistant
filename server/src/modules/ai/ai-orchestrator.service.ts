import { geminiProvider } from './providers/gemini.provider';
import { StructuredAiResponse } from './schemas/ai-response.schemas';
import { ragService } from '../rag/rag.service';

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
    const ragDocs = await ragService.searchDocuments({
      query: userQuery,
      limit: 5,
    });
    const ragContextText = ragService.formatContextForPrompt(ragDocs);

    // 2. Build specialized System Prompt based on role (Advisor vs Tutor)
    const systemPrompt = this.buildSystemPrompt(roleType, studentContext, ragContextText);

    // 3. Request structured JSON response from Gemini Provider
    const rawAiResult = await geminiProvider.generateStructuredResponse(userQuery, systemPrompt);

    // 4. Validate or normalize structured response
    return this.normalizeStructuredResult(rawAiResult, userQuery, roleType);
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
      prompt += `\n\n${ragContextText}`;
    }

    prompt += `\n\nREQUIRED STRUCTURED OUTPUT:
Return ONLY a valid JSON object matching one of the supported types:
1. 'university_comparison'
2. 'eligibility_result'
3. 'study_plan'
4. 'question_explanation'
5. 'general_answer'`;

    return prompt;
  }

  private normalizeStructuredResult(rawResult: any, query: string, roleType: AiRoleType): StructuredAiResponse {
    if (rawResult && typeof rawResult === 'object' && rawResult.type) {
      return rawResult as StructuredAiResponse;
    }

    // Default fallback structured answer
    return {
      type: 'general_answer',
      summary: typeof rawResult === 'string' ? rawResult : 'Here is the relevant guidance for your query.',
      sections: [
        {
          heading: roleType === 'tutor' ? 'Tutor Problem Explanation' : 'Admission Guidance',
          content: typeof rawResult === 'object' ? JSON.stringify(rawResult, null, 2) : String(rawResult),
        },
      ],
      recommendedNextActions: [
        { label: 'Check My Eligibility', action: 'check_eligibility' },
        { label: 'Start Today\'s Practice', action: 'start_practice' },
      ],
    };
  }
}

export const aiOrchestratorService = new AiOrchestratorService();
