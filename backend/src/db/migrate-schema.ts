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

    // 6. Ensure Curriculum Subjects table
    await pool.query(`
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
    `);

    // 7. Ensure Community Q&A Tables, Indexes & Categories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS community_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
        student_id UUID,
        author_name TEXT NOT NULL DEFAULT 'HSC Student',
        author_role TEXT NOT NULL DEFAULT 'student',
        is_verified_author BOOLEAN NOT NULL DEFAULT FALSE,
        author_badge TEXT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        content_format TEXT NOT NULL DEFAULT 'markdown_latex',
        category_id UUID REFERENCES community_categories(id) ON DELETE RESTRICT,
        subject_id UUID,
        chapter_id UUID,
        topic_id UUID,
        university_id UUID,
        unit TEXT,
        question_type TEXT NOT NULL DEFAULT 'Problem Solving',
        status TEXT NOT NULL DEFAULT 'published',
        accepted_answer_id UUID,
        answer_count INT NOT NULL DEFAULT 0,
        vote_count INT NOT NULL DEFAULT 0,
        view_count INT NOT NULL DEFAULT 0,
        is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_activity_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS community_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE NOT NULL,
        session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
        student_id UUID,
        author_name TEXT NOT NULL DEFAULT 'Community Contributor',
        author_role TEXT NOT NULL DEFAULT 'student',
        is_verified_author BOOLEAN NOT NULL DEFAULT FALSE,
        author_badge TEXT,
        content TEXT NOT NULL,
        content_format TEXT NOT NULL DEFAULT 'markdown_latex',
        parent_answer_id UUID REFERENCES community_answers(id) ON DELETE CASCADE,
        is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
        vote_count INT NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'published',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS community_question_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE NOT NULL,
        session_token TEXT NOT NULL,
        student_id UUID,
        vote INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(question_id, session_token)
      );

      CREATE TABLE IF NOT EXISTS community_answer_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        answer_id UUID REFERENCES community_answers(id) ON DELETE CASCADE NOT NULL,
        session_token TEXT NOT NULL,
        student_id UUID,
        vote INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(answer_id, session_token)
      );

      CREATE TABLE IF NOT EXISTS community_bookmarks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE NOT NULL,
        session_token TEXT NOT NULL,
        student_id UUID,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(question_id, session_token)
      );

      CREATE TABLE IF NOT EXISTS community_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        usage_count INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS community_question_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE NOT NULL,
        tag_id UUID REFERENCES community_tags(id) ON DELETE CASCADE NOT NULL,
        UNIQUE(question_id, tag_id)
      );

      CREATE TABLE IF NOT EXISTS community_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_token TEXT NOT NULL,
        question_id UUID REFERENCES community_questions(id) ON DELETE CASCADE,
        answer_id UUID REFERENCES community_answers(id) ON DELETE CASCADE,
        reason TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        reviewed_by TEXT,
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Helpful indexes for feed queries and search performance
      CREATE INDEX IF NOT EXISTS idx_comm_q_feed ON community_questions (status, last_activity_at DESC);
      CREATE INDEX IF NOT EXISTS idx_comm_q_votes ON community_questions (status, vote_count DESC);
      CREATE INDEX IF NOT EXISTS idx_comm_q_category ON community_questions (category_id, status);
      CREATE INDEX IF NOT EXISTS idx_comm_q_slug ON community_questions (slug);
      CREATE INDEX IF NOT EXISTS idx_comm_a_question ON community_answers (question_id, created_at ASC);
    `);

    // Seed default categories if none exist
    const { rows: existingCats } = await pool.query('SELECT COUNT(*) as count FROM community_categories');
    if (parseInt(existingCats[0]?.count || '0', 10) === 0) {
      console.log('[Database Migration] Seeding initial Community Categories...');
      await pool.query(`
        INSERT INTO community_categories (name, slug, description, icon, color, sort_order) VALUES
          ('All Questions', 'all', 'All discussions across topics and universities', 'Compass', '#FF5500', 0),
          ('Admission Circulars & Guidelines', 'admission', 'Deadlines, GPA requirements, seat capacity & circular updates', 'GraduationCap', '#FF5500', 1),
          ('Higher Mathematics', 'mathematics', 'Calculus, vectors, trigonometry, algebra & geometry problem solving', 'Sigma', '#3b82f6', 2),
          ('Physics', 'physics', 'Mechanics, dynamics, electricity, optics & atomic physics', 'Zap', '#f59e0b', 3),
          ('Chemistry', 'chemistry', 'Organic reactions, bonding, thermodynamics & solutions', 'FlaskConical', '#10b981', 4),
          ('Biology', 'biology', 'Medical & university biology concepts, genetics & botany', 'Dna', '#ec4899', 5),
          ('English & General Knowledge', 'english', 'English vocabulary, grammar, reading comprehension & GK', 'Languages', '#8b5cf6', 6),
          ('University Guidance & Prep', 'university', 'BUET, DU, Medical, CKET comparisons & study strategies', 'Building2', '#06b6d4', 7)
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    // 8. Ensure Articles & Guides tables (Used by Homepage Guide Section, SEO Articles & Admin Guides CMS)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS article_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
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

      ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS title TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time_minutes INT DEFAULT 5;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_keywords JSONB;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS related_university TEXT;
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
      ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (is_published, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category_id);
    `);

    // Seed default article categories if none exist
    const { rows: existingArticleCats } = await pool.query('SELECT COUNT(*) as count FROM article_categories');
    if (parseInt(existingArticleCats[0]?.count || '0', 10) === 0) {
      console.log('[Database Migration] Seeding initial Article Categories...');
      await pool.query(`
        INSERT INTO article_categories (name, slug, description) VALUES
          ('Engineering Guide', 'engineering-guide', 'BUET, CKET and engineering university admission guides'),
          ('Varsity Science', 'varsity-science', 'Dhaka University Ka Unit and general public varsity guides'),
          ('Medical Guide', 'medical-guide', 'MBBS and BDS medical college admission preparation guides'),
          ('Cluster Guide', 'cluster-guide', 'GST 24 general and STEM cluster admission updates'),
          ('General Guide', 'general-guide', 'Comprehensive admission guidelines and strategies')
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    // Seed default guide articles if none exist
    const { rows: existingArticles } = await pool.query('SELECT COUNT(*) as count FROM articles');
    if (parseInt(existingArticles[0]?.count || '0', 10) === 0) {
      console.log('[Database Migration] Seeding initial Guide Articles...');
      await pool.query(`
        INSERT INTO articles (title, slug, summary, content, reading_time_minutes, is_published, featured_image) VALUES
          (
            'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
            'buet-admission-guide-2026',
            'Everything HSC candidates need to know about BUET admission requirements, preliminary cutoff marks, seat breakdown, and preparation strategy.',
            '<h2>BUET Admission 2026 Overview</h2><p>Bangladesh University of Engineering and Technology (BUET) is the most competitive engineering university in Bangladesh. The admission process consists of a preliminary screening based on HSC Physics, Chemistry, and Mathematics marks, followed by the written admission test.</p><h3>Eligibility Criteria</h3><ul><li>Combined GPA of 5.0 in SSC and HSC with Physics, Chemistry, and Math.</li><li>High total grade points in PCM to qualify for top 24,000 preliminary applicants.</li></ul><h3>Preparation Strategy</h3><p>Focus on deep conceptual clarity and rapid numerical problem solving. Solve BUET questions from the past 20 years.</p>',
            8,
            true,
            '/images/buet-guide.jpg'
          ),
          (
            'DU Ka Unit Admission Strategy: How to Score High in Physics & Chemistry',
            'du-ka-unit-guide',
            'Proven preparation techniques for University of Dhaka Ka Unit science admission test with past year question analysis.',
            '<h2>Dhaka University Ka Unit Strategy</h2><p>The Ka Unit admission test evaluates Physics, Chemistry, Mathematics/Biology, and English/Bangla. High negative marking requires precision and time management.</p><h3>Core Focus Areas</h3><ul><li>Physics: Mechanics, Waves, Electromagnetism, Modern Physics</li><li>Chemistry: Organic reaction mechanisms, Chemical equilibrium, Mole concept</li></ul>',
            6,
            true,
            '/images/du-guide.jpg'
          ),
          (
            'Medical College Admission 2026: Biology & Chemistry High-Yield Topics',
            'medical-admission-guide-2026',
            'Strategic analysis of DGHS MBBS question patterns, negative marking prevention, and NCERT-equivalent revision topics.',
            '<h2>MBBS Admission Test 2026</h2><p>DGHS conducts the national medical admission test across all public medical colleges in Bangladesh. Biology carries 30 marks, Chemistry 25 marks, Physics 20 marks, English 15 marks, and General Knowledge 10 marks.</p>',
            7,
            true,
            '/images/medical-guide.jpg'
          ),
          (
            'GST Cluster Admission 2026: 24 Public Universities One Exam Breakdown',
            'gst-cluster-guide-2026',
            'Complete guide to general, science and technology cluster admission test, subject choices, and merit score formulas.',
            '<h2>GST Cluster Admission</h2><p>The GST cluster brings together 24 general, science and technology public universities under a unified admission exam. Score optimization and university ranking strategy are crucial for securing top subjects.</p>',
            5,
            true,
            '/images/gst-guide.jpg'
          )
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    // 9. Ensure FAQs and Homepage Configs tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        "order" INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS homepage_configs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        status TEXT NOT NULL DEFAULT 'draft',
        version INTEGER DEFAULT 1,
        hero_config JSONB,
        admission_section_config JSONB,
        eligibility_section_config JSONB,
        deadline_section_config JSONB,
        featured_university_ids JSONB,
        ai_advisor_config JSONB,
        guide_section_config JSONB,
        preparation_config JSONB,
        faq_config JSONB,
        footer_config JSONB,
        seo_config JSONB,
        updated_by TEXT,
        published_by TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS admission_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
        university_name TEXT NOT NULL,
        unit TEXT,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL,
        description TEXT,
        source_url TEXT,
        status TEXT DEFAULT 'upcoming',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('[Database Migration] Schema & columns successfully verified!');
  } catch (err: any) {
    console.error('[Database Migration] Error during schema verification:', err.message || err);
  }
}
