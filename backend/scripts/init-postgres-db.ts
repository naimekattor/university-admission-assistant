import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admission_db';

async function initPostgres() {
  console.log('--- Initializing PostgreSQL & pgvector for EduGuide ---');
  
  // Step 0: Ensure admission_db database exists
  try {
    const rootUrl = DATABASE_URL.replace(/\/admission_db(?:\?.*)?$/, '/postgres');
    const rootPool = new pg.Pool({ connectionString: rootUrl });
    const rootClient = await rootPool.connect();
    const dbCheck = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'admission_db'");
    if (dbCheck.rowCount === 0) {
      console.log('Database "admission_db" does not exist. Creating it now...');
      await rootClient.query('CREATE DATABASE admission_db');
      console.log('✓ Database "admission_db" created successfully.');
    }
    rootClient.release();
    await rootPool.end();
  } catch (dbErr: any) {
    console.log('ℹ Note during DB existence check:', dbErr.message);
  }

  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  try {
    const client = await pool.connect();
    console.log('✓ Connected to PostgreSQL database.');

    // 1. Enable pgvector extension
    console.log('Enabling vector extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('✓ pgvector extension enabled successfully.');

    // 2. Create document_chunks table matching Drizzle schema
    console.log('Creating/verifying document_chunks table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID,
        chunk_index INT NOT NULL DEFAULT 0,
        content TEXT NOT NULL,
        embedding vector(768),
        source TEXT NOT NULL,
        source_url TEXT,
        university TEXT,
        unit TEXT,
        subject TEXT,
        chapter TEXT,
        topic TEXT,
        year INT DEFAULT 2026,
        page INT DEFAULT 1,
        content_type TEXT DEFAULT 'circular',
        embedding_model TEXT DEFAULT 'gemini-embedding-001',
        embedding_dimension INT DEFAULT 768,
        embedding_version TEXT DEFAULT 'v1',
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ document_chunks table verified.');

    // 3. Create HNSW or IVFFlat vector index for ultra-fast cosine similarity search
    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS document_chunks_embedding_cosine_idx 
        ON document_chunks USING hnsw (embedding vector_cosine_ops);
      `);
      console.log('✓ Vector HNSW cosine index verified.');
    } catch (idxErr: any) {
      console.log('ℹ Note: HNSW index creation skipped (standard sequential vector scan active).');
    }

    client.release();
    await pool.end();

    console.log('======================================================');
    console.log('✓ PostgreSQL + pgvector is now fully ready for RAG!');
    console.log('Next step: run `pnpm run seed:pgvector` to populate embeddings.');
    console.log('======================================================');
  } catch (err: any) {
    console.error('PostgreSQL Initialization warning:', err.message || err);
  }
}

initPostgres().catch(console.error);
