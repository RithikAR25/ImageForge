# ADR-0007: Lazy WASM Loading with Service Worker Cache

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

The combined WASM binary payload for ImageForge (libvips, mozjpeg, pngquant, libwebp, Skia CanvasKit) is significant. Loading all WASM on initial page load would:

1. Dramatically slow first load
2. Hurt Lighthouse performance scores
3. Consume bandwidth for users who only use one feature

We need a loading strategy that balances startup time with processing readiness.

---

## Decision Outcome

**Chosen: Progressive/lazy WASM loading with Service Worker precaching**

### Loading Strategy

| Module         | When Loaded               | Size (gz) |
| -------------- | ------------------------- | --------- |
| libvips core   | App startup (background)  | ~3.5MB    |
| mozjpeg        | First JPEG operation      | ~300KB    |
| pngquant       | First PNG operation       | ~200KB    |
| libwebp        | First WebP operation      | ~400KB    |
| libavif        | First AVIF operation      | ~600KB    |
| libheif        | First HEIC operation      | ~800KB    |
| FFmpeg         | First GIF/video operation | ~7MB      |
| Skia CanvasKit | First canvas operation    | ~3MB      |

### Service Worker Caching

On first visit:

1. App HTML + JS loads (~500KB)
2. User interacts with UI
3. In background: Service Worker fetches and caches all WASM modules
4. Next visit: WASM served from SW cache (~0.1s load)

After first visit, WASM is essentially instant because it comes from the Service Worker cache.

---

## Consequences

**Good**:

- First Contentful Paint is fast (JS loads first, WASM in background)
- Return visits have near-instant WASM (from SW cache)
- Feature-based loading means video-to-GIF users only download FFmpeg when needed

**Bad**:

- First compress operation may be delayed if libvips hasn't loaded yet (show "Loading engine..." indicator)
- Service Worker complexity: must handle WASM cache invalidation on version updates

---

## References

- [49b-wasm-architecture.md](../49b-wasm-architecture.md)
- [38-offline-first-architecture.md](../38-offline-first-architecture.md)
