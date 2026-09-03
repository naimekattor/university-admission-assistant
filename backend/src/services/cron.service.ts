import cron, { ScheduledTask } from 'node-cron';
import { ENV } from '../config';

let scheduledTask: ScheduledTask | null = null;
let warmupTimer: NodeJS.Timeout | null = null;

/**
 * Resolves the primary URL to ping to keep the service alive on Render.com
 */
export function getKeepAliveTargetUrl(): string {
  if (ENV.KEEP_ALIVE_URL) {
    return ENV.KEEP_ALIVE_URL.replace(/\/$/, '');
  }
  if (ENV.RENDER_EXTERNAL_URL) {
    return ENV.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  }
  if (ENV.BACKEND_URL) {
    return ENV.BACKEND_URL.replace(/\/$/, '');
  }
  // Default to localhost in development
  if (ENV.NODE_ENV === 'development') {
    return `http://localhost:${ENV.PORT}`;
  }
  return '';
}

/**
 * Pings the health endpoint of the backend
 */
export async function pingKeepAlive(): Promise<{ success: boolean; status?: number; durationMs?: number; error?: string }> {
  const baseUrl = getKeepAliveTargetUrl();
  
  if (!baseUrl) {
    const msg = '[Keep-Alive Cron] No target URL found. Set RENDER_EXTERNAL_URL or KEEP_ALIVE_URL in your environment.';
    console.warn(msg);
    return { success: false, error: msg };
  }

  const pingUrl = `${baseUrl}/api/health`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'EduGuide-Render-KeepAlive/1.0',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (response.ok) {
      console.log(
        `[Keep-Alive Cron] [${new Date().toISOString()}] Ping SUCCESS -> ${pingUrl} (Status: ${response.status}, took ${durationMs}ms)`
      );
      return { success: true, status: response.status, durationMs };
    } else {
      console.warn(
        `[Keep-Alive Cron] [${new Date().toISOString()}] Ping WARNING -> ${pingUrl} returned status ${response.status} (${response.statusText})`
      );
      return { success: false, status: response.status, durationMs };
    }
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError';
    const errorMsg = isTimeout ? 'Request timed out after 15s' : err.message;
    
    console.warn(
      `[Keep-Alive Cron] [${new Date().toISOString()}] Ping FAILED -> ${pingUrl}: ${errorMsg} (${durationMs}ms)`
    );
    return { success: false, error: errorMsg, durationMs };
  }
}

/**
 * Initializes and starts the keep-alive cron job
 */
export function startKeepAliveCron(): void {
  if (!ENV.KEEP_ALIVE_ENABLED) {
    console.log('[Keep-Alive Cron] Disabled via KEEP_ALIVE_ENABLED=false');
    return;
  }

  const targetUrl = getKeepAliveTargetUrl();
  const schedule = ENV.KEEP_ALIVE_INTERVAL;

  if (!cron.validate(schedule)) {
    console.error(`[Keep-Alive Cron] Invalid cron schedule expression: "${schedule}". Falling back to "*/14 * * * *"`);
  }

  const cronPattern = cron.validate(schedule) ? schedule : '*/14 * * * *';

  console.log(`[Keep-Alive Cron] Initializing keep-alive cron job...`);
  console.log(`[Keep-Alive Cron] Target base URL: ${targetUrl || '(waiting for RENDER_EXTERNAL_URL)'}`);
  console.log(`[Keep-Alive Cron] Schedule: "${cronPattern}" (every 14 minutes to prevent Render sleep)`);

  // Cancel any existing task
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
  }

  // Schedule periodic ping
  scheduledTask = cron.schedule(cronPattern, async () => {
    await pingKeepAlive();
  });

  // Execute an initial warm-up ping 15 seconds after boot to verify connectivity right away
  if (warmupTimer) {
    clearTimeout(warmupTimer);
  }
  warmupTimer = setTimeout(async () => {
    console.log('[Keep-Alive Cron] Running initial post-startup warm-up ping...');
    await pingKeepAlive();
  }, 15000);

  console.log('[Keep-Alive Cron] Cron job active.');
}

/**
 * Stops the keep-alive cron job cleanly
 */
export function stopKeepAliveCron(): void {
  if (warmupTimer) {
    clearTimeout(warmupTimer);
    warmupTimer = null;
  }
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('[Keep-Alive Cron] Stopped.');
  }
}
