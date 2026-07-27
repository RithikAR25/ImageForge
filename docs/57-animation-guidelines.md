# Animation Guidelines

> **Document ID**: 57
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the animation guidelines for ImageForge — the motion design language that makes the interface feel alive, responsive, and premium.

---

## Motion Principles

1. **Purposeful**: Every animation communicates something (feedback, transition, loading, completion)
2. **Fast**: UI animations are < 200ms — the app must feel instant
3. **Reduced-motion aware**: All animations respect `prefers-reduced-motion`
4. **Consistent**: Same animation type always uses the same duration/easing
5. **Non-blocking**: Animations never prevent user interaction

---

## Animation Categories

### 1. Micro-interactions (< 100ms)

Fast, subtle feedback for immediate actions:

```typescript
// Button press — scale feedback
const buttonScale = useSharedValue(1);

const pressIn = () => {
  buttonScale.value = withTiming(0.96, { duration: 80 });
};
const pressOut = () => {
  buttonScale.value = withSpring(1, { damping: 20, stiffness: 400 });
};
```

| Interaction          | Duration | Easing    |
| -------------------- | -------- | --------- |
| Button press         | 80ms     | easeOut   |
| Tab switch highlight | 100ms    | easeOut   |
| Toggle on/off        | 150ms    | spring    |
| Checkbox check       | 120ms    | easeInOut |

### 2. State Transitions (150–350ms)

Feedback for state changes:

```typescript
// Processing spinner — continuous rotation
const spin = useSharedValue(0);
useEffect(() => {
  spin.value = withRepeat(
    withTiming(360, { duration: 1000, easing: Easing.linear }),
    -1, // infinite
    false,
  );
}, []);
```

| State                  | Duration   | Easing | Notes               |
| ---------------------- | ---------- | ------ | ------------------- |
| Success checkmark draw | 300ms      | spring | SVG path animation  |
| Error shake            | 400ms      | custom | 3-shake pattern     |
| Progress bar fill      | Continuous | linear | Real progress       |
| Loading spinner        | ∞          | linear | 1000ms per rotation |

### 3. Layout Transitions (200–350ms)

Screen and panel transitions:

```typescript
// Panel slide in from right
const translateX = useSharedValue(300);
useEffect(() => {
  translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
}, []);
```

| Transition            | Duration | Easing    |
| --------------------- | -------- | --------- |
| Screen push (mobile)  | 350ms    | iOS curve |
| Modal appear          | 300ms    | spring    |
| Panel expand/collapse | 250ms    | easeInOut |
| Toast slide in        | 200ms    | spring    |
| Dropdown open         | 150ms    | easeOut   |
| Tab panel switch      | 200ms    | easeInOut |

### 4. Data/Content Animations

```typescript
// Thumbnail fade in as they load
const opacity = useSharedValue(0);
const scale = useSharedValue(0.95);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 200 });
  scale.value = withSpring(1, { damping: 20 });
}, []);
```

| Content                 | Duration      | Notes                 |
| ----------------------- | ------------- | --------------------- |
| Image thumbnail load    | 200ms fade-in | Staggered in gallery  |
| Before/after transition | 300ms         | Crossfade on slider   |
| Queue item complete     | 250ms         | Green checkmark pulse |
| Size reduction number   | 500ms         | Counting animation    |

---

## Reduced Motion

```typescript
// All animations must check this
const { duration } = useMotionPreference();

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isVisible ? 1 : 0, { duration }),
}));

// useMotionPreference implementation
function useMotionPreference() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return {
    duration: reducedMotion ? 0 : animation.duration.normal,
    isReduced: reducedMotion,
  };
}
```

When `prefers-reduced-motion: reduce`:

- All `duration` values set to `0`
- No bouncing or spring animations
- Progress bars still show (no animation though)
- Loading states use opacity blink instead of rotation

---

## Reanimated vs Animated

| Case                         | Use                     | Why                         |
| ---------------------------- | ----------------------- | --------------------------- |
| Gesture-driven (drag, pinch) | Reanimated worklet      | Runs on UI thread — no lag  |
| Layout transitions           | Reanimated              | Same                        |
| Simple opacity/scale         | Reanimated              | Consistent API              |
| ScrollView animations        | React Native `Animated` | Platform scroll integration |

**Never** use `React.useState` for animation values — causes JS thread animation jank.

---

## Related Documents

| Document                                                   | Relationship                 |
| ---------------------------------------------------------- | ---------------------------- |
| [50-design-system.md](./50-design-system.md)               | Animation tokens             |
| [56-accessibility.md](./56-accessibility.md)               | Reduced motion accessibility |
| [36-performance-strategy.md](./36-performance-strategy.md) | Animation performance        |

---

_Document Owner: Design Team | Approved: 2026-07-27_
