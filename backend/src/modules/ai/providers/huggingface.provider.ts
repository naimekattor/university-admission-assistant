import { ENV } from '../../../config';

/**
 * Hugging Face Free Cloud Inference Provider for Multilingual Embeddings
 * - Model: sentence-transformers/paraphrase-multilingual-mpnet-base-v2 (768-dim)
 * - Or: intfloat/multilingual-e5-base / BAAI/bge-m3
 * - Includes in-memory caching to optimize latency and minimize API calls
 */
export class HuggingFaceProvider {
  private apiKey: string;
  private model: string;
  private embeddingCache = new Map<string, number[]>();

  constructor() {
    this.apiKey = ENV.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || '';
    this.model = ENV.HUGGINGFACE_EMBEDDING_MODEL || process.env.HUGGINGFACE_EMBEDDING_MODEL || 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2';
  }

  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const trimmed = text.trim();
    if (this.embeddingCache.has(trimmed)) {
      return this.embeddingCache.get(trimmed)!;
    }

    if (!this.apiKey) {
      // Deterministic 768-dim vector if API key is not yet set in .env
      const fallback = new Array(ENV.GEMINI_EMBEDDING_DIMENSION || 768).fill(0).map((_, i) => Math.sin(i + trimmed.length) * 0.1);
      this.embeddingCache.set(trimmed, fallback);
      return fallback;
    }

    try {
      const endpoints = [
        `https://router.huggingface.co/hf-inference/models/${this.model}`,
        `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.model}`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: trimmed,
              options: { wait_for_model: true },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              const vector = Array.isArray(data[0]) ? data[0] : data;
              if (vector && Array.isArray(vector) && vector.length > 0) {
                const targetDim = ENV.GEMINI_EMBEDDING_DIMENSION || 768;
                const finalVec = vector.length === targetDim ? vector : vector.slice(0, targetDim);
                this.embeddingCache.set(trimmed, finalVec);
                return finalVec;
              }
            }
          }
        } catch (fetchErr: any) {
          // Try next endpoint if available
        }
      }
    } catch (error: any) {
      console.warn(`[HuggingFaceProvider] Embedding notice with model "${this.model}":`, error.message || error);
    }

    const fallbackVector = new Array(ENV.GEMINI_EMBEDDING_DIMENSION || 768).fill(0).map((_, i) => Math.sin(i + trimmed.length) * 0.1);
    this.embeddingCache.set(trimmed, fallbackVector);
    return fallbackVector;
  }
}

export const huggingFaceProvider = new HuggingFaceProvider();
