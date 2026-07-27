# AGENT_CONTEXT.md

> **Document ID**: governance/AGENT_CONTEXT
> **Purpose**: Primary context document for any AI agent beginning work on ImageForge.
> **Rule**: Every AI coding session MUST read this file first.
> **Last Updated**: 2026-07-27

---

## What Is This Project?

**ImageForge** is an open-source, privacy-first, cross-platform image processing application.

- **Stack**: React Native + React Native Web + TypeScript + Expo + Turborepo + Vite
- **Platforms**: Web (primary), iOS, Android
- **Processing**: 100% on-device. Images never leave the user's device. Ever.
- **License**: MIT

---

## Current Implementation Status

> Before writing any code, read [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) to know what has been built and what module is currently active.

At design freeze (2026-07-27):

- **Documentation**: Complete ✅ (164 files)
- **Implementation**: Not started ⏳
- **Current active module**: Module 0 — Bootstrap

---

## Package Dependency Rules

This is a strict DAG. Violations cause circular dependency build failures.

```
@imageforge/types          ← NO dependencies (zero-runtime)
    ↓
@imageforge/shared         ← depends on: types only
    ↓
@imageforge/image-core     ← depends on: types, shared only
    ↓
@imageforge/hooks          ← depends on: types, shared, image-core
    ↓
@imageforge/ui             ← depends on: types, shared, hooks
    ↓
apps/web, apps/mobile      ← depends on: all packages
```

**Forbidden imports** (enforced by ESLint):

- `image-core` importing from `react` or `react-native` — ❌
- `shared` importing from `image-core` — ❌
- `types` importing from anything — ❌
- `hooks` importing from `ui` — ❌

---

## Key Architectural Invariants

These are **non-negotiable**. Never violate them:

| #    | Invariant                                                                       |
| ---- | ------------------------------------------------------------------------------- |
| I-01 | Images never leave the device. No network requests for image data.              |
| I-02 | All image processing happens off the main thread (Web Worker / native thread)   |
| I-03 | No `any` type — use `unknown` with type guards                                  |
| I-04 | All exported functions have JSDoc with `@example` and `@throws`                 |
| I-05 | Every async operation accepts and honours `AbortSignal`                         |
| I-06 | EXIF/metadata is never logged or persisted beyond session                       |
| I-07 | Platform differences resolved by `.web.ts` / `.native.ts` file extensions       |
| I-08 | No inline styles — use `StyleSheet.create()` and design tokens via `useTheme()` |
| I-09 | Error types: `ProcessingError                                                   | ImportError | StorageError`— never raw`Error` |
| I-10 | `console.log` is banned — use `createLogger('scope')` from `@imageforge/shared` |

---

## Package Public APIs

> See [`PUBLIC_API.md`](./PUBLIC_API.md) for the complete, pre-defined public API contract for every package.

Quick reference:

```typescript
// @imageforge/types — zero runtime
export type { ImageFile, ProcessingOperation, ProcessingResult, ... }

// @imageforge/shared
export { createLogger, useImageStore, useSettingsStore, useHistoryStore, ... }

// @imageforge/image-core
export { createCompressOperation, createResizeOperation, ImagePipeline, WasmWorkerPool, ... }

// @imageforge/hooks
export { useImageProcessor, useBatchQueue, useHistory, useSettings, ... }

// @imageforge/ui
export { CompressScreen, ResizeScreen, BatchScreen, Button, Slider, ... }
```

---

## Design System Quick Reference

```typescript
// Always use the theme hook — never hardcode
const { colors, spacing, typography } = useTheme();

// Color tokens
colors.brand.primary        // Main accent color
colors.background.default   // Page background
colors.background.surface   // Card/panel background
colors.text.primary         // Primary text
colors.text.secondary       // Secondary/muted text
colors.status.error         // Error state
colors.status.success       // Success state

// Spacing (8pt grid)
spacing[1]  = 8px
spacing[2]  = 16px
spacing[3]  = 24px
spacing[4]  = 32px

// Typography
typography.heading1         // H1 styles
typography.body             // Body text
typography.caption          // Small/caption text
```

---

## Processing Pipeline Pattern

```typescript
// Creating an operation (stateless, validated)
const op = createCompressOperation({ codec: 'webp', quality: 82 });

// Running through the pipeline
const pipeline = new ImagePipeline(engine, [resizeOp, compressOp]);
const result = await pipeline.execute(image, signal);

// The engine dispatches to WASM worker (web) or native bridge (mobile)
// WasmWorkerPool handles parallelism and cancellation automatically
```

---

## Error Handling Pattern

```typescript
// ✅ Correct
try {
  const result = await engine.applyOperation(image, op, signal);
} catch (err: unknown) {
  if (err instanceof ProcessingError) {
    logger.error('Processing failed', { code: err.code, message: err.message });
    throw err; // Re-throw typed errors
  }
  throw new ProcessingError('UNKNOWN', 'Unexpected error', err);
}

// ❌ Wrong
try { ... } catch (e) { console.error(e); } // silent swallow
```

---

## Testing Requirements for Every Function

Every exported function needs a test file with:

1. **Happy path** — valid input, expected output
2. **Validation failure** — invalid config throws `ProcessingError`
3. **Abort signal** — cancelled operation resolves with `ABORTED` error
4. **Edge case** — empty input, max size, corrupt data

---

## Where to Find Things

| I need to know...          | Read this                                  |
| -------------------------- | ------------------------------------------ |
| Overall architecture       | `docs/22-high-level-design.md`             |
| Processing pipeline design | `docs/29-image-processing-pipeline.md`     |
| Package dependency rules   | `docs/governance/DEPENDENCY_RULES.md`      |
| Public API contracts       | `docs/governance/PUBLIC_API.md`            |
| Feature spec for X         | `docs/features/[feature-name].md`          |
| Error handling patterns    | `docs/39-error-handling-strategy.md`       |
| State management patterns  | `docs/35-state-management.md`              |
| What's been built          | `docs/governance/IMPLEMENTATION_STATUS.md` |
| Module template            | `docs/ai/MODULE_TEMPLATE.md`               |
| Feature template           | `docs/ai/FEATURE_TEMPLATE.md`              |

---

_Document Owner: Architecture Team | Read this first. Always. | 2026-07-27_
