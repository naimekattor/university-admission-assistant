# Technical Implementation Plan: Full-Stack Architecture & Performance Optimization

**Feature Branch**: `004-architecture-optimization`  
**Feature Spec**: `specs/004-architecture-optimization/spec.md`  
**Status**: Approved for Task Generation  

---

## 1. Technical Context & System Architecture

EduGuide utilizes:
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, GSAP motion system.
- **Planned Client Libraries**: `@tanstack/react-query` v5, `zustand` v5.
- **Backend**: Node.js, Express 5, Drizzle ORM, `ioredis`.
- **Database**: Neon Serverless PostgreSQL with `pgvector` extension.
- **AI Services**: Google Gemini 2.0 Flash & Groq (Llama-3.3-70B).

### System Topology
```
[Client Browser]
  ├── Server-Rendered HTML (Edge ISR)
  ├── TanStack Query (Client-Side Server State)
  └── Zustand (Ephemeral Client UI State)
       │
       ▼
[Vercel Edge Network]
  ├── Edge Middleware (admin_token check)
  ├── Next.js App Router (ISR Cache: 15–60 min)
  └── On-Demand Revalidation Webhook (/api/revalidate)
       │
       ▼
[Hostinger VPS (Express 5 + Redis)]
  ├── Rate Limiter (Redis-backed: 6 RPM AI, 120 RPM API)
  ├── Upstream Query Cache (Redis: 15–60 min TTL)
  ├── AI Orchestrator (SSE Streaming + RAG vector search)
  └── Drizzle ORM (Pooled Connection)
       │
       ▼
[Neon PostgreSQL + pgvector]
```

---

## 2. Component Boundaries & Rendering Strategy

### Public SEO Pages
- `/`: Server Component with ISR (`revalidate: 900`). Static presentation + Client Search & Countdown islands.
- `/universities`: Server Component with ISR (`revalidate: 1800`). Directory list pre-rendered + Client Filter/Search island.
- `/universities/[slug]`: Server Component with ISR (`revalidate: 900`). `generateStaticParams()` pre-renders top 20 universities. Client tabs & bookmark islands.
- `/admission`: Server Component with ISR (`revalidate: 600`).
- `/guides` & `/guides/[slug]`: Server Component with ISR (`revalidate: 3600`).
- `/eligibility`: Hybrid page. Server Component renders comprehensive GPA rules and threshold tables for SEO. Client Component island renders the reactive GPA calculator form.

### Authenticated & Dynamic Pages
- `/admin/*`: Dynamic SSR/CSR behind `middleware.ts`.
- `/dashboard`: CSR with TanStack Query.
- `/prepare`: CSR with TanStack Query.
- `/practice`, `/mock-tests/*`: CSR with Zustand exam session state.
- `/chat`: CSR with real-time SSE streaming.

---

## 3. State Management & Caching Architecture

### TanStack Query Keys
- `['student', 'profile']` (stale: 10m, gc: 1h)
- `['student', 'dashboard', 'tasks']` (stale: 1m, gc: 15m)
- `['community', 'feed', filters]` (stale: 1m, gc: 10m)
- `['practice', 'questions', topicId]` (stale: 15m, gc: 1h)

### Zustand Stores
- `useUiStore`: Drawer open/close, compare list (up to 3 universities).
- `useEligibilityFilterStore`: Persisted student SSC/HSC GPA and academic group.
- `useMockExamStore`: Active exam timer, selected options, submission state.

### Backend Redis Keys
- `cache:uni:list` (TTL: 60m)
- `cache:uni:[slug]` (TTL: 30m)
- `cache:circulars:all` (TTL: 15m)
- `cache:guides:[slug]` (TTL: 2h)
- `rl:ai:[sessionId]` (TTL: 60s, limit: 6)
- `rl:ip:[ip]` (TTL: 60s, limit: 120)

---

## 4. Verification & Validation Plan

1. **Security & Route Guard**:
   - `curl -I http://localhost:3000/admin` → Returns `307 Temporary Redirect` to `/admin/login`.
   - Logging in via `/api/admin/login` allows access to `/admin/*`.
2. **SEO & Crawlability**:
   - Plain HTTP `curl -s http://localhost:3000/universities` contains `<h1>`, `<h2>`, and university list text without JS execution.
   - Plain HTTP `curl -s http://localhost:3000/universities/buet` contains full BUET admission criteria, GPA requirements, and seats.
3. **Bundle Optimization**:
   - Check bundle size of `/` and `/universities` — `katex` and `react-markdown` are not in the main chunk.
4. **Redis Caching**:
   - Query `/api/universities` twice. Second request returns `X-Cache: HIT` and latency `< 5ms`.
5. **Revalidation**:
   - Sending authenticated `POST /api/revalidate` clears Next.js cache tags.
