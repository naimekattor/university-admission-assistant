import express, { Express } from 'express';
import cors from 'cors';
import { ENV } from './config';
import { apiRouter } from './routes/api.routes';
import { errorHandler } from './middleware/error.middleware';
import { extractSession } from './middleware/auth.middleware';

export function createApp(): Express {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Session extraction
  app.use(extractSession);

  // Mount API router
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
