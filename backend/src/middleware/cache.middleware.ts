import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export function routeCache(ttlSeconds: number = 300, keyPrefix: string = 'api') {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Bypass cache if Redis is offline
    if (!redis.isAvailable()) {
      res.setHeader('X-Cache', 'BYPASS-OFFLINE');
      return next();
    }

    const cacheKey = `cache:${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        return res.send(cached);
      }

      res.setHeader('X-Cache', 'MISS');

      // Monkey-patch res.json to capture response body and cache in Redis
      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        // Only cache successful 200 responses
        if (res.statusCode === 200 && body) {
          try {
            redis.set(cacheKey, JSON.stringify(body), ttlSeconds).catch(() => {});
          } catch {}
        }
        return originalJson(body);
      };

      next();
    } catch {
      next();
    }
  };
}
