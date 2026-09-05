# Motion System API & Component Contracts

**Feature**: `002-gsap-motion-system`  
**Date**: 2026-09-05  

This document formalizes the interface contracts for the GSAP Motion utility modules, React custom hooks, and their consuming components.

---

## 1. Core Motion Utility Contract (`frontend/lib/animations/gsap-motion.ts`)

```typescript
export interface GsapMotionApi {
  /**
   * Initializes and safely registers GSAP plugins (ScrollTrigger) in client-side environment.
   */
  initGsap(): boolean;

  /**
   * Returns true if user has enabled prefers-reduced-motion in OS settings.
   */
  isReducedMotion(): boolean;

  /**
   * Animates an element with a smooth upward fade-in.
   */
  fadeUp(
    target: gsap.DOMTarget,
    options?: {
      y?: number;
      duration?: number;
      delay?: number;
      scrollTrigger?: boolean | object;
    }
  ): gsap.core.Tween | null;

  /**
   * Staggers entrance of child elements matching selector.
   */
  staggerReveal(
    targets: gsap.DOMTarget,
    options?: {
      stagger?: number;
      y?: number;
      duration?: number;
      delay?: number;
      scrollTrigger?: boolean | object;
    }
  ): gsap.core.Tween | null;

  /**
   * Animates numerical count-up on an HTML element.
   */
  countUp(
    target: HTMLElement,
    endValue: number,
    options?: {
      duration?: number;
      decimals?: number;
      suffix?: string;
      scrollTrigger?: boolean | object;
    }
  ): gsap.core.Tween | null;

  /**
   * Creates a gentle, continuous sinusoidal floating loop.
   */
  subtleFloat(
    target: gsap.DOMTarget,
    options?: {
      y?: number;
      duration?: number;
      delay?: number;
    }
  ): gsap.core.Tween | null;

  /**
   * Choreographs the homepage hero entrance sequence.
   */
  heroEntrance(
    refs: {
      eyebrow: HTMLElement | null;
      title: HTMLElement | null;
      description: HTMLElement | null;
      actions: HTMLElement | null;
      badges?: HTMLElement | null;
      previewFrame?: HTMLElement | null;
    }
  ): gsap.core.Timeline | null;
}
```

---

## 2. React Hook Contract (`frontend/hooks/use-gsap-motion.ts`)

```typescript
export interface UseGsapMotionHook {
  /**
   * Wraps GSAP animations inside a React ref scope with automatic ctx.revert() on unmount.
   */
  useGsapContext(
    scopeRef: React.RefObject<HTMLElement | null>,
    effectFn: (context: gsap.Context) => void,
    deps?: React.DependencyList
  ): void;

  /**
   * Hook that automatically binds a scroll-triggered reveal to a container ref.
   */
  useScrollReveal(
    ref: React.RefObject<HTMLElement | null>,
    options?: {
      staggerChildren?: string; // selector for child stagger
      y?: number;
      duration?: number;
      start?: string;
    }
  ): void;
}
```

---

## 3. Section Integration Contracts

| Component | Target Elements | Motion Behavior | Fallback on Reduced Motion |
| :--- | :--- | :--- | :--- |
| **`Navbar`** | Header pill container | Initial fade-down `y: -10 -> 0`, subtle border/backdrop shift on scroll | Static fixed header, 100% visible |
| **`HeroSection`** | Eyebrow, Title, Subtitle, CTAs, Preview cards, Glow | Staggered sequence (0.15s gap), gauge count-up (0% to 80%), hours count-up (0 to 13.6h), ambient radial float | Static layout with final numbers displayed instantly |
| **`DashboardPreviewFrame`** | Outer wrapper | Scale `0.96 -> 1`, fade `0 -> 1` on scroll trigger | Normal scale and opacity |
| **`AdmissionAtGlance`** | Section container, top 4 table rows | Container fade-up, first 4 rows stagger (0.05s) | Full table visible immediately |
| **`FeaturedUniversitiesSection`**| 6 University cards | Staggered fade-up (0.08s gap), card hover `y: -4px` | Instant grid layout, standard CSS hover |
| **`EligibilityCheckerSection`** | Form container & Results display | Form container fade-up; dynamic results spring-in `scale: 0.98 -> 1` | Immediate results rendering |
| **`AiAdvisorPreviewSection`** | Chat preview mock & suggestion pills | Staggered question pill entrance, subtle floating AI avatar | Instant static display |
| **`DeadlinesSection`** | Timeline item cards | Staggered card fade-in connected to timeline rail | Immediate cards display |
| **`GuidesSection`** | Guide article cards | Grid stagger reveal | Immediate grid display |
| **`FaqSection`** | Accordion items | Staggered fade-in on scroll entrance | Immediate accordion display |
| **`PreparationCtaSection`** | Banner container, CTAs | Upward reveal with subtle warm radial pulse | Immediate banner display |
| **`FooterSection`** | Column links and copyright | Subtle fade-up as footer reaches viewport | Immediate footer display |
