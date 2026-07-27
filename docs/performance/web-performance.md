# Web Performance Guide

> **Document ID**: performance/web-performance
> **Phase**: 6 — Performance
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines web-specific performance strategies — bundle size optimization, lazy loading, Service Worker caching, and Core Web Vitals optimization.

---

## Bundle Size Budget

| Bundle Chunk                     | Size Budget (gzipped)           |
| -------------------------------- | ------------------------------- |
| App shell (HTML + CSS)           | ≤ 20KB                          |
| React + React Native Web         | ≤ 80KB                          |
| State (Zustand + TanStack Query) | ≤ 30KB                          |
| UI components                    | ≤ 50KB                          |
| Total initial JS                 | ≤ 200KB                         |
| WASM modules                     | Not included (loaded on demand) |

### Monitoring Bundle Size

```bash
# After build
npx vite-bundle-visualizer

# Or in CI — fail if budget exceeded
npx bundlesize --config .bundlersizerc
```

```json
// .bundlersizerc
{
  "files": [
    { "path": "./dist/assets/*.js", "maxSize": "200 kB" },
    { "path": "./dist/assets/*.css", "maxSize": "30 kB" }
  ]
}
```

---

## Code Splitting Strategy

```typescript
// Lazy-load feature screens (not in initial bundle)
const CompressScreen = lazy(() => import('./screens/CompressScreen'));
const ResizeScreen = lazy(() => import('./screens/ResizeScreen'));
const BatchScreen = lazy(() => import('./screens/BatchScreen'));

// Lazy-load WASM engines (only when first used)
const { processingEngine } = await import('./engines/WasmProcessingEngine');

// Lazy-load AI features (much larger, only on demand)
const { backgroundRemoval } = await import('./ai/BackgroundRemoval');
```

---

## Critical Path Optimization

The critical render path for LCP:

```
1. HTML arrives → skeleton visible (0–100ms)
2. CSS loads (inlined for critical CSS)
3. React hydrates → interactive (< 1.5s)
4. WASM pre-loads via Service Worker
   (in background, not blocking)
5. User drops image → WASM ready
   (already cached — instant)
```

Critical CSS is inlined in `<head>` using Vite's `vite-plugin-critical`:

```
Above-the-fold styles → inline <style>
Below-the-fold styles → async loaded
```

---

## Image Optimization

```typescript
// Thumbnails use responsive srcset
<img
  src={thumbnail.url}
  srcSet={`${thumbnail.url}?w=150 150w, ${thumbnail.url}?w=300 300w`}
  sizes="(max-width: 768px) 150px, 300px"
  loading="lazy"          // Native lazy loading
  decoding="async"        // Async decode
/>
```

---

## Service Worker Performance

```
First visit:
  - HTML served from CDN edge (< 50ms TTFB)
  - WASM downloaded (3–5s for libvips)
  - WASM cached in Service Worker

Second visit:
  - All assets served from Service Worker cache (< 10ms)
  - WASM served from cache (< 50ms)
  - App is fully offline-capable
```

---

## React Rendering Optimization

```typescript
// Memoize expensive thumbnail computations
const ThumbnailItem = memo(function ThumbnailItem({ image }: { image: ImageFile }) {
  return <Image source={{ uri: image.thumbnailUrl }} />;
});

// Virtualize long lists (FlashList — O(1) rendering)
<FlashList
  data={images}
  renderItem={({ item }) => <ThumbnailItem image={item} />}
  estimatedItemSize={120}
  keyExtractor={(item) => item.id}
/>

// Avoid unnecessary re-renders via Zustand selectors
const imageCount = useImageStore(
  useShallow((s) => s.images.length) // Only re-renders when count changes
);
```

---

## Core Web Vitals Targets

| Metric | Target  | How Achieved                        |
| ------ | ------- | ----------------------------------- |
| LCP    | ≤ 1.5s  | Inlined critical CSS, edge CDN      |
| INP    | ≤ 100ms | Processing off main thread (Worker) |
| CLS    | ≤ 0.1   | Reserved image dimensions           |
| FID    | ≤ 50ms  | No blocking scripts                 |
| TTFB   | ≤ 200ms | Vercel edge                         |

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
