import { config } from 'dotenv';
config({ path: '.env' });

import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

const legacyCollections = [
  'admission-docs',
  'university-embeddings',
  'program-embeddings',
];

async function cleanLegacyCollections() {
  const qdrant = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
  });

  console.log('Checking Qdrant legacy collections...');
  try {
    const response = await qdrant.getCollections();
    const existing = new Set(response.collections.map((c) => c.name));

    for (const name of legacyCollections) {
      if (existing.has(name)) {
        await qdrant.deleteCollection(name);
        console.log(`Deleted legacy collection: ${name}`);
      } else {
        console.log(`Legacy collection not found (already clean): ${name}`);
      }
    }
    console.log('Cleanup finished.');
  } catch (err) {
    console.error('Failed to clean legacy collections:', err);
  }
}

cleanLegacyCollections();
