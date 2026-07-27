# Design System

> **Document ID**: 50
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the ImageForge design system — the design language, tokens, typography, color palette, spacing system, and component conventions that create a consistent, premium user experience across Web, Android, and iOS.

---

## Design Philosophy

ImageForge is a **professional tool** that must also feel approachable. The design language balances:

- **Power**: The capability of a desktop application
- **Clarity**: The intuitiveness of a consumer app
- **Premium quality**: An aesthetic that commands trust

Inspirations: Figma, Linear, Vercel Dashboard, Arc Browser.

---

## Color Palette

### Semantic Color Tokens

All colors are defined as semantic tokens — components never use raw hex values.

```typescript
// packages/ui/src/tokens/colors.ts

const lightColors = {
  // Surfaces
  background: {
    default: '#FFFFFF',
    subtle: '#F8F9FA',
    muted: '#F1F3F5',
    emphasis: '#E9ECEF',
  },
  // Text
  text: {
    primary: '#0D0D0F',
    secondary: '#4A4A5A',
    tertiary: '#8C8CA1',
    inverse: '#FFFFFF',
    accent: '#6C63FF',
  },
  // Brand
  brand: {
    primary: '#6C63FF', // ImageForge violet
    primaryHover: '#5B53EE',
    primaryActive: '#4A43DD',
    secondary: '#FF6584', // Coral accent
    tertiary: '#43E7D8', // Teal accent
  },
  // Feedback
  status: {
    success: '#22C55E',
    successSubtle: '#DCFCE7',
    warning: '#F59E0B',
    warningSubtle: '#FEF3C7',
    error: '#EF4444',
    errorSubtle: '#FEE2E2',
    info: '#3B82F6',
    infoSubtle: '#DBEAFE',
  },
  // Borders
  border: {
    default: '#E2E8F0',
    strong: '#CBD5E1',
    focus: '#6C63FF',
  },
};

const darkColors = {
  background: {
    default: '#0A0A0F', // Near-black with blue undertone
    subtle: '#12121A',
    muted: '#1A1A26',
    emphasis: '#22222F',
  },
  text: {
    primary: '#F2F2F7',
    secondary: '#A0A0B8',
    tertiary: '#6B6B84',
    inverse: '#0A0A0F',
    accent: '#8B85FF', // Lighter violet for dark mode
  },
  brand: {
    primary: '#8B85FF',
    primaryHover: '#9D98FF',
    primaryActive: '#7B75EE',
    secondary: '#FF8099',
    tertiary: '#5DE9D9',
  },
  status: {
    success: '#34D399',
    successSubtle: '#064E3B',
    warning: '#FBBF24',
    warningSubtle: '#451A03',
    error: '#F87171',
    errorSubtle: '#450A0A',
    info: '#60A5FA',
    infoSubtle: '#0C2566',
  },
  border: {
    default: '#2A2A3A',
    strong: '#3A3A4C',
    focus: '#8B85FF',
  },
};
```

### Brand Identity

```
Primary Brand Color: #6C63FF (Vibrant Violet)
  — Psychological association: creativity, intelligence, precision
  — Accessible: 4.6:1 contrast on white (WCAG AA)

Secondary: #FF6584 (Coral)
  — Used for destructive actions, badges, highlights

Tertiary: #43E7D8 (Teal)
  — Used for success states, processing indicators
```

---

## Typography

### Font Stack

```css
/* Primary: Inter — clean, professional, highly legible */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  sans-serif;

/* Monospace: JetBrains Mono — code and technical values */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

```typescript
const typography = {
  display: {
    xl: { fontSize: 48, lineHeight: 56, fontWeight: '700' }, // Hero text
    lg: { fontSize: 36, lineHeight: 44, fontWeight: '700' }, // Page title
  },
  heading: {
    h1: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
    h2: { fontSize: 22, lineHeight: 30, fontWeight: '600' },
    h3: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
    h4: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  },
  body: {
    lg: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    md: { fontSize: 14, lineHeight: 22, fontWeight: '400' },
    sm: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  },
  label: {
    lg: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    md: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    sm: { fontSize: 11, lineHeight: 14, fontWeight: '500' },
  },
  code: {
    md: { fontSize: 13, lineHeight: 20, fontFamily: 'JetBrains Mono' },
  },
};
```

---

## Spacing System

8-point grid system:

```typescript
const spacing = {
  px: 1,
  0.5: 4,
  1: 8,
  1.5: 12,
  2: 16,
  2.5: 20,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  8: 64,
  10: 80,
  12: 96,
  16: 128,
};
```

---

## Border Radius

```typescript
const radii = {
  none: 0,
  sm: 4,
  md: 8, // Standard (cards, inputs)
  lg: 12, // Large cards
  xl: 16, // Panels
  '2xl': 24, // Modals
  full: 9999, // Pills, circular avatars
};
```

---

## Shadows

```typescript
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C63FF', // Brand-colored glow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
};
```

---

## Animation Tokens

```typescript
const animation = {
  duration: {
    instant: 0,
    fast: 100, // Micro-interactions (hover, focus)
    normal: 200, // Standard transitions
    slow: 350, // Modals, panels
    slower: 500, // Page transitions
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1], // Exiting elements
    easeIn: [0.4, 0.0, 1.0, 1.0], // Entering elements
    easeInOut: [0.4, 0.0, 0.2, 1.0], // Repositioning
    spring: { damping: 20, stiffness: 300 },
  },
};
```

---

## Dark Mode Strategy

The design system uses a unified token system that maps to different values in light/dark mode:

```typescript
// packages/ui/src/theme/ThemeProvider.tsx

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [userPreference] = useSettingsStore(s => s.theme);

  const theme = useMemo(() => {
    const scheme = userPreference === 'system'
      ? systemColorScheme
      : userPreference;
    return scheme === 'dark' ? darkTheme : lightTheme;
  }, [systemColorScheme, userPreference]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## Motion Design Principles

1. **Purpose over decoration**: Every animation communicates something (loading, success, hierarchy)
2. **Reduced motion respect**: All animations check `prefers-reduced-motion`
3. **Fast transitions**: UI feels instant. Processing animations can be slower.
4. **Consistent timing**: Same duration for same types of transitions everywhere

```typescript
// Reduced motion awareness
const useMotionPreference = () => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return {
    duration: reducedMotion ? 0 : animation.duration.normal,
    spring: reducedMotion ? {} : animation.easing.spring,
  };
};
```

---

## Related Documents

| Document                                             | Relationship                 |
| ---------------------------------------------------- | ---------------------------- |
| [51-component-library.md](./51-component-library.md) | Components using this system |
| [56-accessibility.md](./56-accessibility.md)         | Contrast ratios, color use   |
| [Design_Token_System_Enforcer skill](../tools/)      | Token enforcement tooling    |

---

_Document Owner: Design Team | Review Cycle: Per-major-version | Approved: 2026-07-27_
