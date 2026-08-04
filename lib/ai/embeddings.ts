const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Try primary Ollama endpoint /api/embed
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.embeddings && data.embeddings.length > 0) {
        return data.embeddings[0];
      }
    }

    // Secondary fallback for older Ollama versions (/api/embeddings)
    const fallbackRes = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
    });

    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data.embedding) {
        return data.embedding;
      }
    }

    throw new Error(`Ollama embedding API error (${res.status}: ${res.statusText})`);
  } catch (err: any) {
    console.error(`[Embedding Generator] Error generating embedding with model "${EMBEDDING_MODEL}":`, err.message || err);
    throw err;
  }
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
