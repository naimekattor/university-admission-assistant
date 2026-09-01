import { GoogleGenAI } from '@google/genai';
import { ENV } from '../../../config';

export class GeminiProvider {
  private client: GoogleGenAI | null = null;

  constructor() {
    if (ENV.GEMINI_API_KEY) {
      this.client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
    }
  }

  public isConfigured(): boolean {
    return !!this.client;
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.client) {
      return 'Gemini API is not configured. Please set GEMINI_API_KEY in your environment configuration.';
    }

    try {
      const response = await this.client.models.generateContent({
        model: ENV.GEMINI_CHAT_MODEL,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      return response.text || '';
    } catch (error: any) {
      console.error('[GeminiProvider] generateText error:', error.message || error);
      throw error;
    }
  }

  public async generateStructuredResponse(
    prompt: string,
    systemInstruction?: string
  ): Promise<Record<string, any>> {
    if (!this.client) {
      return {
        type: 'general_answer',
        summary: 'Gemini API key is not configured. System is running in standard mode.',
        sections: [{ heading: 'Notice', content: 'Gemini API key configuration pending.' }],
        recommendedNextActions: [{ label: 'Explore Universities', action: 'explore_universities' }],
      };
    }

    try {
      const jsonPrompt = `${prompt}\n\nSTRICT REQUIREMENT: You MUST respond ONLY with a valid JSON object matching the required schema. Do NOT include markdown \`\`\`json backticks or extra text outside the JSON object.`;

      const response = await this.client.models.generateContent({
        model: ENV.GEMINI_CHAT_MODEL,
        contents: jsonPrompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
        },
      });

      const rawText = response.text?.trim() || '{}';
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.warn('[GeminiProvider] Structured JSON generation error, returning fallback JSON:', error.message || error);
      return {
        type: 'general_answer',
        summary: 'Direct response generated.',
        sections: [{ heading: 'Guidance', content: prompt }],
        recommendedNextActions: [{ label: 'Start Preparation', action: 'start_preparation' }],
      };
    }
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    if (!this.client) {
      // Deterministic 768-dim pseudo vector for dev mode without key
      return new Array(ENV.GEMINI_EMBEDDING_DIMENSION).fill(0).map((_, i) => Math.sin(i + text.length) * 0.1);
    }

    try {
      const response: any = await this.client.models.embedContent({
        model: ENV.GEMINI_EMBEDDING_MODEL,
        contents: text,
        config: {
          outputDimensionality: ENV.GEMINI_EMBEDDING_DIMENSION,
        },
      });

      const values = response?.embedding?.values || response?.embeddings?.[0]?.values;
      if (values && Array.isArray(values) && values.length > 0) {
        if (values.length === ENV.GEMINI_EMBEDDING_DIMENSION) {
          return values;
        }
        // If dimensionality differs, slice to expected dimension
        return values.slice(0, ENV.GEMINI_EMBEDDING_DIMENSION);
      }
    } catch (error: any) {
      console.warn(`[GeminiProvider] Embedding error with model "${ENV.GEMINI_EMBEDDING_MODEL}":`, error.message || error);
    }

    return new Array(ENV.GEMINI_EMBEDDING_DIMENSION).fill(0).map((_, i) => Math.sin(i + text.length) * 0.1);
  }
}

export const geminiProvider = new GeminiProvider();
