import { geminiProvider } from '../modules/ai/providers/gemini.provider';
import { huggingFaceProvider } from '../modules/ai/providers/huggingface.provider';
import { ENV } from '../config';

export const EMBEDDING_DIMENSION = ENV.GEMINI_EMBEDDING_DIMENSION || 768;

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || process.env.EMBEDDING_MODEL || 'bge-m3';

/**
 * Generate high-quality Bengali/English vector embeddings using:
 * 1. Primary: Google Gemini (`gemini-embedding-001` - 768 dimensions) with rate limiting & auto-retry
 * 2. Fallback: Hugging Face Cloud Inference (`sentence-transformers/paraphrase-multilingual-mpnet-base-v2` - 768 dimensions)
 * 3. Fallback: Local Offline Ollama (`BAAI/bge-m3`)
 * 4. Deterministic 768-dim pseudo vector for offline testing
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    return new Array(EMBEDDING_DIMENSION).fill(0);
  }

  const provider = (ENV.EMBEDDING_PROVIDER || process.env.EMBEDDING_PROVIDER || 'gemini').toLowerCase();

  // -------------------------------------------------------------
  // Strategy 1: Google Gemini (Primary with Rate Limiting & Queue)
  // -------------------------------------------------------------
  if (provider === 'gemini' || provider === 'google' || provider === 'auto') {
    if (geminiProvider.isConfigured()) {
      try {
        const emb = await geminiProvider.generateEmbedding(trimmed);
        if (emb && Array.isArray(emb) && emb.length > 0) {
          return emb;
        }
      } catch (geminiErr: any) {
        console.warn(`[Embeddings] Gemini embedding failed/rate-limited: ${geminiErr.message || geminiErr}. Switching to Hugging Face fallback...`);
      }
    }
  }

  // -------------------------------------------------------------
  // Strategy 2: Hugging Face Inference API (Fallback)
  // -------------------------------------------------------------
  if (huggingFaceProvider.isConfigured()) {
    try {
      const emb = await huggingFaceProvider.generateEmbedding(trimmed);
      if (emb && Array.isArray(emb) && emb.length > 0) {
        return emb;
      }
    } catch (hfErr: any) {
      console.warn(`[Embeddings] Hugging Face fallback failed: ${hfErr.message || hfErr}. Trying Ollama...`);
    }
  }

  // -------------------------------------------------------------
  // Strategy 3: BAAI/bge-m3 via Local Ollama (Free, 100% Offline)
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_EMBEDDING_MODEL, input: trimmed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.embeddings && data.embeddings.length > 0) {
        return data.embeddings[0];
      }
    }

    // Fallback for older Ollama /api/embeddings endpoint
    const fallbackRes = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_EMBEDDING_MODEL, prompt: trimmed }),
    });

    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data.embedding) {
        return data.embedding;
      }
    }
  } catch {
    // Ollama not running
  }

  // -------------------------------------------------------------
  // Strategy 4: Deterministic 768-dim pseudo vector for offline testing
  // -------------------------------------------------------------
  return new Array(EMBEDDING_DIMENSION).fill(0).map((_, i) => Math.sin(i + trimmed.length) * 0.1);
}

/**
 * Sequential batch embedding generator with progress reporting and rate pacing.
 */
export async function generateEmbeddings(
  texts: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<number[][]> {
  const embeddings: number[][] = [];
  const total = texts.length;

  for (let i = 0; i < texts.length; i++) {
    const emb = await generateEmbedding(texts[i]);
    embeddings.push(emb);
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }
  return embeddings;
}

