# Data Model & Motion Tokens: GSAP Motion System

**Feature**: `002-gsap-motion-system`  
**Date**: 2026-09-05  

This document defines the structured motion tokens, animation options, and runtime configuration models used across the EduGuide GSAP motion system.

---

## 1. Motion Tokens

### 1.1 Easing Curves
Standardized GSAP easing equations ensuring consistent visual rhythm:

```typescript
export const MOTION_EASING = {
  // Entrance reveals: Starts with velocity, glides into a soft resting stop
  entrance: "power2.out", // cubic-bezier(0.25, 1, 0.5, 1)
  
  // High-precision punchy transitions (modals, results cards)
  punchy: "power3.out",
  
  // Ambient float / breathing loops: Continuous smooth oscillation
  ambient: "sine.inOut",
  
  // Interactive hover states
  hover: "power1.out",
} as const;
```

### 1.2 Duration Tokens
```typescript
export const MOTION_DURATION = {
  micro: 0.2,       // Button hovers, badge pulse
  fast: 0.35,       // Quick UI responses, icon state changes
  standard: 0.65,   // Section container reveals, card entries
  deliberate: 0.9,  // Hero headline choreography, count-up tweens
  ambient: 6.0,     // Continuous floating background glow
} as const;
```

### 1.3 Translation & Offset Tokens
```typescript
export const MOTION_DISTANCE = {
  hoverLift: -4,    // Card hover translateY in pixels
  subtleY: 14,      // Mobile reveal distance
  standardY: 22,    // Desktop reveal distance
  floatY: 8,        // Background ambient floating range (±8px)
} as const;
```

---

## 2. Configuration Interfaces

### 2.1 `ScrollTriggerOptions`
Defines parameters for scroll-activated element reveals:

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `trigger` | `Element \| string` | Component root | The DOM element or selector that triggers the animation |
| `start` | `string` | `"top 85%"` | Viewport scroll position where animation starts |
| `once` | `boolean` | `true` | Whether the trigger should only fire once (prevents repetitive flashing) |
| `toggleActions`| `string` | `"play none none none"` | GSAP trigger actions for entry/leave |
| `markers` | `boolean` | `false` | Debug visual indicators (strictly disabled in production) |

### 2.2 `StaggerRevealConfig`
Defines parameters for staggered child reveals (e.g. university cards, timeline nodes):

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selector` | `string` | `"> *"` | CSS selector for target child elements |
| `stagger` | `number` | `0.08` | Delay in seconds between each child's entrance |
| `duration` | `number` | `0.6` | Animation duration per element |
| `distance` | `number` | `20` | Y-axis translation starting offset (px) |
| `ease` | `string` | `"power2.out"`| GSAP easing curve |

### 2.3 `CountUpConfig`
Defines numerical counter tween parameters:

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `start` | `number` | `0` | Starting value |
| `end` | `number` | Required | Target ending value |
| `duration` | `number` | `1.4` | Duration in seconds |
| `decimals` | `number` | `0` | Number of decimal places (e.g., 1 for `13.6`) |
| `suffix` | `string` | `""` | Appended string (e.g. `"%"` or `"h"`) |

---

## 3. Responsive Breakpoint Adaptation Model

```typescript
export interface ResponsiveMotionVariants {
  desktop: {
    yDistance: number;    // 22px
    duration: number;     // 0.65s
    stagger: number;      // 0.08s
    ambientFloat: number; // 8px
  };
  mobile: {
    yDistance: number;    // 12px
    duration: number;     // 0.45s
    stagger: number;      // 0.04s
    ambientFloat: number; // 4px
  };
}
```

---

## 4. Animation Registry State

Tracks the registration and disposal lifecycle across page sessions:

```typescript
export interface MotionRegistryState {
  isReducedMotion: boolean;      // True if user OS requests reduced motion
  activeTimelines: gsap.core.Timeline[]; // Active GSAP timelines for disposal
  activeTriggers: ScrollTrigger[];      // Active ScrollTrigger instances
}
```
