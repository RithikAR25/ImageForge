# ADR-0010: Platform-Specific Storage Strategy

**Date**: 2026-07-27  
**Status**: Accepted  
**Deciders**: Architecture Team

---

## Context

ImageForge needs persistent storage for: queue state, processing history, project metadata, settings, and thumbnails. The storage solution must work on all three platforms but each platform has different APIs and constraints.

---

## Decision Drivers

- Queue state must survive page refresh / app restart
- Thumbnails (binary blobs) must be stored efficiently
- Settings must be lightweight and synchronous where possible
- Large image data should NOT be stored long-term (privacy + storage limits)
- Same TypeScript interface across platforms

---

## Decision Outcome

**Platform-specific storage behind a unified interface:**

| Platform   | Structured Data          | Binary Blobs       | Settings                        |
| ---------- | ------------------------ | ------------------ | ------------------------------- |
| **Web**    | IndexedDB (via Dexie.js) | IndexedDB (Blob)   | localStorage                    |
| **Mobile** | Expo SQLite              | File system (temp) | Expo SecureStore / AsyncStorage |

A unified `StorageAdapter` interface is implemented per platform behind `.web.ts` / `.native.ts` files.

---

## Rationale

### Web: IndexedDB

IndexedDB is the only browser API that supports:

- Large binary data (Blob/ArrayBuffer) storage
- Transactional operations
- Structured query support
- Storage quota > 50MB (localStorage is limited to 5–10MB)

Dexie.js is used as the IndexedDB wrapper for its clean TypeScript API, typed schemas, and migration support.

### Mobile: SQLite

SQLite via `expo-sqlite` provides:

- Full SQL query capability for queue and project metadata
- Works offline (embedded database)
- Well-tested in Expo ecosystem
- Binary data stored as file paths (not in DB)

### Settings: localStorage / AsyncStorage / SecureStore

Settings are small key-value pairs (<100KB total). localStorage (Web) and AsyncStorage (mobile) are synchronous-enough and simple. Sensitive settings use SecureStore on mobile.

---

## Consequences

**Good**:

- Each platform uses its optimal storage technology
- Unified interface means business logic doesn't know about storage implementation
- Dexie.js provides schema migrations for IndexedDB

**Bad**:

- Two separate storage implementations to maintain
- IndexedDB quota management required (browser limits vary 200MB–2GB)
- SQLite migration scripts needed for mobile

---

## References

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Dexie.js](https://dexie.org/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [33-storage-architecture.md](../33-storage-architecture.md)
