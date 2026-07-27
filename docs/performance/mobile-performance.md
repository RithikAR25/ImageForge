# Mobile Performance Guide

> **Document ID**: performance/mobile-performance
> **Phase**: 6 — Performance
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Mobile-specific performance strategies — JS thread management, native rendering, image memory, and battery optimization.

---

## Thread Model

React Native has two threads for UI interaction:

```
JS Thread (JavaScript)
  - Business logic
  - State updates (Zustand)
  - React reconciliation

UI Thread (Native)
  - Layout engine
  - Animations (Reanimated worklets)
  - Gesture recognition

Native Processing Thread
  - Image compression/resize
  - File I/O
```

**Rule**: Image processing NEVER runs on the JS Thread. It runs on a native background thread via the JSI bridge.

---

## Avoiding JS Thread Blocking

```typescript
// ❌ Bad: processing on JS thread blocks UI
const result = compressImageSync(buffer); // Hypothetical — this freezes the app

// ✅ Good: async + native bridge
const result = await NativeModules.ImageProcessingModule.compress(uri, config);
// UI remains responsive during processing
```

---

## List Performance (FlashList)

FlatList has O(n) renders — FlashList is O(1):

```typescript
import { FlashList } from '@shopify/flash-list';

// ✅ FlashList with estimated size
<FlashList
  data={images}
  renderItem={({ item }) => <ThumbnailItem image={item} />}
  estimatedItemSize={110}    // Measured from real renders
  keyExtractor={(item) => item.id}
  overrideItemLayout={(layout, item) => {
    layout.size = item.aspectRatio > 1 ? 90 : 110; // Variable heights
  }}
/>
```

---

## Image Memory

```typescript
// Thumbnails generated at display size, not full resolution
const MAX_THUMBNAIL_SIZE = Platform.select({
  ios: 300,       // iOS retina: 300pt × 3 = 900px actual
  android: 400,   // Android: 400px
  default: 300,
});

// expo-image caches decoded bitmaps efficiently
import { Image } from 'expo-image';

<Image
  source={{ uri: thumbnail.uri }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  transition={200}
  recyclingKey={image.id}    // Reuse image views in list
  cachePolicy="memory-disk"
/>
```

---

## Battery Optimization

Long batch operations on mobile drain battery. Mitigations:

1. **Background execution**: Pause heavy processing when app goes to background
2. **Thermal throttling**: Detect device thermal state (iOS) and reduce concurrency:

```typescript
import * as Device from 'expo-device';

async function getOptimalConcurrency(): Promise<number> {
  const cores = Device.totalMemory
    ? Math.min(4, Math.floor(Device.totalMemory / (1024 * 1024 * 512)))
    : 2; // Conservative default

  // On iOS, check thermal state
  if (Platform.OS === 'ios') {
    const thermalState = await getThermalState(); // Custom native module
    if (thermalState === 'serious') return 1;
    if (thermalState === 'fair') return Math.max(1, cores - 1);
  }

  return cores;
}
```

3. **Progress persistence**: If the user force-quits, queue state is saved — no re-processing needed

---

## Startup Performance

| Metric                              | Target  |
| ----------------------------------- | ------- |
| Cold start to interactive (iOS)     | ≤ 2s    |
| Cold start to interactive (Android) | ≤ 3s    |
| Warm start (from background)        | ≤ 500ms |

```typescript
// Prefetch thumbnails for first 20 visible items on startup
await Promise.all(recentImages.slice(0, 20).map((img) => prefetchThumbnail(img.id)));
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
