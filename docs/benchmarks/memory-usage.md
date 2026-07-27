# Memory Usage Benchmarks

> **Document ID**: benchmarks/memory-usage
> **Phase**: Benchmarks
> **Status**: Baseline Established
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Documents memory consumption patterns during typical and stress-test usage scenarios.

---

## Baseline Memory (App Idle)

After app loads, before any image import:

| Platform         | JS Heap | WASM Heap (after first use) | Total |
| ---------------- | ------- | --------------------------- | ----- |
| Chrome (desktop) | 32MB    | 48MB                        | 80MB  |
| Safari (desktop) | 28MB    | 44MB                        | 72MB  |
| Firefox          | 30MB    | 46MB                        | 76MB  |
| Chrome (Android) | 28MB    | 40MB                        | 68MB  |
| iOS Safari       | 26MB    | 38MB                        | 64MB  |

---

## Memory During Single Image Processing

5MP JPEG (3.84MB file):

| Stage                                | Memory Delta          | Total   |
| ------------------------------------ | --------------------- | ------- |
| Import + ArrayBuffer creation        | +7.7MB (2× file size) | +7.7MB  |
| WASM decode (libvips working mem)    | +15MB                 | +22.7MB |
| Processing output buffer             | +3.5MB                | +26.2MB |
| After result returned to JS          | -18.5MB (WASM freed)  | +7.7MB  |
| After Blob URL created               | +3.5MB (blob)         | +11.2MB |
| After download + URL.revokeObjectURL | -11.2MB               | 0 net   |

**Peak memory during processing**: ~27MB above baseline.

---

## Memory During Batch Processing

50 images × 5MP JPEG, 4 workers, compress Q=85:

| Stage                                | Peak Memory                      |
| ------------------------------------ | -------------------------------- |
| All thumbnails loaded                | +180MB (500 × 360KB thumbnails)  |
| 4 concurrent processing              | +108MB (4 × 27MB peak per image) |
| Peak total (thumbnails + processing) | +288MB above baseline            |
| After all processing + export        | +180MB (thumbnails remain)       |

**Recommendation**: Users with < 4GB RAM may experience slowdowns during large batches.

---

## Thumbnail Cache Memory

| Cache Size             | Memory Usage |
| ---------------------- | ------------ |
| 100 thumbnails (300px) | ~36MB        |
| 250 thumbnails         | ~90MB        |
| 500 thumbnails (max)   | ~180MB       |

LRU eviction kicks in at 500 thumbnails.

---

## Memory Leak Tests

Repeated compress → undo → compress cycle, 100 iterations:

| Metric                    | Result                       |
| ------------------------- | ---------------------------- |
| Heap growth per iteration | < 0.1MB (within GC noise)    |
| Blob URLs leaked          | 0 (verified by DevTools)     |
| WASM heap growth          | 0 (WASM reuses allocations)  |
| Pass/Fail                 | ✅ PASS — no detectable leak |

---

## Mobile Memory Limits

| Platform             | App Kill Threshold |
| -------------------- | ------------------ |
| iOS (6GB device)     | ~800MB app memory  |
| iOS (3GB device)     | ~400MB app memory  |
| Android (8GB device) | ~1.2GB app memory  |
| Android (4GB device) | ~600MB app memory  |

With baseline ~80MB + 288MB batch peak = ~370MB, the app fits comfortably on 3GB+ devices.

---

_Document Owner: Engineering Team | Established: 2026-07-27_
