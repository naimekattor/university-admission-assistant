import { Router, Request, Response, NextFunction } from 'express';
import { communityService } from './community.service';

export const communityRouter = Router();

/**
 * 1. GET /api/community/categories
 */
communityRouter.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await communityService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. GET /api/community/tags/popular
 */
communityRouter.get('/tags/popular', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit || 15);
    const tags = await communityService.getPopularTags(limit);
    res.json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
});

/**
 * 3. GET /api/community/similar
 */
communityRouter.get('/similar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.query.q || '');
    const similar = await communityService.getSimilarQuestions(query);
    res.json({ success: true, data: similar });
  } catch (error) {
    next(error);
  }
});

/**
 * 4. GET /api/community/questions
 */
communityRouter.get('/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = (req.query.sessionToken as string) || (req.headers['x-session-id'] as string) || '';
    const result = await communityService.getQuestions({
      category: req.query.category as string,
      subject: req.query.subject as string,
      university: req.query.university as string,
      questionType: req.query.questionType as string,
      search: req.query.search as string,
      sort: req.query.sort as any,
      status: req.query.status as string,
      sessionToken,
      onlyMine: req.query.onlyMine === 'true',
      onlySaved: req.query.onlySaved === 'true',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 15,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 5. GET /api/community/questions/:slug
 */
communityRouter.get('/questions/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const sessionToken = (req.query.sessionToken as string) || (req.headers['x-session-id'] as string) || '';
    const detail = await communityService.getQuestionBySlug(slug, sessionToken);
    if (!detail) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, data: detail });
  } catch (error) {
    next(error);
  }
});

/**
 * 6. POST /api/community/questions (Public, No Login Wall)
 */
communityRouter.post('/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = (req.body.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const created = await communityService.createQuestion({
      ...req.body,
      sessionToken,
    });
    res.status(201).json({ success: true, message: 'Question posted successfully!', data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to post question' });
  }
});

/**
 * 7. POST /api/community/questions/:questionId/answers (Public, No Login Wall)
 */
communityRouter.post('/questions/:questionId/answers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Array.isArray(req.params.questionId) ? req.params.questionId[0] : req.params.questionId;
    const sessionToken = (req.body.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const created = await communityService.createAnswer({
      ...req.body,
      questionId,
      sessionToken,
    });
    res.status(201).json({ success: true, message: 'Answer posted successfully!', data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to post answer' });
  }
});

/**
 * 8. POST /api/community/questions/:id/vote
 */
communityRouter.post('/questions/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionToken = (req.body?.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const vote = Number(req.body?.vote ?? 1);
    const result = await communityService.voteQuestion(id, sessionToken, vote);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to vote' });
  }
});

/**
 * 9. POST /api/community/answers/:id/vote
 */
communityRouter.post('/answers/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionToken = (req.body?.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const vote = Number(req.body?.vote ?? 1);
    const result = await communityService.voteAnswer(id, sessionToken, vote);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to vote' });
  }
});

/**
 * 10. POST /api/community/questions/:questionId/accept-answer/:answerId
 */
communityRouter.post('/questions/:questionId/accept-answer/:answerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = Array.isArray(req.params.questionId) ? req.params.questionId[0] : req.params.questionId;
    const answerId = Array.isArray(req.params.answerId) ? req.params.answerId[0] : req.params.answerId;
    const sessionToken = (req.body?.sessionToken as string) || (req.headers['x-session-id'] as string) || '';
    const result = await communityService.acceptAnswer(questionId, answerId, sessionToken);
    res.json({ success: true, message: 'Answer marked as accepted!', data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to accept answer' });
  }
});

/**
 * 11. POST /api/community/questions/:id/bookmark
 */
communityRouter.post('/questions/:id/bookmark', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const sessionToken = (req.body?.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const result = await communityService.toggleBookmark(id, sessionToken);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to toggle bookmark' });
  }
});

/**
 * 12. POST /api/community/report
 */
communityRouter.post('/report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = (req.body.sessionToken as string) || (req.headers['x-session-id'] as string) || 'guest-session';
    const result = await communityService.reportContent({
      ...req.body,
      sessionToken,
    });
    res.json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to submit report' });
  }
});

/**
 * 13. ADMIN COMMUNITY ENDPOINTS
 */
communityRouter.get('/admin/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = (req.query.status as string) || 'all';
    const page = Number(req.query.page || 1);
    const questions = await communityService.getAdminQuestions(status, page, 50);
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
});

communityRouter.post('/admin/questions/:id/moderate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const action = req.body.action as 'hide' | 'restore' | 'flag' | 'delete';
    const result = await communityService.moderateQuestion(id, action);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

communityRouter.get('/admin/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await communityService.getAdminReports();
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
});

communityRouter.post('/admin/reports/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const action = req.body.action as 'resolve' | 'dismiss';
    const result = await communityService.resolveReport(id, action);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
