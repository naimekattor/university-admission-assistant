# Feature Specification: GSAP Motion & Interaction System

**Feature Branch**: `002-gsap-motion-system`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "Introduce a premium GSAP-based animation system across the public website for EduGuide. Make EduGuide feel modern, premium, smooth, trustworthy, and polished (reminiscent of Linear, Stripe, Vercel) while keeping the website extremely fast, accessible, SEO-friendly, and easy to use. Do not redesign the website, do not change existing branding, do not replace current layout/content, do not turn it into an animation showcase, do not hijack native browser scrolling, and ensure strict prefers-reduced-motion support and 60fps performance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Premium Hero Section Entrance & Ambient Polish (Priority: P1)

As a student visiting EduGuide for the first time, I want to experience a refined, cohesive, and modern entrance animation on the homepage hero section that immediately builds confidence in the platform's professionalism without delaying my ability to read information or interact with the call to actions.

**Why this priority**: The hero section forms the first impression of EduGuide. A subtle, choreographed entrance and ambient interactive depth (floating badge, count-up statistics, soft gradient glow) establish instant trust and authority.

**Independent Test**: Load the homepage on desktop and mobile. Verify that the navbar, hero eyebrow, headline, subtext, CTA buttons, and floating preview cards animate smoothly in sequence within 1.2 seconds, with no layout shifts or jerky frames.

**Acceptance Scenarios**:
1. **Given** a visitor lands on the homepage, **When** the page hydrates, **Then** the hero elements (eyebrow, title, description, buttons, review pill) reveal with a choreographed upward fade (`y: 20 -> 0`, `opacity: 0 -> 1`), while the preview cards (readiness score gauge and time spent bars) animate their metrics cleanly (e.g., counting up to 80% and 13.6h).
2. **Given** an ambient background glow behind the hero, **When** the hero is idle, **Then** the radial glow pulses with a subtle, non-distracting sinusoidal float loop (`y: ±8px`, duration 6s, ease: "sine.inOut").
3. **Given** interactive buttons in the hero, **When** hovered or focused, **Then** subtle micro-interactions (soft scale `1.02`, glow elevation) respond predictably without breaking layout flow.

---

### User Story 2 - Scroll-Triggered Content Reveal Across Core Homepage Sections (Priority: P1)

As a prospective applicant scrolling through the homepage to research admission deadlines, university circulars, and the eligibility tool, I want sections to gracefully enter the viewport as I scroll down, guiding my focus without stuttering or blocking the content.

**Why this priority**: High-density admission data tables and circular cards can feel overwhelming if rendered statically. Staggered, scroll-triggered reveals provide visual pacing and structural clarity.

**Independent Test**: Scroll down from the hero through the Dashboard Preview, Admission at a Glance, Eligibility Checker, Deadlines, Featured Universities, AI Advisor, Guides, FAQ, and Footer. Confirm each section smoothly reveals once it enters the viewport (top 85%), with animations triggering only once.

**Acceptance Scenarios**:
1. **Given** a user scrolls down to "Admission at a Glance", **When** the table enters the viewport, **Then** the container fades in and the first 4 visible circular rows stagger in rapidly (stagger 0.05s) without impeding search filtering or pagination.
2. **Given** a user scrolls down to "Featured Universities", **When** the grid enters the viewport, **Then** the university cards stagger upward smoothly (`y: 24 -> 0`, `opacity: 0 -> 1`), and hovering any card provides a tactile lift (`y: -4px`) and refined border glow.
3. **Given** dynamic components like the Eligibility Checker, **When** a user calculates their eligibility and results appear, **Then** the results container springs into view with a crisp, reassuring motion (`scale: 0.98 -> 1`, `opacity: 0 -> 1`).

---

### User Story 3 - Full Accessibility & Reduced-Motion Mode (Priority: P1)

As a user with vestibular sensitivities, motion sickness, or reduced-motion OS preferences enabled, I want EduGuide to instantly display all content statically without transitions or motion so that I can safely navigate the platform.

**Why this priority**: Web accessibility compliance (WCAG 2.1 Level AA) is mandatory. Motion sickness and vestibular triggers must be strictly prevented.

**Independent Test**: Enable "prefers-reduced-motion: reduce" in system settings or browser DevTools emulation. Reload and navigate the entire website. Verify that all elements are immediately visible (`opacity: 1`, `transform: none`) with zero animated delays or transitions.

**Acceptance Scenarios**:
1. **Given** a system with `prefers-reduced-motion: reduce` active, **When** the page loads or scrolls, **Then** GSAP timelines and ScrollTriggers are bypassed or rendered instantaneously (`duration: 0`), ensuring zero motion or opacity delays.
2. **Given** any animated counter or gauge, **When** reduced motion is active, **Then** the final values (e.g. "80%", "13.6h") are rendered immediately without counting up.

---

### User Story 4 - SEO-Safe Rendering & Native Scroll Integrity (Priority: P1)

As a search engine crawler (Googlebot) or keyboard-reliant user, I want all semantic HTML and text content to be immediately accessible in the DOM without scroll-hijacking, layout shifts, or hidden text that would damage organic search rankings.

**Why this priority**: EduGuide depends critically on organic search traffic from Bangladeshi students. Any animation system that hides content from crawlers or breaks standard browser scrolling is unacceptable.

**Independent Test**: Run automated SEO audit scripts (`pnpm --filter eduguide-frontend test:seo`) and Playwright crawlers. Verify 100% crawlability, intact meta tags, no CLS (Cumulative Layout Shift > 0.05), and preserved native smooth scrolling (`scroll-behavior: smooth`).

**Acceptance Scenarios**:
1. **Given** search bots or automated crawlers fetching HTML, **When** inspecting DOM elements, **Then** all textual content, headings, and links are present in standard server-rendered and hydrated HTML.
2. **Given** the page layout, **When** animations initialize, **Then** initial states utilize inline `transform` and `opacity` properties without causing layout recalculations or layout shifts.
3. **Given** user scrolling with mousewheel, touchpad, or keyboard arrows, **When** scrolling anywhere on the page, **Then** browser-native scroll physics are completely preserved (no ScrollSmoother, no scroll lock, no hijacked delta).

---

### User Story 5 - Mobile Optimization & Responsive Adaptation (Priority: P2)

As a student browsing on a budget mobile smartphone or slower 4G connection, I want animations to be lightweight, hardware-accelerated, and free of frame drops or battery drain.

**Why this priority**: Over 70% of Bangladeshi students access admission circulars on mobile devices. Motion must remain fluid at 60fps on mobile without causing thermal throttling or jank.

**Independent Test**: Throttle CPU 4x in Chrome DevTools under Mobile viewport (375x667). Scroll through the homepage and verify frame rates stay consistent with smooth scrolling and simplified triggers.

**Acceptance Scenarios**:
1. **Given** a mobile viewport (<768px), **When** sections animate, **Then** stagger times and translation distances are reduced (e.g. `y: 12px` instead of `y: 28px`), complex multi-layer floats are simplified, and `gsap.matchMedia()` applies touch-friendly parameters.
2. **Given** navigation on mobile, **When** navigating between pages, **Then** all ScrollTrigger instances are cleanly killed and garbage collected via `gsap.context().revert()` to prevent memory leaks.

---

## Edge Cases

- **Fast Scrolling / Scrubbing**: If a user scrolls rapidly to the bottom of the page before animations complete, all elements must gracefully settle into their final resting state (`opacity: 1`, `transform: none`) without getting stuck in a hidden/half-rendered state.
- **Component Re-rendering & Tab Switching**: When dynamic state changes in the Eligibility Checker or Admission search table, existing animations must not reset unexpectedly or trigger flickering.
- **SSR / Hydration Mismatch**: GSAP must only execute on the client (`typeof window !== 'undefined'` and `useEffect` / `useIsomorphicLayoutEffect`), ensuring zero React hydration warnings.
- **Page Unmount & Route Changes**: Navigating from `/` to `/universities` or `/guides` must immediately dispose of all active timelines and ScrollTrigger listeners to avoid memory leaks.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST utilize existing `gsap` dependency (`gsap: ^3.15.0`) with `ScrollTrigger` safely registered in client-side runtime.
- **FR-002**: System MUST implement a unified motion utility (`frontend/lib/animations/gsap-motion.ts`) and custom React hook (`frontend/hooks/use-gsap-motion.ts`) with lifecycle cleanup via `gsap.context()`.
- **FR-003**: System MUST respect user accessibility settings by automatically detecting `prefers-reduced-motion: reduce` and disabling all motion effects.
- **FR-004**: System MUST choreograph the hero section entrance (`HeroSection`) with a staggered sequence (eyebrow -> headline -> description -> CTA buttons -> metric cards).
- **FR-005**: System MUST animate preview card metrics (readiness score gauge count-up to 80% and hours count-up to 13.6h) using smooth GSAP tween counters.
- **FR-006**: System MUST add a subtle, non-intrusive ambient floating animation to the hero background glow and interactive badges (`y: ±6px to ±8px`, duration 5–7s, sine easing).
- **FR-007**: System MUST provide viewport-triggered entrance reveals (`useScrollTriggerReveal`) for `DashboardPreviewFrame`, `AdmissionAtGlance`, `EligibilityCheckerSection`, `DeadlinesSection`, `FeaturedUniversitiesSection`, `AiAdvisorPreviewSection`, `GuidesSection`, `FaqSection`, `PreparationCtaSection`, and `FooterSection`.
- **FR-008**: System MUST limit table row stagger in `AdmissionAtGlance` to the first 4 rows with rapid stagger (0.05s) to guarantee search scanning is never obstructed.
- **FR-009**: System MUST animate dynamic eligibility results in `EligibilityResultsDisplay` with a subtle spring-in on form evaluation.
- **FR-010**: System MUST preserve browser-native scroll physics and MUST NOT hijack scrolling (no ScrollSmoother or custom wheel interceptors).
- **FR-011**: System MUST strictly preserve the existing EduGuide color palette (`#FF5500` accent orange, `#FAF8F5` background, slate text) and card typography.
- **FR-012**: System MUST ensure that initial animation states (`opacity: 0`, `y: 20`) do not hide text from web crawlers or cause layout shifts.
- **FR-013**: System MUST utilize `gsap.matchMedia()` to simplify or shorten animations on mobile screens (< 768px).
- **FR-014**: System MUST maintain 100% pass rate on all 54 existing SEO tests and automated crawler audits.
- **FR-015**: System MUST clean up all GSAP timelines and ScrollTriggers on component unmount using `ctx.revert()`.

---

## Success Criteria *(mandatory)*

- **SC-001**: Hero entrance animation sequence finishes within 1.2 seconds of initial client hydration.
- **SC-002**: 100% of all public pages maintain native 60fps scrolling performance on desktop and mobile viewports.
- **SC-003**: 100% compliance with `prefers-reduced-motion: reduce`: zero animated delays or transitions when active.
- **SC-004**: Cumulative Layout Shift (CLS) remains below 0.05 across all animated sections.
- **SC-005**: Zero memory leaks or dangling event listeners across 20 consecutive client-side route transitions.
- **SC-006**: 100% of SEO test suite passes (54/54 tests) with zero indexation or crawler accessibility regressions.
