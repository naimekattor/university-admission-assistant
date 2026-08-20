import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';

async function initPostgres() {
  console.log('Connecting to PostgreSQL...');
  // Connect to default 'postgres' database first to ensure admission_db exists
  const rootClient = new pg.Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres',
  });

  try {
    await rootClient.connect();
    console.log('✓ Connected to PostgreSQL root server.');

    const checkDb = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'admission_db'"
    );
    if (checkDb.rowCount === 0) {
      console.log('Creating database admission_db...');
      await rootClient.query('CREATE DATABASE admission_db');
      console.log('✓ Created database admission_db.');
    } else {
      console.log('✓ Database admission_db already exists.');
    }
    await rootClient.end();

    // Now connect to admission_db to enable pgvector and create tables
    const appClient = new pg.Client({
      connectionString: 'postgresql://postgres:postgres@localhost:5432/admission_db',
    });
    await appClient.connect();
    console.log('✓ Connected to admission_db.');

    console.log('Enabling vector extension...');
    await appClient.query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('✓ pgvector extension enabled.');

    console.log('Creating document_chunks table...');
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id VARCHAR(128) PRIMARY KEY,
        university VARCHAR(128),
        unit VARCHAR(128),
        year INT,
        source VARCHAR(255) NOT NULL,
        page INT DEFAULT 1,
        content TEXT NOT NULL,
        content_type VARCHAR(64) DEFAULT 'circular',
        embedding vector(768),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ document_chunks table verified.');

    await appClient.end();
    console.log('==============================================');
    console.log('PostgreSQL + pgvector successfully initialized!');
    console.log('==============================================');
  } catch (err: any) {
    console.error('Initialization error:', err.message || err);
  }
}

initPostgres().catch(console.error);
