import Groq from 'groq-sdk';
import { ENV } from '../../../config';

export class GroqProvider {
  private client: Groq | null = null;
  private model: string;

  constructor() {
    const apiKey = ENV.GROQ_API_KEY || process.env.GROQ_API_KEY || '';
    this.model = ENV.GROQ_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    if (apiKey) {
      this.client = new Groq({ apiKey });
    }
  }

  public isConfigured(): boolean {
    return !!this.client;
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.client) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    try {
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.3,
        max_tokens: 2048,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('[GroqProvider] generateText error:', error.message || error);
      throw error;
    }
  }

  public async generateStructuredResponse(
    prompt: string,
    systemInstruction?: string
  ): Promise<Record<string, any>> {
    if (!this.client) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const messages: any[] = [];
    const systemPrompt = (systemInstruction ? systemInstruction + '\n\n' : '') +
      'CRITICAL: Return a valid JSON object matching the requested schema. Provide clear, accurate admission guidance in Bangla or English.';

    messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    try {
      // First attempt with json_object response format
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 2048,
      });

      const raw = (completion.choices[0]?.message?.content || '{}').trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(raw);
    } catch (jsonErr) {
      // Fallback attempt with standard text completion + JSON regex extraction
      try {
        const fallbackCompletion = await this.client.chat.completions.create({
          model: this.model,
          messages,
          temperature: 0.2,
          max_tokens: 2048,
        });

        const text = fallbackCompletion.choices[0]?.message?.content || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
        return {
          type: 'general_answer',
          summary: text,
          sections: [{ heading: 'Guidance', content: text }],
        };
      } catch (err: any) {
        console.error('[GroqProvider] Structured fallback failed:', err.message || err);
        throw err;
      }
    }
  }
}

export const groqProvider = new GroqProvider();
