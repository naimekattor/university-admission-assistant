import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL!;

async function seedCurriculumAndPreparation() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  console.log('Seeding HSC Admission Curriculum & Question Bank...');

  // 1. Subjects
  const subjectsData = [
    { name: 'Physics', slug: 'physics', code: 'PHY', description: 'HSC Physics 1st & 2nd Paper for Engineering and Varsity Admission', icon: '⚡', color: '#f59e0b', order: 1 },
    { name: 'Chemistry', slug: 'chemistry', code: 'CHE', description: 'HSC Chemistry 1st & 2nd Paper (Organic, Inorganic, Physical)', icon: '🧪', color: '#10b981', order: 2 },
    { name: 'Higher Mathematics', slug: 'higher-math', code: 'MATH', description: 'HSC Higher Mathematics (Calculus, Trigonometry, Vectors)', icon: '📐', color: '#3b82f6', order: 3 },
    { name: 'Biology', slug: 'biology', code: 'BIO', description: 'HSC Biology 1st & 2nd Paper for Medical & Life Science Admission', icon: '🧬', color: '#ec4899', order: 4 },
  ];

  for (const sub of subjectsData) {
    await pool.query(
      `INSERT INTO subjects (name, slug, code, description, icon, color, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [sub.name, sub.slug, sub.code, sub.description, sub.icon, sub.color, sub.order]
    );
  }
  console.log(`Inserted ${subjectsData.length} core subjects.`);

  // Get Physics Subject ID
  const phyRes = await pool.query(`SELECT id FROM subjects WHERE slug = 'physics'`);
  const phyId = phyRes.rows[0]?.id;

  const cheRes = await pool.query(`SELECT id FROM subjects WHERE slug = 'chemistry'`);
  const cheId = cheRes.rows[0]?.id;

  const mathRes = await pool.query(`SELECT id FROM subjects WHERE slug = 'higher-math'`);
  const mathId = mathRes.rows[0]?.id;

  // 2. Chapters
  if (phyId) {
    const phyChapters = [
      { name: "Newton's Mechanics", slug: 'newtons-mechanics', description: 'Laws of motion, friction, circular motion, linear & angular momentum.', paper: 1, order: 1 },
      { name: 'Work, Energy & Power', slug: 'work-energy-power', description: 'Work-energy theorem, conservation of mechanical energy, power.', paper: 1, order: 2 },
      { name: 'Vectors & Kinematics', slug: 'vectors-kinematics', description: 'Vector dot/cross product, projectile motion, relative velocity.', paper: 1, order: 3 },
      { name: 'Wave & Sound', slug: 'wave-sound', description: 'Simple harmonic motion, wave velocity, Doppler effect.', paper: 1, order: 4 },
    ];
    for (const ch of phyChapters) {
      await pool.query(
        `INSERT INTO chapters (subject_id, name, slug, description, paper, "order")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [phyId, ch.name, ch.slug, ch.description, ch.paper, ch.order]
      );
    }
  }

  if (cheId) {
    const cheChapters = [
      { name: 'Chemical Bonding & Structure', slug: 'chemical-bonding', description: 'Hybridization, VSEPR, hydrogen bonding, dipole moment.', paper: 1, order: 1 },
      { name: 'Organic Chemistry', slug: 'organic-chemistry', description: 'Nomenclature, electrophilic substitution, reaction mechanisms.', paper: 2, order: 2 },
      { name: 'Quantitative Chemistry', slug: 'quantitative-chemistry', description: 'Molarity, titration, pH, buffer solutions, electrochemistry.', paper: 2, order: 3 },
    ];
    for (const ch of cheChapters) {
      await pool.query(
        `INSERT INTO chapters (subject_id, name, slug, description, paper, "order")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [cheId, ch.name, ch.slug, ch.description, ch.paper, ch.order]
      );
    }
  }

  if (mathId) {
    const mathChapters = [
      { name: 'Calculus (Differentiation & Integration)', slug: 'calculus', description: 'Limits, derivatives, definite & indefinite integrals, area.', paper: 1, order: 1 },
      { name: 'Trigonometry', slug: 'trigonometry', description: 'Compound angles, inverse trigonometric functions, triangle properties.', paper: 1, order: 2 },
      { name: 'Matrices & Determinants', slug: 'matrices-determinants', description: 'Matrix operations, Cramer rule, inverse matrix.', paper: 1, order: 3 },
    ];
    for (const ch of mathChapters) {
      await pool.query(
        `INSERT INTO chapters (subject_id, name, slug, description, paper, "order")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [mathId, ch.name, ch.slug, ch.description, ch.paper, ch.order]
      );
    }
  }
  console.log('Inserted core chapters.');

  // 3. Topics & Concepts
  const newtonChRes = await pool.query(`SELECT id FROM chapters WHERE slug = 'newtons-mechanics'`);
  const newtonChId = newtonChRes.rows[0]?.id;

  if (newtonChId) {
    const topicRes = await pool.query(
      `INSERT INTO topics (chapter_id, name, slug, description, "order")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [newtonChId, "Newton's Second Law & Momentum", 'newtons-second-law', 'Force, acceleration, impulse, and conservation of linear momentum.', 1]
    );
    const topicId = topicRes.rows[0]?.id;

    if (topicId) {
      const conceptRes = await pool.query(
        `INSERT INTO concepts (topic_id, name, slug, summary, difficulty, "order")
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [topicId, 'Linear Impulse & Variable Mass Collision', 'linear-impulse', 'Impulse equation J = F * delta_t and variable mass motion.', 'medium', 1]
      );
      const conceptId = conceptRes.rows[0]?.id;

      if (conceptId) {
        // Insert Structured Lesson
        await pool.query(
          `INSERT INTO lessons (concept_id, title, slug, summary, content, learning_objectives, estimated_minutes, visual_type, visual_config)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            conceptId,
            "Mastering Newton's Second Law & Impulse Problems for BUET",
            'newtons-second-law-buet-guide',
            'Learn how to solve high-yield momentum and force vector problems asked in BUET and DU admission tests.',
            `# Newton's Second Law of Motion & Impulse

## Core Formulae
1. **Force Equation**: $\\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}$
2. **Impulse of Force**: $J = \\int_{t_1}^{t_2} F dt = \\Delta p = m(v - u)$
3. **Conservation of Linear Momentum**: $\\sum \\vec{p}_{initial} = \\sum \\vec{p}_{final}$

## Key Admission Insights
- In BUET admission tests, force is often represented as a time-dependent function $F(t) = a + bt^2$. To find velocity, integrate $a(t) = F(t)/m$.
- For variable mass systems (like rockets or water jets hitting a wall), $F = v_{rel} \\frac{dm}{dt}$.

## Worked Example
A water jet expels water at a rate of $2\\text{ kg/s}$ with a speed of $10\\text{ m/s}$ against a vertical wall. What is the force exerted on the wall?

$$\\text{Force } F = \\frac{dm}{dt} \\times v = 2 \\times 10 = 20\\text{ N}$$`,
            JSON.stringify(['Understand impulse-momentum theorem', 'Solve time-varying force integration problems', 'Apply rocket equation to admission MCQs']),
            25,
            'interactive',
            JSON.stringify({ type: 'physics_vectors', initialVelocity: 10, mass: 2 }),
          ]
        );

        // Insert Sample MCQ Questions
        const qRes1 = await pool.query(
          `INSERT INTO questions (concept_id, chapter_id, subject_id, question_text, correct_option_index, explanation, difficulty, source, university_tag, year_tag)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [
            conceptId,
            newtonChId,
            phyId,
            'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন (Impulse) কত Ns?',
            1, // Option 1 is 12 Ns
            'Impulse J = ∫ F(t) dt from 0 to 2 = [t^3 + 2t]_0^2 = (8 + 4) - 0 = 12 Ns।',
            'medium',
            'BUET Admission Test',
            'BUET',
            2023,
          ]
        );
        const qId1 = qRes1.rows[0]?.id;

        if (qId1) {
          const opts1 = ['8 Ns', '12 Ns', '16 Ns', '20 Ns'];
          for (let i = 0; i < opts1.length; i++) {
            await pool.query(
              `INSERT INTO question_options (question_id, option_index, option_text) VALUES ($1, $2, $3)`,
              [qId1, i, opts1[i]]
            );
          }
        }
      }
    }
  }

  // 4. Sample Mock Test
  const mockRes = await pool.query(
    `INSERT INTO mock_tests (title, description, target_university, target_unit, duration_minutes, total_questions, total_marks, negative_mark_per_wrong, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [
      'BUET Preliminary Model Test 01 (Physics & Chemistry)',
      'Realistic 60-minute admission mock test designed per BUET preliminary standards.',
      'BUET',
      'Ka Unit',
      60,
      10,
      10.0,
      0.25,
      true,
    ]
  );
  console.log('Inserted sample mock test.');

  // 5. Sample SEO Guide Article
  const catRes = await pool.query(
    `INSERT INTO article_categories (name, slug, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
     RETURNING id`,
    ['University Admission Guides', 'admission-guides', 'Comprehensive preparation guides for Bangladeshi universities']
  );
  const catId = catRes.rows[0]?.id;

  if (catId) {
    await pool.query(
      `INSERT INTO articles (category_id, title, slug, summary, content, reading_time_minutes, featured_image, is_published, seo_keywords, related_university)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (slug) DO NOTHING`,
      [
        catId,
        'BUET Admission Test 2026: Complete Preparation & Eligibility Guide',
        'buet-admission-guide-2026',
        'Everything HSC candidates need to know about BUET admission requirements, preliminary cutoff marks, seat breakdown, and preparation strategy.',
        `# BUET Admission Test 2026 Strategy Guide

BUET (Bangladesh University of Engineering and Technology) is the premier engineering institution in Bangladesh. 

## Eligibility Highlights
- **SSC & HSC Group**: Science Group
- **Minimum HSC GPA**: 4.50+ in Physics, Chemistry, Higher Mathematics, English
- **Total Seat Capacity**: ~1,305 seats

## Recommended Preparation Strategy
1. **Master Basic Concepts**: Focus heavily on HSC Physics & Mathematics fundamentals.
2. **Practice Previous 15 Years Questions**: Solve BUET preliminary and written question banks.
3. **Take Timed Mock Tests**: Speed and accuracy under pressure are crucial.

[Check My BUET Eligibility](/eligibility) | [Start BUET Preparation](/prepare)`,
        8,
        '/images/buet-guide.jpg',
        true,
        JSON.stringify(['BUET admission 2026', 'BUET eligibility criteria', 'BUET seat capacity', 'BUET physics question bank']),
        'BUET',
      ]
    );
  }
  console.log('Inserted sample SEO article guide.');

  await pool.end();
  console.log('--- SaaS Database Seeding Completed Successfully! ---');
}

seedCurriculumAndPreparation().catch((err) => {
  console.error('Database seeding error:', err);
  process.exit(1);
});
