import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';
import { DEFAULT_HOMEPAGE_CONFIG } from '../src/modules/homepage/homepage.service';

const DATABASE_URL = process.env.DATABASE_URL!;

async function seedHomepageTables() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  console.log('[Seed] Initializing Homepage CMS and Admission Intelligence tables in PostgreSQL...');

  // 1. Create tables if not exist
  await pool.query(`
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

    CREATE TABLE IF NOT EXISTS faqs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      "order" INTEGER DEFAULT 0,
      is_published BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admission_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      university_id UUID,
      university_name TEXT NOT NULL,
      unit TEXT,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      event_date TIMESTAMP WITH TIME ZONE NOT NULL,
      description TEXT,
      source_url TEXT,
      status TEXT DEFAULT 'upcoming',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('[Seed] Tables checked/created successfully.');

  // 2. Seed Default Published & Draft Homepage Configurations
  await pool.query(`DELETE FROM homepage_configs`);
  await pool.query(
    `INSERT INTO homepage_configs (
      status, version, hero_config, admission_section_config, eligibility_section_config,
      deadline_section_config, featured_university_ids, ai_advisor_config, guide_section_config,
      preparation_config, faq_config, footer_config, seo_config, updated_at, published_at
    ) VALUES (
      'published', 1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
    )`,
    [
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.hero),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.admissionSection),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.eligibilitySection),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.deadlineSection),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.featuredUniversities.selectedUniversityIds),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.aiAdvisor),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.guideSection),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.preparation),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.faq),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.footer),
      JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.seo),
    ]
  );
  console.log('[Seed] Default published homepage config seeded.');

  // 3. Seed FAQs
  await pool.query(`DELETE FROM faqs`);
  const initialFaqs = [
    {
      question: 'How does EduGuide evaluate university admission eligibility?',
      answer: '<p>EduGuide evaluates eligibility deterministically using published official admission circulars from Bangladeshi public and engineering universities. It validates your <strong>SSC GPA</strong>, <strong>HSC GPA</strong>, <strong>Academic Group</strong> (Science, Commerce, Humanities), and <strong>Passing Year</strong> against each university’s cutoff thresholds.</p>',
      category: 'Eligibility',
      order: 1,
    },
    {
      question: 'Are second-time candidates allowed to apply to BUET and DU?',
      answer: '<p>Per current regulations, <strong>BUET</strong> strictly disallows second-time admission candidates. <strong>University of Dhaka (DU)</strong> allows second-time applicants only in specific faculties under prescribed circular guidelines. EduGuide clearly flags second-time eligibility for each university in your result view.</p>',
      category: 'Admission',
      order: 2,
    },
    {
      question: 'How frequently are admission circulars and deadlines updated on EduGuide?',
      answer: '<p>Our admission intelligence team verifies and updates circulars within <strong>2 hours</strong> of official university notifications. Every deadline record displays an official source citation and a <em>Last Verified</em> verification timestamp.</p>',
      category: 'General',
      order: 3,
    },
    {
      question: 'What is included in the "Prepare with EduGuide" learning platform?',
      answer: '<p>EduGuide provides interactive visual lessons, chapter-wise MCQs with detailed explanations, past 15 years solved questions for BUET/DU/Medical, realistic mock tests with negative marking, and a 24/7 AI Admission Tutor for instant problem step-by-step solutions.</p>',
      category: 'Preparation',
      order: 4,
    },
    {
      question: 'Is EduGuide free to use for checking eligibility and circulars?',
      answer: '<p><strong>Yes.</strong> Exploring universities, viewing admission dates, checking personal eligibility, reading admission guides, and asking admission guidance questions to the AI Advisor are 100% free.</p>',
      category: 'General',
      order: 5,
    },
  ];

  for (const f of initialFaqs) {
    await pool.query(
      `INSERT INTO faqs (question, answer, category, "order", is_published) VALUES ($1, $2, $3, $4, true)`,
      [f.question, f.answer, f.category, f.order]
    );
  }
  console.log(`[Seed] Seeded ${initialFaqs.length} FAQs.`);

  // 4. Seed Admission Events / Deadlines
  await pool.query(`DELETE FROM admission_events`);
  const initialEvents = [
    {
      university_name: 'BUET',
      unit: 'Ka Unit (Engineering)',
      event_type: 'application_deadline',
      title: 'Application Deadline',
      event_date: '2026-09-18T23:59:59Z',
      description: 'Online application form submission deadline for BUET undergraduate programs.',
      source_url: 'https://buet.ac.bd/admission',
      status: 'upcoming',
    },
    {
      university_name: 'BUET',
      unit: 'Preliminary MCQ Exam',
      event_type: 'exam_date',
      title: 'Preliminary Admission Test',
      event_date: '2026-09-28T10:00:00Z',
      description: 'First screening phase 100-mark MCQ test across shifts.',
      source_url: 'https://buet.ac.bd/admission',
      status: 'upcoming',
    },
    {
      university_name: 'University of Dhaka (DU)',
      unit: 'Ka Unit (Science)',
      event_type: 'application_deadline',
      title: 'Application Deadline',
      event_date: '2026-10-05T23:59:59Z',
      description: 'Online application portal closes for all faculties.',
      source_url: 'https://admission.eis.du.ac.bd',
      status: 'upcoming',
    },
    {
      university_name: 'KUET',
      unit: 'Engineering & Architecture',
      event_type: 'application_start',
      title: 'Applications Open',
      event_date: '2026-09-15T09:00:00Z',
      description: 'Combined / Individual engineering admission portal goes live.',
      source_url: 'https://admission.kuet.ac.bd',
      status: 'upcoming',
    },
    {
      university_name: 'University of Dhaka (DU)',
      unit: 'Ka Unit (Science)',
      event_type: 'exam_date',
      title: 'Written & MCQ Admission Test',
      event_date: '2026-10-25T10:00:00Z',
      description: 'Admission test conducted across divisional centers in Bangladesh.',
      source_url: 'https://admission.eis.du.ac.bd',
      status: 'upcoming',
    },
    {
      university_name: 'Medical (DGHS)',
      unit: 'MBBS Admission',
      event_type: 'application_start',
      title: 'Circular Publication',
      event_date: '2026-11-01T00:00:00Z',
      description: 'Directorate General of Health Services publishes official MBBS circular.',
      source_url: 'https://dgme.teletalk.com.bd',
      status: 'scheduled',
    },
  ];

  for (const e of initialEvents) {
    await pool.query(
      `INSERT INTO admission_events (university_name, unit, event_type, title, event_date, description, source_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [e.university_name, e.unit, e.event_type, e.title, e.event_date, e.description, e.source_url, e.status]
    );
  }
  console.log(`[Seed] Seeded ${initialEvents.length} admission events & deadlines.`);

  await pool.end();
  console.log('[Seed] Homepage CMS seed complete!');
}

seedHomepageTables().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
