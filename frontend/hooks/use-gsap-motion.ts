'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE } from '@/lib/animations/gsap-motion';

// Use useLayoutEffect in the browser, fallback to useEffect during SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Custom hook to execute GSAP animations within a safe React lifecycle context.
 * Automatically cleans up all timelines, tweens, and ScrollTriggers on unmount via ctx.revert().
 */
export function useGsapContext(
  effect: (context: gsap.Context) => void,
  scopeRef?: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context((self) => {
      effect(self);
    }, scopeRef?.current || undefined);

    return () => {
      ctx.revert();
    };
  }, deps);
}

/**
 * Hook to automatically reveal a container and optionally its children when scrolling into view.
 */
export function useScrollTriggerReveal(
  targetRef: React.RefObject<HTMLElement | null>,
  options?: {
    staggerChildren?: string;
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
    delay?: number;
  },
  deps: React.DependencyList = []
) {
  useGsapContext(
    () => {
      const el = targetRef.current;
      if (!el || typeof window === 'undefined') return;

      if (isReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        if (options?.staggerChildren) {
          const children = el.querySelectorAll(options.staggerChildren);
          gsap.set(children, { opacity: 1, y: 0 });
        }
        return;
      }

      const {
        staggerChildren,
        y = MOTION_DISTANCE.standardY,
        duration = MOTION_DURATION.standard,
        stagger = 0.08,
        start = 'top 85%',
        delay = 0,
      } = options || {};

      if (staggerChildren) {
        const children = el.querySelectorAll(staggerChildren);
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              delay,
              ease: MOTION_EASE.smooth,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                toggleActions: 'play none none none',
              },
            }
          );
          return;
        }
      }

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: MOTION_EASE.smooth,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    targetRef,
    deps
  );
}
