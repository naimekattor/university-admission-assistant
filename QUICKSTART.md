# EduGuide - Quick Start Guide

EduGuide is structured into two independent packages:
- **`frontend/`**: Next.js 16 (React 19 + Tailwind CSS v4) running on `http://localhost:3000`
- **`backend/`**: Express + TypeScript + Drizzle ORM + pgvector running on `http://localhost:4000`

---

## ⚡ Option 1: Running From Root (Recommended)

From the root `university-admission-assistant` directory:

```bash
# 1. Install dependencies across all workspaces
pnpm install

# 2. Run both Frontend and Backend concurrently
pnpm dev

# OR run them individually from root:
pnpm dev:backend   # Starts Express backend on http://localhost:4000
pnpm dev:frontend  # Starts Next.js frontend on http://localhost:3000
```

---

## 🚀 Option 2: Running Frontend & Backend Independently

You can open two separate terminals and work with each service in total isolation:

### Terminal 1: Backend Service
```bash
cd backend
pnpm install
pnpm dev
# Backend API is live at http://localhost:4000
# Health check: http://localhost:4000/api/health
```

### Terminal 2: Frontend Service
```bash
cd frontend
pnpm install
pnpm dev
# Next.js App is live at http://localhost:3000
```

---

## 📦 Database Initialization & Seeding

Inside `backend/` (or via root workspace scripts):

```bash
# Seed standard university and curriculum data
pnpm seed:db
pnpm seed:saas

# Or from root directory:
pnpm seed
```

---

## 🌐 Endpoints & Pages Overview

| Service | Route / URL | Description |
|---|---|---|
| **Frontend** | `http://localhost:3000/` | Landing page & hero |
| **Frontend** | `http://localhost:3000/chat` | AI Admission Counselor Chat |
| **Frontend** | `http://localhost:3000/eligibility` | GPA & Subject Eligibility Checker |
| **Frontend** | `http://localhost:3000/prepare` | HSC & Admission Curriculum Hub |
| **Frontend** | `http://localhost:3000/practice` | Chapter MCQ Practice Engine |
| **Frontend** | `http://localhost:3000/admin` | Admin Management Dashboard |
| **Backend** | `http://localhost:4000/api/health` | Backend Health Check |
| **Backend** | `http://localhost:4000/api/ai/query` | Structured AI Orchestrator Endpoint |
| **Backend** | `http://localhost:4000/api/preparation/subjects` | Curriculum Subjects & Lessons |
| **Backend** | `http://localhost:4000/api/practice/questions` | Chapter MCQ Question Bank |
