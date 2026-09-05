/**
 * Motion Tokens for EduGuide
 * Centralized easing curves, durations, distances, and responsive variants.
 */

export const MOTION_EASE = {
  // Entrance reveals: Starts fast, gently glides to a resting stop
  entrance: 'power2.out',
  smooth: 'power3.out',
  expressive: 'power4.out',
  subtle: 'power1.out',
  springLike: 'back.out(1.2)',
  ambient: 'sine.inOut',
} as const;

export const MOTION_DURATION = {
  micro: 0.2,       // Micro-interactions (hover, focus, badge pulse)
  fast: 0.35,       // Quick UI responses (tabs, row staggers)
  standard: 0.6,    // Section container reveals, card entries
  deliberate: 0.9,  // Hero headlines, metric counter tweens
  ambient: 6.0,     // Continuous background glow float loops
} as const;

export const MOTION_DISTANCE = {
  hoverLift: -4,    // Card hover translateY in pixels
  subtleY: 12,      // Mobile reveal distance
  standardY: 20,    // Desktop reveal distance
  floatY: 8,        // Background ambient floating range (+/- 8px)
} as const;

export const MOTION_BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;
