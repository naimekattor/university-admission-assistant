import { QdrantClient } from '@qdrant/js-client-rest';
import { generateEmbedding, EMBEDDING_DIMENSION } from '@/lib/ai/embeddings';

if (!process.env.QDRANT_URL) {
  throw new Error('QDRANT_URL environment variable is not set');
}

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const UNIVERSITY_COLLECTION = 'university-embeddings';
export const PROGRAM_COLLECTION = 'program-embeddings';
export const ADMISSION_DOCS_COLLECTION = 'admission-docs';

export async function ensureCollection(name: string) {
  const collections = await qdrantClient.getCollections();
  const exists = collections.collections.some(c => c.name === name);
  if (!exists) {
    await qdrantClient.createCollection(name, {
      vectors: { size: EMBEDDING_DIMENSION, distance: 'Cosine' },
    });
    console.log(`Created collection: ${name}`);
  }
}

export async function upsertUniversityEmbedding(
  id: string,
  vector: number[],
  payload: Record<string, unknown>,
) {
  await qdrantClient.upsert(UNIVERSITY_COLLECTION, {
    points: [{ id, vector, payload }],
  });
}

export async function upsertProgramEmbedding(
  id: string,
  vector: number[],
  payload: Record<string, unknown>,
) {
  await qdrantClient.upsert(PROGRAM_COLLECTION, {
    points: [{ id, vector, payload }],
  });
}

export async function upsertDocumentEmbedding(
  id: string,
  vector: number[],
  payload: Record<string, unknown>,
) {
  await qdrantClient.upsert(ADMISSION_DOCS_COLLECTION, {
    points: [{ id, vector, payload }],
  });
}

export async function searchUniversities(queryText: string, limit = 5) {
  try {
    const vector = await generateEmbedding(queryText);
    const result = await qdrantClient.search(UNIVERSITY_COLLECTION, {
      vector,
      limit,
      with_payload: true,
    });
    return result;
  } catch (error) {
    console.error('Error searching universities:', error);
    return [];
  }
}

export async function searchPrograms(queryText: string, limit = 5) {
  try {
    const vector = await generateEmbedding(queryText);
    const result = await qdrantClient.search(PROGRAM_COLLECTION, {
      vector,
      limit,
      with_payload: true,
    });
    return result;
  } catch (error) {
    console.error('Error searching programs:', error);
    return [];
  }
}

export async function searchDocuments(queryText: string, limit = 5) {
  try {
    const vector = await generateEmbedding(queryText);
    const result = await qdrantClient.search(ADMISSION_DOCS_COLLECTION, {
      vector,
      limit,
      with_payload: true,
    });
    return result;
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}
