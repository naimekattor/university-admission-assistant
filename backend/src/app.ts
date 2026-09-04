import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config';
import { apiRouter } from './routes/api.routes';
import { uploadRouter } from './routes/upload.routes';
import { communityRouter } from './modules/community/community.routes';
import { errorHandler } from './middleware/error.middleware';
import { extractSession } from './middleware/auth.middleware';

export function createApp(): Express {
  const app = express();

  // Parse allowed origins from environment variable (strip trailing slashes, handle comma-separated list)
  const rawOrigins = ENV.CORS_ORIGIN || '*';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // If wildcard is enabled, allow and echo the request origin (needed for credentials)
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === normalizedOrigin) return true;
        // Support all Vercel deployment preview and production domains if vercel.app is present
        if (
          allowed.includes('vercel.app') &&
          normalizedOrigin.endsWith('.vercel.app')
        ) {
          return true;
        }
        // Support localhost for local testing
        if (allowed.includes('localhost') && normalizedOrigin.includes('localhost')) {
          return true;
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from unauthorized origin: "${origin}"`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'x-session-id',
      'Origin',
    ],
    optionsSuccessStatus: 204,
  };

  // Basic security and parsing middleware (cors handles all HTTP methods including OPTIONS)
  app.use(cors(corsOptions));
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

  // Mount Upload Router, Community Router and API Router
  app.use('/api', uploadRouter);
  app.use('/api/community', communityRouter);
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
