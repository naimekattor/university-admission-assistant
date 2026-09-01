import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admission_db';

async function initPostgres() {
  console.log('======================================================');
  console.log('--- Initializing PostgreSQL Schema for EduGuide ---');
  console.log('======================================================');
  
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

    // 1. Check if pgvector extension is available
    let hasVectorExtension = false;
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      hasVectorExtension = true;
      console.log('✓ pgvector extension enabled successfully.');
    } catch (vecErr: any) {
      console.log('ℹ pgvector native extension not installed in Postgres; using text/JSON embedding storage for universal compatibility.');
    }

    const embeddingColumnDef = hasVectorExtension ? 'vector(768)' : 'TEXT';

    // 2. Create core tables
    console.log('Creating database tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
        user_agent TEXT,
        ip_address TEXT
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        hsc_marks INT,
        subjects JSONB,
        preferences JSONB,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id),
        email TEXT UNIQUE,
        name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS student_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
        academic_group TEXT NOT NULL,
        ssc_gpa DOUBLE PRECISION NOT NULL,
        hsc_gpa DOUBLE PRECISION NOT NULL,
        passing_year INT NOT NULL,
        primary_goal TEXT,
        secondary_goals JSONB,
        available_study_hours DOUBLE PRECISION DEFAULT 4.0,
        preferred_location TEXT,
        exam_date TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

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

      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        duration TEXT,
        seats INT,
        cutoff_marks INT,
        subjects JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS eligibility_criteria (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        program_id UUID REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
        min_hsc_marks INT,
        min_gpa TEXT,
        required_subjects JSONB,
        physical_eligibility TEXT,
        age_limit TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admission_circulars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        unit TEXT,
        year INT NOT NULL,
        application_start_date TIMESTAMP,
        application_end_date TIMESTAMP,
        exam_date TIMESTAMP,
        result_date TIMESTAMP,
        official_url TEXT,
        summary TEXT,
        requirements JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        code TEXT,
        description TEXT,
        icon TEXT,
        color TEXT,
        "order" INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT,
        paper INT DEFAULT 1,
        "order" INT DEFAULT 0,
        weightage DOUBLE PRECISION DEFAULT 1.0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT,
        "order" INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS concepts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        summary TEXT,
        difficulty TEXT DEFAULT 'medium',
        "order" INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        summary TEXT,
        content TEXT NOT NULL,
        learning_objectives JSONB,
        estimated_minutes INT DEFAULT 30,
        visual_type TEXT DEFAULT 'none',
        visual_config JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS lesson_assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
        type TEXT NOT NULL,
        url TEXT,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        concept_id UUID REFERENCES concepts(id),
        chapter_id UUID REFERENCES chapters(id),
        subject_id UUID REFERENCES subjects(id),
        question_text TEXT NOT NULL,
        question_image TEXT,
        correct_option_index INT NOT NULL,
        explanation TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium',
        source TEXT,
        university_tag TEXT,
        year_tag INT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
        option_index INT NOT NULL,
        option_text TEXT NOT NULL,
        option_image TEXT
      );

      CREATE TABLE IF NOT EXISTS mock_tests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        target_university TEXT,
        target_unit TEXT,
        duration_minutes INT NOT NULL,
        total_questions INT NOT NULL,
        total_marks DOUBLE PRECISION NOT NULL,
        negative_mark_per_wrong DOUBLE PRECISION DEFAULT 0.25,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS mock_test_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE NOT NULL,
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
        "order" INT NOT NULL,
        marks DOUBLE PRECISION DEFAULT 1.0
      );

      CREATE TABLE IF NOT EXISTS test_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
        student_id UUID REFERENCES students(id),
        mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE NOT NULL,
        score DOUBLE PRECISION DEFAULT 0,
        correct_answers_count INT DEFAULT 0,
        incorrect_answers_count INT DEFAULT 0,
        unanswered_count INT DEFAULT 0,
        time_spent_seconds INT DEFAULT 0,
        accuracy DOUBLE PRECISION DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS test_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE NOT NULL,
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
        selected_option_index INT,
        is_correct BOOLEAN DEFAULT FALSE,
        time_spent_seconds INT DEFAULT 0,
        marked_for_review BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_file_name TEXT NOT NULL,
        file_path TEXT,
        university TEXT NOT NULL,
        unit TEXT,
        year INT,
        document_type TEXT,
        chunk_count INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS document_chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
        chunk_index INT NOT NULL DEFAULT 0,
        content TEXT NOT NULL,
        embedding ${embeddingColumnDef},
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

      CREATE TABLE IF NOT EXISTS article_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID REFERENCES article_categories(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        reading_time_minutes INT DEFAULT 5,
        featured_image TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        seo_keywords JSONB,
        related_university TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscription_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        price_bdt DOUBLE PRECISION NOT NULL DEFAULT 0,
        duration_days INT DEFAULT 30,
        features JSONB
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
        plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        start_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expiry_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✓ All database tables created/verified successfully.');

    // If pgvector is enabled, try creating HNSW index
    if (hasVectorExtension) {
      try {
        await client.query(`
          CREATE INDEX IF NOT EXISTS document_chunks_embedding_cosine_idx 
          ON document_chunks USING hnsw (embedding vector_cosine_ops);
        `);
        console.log('✓ Vector HNSW cosine index verified.');
      } catch {
        console.log('ℹ Standard sequential vector scan active.');
      }
    }

    client.release();
    await pool.end();

    console.log('======================================================');
    console.log('✓ PostgreSQL schema initialization complete!');
    console.log('======================================================');
  } catch (err: any) {
    console.error('PostgreSQL Initialization warning:', err.message || err);
  }
}

initPostgres().catch(console.error);
