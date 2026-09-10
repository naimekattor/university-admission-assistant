import { Redis } from 'ioredis';
import { ENV } from './index';

let rawRedis: Redis | null = null;
let isConnected = false;

try {
  rawRedis = new Redis(ENV.REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts if offline
      }
      return Math.min(times * 150, 1000);
    },
    lazyConnect: true,
  });

  rawRedis
    .connect()
    .then(() => {
      isConnected = true;
      console.log('[Redis] Connected successfully to cache service at', ENV.REDIS_URL);
    })
    .catch((err) => {
      isConnected = false;
      console.warn('[Redis] Offline, proceeding without Redis cache:', err.message);
    });

  rawRedis.on('error', () => {
    isConnected = false;
  });

  rawRedis.on('ready', () => {
    isConnected = true;
  });

  rawRedis.on('close', () => {
    isConnected = false;
  });
} catch (err: any) {
  console.warn('[Redis] Initialization error, caching disabled:', err.message);
}

export const redis = {
  isAvailable: () => isConnected && rawRedis !== null,

  async get(key: string): Promise<string | null> {
    if (!isConnected || !rawRedis) return null;
    try {
      return await rawRedis.get(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    if (!isConnected || !rawRedis) return null;
    try {
      if (ttlSeconds) {
        return await rawRedis.set(key, value, 'EX', ttlSeconds);
      }
      return await rawRedis.set(key, value);
    } catch {
      return null;
    }
  },

  async del(key: string | string[]): Promise<number> {
    if (!isConnected || !rawRedis) return 0;
    try {
      if (Array.isArray(key)) {
        if (key.length === 0) return 0;
        return await rawRedis.del(...key);
      }
      return await rawRedis.del(key);
    } catch {
      return 0;
    }
  },

  async keys(pattern: string): Promise<string[]> {
    if (!isConnected || !rawRedis) return [];
    try {
      return await rawRedis.keys(pattern);
    } catch {
      return [];
    }
  },

  raw: rawRedis,
};
