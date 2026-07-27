# Coding Standards

> **Document ID**: 72
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

This document defines the coding standards for the ImageForge project — rules that all contributors must follow to maintain a consistent, high-quality codebase.

---

## TypeScript Standards

### Strict Mode

All packages use `"strict": true` in `tsconfig.json`. This enables:

- `noImplicitAny` — no implicit `any` types
- `strictNullChecks` — null/undefined must be handled explicitly
- `strictFunctionTypes` — function parameter checking
- `noImplicitReturns` — all code paths must return

### Type Annotations

```typescript
// ✅ Good: explicit return type on public functions
export function compressImage(
  image: ImageFile,
  config: CompressConfig
): Promise<ProcessingResult> { ... }

// ❌ Bad: no return type
export function compressImage(image, config) { ... }

// ✅ Good: use unknown instead of any in catch
} catch (err: unknown) {
  if (err instanceof Error) console.error(err.message);
}

// ❌ Bad: any in catch
} catch (err: any) {
  console.error(err.message);
}
```

### Interfaces vs Types

```typescript
// ✅ Interfaces for object shapes (extensible, better error messages)
interface ImageFile { id: string; ... }

// ✅ Types for unions and primitives
type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
type ImageId = string; // branded type

// ❌ Bad: type alias for object shape
type ImageFile = { id: string; ... };
```

### Readonly

Public API data objects must use `readonly`:

```typescript
// ✅ Immutable domain objects
interface ImageFile {
  readonly id: string;
  readonly buffer: ArrayBuffer;
  readonly width: number;
}
```

---

## React / React Native Standards

### Functional Components Only

```typescript
// ✅ Good: function declaration
function Button({ children, onPress }: ButtonProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

// ❌ Bad: class component
class Button extends React.Component<ButtonProps> { ... }
```

### Hooks Rules

- Never call hooks conditionally
- Custom hooks must start with `use`
- Custom hooks must be in `packages/hooks/src/`

### No Inline Styles

```typescript
// ✅ Good: StyleSheet.create
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default }
});

// ❌ Bad: inline style
<View style={{ flex: 1, backgroundColor: '#FFF' }} />
```

### No Raw Color Values

```typescript
// ✅ Good: design token
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background.default }} />

// ❌ Bad: raw hex
<View style={{ backgroundColor: '#FFFFFF' }} />
```

---

## File Organization

### Barrel Exports

Every directory with multiple files exports through an `index.ts`:

```typescript
// packages/image-core/src/compress/index.ts
export { createCompressOperation } from './Compress';
export type { CompressConfig } from './types';
```

### File Naming Conventions

| Item            | Convention       | Example                |
| --------------- | ---------------- | ---------------------- |
| React component | PascalCase.tsx   | `Button.tsx`           |
| Hook            | camelCase.ts     | `useImageProcessor.ts` |
| Utility         | camelCase.ts     | `formatFileSize.ts`    |
| Type/Interface  | PascalCase.ts    | `ProcessingError.ts`   |
| Test            | Same + `.test`   | `Button.test.tsx`      |
| Platform web    | Same + `.web`    | `storage.web.ts`       |
| Platform native | Same + `.native` | `storage.native.ts`    |
| Constants       | SCREAMING_SNAKE  | `COMPRESS_PRESETS.ts`  |

---

## Comments and Documentation

### JSDoc on Public APIs

Every exported function/class must have JSDoc:

```typescript
/**
 * Creates a compress operation for the processing pipeline.
 *
 * @param config - Compression configuration
 * @returns A ProcessingOperation that can be added to a pipeline
 * @throws {ProcessingError} INVALID_INPUT if quality is out of range
 *
 * @example
 * const op = createCompressOperation({ codec: 'webp', quality: 80 });
 * const pipeline = new ImagePipeline(engine, [op]);
 */
export function createCompressOperation(config: CompressConfig): ProcessingOperation { ... }
```

### Comment Philosophy

```typescript
// ✅ Comment WHY, not WHAT
// mozjpeg consistently outperforms libjpeg by 20-30% at equal quality
const encoder = mozjpeg;

// ❌ Bad: explaining the obvious
// Set the encoder to mozjpeg
const encoder = mozjpeg;
```

---

## Error Handling Standards

```typescript
// ✅ Never swallow errors silently
} catch (err) {
  logger.error('Compress failed', err, { fileSize: image.fileSize });
  throw new ProcessingError('ENCODE_FAILED', 'Compression failed', err);
}

// ❌ Never empty catch
} catch {
  // silently ignored
}
```

See [39-error-handling-strategy.md](../39-error-handling-strategy.md) for the full strategy.

---

## Import Order (enforced by ESLint)

```typescript
// 1. Node built-ins
import { createHash } from 'crypto';

// 2. External packages
import { create } from 'zustand';
import React, { useState } from 'react';

// 3. Internal @imageforge packages
import { ImageFile } from '@imageforge/types';
import { createLogger } from '@imageforge/shared';

// 4. Relative imports
import { CompressConfig } from './types';
import { validateConfig } from '../utils/validation';
```

---

## Related Documents

| Document                                                          | Relationship              |
| ----------------------------------------------------------------- | ------------------------- |
| [73-typescript-guidelines.md](./73-typescript-guidelines.md)      | Extended TypeScript rules |
| [39-error-handling-strategy.md](../39-error-handling-strategy.md) | Error handling            |
| [40-logging-strategy.md](../40-logging-strategy.md)               | Logging standards         |

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
