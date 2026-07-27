# Theme System

> **Document ID**: 58
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the theme system architecture — how themes are structured, how components consume them, and how light/dark mode switching works at runtime.

---

## Theme Architecture

```
Design Tokens (raw values)
    ↓
Theme Objects (semantic mapping)
    ↓
ThemeContext (React Context)
    ↓
useTheme() hook
    ↓
Component StyleSheet
```

---

## Theme Objects

```typescript
// packages/ui/src/theme/themes.ts

const lightTheme: Theme = {
  colors: lightColors, // from tokens/colors.ts
  typography, // from tokens/typography.ts
  spacing, // from tokens/spacing.ts
  radii, // from tokens/radii.ts
  shadows: lightShadows,
  animation,
};

const darkTheme: Theme = {
  colors: darkColors, // Same structure, different values
  typography, // Typography is theme-independent
  spacing,
  radii,
  shadows: darkShadows, // Softer shadows in dark mode
  animation,
};
```

---

## ThemeProvider

```typescript
// packages/ui/src/theme/ThemeProvider.tsx

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const userPreference = useSettingsStore(s => s.theme);

  const activeScheme = userPreference === 'system'
    ? (systemScheme ?? 'light')
    : userPreference;

  const theme = activeScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
```

---

## Component Usage

```typescript
// packages/ui/src/primitives/Button/Button.tsx

function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const { colors, spacing, radii } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: variant === 'primary'
        ? colors.brand.primary
        : colors.background.muted,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: radii.md,
    },
    label: {
      color: variant === 'primary'
        ? colors.text.inverse
        : colors.text.primary,
    },
  });

  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}
```

---

## Theme Change Animation

When the user switches themes, a smooth cross-fade prevents harsh flashes:

```typescript
const themeOpacity = useSharedValue(1);

useEffect(() => {
  themeOpacity.value = withSequence(
    withTiming(0.8, { duration: 100 }),
    withTiming(1, { duration: 150 }),
  );
}, [theme.colors.background.default]);
```

---

## CSS Variables (Web)

On Web, theme tokens are injected as CSS custom properties for native CSS interactions:

```css
/* Injected by ThemeProvider on web */
:root {
  --color-background: #ffffff;
  --color-text-primary: #0d0d0f;
  --color-brand-primary: #6c63ff;
}

[data-theme='dark'] {
  --color-background: #0a0a0f;
  --color-text-primary: #f2f2f7;
  --color-brand-primary: #8b85ff;
}
```

---

## Related Documents

| Document                                                   | Relationship               |
| ---------------------------------------------------------- | -------------------------- |
| [50-design-system.md](./50-design-system.md)               | Token values               |
| [59-design-tokens.md](./59-design-tokens.md)               | Token reference            |
| [57-animation-guidelines.md](./57-animation-guidelines.md) | Theme transition animation |

---

_Document Owner: Design Team | Approved: 2026-07-27_
