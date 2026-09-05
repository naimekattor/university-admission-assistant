# Implementation Plan: Seobility SEO Audit Remediation & On-Page Technical Fixes

**Branch**: `003-seo-audit-remediation` | **Date**: 2026-09-05 | **Spec**: [specs/003-seo-audit-remediation/spec.md](spec.md)

**Input**: Seobility technical SEO audit findings for `https://university-admission-assistant.vercel.app/`

---

## Summary

Remediate all technical SEO issues, structural errors, and content quality flags identified in the Seobility audit:
1. **Critical Headings & Word Count**: Resolve the missing `<h1>`, missing `<h2>` headings, missing `<p>` paragraphs, and 20-word count error caused by client-side `<Suspense>` bailing SSR on `GET /`.
2. **SERP Snippet Title Optimization**: Shorten the meta title from 655px (70 chars) to <580px (56 chars) to prevent search snippet truncation.
3. **Link Graph Expansion**: Expose 40+ internal links in initial HTML and add verified external university portal links with `rel="noopener noreferrer"`.
4. **Social Sharing Signals**: Add lightweight sharing options for admission circulars and guides.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Next.js 15+ (App Router), React 19, Tailwind CSS, `@playwright/test`  
**Target Platform**: Search engine crawlers (Googlebot, Bingbot, Seobility, Ahrefs) across Desktop and Mobile  
**Testing**: Playwright technical SEO test suite (`pnpm --filter eduguide-frontend test:seo`), Next.js Turbopack build (`pnpm --filter eduguide-frontend build`), and local non-JS SSR curl/fetch audits.  

---

## Constitution Check

- [x] **Principle I: Truth-First Admission Intelligence & Zero Hallucination**: No fake university data or altered criteria; content expansion uses verified admission guidelines and cluster circulars.
- [x] **Principle II: Deterministic Eligibility & Data-Driven Rules**: Eligibility rules remain decoupled in configuration.
- [x] **Principle III: Architecture & Scope Discipline**: Changes are strictly confined to `app/page.tsx`, `app/layout.tsx`, and component SSR markup. No unrelated backend or database schema modifications.
- [x] **Principle IV: Strict Separation of Concerns & Modular Design**: Next.js App Router patterns preserved with clean Server Component entry and client hydration boundaries.
- [x] **Principle V: Input Integrity, Accessibility & User Safety**: Semantic HTML headings (`<h1>`, `<h2>`, `<p>`) and accessible links adhere to WCAG accessibility guidelines.

---

## Proposed Changes

### Component 1: Server-Side Pre-Rendered Homepage Architecture
#### [MODIFY] [`frontend/app/page.tsx`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/frontend/app/page.tsx)
- Transform `app/page.tsx` into a Server Component entry point.
- Pass `DEFAULT_HOMEPAGE_CONFIG` to pre-render the entire homepage on the server:
  - Hero section with semantic `<h1>` ("Your Ultimate Platform for Seamless Admission & Growth")
  - All 10 section containers with semantic `<h2>` headings
  - Full copy paragraphs (>800 words)
  - 40+ internal links across universities, circulars, and guides
- Isolate client-side `useSearchParams()` for CMS preview logic so that it never wraps or blanks out the server-rendered HTML payload.

### Component 2: Meta Title SERP Optimization
#### [MODIFY] [`frontend/app/layout.tsx`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/frontend/app/layout.tsx)
- Update `title.default` and `openGraph.title` from:
  `EduGuide — Bangladesh University Admission Intelligence & Preparation` (70 chars, 655px)
  to:
  `EduGuide — Bangladesh University Admission & Preparation` (56 chars, ~515px)
- Ensure exact match between Title and `<h1>` target keywords.

### Component 3: Link Graph & External Links
#### [MODIFY] [`frontend/components/homepage/featured-universities-section.tsx`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/frontend/components/homepage/featured-universities-section.tsx)
- Ensure all 6 featured university cards link internally to `/universities/[slug]`.
- Include verified external links to official portals (e.g., `buet.ac.bd`, `du.ac.bd`) with `target="_blank"` and `rel="noopener noreferrer"`.
#### [MODIFY] [`frontend/components/homepage/footer-section.tsx`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/frontend/components/homepage/footer-section.tsx)
- Include links to official regulatory portals (UGC Bangladesh, Ministry of Education, DGHS).

### Component 4: Social Sharing Integration
#### [MODIFY] [`frontend/components/homepage/admission-at-glance.tsx`](file:///c:/Users/naim/Desktop/naim/university-admission-assistant/frontend/components/homepage/admission-at-glance.tsx)
- Add a lightweight social sharing action for circulars (WhatsApp, Facebook, Copy Link).

---

## Verification Plan

### Automated Tests
1. **SSR Crawlability Audit (Non-JS)**:
   ```bash
   node -e "fetch('http://localhost:3000/').then(r=>r.text()).then(h => console.log('H1:', h.includes('<h1'), 'Words:', h.replace(/<[^>]+>/g,' ').split(/\s+/).length, 'Links:', (h.match(/<a\s/g)||[]).length))"
   ```
   - Must show `H1: true`, `Words: >800`, `Links: >35`.
2. **Playwright SEO Test Suite**:
   ```bash
   pnpm --filter eduguide-frontend test:seo
   ```
   - 54/54 tests passing.
3. **Next.js Production Turbopack Build**:
   ```bash
   pnpm --filter eduguide-frontend build
   ```
   - Exit code 0, 0 compilation errors.

### Manual Verification
- Deploy to Vercel and re-run Seobility SEO Checker on `https://university-admission-assistant.vercel.app/` to verify:
  - Critical errors: 0
  - H1: Passed
  - Headings: Passed
  - Word count: Passed (800+ words)
  - Title pixel width: Passed (<580px)
  - On-page score increases from 65% to 90%+.
