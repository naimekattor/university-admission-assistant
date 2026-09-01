# EduGuide 🎓
### Next-Gen AI University Admission & Preparation Platform for Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-c5f74f)](https://orm.drizzle.team/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285f4?logo=google)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/AI_Fallback-Groq-f55036)](https://groq.com/)

**EduGuide** is an intelligent, full-stack AI-powered admission guidance and exam preparation SaaS platform designed specifically for Bangladeshi Higher Secondary Certificate (HSC) students. It guides students through university selection, deterministic eligibility validation, personalized AI tutoring, curriculum learning with interactive visual notes, chapter-wise MCQ practice, timed mock tests, and smart mistake analysis.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [The Central Student Learning Loop](#-the-central-student-learning-loop)
- [Key Features & Capabilities](#-key-features--capabilities)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Database Schema (12 Domains)](#-database-schema-12-domains)
- [AI & RAG Engine Architecture](#-ai--rag-engine-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Database Seeding & Migration Scripts](#-database-seeding--migration-scripts)
- [Admin & Telemetry Panel](#-admin--telemetry-panel)
- [Contributing & License](#-contributing--license)

---

## 🏗 Architectural Overview

EduGuide employs a modern full-stack decoupled architecture:

1. **Frontend Client**: Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + `shadcn/ui` + Framer Motion & GSAP animations.
2. **Backend API**: Modular Express 5 Server (`server/src`) alongside Next.js Server Actions and Route Handlers (`app/api`).
3. **Database & Vector Engine**: PostgreSQL equipped with the `pgvector` extension for 768-dimensional semantic RAG search without external SaaS vector dependencies.
4. **AI Orchestration Layer**: Multi-tier cascading AI engine powered primarily by **Google Gemini 2.5 Flash** (and `embedding-001` / `text-embedding-004`) with ultra-fast structured fallback to **Groq SDK** (`openai/gpt-oss-20b` / `llama-3.3-70b-versatile`).

```
                              ┌────────────────────────────────────────────────────────┐
                              │               EduGuide Web Client                      │
                              │       Next.js 16 (App Router) + React 19 + Tailwind v4 │
                              └──────────────────────────┬─────────────────────────────┘
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    ▼                                         ▼
                     ┌──────────────────────────────┐          ┌──────────────────────────────┐
                     │   Next.js API & SSR Routes   │          │   Express 5 Backend Server   │
                     │    (Session, Admin, Upload)  │          │   (AI, Curriculum, Exams)    │
                     └──────────────┬───────────────┘          └──────────────┬───────────────┘
                                    │                                         │
                                    └────────────────────┬────────────────────┘
                                                         ▼
                                       ┌───────────────────────────────────┐
                                       │        Drizzle ORM v0.45.2        │
                                       └─────────────────┬─────────────────┘
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    ▼                                         ▼
                     ┌──────────────────────────────┐          ┌──────────────────────────────┐
                     │    PostgreSQL Relational     │          │    pgvector Semantic Store   │
                     │  (Curriculum, Exams, Users)  │          │  (Admission Circular Chunks) │
                     └──────────────────────────────┘          └──────────────────────────────┘
                                                                              ▲
                                                                              │
                                    ┌─────────────────────────────────────────┴──────────────┐
                                    │               AI Orchestrator Pipeline                 │
                                    │   Gemini 2.5 Flash ──[Fallback]──► Groq LLM Provider   │
                                    └────────────────────────────────────────────────────────┘
```

---

## 🔄 The Central Student Learning Loop

EduGuide transforms admission prep by closing the feedback loop at every stage:

```
[ ADMISSION GOAL ] ──► [ DIAGNOSTIC ASSESSMENT ] ──► [ IDENTIFY WEAK TOPICS ]
        ▲                                                      │
        │                                                      ▼
[ REVISE & MASTER ] ◄── [ MISTAKE NOTEBOOK ] ◄── [ TIMED MOCK TEST / PRACTICE ]
        │                                                      │
        └──────────────────◄ [ AI ADAPTIVE PLAN ] ◄────────────┘
```

1. **Target Goal Setting**: Student selects target units (e.g., BUET Engineering, DU Ka Unit, Medical, CKRUET, GST).
2. **Diagnostic Assessment**: Multi-subject baseline test evaluates readiness across Physics, Chemistry, Math, and Biology.
3. **Adaptive Study Plan**: AI generates day-by-day study tasks tailored to student weak areas and available study hours.
4. **Concept Learning & Visualization**: Rich interactive notes with SVG/Canvas visual simulators and derived formulas.
5. **Chapter Practice**: Instant feedback MCQ engine with step-by-step solutions and trap alerts.
6. **Mistake Notebook & Spaced Repetition**: Incorrect answers automatically enter the mistake repository for scheduled revision.
7. **Mock Exam Simulation**: Realistic timed examinations with 0.25 negative marking and rank prediction.

---

## ✨ Key Features & Capabilities

| Feature | Description | Route |
|---|---|---|
| **Student Dashboard** | Unified command center for daily tasks, goal tracking, streak counters, and subject mastery cards. | `/dashboard` |
| **AI Admission Advisor** | Official circular Q&A grounded in verified university circular data using semantic pgvector RAG. | `/chat` |
| **AI Subject Tutor** | Step-by-step solver explaining equations, concept derivations, and common mistakes in Bangla/English. | `/ai-tutor` |
| **Deterministic Eligibility** | Precise calculator evaluating SSC/HSC GPA, 4th subject rules, passing year, and unit cutoffs. | `/eligibility` |
| **Curriculum Explorer** | Complete hierarchy of HSC Science subjects, chapters, topics, concepts, and illustrated lesson notes. | `/prepare` |
| **Practice Engine** | Chapter-wise question bank with difficulty filters, instant answer verification, and time tracking. | `/practice` |
| **Mock Test Simulator** | Full-length timed mock tests matching real university patterns (BUET, DU, Medical, GST). | `/mock-tests` |
| **Mistake Notebook** | Automated mistake tracking repository featuring spaced repetition scheduling and review filters. | `/mistakes` |
| **Smart Recommendations** | Profile-based university & program suggestions tailored to GPA and career goals. | `/recommendations` |
| **University Directory** | Searchable database of Bangladeshi universities, faculty breakdowns, seat allocations, and fees. | `/universities` |
| **Guides & SEO Hub** | Curated admission guides, unit circular breakdowns, strategy articles, and FAQs. | `/guides` |
| **Admin Control Panel** | Live telemetry, active session logs, AI token usage metrics, question bank publisher, and article CMS. | `/admin` |
| **SaaS Pricing & Pass** | Tiered subscription structure offering Free tier and Premium Admission Pass entitlements. | `/pricing` |

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **UI Engine**: [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom warm palette (Amber / Emerald / Rust)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix & Base UI primitives)
- **Animations**: [Framer Motion 12.42](https://www.framer.com/motion/) & [GSAP 3.15](https://greensock.com/gsap/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Editor**: [Tiptap Editor](https://tiptap.dev/) for content management and article authoring

### Backend & Database
- **Backend Server**: [Express 5.2](https://expressjs.com/) with TypeScript modular architecture
- **Database**: [PostgreSQL 15+](https://www.postgresql.org/) (Self-hosted or managed)
- **Vector Extension**: [`pgvector`](https://github.com/pgvector/pgvector) for in-database vector similarity search
- **ORM**: [Drizzle ORM 0.45.2](https://orm.drizzle.team/) + `drizzle-kit 0.31.10`
- **Document Parsing**: `pdf-parse`, `pdf-lib`, `mammoth` (for DOCX), Vision PDF extractors

### AI & LLM Engine
- **Primary AI Provider**: Google Gemini API via official `@google/genai` / `@google/generative-ai` (`gemini-2.5-flash`, `gemini-2.0-flash`)
- **Embeddings Model**: Google `embedding-001` / `text-embedding-004` (768 dimensions)
- **Fallback Provider**: Groq SDK (`groq-sdk`, `@ai-sdk/groq`) for high-speed low-latency structured responses
- **Alternative Providers**: OpenAI (`gpt-4o-mini`), Anthropic Claude (`claude-3-5-sonnet`), Ollama local models

---

## 🗄 Database Schema (12 Domains)

The database schema is organized into 12 distinct functional domains in [`lib/db/schema.ts`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/lib/db/schema.ts):

```
1. Sessions & Tracking      ──► sessions, activity_logs, chat_messages, user_preferences
2. Students & Profiles       ──► students, student_profiles
3. Universities & Admissions ──► universities, programs, eligibility_criteria, admission_circulars
4. Curriculum Hierarchy      ──► subjects, chapters, topics, concepts, lessons, lesson_assets
5. Question Bank & Practice  ──► questions, question_options
6. Exams & Mock Tests        ──► mock_tests, mock_test_questions, test_attempts, test_answers
7. Progress, Mistakes & Rep  ──► student_progress, student_topic_progress, student_mistakes, revision_items
8. Personalized Study Plans  ──► study_plans, study_plan_items
9. RAG & Vector Documents    ──► documents, document_chunks (with vector(768) column)
10. AI Telemetry & Usage     ──► ai_conversations, ai_messages, ai_usage
11. Articles & Guides (SEO)  ──► article_categories, articles
12. Subscriptions & SaaS     ──► subscription_plans, subscriptions
```

---

## 🤖 AI & RAG Engine Architecture

### 1. Dual AI Roles
- **AI Advisor (`roleType: 'advisor'`)**: Tailored for university exploration, circular deadlines, GPA criteria, seat quotas, and admission roadmap advice.
- **AI Tutor (`roleType: 'tutor'`)**: Formatted for solving mathematical and physical derivations, explaining science concepts, identifying student reasoning errors, and suggesting topic drill exercises.

### 2. Multi-Tier AI Provider Cascade
1. **Gemini Primary**: Dispatches prompts with strict JSON schema enforcement to Google Gemini.
2. **Groq Fallback**: If rate limits or network issues occur, automatically routes to Groq without user interruption.
3. **Structured Normalizer**: Guarantees consistent structured JSON payload with summary, markdown sections, step-by-step solutions, and actionable buttons.

### 3. In-Database Vector Search (`pgvector`)
Document chunks from official admission circulars are embedded into 768-dimensional vectors and queried using the cosine distance operator:
```sql
SELECT id, university, unit, source, page, content,
       (embedding <=> $vector::vector) AS distance
FROM document_chunks
WHERE university = $university
ORDER BY embedding <=> $vector::vector ASC
LIMIT 5;
```

---

## 📁 Project Directory Structure

```
university-admission-assistant/
├── app/                            # Next.js 16 App Router
│   ├── admin/                      # Admin Control Panel & CMS
│   ├── ai-tutor/                   # AI Subject Tutor Page
│   ├── api/                        # Next.js Server Route Handlers
│   │   ├── admin/                  # Admin auth, sessions, stats endpoints
│   │   ├── ai/                     # AI query & proxy endpoints
│   │   └── chat/                   # Streaming chat route
│   ├── chat/                       # AI Admission Advisor interface
│   ├── dashboard/                  # Unified Student Dashboard
│   ├── eligibility/                # Deterministic GPA checker
│   ├── guides/                     # Admission strategy articles & guides
│   ├── mistakes/                   # Student Mistake Notebook & Spaced Repetition
│   ├── mock-tests/                 # Timed exam simulation engine
│   ├── practice/                   # Chapter-wise MCQ practice engine
│   ├── prepare/                    # HSC Curriculum explorer & lessons
│   ├── pricing/                    # SaaS subscription tiers
│   ├── profile/                    # Student profile & target tracker
│   ├── progress/                   # Topic mastery analytics & streaks
│   ├── recommendations/            # Smart university matchmaker
│   ├── universities/               # University directory & [slug] details
│   ├── globals.css                 # Design system tokens & Tailwind CSS
│   └── page.tsx                    # Landing page
├── components/                     # Reusable React components
│   ├── admin/                      # Rich Tiptap editor & admin widgets
│   ├── ai/                         # Structured AI response card renderers
│   ├── learning/                   # Visual lesson canvas & simulation renderers
│   ├── student/                    # Dashboard widgets (goals, plans, progress)
│   ├── ui/                         # shadcn/ui components (buttons, dialogs, cards)
│   └── navbar.tsx                  # Global navigation header
├── docs/                           # Architecture audits & design specifications
├── lib/                            # Shared utilities and core services
│   ├── ai/                         # Context builders, AI provider definitions
│   ├── db/                         # Drizzle schema, DB client, legacy seeds
│   ├── services/                   # Eligibility engine, RAG engine, PDF processors
│   └── session.ts                  # Privacy-preserving anonymous session manager
├── scripts/                        # Database migration, seeding & testing scripts
│   ├── clean-legacy-qdrant.ts      # Cleanup script for legacy vector DB
│   ├── init-postgres-db.ts         # PostgreSQL table initializer
│   ├── migrate-rag-to-pgvector.ts  # RAG embedding pipeline for pgvector
│   ├── seed-db.ts                  # University catalog seed data
│   ├── seed-embeddings.ts          # Vector embedding seed script
│   ├── seed-saas-db.ts             # Complete curriculum, question bank & SaaS seed
│   ├── test-claude-api.ts          # Claude provider verification
│   └── test-groq-api.ts            # Groq provider verification
├── server/                         # Modular Express 5 Backend Service
│   └── src/
│       ├── config/                 # Environment & server config
│       ├── db/                     # Server DB connection
│       ├── middleware/             # Error handling, CORS, session extraction
│       ├── modules/                # Domain-driven modules
│       │   ├── ai/                 # AI orchestrator & providers (Gemini, Groq)
│       │   ├── eligibility/        # Deterministic evaluation service
│       │   ├── exams/              # Diagnostic & mock test evaluation
│       │   ├── practice/           # Question bank retrieval service
│       │   ├── preparation/        # Subject/Chapter/Lesson curriculum service
│       │   ├── rag/                # pgvector document search service
│       │   └── study-plans/        # Adaptive study plan generation
│       ├── routes/                 # REST router definitions (`api.routes.ts`)
│       ├── app.ts                  # Express application factory
│       └── server.ts               # Standalone server entry point
├── drizzle.config.json             # Drizzle Kit migration configuration
├── package.json                    # Project dependencies & scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🔌 API Reference

The backend exposes a modular REST API accessible under `/api`:

### AI & Counseling
- `POST /api/ai/query` - Dispatches query to AI Orchestrator with role context (`advisor` or `tutor`), returning structured JSON.
- `POST /api/chat` - Real-time streaming conversational endpoint.

### Eligibility & Admissions
- `POST /api/eligibility/check` - Deterministic GPA and subject prerequisite evaluation for all BD universities.
- `GET /api/rag/search?q={query}&university={name}` - Semantic vector search over admission circulars.

### Curriculum & Learning
- `GET /api/preparation/subjects` - List all core HSC Science subjects.
- `GET /api/preparation/subjects/:slug/chapters` - Retrieve chapters, papers, and weightages for a subject.
- `GET /api/preparation/lessons/:slug` - Fetch detailed lesson markdown notes, visual assets, and formulas.

### Practice & Assessment
- `GET /api/practice/questions?chapter={slug}` - Retrieve MCQ question sets with answer choices and explanations.
- `POST /api/exams/diagnostic/submit` - Evaluate diagnostic assessment answers and return weak topic breakdown.
- `POST /api/study-plan/generate` - Generate adaptive multi-week study plan based on student target and hours.

### Admin & CMS
- `GET /api/admin/overview-stats` - Live student metrics, questions solved, mock test counts, and AI token usage graphs.
- `GET /api/admin/users` - Student profile overview and recent activity.
- `POST /api/admin/content/question` - Publish new question to the question bank.
- `POST /api/admin/content/article` - Publish admission guide article to knowledge base & SEO feed.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v9.0.0 or higher (`npm install -g pnpm`)
- **PostgreSQL**: v15+ with `pgvector` extension enabled
- **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)
- **Groq API Key (Optional)**: [Groq Console](https://console.groq.com/)

---

### Step 1: Clone and Install

```bash
git clone https://github.com/naimekattor/university-admission-assistant.git
cd university-admission-assistant
pnpm install
```

---

### Step 2: Configure Environment Variables

Copy the example configuration file:

```bash
cp .env.example .env
cp .env.example .env.local
```

Edit `.env` with your credentials:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/admission_db

# Google Gemini AI (Primary Engine)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
GEMINI_CHAT_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=embedding-001
GEMINI_EMBEDDING_DIMENSION=768

# Groq AI (Ultra-Fast Fallback)
GROQ_API_KEY=gsk_YourGroqApiKeyHere
GROQ_MODEL=openai/gpt-oss-20b

# Admin & Security
ADMIN_PASSWORD=admin
ADMIN_SECRET=eduguide_admin_secure_secret_2026
JWT_SECRET=eduguide_secret_jwt_key_2026

# Server Port
PORT=4000
NODE_ENV=development
```

---

### Step 3: Initialize Database & Seed Content

Run the automated database setup and full SaaS content seeder:

```bash
# 1. Initialize PostgreSQL database tables
pnpm run seed:db

# 2. Seed HSC Curriculum, Question Bank, Mock Tests & Admin Stats
pnpm exec tsx scripts/seed-saas-db.ts

# 3. Seed pgvector circular embeddings for RAG
pnpm exec tsx scripts/migrate-rag-to-pgvector.ts
```

---

### Step 4: Run the Application

Start the development server:

```bash
pnpm dev
```

The application will be live at:
- **Next.js Web Client**: [http://localhost:3000](http://localhost:3000)
- **Admin Control Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Express Backend API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 📊 Admin & Telemetry Panel

Access the Admin Panel at `/admin` (Default password: `admin`).

Key administrative capabilities:
- **Real-Time Telemetry**: Track active student sessions, mock tests taken, questions solved, and streak retention.
- **AI Token Cost Analytics**: Monitor input/output token counts, estimated USD cost, and model request breakdowns (`gemini-2.5-flash`, `embedding-001`, `groq`).
- **Curriculum Question Publisher**: Add new MCQ questions with multi-option inputs, solution explanations, and difficulty tags.
- **Admission Guide CMS**: Draft and publish SEO-optimized articles with rich markdown formatting, reading time, and metadata.

---

## 📜 Available NPM Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Starts Next.js development server on port `3000`. |
| `pnpm build` | Compiles production bundle for Next.js. |
| `pnpm start` | Launches compiled Next.js production server. |
| `pnpm lint` | Runs ESLint across the codebase. |
| `pnpm seed:db` | Populates core university catalog and criteria in PostgreSQL. |
| `pnpm seed:embeddings` | Generates and populates vector embeddings. |
| `pnpm seed` | Executes both database and vector seeders sequentially. |
| `pnpm clean:qdrant` | Decommissions and cleans legacy Qdrant collections. |
| `pnpm test:claude` | Diagnostic script for Claude API verification. |

---

## 🛡 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for HSC & Admission Candidates across Bangladesh.</sub>
</div>
