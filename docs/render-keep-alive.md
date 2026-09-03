# Render.com 24/7 Keep-Alive Cron Setup Guide

This guide explains how the EduGuide backend remains awake 24/7 on **Render.com's Free Tier** without spinning down.

---

## 1. The Problem with Free Tier Spin-Down

Render.com puts free-tier Web Services into a dormant "spin-down" state after **15 minutes of inactivity** (no incoming HTTP requests).
- When asleep, the next visitor suffers a **30 to 50-second cold-start latency**.
- While spun down, in-memory caches and background connections are halted.

---

## 2. The Solution: Built-in Keep-Alive Cron

EduGuide backend includes an automated background cron service powered by `node-cron`:

1. **Auto-Detection of Render URL**:
   - Render automatically injects the environment variable `RENDER_EXTERNAL_URL` (e.g., `https://eduguide-backend.onrender.com`).
   - The cron service automatically detects this URL. If using a custom domain, you can specify `BACKEND_URL` or `KEEP_ALIVE_URL`.

2. **14-Minute Interval Schedule**:
   - Scheduled with `*/14 * * * *` (every 14 minutes, right before Render's 15-minute sleep threshold).
   - Pings `/api/health` and logs duration and response status.
   - Non-blocking: Uses a 15-second abort controller timeout and never crashes the backend on network hiccups.

3. **Post-Startup Warm-up**:
   - Performs an initial self-ping 15 seconds after bootstrap so you can immediately verify in Render's logs that the keep-alive is working.

---

## 3. Endpoints Available

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/health` | `GET` | Root health check returning status, uptime, and timestamp |
| `/ping` | `GET` | Lightweight ping check returning status `ok` |
| `/api/health` | `GET` | Standard API health check |
| `/api/ping` | `GET` | Standard API ping check |
| `/api/cron/keep-alive` | `GET` | Manually triggers a keep-alive ping and returns execution diagnostic info |

---

## 4. Environment Variables on Render Dashboard

In your **Render Dashboard** -> **Web Service** -> **Environment**, you can configure:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `RENDER_EXTERNAL_URL` | *(Automatically supplied by Render)* | Full public URL of your service |
| `BACKEND_URL` | `https://your-service.onrender.com` | Optional fallback if Render env var is not detected |
| `KEEP_ALIVE_ENABLED` | `true` | Enables or disables the in-process cron ping (default: `true`) |
| `KEEP_ALIVE_INTERVAL` | `*/14 * * * *` | Cron schedule pattern (default: every 14 minutes) |

> [!NOTE]
> On Render Web Services, Render automatically populates `RENDER_EXTERNAL_URL`. Therefore, you do **not** need to do anything—the backend will detect its public URL and self-ping automatically!

---

## 5. Testing & CLI Utilities

### Manual CLI Ping
You can test the ping utility at any time using:

```bash
# In the backend directory or from project root:
pnpm --filter eduguide-backend run ping
```

### Manual HTTP Trigger
You can also trigger a ping by opening in browser or calling curl:
```bash
curl https://your-service.onrender.com/api/cron/keep-alive
```

---

## 6. Recommended 100% Free Backup (External Ping)

While the internal cron keeps the server alive during active operation, if Render ever restarts the container during routine cloud maintenance, the container stops until a request arrives.

To make it **100% bulletproof**, add a free external monitor (takes 1 minute):

1. Go to [Cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com) (both 100% free).
2. Create a new monitor / cron job:
   - **URL**: `https://your-backend.onrender.com/health`
   - **Schedule**: Every 10 to 14 minutes
3. Save. This will guarantee an external request arrives even if Render completely restarts the instance.
