import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MOTION_EASE,
  MOTION_DURATION,
  MOTION_DISTANCE,
  MOTION_BREAKPOINTS,
} from './motion-tokens';

export { MOTION_EASE, MOTION_DURATION, MOTION_DISTANCE, MOTION_BREAKPOINTS };

// Safely register ScrollTrigger once on the client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks whether the user has enabled prefers-reduced-motion in OS/browser settings.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOTION_BREAKPOINTS.reducedMotion).matches;
}

/**
 * Helper to register responsive animations using gsap.matchMedia()
 */
export function createMatchMedia(): gsap.MatchMedia | null {
  if (typeof window === 'undefined') return null;
  return gsap.matchMedia();
}

/**
 * Global Fade Up reveal with ScrollTrigger
 */
export function fadeUp(
  target: gsap.DOMTarget,
  options?: {
    y?: number;
    duration?: number;
    delay?: number;
    scrollTrigger?: boolean | ScrollTrigger.Vars;
    onComplete?: () => void;
  }
) {
  if (typeof window === 'undefined') return;
  if (isReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return;
  }

  const {
    y = MOTION_DISTANCE.standardY,
    duration = MOTION_DURATION.standard,
    delay = 0,
    scrollTrigger = true,
    onComplete,
  } = options || {};

  const vars: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration,
    delay,
    ease: MOTION_EASE.smooth,
    onComplete,
  };

  if (scrollTrigger) {
    vars.scrollTrigger =
      typeof scrollTrigger === 'object'
        ? scrollTrigger
        : {
            trigger: target as any,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          };
  }

  return gsap.fromTo(target, { opacity: 0, y }, vars);
}

/**
 * Staggered Card/List Reveal with ScrollTrigger
 */
export function staggerReveal(
  targets: gsap.DOMTarget,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    delay?: number;
    trigger?: gsap.DOMTarget;
    onComplete?: () => void;
  }
) {
  if (typeof window === 'undefined') return;
  if (isReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  const {
    y = MOTION_DISTANCE.standardY,
    stagger = 0.08,
    duration = MOTION_DURATION.standard,
    delay = 0,
    trigger,
    onComplete,
  } = options || {};

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: MOTION_EASE.smooth,
      scrollTrigger: {
        trigger: (trigger || targets) as any,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
      onComplete,
    }
  );
}

/**
 * Table Container & First Visible Rows Reveal
 * Information-first: only animates container and top 4 rows.
 */
export function tableReveal(
  container: HTMLElement | null,
  rowElements: (HTMLElement | null)[],
  options?: { onComplete?: () => void }
) {
  if (typeof window === 'undefined' || !container) return;
  if (isReducedMotion()) {
    gsap.set(container, { opacity: 1, y: 0 });
    gsap.set(rowElements.filter(Boolean), { opacity: 1, y: 0 });
    return;
  }

  const validRows = rowElements.filter(Boolean).slice(0, 4);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      once: true,
    },
    onComplete: options?.onComplete,
  });

  tl.fromTo(
    container,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: MOTION_EASE.smooth }
  );

  if (validRows.length > 0) {
    tl.fromTo(
      validRows,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: MOTION_EASE.subtle },
      '-=0.25'
    );
  }

  return tl;
}

/**
 * Smooth Count-Up Animation for Numerical Stats
 */
export function countUp(
  targetElement: HTMLElement | null,
  endValue: number,
  options?: {
    suffix?: string;
    prefix?: string;
    decimals?: number;
    duration?: number;
    trigger?: HTMLElement | null;
  }
) {
  if (typeof window === 'undefined' || !targetElement) return;

  const { suffix = '', prefix = '', decimals = 0, duration = 1.2, trigger } = options || {};

  if (isReducedMotion()) {
    targetElement.innerText = `${prefix}${endValue.toFixed(decimals)}${suffix}`;
    return;
  }

  const state = { value: 0 };

  return gsap.to(state, {
    value: endValue,
    duration,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: trigger || targetElement,
      start: 'top 90%',
      once: true,
    },
    onUpdate: () => {
      targetElement.innerText = `${prefix}${state.value.toFixed(decimals)}${suffix}`;
    },
    onComplete: () => {
      targetElement.innerText = `${prefix}${endValue.toFixed(decimals)}${suffix}`;
    },
  });
}

/**
 * Subtle Ambient Floating Loop for Icons / Badges / Glow
 */
export function subtleFloat(
  target: gsap.DOMTarget,
  options?: { y?: number; duration?: number; delay?: number }
): gsap.core.Tween | null {
  if (typeof window === 'undefined' || isReducedMotion()) return null;

  const { y = MOTION_DISTANCE.floatY, duration = MOTION_DURATION.ambient, delay = 0 } =
    options || {};

  return gsap.to(target, {
    y: `-=${y}`,
    duration,
    delay,
    ease: MOTION_EASE.ambient,
    repeat: -1,
    yoyo: true,
  });
}

/**
 * Coordinated Hero Entrance Timeline
 */
export function heroEntrance(elements: {
  badge?: HTMLElement | null;
  heading?: HTMLElement | null;
  subheading?: HTMLElement | null;
  cta?: HTMLElement | null;
  socialProof?: HTMLElement | null;
  tiltedCardLeft?: HTMLElement | null;
  tiltedCardRight?: HTMLElement | null;
}): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { ease: MOTION_EASE.smooth },
  });

  if (isReducedMotion()) {
    Object.values(elements).forEach((el) => {
      if (el) gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
    return tl;
  }

  // 1. Eyebrow badge
  if (elements.badge) {
    tl.fromTo(
      elements.badge,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.45 }
    );
  }

  // 2. Heading
  if (elements.heading) {
    tl.fromTo(
      elements.heading,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55 },
      '-=0.25'
    );
  }

  // 3. Subheading
  if (elements.subheading) {
    tl.fromTo(
      elements.subheading,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45 },
      '-=0.3'
    );
  }

  // 4. Primary CTA
  if (elements.cta) {
    tl.fromTo(
      elements.cta,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45 },
      '-=0.25'
    );
  }

  // 5. Social proof reviews row
  if (elements.socialProof) {
    tl.fromTo(
      elements.socialProof,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
    );
  }

  // 6. Floating tilted cards
  if (elements.tiltedCardLeft) {
    tl.fromTo(
      elements.tiltedCardLeft,
      { opacity: 0, y: 20, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: MOTION_EASE.springLike },
      '-=0.35'
    );
  }

  if (elements.tiltedCardRight) {
    tl.fromTo(
      elements.tiltedCardRight,
      { opacity: 0, y: 20, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: MOTION_EASE.springLike },
      '-=0.45'
    );
  }

  return tl;
}
