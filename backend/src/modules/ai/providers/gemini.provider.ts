import { GoogleGenAI } from '@google/genai';
import { ENV } from '../../../config';

export class GeminiProvider {
  private client: GoogleGenAI | null = null;
  private embeddingCache = new Map<string, number[]>();
  private lastEmbeddingTimestamp = 0;
  private embeddingQueue: Promise<any> = Promise.resolve();
  // Free tier is max 15 RPM. 4300ms spacing enforces max ~13-14 RPM safely.
  private readonly MIN_REQUEST_INTERVAL_MS = 4300;

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

  /**
   * Rate-limited embedding generation with queue pacing and exponential retry.
   * Throws if failed after retries so the caller can switch to Hugging Face fallback.
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    const trimmed = text.trim();
    if (!trimmed) {
      return new Array(ENV.GEMINI_EMBEDDING_DIMENSION).fill(0);
    }

    // 1. Return from in-memory cache if available (0 rate-limit cost)
    if (this.embeddingCache.has(trimmed)) {
      return this.embeddingCache.get(trimmed)!;
    }

    if (!this.client) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // 2. Enqueue through serialized rate-limiter queue to prevent concurrency spikes
    return new Promise<number[]>((resolve, reject) => {
      this.embeddingQueue = this.embeddingQueue
        .then(async () => {
          try {
            const vector = await this.executeRateLimitedEmbeddingWithRetry(trimmed);
            this.embeddingCache.set(trimmed, vector);
            resolve(vector);
          } catch (err) {
            reject(err);
          }
        })
        .catch(() => {
          // Keep queue chain unbroken on individual item error
        });
    });
  }

  private async executeRateLimitedEmbeddingWithRetry(text: string, maxRetries = 2): Promise<number[]> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Enforce rate-limit interval
      const now = Date.now();
      const elapsed = now - this.lastEmbeddingTimestamp;
      if (elapsed < this.MIN_REQUEST_INTERVAL_MS) {
        const waitTime = this.MIN_REQUEST_INTERVAL_MS - elapsed;
        await new Promise((r) => setTimeout(r, waitTime));
      }
      this.lastEmbeddingTimestamp = Date.now();

      try {
        const response: any = await this.client!.models.embedContent({
          model: ENV.GEMINI_EMBEDDING_MODEL,
          contents: text,
          config: {
            outputDimensionality: ENV.GEMINI_EMBEDDING_DIMENSION,
          },
        });

        const values = response?.embedding?.values || response?.embeddings?.[0]?.values;
        if (values && Array.isArray(values) && values.length > 0) {
          const finalVector = values.length === ENV.GEMINI_EMBEDDING_DIMENSION ? values : values.slice(0, ENV.GEMINI_EMBEDDING_DIMENSION);
          return finalVector;
        }

        throw new Error('Gemini API returned empty embedding values');
      } catch (error: any) {
        const isRateLimit =
          error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.includes('RESOURCE_EXHAUSTED') ||
          error?.message?.includes('Quota exceeded');

        if (isRateLimit && attempt < maxRetries) {
          const backoff = (attempt + 1) * 3500 + Math.floor(Math.random() * 1000);
          console.warn(`[GeminiProvider] ⏳ Rate limit reached (429). Retrying in ${backoff}ms (Attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }

        console.warn(`[GeminiProvider] Gemini embedding failed: ${error.message || error}`);
        throw error;
      }
    }

    throw new Error(`Gemini embedding exhausted ${maxRetries + 1} attempts`);
  }
}

export const geminiProvider = new GeminiProvider();
