# Benchmark Plan

> **Document ID**: benchmarks/benchmark-plan
> **Phase**: Benchmarks
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the benchmark suite for ImageForge — what is measured, how it is measured, baseline expectations, and regression gates.

---

## Why Benchmarks?

ImageForge's core value proposition is **fast, local image processing**. Benchmarks ensure we:

1. Maintain processing speed across releases
2. Identify performance regressions before they ship
3. Compare against competitor tools
4. Set informed user-facing time estimates

---

## Benchmark Categories

### 1. WASM Module Load Time

| Benchmark              | Metric                    | Target  |
| ---------------------- | ------------------------- | ------- |
| mozjpeg.wasm cold load | Time to ready (uncached)  | ≤ 2s    |
| mozjpeg.wasm warm load | Time to ready (cached SW) | ≤ 50ms  |
| libvips.wasm cold load | Time to ready             | ≤ 5s    |
| libvips.wasm warm load | Time to ready (cached)    | ≤ 100ms |

### 2. Image Processing Speed

All benchmarks run on a standard 5MP JPEG (2500×2000, ~3.8MB):

| Operation           | Quality/Settings | Target (Web) | Target (iOS) | Target (Android) |
| ------------------- | ---------------- | ------------ | ------------ | ---------------- |
| JPEG compress       | Q=85             | ≤ 500ms      | ≤ 300ms      | ≤ 400ms          |
| JPEG compress       | Q=50             | ≤ 400ms      | ≤ 250ms      | ≤ 350ms          |
| WebP compress       | Q=80             | ≤ 800ms      | ≤ 500ms      | ≤ 600ms          |
| PNG compress        | Level 6          | ≤ 1200ms     | ≤ 800ms      | ≤ 1000ms         |
| Resize (2500→1080)  | Lanczos3         | ≤ 600ms      | ≤ 400ms      | ≤ 500ms          |
| Resize (2500→300)   | Lanczos3         | ≤ 400ms      | ≤ 200ms      | ≤ 300ms          |
| Crop (50% of image) | —                | ≤ 200ms      | ≤ 100ms      | ≤ 150ms          |
| Rotate 90°          | Lossless         | ≤ 100ms      | ≤ 50ms       | ≤ 80ms           |
| Convert JPEG→WebP   | Q=80             | ≤ 800ms      | ≤ 500ms      | ≤ 600ms          |

### 3. Batch Processing Throughput

50 images, 5MP each, compress Q=85:

| Metric                      | Target  |
| --------------------------- | ------- |
| Total time (Web, 4 workers) | ≤ 30s   |
| Total time (iOS)            | ≤ 25s   |
| Total time (Android)        | ≤ 35s   |
| Images per second (Web)     | ≥ 1.5/s |

---

## Benchmark Implementation

```typescript
// benchmarks/compress.bench.ts
import { bench, describe } from 'vitest';
import { loadTestImage, createMockEngine } from '../test-utils';

describe('JPEG Compression', () => {
  bench('5MP JPEG at Q85', async () => {
    const image = await loadTestImage('5mp-test.jpg');
    const engine = await createMockEngine();
    await engine.applyOperation(image, {
      type: 'compress',
      config: { codec: 'jpeg', quality: 85 },
    });
  });

  bench('5MP WebP at Q80', async () => {
    const image = await loadTestImage('5mp-test.jpg');
    const engine = await createMockEngine();
    await engine.applyOperation(image, {
      type: 'compress',
      config: { codec: 'webp', quality: 80 },
    });
  });
});
```

---

## Test Images

| File            | Description       | Size   |
| --------------- | ----------------- | ------ |
| `1mp-test.jpg`  | 1 megapixel JPEG  | ~800KB |
| `5mp-test.jpg`  | 5 megapixel JPEG  | ~3.8MB |
| `12mp-test.jpg` | 12 megapixel JPEG | ~9MB   |
| `5mp-test.png`  | 5MP PNG           | ~12MB  |
| `5mp-test.webp` | 5MP WebP          | ~2.5MB |

---

## CI Integration

Benchmarks run weekly (not per-PR, too slow):

```yaml
# .github/workflows/benchmarks.yml
on:
  schedule:
    - cron: '0 2 * * 1' # Monday 2am
  workflow_dispatch:

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm benchmark
      - name: Compare to baseline
        run: node scripts/compare-benchmarks.js
      - name: Comment on PR if regression
        if: failure()
        uses: actions/github-script@v7
```

A regression is defined as any benchmark taking **>20% longer** than the established baseline.

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
