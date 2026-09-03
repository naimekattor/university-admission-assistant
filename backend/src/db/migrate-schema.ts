import { Pool } from 'pg';

/**
 * Ensures all required PostgreSQL tables and columns exist.
 * This runs on application startup to guarantee zero runtime missing-column errors
 * in environments like Render, Supabase, Neon, or local Docker.
 */
export async function autoMigrateDatabase(pool: Pool) {
  try {
    console.log('[Database Migration] Verifying PostgreSQL schema and columns...');

    // 1. Ensure uuid generation extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 2. Ensure universities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        short_name TEXT UNIQUE NOT NULL,
        description TEXT,
        location TEXT,
        website TEXT,
        logo TEXT,
        founded_year INT,
        admission_type TEXT,
        cutoff_marks INT,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      ALTER TABLE universities ADD COLUMN IF NOT EXISTS cutoff_marks INT;
      ALTER TABLE universities ADD COLUMN IF NOT EXISTS metadata JSONB;
      ALTER TABLE universities ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `);

    // 3. Ensure admission_circulars table and all newly added eligibility fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admission_circulars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        unit TEXT,
        unit_name TEXT,
        session TEXT DEFAULT '2025-2026',
        year INT NOT NULL DEFAULT 2026,
        "group" TEXT DEFAULT 'Science',
        allowed_groups JSONB DEFAULT '["Science"]',
        min_ssc_gpa DOUBLE PRECISION DEFAULT 3.5,
        min_hsc_gpa DOUBLE PRECISION DEFAULT 3.5,
        min_combined_gpa DOUBLE PRECISION DEFAULT 7.5,
        allow_second_time BOOLEAN DEFAULT false,
        allowed_passing_years JSONB DEFAULT '[2025, 2026]',
        required_subjects JSONB,
        total_seats INT DEFAULT 100,
        application_fee INT DEFAULT 1000,
        status TEXT DEFAULT 'active',
        application_start_date TIMESTAMP,
        application_end_date TIMESTAMP,
        exam_date TIMESTAMP,
        result_date TIMESTAMP,
        official_url TEXT,
        summary TEXT,
        requirements JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS unit TEXT;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS unit_name TEXT;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS session TEXT DEFAULT '2025-2026';
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS year INT DEFAULT 2026;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS "group" TEXT DEFAULT 'Science';
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS allowed_groups JSONB DEFAULT '["Science"]';
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS min_ssc_gpa DOUBLE PRECISION DEFAULT 3.5;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS min_hsc_gpa DOUBLE PRECISION DEFAULT 3.5;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS min_combined_gpa DOUBLE PRECISION DEFAULT 7.5;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS allow_second_time BOOLEAN DEFAULT false;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS allowed_passing_years JSONB DEFAULT '[2025, 2026]';
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS required_subjects JSONB;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS total_seats INT DEFAULT 100;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS application_fee INT DEFAULT 1000;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS application_start_date TIMESTAMP;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS application_end_date TIMESTAMP;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS exam_date TIMESTAMP;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS result_date TIMESTAMP;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS official_url TEXT;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS summary TEXT;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS requirements JSONB;
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
      ALTER TABLE admission_circulars ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);

    // 4. Ensure programs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        duration TEXT,
        seats INT,
        cutoff_marks INT,
        subjects JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      ALTER TABLE programs ADD COLUMN IF NOT EXISTS circular_id UUID REFERENCES admission_circulars(id) ON DELETE SET NULL;
      ALTER TABLE programs ADD COLUMN IF NOT EXISTS short_code TEXT;
      ALTER TABLE programs ADD COLUMN IF NOT EXISTS degree TEXT DEFAULT 'Bachelor';
      ALTER TABLE programs ADD COLUMN IF NOT EXISTS cutoff_marks INT;
      ALTER TABLE programs ADD COLUMN IF NOT EXISTS subjects JSONB;
    `);

    // 5. Ensure sessions & chat_messages tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
        user_agent TEXT,
        ip_address TEXT
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('[Database Migration] Schema & columns successfully verified!');
  } catch (err: any) {
    console.error('[Database Migration] Error during schema verification:', err.message || err);
  }
}
