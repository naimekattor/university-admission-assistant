import { ENV } from '../../../config';

/**
 * Hugging Face Inference Provider for Multilingual Embeddings (Primary Fallback)
 * - Default Model: sentence-transformers/paraphrase-multilingual-mpnet-base-v2 (768-dim)
 * - Supported: BAAI/bge-m3, intfloat/multilingual-e5-base
 * - Includes in-memory caching to minimize external API calls
 */
export class HuggingFaceProvider {
  private embeddingCache = new Map<string, number[]>();

  private getApiKey(): string {
    return (
      ENV.HUGGINGFACE_API_KEY ||
      process.env.HUGGINGFACE_API_KEY ||
      process.env.HF_TOKEN ||
      ''
    ).trim();
  }

  private getModel(): string {
    return (
      ENV.HUGGINGFACE_EMBEDDING_MODEL ||
      process.env.HUGGINGFACE_EMBEDDING_MODEL ||
      'sentence-transformers/paraphrase-multilingual-mpnet-base-v2'
    ).trim();
  }

  public isConfigured(): boolean {
    return !!this.getApiKey();
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const trimmed = text.trim();
    if (!trimmed) {
      return new Array(ENV.GEMINI_EMBEDDING_DIMENSION || 768).fill(0);
    }

    if (this.embeddingCache.has(trimmed)) {
      return this.embeddingCache.get(trimmed)!;
    }

    const apiKey = this.getApiKey();
    const model = this.getModel();
    const targetDim = ENV.GEMINI_EMBEDDING_DIMENSION || 768;

    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY / HF_TOKEN is not configured in environment variables');
    }

    const endpoints = [
      `https://router.huggingface.co/hf-inference/models/${model}`,
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`,
    ];

    let lastError: any = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: trimmed,
            options: { wait_for_model: true },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let vector: number[] | null = null;

          if (Array.isArray(data)) {
            if (typeof data[0] === 'number') {
              vector = data as number[];
            } else if (Array.isArray(data[0]) && typeof data[0][0] === 'number') {
              // Mean pooling or first token vector if 2D array returned
              vector = data[0] as number[];
            }
          }

          if (vector && vector.length > 0) {
            const finalVec = vector.length === targetDim ? vector : vector.slice(0, targetDim);
            this.embeddingCache.set(trimmed, finalVec);
            return finalVec;
          }
        } else {
          const errorBody = await response.text();
          lastError = new Error(`HF API HTTP ${response.status}: ${errorBody}`);
        }
      } catch (fetchErr: any) {
        lastError = fetchErr;
      }
    }

    throw lastError || new Error(`Hugging Face inference failed for model "${model}"`);
  }
}

export const huggingFaceProvider = new HuggingFaceProvider();

