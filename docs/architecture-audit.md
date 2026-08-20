# EduGuide Architecture Audit

## 1. Executive Summary

This document presents a comprehensive audit of the **EDUGUIDE** (AI-Powered University Admission & Preparation Platform for Bangladesh) codebase prior to transforming it into a full SaaS platform.

EduGuide is evolving from a standalone admission chatbot into a comprehensive **AI-Powered Admission Preparation Platform** for Bangladeshi HSC students. The central product loop is:
**GOAL → DIAGNOSTIC TEST → IDENTIFY WEAK TOPICS → PERSONALIZED PLAN → LEARN → VISUALIZE → PRACTICE → MISTAKE ANALYSIS → REVISION → MOCK TEST → PERFORMANCE → AI ADJUSTS PLAN → LEARN AGAIN**.

---

## 2. Current Architecture

### 2.1 Frontend Architecture
- **Framework**: Next.js 16.2.6 (App Router), React 19, TypeScript 5.7.3.
- **Styling**: Tailwind CSS 4.3.3 (`@tailwindcss/postcss`), custom CSS variables in `app/globals.css`, Lucide React icons, Framer Motion 12.42.2, GSAP 3.15.0.
- **UI Components**: `shadcn/ui` base components (`components/ui/button.tsx`, `input.tsx`, `animated-card.tsx`, `border-beam-button.tsx`).
- **State Management**: React state hooks (`useState`, `useTransition`, `useEffect`), custom session cookies for anonymous tracking.

### 2.2 Backend & API Architecture
- **Route Handlers**: Next.js App Router API endpoints (`/api/chat`, `/api/admin/login`, `/api/admin/logout`, `/api/admin/check-auth`, `/api/admin/documents`, `/api/admin/sessions`, `/api/admin/stats`, `/api/admin/upload`).
- **Session & Auth**: Anonymous user tracking via `admission_session_id` HTTP-only cookie using `uuid` v4; basic admin cookie check for admin routes.
- **Service Layer**:
  - `lib/services/eligibility-engine.ts`: Deterministic SSC/HSC GPA, academic group, passing year, and subject prerequisite evaluation for Bangladeshi universities (BUET, DU, KUET, RUET, etc.).
  - `lib/services/rag-engine.ts`: Multi-query expansion, BM25 & quantitative re-scoring, format document context for LLMs.
  - `lib/services/document-processor.ts` & `vision-pdf-extractor.ts`: Document parsing and chunking for admission circulars.

### 2.3 Database Architecture
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM (`drizzle-orm` v0.45.2, `drizzle-kit` v0.31.10).
- **Current Tables**:
  - `sessions`: Anonymous user session tracking.
  - `activity_logs`: User activity and telemetry.
  - `chat_messages`: Stored conversation turns linked to sessions.
  - `universities`: University entities (BUET, DU, KUET, RUET, etc.).
  - `programs`: Degree programs linked to universities.
  - `eligibility_criteria`: GPA cutoffs and prerequisite rules.
  - `user_preferences`: Stored GPA and subject choices for recommendation.
  - `documents`: Uploaded PDF documents metadata.

### 2.4 AI Architecture
- **SDK & Provider**: `@google/generative-ai` 0.24.1, `@ai-sdk/openai`, `@ai-sdk/groq`, `@ai-sdk/anthropic`, `ollama` SDK.
- **Provider Fallback**: `app/api/chat/route.ts` implements a multi-provider fallback cascade: OpenAI (`gpt-4o-mini`) -> Gemini (`gemini-2.0-flash`) -> Grok (`grok-beta`) -> Groq (`llama-3.3-70b-versatile`) -> Ollama (`qwen2.5:7b`).
- **System Prompts**: Enforces Bangla, English, or Banglish responses; strict anti-hallucination rules grounded in RAG excerpts.

### 2.5 RAG & Vector Search Architecture
- **Current Storage**: Qdrant Vector DB via `@qdrant/js-client-rest`.
- **Collections**: `uaa_university-embeddings`, `uaa_program-embeddings`, `uaa_admission-docs`.
- **Embeddings**: Generated using local Ollama endpoint (`nomic-embed-text`, 768 dimensions).
- **Retrieval Pipeline**: Multi-query search (original + cross-lingual expanded keyword query) + hybrid BM25 and quantitative re-scoring.

### 2.6 Current Routing Table
| Route | Type | Description |
|---|---|---|
| `/` | Page | Landing homepage with hero, quick stats, feature cards, and FAQs. |
| `/chat` | Page | AI Admission Counselor chat interface with quick action tags and streaming text. |
| `/eligibility` | Page | Student GPA eligibility checker with detailed breakdown per department. |
| `/recommendations` | Page | Smart university recommendations based on student preferences. |
| `/universities` | Page | Searchable university directory with filters for location and admission type. |
| `/universities/[slug]` | Page | Detail page for specific university, showing programs, cutoffs, and links. |
| `/admin` | Page | Admin panel for PDF document uploads, RAG chunk management, and session analytics. |
| `/api/chat` | API | Main chat endpoint supporting streaming responses and session saving. |
| `/api/admin/*` | API | Admin authentication, upload, document, session, and stats management endpoints. |

---

## 3. Functionality to Preserve

1. **AI Chat Advisor**: Existing conversation history and prompt structure.
2. **Eligibility Engine**: Existing deterministic evaluation algorithms for BUET, DU, KUET, RUET, etc., including GPA margins, second-time rules, group requirements, and unverified prerequisites.
3. **Smart Recommendations**: Algorithm for filtering universities based on student HSC GPA and group.
4. **University Explorer**: Directory listing and detail view routes (`/universities`, `/universities/[slug]`).
5. **Session System**: Anonymous tracking cookie infrastructure.
6. **Existing Data**: University catalog, program details, eligibility criteria, and existing chat messages.

---

## 4. Problems & Technical Debt Identified

1. **Vector DB Dependency**: RAG currently depends on an external Qdrant cluster and local Ollama embeddings, which violates the zero-additional-cost requirement and introduces operational overhead.
2. **Frontend-Coupled AI Logic**: AI provider cascading, prompt formatting, and RAG retrieval logic are currently embedded directly inside Next.js API route handlers rather than a dedicated backend service layer.
3. **Unstructured AI Outputs**: AI returns unstructured markdown text, missing the target structured JSON payload requirements (e.g. comparison, eligibility result, study plan, question explanation schemas).
4. **Missing Preparation Domain**: The database schema and frontend lacks entities and routes for:
   - Subjects, Chapters, Topics, Lessons, Visual Notes
   - Practice MCQs, Question Options, Explanations, Difficulty Tags
   - Mock Tests, Test Attempts, Answer Tracking
   - Student Progress, Mistake Notebook, Spaced Revision Items
   - Student Profiles & Targets
   - Personalized Study Plans
   - AI Usage Tracking & Entitlement/Subscription Schema
5. **No Dedicated Express Service**: Backend logic lives in Next.js API routes; target architecture requires a dedicated modular Node.js + Express backend service running PostgreSQL + `pgvector`.

---

## 5. Recommended Incremental Migration Path

```
   [ Current Next.js App ]
              │
              ▼
   Phase 1: Database Migration (PostgreSQL + pgvector schema)
              │
              ▼
   Phase 2: Backend Express API Setup (Modular src/modules/*)
              │
              ▼
   Phase 3: Gemini Provider Integration & Structured AI Output Schema
              │
              ▼
   Phase 4: pgvector RAG Pipeline Migration (Replacing Qdrant)
              │
              ▼
   Phase 5: Student Profile & Goals Domain Implementation
              │
              ▼
   Phase 6: Preparation Dashboard & Subject/Chapter/Lesson Architecture
              │
              ▼
   Phase 7: Diagnostic Test & Personalized Study Planning Engine
              │
              ▼
   Phase 8: Practice Engine & Question Bank
              │
              ▼
   Phase 9: Mock Test System & Evaluation Engine
              │
              ▼
   Phase 10: Mistake Notebook & Spaced Revision System
              │
              ▼
   Phase 11: AI Tutor & AI Advisor Dual Chat System
              │
              ▼
   Phase 12: Visual & Interactive Learning Component Architecture
              │
              ▼
   Phase 13: University Explorer & Admission Information Enhancements
              │
              ▼
   Phase 14: Guides / Blog / SEO System
              │
              ▼
   Phase 15: Subscription & SaaS Foundation Architecture
              │
              ▼
   Phase 16: End-to-End Verification & QA
```

---

## 6. Risks & Mitigation Strategies

- **Data Loss Risk**: Upgrading database schema could overwrite existing universities or chat logs.
  - *Mitigation*: Create additive Drizzle migrations and seed scripts that preserve existing tables and foreign keys.
- **RAG Downtime Risk**: Disabling Qdrant before pgvector is active would break chat context retrieval.
  - *Mitigation*: Build the `pgvector` RAG pipeline alongside existing RAG search and verify vector similarity search in PostgreSQL before decommissioning Qdrant calls.
- **Breaking Existing Routes**: Moving API routes to Express could break Next.js frontend calls.
  - *Mitigation*: Maintain Next.js API proxy handlers or update API fetchers seamlessly using clean environment variable configuration (`NEXT_PUBLIC_API_URL`).

---

## 7. Target Architecture

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.
- **Backend Service**: Node.js + Express + TypeScript in `server/` with modular architecture (`modules/{auth, students, preparation, practice, exams, ai, rag, subscriptions}`).
- **Database**: PostgreSQL with `pgvector` extension enabled (`vector(768)` embedding column in `document_chunks`).
- **ORM**: Drizzle ORM.
- **AI Engine**: Google Gemini API via official `@google/generative-ai` SDK (`gemini-2.0-flash` for reasoning/text, `text-embedding-004` for vectors) with structured JSON output enforcement.
- **Infrastructure**: Low-cost, high-performance stack (Next.js on Vercel, Express + PostgreSQL on VPS).
