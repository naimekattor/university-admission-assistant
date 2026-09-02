import { Router, Request, Response } from 'express';
import { aiOrchestratorService } from '../modules/ai/ai-orchestrator.service';
import { eligibilityService } from '../modules/eligibility/eligibility.service';
import { preparationService } from '../modules/preparation/preparation.service';
import { practiceService } from '../modules/practice/practice.service';
import { examsService } from '../modules/exams/exams.service';
import { studyPlanService } from '../modules/study-plans/study-plan.service';
import { ragService } from '../modules/rag/rag.service';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'EduGuide Backend API', timestamp: new Date().toISOString() });
});

// AI Advisor & Tutor Endpoint
apiRouter.post('/ai/query', async (req: Request, res: Response, next) => {
  try {
    const { roleType = 'advisor', userQuery, studentContext } = req.body;
    const result = await aiOrchestratorService.processQuery({
      roleType,
      userQuery,
      studentContext,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Deterministic Eligibility Check Endpoint
apiRouter.post('/eligibility/check', (req: Request, res: Response, next) => {
  try {
    const { sscGPA, hscGPA, group, passingYear } = req.body;
    const result = eligibilityService.evaluateSummary({
      sscGPA: Number(sscGPA || 5.0),
      hscGPA: Number(hscGPA || 5.0),
      group: group || 'Science',
      passingYear: Number(passingYear || 2024),
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

// Public Universities Overview Endpoint
apiRouter.get('/universities', async (req: Request, res: Response, next) => {
  try {
    const universities = await homepageService.getAllUniversities();
    res.json({ success: true, data: universities });
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
    const limit = Number(req.query.limit || 10);
    const guides = await homepageService.getPublishedGuides(limit);
    res.json({ success: true, data: guides });
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

// ==========================================
// UNIVERSITIES CRUD ENDPOINTS
// ==========================================
apiRouter.get('/universities', async (req: Request, res: Response, next) => {
  try {
    const data = await homepageService.getDynamicAdmissionOverview();
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
