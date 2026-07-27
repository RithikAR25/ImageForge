# ADR-0005: Web Worker Pool for Batch Processing Engine

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge's batch processing engine must process potentially hundreds of images without blocking the UI thread. On the Web platform, JavaScript is single-threaded; image processing must be offloaded to prevent UI freezes.

We need to decide: how should the batch processing engine distribute work across multiple threads?

---

## Decision Drivers

- UI must remain responsive (60 fps) during batch processing
- Batch throughput should scale with available CPU cores
- Workers must be pre-initialized (no startup overhead per job)
- Failed jobs must not crash other workers
- Queue state must be observable from the UI thread
- Memory usage must be bounded (no unbounded growth with batch size)

---

## Considered Options

### Option A: Web Worker Pool (Chosen)

Pre-initialize N Web Workers (default: 4, max: `navigator.hardwareConcurrency`). Distribute jobs to idle workers via a queue.

### Option B: Single Dedicated Web Worker

One Web Worker processes images sequentially.

### Option C: ServiceWorker Background Processing

Use the Service Worker to process images in the background.

### Option D: Main Thread Sequential Processing

Process images one at a time on the main thread.

---

## Decision Outcome

**Chosen option: Option A — Web Worker Pool**

Pool size defaults to `Math.min(4, navigator.hardwareConcurrency)`.

---

## Pros and Cons

### Option A: Worker Pool (Chosen)

**Pros**:

- Parallel processing saturates available CPU cores
- Pre-warmed workers eliminate per-job startup cost (~200ms)
- Worker isolation: one worker crash doesn't affect others
- Configurable pool size for user preference

**Cons**:

- WASM modules must be loaded in each worker (~3.5MB × 4 = 14MB)
- Worker-to-Worker communication not possible (all via main thread)
- More complex coordination logic

**Mitigation**: WASM modules are cached in browser cache after first load; each subsequent worker load reads from cache (fast).

### Option B: Single Worker

**Pros**: Simpler implementation; no coordination logic
**Cons**: No parallel speedup; processing 500 images takes 5× longer than 4-worker pool

### Option C: ServiceWorker

**Pros**: Can run in background when app is not visible
**Cons**: Service Workers cannot access IndexedDB in all browsers; significant lifecycle complexity; designed for network interception not compute

### Option D: Main Thread

**Pros**: Simplest implementation
**Cons**: Completely blocks UI during processing — unacceptable

---

## Consequences

**Good**:

- Batch of 100 images completes ~4× faster with 4 workers vs. 1
- UI is completely responsive during batch operations
- Pool can be dynamically scaled down on low-memory devices

**Bad**:

- 4× WASM memory usage for 4 workers (~14MB for libvips instances)
- Worker pool manager adds ~500 lines of coordination logic
- Debugging worker issues requires specialized tooling (Chrome DevTools Workers panel)

---

## References

- [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [30-batch-processing-engine.md](../30-batch-processing-engine.md)
- [32-background-job-system.md](../32-background-job-system.md)
