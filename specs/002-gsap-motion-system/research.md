# Research: GSAP Motion & Interaction System

**Feature**: `002-gsap-motion-system`  
**Date**: 2026-09-05  
**Author**: EduGuide Frontend & Motion Engineering

---

## 1. GSAP Context & React 19 / Next.js Lifecycle Management

### Problem
In React 19 and Next.js App Router client components, React's StrictMode mounts, unmounts, and remounts components during development. Without comprehensive lifecycle scoping and garbage collection, GSAP tweens and ScrollTrigger listeners duplicate, accumulate, cause memory leaks, and create visual flickering.

### Decision
Utilize `gsap.context()` encapsulated in a reusable custom hook `useGsapContext(targetRef, setupFn, deps)` or `useEffect` hooks. On component unmount, `ctx.revert()` is called unconditionally.

### Rationale
- `gsap.context()` wraps all selectors and ScrollTriggers created within its execution scope.
- Calling `ctx.revert()` immediately kills all child timelines, removes inline styles set during tweening, and cleans up ScrollTrigger event listeners.
- Guarantees 100% safety in Next.js client-side navigation without orphaned listeners.

### Alternatives Considered
- *Direct `useEffect` with manual `tween.kill()`*: Error-prone; ScrollTrigger listeners easily leak if not individually tracked.
- *`@gsap/react` package (`useGSAP`)*: Adds an unnecessary dependency; `gsap.context()` is native to GSAP 3.12+ and provides identical functionality with zero external dependencies.

---

## 2. ScrollTrigger Viewport Strategy vs. Native Scrolling

### Problem
Animations triggered on scroll must feel organic and punctual. Scroll-hijacking libraries (e.g. ScrollSmoother or custom wheel interceptors) break browser gestures, interfere with trackpads, degrade accessibility, and increase bundle size. Furthermore, animations triggering repeatedly on every scroll down and up distract users who are trying to read circular deadlines and fee structures.

### Decision
1. **Preserve Native Scroll Physics**: Keep CSS `html { scroll-behavior: smooth; }` intact. Strictly prohibit ScrollSmoother or wheel hijacking.
2. **One-Time Subtle Reveals**: Configure ScrollTriggers with `once: true`, triggering when an element enters `top 85%` of the viewport.
3. **Hardware Acceleration**: Animate only composited properties (`transform: translateY / scale` and `opacity`). Apply `will-change: transform, opacity` dynamically during active tweens and remove it when the animation completes.

### Rationale
- Information-first platforms like EduGuide serve students seeking fast, reliable answers. Animations must enhance reading flow, not create obstacles.
- `once: true` ensures animations fire smoothly on initial arrival without distracting repetitive re-animations during back-and-forth comparison.

### Alternatives Considered
- *Continuous scrub/parallax*: Distracting for tabular admission circulars and application forms.
- *IntersectionObserver alone*: Lacks GSAP's precision easing, stagger choreographies, and hardware synchronization.

---

## 3. Accessibility & `prefers-reduced-motion` Strategy

### Problem
Vestibular disorders, motion sensitivity, and slow internet connections require an instant, motion-free experience. Violating reduced-motion preferences violates WCAG 2.1 Level AA compliance.

### Decision
Implement a centralized `isReducedMotion()` check backed by `window.matchMedia('(prefers-reduced-motion: reduce)')`. 
- When reduced motion is preferred:
  - Bypasses timelines and ScrollTriggers entirely.
  - Instantly snaps target elements to their completed visual state (`opacity: 1`, `transform: none`).
  - Renders final numerical values (e.g. "80%", "13.6h") immediately with zero count-up duration.

### Rationale
- Ensures equitable access and prevents nausea/disorientation for users with vestibular needs.
- Zero layout delay or content hiding.

### Alternatives Considered
- *CSS-only `@media (prefers-reduced-motion)` overrides*: Can leave GSAP JavaScript tweens running in the background competing with CSS overrides, leading to unexpected layout flashes. Handling reduced motion directly within the GSAP logic ensures clean, immediate termination.

---

## 4. Mobile Viewport Optimization via `gsap.matchMedia()`

### Problem
Mobile devices have smaller screens, touch-driven scrolling, and varied hardware capabilities (from budget Android phones to high-end tablets). Long translation distances (`y: 40px`) look exaggerated on small screens and can cause viewport overflow.

### Decision
Utilize `gsap.matchMedia()` with responsive breakpoints:
- **Desktop (`min-width: 768px`)**: Standard subtle translation (`y: 20px`), standard staggers (0.08s–0.1s), full ambient floating glow (`y: ±8px`).
- **Mobile (`max-width: 767px`)**: Compact translation (`y: 10px–14px`), tighter staggers (0.04s), simplified ambient glow (`y: ±4px`), shorter durations (0.4s–0.6s).

### Rationale
- Prevents UI components from entering view off-center.
- Keeps 60fps framerate rock-solid on resource-constrained mobile chipsets common in Bangladesh.

---

## 5. SEO Preservation & Crawler Friendliness

### Problem
Search engine crawlers (Googlebot, Bingbot) and social media scrapers render the DOM. If content is initialized with `opacity: 0` or `display: none` via client-side JavaScript that fails or delays, search bots may index the page as blank or thin content.

### Decision
1. In SSR markup, all components render naturally with full visibility (`opacity: 1`, natural positioning).
2. GSAP tweens apply `fromTo()` or `from()` only *after* client-side component hydration.
3. Crucial heading text, circular dates, university names, and SEO schema remain standard HTML elements with zero text chopping or split-text disruptions.

### Rationale
- 100% preservation of all 54 Playwright SEO audit tests and Googlebot crawlability.
- If JavaScript fails or is disabled, the website remains 100% functional and readable.
