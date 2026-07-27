# Responsive Design

> **Document ID**: 55
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the responsive design system for ImageForge — breakpoints, layout adaptation strategies, and component behavior across screen sizes.

---

## Breakpoints

```typescript
// packages/ui/src/tokens/breakpoints.ts

const breakpoints = {
  xs: 0, // Mobile portrait (default)
  sm: 480, // Mobile landscape / small tablet
  md: 768, // Tablet portrait
  lg: 1024, // Tablet landscape / small desktop
  xl: 1280, // Desktop
  '2xl': 1536, // Wide desktop
} as const;
```

---

## Layout Patterns by Breakpoint

### Mobile (xs–sm): Single-Column Stack

```
┌─────────────────┐
│     Header      │
├─────────────────┤
│  Image Preview  │
├─────────────────┤
│   Controls      │
│   (collapsible) │
├─────────────────┤
│  [Export Btn]   │
└─────────────────┘
```

### Tablet (md): Two-Column

```
┌──────────────────────────┐
│          Header          │
├────────────┬─────────────┤
│   Image    │  Controls   │
│  Preview   │  (fixed)    │
│            │             │
├────────────┴─────────────┤
│      [Export Button]     │
└──────────────────────────┘
```

### Desktop (lg+): Sidebar + Content

```
┌──────┬────────────────────────────────┐
│      │           Header               │
│Sidebar├──────────────────┬────────────┤
│      │   Image Preview  │ Controls   │
│  Nav │   (large)        │ Panel      │
│      │                  │            │
│      ├──────────────────┴────────────┤
│      │    History / Metadata Panel   │
└──────┴────────────────────────────────┘
```

---

## Responsive Hooks

```typescript
// packages/hooks/src/useBreakpoint.ts

function useBreakpoint() {
  const windowWidth = useWindowDimensions().width;

  return {
    isXs: windowWidth < 480,
    isSm: windowWidth >= 480 && windowWidth < 768,
    isMd: windowWidth >= 768 && windowWidth < 1024,
    isLg: windowWidth >= 1024 && windowWidth < 1280,
    isXl: windowWidth >= 1280,
    isMobile: windowWidth < 768,
    isTablet: windowWidth >= 768 && windowWidth < 1024,
    isDesktop: windowWidth >= 1024,
  };
}
```

---

## Component Responsive Behavior

| Component           | Mobile            | Tablet        | Desktop       |
| ------------------- | ----------------- | ------------- | ------------- |
| Navigation          | Bottom tabs       | Side rail     | Full sidebar  |
| Image preview       | Full width        | 60% split     | 65% split     |
| Controls panel      | Sheet (slides up) | Fixed right   | Fixed right   |
| Queue list          | Full screen       | Side panel    | Side panel    |
| Export modal        | Bottom sheet      | Modal dialog  | Modal dialog  |
| Tool menu           | Horizontal scroll | Vertical list | Vertical list |
| Before/After slider | Full width        | 60%           | 65%           |

---

## Image Preview Scaling

```typescript
// Calculate maximum preview dimensions
function getPreviewSize(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
): { width: number; height: number } {
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  if (imageAspect > containerAspect) {
    return {
      width: containerWidth,
      height: containerWidth / imageAspect,
    };
  } else {
    return {
      height: containerHeight,
      width: containerHeight * imageAspect,
    };
  }
}
```

---

## Touch Targets

All interactive elements meet minimum touch target sizes:

- **Mobile**: 44×44pt minimum (Apple HIG / WCAG)
- **Desktop**: 32×32px minimum

```typescript
const minTouchTarget = Platform.select({
  ios: 44,
  android: 48,
  default: 32, // Web
});
```

---

## Keyboard Shortcuts (Desktop Only)

Keyboard shortcuts are only shown when screen width ≥ 1024px:

```typescript
const { isDesktop } = useBreakpoint();

// Only render keyboard hint on desktop
{isDesktop && (
  <KeyboardHint shortcut="Ctrl+Z" label="Undo" />
)}
```

---

## Related Documents

| Document                                     | Relationship              |
| -------------------------------------------- | ------------------------- |
| [50-design-system.md](./50-design-system.md) | Design tokens             |
| [52-navigation.md](./52-navigation.md)       | Responsive navigation     |
| [56-accessibility.md](./56-accessibility.md) | Touch target requirements |

---

_Document Owner: Design Team | Approved: 2026-07-27_
