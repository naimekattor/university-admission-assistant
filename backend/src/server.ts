import { createApp } from './app';
import { ENV } from './config';
import { pool } from './db';
import { autoMigrateDatabase } from './db/migrate-schema';
import { startKeepAliveCron, stopKeepAliveCron } from './services/cron.service';

async function bootstrap() {
  // Ensure all tables & columns exist before listening
  await autoMigrateDatabase(pool);

  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`[EduGuide Backend] Server listening on http://localhost:${ENV.PORT} (ENV: ${ENV.NODE_ENV})`);
    
    // Initialize keep-alive cron for Render.com (pings every 14 mins to prevent spin-down)
    startKeepAliveCron();
  });

  // Graceful shutdown
  const handleShutdown = (signal: string) => {
    console.log(`[EduGuide Backend] Received ${signal}. Shutting down gracefully...`);
    stopKeepAliveCron();
    server.close(() => {
      console.log('[EduGuide Backend] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[EduGuide Backend] Bootstrap failed:', err);
});

