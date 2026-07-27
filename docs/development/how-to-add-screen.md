# How to Add a Screen

> **Document ID**: development/how-to-add-screen
> **Phase**: Development Guides
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Step-by-step guide for adding a new screen to ImageForge using Expo Router's file-based routing system.

---

## Step 1: Create the Screen File

```
packages/ui/src/screens/[ScreenName]/
├── index.tsx             ← Screen component
├── [ScreenName].test.tsx ← Screen tests
└── components/           ← Screen-specific components
    └── [ScreenSpecificComp].tsx
```

---

## Step 2: Implement the Screen

```typescript
// packages/ui/src/screens/EnhanceScreen/index.tsx
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useActiveImage } from '@imageforge/hooks';
import { EnhanceControls } from './components/EnhanceControls';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';

/**
 * EnhanceScreen — manual image enhancement controls.
 */
export function EnhanceScreen() {
  const { colors } = useTheme();
  const activeImage = useActiveImage();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    preview: {
      flex: 1,
    },
    controls: {
      maxHeight: 320,
    },
  });

  if (!activeImage) {
    return <NoImagePlaceholder message="Select an image to enhance" />;
  }

  return (
    <ScreenContainer>
      <View style={styles.preview}>
        <BeforeAfterSlider imageId={activeImage.id} />
      </View>
      <View style={styles.controls}>
        <EnhanceControls imageId={activeImage.id} />
      </View>
    </ScreenContainer>
  );
}
```

---

## Step 3: Register Route (Expo Router)

```
apps/mobile/app/
└── (tabs)/
    └── enhance.tsx     ← New route file
```

```typescript
// apps/mobile/app/(tabs)/enhance.tsx
export { EnhanceScreen as default } from '@imageforge/ui';
```

```
apps/web/src/
└── routes/
    └── enhance/
        └── index.tsx   ← Web route
```

```typescript
// apps/web/src/routes/enhance/index.tsx
export { EnhanceScreen as default } from '@imageforge/ui';
```

---

## Step 4: Add to Navigation

```typescript
// packages/ui/src/navigation/TabBar/tabs.ts
import { Ionicons } from '@expo/vector-icons';

export const TABS = [
  { name: 'compress', label: 'Compress', icon: 'archive' },
  { name: 'resize', label: 'Resize', icon: 'resize' },
  { name: 'crop', label: 'Crop', icon: 'crop' },
  { name: 'enhance', label: 'Enhance', icon: 'sparkles' }, // ← Add here
  { name: 'batch', label: 'Batch', icon: 'layers' },
] as const;
```

---

## Step 5: Add Feature Flag

New screens for Phase 2+ features must be behind a feature flag:

```typescript
// packages/shared/src/flags/flags.ts
export const FEATURE_FLAGS = {
  // ...existing flags
  ENABLE_ENHANCE_SCREEN: process.env.EXPO_PUBLIC_ENABLE_ENHANCE === 'true',
};

// In navigation:
if (FEATURE_FLAGS.ENABLE_ENHANCE_SCREEN) {
  tabs.push({ name: 'enhance', label: 'Enhance', icon: 'sparkles' });
}
```

---

## Step 6: Add Screen Test

```typescript
// packages/ui/src/screens/EnhanceScreen/EnhanceScreen.test.tsx
import { render, screen } from '@testing-library/react-native';
import { EnhanceScreen } from './index';

describe('EnhanceScreen', () => {
  it('shows placeholder when no image is selected', () => {
    render(<EnhanceScreen />, { wrapper: TestProviders });
    expect(screen.getByText(/select an image to enhance/i)).toBeTruthy();
  });
});
```

---

## Step 7: Export from Package

```typescript
// packages/ui/src/screens/index.ts
export { EnhanceScreen } from './EnhanceScreen';
```

---

## PR Checklist for New Screens

- [ ] Screen created in `packages/ui/src/screens/[ScreenName]/`
- [ ] Route registered in `apps/web` and `apps/mobile`
- [ ] Navigation updated
- [ ] Feature flag added (if Phase 2+ feature)
- [ ] Screen test added
- [ ] Screen exported from `packages/ui/src/screens/index.ts`
- [ ] Accessibility labels on all interactive elements
- [ ] Responsive layout tested (mobile + tablet + desktop)

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
