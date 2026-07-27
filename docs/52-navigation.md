# Navigation

> **Document ID**: 52
> **Phase**: 3 — UI/UX Design
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Design Team

---

## Purpose

This document defines the navigation architecture for ImageForge across Web and Mobile platforms using Expo Router.

---

## Navigation Philosophy

1. **URL-based navigation on Web**: Every screen has a URL — deep linking, browser back button, sharing
2. **Tab-based on Mobile**: Bottom tabs for primary navigation, stack for sub-screens
3. **Consistent behavior**: Same navigation actions produce same results on all platforms
4. **Deep linking**: Links to specific processing operations work on both web and mobile

---

## Navigation Structure

```
/ (Root)
├── (tabs)/                    ← Tab navigator (mobile) / Sidebar (web)
│   ├── index.tsx              → Home / Import screen
│   ├── edit.tsx               → Single Image Editor
│   ├── batch.tsx              → Batch Processing Queue
│   └── settings.tsx           → Settings
│
├── edit/[imageId]/            → Deep link to edit specific image
│   ├── compress.tsx
│   ├── resize.tsx
│   ├── crop.tsx
│   ├── rotate.tsx
│   └── convert.tsx
│
├── batch/[queueId]/           → Deep link to specific queue
│   └── index.tsx
│
└── _modals/                   → Modal screens
    ├── export.tsx
    ├── history.tsx
    └── plugin.tsx
```

---

## Mobile Navigation Layout

```
┌─────────────────────────────┐
│         Header              │
│  [← Back]  [Title]  [...]   │
├─────────────────────────────┤
│                             │
│          Screen             │
│          Content            │
│                             │
├─────────────────────────────┤
│  🏠 Home │ ✏️ Edit │ 📦 Batch │ ⚙️ Settings │
└─────────────────────────────┘
```

---

## Web Navigation Layout

```
┌────────┬────────────────────────────────────┐
│        │              Header                │
│ Sidebar│                                    │
│        ├────────────────────────────────────┤
│  🏠    │                                    │
│  ✏️    │          Main Content              │
│  📦    │                                    │
│  ⚙️    │                                    │
│        │                                    │
└────────┴────────────────────────────────────┘
```

On Web, the bottom tab navigator is replaced with a collapsible left sidebar using `Platform.select`:

```typescript
// packages/ui/src/navigation/RootNavigator.tsx
const NavigationLayout = Platform.select({
  web: () => <SidebarLayout />,
  default: () => <BottomTabLayout />,
});
```

---

## Expo Router Configuration

```typescript
// apps/mobile/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="_modals/export"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
```

---

## Deep Linking

```json
// app.json (Expo)
{
  "expo": {
    "scheme": "imageforge",
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [{ "scheme": "imageforge" }]
      }
    ]
  }
}
```

Deep link examples:

- `imageforge://edit/compress` — Opens compress tool
- `imageforge://batch` — Opens batch queue
- `https://imageforge.app/edit/resize?width=1080` — Web URL to resize with preset

---

## Transition Animations

```typescript
const screenOptions: NativeStackNavigationOptions = {
  animation: 'slide_from_right', // iOS-native feel
  animationDuration: 200,

  // Respect reduced motion
  ...(reducedMotion && { animation: 'none' }),
};
```

---

## Related Documents

| Document                                                       | Relationship          |
| -------------------------------------------------------------- | --------------------- |
| [53-screen-flow.md](./53-screen-flow.md)                       | Screen-by-screen flow |
| [54-user-flow.md](./54-user-flow.md)                           | User journey maps     |
| [24-component-architecture.md](./24-component-architecture.md) | Navigation components |

---

_Document Owner: Design Team | Approved: 2026-07-27_
