# Package Boundaries

> **Document ID**: 71
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines what each package in the ImageForge monorepo may and may not depend on — enforcing clean separation of concerns and preventing coupling.

---

## Dependency Rules Table

| Package                  | May Import From                 | Must NOT Import From                            |
| ------------------------ | ------------------------------- | ----------------------------------------------- |
| `@imageforge/types`      | Nothing                         | Everything                                      |
| `@imageforge/shared`     | `types`                         | `image-core`, `hooks`, `ui`, apps               |
| `@imageforge/image-core` | `types`, `shared`               | `hooks`, `ui`, apps, React, React Native        |
| `@imageforge/hooks`      | `types`, `shared`, `image-core` | `ui`, apps                                      |
| `@imageforge/ui`         | `types`, `shared`, `hooks`      | `image-core` (direct, only through hooks), apps |
| `apps/web`               | All packages                    | Nothing (leaf)                                  |
| `apps/mobile`            | All packages                    | Nothing (leaf)                                  |

---

## Detailed Rules Per Package

### `@imageforge/types`

```
✅ Zero dependencies (pure TypeScript types — no runtime code)
✅ No imports of any kind
✅ All interfaces must be readonly where applicable
✅ Types exported from a single index.ts
❌ No class implementations
❌ No utility functions
❌ No constants (use @imageforge/shared/constants)
```

### `@imageforge/shared`

```
✅ Utility functions, constants, Zustand stores
✅ May use: zustand, immer, zod, @tanstack/react-query, date-fns
✅ May import from: @imageforge/types
❌ No React Native imports (Platform, StyleSheet, etc.)
❌ No browser APIs (window, document, localStorage)
❌ No Node.js APIs (fs, path, crypto)
→ Use adapter pattern for platform-specific functionality
```

### `@imageforge/image-core`

```
✅ Processing engine, adapters, operation factories
✅ May use: dexie (web), expo-sqlite (mobile), via adapter pattern
✅ May import from: @imageforge/types, @imageforge/shared
❌ No React or React Native imports
❌ No JSX / components
❌ No Zustand stores (owns its own stateless logic; stores live in shared)
```

### `@imageforge/hooks`

```
✅ React hooks only (files must start with "use")
✅ Connects image-core to React state/TanStack Query
✅ May import from: @imageforge/types, @imageforge/shared, @imageforge/image-core
❌ No UI components
❌ No React Native View/Text/etc.
❌ No business logic (delegate to image-core)
```

### `@imageforge/ui`

```
✅ All React Native components and screens
✅ May import from: @imageforge/types, @imageforge/shared, @imageforge/hooks
❌ No direct imports from @imageforge/image-core
   (must go through @imageforge/hooks)
❌ No raw hex colors or spacing values
   (must use design tokens from theme)
```

---

## ESLint Enforcement

Boundaries are enforced by `eslint-plugin-boundaries`:

```json
// .eslintrc.js
{
  "plugins": ["boundaries"],
  "rules": {
    "boundaries/element-types": [
      "error",
      {
        "default": "disallow",
        "rules": [
          { "from": "types", "allow": [] },
          { "from": "shared", "allow": ["types"] },
          { "from": "image-core", "allow": ["types", "shared"] },
          { "from": "hooks", "allow": ["types", "shared", "image-core"] },
          { "from": "ui", "allow": ["types", "shared", "hooks"] },
          { "from": "app", "allow": ["types", "shared", "image-core", "hooks", "ui"] }
        ]
      }
    ]
  }
}
```

Any violation causes a CI lint failure and blocks the PR merge.

---

## Related Documents

| Document                                                     | Relationship             |
| ------------------------------------------------------------ | ------------------------ |
| [25-monorepo-architecture.md](./25-monorepo-architecture.md) | Monorepo structure       |
| [41-dependency-graph.md](./41-dependency-graph.md)           | Dependency visualization |
| [72-coding-standards.md](./72-coding-standards.md)           | Coding rules             |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
