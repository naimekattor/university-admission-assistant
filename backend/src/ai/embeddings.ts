import { GoogleGenAI } from '@google/genai';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || process.env.EMBEDDING_MODEL || 'bge-m3';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const EMBEDDING_PROVIDER = (process.env.EMBEDDING_PROVIDER || 'auto').toLowerCase();

/**
 * Generate high-quality Bengali/English vector embeddings using:
 * 1. Google Gemini Free Tier (`gemini-embedding-001` - 768 dimensions)
 * 2. Local Free via Ollama (`BAAI/bge-m3` - Multilingual State-of-the-Art)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Strategy A: Google Gemini gemini-embedding-001 (Free Tier)
  if ((EMBEDDING_PROVIDER === 'google' || EMBEDDING_PROVIDER === 'gemini' || EMBEDDING_PROVIDER === 'auto') && GEMINI_API_KEY) {
    try {
      const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response: any = await genai.models.embedContent({
        model: GEMINI_EMBEDDING_MODEL,
        contents: text,
        config: {
          outputDimensionality: EMBEDDING_DIMENSION,
        },
      });

      const values = response?.embedding?.values || response?.embeddings?.[0]?.values;
      if (values && Array.isArray(values) && values.length > 0) {
        if (values.length === EMBEDDING_DIMENSION) {
          return values;
        }
        return values.slice(0, EMBEDDING_DIMENSION);
      }
    } catch (googleErr: any) {
      console.warn(`[Embeddings] Google ${GEMINI_EMBEDDING_MODEL} failed, falling back to local BAAI/bge-m3:`, googleErr.message || googleErr);
    }
  }

  // Strategy B: BAAI/bge-m3 via Local Ollama (Free, 100% Offline)
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_EMBEDDING_MODEL, input: text }),
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
      body: JSON.stringify({ model: OLLAMA_EMBEDDING_MODEL, prompt: text }),
    });

    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data.embedding) {
        return data.embedding;
      }
    }
  } catch (ollamaErr: any) {
    console.warn(`[Embeddings] Ollama (${OLLAMA_EMBEDDING_MODEL}) embedding failed:`, ollamaErr.message || ollamaErr);
  }

  // Deterministic 768-dim pseudo vector for offline testing
  return new Array(EMBEDDING_DIMENSION).fill(0).map((_, i) => Math.sin(i + text.length) * 0.1);
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const t of texts) {
    const emb = await generateEmbedding(t);
    embeddings.push(emb);
  }
  return embeddings;
}

export const EMBEDDING_DIMENSION = 768;
