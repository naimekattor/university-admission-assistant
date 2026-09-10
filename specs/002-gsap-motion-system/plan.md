# Implementation Plan: GSAP Motion & Interaction System

**Branch**: `002-gsap-motion-system` | **Date**: 2026-09-05 | **Spec**: [specs/002-gsap-motion-system/spec.md](spec.md)

**Input**: Feature specification from `specs/002-gsap-motion-system/spec.md`

## Summary

Introduce a production-grade, premium GSAP-based motion and interaction system across the public EduGuide application. The motion system delivers choreographed entrance sequences for the hero section, scroll-triggered reveals for 10 downstream homepage sections, animated numerical counters (readiness score gauge and study hours), tactile micro-interactions on cards/buttons, and an ambient background breathing loop. The implementation enforces strict performance (60fps, GPU-accelerated compositing), zero scroll-hijacking (browser-native scrolling), comprehensive accessibility (`prefers-reduced-motion: reduce` zero-delay bypass), safe lifecycle cleanup via `gsap.context()`, and complete SEO preservation (retaining 54/54 passing Playwright SEO audit tests).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: Next.js 15.x (App Router), React 19, `gsap: ^3.15.0` (with `ScrollTrigger`), `lucide-react`, Tailwind CSS 3.4

**Storage**: N/A (Client-side presentation and interaction layer; no database schema migrations or persistence changes)

**Testing**: Playwright test suite (`pnpm test:seo`), Next.js production build (`pnpm build`), manual DevTools verification (Chrome DevTools reduced-motion emulation, CPU throttling, mobile viewport testing)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge) across Desktop & Mobile (iOS / Android)

**Project Type**: Next.js Full-Stack Web Application (Client-Side Motion Subsystem)

**Performance Goals**: Solid 60 fps frame rendering during active scrolling; Hero entrance animation completes in < 1.2s; Zero Cumulative Layout Shift (CLS < 0.05); Zero delay or blank screen for users with `prefers-reduced-motion`

**Constraints**:
1. Do not hijack browser scrolling (strictly NO `ScrollSmoother` or custom wheel listeners).
2. Do not hide semantic text or SEO metadata from search engine crawlers.
3. Strict `prefers-reduced-motion` bypass rendering elements immediately.
4. Clean lifecycle teardown using `gsap.context()` to prevent memory leaks during Next.js client-side navigation.
5. Preserve existing EduGuide branding (`#FF5500`, `#FAF8F5`, slate text) and card typography.

**Scale/Scope**: 12 client components across the public homepage:
- `Navbar` (`components/navbar.tsx`)
- `HeroSection` (`components/homepage/hero-section.tsx`)
- `DashboardPreviewFrame` (`components/homepage/dashboard-preview-frame.tsx`)
- `AdmissionAtGlance` (`components/homepage/admission-at-glance.tsx`)
- `EligibilityCheckerSection` (`components/homepage/eligibility-checker-section.tsx`)
- `EligibilityResultsDisplay` (`components/homepage/eligibility-results-display.tsx`)
- `FeaturedUniversitiesSection` (`components/homepage/featured-universities-section.tsx`)
- `AiAdvisorPreviewSection` (`components/homepage/ai-advisor-preview-section.tsx`)
- `DeadlinesSection` (`components/homepage/deadlines-section.tsx`)
- `GuidesSection` (`components/homepage/guides-section.tsx`)
- `FaqSection` (`components/homepage/faq-section.tsx`)
- `PreparationCtaSection` (`components/homepage/preparation-cta-section.tsx`)
- `FooterSection` (`components/homepage/footer-section.tsx`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
| :--- | :--- | :--- |
| **I. Truth-First Admission Intelligence & Zero Hallucination** | Motion system is purely presentational. Does not generate, alter, or fabricate any admission rules, cutoffs, or circular data. | **PASS** |
| **II. Deterministic Eligibility & Data-Driven Rules** | Eligibility calculation logic in `lib/services/eligibility-engine.ts` remains untouched; UI only animates the presentation of results. | **PASS** |
| **III. Architecture & Scope Discipline** | No new databases, ORMs, or state libraries added. Uses already-installed `gsap: ^3.15.0`. No modifications to unrelated backend or DB files. | **PASS** |
| **IV. Strict Separation of Concerns & Modular Design** | Animation utilities encapsulated in `frontend/lib/animations/gsap-motion.ts` and `frontend/hooks/use-gsap-motion.ts`, decoupled from data fetching. | **PASS** |
| **V. Input Integrity, Accessibility & User Safety** | Strict support for `prefers-reduced-motion: reduce`; responsive adaptation on mobile via `gsap.matchMedia()`; zero hindrance to keyboard navigation. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/002-gsap-motion-system/
├── plan.md              # This file (Speckit plan)
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technical decisions & rationale
├── data-model.md        # Phase 1: Motion tokens & runtime configuration
├── quickstart.md        # Phase 1: Developer quickstart & verification scenarios
└── contracts/
    └── motion-system-api.md # Phase 1: Core utility & hook interfaces
```

### Source Code (repository root)

```text
frontend/
├── lib/
│   └── animations/
│       └── gsap-motion.ts         # Core GSAP registration, motion presets, reduced-motion check
├── hooks/
│   └── use-gsap-motion.ts         # useGsapContext & useScrollTriggerReveal custom hooks
└── components/
    ├── navbar.tsx                 # Header entrance & scroll elevation
    └── homepage/
        ├── hero-section.tsx       # Choreographed entrance, count-ups, ambient glow
        ├── dashboard-preview-frame.tsx # Scale & fade scroll reveal
        ├── admission-at-glance.tsx     # Table container & top rows stagger reveal
        ├── eligibility-checker-section.tsx # Form entrance
        ├── eligibility-results-display.tsx # Dynamic results spring-in
        ├── deadlines-section.tsx       # Timeline cards stagger reveal
        ├── featured-universities-section.tsx # Grid cards stagger & hover lift
        ├── ai-advisor-preview-section.tsx    # Floating avatar & prompt pill transition
        ├── guides-section.tsx          # Card grid reveal
        ├── faq-section.tsx             # Accordion entrance reveal
        ├── preparation-cta-section.tsx # Warm radial pulse & CTA reveal
        └── footer-section.tsx          # Subtle viewport fade-up
```

**Structure Decision**: Web application frontend architecture adhering to Next.js App Router conventions. All animation code is organized under `frontend/lib/animations/` and `frontend/hooks/` to maximize modularity and reuse across existing components.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *None* | No architectural violations detected | N/A |
