import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  sessionId?: string;
  studentId?: string;
}

export function extractSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionHeader = req.headers['x-session-id'] || req.headers['authorization'];
  const cookieSession = req.cookies ? req.cookies['admission_session_id'] : undefined;

  req.sessionId = (sessionHeader as string) || cookieSession || 'anonymous-session';
  next();
}
