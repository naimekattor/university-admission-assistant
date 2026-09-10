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

  public async *streamQuery(
    request: AiOrchestratorRequest
  ): AsyncGenerator<string, { structured: StructuredAiResponse; fullText: string }, unknown> {
    const { roleType, userQuery, studentContext } = request;

    // 1. Perform semantic RAG search in pgvector
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

    // 2. Build specialized System Prompt
    const systemPrompt = this.buildSystemPrompt(roleType, studentContext, ragContextText);

    // 3. Stream real tokens if Groq is available
    let accumulatedText = '';
    if (groqProvider.isConfigured()) {
      try {
        for await (const token of groqProvider.streamText(userQuery, systemPrompt)) {
          accumulatedText += token;
          yield token;
        }
      } catch (err: any) {
        console.warn('[AiOrchestrator] Groq live streaming error, falling back:', err.message || err);
      }
    }

    // If streaming failed or wasn't configured, fall back to processQuery and yield chunks progressively
    if (!accumulatedText) {
      const structured = await this.processQuery(request);
      const textToYield =
        structured && typeof structured === 'object' && 'summary' in structured && typeof structured.summary === 'string'
          ? structured.summary
          : JSON.stringify(structured);
      const words = textToYield.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const chunk = (i > 0 ? ' ' : '') + words.slice(i, i + 3).join(' ');
        accumulatedText += chunk;
        yield chunk;
      }
      return { structured, fullText: accumulatedText };
    }

    // Try parsing accumulated JSON if returned structured, or normalize standard answer
    let parsed: any = null;
    try {
      const cleaned = accumulatedText.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    } catch {}

    const structured = this.normalizeStructuredResult(parsed || { summary: accumulatedText }, userQuery, roleType);
    return { structured, fullText: accumulatedText };
  }

  private buildSystemPrompt(roleType: AiRoleType, studentContext?: any, ragContextText?: string): string {
    const isTutor = roleType === 'tutor';

    let prompt = isTutor
      ? `You are an expert AI Admission Tutor for Bangladeshi HSC students preparing for BUET, DU, Medical, and Engineering admission tests.
Your goal is to explain difficult subject concepts (Physics, Chemistry, Math, Biology), solve problems step-by-step, derive equations clearly, analyze student mistakes, and recommend practice drills.`
      : `You are an expert AI Admission Advisor for Bangladeshi university admissions.
Your goal is to help students explore universities, check eligibility requirements, compare degree programs, track circular deadlines, and understand seat breakdowns.`;

    prompt += `\n\nRESPONSE FORMAT INSTRUCTIONS:
You MUST respond with a valid JSON object matching one of these structures:
For Advisor inquiries or general questions:
{
  "type": "general_answer",
  "summary": "Detailed, friendly, and complete answer in the language of the prompt (Bangla / English / Banglish). If user says 'hi' or greeting, warmly introduce yourself and explain how you can help them prepare for BUET, DU, Medical, GST admission.",
  "sections": [
    { "heading": "Key Information", "content": "Relevant guidelines, circular points, or actionable advice." }
  ],
  "recommendedNextActions": [
    { "label": "Check Eligibility", "action": "check_eligibility" },
    { "label": "Start Preparation", "action": "start_practice" }
  ]
}`;

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
    if (raw && raw.type && (raw.summary || raw.correctAnswer || raw.stepByStepSolution)) {
      return raw as StructuredAiResponse;
    }

    if (roleType === 'tutor') {
      return {
        type: 'question_explanation',
        questionText: userQuery,
        correctAnswer: raw.correctAnswer || raw.answer || 'Step-by-step solution available.',
        stepByStepSolution: Array.isArray(raw.stepByStepSolution || raw.steps)
          ? (raw.stepByStepSolution || raw.steps)
          : [raw.summary || 'Fundamental principle applied to solve the problem.'],
        commonMistakesToAvoid: Array.isArray(raw.commonMistakesToAvoid)
          ? raw.commonMistakesToAvoid
          : ['Pay close attention to unit conversions and standard formulas.'],
        recommendedNextActions: Array.isArray(raw.recommendedNextActions)
          ? raw.recommendedNextActions
          : [{ label: 'Practice Similar MCQs', action: 'practice_topic' }],
      };
    }

    const summaryText =
      raw.summary ||
      raw.content ||
      raw.message ||
      raw.text ||
      (typeof raw === 'string' ? raw : `Hello! How can I help you with university admission preparation today?`);

    const sections = Array.isArray(raw.sections) && raw.sections.length > 0
      ? raw.sections
      : undefined;

    return {
      type: 'general_answer',
      summary: summaryText,
      sections,
      recommendedNextActions: Array.isArray(raw.recommendedNextActions) && raw.recommendedNextActions.length > 0
        ? raw.recommendedNextActions
        : [
            { label: 'Check Eligibility', action: 'check_eligibility' },
            { label: 'Start Chapter Practice', action: 'start_practice' },
          ],
    };
  }
}

export const aiOrchestratorService = new AiOrchestratorService();
