import { redis } from '../config/redis';
import { ENV } from '../config';

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

export class RevalidationService {
  /**
   * Invalidate local Redis cache keys matching pattern
   */
  public static async invalidateRedis(pattern: string): Promise<void> {
    if (!redis.isAvailable()) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys && keys.length > 0) {
        await redis.del(keys);
        console.log(`[RevalidationService] Purged ${keys.length} Redis cache keys matching "${pattern}"`);
      }
    } catch (err: any) {
      console.warn('[RevalidationService] Redis purge warning:', err.message);
    }
  }

  /**
   * Dispatch on-demand revalidation trigger to Next.js App Router
   */
  public static async triggerNextRevalidation(options: {
    tag?: string | string[];
    path?: string | string[];
  }): Promise<void> {
    try {
      const targetUrl = `${FRONTEND_URL.replace(/\/+$/, '')}/api/revalidate`;
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': ENV.REVALIDATION_SECRET,
        },
        body: JSON.stringify(options),
      });

      if (res.ok) {
        const json = await res.json();
        console.log('[RevalidationService] Successfully triggered Next.js revalidation:', json);
      } else {
        console.warn(
          `[RevalidationService] Next.js revalidation returned ${res.status}: ${await res.text().catch(() => '')}`
        );
      }
    } catch (err: any) {
      console.warn('[RevalidationService] Error contacting Next.js revalidate webhook:', err.message);
    }
  }

  /**
   * Complete pipeline: Purge Redis and trigger Next.js revalidation
   */
  public static async invalidateContent(options: {
    redisPattern: string;
    tag?: string | string[];
    path?: string | string[];
  }): Promise<void> {
    await this.invalidateRedis(options.redisPattern);
    await this.triggerNextRevalidation({ tag: options.tag, path: options.path });
  }
}
