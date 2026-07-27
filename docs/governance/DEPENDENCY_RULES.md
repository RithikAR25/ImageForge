# Dependency Rules

> **Document ID**: governance/DEPENDENCY_RULES
> **Purpose**: Enforced rules governing which packages may import from which. Violations break the build.
> **Last Updated**: 2026-07-27

---

## The Dependency DAG

```
@imageforge/types
      │
      ▼
@imageforge/shared
      │
      ▼
@imageforge/image-core
      │
      ▼
@imageforge/hooks
      │
      ▼
@imageforge/ui
      │
      ▼
apps/web    apps/mobile
```

**No upward imports. No circular imports. No skipping layers.**

---

## Allowed Import Matrix

| Package                  | May import from                                                     |
| ------------------------ | ------------------------------------------------------------------- |
| `@imageforge/types`      | _(nothing)_                                                         |
| `@imageforge/shared`     | `@imageforge/types`                                                 |
| `@imageforge/image-core` | `@imageforge/types`, `@imageforge/shared`                           |
| `@imageforge/hooks`      | `@imageforge/types`, `@imageforge/shared`, `@imageforge/image-core` |
| `@imageforge/ui`         | `@imageforge/types`, `@imageforge/shared`, `@imageforge/hooks`      |
| `apps/web`               | all packages above + web-specific libs                              |
| `apps/mobile`            | all packages above + native-specific libs                           |

---

## Forbidden Import Examples

```typescript
// ❌ shared importing from image-core
// packages/shared/src/utils.ts
import { ImagePipeline } from '@imageforge/image-core'; // FORBIDDEN

// ❌ image-core importing React or React Native
// packages/image-core/src/compress/Compress.ts
import { useState } from 'react'; // FORBIDDEN
import { View } from 'react-native'; // FORBIDDEN

// ❌ hooks importing from ui
// packages/hooks/src/useImageProcessor.ts
import { Button } from '@imageforge/ui'; // FORBIDDEN

// ❌ types importing anything
// packages/types/src/index.ts
import { generateId } from '@imageforge/shared'; // FORBIDDEN

// ❌ Circular: image-core ← shared ← image-core
// (causes build failure in Turborepo)
```

---

## Platform-Specific Imports

Within a package, platform differences are handled via file extensions — not via conditional imports:

```
storage.web.ts        ← IndexedDB / Dexie (web runtime)
storage.native.ts     ← expo-sqlite (mobile runtime)

engine.web.ts         ← WasmWorkerPool
engine.native.ts      ← NativeEngineAdapter (JSI bridge)

DropZone.web.tsx      ← HTML drag & drop
DropZone.native.tsx   ← Expo ImagePicker
```

**Rule**: Never use `Platform.OS` checks in packages. Use file extensions instead. `Platform.OS` checks are allowed only in `apps/web` and `apps/mobile`.

---

## Third-Party Library Placement Rules

| Library                   | Allowed in                                     |
| ------------------------- | ---------------------------------------------- |
| `zustand`                 | `@imageforge/shared` only                      |
| `@tanstack/react-query`   | `@imageforge/hooks` and apps only              |
| `react`, `react-native`   | `@imageforge/ui` and apps only                 |
| `react-native-reanimated` | `@imageforge/ui` and apps only                 |
| `dexie` (IndexedDB)       | `@imageforge/image-core` (web adapter only)    |
| `expo-*`                  | `apps/mobile` only (not shared packages)       |
| `expo-sqlite`             | `@imageforge/image-core` (native adapter only) |
| `jszip`                   | `@imageforge/image-core` only                  |
| `exifr`                   | `@imageforge/image-core` only                  |
| `vite`, `webpack`         | `apps/web` only                                |

---

## ESLint Enforcement

These rules are enforced automatically:

```js
// eslint.config.mjs
import importPlugin from 'eslint-plugin-import';

rules: {
  // Prevent importing React in image-core or shared
  'no-restricted-imports': ['error', {
    paths: [
      { name: 'react',        message: 'React not allowed in this package.' },
      { name: 'react-native', message: 'RN not allowed in this package.' },
    ]
  }]
}
```

Add per-package overrides in each package's `eslint.config.mjs`:

```js
// packages/image-core/eslint.config.mjs
// Restrict React/RN imports entirely in image-core
```

---

## Turborepo Enforces Build Ordering

The dependency DAG is also enforced by Turborepo. `turbo run build` always builds in this order:

```
1. @imageforge/types
2. @imageforge/shared       (waits for types)
3. @imageforge/image-core   (waits for types, shared)
4. @imageforge/hooks        (waits for image-core)
5. @imageforge/ui           (waits for hooks)
6. apps/web, apps/mobile    (wait for ui)
```

Any circular dependency causes the build to fail immediately.

---

## Adding a New Package — Rules

1. Document the new package in `docs/26-package-architecture.md`
2. Add it to the dependency table above
3. Add dependency rules to its `eslint.config.mjs`
4. Add it to the Turborepo `pipeline` in `turbo.json`
5. Update `docs/governance/PUBLIC_API.md` with its public API contract
6. File an ADR if it introduces a new layer or changes the DAG structure

---

_Document Owner: Architecture Team | Enforced by ESLint + Turborepo | 2026-07-27_
