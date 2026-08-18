<!--
Sync Impact Report
- Version change: Initial Adoption → 1.0.0
- List of modified principles:
  - Initial ratification of Core Principles I–V
- Added sections:
  - Core Principles (I. Truth-First Admission Intelligence & Zero Hallucination, II. Deterministic Eligibility & Data-Driven Rules, III. Architecture & Scope Discipline, IV. Strict Separation of Concerns & Modular Design, V. Input Integrity, Accessibility & User Safety)
  - Technology Stack & Architectural Constraints
  - Quality Gates & Development Workflow
  - Governance
- Removed sections: None
- Follow-up TODOs: None
-->

# AI Admission Assistant Constitution

## Core Principles

### I. Truth-First Admission Intelligence & Zero Hallucination (NON-NEGOTIABLE)
- AI models MUST NEVER invent, extrapolate, or hallucinate university admission requirements, eligibility criteria, GPA cutoffs, or quota rules.
- All admission guidance, requirement summaries, and chatbot responses MUST be grounded in verified data retrieved from the application's knowledge base via Retrieval-Augmented Generation (RAG).
- AI components MUST explain and cite retrieved, verified information rather than fabricating plausible answers.
- Admission-year differences (e.g., changes in HSC batches, exam seat plans, grading policies, unit restructuring) MUST be handled explicitly with distinct year attribution.
- Missing, ambiguous, or outdated admission information MUST be handled safely and transparently by disclosing known limitations rather than guessing.
- *Rationale*: University admission decisions directly affect students' academic futures; incorrect guidance creates severe real-world harm and destroys user trust.

### II. Deterministic Eligibility & Data-Driven Rules
- Admission requirements (e.g., GPA minimums, group-specific criteria, subject prerequisites, second-time admission eligibility) MUST be modeled as structured, maintainable data (database/configuration) and MUST NEVER be hardcoded inside UI components.
- Eligibility calculations, prerequisite evaluations, and score calculations MUST be pure, deterministic, and independently testable business logic.
- UI components MUST only consume evaluation outcomes without embedding domain calculation rules.
- *Rationale*: University criteria change periodically across clusters (General, Engineering, GST, Medical, Agri); keeping data separate from presentation ensures maintainability, auditability, and immediate updateability.

### III. Architecture & Scope Discipline
- Existing functionality, database schemas, and user-facing workflows MUST be preserved during all feature additions and bug fixes.
- Developers and AI agents MUST NOT rewrite, refactor, or modify unrelated files or code outside the direct scope of the active task.
- Do NOT introduce additional databases, authentication providers, vector stores, or state management frameworks when the existing architecture already provides the required capability.
- Avoid unnecessary external dependencies and premature abstractions.
- *Rationale*: Preserving scope discipline prevents regressions, controls technical debt, and maintains codebase coherence.

### IV. Strict Separation of Concerns & Modular Design
- Follow the established Next.js App Router architecture and maintain strict TypeScript typing across all application boundaries.
- Business logic, database operations (Drizzle ORM / PostgreSQL), and vector search operations (Qdrant) MUST remain strictly decoupled from React UI components, isolated within dedicated services/actions/lib utilities.
- UI components MUST follow the established design system, utilizing Tailwind CSS, component primitives (Radix/Base UI), and reusable component patterns.
- *Rationale*: Clear separation between presentation, domain calculation, and persistence layers ensures testability, modularity, and smooth feature evolution.

### V. Input Integrity, Accessibility & User Safety
- All user inputs (e.g., SSC/HSC GPA, subject grade points, passing years, exam groups, search keywords) MUST be validated on both client and server boundaries.
- All user interfaces MUST be responsive across mobile and desktop devices and adhere to core accessibility standards.
- *Rationale*: Accurate calculations depend on clean, validated input, and an accessible interface ensures equitable access for students across varied devices and network conditions.

## Technology Stack & Architectural Constraints

- **Framework & Language**: Next.js (App Router), React 19, TypeScript with strict type checking.
- **Package Manager**: `pnpm` (strictly enforced; do not use `npm` or `yarn`).
- **Styling & UI**: Tailwind CSS, Shadcn UI / Base UI component conventions, Lucide icons, Framer Motion / GSAP where animated.
- **Persistence Layer**: PostgreSQL with Drizzle ORM (`drizzle-kit` for schema management and migrations).
- **Vector Search & Knowledge Base**: Qdrant vector database with dedicated embedding pipelines for admission circulars and requirements.
- **AI & RAG Layer**: Vercel AI SDK integration connecting to configured LLM providers (Anthropic, OpenAI, Groq, Google Generative AI, Ollama).

## Quality Gates & Development Workflow

- **Zero Regression Policy**: New features and bug fixes MUST NOT break or alter existing application behaviors or user flows.
- **Testability**: Core eligibility calculation engines, RAG retrieval pipelines, and major data ingestion utilities MUST be covered with automated tests or deterministic verification scripts.
- **Change Isolation**: PRs and commits MUST be focused and atomic; modifying unrelated files or performing opportunistic refactoring is strictly forbidden.
- **Verification Before Delivery**: Changes MUST be verified locally with linting, type checking, and relevant test/seed scripts before completion.

## Governance

This constitution serves as the supreme architectural and quality standard for the AI Admission Assistant project. All feature specifications, implementation plans, tasks, and pull requests MUST comply with the principles and constraints established herein.

- **Amendment Process**: Amendments to this constitution require explicit documentation, impact assessment, and version increment.
- **Compliance Review**: All proposed changes must be evaluated against the Core Principles, especially Truth-First AI behavior and Deterministic Eligibility.
- **Versioning Policy**: Semantic versioning (`MAJOR.MINOR.PATCH`):
  - **MAJOR**: Incompatible governance shifts, removal of core principles, or structural changes to project philosophy.
  - **MINOR**: Addition of new principles, architectural standards, or materially expanded sections.
  - **PATCH**: Clarifications, wording improvements, and non-semantic corrections.

**Version**: 1.0.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-08-18
