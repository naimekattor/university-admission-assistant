import { QdrantClient } from '@qdrant/js-client-rest';
import { generateEmbedding, EMBEDDING_DIMENSION } from '../ai/embeddings';

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_PREFIX = process.env.QDRANT_COLLECTION_PREFIX || 'uaa_';

export const UNIVERSITY_COLLECTION = process.env.QDRANT_UNIVERSITY_COLLECTION || `${COLLECTION_PREFIX}university-embeddings`;
export const PROGRAM_COLLECTION = process.env.QDRANT_PROGRAM_COLLECTION || `${COLLECTION_PREFIX}program-embeddings`;
export const ADMISSION_DOCS_COLLECTION = process.env.QDRANT_ADMISSION_DOCS_COLLECTION || `${COLLECTION_PREFIX}admission-docs`;

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
    console.log(`[RAG Search] Generating embedding for query: "${queryText}"`);
    const vector = await generateEmbedding(queryText);
    console.log(`[RAG Search] Searching Qdrant collection "${ADMISSION_DOCS_COLLECTION}"...`);
    const result = await qdrantClient.search(ADMISSION_DOCS_COLLECTION, {
      vector,
      limit,
      with_payload: true,
    });
    console.log(`[RAG Search] Qdrant returned ${result.length} matching document chunk(s).`);
    return result;
  } catch (error) {
    console.error('[RAG Search] Error searching documents:', error);
    return [];
  }
}

export async function listAllDocuments(limit = 200) {
  try {
    await ensureCollection(ADMISSION_DOCS_COLLECTION);
    const scrollResult = await qdrantClient.scroll(ADMISSION_DOCS_COLLECTION, {
      limit,
      with_payload: true,
      with_vector: false,
    });
    return scrollResult.points || [];
  } catch (error) {
    console.error('[Qdrant] Error listing documents:', error);
    return [];
  }
}

export async function deleteDocumentPoints(pointIds: string[]) {
  try {
    if (!pointIds || pointIds.length === 0) return { success: true, count: 0 };
    await qdrantClient.delete(ADMISSION_DOCS_COLLECTION, {
      points: pointIds,
    });
    return { success: true, count: pointIds.length };
  } catch (error) {
    console.error('[Qdrant] Error deleting document points:', error);
    throw error;
  }
}

