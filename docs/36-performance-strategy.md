# Performance Strategy

> **Document ID**: 36
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the performance strategy for ImageForge — how performance targets from the NFRs are achieved, measured, and maintained across Web and Mobile platforms.

---

## Performance Budget

### Web

| Metric                 | Budget  | Measurement Tool  |
| ---------------------- | ------- | ----------------- |
| Lighthouse Performance | ≥ 85    | Lighthouse CI     |
| FCP                    | ≤ 1.5s  | Lighthouse / CrUX |
| LCP                    | ≤ 2.5s  | Lighthouse / CrUX |
| TTI                    | ≤ 4.0s  | Lighthouse        |
| CLS                    | ≤ 0.1   | Lighthouse        |
| JS Bundle (gzip)       | ≤ 500KB | Rollup plugin     |
| Initial Payload        | ≤ 5MB   | Lighthouse        |
| WASM Init (warm)       | ≤ 500ms | Custom benchmark  |

### Mobile

| Metric                    | Budget  | Measurement Tool      |
| ------------------------- | ------- | --------------------- |
| Cold start to interactive | ≤ 3s    | Flipper / Instruments |
| Warm start                | ≤ 1s    | Same                  |
| Frame rate during scroll  | ≥ 60fps | Perf Monitor          |
| Single compress (5MP)     | ≤ 400ms | Custom benchmark      |

---

## Web Performance Techniques

### 1. Code Splitting

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-native-web': ['react-native-web'],
          navigation: ['@react-navigation/native'],
          skia: ['@shopify/react-native-skia'],
        },
      },
    },
  },
});
```

Feature modules (GIF, PDF, OCR) are dynamically imported:

```typescript
// Lazy-load the GIF module only when user opens GIF tool
const GifModule = lazy(() => import('../features/gif/GifModule'));
```

### 2. WASM Lazy Loading

See [49b-wasm-architecture.md](./49b-wasm-architecture.md) for the full WASM loading strategy. Key point: WASM modules are NOT in the initial bundle — loaded on demand.

### 3. Image Thumbnail Optimization

Thumbnails are generated at render-appropriate resolutions:

```typescript
// Max 300×300px for queue list view
// Max 800×600px for preview panel
// Original resolution only for download
```

### 4. Virtual Lists

Image queue uses virtualized lists to handle 500+ items without DOM overhead:

```typescript
// React Native: FlashList (Shopify)
<FlashList
  data={jobs}
  estimatedItemSize={80}
  renderItem={({ item }) => <QueueItem job={item} />}
/>

// Web: same FlashList component works via RNW
```

### 5. Memoization

```typescript
// Expensive selectors are memoized
const completedJobs = useQueueStore(
  useShallow((state) => Array.from(state.jobs.values()).filter((j) => j.status === 'completed')),
);
```

### 6. Web Workers for All Processing

The main thread NEVER performs image processing. All WASM operations run in Web Workers, ensuring 60fps UI during batch.

---

## Mobile Performance Techniques

### 1. React Native New Architecture

Using Fabric renderer and JSI (JavaScript Interface) for direct native module calls without bridge serialization overhead.

### 2. Reanimated for Animations

All animations use `react-native-reanimated` (runs on UI thread via worklets), not `Animated` (runs on JS thread):

```typescript
// Reanimated worklet — runs on UI thread, zero JS overhead
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(progress.value, { duration: 200 }),
}));
```

### 3. Hermes Engine

Expo SDK defaults to Hermes (Meta's JS engine) which provides:

- Faster startup (bytecode pre-compilation)
- Lower memory usage
- Better JIT performance

---

## Performance Monitoring in CI

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  run: lhci autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_TOKEN }}
```

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }]
      }
    }
  }
}
```

---

## Benchmark Suite

A custom benchmark suite in `tools/benchmarks/` runs against processing performance targets per release:

```typescript
// tools/benchmarks/compress.bench.ts
bench(
  'Compress 5MP JPEG at quality 85',
  async () => {
    const result = await engine.compress(fiveMegapixelJpeg, { quality: 85 });
    expect(result.byteLength).toBeLessThan(original.byteLength);
  },
  { iterations: 10, warmupIterations: 3 },
);
```

Results are stored in `benchmarks/results/` and compared to previous runs. Regressions > 20% fail CI.

---

## Related Documents

| Document                                                                 | Relationship              |
| ------------------------------------------------------------------------ | ------------------------- |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md) | Performance NFRs          |
| [49b-wasm-architecture.md](./49b-wasm-architecture.md)                   | WASM loading strategy     |
| [80-ci-cd.md](./80-ci-cd.md)                                             | Lighthouse CI integration |
| [performance/benchmark-plan.md](./performance/benchmark-plan.md)         | Benchmark methodology     |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
