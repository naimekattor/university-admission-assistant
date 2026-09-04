import { pool } from '../../db';
import { CreateQuestionInput, CreateAnswerInput, QuestionFilterParams } from './community.types';
import { COMMUNITY_LIMITS, DEFAULT_COMMUNITY_CATEGORIES } from './community.constants';

export class CommunityService {
  // In-memory fallback stores for when PostgreSQL is not running locally
  private inMemoryQuestions: any[] = [];
  private inMemoryAnswers: any[] = [];
  private inMemoryVotes: Map<string, number> = new Map();
  private inMemoryBookmarks: Set<string> = new Set();
  private inMemoryReports: any[] = [];

  constructor() {
    this.seedInitialInMemoryData();
  }

  private seedInitialInMemoryData() {
    this.inMemoryQuestions = [
      {
        id: 'q-sample-1',
        title: 'How do I solve this definite integration problem from BUET 2023?',
        slug: 'how-do-i-solve-this-definite-integration-problem-buet-2023',
        content: `I am trying to solve this definite integral from BUET admission test:
$$\\int_{0}^{1} \\frac{x^2 + 1}{x^4 + 1} dx$$
I divided numerator and denominator by $x^2$:
$$\\int_{0}^{1} \\frac{1 + 1/x^2}{x^2 + 1/x^2} dx = \\int_{0}^{1} \\frac{d(x - 1/x)}{(x - 1/x)^2 + 2}$$
Can someone verify the substitution limits when setting $u = x - \\frac{1}{x}$?`,
        content_format: 'markdown_latex',
        author_name: 'Tanvir Hossain',
        author_role: 'student',
        is_verified_author: false,
        author_badge: 'HSC 2025',
        question_type: 'Problem Solving',
        category_name: 'Higher Mathematics',
        category_slug: 'mathematics',
        subject_name: 'Higher Mathematics',
        subject_slug: 'higher-math',
        university_name: 'BUET',
        university_short_name: 'BUET',
        unit: 'Engineering',
        status: 'published',
        accepted_answer_id: 'ans-1',
        answer_count: 2,
        vote_count: 24,
        view_count: 312,
        is_pinned: true,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        last_activity_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        tags: [
          { id: 't1', name: 'Calculus', slug: 'calculus' },
          { id: 't2', name: 'Integration', slug: 'integration' },
          { id: 't3', name: 'BUET', slug: 'buet' },
        ],
      },
      {
        id: 'q-sample-2',
        title: 'BUET 2025-2026 application deadline and circular eligibility criteria?',
        slug: 'buet-2025-2026-application-deadline-circular-eligibility',
        content: `BUET admission circular 2025-2026 e physics, chemistry, higher math e minimum GPA koto lagbe? Aar second time ki allow korche? Official circular deadline kobe theke shuru hobe?`,
        content_format: 'markdown_latex',
        author_name: 'Nusrat Jahan',
        author_role: 'student',
        is_verified_author: false,
        author_badge: 'DU Aspirant',
        question_type: 'Admission Information',
        category_name: 'Admission Circulars & Guidelines',
        category_slug: 'admission',
        university_name: 'Bangladesh University of Engineering and Technology',
        university_short_name: 'BUET',
        unit: 'All Units',
        status: 'published',
        accepted_answer_id: null,
        answer_count: 3,
        vote_count: 42,
        view_count: 850,
        is_pinned: false,
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
        last_activity_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        tags: [
          { id: 't4', name: 'Admission Circular', slug: 'admission-circular' },
          { id: 't3', name: 'BUET', slug: 'buet' },
          { id: 't5', name: 'Deadlines', slug: 'deadlines' },
        ],
      },
      {
        id: 'q-sample-3',
        title: 'Impulse and Momentum vector problem with variable force F(t)',
        slug: 'impulse-momentum-vector-problem-variable-force-physics',
        content: `A 5 kg particle is acted upon by a time-varying force $\\vec{F}(t) = (3t^2 + 2)\\hat{i} + (4t)\\hat{j}$ N. What is the total impulse from $t = 0$ to $t = 3$ s, and the resulting velocity if it started from rest?`,
        content_format: 'markdown_latex',
        author_name: 'Dr. Shahriar Karim',
        author_role: 'teacher',
        is_verified_author: true,
        author_badge: 'Verified Educator',
        question_type: 'Problem Solving',
        category_name: 'Physics',
        category_slug: 'physics',
        subject_name: 'Physics',
        subject_slug: 'physics',
        university_name: 'Engineering Cluster',
        university_short_name: 'CKET',
        unit: 'Engineering',
        status: 'published',
        accepted_answer_id: null,
        answer_count: 1,
        vote_count: 31,
        view_count: 420,
        is_pinned: false,
        created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
        last_activity_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        tags: [
          { id: 't6', name: 'Mechanics', slug: 'mechanics' },
          { id: 't7', name: 'Vectors', slug: 'vectors' },
        ],
      },
    ];

    this.inMemoryAnswers = [
      {
        id: 'ans-1',
        question_id: 'q-sample-1',
        parent_answer_id: null,
        author_name: 'Sakib Chowdhury',
        author_role: 'senior',
        is_verified_author: true,
        author_badge: 'BUET EEE \'22',
        content: `Excellent approach! Here is how to handle the limits correctly:
Because $u = x - 1/x$ is discontinuous at $x = 0$, you must split the integral from $0$ to $\\infty$ or evaluate carefully using standard forms:
$$\\int_{0}^{1} \\frac{x^2+1}{x^4+1} dx = \\frac{1}{2} \\int_{0}^{\\infty} \\frac{x^2+1}{x^4+1} dx = \\frac{\\pi}{2\\sqrt{2}}$$
Specifically, for $[0, 1]$, the value is:
$$\\frac{\\pi}{2\\sqrt{2}} = \\frac{\\pi\\sqrt{2}}{4} \\approx 1.1107$$
This exact question appeared in BUET 2020 and 2023!`,
        content_format: 'markdown_latex',
        is_accepted: true,
        vote_count: 18,
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'ans-1-reply',
        question_id: 'q-sample-1',
        parent_answer_id: 'ans-1',
        author_name: 'Tanvir Hossain',
        author_role: 'student',
        is_verified_author: false,
        author_badge: 'Author',
        content: 'Thank you so much Bhai! Splitting by symmetry completely clarified the substitution step.',
        content_format: 'markdown_latex',
        is_accepted: false,
        vote_count: 4,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ans-2',
        question_id: 'q-sample-2',
        parent_answer_id: null,
        author_name: 'Admission Advisor Team',
        author_role: 'teacher',
        is_verified_author: true,
        author_badge: 'EduGuide Verified',
        content: `Here are the official criteria for BUET 2025-2026:
1. **Minimum GPA**: SSC GPA 5.00 and HSC GPA 5.00.
2. **Subject GPA**: Physics, Chemistry & Higher Mathematics require GPA 5.0 in all three. Total marks in Math, Physics, and Chemistry are used for primary screening.
3. **Second Time**: BUET does **not** allow second time candidates (must be first timer passing HSC in current circular year).
Application starts tentatively in January with circular publication.`,
        content_format: 'markdown_latex',
        is_accepted: false,
        vote_count: 29,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'ans-3',
        question_id: 'q-sample-3',
        parent_answer_id: null,
        author_name: 'Rahim (HSC 2025)',
        author_role: 'student',
        is_verified_author: false,
        author_badge: null,
        content: `Using Impulse-Momentum Theorem:
$$\\vec{J} = \\int_{0}^{3} \\vec{F}(t) dt = \\left[ (t^3 + 2t)\\hat{i} + 2t^2\\hat{j} \\right]_0^3 = (27 + 6)\\hat{i} + 18\\hat{j} = 33\\hat{i} + 18\\hat{j}\\text{ N}\\cdot\\text{s}$$
Velocity:
$$\\vec{v} = \\frac{\\vec{J}}{m} = \\frac{33\\hat{i} + 18\\hat{j}}{5} = 6.6\\hat{i} + 3.6\\hat{j}\\text{ m/s}$$
Speed:
$$v = \\sqrt{6.6^2 + 3.6^2} = \\sqrt{43.56 + 12.96} = \\sqrt{56.52} \\approx 7.52\\text{ m/s}$$`,
        content_format: 'markdown_latex',
        is_accepted: false,
        vote_count: 14,
        created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
    ];
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 70);
    const rand = Math.random().toString(36).substring(2, 7);
    return `${base || 'question'}-${rand}`;
  }

  /**
   * 1. Get Categories
   */
  public async getCategories() {
    try {
      const res = await pool.query(`
        SELECT c.*, 
          COALESCE(COUNT(q.id) FILTER (WHERE q.status = 'published'), 0) as question_count
        FROM community_categories c
        LEFT JOIN community_questions q ON q.category_id = c.id
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.sort_order ASC, c.name ASC
      `);
      if (res.rows.length > 0) return res.rows;
    } catch {}

    return DEFAULT_COMMUNITY_CATEGORIES.map((c, i) => ({
      id: `cat-${c.slug}`,
      ...c,
      question_count: i === 0 ? this.inMemoryQuestions.length : 4,
    }));
  }

  /**
   * 2. Get Popular Tags
   */
  public async getPopularTags(limit = 15) {
    try {
      const res = await pool.query(`
        SELECT id, name, slug, usage_count 
        FROM community_tags 
        ORDER BY usage_count DESC, name ASC 
        LIMIT $1
      `, [limit]);
      if (res.rows.length > 0) return res.rows;
    } catch {}

    return [
      { id: 't1', name: 'Calculus', slug: 'calculus', usage_count: 42 },
      { id: 't2', name: 'BUET 2026', slug: 'buet-2026', usage_count: 38 },
      { id: 't3', name: 'Physics Mechanics', slug: 'physics-mechanics', usage_count: 31 },
      { id: 't4', name: 'DU A Unit', slug: 'du-a-unit', usage_count: 27 },
      { id: 't5', name: 'Integration', slug: 'integration', usage_count: 24 },
      { id: 't6', name: 'Organic Chemistry', slug: 'organic-chemistry', usage_count: 19 },
      { id: 't7', name: 'Cutoff Marks', slug: 'cutoff-marks', usage_count: 15 },
      { id: 't8', name: 'CKRUET', slug: 'ckruet', usage_count: 12 },
    ];
  }

  /**
   * 3. Get Questions Feed with Filtering, Sorting & Pagination
   */
  public async getQuestions(params: QuestionFilterParams) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(COMMUNITY_LIMITS.MAX_PAGE_LIMIT, Math.max(1, Number(params.limit || COMMUNITY_LIMITS.DEFAULT_PAGE_LIMIT)));
    const offset = (page - 1) * limit;

    try {
      // Try Postgres first
      const conditions: string[] = ["q.status != 'deleted'"];
      const values: any[] = [];
      let valIdx = 1;

      if (params.status && params.status !== 'all') {
        conditions.push(`q.status = $${valIdx++}`);
        values.push(params.status);
      } else {
        conditions.push("q.status = 'published'");
      }

      if (params.category && params.category !== 'all') {
        conditions.push(`(c.slug = $${valIdx} OR c.name ILIKE $${valIdx})`);
        values.push(params.category);
        valIdx++;
      }

      if (params.search && params.search.trim().length > 0) {
        const q = `%${params.search.trim()}%`;
        conditions.push(`(q.title ILIKE $${valIdx} OR q.content ILIKE $${valIdx})`);
        values.push(q);
        valIdx++;
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`;
      const sessionTokenVal = params.sessionToken || '';

      const countRes = await pool.query(`
        SELECT COUNT(q.id) as total
        FROM community_questions q
        LEFT JOIN community_categories c ON q.category_id = c.id
        ${whereClause}
      `, values);
      const total = parseInt(countRes.rows[0]?.total || '0', 10);

      const dataRes = await pool.query(`
        SELECT 
          q.*,
          c.name as category_name,
          c.slug as category_slug,
          EXISTS(SELECT 1 FROM community_bookmarks bm WHERE bm.question_id = q.id AND bm.session_token = $${valIdx}) as is_bookmarked,
          COALESCE((SELECT vote FROM community_question_votes qv WHERE qv.question_id = q.id AND qv.session_token = $${valIdx}), 0) as user_vote
        FROM community_questions q
        LEFT JOIN community_categories c ON q.category_id = c.id
        ${whereClause}
        ORDER BY q.is_pinned DESC, q.last_activity_at DESC
        LIMIT $${valIdx + 1} OFFSET $${valIdx + 2}
      `, [...values, sessionTokenVal, limit, offset]);

      if (dataRes.rows.length > 0 || total > 0) {
        return {
          questions: dataRes.rows,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
            hasNextPage: page * limit < total,
          },
        };
      }
    } catch {
      // Fallback to in-memory store
    }

    // In-memory filtering
    let filtered = [...this.inMemoryQuestions].filter((q) => q.status !== 'deleted');

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(
        (q) =>
          q.category_slug === params.category ||
          q.category_name?.toLowerCase().includes(params.category!.toLowerCase())
      );
    }

    if (params.search && params.search.trim()) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.content.toLowerCase().includes(s) ||
          q.tags?.some((t: any) => t.name.toLowerCase().includes(s))
      );
    }

    if (params.onlyMine && params.sessionToken) {
      filtered = filtered.filter((q) => q.session_token === params.sessionToken || q.author_name === params.sessionToken);
    }

    if (params.onlySaved && params.sessionToken) {
      filtered = filtered.filter((q) => this.inMemoryBookmarks.has(`${q.id}_${params.sessionToken}`));
    }

    if (params.sort === 'popular') {
      filtered.sort((a, b) => b.vote_count + b.answer_count * 2 - (a.vote_count + a.answer_count * 2));
    } else if (params.sort === 'unanswered') {
      filtered.sort((a, b) => a.answer_count - b.answer_count);
    } else if (params.sort === 'most-voted') {
      filtered.sort((a, b) => b.vote_count - a.vote_count);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit).map((q) => ({
      ...q,
      is_bookmarked: params.sessionToken ? this.inMemoryBookmarks.has(`${q.id}_${params.sessionToken}`) : false,
      user_vote: params.sessionToken ? this.inMemoryVotes.get(`${q.id}_${params.sessionToken}`) || 0 : 0,
    }));

    return {
      questions: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
      },
    };
  }

  /**
   * 4. Get Question Detail By Slug
   */
  public async getQuestionBySlug(slug: string, sessionToken = '') {
    try {
      const qRes = await pool.query(`
        SELECT 
          q.*,
          c.name as category_name,
          c.slug as category_slug,
          s.name as subject_name,
          s.slug as subject_slug,
          u.name as university_name,
          u.short_name as university_short_name,
          COALESCE(
            (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
             FROM community_question_tags qt
             JOIN community_tags t ON qt.tag_id = t.id
             WHERE qt.question_id = q.id),
            '[]'::json
          ) as tags,
          EXISTS(SELECT 1 FROM community_bookmarks bm WHERE bm.question_id = q.id AND bm.session_token = $2) as is_bookmarked,
          COALESCE((SELECT vote FROM community_question_votes qv WHERE qv.question_id = q.id AND qv.session_token = $2), 0) as user_vote
        FROM community_questions q
        LEFT JOIN community_categories c ON q.category_id = c.id
        LEFT JOIN subjects s ON q.subject_id = s.id
        LEFT JOIN universities u ON q.university_id = u.id
        WHERE q.slug = $1 OR q.id::text = $1
        LIMIT 1
      `, [slug, sessionToken]);

      if (qRes.rows.length > 0) {
        const question = qRes.rows[0];
        const aRes = await pool.query(`
          SELECT a.*,
            COALESCE((SELECT vote FROM community_answer_votes av WHERE av.answer_id = a.id AND av.session_token = $2), 0) as user_vote
          FROM community_answers a
          WHERE a.question_id = $1 AND a.status = 'published'
          ORDER BY a.is_accepted DESC, a.vote_count DESC, a.created_at ASC
        `, [question.id, sessionToken]);

        const parentAnswers: any[] = [];
        const replyMap: Record<string, any[]> = {};
        for (const ans of aRes.rows) {
          if (ans.parent_answer_id) {
            if (!replyMap[ans.parent_answer_id]) replyMap[ans.parent_answer_id] = [];
            replyMap[ans.parent_answer_id].push(ans);
          } else {
            parentAnswers.push(ans);
          }
        }

        return {
          question,
          answers: parentAnswers.map((p) => ({ ...p, replies: replyMap[p.id] || [] })),
          relatedCurriculum: {
            subjectName: question.subject_name || 'Higher Mathematics',
            lessonTitle: `High-yield problem solving for ${question.subject_name || 'Admission'}`,
            lessonSlug: question.subject_slug || 'calculus',
            practiceUrl: `/practice`,
            lessonUrl: `/prepare`,
          },
        };
      }
    } catch {}

    // In-memory fallback
    const question = this.inMemoryQuestions.find((q) => q.slug === slug || q.id === slug);
    if (!question) return null;

    question.view_count = (question.view_count || 0) + 1;

    const answers = this.inMemoryAnswers.filter((a) => a.question_id === question.id && a.status !== 'deleted');
    const parentAnswers: any[] = [];
    const replyMap: Record<string, any[]> = {};

    for (const ans of answers) {
      if (ans.parent_answer_id) {
        if (!replyMap[ans.parent_answer_id]) replyMap[ans.parent_answer_id] = [];
        replyMap[ans.parent_answer_id].push(ans);
      } else {
        parentAnswers.push(ans);
      }
    }

    return {
      question: {
        ...question,
        is_bookmarked: sessionToken ? this.inMemoryBookmarks.has(`${question.id}_${sessionToken}`) : false,
        user_vote: sessionToken ? this.inMemoryVotes.get(`${question.id}_${sessionToken}`) || 0 : 0,
      },
      answers: parentAnswers.map((p) => ({
        ...p,
        replies: replyMap[p.id] || [],
        user_vote: sessionToken ? this.inMemoryVotes.get(`${p.id}_${sessionToken}`) || 0 : 0,
      })),
      relatedCurriculum: {
        subjectName: question.subject_name || question.category_name || 'Physics',
        lessonTitle: `High-yield problem solving for ${question.subject_name || 'Physics'}`,
        lessonSlug: question.subject_slug || 'physics',
        practiceUrl: `/practice`,
        lessonUrl: `/prepare`,
      },
    };
  }

  /**
   * 5. Create Question (Public, No Login Required)
   */
  public async createQuestion(input: CreateQuestionInput) {
    const title = (input.title || '').trim();
    const content = (input.content || '').trim();

    if (title.length < COMMUNITY_LIMITS.MIN_TITLE_LENGTH) {
      throw new Error(`Title must be at least ${COMMUNITY_LIMITS.MIN_TITLE_LENGTH} characters long.`);
    }
    if (content.length < COMMUNITY_LIMITS.MIN_CONTENT_LENGTH) {
      throw new Error(`Question details must be at least ${COMMUNITY_LIMITS.MIN_CONTENT_LENGTH} characters.`);
    }

    const slug = this.generateSlug(title);
    const authorName = (input.authorName || 'HSC Student').trim() || 'HSC Student';

    // Try Postgres insert
    try {
      let categoryId = input.categoryId;
      if (!categoryId && input.categorySlug) {
        const catRes = await pool.query('SELECT id FROM community_categories WHERE slug = $1 LIMIT 1', [input.categorySlug]);
        if (catRes.rows.length > 0) categoryId = catRes.rows[0].id;
      }
      if (!categoryId) {
        const defaultCat = await pool.query('SELECT id FROM community_categories ORDER BY sort_order ASC LIMIT 1');
        categoryId = defaultCat.rows[0]?.id;
      }

      if (categoryId) {
        const insertRes = await pool.query(`
          INSERT INTO community_questions (
            author_name,
            author_role,
            author_badge,
            is_verified_author,
            title,
            slug,
            content,
            category_id,
            question_type,
            unit,
            status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published')
          RETURNING *
        `, [
          authorName,
          input.authorRole || 'student',
          input.authorBadge || null,
          input.authorRole === 'teacher' || input.authorRole === 'senior',
          title,
          slug,
          content,
          categoryId,
          input.questionType || 'Problem Solving',
          input.unit || null,
        ]);
        return insertRes.rows[0];
      }
    } catch {
      // Fallback
    }

    // In-memory insert
    const catMap: Record<string, string> = {
      mathematics: 'Higher Mathematics',
      physics: 'Physics',
      chemistry: 'Chemistry',
      admission: 'Admission Circulars & Guidelines',
      biology: 'Biology',
      english: 'English & General Knowledge',
      university: 'University Guidance & Prep',
    };

    const newQuestion = {
      id: `q-${Date.now()}`,
      session_token: input.sessionToken,
      title,
      slug,
      content,
      content_format: 'markdown_latex',
      author_name: authorName,
      author_role: input.authorRole || 'student',
      is_verified_author: false,
      author_badge: input.authorBadge || null,
      question_type: input.questionType || 'Problem Solving',
      category_name: catMap[input.categorySlug || 'mathematics'] || 'General',
      category_slug: input.categorySlug || 'mathematics',
      subject_name: input.categorySlug === 'mathematics' ? 'Higher Mathematics' : input.categorySlug === 'physics' ? 'Physics' : undefined,
      subject_slug: input.categorySlug || undefined,
      unit: input.unit || null,
      status: 'published',
      accepted_answer_id: null,
      answer_count: 0,
      vote_count: 0,
      view_count: 1,
      is_pinned: false,
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      tags: (input.tags || []).map((t, idx) => ({ id: `t-${idx}`, name: t, slug: t.toLowerCase() })),
    };

    this.inMemoryQuestions.unshift(newQuestion);
    return newQuestion;
  }

  /**
   * 6. Create Answer / Reply
   */
  public async createAnswer(input: CreateAnswerInput) {
    const content = (input.content || '').trim();
    if (content.length < 3) throw new Error('Answer must contain at least 3 characters.');

    const authorName = (input.authorName || 'Community Contributor').trim() || 'Community Contributor';

    try {
      const aRes = await pool.query(`
        INSERT INTO community_answers (
          question_id,
          parent_answer_id,
          author_name,
          author_role,
          author_badge,
          is_verified_author,
          content,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
        RETURNING *
      `, [
        input.questionId,
        input.parentAnswerId || null,
        authorName,
        input.authorRole || 'student',
        input.authorBadge || null,
        input.authorRole === 'teacher' || input.authorRole === 'senior',
        content,
      ]);
      await pool.query('UPDATE community_questions SET answer_count = answer_count + 1 WHERE id = $1', [input.questionId]);
      return aRes.rows[0];
    } catch {}

    const newAnswer = {
      id: `ans-${Date.now()}`,
      question_id: input.questionId,
      parent_answer_id: input.parentAnswerId || null,
      author_name: authorName,
      author_role: input.authorRole || 'student',
      is_verified_author: false,
      author_badge: input.authorBadge || null,
      content,
      content_format: 'markdown_latex',
      is_accepted: false,
      vote_count: 0,
      created_at: new Date().toISOString(),
      replies: [],
    };

    this.inMemoryAnswers.push(newAnswer);

    // Increment answer count on in-memory question
    const q = this.inMemoryQuestions.find((item) => item.id === input.questionId);
    if (q) {
      q.answer_count = (q.answer_count || 0) + 1;
      q.last_activity_at = new Date().toISOString();
    }

    return newAnswer;
  }

  /**
   * 7. Vote on Question
   */
  public async voteQuestion(questionId: string, sessionToken: string, voteVal: number) {
    const normalized = voteVal > 0 ? 1 : voteVal < 0 ? -1 : 0;
    try {
      if (normalized === 0) {
        await pool.query('DELETE FROM community_question_votes WHERE question_id = $1 AND session_token = $2', [questionId, sessionToken]);
      } else {
        await pool.query(`
          INSERT INTO community_question_votes (question_id, session_token, vote)
          VALUES ($1, $2, $3)
          ON CONFLICT (question_id, session_token) DO UPDATE SET vote = $3
        `, [questionId, sessionToken, normalized]);
      }
      const countRes = await pool.query('SELECT COALESCE(SUM(vote), 0) as total FROM community_question_votes WHERE question_id = $1', [questionId]);
      const total = parseInt(countRes.rows[0]?.total || '0', 10);
      await pool.query('UPDATE community_questions SET vote_count = $1 WHERE id = $2', [total, questionId]);
      return { questionId, voteCount: total, userVote: normalized };
    } catch {}

    const key = `${questionId}_${sessionToken}`;
    const previousVote = this.inMemoryVotes.get(key) || 0;
    this.inMemoryVotes.set(key, normalized);

    const q = this.inMemoryQuestions.find((item) => item.id === questionId);
    if (q) {
      q.vote_count = (q.vote_count || 0) + (normalized - previousVote);
    }
    return { questionId, voteCount: q?.vote_count || 0, userVote: normalized };
  }

  /**
   * 8. Vote on Answer
   */
  public async voteAnswer(answerId: string, sessionToken: string, voteVal: number) {
    const normalized = voteVal > 0 ? 1 : voteVal < 0 ? -1 : 0;
    try {
      if (normalized === 0) {
        await pool.query('DELETE FROM community_answer_votes WHERE answer_id = $1 AND session_token = $2', [answerId, sessionToken]);
      } else {
        await pool.query(`
          INSERT INTO community_answer_votes (answer_id, session_token, vote)
          VALUES ($1, $2, $3)
          ON CONFLICT (answer_id, session_token) DO UPDATE SET vote = $3
        `, [answerId, sessionToken, normalized]);
      }
      const countRes = await pool.query('SELECT COALESCE(SUM(vote), 0) as total FROM community_answer_votes WHERE answer_id = $1', [answerId]);
      const total = parseInt(countRes.rows[0]?.total || '0', 10);
      await pool.query('UPDATE community_answers SET vote_count = $1 WHERE id = $2', [total, answerId]);
      return { answerId, voteCount: total, userVote: normalized };
    } catch {}

    const key = `${answerId}_${sessionToken}`;
    const previousVote = this.inMemoryVotes.get(key) || 0;
    this.inMemoryVotes.set(key, normalized);

    const a = this.inMemoryAnswers.find((item) => item.id === answerId);
    if (a) {
      a.vote_count = (a.vote_count || 0) + (normalized - previousVote);
    }
    return { answerId, voteCount: a?.vote_count || 0, userVote: normalized };
  }

  /**
   * 9. Accept Answer
   */
  public async acceptAnswer(questionId: string, answerId: string, sessionToken = '') {
    try {
      await pool.query('UPDATE community_answers SET is_accepted = false WHERE question_id = $1', [questionId]);
      await pool.query('UPDATE community_answers SET is_accepted = true WHERE id = $1 AND question_id = $2', [answerId, questionId]);
      await pool.query('UPDATE community_questions SET accepted_answer_id = $1 WHERE id = $2', [answerId, questionId]);
      return { questionId, acceptedAnswerId: answerId };
    } catch {}

    const q = this.inMemoryQuestions.find((item) => item.id === questionId);
    if (q) q.accepted_answer_id = answerId;

    for (const a of this.inMemoryAnswers) {
      if (a.question_id === questionId) {
        a.is_accepted = a.id === answerId;
      }
    }
    return { questionId, acceptedAnswerId: answerId };
  }

  /**
   * 10. Bookmark Question
   */
  public async toggleBookmark(questionId: string, sessionToken: string) {
    try {
      const existing = await pool.query('SELECT id FROM community_bookmarks WHERE question_id = $1 AND session_token = $2', [questionId, sessionToken]);
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM community_bookmarks WHERE question_id = $1 AND session_token = $2', [questionId, sessionToken]);
        return { questionId, isBookmarked: false };
      } else {
        await pool.query('INSERT INTO community_bookmarks (question_id, session_token) VALUES ($1, $2)', [questionId, sessionToken]);
        return { questionId, isBookmarked: true };
      }
    } catch {}

    const key = `${questionId}_${sessionToken}`;
    if (this.inMemoryBookmarks.has(key)) {
      this.inMemoryBookmarks.delete(key);
      return { questionId, isBookmarked: false };
    } else {
      this.inMemoryBookmarks.add(key);
      return { questionId, isBookmarked: true };
    }
  }

  /**
   * 11. Report Content
   */
  public async reportContent(params: { questionId?: string; answerId?: string; reason: string; description?: string; sessionToken: string }) {
    try {
      await pool.query(`
        INSERT INTO community_reports (session_token, question_id, answer_id, reason, description)
        VALUES ($1, $2, $3, $4, $5)
      `, [params.sessionToken, params.questionId || null, params.answerId || null, params.reason, params.description || null]);
    } catch {
      this.inMemoryReports.push({ id: `rep-${Date.now()}`, ...params, created_at: new Date().toISOString() });
    }
    return { success: true, message: 'Thank you. The report has been logged for moderator review.' };
  }

  /**
   * 12. Similar Questions
   */
  public async getSimilarQuestions(queryText: string) {
    if (!queryText || queryText.trim().length < 4) return [];
    const q = queryText.toLowerCase();

    const matches = this.inMemoryQuestions.filter(
      (item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
    );
    return matches.slice(0, 4).map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      answer_count: m.answer_count || 0,
      vote_count: m.vote_count || 0,
    }));
  }

  /**
   * 13. Admin Moderation
   */
  public async getAdminQuestions(status = 'all', page = 1, limit = 50) {
    try {
      const cond = status === 'all' ? '' : `WHERE q.status = '${status}'`;
      const res = await pool.query(`
        SELECT q.*, c.name as category_name
        FROM community_questions q
        LEFT JOIN community_categories c ON q.category_id = c.id
        ${cond}
        ORDER BY q.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, (page - 1) * limit]);
      if (res.rows.length > 0) return res.rows;
    } catch {}

    let list = [...this.inMemoryQuestions];
    if (status !== 'all') {
      list = list.filter((item) => item.status === status);
    }
    return list;
  }

  public async moderateQuestion(id: string, action: 'hide' | 'restore' | 'flag' | 'delete') {
    const statusMap: Record<string, string> = {
      hide: 'hidden',
      restore: 'published',
      flag: 'flagged',
      delete: 'deleted',
    };
    const targetStatus = statusMap[action] || 'hidden';
    try {
      await pool.query('UPDATE community_questions SET status = $1 WHERE id = $2', [targetStatus, id]);
    } catch {}

    const q = this.inMemoryQuestions.find((item) => item.id === id);
    if (q) q.status = targetStatus;
    return { id, status: targetStatus, message: `Question marked as ${targetStatus}.` };
  }

  public async getAdminReports() {
    try {
      const res = await pool.query(`
        SELECT r.*, q.title as question_title, q.slug as question_slug
        FROM community_reports r
        LEFT JOIN community_questions q ON r.question_id = q.id
        ORDER BY r.created_at DESC
      `);
      if (res.rows.length > 0) return res.rows;
    } catch {}

    return this.inMemoryReports;
  }

  public async resolveReport(reportId: string, action: 'resolve' | 'dismiss') {
    const status = action === 'resolve' ? 'resolved' : 'dismissed';
    try {
      await pool.query('UPDATE community_reports SET status = $1, reviewed_at = NOW() WHERE id = $2', [status, reportId]);
    } catch {}
    const r = this.inMemoryReports.find((item) => item.id === reportId);
    if (r) r.status = status;
    return { reportId, status };
  }
}

export const communityService = new CommunityService();
