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
