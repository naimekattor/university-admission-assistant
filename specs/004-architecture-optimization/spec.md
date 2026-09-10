# Feature Specification: Full-Stack Architecture & Performance Optimization

**Feature Directory**: `specs/004-architecture-optimization`  
**Created**: 2026-09-05  
**Status**: Ready for Implementation  
**Context**: Architecture audit of EduGuide ([university-admission-assistant.vercel.app](https://university-admission-assistant.vercel.app/))  

---

## 1. Objective & Problem Statement

EduGuide is a high-traffic Bangladesh university admission intelligence and student preparation platform. The current application suffers from:
1. **Pervasive `'use client'` usage**: Public SEO pages (`/universities`, `/universities/[slug]`, `/admission`, `/guides`, `/eligibility`) render client-side and fetch on mount via `useEffect`, hurting SEO crawling, First Contentful Paint (FCP), and Largest Contentful Paint (LCP).
2. **Global Bundle Bloat**: Root `layout.tsx` imports `<FloatingAiChat />` on every page, bundling heavy math (`katex`) and markdown (`react-markdown`) libraries into initial page loads.
3. **Security Vulnerability**: Admin routes (`/admin/*`) lack server-side middleware protection; client components render before credential verification.
4. **Missing Cache Architecture**: Next.js fetch caching is bypassed with `cache: 'no-store'`, Redis is not yet connected on the backend, and state is scattered across ad-hoc `useState` and `localStorage`.

The objective is to execute the architectural blueprint:
- **Server Components & ISR** for public SEO content.
- **Admin Middleware & Root Layout Optimization**.
- **Shared Redis Caching & Rate Limiting** on the Hostinger VPS backend.
- **Decoupled Frontend State**: TanStack Query for server-state and Zustand for client UI state.
- **True SSE AI Streaming** for the admission advisor and tutor.

---

## 2. User Stories & Priority

### User Story 1 - Foundation, Route Security & Bundle Optimization (Priority: P1) 🎯 MVP
As an administrator and visitor, I want `/admin/*` routes to be strictly protected server-side via `middleware.ts`, and public pages to load without heavy unneeded chat dependencies, so that security is enforced at the edge and initial page load speed is maximized.

**Acceptance Scenarios**:
1. **Given** an unauthenticated request to any `/admin/*` route (e.g. `/admin/universities`), **When** handled by Next.js, **Then** `middleware.ts` intercepts and redirects to `/admin/login` before any page components render.
2. **Given** any public route (e.g. `/`), **When** loaded, **Then** `<FloatingAiChat />` is dynamically imported and does not block critical rendering path.
3. **Given** a 404 or server error, **When** navigated to, **Then** dedicated `not-found.tsx` and `error.tsx` boundaries render seamlessly.
4. **Given** `@tanstack/react-query` and `zustand`, **When** installed in `frontend`, **Then** the foundational providers are active and ready for client state.

---

### User Story 2 - Public SEO Pages to ISR & Server Components (Priority: P1)
As a search engine crawler (Googlebot) or student, I want university profiles, circulars, and guides to be pre-rendered as crawlable HTML with Incremental Static Regeneration (ISR) and instant cache revalidation, so that search rankings are maximized and page load time is under 200ms.

**Acceptance Scenarios**:
1. **Given** a crawler requests `/universities` or `/universities/[slug]`, **When** received, **Then** full semantic HTML (headings, admission criteria, seat matrix) is returned without client hydration delay.
2. **Given** `/universities/[slug]`, **When** built in production, **Then** `generateStaticParams()` pre-renders the top 20 universities.
3. **Given** an admin publishes changes, **When** the backend fires the webhook `POST /api/revalidate`, **Then** Next.js revalidates the affected path and tags (`revalidateTag`) immediately.

---

### User Story 3 - Backend Redis Caching & Rate Limiting (Priority: P2)
As a platform operator on a cost-sensitive Hostinger KVM 2 VPS, I want repeated queries cached in Redis and AI requests rate-limited, so that database queries are minimized and the service remains responsive without exceeding free tier limits.

**Acceptance Scenarios**:
1. **Given** requests to `/api/universities`, `/api/admissions`, `/api/guides`, **When** queried repeatedly, **Then** responses are served from Redis with `<5ms` latency.
2. **Given** incoming AI queries, **When** exceeding 6 requests/minute per session, **Then** a 429 Too Many Requests response is returned gracefully.
3. **Given** an admin updates a record, **When** committed to PostgreSQL, **Then** the corresponding Redis cache keys are invalidated.

---

### User Story 4 - Client State Refactor with TanStack Query & Zustand (Priority: P2)
As a student navigating the dashboard and preparation modules, I want fast, flicker-free data updates with cached server-state and persisted UI preferences, so that my target goals, daily tasks, and exam states remain synchronized.

**Acceptance Scenarios**:
1. **Given** `/dashboard` and `/prepare`, **When** loaded, **Then** data is fetched and cached via TanStack Query hooks with defined `staleTime`.
2. **Given** UI drawer toggles, university comparison lists, and exam timers, **When** updated, **Then** state is managed via lightweight Zustand stores.

---

### User Story 5 - Real-Time AI Streaming & Interactive Performance (Priority: P3)
As a student asking admission questions or solving problems with the AI Tutor, I want genuine token-by-token streaming via Server-Sent Events (SSE), so that responses start displaying within 500ms rather than waiting for full completion.

**Acceptance Scenarios**:
1. **Given** a user query in `/chat` or `<FloatingAiChat />`, **When** processed by the backend, **Then** tokens stream over SSE with real-time UI rendering.
2. **Given** `/eligibility`, **When** loaded, **Then** static SEO text and GPA rules are server-rendered while the interactive qualifier form operates as an isolated client island.
