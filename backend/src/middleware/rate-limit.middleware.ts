import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

// In-memory fallback tracking when Redis is offline
const memoryStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
  useSessionId?: boolean;
}) {
  const { windowSeconds, maxRequests, keyPrefix = 'rl', useSessionId = false } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier =
      (useSessionId ? (req.headers['x-session-id'] as string) : null) ||
      req.ip ||
      req.socket.remoteAddress ||
      'anonymous';

    const key = `rl:${keyPrefix}:${identifier}`;

    // 1. Try Redis rate limiting
    if (redis.isAvailable()) {
      try {
        const rawRedis = redis.raw;
        if (rawRedis) {
          const current = await rawRedis.incr(key);
          if (current === 1) {
            await rawRedis.expire(key, windowSeconds);
          }

          res.setHeader('X-RateLimit-Limit', maxRequests);
          res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

          if (current > maxRequests) {
            const ttl = await rawRedis.ttl(key);
            res.setHeader('Retry-After', ttl > 0 ? ttl : windowSeconds);
            return res.status(429).json({
              error: 'Too many requests. Please slow down.',
              retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
            });
          }
          return next();
        }
      } catch {
        // Fall back to memoryStore
      }
    }

    // 2. Memory Store Fallback
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    entry.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));

    if (entry.count > maxRequests) {
      const remainingSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', remainingSeconds);
      return res.status(429).json({
        error: 'Too many requests. Please slow down.',
        retryAfterSeconds: remainingSeconds,
      });
    }

    return next();
  };
}
