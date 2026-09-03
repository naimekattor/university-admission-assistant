import { createApp } from './app';
import { ENV } from './config';
import { pool } from './db';
import { autoMigrateDatabase } from './db/migrate-schema';

async function bootstrap() {
  // Ensure all tables & columns exist before listening
  await autoMigrateDatabase(pool);

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`[EduGuide Backend] Server listening on http://localhost:${ENV.PORT} (ENV: ${ENV.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  console.error('[EduGuide Backend] Bootstrap failed:', err);
});
