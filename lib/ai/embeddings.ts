const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = 'nomic-embed-text';

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!res.ok) throw new Error(`Embedding API error: ${res.statusText}`);
  const data = await res.json();
  return data.embeddings[0];
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Embedding API error: ${res.statusText}`);
  const data = await res.json();
  return data.embeddings;
}

export const EMBEDDING_DIMENSION = 768;
