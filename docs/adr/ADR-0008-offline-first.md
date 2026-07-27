# ADR-0008: Service Worker (Workbox) for Offline-First Architecture

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

The ImageForge web application must function fully offline after its first visit. This requires a Service Worker to intercept network requests and serve cached assets.

The question is how to implement the Service Worker: manually or with a framework.

---

## Decision Outcome

**Chosen: Workbox (via `vite-plugin-pwa`) for Service Worker generation**

Workbox provides:

- Declarative caching strategies (`CacheFirst`, `NetworkFirst`, `StaleWhileRevalidate`)
- Precaching of static assets at build time
- Automatic cache versioning on content change
- Background sync for offline-queued operations
- Runtime caching for dynamic resources (WASM modules)

### Caching Strategy by Resource Type

| Resource               | Strategy                      | TTL                             |
| ---------------------- | ----------------------------- | ------------------------------- |
| HTML/CSS/JS bundles    | `CacheFirst` (versioned URLs) | Immutable until new deploy      |
| WASM modules           | `CacheFirst`                  | Long-lived (versioned filename) |
| Image thumbnails       | `CacheFirst` with size limit  | 7 days, max 100 entries         |
| API responses (future) | `NetworkFirst`                | 1 hour                          |

### PWA Manifest

```json
{
  "name": "ImageForge",
  "short_name": "ImageForge",
  "display": "standalone",
  "background_color": "#0A0A0F",
  "theme_color": "#6C63FF",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/512-maskable.png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

---

## Consequences

**Good**:

- Full offline capability after first visit
- Installable as PWA (Add to Home Screen)
- WASM modules served from cache after first load
- Automatic cache invalidation on new deploy

**Bad**:

- Service Worker adds complexity to the build pipeline
- Cache invalidation must be carefully managed on updates
- Service Workers can cause "stale app" issues if versioning is wrong

---

## References

- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [38-offline-first-architecture.md](../38-offline-first-architecture.md)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
