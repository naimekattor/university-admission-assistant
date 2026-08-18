# Phase 0 Research & Technical Decisions: University Eligibility Summary

**Feature**: `001-eligibility-summary`  
**Date**: 2026-08-18  
**Status**: Completed  

---

## 1. Technical Context & Resolved Decisions

### Decision 1: Active Data Source & Rule Schema
- **Decision**: Retain and enrich the in-memory dataset (`universitiesDepartments`) in `lib/services/eligibility-engine.ts` as the active source of truth.
- **Rationale**: 
  - Aligns strictly with Constitution Principle III (Scope Discipline & Non-Proliferation) and user guidance.
  - Keeps eligibility checks instant, synchronous, pure, and testable without introducing database migration churn or async IO latency.
- **Alternatives Considered**: 
  - Migrating to Drizzle ORM PostgreSQL tables: Rejected because database tables currently do not power the active `/eligibility` flow and would introduce unnecessary architectural complexity and breaking changes.

### Decision 2: Rule-Specific GPA Evaluation Logic (FR-003 & FR-005)
- **Decision**: Evaluate only the specific GPA rule fields declared for each department (`minSscGPA?`, `minHscGPA?`, `minCombinedGPA?`, `minGPA?`).
- **Rationale**: 
  - Different universities in Bangladesh employ diverse criteria (e.g., BUET requires individual SSC ≥ 4.0, HSC ≥ 4.0, Total ≥ 9.0; DU has faculty-specific combined cutoffs; general universities may use average GPA).
  - Eliminates universal averaging assumptions and adheres to Truth-First admission rules.
- **Alternatives Considered**: 
  - Standardized average GPA for all: Rejected because it violates university-specific circular rules and constitutional truth standards.

### Decision 3: Categorization & "Verification Pending" Protocol (FR-010)
- **Decision**:
  - `Eligible`: All verifiable criteria (GPA, Group, Passing Year) pass, and all subject prerequisites are satisfied.
  - `Eligible (Verification Pending)`: Verifiable thresholds (GPA, Group, Year) pass, but required subject-level letter grades (e.g., Math/Physics grade) or circular terms require manual confirmation.
  - `Ineligible`: At least one verified criterion (GPA threshold, group, passing year) failed, accompanied by explicit gap delta.
- **Rationale**: Provides clear guidance without premature disqualification or false certainty.
- **Alternatives Considered**: 
  - Hard disqualification on unsupplied subject grades: Rejected because students submitting basic aggregate GPA would be falsely excluded from departments they likely qualify for.

### Decision 4: Presentation Architecture & Component Modularity
- **Decision**: Implement a modular UI within `app/eligibility/page.tsx` structured as:
  1. `AcademicProfileCard`: Sticky or top summary of submitted marks and group.
  2. `SummaryTabBar`: Interactive tab bar (`All`, `Eligible`, `Ineligible`) with live counter badges and search filter.
  3. `EligibilityCard`: Enhanced result card displaying satisfied rules, unsatisfied rules, pending prerequisites, seats, fees, deadlines, and direct action links.
- **Rationale**: Keeps state transitions smooth, avoids full page reloads, and preserves responsive aesthetics.

---

## 2. Technology & Best Practices Baseline

- **Language**: TypeScript 5.7+ with strict typing.
- **Framework**: Next.js 16 (App Router), React 19.
- **Styling**: Tailwind CSS v4, Lucide React icons, and project UI primitives (`AnimatedCard`, `BorderBeamButton`, `Button`, `Input`).
- **Package Manager**: `pnpm` exclusively.
