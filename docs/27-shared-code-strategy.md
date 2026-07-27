# Shared Code Strategy

> **Document ID**: 27
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines how code is shared between Web and Mobile platforms in the ImageForge monorepo, including the platform abstraction layer, file naming conventions, and boundaries between shared and platform-specific code.

---

## Sharing Target

| Code Category               | Target Sharing | Mechanism                |
| --------------------------- | -------------- | ------------------------ |
| Business logic (processing) | 100%           | Pure TypeScript packages |
| TypeScript types            | 100%           | `@imageforge/types`      |
| State management            | 100%           | Zustand stores           |
| UI components               | ~80%           | React Native + RNW       |
| Navigation                  | ~90%           | Expo Router              |
| Utilities                   | 100%           | `@imageforge/shared`     |
| Storage                     | 100% interface | Adapter pattern          |
| Processing engine           | 100% interface | Adapter pattern          |
| Import/Export               | ~70%           | Platform extensions      |

---

## Platform Extension Files

Metro (mobile bundler) and Vite (web bundler) resolve platform-specific files automatically using this priority order:

**Mobile** (Metro): `Component.ios.tsx` → `Component.android.tsx` → `Component.native.tsx` → `Component.tsx`

**Web** (Vite with alias): `Component.web.tsx` → `Component.tsx`

### Convention

```
# Fully shared (no platform logic)
packages/image-core/src/compress/index.ts

# Web-specific implementation
packages/image-core/src/engines/wasm-engine.web.ts

# Mobile implementation
packages/image-core/src/engines/native-engine.native.ts

# iOS-only
apps/mobile/src/components/HapticFeedback.ios.ts

# Android-only
apps/mobile/src/components/HapticFeedback.android.ts
```

---

## Platform Abstraction Layer

### Storage Adapter

```typescript
// Interface (shared)
interface StorageAdapter { ... }

// Web implementation
// packages/image-core/src/storage/storage.web.ts
export const storageAdapter: StorageAdapter = new IndexedDbStorageAdapter();

// Mobile implementation
// packages/image-core/src/storage/storage.native.ts
export const storageAdapter: StorageAdapter = new SqliteStorageAdapter();
```

Both files export the same name (`storageAdapter`) — the bundler picks the right one based on platform.

### Processing Engine Adapter

```typescript
// Interface (shared)
interface ProcessingEngine { ... }

// Web: WASM engine
// packages/image-core/src/engines/engine.web.ts
export const processingEngine: ProcessingEngine = new WasmProcessingEngine();

// Mobile: Native engine
// packages/image-core/src/engines/engine.native.ts
export const processingEngine: ProcessingEngine = new NativeProcessingEngine();
```

---

## Rules for Shared Code

**packages/image-core, packages/shared, packages/types** must:

- ✅ Be pure TypeScript/JavaScript
- ✅ Import only from other `@imageforge/*` packages or standard library
- ✅ Have no React Native or React imports
- ✅ Have no browser-specific APIs (`window`, `document`, `navigator`)
- ✅ Have no Node.js-specific APIs (`fs`, `path`, `process`)
- ✅ Platform-specific code only via the adapter pattern

**packages/ui** may:

- ✅ Import React and React Native (via RNW on web)
- ✅ Use `StyleSheet.create`
- ✅ Use `Platform.select` for minor differences
- ❌ Must not contain platform-specific native module calls

---

## Boundary Violations

The ESLint rule `no-platform-import-in-shared` (custom) flags violations:

```
// packages/image-core/src/compress/Compress.ts
import { FileSystem } from 'expo-file-system'; // ❌ ESLint error
```

Violations fail CI.

---

## Related Documents

| Document                                                     | Relationship             |
| ------------------------------------------------------------ | ------------------------ |
| [28-platform-abstraction.md](./28-platform-abstraction.md)   | Platform adapter details |
| [25-monorepo-architecture.md](./25-monorepo-architecture.md) | Package structure        |
| [ADR-0002](./adr/ADR-0002-react-native-web.md)               | RNW decision             |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
