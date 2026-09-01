import { config } from 'dotenv';
config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admission_db',
  
  // AI Provider Selection: 'groq' | 'gemini' | 'auto'
  AI_PROVIDER: (process.env.AI_PROVIDER || 'groq').toLowerCase(),

  // Groq AI Configuration (Primary Fast Chat Model)
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',

  // Google Gemini AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash',
  
  // Embedding Configuration: 'text-embedding-004' (Google Free Tier) or 'bge-m3' (Local Free)
  EMBEDDING_PROVIDER: (process.env.EMBEDDING_PROVIDER || 'auto').toLowerCase(),
  GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
  OLLAMA_EMBEDDING_MODEL: process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3',
  GEMINI_EMBEDDING_DIMENSION: Number(process.env.GEMINI_EMBEDDING_DIMENSION || 768),
  GEMINI_EMBEDDING_VERSION: 'v1',

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'eduguide_secret_jwt_key_2026',
};
