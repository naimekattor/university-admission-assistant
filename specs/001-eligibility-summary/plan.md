# Implementation Plan: University Eligibility Summary

**Branch**: `001-eligibility-summary` | **Date**: 2026-08-18 | **Spec**: [specs/001-eligibility-summary/spec.md](spec.md)

**Input**: Feature specification from `specs/001-eligibility-summary/spec.md`

## Summary

Add a comprehensive, truth-grounded University Eligibility Summary to the AI Admission Assistant. When a student inputs their academic credentials (SSC GPA, HSC GPA, HSC group, passing year), the system deterministically evaluates their qualifications against structured university admission criteria and displays an interactive summary screen. The summary presents the student's academic profile, eligible units (with satisfied criteria and unverified subject prerequisites), ineligible units (with explicit shortfall reasons), tabbed filtering controls (`All`, `Eligible`, `Ineligible`), search, and inline recalculation.

## Technical Context

**Language/Version**: TypeScript 5.7+ with strict type checking  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React icons, UI primitives (`AnimatedCard`, `BorderBeamButton`, `Button`, `Input`)  
**Storage**: In-memory structured dataset (`universitiesDepartments`) in `lib/services/eligibility-engine.ts` (active source of truth)  
**Testing**: Deterministic unit verification scenarios and UI validation (no external test runner changes required)  
**Target Platform**: Web application (Responsive: Mobile 375px, Tablet 768px, Desktop 1280px+)  
**Project Type**: Next.js Full-Stack Web Application  
**Performance Goals**: Instant evaluation (< 50ms client calculation, summary view rendered in < 1s)  
**Constraints**: Zero LLM hallucination of admission cutoffs; strict separation of business logic from UI; no database migration; zero regression to existing routes  
**Scale/Scope**: Unified summary flow in `app/eligibility/page.tsx` powered by pure functions in `lib/services/eligibility-engine.ts`  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Truth-First Admission Intelligence & Zero Hallucination**: PASS. All evaluations are pure, deterministic functions computed strictly from structured criteria. Zero LLM guessing or hallucination.
- **Principle II: Deterministic Eligibility & Data-Driven Rules**: PASS. All criteria are stored as structured dataset attributes and evaluated via decoupled business logic in `lib/services/eligibility-engine.ts`.
- **Principle III: Architecture & Scope Discipline**: PASS. Preserves existing codebase patterns; does not introduce new databases, auth providers, or unnecessary dependencies; edits are isolated strictly to `/eligibility` and the eligibility engine service.
- **Principle IV: Strict Separation of Concerns & Modular Design**: PASS. Domain logic in `lib/services/`, presentation in `app/eligibility/page.tsx` utilizing established Tailwind and UI component patterns.
- **Principle V: Input Integrity, Accessibility & User Safety**: PASS. Client and engine validation for GPA ranges ($0.00 - 5.00$), accessible headings, clean semantic markup, and responsive layouts.

## Project Structure

### Documentation (this feature)

```text
specs/001-eligibility-summary/
├── plan.md              # Implementation plan (this document)
├── research.md          # Phase 0 technical decisions & context
├── data-model.md        # Phase 1 data entities, interfaces & validation rules
├── quickstart.md        # Phase 1 test scenarios & verification guide
├── contracts/           # Phase 1 interface contracts
│   └── eligibility-service-contract.md
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
app/
└── eligibility/
    └── page.tsx                         # Enhanced interactive summary page (Profile, Tabs, Cards, Filter)

lib/
└── services/
    └── eligibility-engine.ts            # Enriched dataset, rule evaluation logic, summary engine
```

**Structure Decision**: Web application utilizing Next.js App Router. Business evaluation logic resides in `lib/services/eligibility-engine.ts` and presentation lives in `app/eligibility/page.tsx`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| None | N/A | N/A |
