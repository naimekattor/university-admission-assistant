# Tasks: Full-Stack Architecture & Performance Optimization

**Input**: Design documents from `specs/004-architecture-optimization/` (`spec.md`, `plan.md`)  
**Prerequisites**: `plan.md`, `spec.md`  
**Status**: Ready for Execution  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependency installation and shared environment configuration

- [X] T001 Install `@tanstack/react-query` and `zustand` in `frontend/package.json`
- [X] T002 Install `ioredis` and `@types/ioredis` in `backend/package.json`
- [X] T003 [P] Configure revalidation secret (`REVALIDATION_SECRET`) and Redis connection parameters (`REDIS_URL`) in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure, error boundaries, middleware security, and caching clients

**⚠️ CRITICAL**: Must complete before user story implementation begins

- [X] T004 Create Next.js Edge Middleware for `/admin/*` route protection in `frontend/middleware.ts`
- [X] T005 [P] Create Next.js root error boundary in `frontend/app/error.tsx`
- [X] T006 [P] Create Next.js root not-found boundary in `frontend/app/not-found.tsx`
- [X] T007 [P] Create Next.js root loading skeleton in `frontend/app/loading.tsx`
- [X] T008 Create TanStack Query client configuration and provider component in `frontend/components/providers/query-provider.tsx` and register inside `frontend/app/layout.tsx`
- [X] T009 Create Redis client instance with connection pooling and silent offline fallback in `backend/src/config/redis.ts`

**Checkpoint**: Core foundational infrastructure active. User story implementation can begin.

---

## Phase 3: User Story 1 - Foundation, Route Security & Bundle Optimization (Priority: P1) 🎯 MVP

**Goal**: Block unauthorized `/admin/*` navigation at the Edge and eliminate heavy AI chat bundle overhead from initial public page loads.

**Independent Test**:
- `curl -I http://localhost:3000/admin` returns `307 Redirect` to `/admin/login`.
- Verify initial homepage JS bundle does not bundle `katex` or `react-markdown`.

**Implementation Tasks**:
- [X] T010 [US1] Dynamically import `FloatingAiChat` with SSR disabled and deferred scroll trigger in `frontend/app/layout.tsx`
- [X] T011 [US1] Create admin login guard and token validator helper in `frontend/lib/admin-auth.ts`
- [X] T012 [US1] Verify unauthenticated `/admin` access redirection and successful login authentication flow in `frontend/middleware.ts`

---

## Phase 4: User Story 2 - Public Directory & SEO Pages to ISR Server Components (Priority: P1)

**Goal**: Convert public admission, university, and guide routes to Next.js Server Components with ISR and on-demand revalidation.

**Independent Test**:
- `curl -s http://localhost:3000/universities` returns crawlable HTML with `<h1>`, university list, and meta tags without JS execution.
- `curl -s http://localhost:3000/universities/buet` returns pre-rendered admission requirements and seat breakdown.

**Implementation Tasks**:
- [X] T013 [P] [US2] Create server-side data fetching helper with tagged caching (`revalidateTag`) in `frontend/lib/server-api.ts`
- [X] T014 [US2] Create on-demand cache revalidation webhook handler in `frontend/app/api/revalidate/route.ts`
- [X] T015 [US2] Refactor `/universities` from client component to Server Component with ISR (`revalidate = 1800`) in `frontend/app/universities/page.tsx`
- [X] T016 [P] [US2] Extract interactive search, sort, and filter bar into Client Island in `frontend/components/universities/university-filter-island.tsx`
- [X] T017 [US2] Refactor `/universities/[slug]` to Server Component with `generateStaticParams` for top 20 universities in `frontend/app/universities/[slug]/page.tsx`
- [X] T018 [P] [US2] Extract tab switcher and bookmark buttons to Client Island in `frontend/components/universities/university-client-tabs.tsx`
- [X] T019 [US2] Refactor `/admission` from client component to Server Component with ISR (`revalidate = 600`) in `frontend/app/admission/page.tsx`
- [X] T020 [US2] Refactor `/guides` and `/guides/[slug]` to Server Components with ISR (`revalidate = 3600`) in `frontend/app/guides/page.tsx` and `frontend/app/guides/[slug]/page.tsx`

---

## Phase 5: User Story 3 - Backend Redis Caching & Rate Limiting (Priority: P2)

**Goal**: Cache upstream database queries on Hostinger VPS Redis and protect AI endpoints with rate limits.

**Independent Test**:
- Query `/api/universities` twice; verify second response latency `< 5ms` with `X-Cache: HIT` header.
- Execute 7 consecutive AI requests; verify 7th returns HTTP 429 Too Many Requests.

**Implementation Tasks**:
- [X] T021 [P] [US3] Create Redis route caching middleware with configurable TTL in `backend/src/middleware/cache.middleware.ts`
- [X] T022 [P] [US3] Create Redis sliding window rate-limiting middleware in `backend/src/middleware/rate-limit.middleware.ts`
- [X] T023 [US3] Attach Redis caching to `/api/universities`, `/api/admissions`, and `/api/guides` in `backend/src/routes/api.routes.ts`
- [X] T024 [US3] Attach rate limiters to `/api/ai/query` (6 RPM) and global API (120 RPM) in `backend/src/routes/api.routes.ts`
- [X] T025 [US3] Create cache invalidation and Next.js revalidation dispatch helper in `backend/src/services/revalidation.service.ts`
- [X] T026 [US3] Hook admin CMS, university, and circular mutation endpoints to revalidation service in `backend/src/routes/api.routes.ts`

---

## Phase 6: User Story 4 - Client State Management with TanStack Query & Zustand (Priority: P2)

**Goal**: Migrate dashboard and interactive student state to TanStack Query server-cache and Zustand UI stores.

**Independent Test**:
- Navigate between `/dashboard` and `/prepare`; verify cached student tasks load instantly without refetching spinners.
- Select universities for comparison in UI; verify selection survives route transitions in Zustand store.

**Implementation Tasks**:
- [X] T027 [P] [US4] Create Zustand UI store for sidebar drawer and university comparison list in `frontend/lib/stores/use-ui-store.ts`
- [X] T028 [P] [US4] Create persisted Zustand store for student GPA and academic group in `frontend/lib/stores/use-eligibility-store.ts`
- [X] T029 [P] [US4] Create in-memory Zustand store for active mock exam timer and selected answers in `frontend/lib/stores/use-mock-exam-store.ts`
- [X] T030 [US4] Create custom TanStack Query hooks for student dashboard tasks and study streaks in `frontend/hooks/use-student-queries.ts`
- [X] T031 [US4] Refactor Student Dashboard to consume TanStack Query hooks in `frontend/app/dashboard/page.tsx`
- [X] T032 [US4] Refactor Preparation dashboard to consume TanStack Query hooks in `frontend/app/prepare/page.tsx`

---

## Phase 7: User Story 5 - Real-Time AI Streaming & Interactive Performance (Priority: P3)

**Goal**: Implement real token-by-token Server-Sent Events (SSE) for AI chat and optimize `/eligibility` hybrid rendering.

**Independent Test**:
- Send a question in `/chat`; verify text begins rendering in under 500ms via chunked SSE stream.
- Inspect `/eligibility` HTML source; verify GPA rules tables are crawlable in server HTML.

**Implementation Tasks**:
- [X] T033 [US5] Implement Server-Sent Events (SSE) streaming endpoint for AI queries in `backend/src/routes/api.routes.ts`
- [X] T034 [US5] Update AI chat hook to consume live SSE stream in `frontend/hooks/use-ai-chat.ts`
- [X] T035 [P] [US5] Split `/eligibility` into static server-rendered GPA criteria tables and reactive client form island in `frontend/app/eligibility/page.tsx` and `frontend/components/eligibility/eligibility-form-island.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: SEO audit validation, sitemap verification, and crawler configuration

- [X] T036 [P] Update dynamic sitemap generation for all universities, circulars, and guides in `frontend/app/sitemap.ts`
- [X] T037 [P] Update crawler rules in `frontend/app/robots.ts` to disallow private authenticated student routes (`/dashboard`, `/profile`, `/settings`, `/mistakes`)
- [X] T038 Execute Playwright SEO audit to verify FCP, crawlable HTML headings, and zero critical regressions via `pnpm seo:report`

---

## Dependencies & Completion Order

```
Phase 1 (Setup)
     │
     ▼
Phase 2 (Foundational: Middleware, Loading/Error, TanStack/Redis Init)
     │
     ├───────────────────────────────┬───────────────────────────────┐
     ▼                               ▼                               ▼
Phase 3: US1 (MVP)              Phase 4: US2 (SEO & ISR)        Phase 5: US3 (VPS Redis)
Route Security & Bundle         Server Components               Caching & Rate Limits
     │                               │                               │
     └───────────────────────────────┼───────────────────────────────┘
                                     │
                                     ▼
                        Phase 6: US4 (TanStack & Zustand)
                        Dashboard & Preparation State
                                     │
                                     ▼
                        Phase 7: US5 (SSE Streaming & Eligibility)
                                     │
                                     ▼
                        Phase 8: Polish & SEO Report
```

### Parallel Opportunities Identified
- `T003` (Env config), `T005` (Error boundary), `T006` (Not-found), and `T007` (Loading skeleton) can be developed concurrently.
- In Phase 4 (US2): `T013` (Server API helper) and `T016` (Filter Island) can run in parallel with `T015` and `T017`.
- In Phase 5 (US3): `T021` (Cache middleware) and `T022` (Rate limit middleware) can be built in parallel.
- In Phase 6 (US4): `T027`, `T028`, and `T029` (Zustand stores) can all be created in parallel.

---

## Suggested MVP Scope
**MVP = Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1)**:
- Install `@tanstack/react-query` & `zustand`.
- Protect all `/admin/*` routes server-side via `middleware.ts`.
- Dynamically import `<FloatingAiChat />` in `layout.tsx` to instantly slash initial JavaScript bundle size across all routes.
- Implement `error.tsx`, `not-found.tsx`, and `loading.tsx`.
