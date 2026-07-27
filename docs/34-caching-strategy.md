# Caching Strategy

> **Document ID**: 34
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the multi-layer caching strategy for ImageForge — covering WASM module caching, thumbnail caching, Service Worker asset caching, and TanStack Query result caching.

---

## Cache Layers

```
Layer 1: Service Worker Cache (browser level)
  → Static assets: HTML, JS, CSS, WASM modules, fonts
  → TTL: Immutable (content-hash URLs) or 30 days (WASM)

Layer 2: IndexedDB / SQLite (application level)
  → Thumbnails (300×300 previews of imported images)
  → Queue state (batch jobs and their status)
  → User settings

Layer 3: TanStack Query Cache (in-memory)
  → Processing operation results (short-lived, in-memory only)
  → NOT persisted (large ArrayBuffers must not go to localStorage)

Layer 4: React Ref / Module-level Map (component level)
  → Blob URLs for processed image previews
  → Revoked on component unmount
```

---

## Service Worker Cache Strategy (Workbox)

| Resource Type           | Strategy               | Cache Name             | TTL       |
| ----------------------- | ---------------------- | ---------------------- | --------- |
| App shell (HTML/JS/CSS) | `CacheFirst`           | `app-shell-v{version}` | Immutable |
| WASM modules            | `CacheFirst`           | `wasm-cache-v1`        | 30 days   |
| Google Fonts            | `StaleWhileRevalidate` | `fonts-cache`          | 1 year    |
| Images (user-imported)  | Not cached             | —                      | N/A       |
| API responses (future)  | `NetworkFirst`         | `api-cache`            | 1 hour    |

### Cache Versioning

On new app deploy:

1. Vite creates new content-hashed bundles (`app.a1b2c3.js`)
2. Workbox's `precacheAndRoute` registers the new manifest
3. Service Worker installs new assets in a new `app-shell-v{BUILD_ID}` cache
4. Old cache is purged by `cleanupOutdatedCaches()`

---

## Thumbnail Cache

Thumbnails are stored in IndexedDB (`thumbnails` table) with LRU eviction:

```typescript
interface ThumbnailCacheManager {
  MAX_ENTRIES = 500;
  MAX_AGE_DAYS = 7;

  async get(imageId: string): Promise<Blob | null> {
    const entry = await db.thumbnails.get(imageId);
    if (!entry) return null;
    // Update last-accessed time (for LRU)
    await db.thumbnails.update(imageId, { lastAccessed: Date.now() });
    return entry.blob;
  }

  async set(imageId: string, blob: Blob): Promise<void> {
    await db.thumbnails.put({ imageId, blob, createdAt: Date.now(), lastAccessed: Date.now() });
    await this.evictIfNeeded();
  }

  private async evictIfNeeded(): Promise<void> {
    const count = await db.thumbnails.count();
    if (count > this.MAX_ENTRIES) {
      // Evict oldest-accessed entries
      const toEvict = await db.thumbnails
        .orderBy('lastAccessed')
        .limit(count - this.MAX_ENTRIES)
        .primaryKeys();
      await db.thumbnails.bulkDelete(toEvict);
    }
  }
}
```

---

## TanStack Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — data considered fresh
      gcTime: 10 * 60 * 1000, // 10 min — cached in memory
      retry: 2, // Retry failed queries twice
      refetchOnWindowFocus: false, // Don't refetch on focus (image processing)
    },
    mutations: {
      retry: 0, // No auto-retry for mutations
    },
  },
});
```

Processing results are kept in memory for 10 minutes. After that, TanStack Query garbage-collects them and the Blob URL is revoked:

```typescript
// Revoke Blob URLs on mutation result cleanup
const mutation = useMutation({
  mutationFn: processImage,
  onSuccess: (result) => {
    const blobUrl = URL.createObjectURL(
      new Blob([result.output.buffer], { type: result.output.mimeType }),
    );
    // Store URL in a React ref, revoke on unmount
    previewUrlRef.current = blobUrl;
  },
});

useEffect(() => {
  return () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  };
}, []);
```

---

## Mobile Caching (React Native)

| Resource        | Cache                        | TTL          |
| --------------- | ---------------------------- | ------------ |
| Thumbnails      | `expo-file-system` cache dir | 7 days       |
| Settings        | AsyncStorage                 | Persistent   |
| Secure settings | expo-secure-store            | Persistent   |
| Processed files | `cacheDirectory`             | Until export |

```typescript
// Thumbnail path convention
const thumbnailPath = `${FileSystem.cacheDirectory}thumbnails/${imageId}.jpg`;

// Auto-clear cache on startup if > 100MB
const cacheInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);
if (cacheInfo.size > 100 * 1024 * 1024) {
  await clearOldThumbnails();
}
```

---

## Related Documents

| Document                                                               | Relationship      |
| ---------------------------------------------------------------------- | ----------------- |
| [33-storage-architecture.md](./33-storage-architecture.md)             | IndexedDB/SQLite  |
| [38-offline-first-architecture.md](./38-offline-first-architecture.md) | Service Worker    |
| [36-performance-strategy.md](./36-performance-strategy.md)             | Cache performance |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
