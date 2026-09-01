import { createApp } from './app';
import { ENV } from './config';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`[EduGuide Backend] Server listening on http://localhost:${ENV.PORT} (ENV: ${ENV.NODE_ENV})`);
});
