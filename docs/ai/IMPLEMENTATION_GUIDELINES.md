# AI Development Guidelines

> **Document ID**: ai/IMPLEMENTATION_GUIDELINES
> **Phase**: AI Development
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document provides guidelines for AI coding assistants and LLMs working on the ImageForge codebase. Follow these rules to produce consistent, mergeable code.

---

## Project Context

- **Type**: Open-source, cross-platform image processing app
- **Stack**: React Native + Web, TypeScript, Expo, Turborepo
- **Core constraint**: All image processing is client-side. No images ever leave the device.
- **Architecture docs**: See [docs/20-system-architecture-document.md](../20-system-architecture-document.md)

---

## Code Generation Rules

### 1. Always Use Design Tokens

```typescript
// ✅ Correct
const { colors } = useTheme();
backgroundColor: colors.background.default;

// ❌ Wrong
backgroundColor: '#FFFFFF';
```

### 2. Always Handle Errors Properly

```typescript
// ✅ Correct
} catch (err: unknown) {
  logger.error('Operation failed', err);
  throw new ProcessingError('ENCODE_FAILED', 'Friendly message', err);
}

// ❌ Wrong: silent catch
} catch { }
```

### 3. Always Check AbortSignal

```typescript
// ✅ Correct: every async operation checks abort
async function processImage(
  image: ImageFile,
  config: Config,
  signal?: AbortSignal,
): Promise<ImageFile> {
  signal?.throwIfAborted();
  // ... do work ...
  signal?.throwIfAborted(); // Check again after async ops
}
```

### 4. Never Import React Native in Shared Packages

```typescript
// In packages/image-core, packages/shared, packages/types:
// ❌ Wrong
import { Platform } from 'react-native';

// ✅ Correct: use adapter pattern
import { platformAdapter } from './adapters';
```

### 5. Exports Must Go Through index.ts

```typescript
// Every public API exports through the package's src/index.ts
// Internal modules are NOT exported directly
```

### 6. Use Readonly on Domain Objects

```typescript
// ✅ All domain model properties are readonly
interface ImageFile {
  readonly id: string;
  readonly buffer: ArrayBuffer;
}
```

---

## File Placement Rules

| New code                 | Location                               |
| ------------------------ | -------------------------------------- |
| New processing operation | `packages/image-core/src/[operation]/` |
| New TypeScript types     | `packages/types/src/`                  |
| New UI component         | `packages/ui/src/components/`          |
| New screen               | `packages/ui/src/screens/`             |
| New React hook           | `packages/hooks/src/`                  |
| New utility function     | `packages/shared/src/utils/`           |
| New Zustand store        | `packages/shared/src/stores/`          |
| Web-only feature         | `apps/web/src/web-only/`               |
| Mobile-only feature      | `apps/mobile/src/mobile-only/`         |

---

## Testing Requirements

When generating any function or class:

- Generate the corresponding unit test file at `[file].test.ts`
- Cover: happy path, error cases, edge cases, abort handling
- Use `MockProcessingEngine` for processing tests
- Use `loadTestImage()` for image fixtures

---

## Documentation Requirements

When generating a new module:

- Add JSDoc to all exported functions/classes
- Include `@example` showing common usage
- Include `@throws` documenting all error types
- Add the module to the relevant feature spec in `docs/features/`

---

## What NOT to Generate

- ❌ Network calls for image data
- ❌ User analytics without opt-in gate
- ❌ `localStorage` usage outside settings store
- ❌ Direct `window`/`document` access in shared packages
- ❌ `console.log` (use logger instead)
- ❌ Any `any` type without a `// eslint-disable` comment + justification

---

_Document Owner: Architecture Team | Review Cycle: Per-major-version | Approved: 2026-07-27_
