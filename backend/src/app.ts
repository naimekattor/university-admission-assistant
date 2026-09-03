import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config';
import { apiRouter } from './routes/api.routes';
import { uploadRouter } from './routes/upload.routes';
import { errorHandler } from './middleware/error.middleware';
import { extractSession } from './middleware/auth.middleware';

export function createApp(): Express {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Session extraction
  app.use(extractSession);

  // Serve persistent uploaded static assets
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Render.com Health & Ping checks (Top-level & API level)
  app.get(['/health', '/ping'], (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'EduGuide Backend API',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Upload Router and API Router
  app.use('/api', uploadRouter);
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
