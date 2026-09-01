# EduGuide Setup Guide

This guide details setting up the EduGuide monorepo with independent `frontend` and `backend` services.

## Architecture

- **`frontend/`**: Next.js 16 (Turbopack, React 19, Tailwind CSS v4, shadcn/ui)
- **`backend/`**: Node.js + Express 5 + TypeScript + Drizzle ORM + PostgreSQL (`pgvector`) + Groq / Gemini AI providers

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **pnpm**: v9+ / v11 (recommended package manager)
- **PostgreSQL**: PostgreSQL 12+ (with `pgvector` extension if performing local vector search)

---

## 2. Environment Setup

### Backend Environment (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/admission_db
CORS_ORIGIN=*

# AI Provider: 'groq' | 'gemini'
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

GEMINI_API_KEY=your_gemini_api_key
GEMINI_CHAT_MODEL=gemini-3.6-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```

### Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
BACKEND_URL=http://localhost:4000
NODE_ENV=development
```

---

## 3. Independent Execution

### Backend
```bash
cd backend
pnpm install
pnpm dev
# Running on http://localhost:4000
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
# Running on http://localhost:3000
```

---

## 4. Root Monorepo Commands

You can run everything from the root folder:

```bash
# Install all dependencies across all packages
pnpm install

# Start both services concurrently
pnpm dev

# Build both services
pnpm build

# Seed database
pnpm seed
```
