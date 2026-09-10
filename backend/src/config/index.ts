import { config } from 'dotenv';
config();

export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admission_db',
  
  // AI Provider Selection: 'groq' | 'gemini' | 'auto'
  AI_PROVIDER: (process.env.AI_PROVIDER || 'groq').toLowerCase(),

  // Groq AI Configuration (Primary Fast Chat Model)
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',

  // Google Gemini AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash',
  
  // Embedding Configuration: 'huggingface' (Free Cloud), 'gemini', 'ollama', or 'auto'
  EMBEDDING_PROVIDER: (process.env.EMBEDDING_PROVIDER || 'auto').toLowerCase(),
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || '',
  HUGGINGFACE_EMBEDDING_MODEL: process.env.HUGGINGFACE_EMBEDDING_MODEL || 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2',
  GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
  OLLAMA_EMBEDDING_MODEL: process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3',
  GEMINI_EMBEDDING_DIMENSION: Number(process.env.GEMINI_EMBEDDING_DIMENSION || 768),
  GEMINI_EMBEDDING_VERSION: 'v1',

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'eduguide_secret_jwt_key_2026',

  // Redis & Revalidation
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || 'eduguide_revalidation_secure_secret_2026',

  // Render & Keep-Alive Cron Configuration
  // Render.com automatically supplies RENDER_EXTERNAL_URL (e.g., https://your-service.onrender.com)
  RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL || '',
  BACKEND_URL: process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || '',
  KEEP_ALIVE_URL: process.env.KEEP_ALIVE_URL || process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || '',
  KEEP_ALIVE_ENABLED: process.env.KEEP_ALIVE_ENABLED !== 'false',
  KEEP_ALIVE_INTERVAL: process.env.KEEP_ALIVE_INTERVAL || '*/14 * * * *', // Every 14 mins (Render sleeps at 15 mins)
};

