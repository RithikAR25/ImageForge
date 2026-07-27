# Memory Management

> **Document ID**: performance/memory-management
> **Phase**: 6 — Performance
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines memory management strategies for ImageForge — preventing leaks, controlling WASM memory growth, and ensuring stable long-session performance.

---

## Memory Budget

| Resource                    | Budget             | Platform |
| --------------------------- | ------------------ | -------- |
| WASM heap                   | ≤ 512MB            | Web      |
| Worker pool memory          | ≤ 256MB per worker | Web      |
| Thumbnail cache (IndexedDB) | ≤ 200MB            | Web      |
| In-memory image results     | ≤ 2 simultaneously | All      |
| Total app memory ceiling    | ≤ 1GB              | Web      |
| Total app memory ceiling    | ≤ 300MB            | Mobile   |

---

## Blob URL Lifecycle Management

Blob URLs consume memory until explicitly revoked:

```typescript
// hooks/useImagePreview.ts
function useImagePreview(result: ProcessingResult | null) {
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    // Revoke previous URL
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }

    if (result) {
      urlRef.current = URL.createObjectURL(
        new Blob([result.output.buffer], { type: result.output.mimeType }),
      );
    } else {
      urlRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [result]);

  return urlRef.current;
}
```

---

## ArrayBuffer Ownership

When ArrayBuffer is transferred to a Web Worker (via `postMessage` transfer list), ownership moves to the Worker — the original reference becomes detached and takes zero memory:

```typescript
// Zero-copy: buffer ownership moves to worker
worker.postMessage(
  { type: 'compress', buffer: imageBuffer, config },
  [imageBuffer], // Transfer list
);

// imageBuffer.byteLength === 0 here (detached)
// Memory is now owned by the Worker thread
```

The Worker transfers the result buffer back the same way.

---

## WASM Memory Management

libvips manages its own heap via `wasm-malloc`. Key rules:

1. The WASM heap grows but **never shrinks** in the current Emscripten model
2. Each WASM worker has an independent heap
3. Worker pool size is capped at `min(4, hardwareConcurrency)` to control total WASM memory
4. Workers are reused across operations (not recreated)

Heap growth monitoring:

```typescript
// Warn if WASM heap grows beyond budget
function checkWasmMemory(module: EmscriptenModule): void {
  const usedMB = module.HEAP8.byteLength / (1024 * 1024);
  if (usedMB > 256) {
    logger.warn('WASM heap growing large', { usedMB });
  }
}
```

---

## Mobile Memory Management

On mobile, the OS issues memory warnings:

```typescript
// apps/mobile: listen for memory warnings
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // React Native automatically triggers GC on low memory
  // Expose hook for additional cleanup
}

function useMemoryPressure() {
  useEffect(() => {
    const subscription = AppState.addEventListener('memoryWarning', () => {
      logger.warn('Memory pressure warning received');
      clearThumbnailMemoryCache();
      // Force GC via React Native bridge (no direct access, but clearing refs helps)
    });
    return () => subscription.remove();
  }, []);
}
```

---

## Long-Session Stability

For users processing 500+ images in a session:

1. Thumbnails generated lazily with `requestIdleCallback`
2. Off-screen thumbnails use `<Image recyclingKey>` for RN FlashList memory management
3. Processed image results not held in memory after export
4. Queue store holds metadata only (not image buffers)

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
