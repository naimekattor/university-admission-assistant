# Quickstart & Verification Guide: GSAP Motion System

**Feature**: `002-gsap-motion-system`  
**Date**: 2026-09-05  

This guide provides rapid end-to-end verification workflows for testing the GSAP animation system across environments.

---

## 1. Prerequisites & Setup

Ensure the Next.js frontend dependencies are installed and the development server can run:

```bash
# Verify gsap dependency
pnpm --filter eduguide-frontend list gsap

# Start Next.js development server
pnpm --filter eduguide-frontend dev
```

Open `http://localhost:3000` in Google Chrome or Edge.

---

## 2. Test Scenarios

### Scenario 1: Hero Choreography & Metric Counters
1. Hard reload `http://localhost:3000` (`Ctrl + Shift + R`).
2. Observe the hero entrance:
   - Eyebrow badge ("Bangladesh Admission Platform") fades down (`y: -10 -> 0`).
   - Main headline ("Find Your Right University...") fades up (`y: 20 -> 0`).
   - Paragraph subtitle and CTA buttons fade in sequentially.
   - The left readiness gauge counter animates from `0%` to `80%`.
   - The right study time counter animates from `0.0h` to `13.6h`.
   - The radial background glow breathes with a soft floating loop (`y: ±8px`).

### Scenario 2: ScrollTrigger Section Reveals
1. Slowly scroll down the homepage.
2. Verify that as each section enters the top 85% of the viewport:
   - `DashboardPreviewFrame`: Scales smoothly into position (`scale: 0.96 -> 1`).
   - `AdmissionAtGlance`: Container fades up; top 4 table rows enter with rapid stagger.
   - `FeaturedUniversitiesSection`: University cards stagger in from below. Hovering a card produces a `-4px` vertical lift with smooth easing.
   - `EligibilityCheckerSection`: Form reveals smoothly. Fill out the GPA form (e.g. SSC 5.0, HSC 5.0) and click "Check Eligibility". Verify the results card smoothly springs into view (`scale: 0.98 -> 1`, `opacity: 0 -> 1`).
   - `DeadlinesSection`, `AiAdvisorPreviewSection`, `GuidesSection`, `FaqSection`, `PreparationCtaSection`, `FooterSection`: Each section triggers only once on entry without repetitive replay or layout jitter.

### Scenario 3: Accessibility & Reduced Motion Validation
1. Open Chrome DevTools (`F12`).
2. Press `Ctrl + Shift + P`, type `Rendering`, and select "Show Rendering".
3. Under **Emulate CSS media feature prefers-reduced-motion**, select `prefers-reduced-motion: reduce`.
4. Refresh the page:
   - All elements must be 100% visible immediately without any transition or movement.
   - The readiness gauge must display `80%` and the study time must display `13.6h` immediately with zero count-up.
   - Scrolling down must not trigger any animations or layout shifts.

### Scenario 4: Mobile Viewport & Hardware Acceleration
1. In Chrome DevTools, toggle Device Toolbar (`Ctrl + Shift + M`).
2. Select **iPhone 12/14 Pro** or **Pixel 7** (viewport ~390px wide).
3. In Performance tab, throttle CPU to **4x slowdown**.
4. Scroll down through the page.
5. Verify that translation distances are reduced to ~12px and scrolling maintains a solid 60fps without hitching.

### Scenario 5: Regression & SEO Verification
Run the automated SEO suite and production build:

```bash
# Run existing 54 Playwright SEO audit tests
pnpm --filter eduguide-frontend test:seo

# Verify Next.js production build succeeds with 0 TypeScript/ESLint errors
pnpm --filter eduguide-frontend build
```
