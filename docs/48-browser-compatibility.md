# Browser Compatibility

> **Document ID**: 48
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the browser compatibility requirements for ImageForge's web application, including minimum browser versions, feature detection strategies, and graceful degradation paths.

---

## Target Browser Matrix

| Browser          | Minimum Version | Market Share | Notes                               |
| ---------------- | --------------- | ------------ | ----------------------------------- |
| Chrome           | 91+             | ~65%         | Full support (WASM SIMD, COOP/COEP) |
| Firefox          | 90+             | ~4%          | Full support                        |
| Safari           | 15.4+           | ~19%         | WASM supported; COOP/COEP partial   |
| Edge             | 91+             | ~4%          | Same engine as Chrome               |
| Samsung Internet | 15+             | ~3%          | Chromium-based                      |
| **Mobile**       |                 |              |                                     |
| Chrome Android   | 91+             | —            | Full support                        |
| Safari iOS       | 15.4+           | —            | WASM; some WebRTC limitations       |

**Not supported**: Internet Explorer (all versions). ImageForge displays a "Please upgrade your browser" page for IE users.

---

## Critical Web API Requirements

| API                    | Used For             | Chrome | Firefox | Safari |
| ---------------------- | -------------------- | ------ | ------- | ------ |
| WebAssembly            | Image processing     | 91+    | 90+     | 15+    |
| WASM SIMD              | 3-5x speedup         | 91+    | 90+     | 16.4+  |
| SharedArrayBuffer      | libvips multi-thread | 92+    | 79+     | 15.2+  |
| IndexedDB              | Queue persistence    | All    | All     | All    |
| Service Worker         | Offline / PWA        | All    | All     | 11.1+  |
| File API               | Image import         | All    | All     | All    |
| Blob URLs              | Preview              | All    | All     | All    |
| Web Workers            | Processing threads   | All    | All     | All    |
| Clipboard API          | Paste images         | 76+    | 87+     | 13.1+  |
| File System Access API | Save to disk         | 86+    | No      | No     |

---

## Feature Detection Strategy

```typescript
// packages/shared/src/platform/capabilities.ts

interface BrowserCapabilities {
  hasWasm: boolean;
  hasWasmSimd: boolean;
  hasSharedArrayBuffer: boolean;
  hasFileSystemAccess: boolean;
  hasClipboardWrite: boolean;
  hasServiceWorker: boolean;
  hasIndexedDB: boolean;
}

export async function detectCapabilities(): Promise<BrowserCapabilities> {
  return {
    hasWasm: typeof WebAssembly !== 'undefined',
    hasWasmSimd: await testWasmSimd(),
    hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    hasFileSystemAccess: 'showSaveFilePicker' in window,
    hasClipboardWrite: 'clipboard' in navigator && 'write' in navigator.clipboard,
    hasServiceWorker: 'serviceWorker' in navigator,
    hasIndexedDB: 'indexedDB' in window,
  };
}
```

---

## Graceful Degradation

| Feature                        | Full                   | Degraded                               |
| ------------------------------ | ---------------------- | -------------------------------------- |
| WASM unavailable               | Full processing        | Canvas API (lower quality)             |
| WASM SIMD unavailable          | SIMD-enabled binary    | Non-SIMD binary (same quality, slower) |
| SharedArrayBuffer unavailable  | Multi-threaded libvips | Single-threaded WASM                   |
| Service Worker unavailable     | Full offline           | Online-only                            |
| File System Access unavailable | "Save to disk" dialog  | Standard browser download              |
| Clipboard API unavailable      | Paste image            | Drag-only import                       |
| IndexedDB unavailable          | Queue persistence      | In-memory only (no resume)             |

---

## Safari Specific Considerations

Safari has historically lagged on web standards:

1. **COOP/COEP**: Full support added in Safari 15.2. Required for `SharedArrayBuffer`.
   - Mitigation: LibVips runs in single-threaded mode on Safari < 15.2

2. **PWA gaps**: Safari supports Add to Home Screen but lacks push notifications.
   - Mitigation: Documented limitation; no push notifications for web

3. **ITP (Intelligent Tracking Prevention)**: Affects cross-site iframes.
   - Mitigation: Plugin sandboxes hosted on same domain or `imageforge.app` subdomain

---

## Testing Matrix

| Environment      | Tool                | Frequency   |
| ---------------- | ------------------- | ----------- |
| Chrome (latest)  | Playwright CI       | Every PR    |
| Firefox (latest) | Playwright CI       | Every PR    |
| Safari (latest)  | BrowserStack manual | Per release |
| Chrome Android   | BrowserStack        | Per release |
| Safari iOS       | BrowserStack        | Per release |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
