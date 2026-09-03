import { Router, Request, Response } from 'express';
import { aiOrchestratorService } from '../modules/ai/ai-orchestrator.service';
import { eligibilityService } from '../modules/eligibility/eligibility.service';
import { preparationService } from '../modules/preparation/preparation.service';
import { practiceService } from '../modules/practice/practice.service';
import { examsService } from '../modules/exams/exams.service';
import { studyPlanService } from '../modules/study-plans/study-plan.service';
import { ragService } from '../modules/rag/rag.service';
import { admissionService } from '../modules/admission/admission.service';
import { db, sessions, chatMessages } from '../db';
import { eq, asc } from 'drizzle-orm';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'EduGuide Backend API', timestamp: new Date().toISOString() });
});

// AI Advisor & Tutor Endpoint with PostgreSQL Session & Chat Persistence
apiRouter.post('/ai/query', async (req: Request, res: Response, next) => {
  try {
    const { roleType = 'advisor', userQuery, studentContext, sessionToken: providedToken } = req.body;
    const token = providedToken || (req.headers['x-session-id'] as string) || 'sess_default';

    // 1. Find or create session record in PostgreSQL
    let sessionRecord: any = null;
    try {
      sessionRecord = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, token),
      });

      if (!sessionRecord) {
        const [newSess] = await db.insert(sessions).values({
          sessionToken: token,
          userAgent: (req.headers['user-agent'] as string) || 'web',
          ipAddress: req.ip || '127.0.0.1',
        }).returning();
        sessionRecord = newSess;
      } else {
        await db.update(sessions).set({ lastActiveAt: new Date() }).where(eq(sessions.id, sessionRecord.id));
      }

      // 2. Persist student user query to PostgreSQL
      if (sessionRecord && userQuery) {
        await db.insert(chatMessages).values({
          sessionId: sessionRecord.id,
          role: 'user',
          content: userQuery,
        });
      }
    } catch (dbErr: any) {
      console.warn('[ChatPersistence] Error saving user message:', dbErr.message);
    }

    // 3. Process AI query
    const result = await aiOrchestratorService.processQuery({
      roleType,
      userQuery,
      studentContext,
    });

    // 4. Persist AI assistant response to PostgreSQL
    try {
      if (sessionRecord && result) {
        await db.insert(chatMessages).values({
          sessionId: sessionRecord.id,
          role: 'assistant',
          content: typeof result === 'string' ? result : JSON.stringify(result),
        });
      }
    } catch (dbErr: any) {
      console.warn('[ChatPersistence] Error saving assistant response:', dbErr.message);
    }

    res.json({ success: true, data: result, sessionToken: token });
  } catch (error) {
    next(error);
  }
});

// Chat History Retrieval from PostgreSQL
apiRouter.get('/ai/chat/history', async (req: Request, res: Response, next) => {
  try {
    const token = (req.query.sessionToken as string) || (req.headers['x-session-id'] as string);
    if (!token) {
      return res.json({ success: true, messages: [] });
    }

    const sessionRecord = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, token),
    });

    if (!sessionRecord) {
      return res.json({ success: true, messages: [] });
    }

    const rows = await db.query.chatMessages.findMany({
      where: eq(chatMessages.sessionId, sessionRecord.id),
      orderBy: [asc(chatMessages.createdAt)],
    });

    const formatted = rows.map((r) => {
      let content = r.content;
      try {
        if (typeof r.content === 'string' && (r.content.startsWith('{') || r.content.startsWith('['))) {
          content = JSON.parse(r.content);
        }
      } catch {}
      return {
        id: r.id,
        role: r.role as 'user' | 'assistant',
        content,
        createdAt: r.createdAt,
      };
    });

    res.json({ success: true, messages: formatted });
  } catch (error) {
    next(error);
  }
});

// Deterministic Eligibility Check Endpoint (Evaluates with Live PostgreSQL Circular Rules)
apiRouter.post('/eligibility/check', async (req: Request, res: Response, next) => {
  try {
    const { sscGPA, hscGPA, group, passingYear } = req.body;
    const result = await eligibilityService.evaluateSummary({
      sscGPA: Number(sscGPA || 5.0),
      hscGPA: Number(hscGPA || 5.0),
      group: group || 'Science',
      passingYear: Number(passingYear || 2026),
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Preparation Curriculum Endpoints
apiRouter.get('/preparation/subjects', async (req: Request, res: Response, next) => {
  try {
    const subjects = await preparationService.getAllSubjects();
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/preparation/subjects/:slug/chapters', async (req: Request, res: Response, next) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const chapters = await preparationService.getChaptersBySubjectSlug(slug);
    res.json({ success: true, data: chapters });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/preparation/lessons/:slug', async (req: Request, res: Response, next) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const lesson = await preparationService.getLessonBySlug(slug);
    res.json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
});

// Practice Engine Endpoints
apiRouter.get('/practice/questions', async (req: Request, res: Response, next) => {
  try {
    const chapterSlug = typeof req.query.chapter === 'string' ? req.query.chapter : 'newtons-mechanics';
    const questions = await practiceService.getQuestionsByChapter(chapterSlug);
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
});

// Diagnostic Assessment Endpoint
apiRouter.post('/exams/diagnostic/submit', (req: Request, res: Response, next) => {
  try {
    const { answers } = req.body;
    const evaluation = examsService.evaluateDiagnostic(answers || []);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
});

// Study Plan Endpoint
apiRouter.post('/study-plan/generate', (req: Request, res: Response, next) => {
  try {
    const plan = studyPlanService.generatePlan(req.body);
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

// RAG Documents Search Endpoint
apiRouter.get('/rag/search', async (req: Request, res: Response, next) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : 'BUET eligibility';
    const university = typeof req.query.university === 'string' ? req.query.university : undefined;
    const docs = await ragService.searchDocuments({ query, university });
    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// HOMEPAGE & ADMISSION INTELLIGENCE ENDPOINTS
// ==========================================
import { homepageService } from '../modules/homepage/homepage.service';

// Public Aggregated Homepage Endpoint
apiRouter.get('/homepage', async (req: Request, res: Response, next) => {
  try {
    const isPreview = req.query.preview === 'true';
    const data = await homepageService.getPublicHomepageData(isPreview);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Dedicated Public Admissions Directory Endpoint (Supports query params: search, group, status, sortBy, page, limit)
apiRouter.get('/admissions', async (req: Request, res: Response, next) => {
  try {
    const search = req.query.search as string;
    const group = req.query.group as string;
    const status = req.query.status as string;
    const sortBy = req.query.sortBy as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

    const result = await homepageService.getAdmissionsDirectory({
      search,
      group,
      status,
      sortBy,
      page,
      limit,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Public Upcoming Deadlines Endpoint
apiRouter.get('/deadlines', async (req: Request, res: Response, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    const deadlines = await homepageService.getUpcomingDeadlines(limit);
    res.json({ success: true, data: deadlines });
  } catch (error) {
    next(error);
  }
});


// Create University Endpoint
apiRouter.post('/universities', async (req: Request, res: Response, next) => {
  try {
    const created = await homepageService.createUniversity(req.body);
    res.json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// Delete University Endpoint
apiRouter.delete('/universities/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteUniversity(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Public FAQs Endpoint
apiRouter.get('/faqs', async (req: Request, res: Response, next) => {
  try {
    const faqs = await homepageService.getPublishedFaqs();
    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
});

// Public SEO Guides Endpoint
apiRouter.get('/guides', async (req: Request, res: Response, next) => {
  try {
    const limit = Number(req.query.limit || 50);
    const guides = await homepageService.getPublishedGuides(limit);
    res.json({ success: true, data: guides });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/guides/:slug', async (req: Request, res: Response, next) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const guide = await homepageService.getGuideBySlug(slug);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide article not found.' });
    }
    res.json({ success: true, data: guide });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ADMIN HOMEPAGE CMS ENDPOINTS
// ==========================================

apiRouter.get('/admin/homepage', async (req: Request, res: Response, next) => {
  try {
    const data = await homepageService.getAdminHomepageData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Full Homepage Configuration POST/Save endpoint
apiRouter.post('/admin/homepage', async (req: Request, res: Response, next) => {
  try {
    const updated = await homepageService.saveFullConfig(req.body);
    res.json({ success: true, message: 'Homepage configuration saved to PostgreSQL database.', data: updated });
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/admin/homepage/section/:section', async (req: Request, res: Response, next) => {
  try {
    const section = Array.isArray(req.params.section) ? req.params.section[0] : req.params.section;
    const updated = await homepageService.saveDraftSection(section, req.body);
    res.json({ success: true, message: `Draft section '${section}' saved successfully.`, data: updated });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/admin/homepage/publish', async (req: Request, res: Response, next) => {
  try {
    const result = await homepageService.publishHomepage();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/admin/homepage/faqs', async (req: Request, res: Response, next) => {
  try {
    const faqs = await homepageService.getAllFaqs();
    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/admin/homepage/faqs', async (req: Request, res: Response, next) => {
  try {
    const result = await homepageService.saveFaq(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/admin/homepage/faqs/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.saveFaq({ ...req.body, id });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/admin/homepage/faqs/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteFaq(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/admin/homepage/guides', async (req: Request, res: Response, next) => {
  try {
    const guides = await homepageService.getAllGuides();
    res.json({ success: true, data: guides });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/admin/homepage/guides', async (req: Request, res: Response, next) => {
  try {
    const result = await homepageService.saveGuide(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/admin/homepage/guides/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.saveGuide({ ...req.body, id });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/admin/homepage/guides/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteGuide(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// UNIVERSITIES CRUD ENDPOINTS
// ==========================================
apiRouter.get('/universities', async (req: Request, res: Response, next) => {
  try {
    const data = await homepageService.getAllUniversities();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/universities/:slug', async (req: Request, res: Response, next) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const data = await homepageService.getUniversityBySlug(slug);
    if (!data) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/universities', async (req: Request, res: Response, next) => {
  try {
    const result = await homepageService.createUniversity(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/universities/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.updateUniversity(id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/universities/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteUniversity(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/admin/homepage/universities/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteUniversity(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// DEADLINES & ADMISSION EVENTS CRUD ENDPOINTS
// ==========================================
apiRouter.get('/deadlines', async (req: Request, res: Response, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const data = await homepageService.getUpcomingDeadlines(limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/admin/homepage/deadlines', async (req: Request, res: Response, next) => {
  try {
    const data = await homepageService.getUpcomingDeadlines(50);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/admin/homepage/deadlines', async (req: Request, res: Response, next) => {
  try {
    const result = await homepageService.saveDeadline(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete('/admin/homepage/deadlines/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await homepageService.deleteDeadline(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ADMIN CONTROL PANEL ENDPOINTS
// ==========================================

apiRouter.get('/admin/overview-stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      totalStudents: 1420,
      activeSessions24h: 385,
      totalQuestionsSolved: 18450,
      totalMockTestsCompleted: 1240,
      aiUsage: {
        totalRequests: 4890,
        totalInputTokens: 1250000,
        totalOutputTokens: 680000,
        estimatedCostUsd: 0.84,
        modelBreakdown: {
          'gemini-3.6-flash': 3400,
          'embedding-001': 1490,
        },
      },
      dailyUsageGraph: [
        { date: 'Mon', requests: 420, activeUsers: 110 },
        { date: 'Tue', requests: 580, activeUsers: 145 },
        { date: 'Wed', requests: 720, activeUsers: 180 },
        { date: 'Thu', requests: 890, activeUsers: 220 },
        { date: 'Fri', requests: 950, activeUsers: 250 },
        { date: 'Sat', requests: 1120, activeUsers: 290 },
        { date: 'Sun', requests: 1350, activeUsers: 340 },
      ],
    },
  });
});

apiRouter.get('/admin/users', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'usr-1', name: 'Tanvir Hossain', group: 'Science', sscGpa: 5.0, hscGpa: 5.0, target: 'BUET CSE', passingYear: 2024, lastActive: '10 mins ago', status: 'Active' },
      { id: 'usr-2', name: 'Nusrat Jahan', group: 'Science', sscGpa: 5.0, hscGpa: 4.92, target: 'DU Ka Unit', passingYear: 2024, lastActive: '45 mins ago', status: 'Active' },
      { id: 'usr-3', name: 'Rahim Ahmed', group: 'Science', sscGpa: 4.8, hscGpa: 4.75, target: 'KUET EEE', passingYear: 2024, lastActive: '2 hours ago', status: 'Active' },
    ],
  });
});

apiRouter.post('/admin/content/question', (req: Request, res: Response) => {
  const { questionText, subject, chapter, options, correctOptionIndex, explanation } = req.body;
  res.json({
    success: true,
    message: 'Question successfully published to question bank!',
    questionId: `q-${Date.now()}`,
  });
});

apiRouter.post('/admin/content/article', (req: Request, res: Response) => {
  const { title, slug, summary, content, category } = req.body;
  res.json({
    success: true,
    message: 'Article guide published to knowledge base & SEO feed!',
    articleId: `art-${Date.now()}`,
  });
});

// ==========================================
// UNIFIED ADMISSION INTELLIGENCE ENDPOINTS
// ==========================================

// Get all circulars with joined universities
apiRouter.get('/admin/circulars', async (req: Request, res: Response, next) => {
  try {
    const data = await admissionService.getCirculars();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get circular by ID
apiRouter.get('/admin/circulars/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await admissionService.getCircularById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Circular not found' });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Create new circular
apiRouter.post('/admin/circulars', async (req: Request, res: Response, next) => {
  try {
    const created = await admissionService.createCircular(req.body);
    res.status(201).json({ success: true, message: 'Circular created successfully', data: created });
  } catch (error) {
    next(error);
  }
});

// Update circular
apiRouter.put('/admin/circulars/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await admissionService.updateCircular(id, req.body);
    res.json({ success: true, message: 'Circular updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
});

// Delete circular
apiRouter.delete('/admin/circulars/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await admissionService.deleteCircular(id);
    res.json({ success: true, message: 'Circular deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Universities dropdown helper for unit/circular creators
apiRouter.get('/admin/universities/dropdown', async (req: Request, res: Response, next) => {
  try {
    const data = await admissionService.getUniversitiesDropdown();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ACADEMIC PROGRAMS & DEGREES ENDPOINTS
// ==========================================

// Get all programs joined with university and unit circular
apiRouter.get('/admin/programs', async (req: Request, res: Response, next) => {
  try {
    const data = await admissionService.getPrograms();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Create academic program
apiRouter.post('/admin/programs', async (req: Request, res: Response, next) => {
  try {
    const created = await admissionService.createProgram(req.body);
    res.status(201).json({ success: true, message: 'Program created successfully', data: created });
  } catch (error) {
    next(error);
  }
});

// Update program
apiRouter.put('/admin/programs/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await admissionService.updateProgram(id, req.body);
    res.json({ success: true, message: 'Program updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
});

// Delete program
apiRouter.delete('/admin/programs/:id', async (req: Request, res: Response, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await admissionService.deleteProgram(id);
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
});
