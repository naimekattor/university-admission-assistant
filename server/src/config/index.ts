import { config } from 'dotenv';
config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/admission_db',
  
  // Gemini AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash',
  GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'embedding-001',
  GEMINI_EMBEDDING_DIMENSION: Number(process.env.GEMINI_EMBEDDING_DIMENSION || 768),
  GEMINI_EMBEDDING_VERSION: 'v1',

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'eduguide_secret_jwt_key_2026',
};
