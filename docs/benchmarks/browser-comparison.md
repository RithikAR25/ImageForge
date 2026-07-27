# Browser Comparison Benchmarks

> **Document ID**: benchmarks/browser-comparison
> **Phase**: Benchmarks
> **Status**: Baseline Established
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Cross-browser performance comparison for WASM processing on the same hardware.

---

## Test Conditions

- **Hardware**: M2 MacBook Air, 16GB RAM
- **Test**: Compress 5MP JPEG at Q=85 (mozjpeg), single operation
- **Browsers**: Chrome 124, Firefox 125, Safari 17.4, Edge 124

---

## WASM Processing Speed

| Browser     | Single Compress | Single WebP | SIMD Support | SharedArrayBuffer |
| ----------- | --------------- | ----------- | ------------ | ----------------- |
| Chrome 124  | 320ms           | 680ms       | ✅           | ✅                |
| Edge 124    | 325ms           | 690ms       | ✅           | ✅                |
| Firefox 125 | 410ms           | 820ms       | ✅           | ✅                |
| Safari 17.4 | 380ms           | 760ms       | ✅           | ✅                |
| Safari 15   | 620ms           | 1,240ms     | ❌           | ❌                |

**Safari 15 is 2× slower** due to no SIMD and no multi-threading (SharedArrayBuffer). Strongly recommend updating to Safari 16+.

---

## Startup Time (Time to Interactive)

| Browser   | Cold Start | Warm Start (SW cache) |
| --------- | ---------- | --------------------- |
| Chrome    | 1.2s       | 0.4s                  |
| Edge      | 1.1s       | 0.4s                  |
| Firefox   | 1.4s       | 0.5s                  |
| Safari 17 | 1.5s       | 0.7s                  |
| Safari 15 | 2.8s       | 1.2s                  |

---

## WASM Load Time (libvips, cold)

| Browser   | Load Time | Cache (Service Worker) |
| --------- | --------- | ---------------------- |
| Chrome    | 4.1s      | 45ms                   |
| Firefox   | 4.8s      | 52ms                   |
| Safari 17 | 4.4s      | 180ms                  |

Safari has slower Service Worker cache reads due to stricter security model.

---

## Feature Support Matrix

| Feature                | Chrome | Firefox    | Safari 17 | Safari 15 |
| ---------------------- | ------ | ---------- | --------- | --------- |
| WASM                   | ✅     | ✅         | ✅        | ✅        |
| WASM SIMD              | ✅     | ✅         | ✅        | ❌        |
| WASM Threads (SAB)     | ✅     | ✅         | ✅        | ❌        |
| WebGPU (AI)            | ✅     | ⚠️ Partial | ✅        | ❌        |
| Service Worker         | ✅     | ✅         | ✅        | ✅        |
| File System Access API | ✅     | ❌         | ❌        | ❌        |
| AVIF decode            | ✅     | ✅         | ✅ (16+)  | ❌        |

---

_Document Owner: Engineering Team | Established: 2026-07-27_
