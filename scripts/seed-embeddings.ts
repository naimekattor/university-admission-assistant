import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';
import { QdrantClient } from '@qdrant/js-client-rest';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = 'nomic-embed-text';
const EMBEDDING_DIMENSION = 768;

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const DATABASE_URL = process.env.DATABASE_URL!;

const COLLECTION_PREFIX = process.env.QDRANT_COLLECTION_PREFIX || 'uaa_';

const UNIVERSITY_COLLECTION = process.env.QDRANT_UNIVERSITY_COLLECTION || `${COLLECTION_PREFIX}university-embeddings`;
const PROGRAM_COLLECTION = process.env.QDRANT_PROGRAM_COLLECTION || `${COLLECTION_PREFIX}program-embeddings`;
const ADMISSION_DOCS_COLLECTION = process.env.QDRANT_ADMISSION_DOCS_COLLECTION || `${COLLECTION_PREFIX}admission-docs`;

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Embedding API error: ${res.statusText}`);
  const data = await res.json();
  return data.embeddings;
}

async function ensureCollection(client: QdrantClient, name: string) {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === name);
  if (!exists) {
    await client.createCollection(name, {
      vectors: { size: EMBEDDING_DIMENSION, distance: 'Cosine' },
    });
    console.log(`Created collection: ${name}`);
  }
}

function stringToUuid(str: string): string {
  const hash = require('crypto').createHash('md5').update(str).digest('hex');
  return `${hash.slice(0,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}-${hash.slice(16,20)}-${hash.slice(20,32)}`;
}

const mockDocumentChunks = [
  {
    id: 'buet-circ-2026-1',
    university: 'BUET',
    year: 2026,
    source: 'BUET_Admission_2026.pdf',
    page: 1,
    text: 'BUET admission for 2026 will be held in three phases. Phase 1: Application submission from November 2025 to December 2025. Phase 2: Admission test in January 2026. Phase 3: Merit list publication in February 2026.',
    type: 'circular',
  },
  {
    id: 'buet-circ-2026-2',
    university: 'BUET',
    year: 2026,
    source: 'BUET_Admission_2026.pdf',
    page: 2,
    text: 'Applicants must have a minimum HSC GPA of 4.5 for engineering programs. Science group students with physics, chemistry, and mathematics are eligible to apply.',
    type: 'circular',
  },
  {
    id: 'du-faq-1',
    university: 'DU',
    year: 2026,
    source: 'DU_FAQ_2026.pdf',
    page: 1,
    text: 'Q: How many times can I apply to DU? A: You can submit only one application per admission year. After the merit list is released, you cannot modify your application.',
    type: 'faq',
  },
  {
    id: 'du-faq-2',
    university: 'DU',
    year: 2026,
    source: 'DU_FAQ_2026.pdf',
    page: 1,
    text: 'Q: What documents do I need for admission? A: You need your SSC and HSC certificates, birth certificate, National ID, passport size photos, and medical report.',
    type: 'faq',
  },
  {
    id: 'kuet-prosp-1',
    university: 'KUET',
    year: 2026,
    source: 'KUET_Prospectus_2026.pdf',
    page: 3,
    text: 'KUET offers 12 departments including Electrical & Electronic Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, and Industrial & Production Engineering.',
    type: 'prospectus',
  },
  {
    id: 'ruet-prosp-1',
    university: 'RUET',
    year: 2026,
    source: 'RUET_Prospectus_2026.pdf',
    page: 5,
    text: 'RUET provides excellent infrastructure with modern laboratories, computer centers, and a well-stocked library. The campus is located in Khulna with on-campus hostel facilities.',
    type: 'prospectus',
  },
];

async function seedAdmissionDocs(client: QdrantClient) {
  console.log('Seeding admission documents...');
  const texts = mockDocumentChunks.map(d => d.text);
  const vectors = await generateEmbeddings(texts);

  const points = mockDocumentChunks.map((d, i) => ({
    id: stringToUuid(d.id),
    vector: vectors[i],
    payload: { ...d, originalId: d.id, id: stringToUuid(d.id) },
  }));

  await client.upsert(ADMISSION_DOCS_COLLECTION, { points });
  console.log(`Upserted ${points.length} document embeddings`);
}

async function seedUniversities(client: QdrantClient, pool: pg.Pool) {
  console.log('Seeding universities...');
  const result = await pool.query('SELECT * FROM universities');
  const unis = result.rows;
  if (unis.length === 0) {
    console.log('No universities found in DB. Skipping.');
    return;
  }

  const texts = unis.map(
    (u: any) =>
      `${u.name} (${u.short_name}): ${u.description}. Location: ${u.location}. Admission: ${u.admission_type}, cutoff: ${u.cutoff_marks}`
  );
  const vectors = await generateEmbeddings(texts);

  const points = unis.map((u: any, i: number) => ({
    id: u.id,
    vector: vectors[i],
    payload: {
      id: u.id,
      name: u.name,
      shortName: u.short_name,
      description: u.description,
      location: u.location,
      website: u.website,
      admissionType: u.admission_type,
      cutoffMarks: u.cutoff_marks,
    },
  }));

  await client.upsert(UNIVERSITY_COLLECTION, { points });
  console.log(`Upserted ${points.length} university embeddings`);
}

async function seedPrograms(client: QdrantClient, pool: pg.Pool) {
  console.log('Seeding programs...');
  const result = await pool.query('SELECT * FROM programs');
  const progs = result.rows;
  if (progs.length === 0) {
    console.log('No programs found in DB. Skipping.');
    return;
  }

  const texts = progs.map(
    (p: any) =>
      `${p.name}: ${p.description}. Duration: ${p.duration}, Seats: ${p.seats}, cutoff: ${p.cutoff_marks}`
  );
  const vectors = await generateEmbeddings(texts);

  const points = progs.map((p: any, i: number) => ({
    id: p.id,
    vector: vectors[i],
    payload: {
      id: p.id,
      universityId: p.university_id,
      name: p.name,
      description: p.description,
      duration: p.duration,
      seats: p.seats,
      cutoffMarks: p.cutoff_marks,
    },
  }));

  await client.upsert(PROGRAM_COLLECTION, { points });
  console.log(`Upserted ${points.length} program embeddings`);
}

async function main() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const qdrant = new QdrantClient({ url: QDRANT_URL });

  console.log('Ensuring Qdrant collections exist...');
  await ensureCollection(qdrant, UNIVERSITY_COLLECTION);
  await ensureCollection(qdrant, PROGRAM_COLLECTION);
  await ensureCollection(qdrant, ADMISSION_DOCS_COLLECTION);

  await seedAdmissionDocs(qdrant);
  await seedUniversities(qdrant, pool);
  await seedPrograms(qdrant, pool);

  await pool.end();
  console.log('Seed complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
