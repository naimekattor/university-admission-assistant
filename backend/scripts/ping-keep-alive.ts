import { pingKeepAlive, getKeepAliveTargetUrl } from '../src/services/cron.service';

async function main() {
  console.log('==================================================');
  console.log(' EduGuide - Render.com Keep-Alive Ping Utility');
  console.log('==================================================');
  
  const targetUrl = getKeepAliveTargetUrl();
  console.log(`Target URL: ${targetUrl || '(Not specified, set RENDER_EXTERNAL_URL or BACKEND_URL)'}`);

  const result = await pingKeepAlive();

  if (result.success) {
    console.log(`[SUCCESS] Backend is alive! (HTTP ${result.status}, Duration: ${result.durationMs}ms)`);
    process.exit(0);
  } else {
    console.error(`[FAILURE] Keep-alive ping failed: ${result.error || `HTTP ${result.status}`}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[CRITICAL] Unhandled error during ping:', err);
  process.exit(1);
});
