# TypeScript Guidelines

> **Document ID**: 73
> **Phase**: 5 — Technical Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Engineering Team

---

## Purpose

Extended TypeScript guidelines for the ImageForge project — patterns, best practices, and advanced TypeScript usage.

---

## Strict Configuration

All packages use the strictest TypeScript configuration:

```json
// tsconfig.base.json (shared across all packages)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "skipLibCheck": false,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

---

## Branded Types

Use branded types for IDs and domain primitives to prevent mix-ups:

```typescript
// packages/types/src/brands.ts

declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B };

export type ImageId = Brand<string, 'ImageId'>;
export type JobId = Brand<string, 'JobId'>;
export type PluginId = Brand<string, 'PluginId'>;

// Usage
function getImage(id: ImageId): ImageFile { ... }

// Compile error if you mix up IDs:
const jobId: JobId = 'job-123' as JobId;
getImage(jobId); // ❌ Error: Argument of type 'JobId' is not assignable to 'ImageId'
```

---

## Discriminated Unions

Always use discriminated unions for operation types:

```typescript
// ✅ Discriminated union — exhaustive type-checking
type ProcessingOperation =
  | { type: 'compress'; config: CompressConfig }
  | { type: 'resize'; config: ResizeConfig }
  | { type: 'crop'; config: CropConfig }
  | { type: 'rotate'; config: RotateConfig };

function applyOperation(op: ProcessingOperation): void {
  switch (op.type) {
    case 'compress':
      handleCompress(op.config);
      break;
    case 'resize':
      handleResize(op.config);
      break;
    case 'crop':
      handleCrop(op.config);
      break;
    case 'rotate':
      handleRotate(op.config);
      break;
    default:
      // TypeScript guarantees this is unreachable
      const _exhaustiveCheck: never = op;
  }
}
```

---

## Result Type Pattern

For operations that can fail predictably, use a Result type instead of throwing:

```typescript
type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E };

// Usage
async function validateFile(file: File): Promise<Result<ValidatedFile, ImportError>> {
  const magicBytes = await readMagicBytes(file);
  if (!isSupportedFormat(magicBytes)) {
    return { success: false, error: new ImportError('UNSUPPORTED_FORMAT', file.name) };
  }
  return { success: true, value: { file, format: detectFormat(magicBytes) } };
}

// Consumer
const result = await validateFile(file);
if (!result.success) {
  showError(result.error.message);
  return;
}
processFile(result.value);
```

---

## Conditional Types and Utilities

```typescript
// Narrow down platform-specific types
type PlatformValue<Web, Native> = typeof Platform.OS extends 'web' ? Web : Native;

// Extract config type from operation type
type OperationConfig<T extends ProcessingOperation['type']> = Extract<
  ProcessingOperation,
  { type: T }
>['config'];

// Usage
type CompressConfigExtracted = OperationConfig<'compress'>; // = CompressConfig
```

---

## Avoid These Patterns

```typescript
// ❌ Type assertion without validation
const image = data as ImageFile;

// ✅ Use type guard with validation
function isImageFile(data: unknown): data is ImageFile {
  return typeof data === 'object' && data !== null && 'id' in data && 'buffer' in data;
}

// ❌ Optional chaining on required fields
const id = image?.id; // id should never be undefined on ImageFile

// ✅ Let TypeScript enforce required fields
const id = image.id; // if image.id is required, this is always safe

// ❌ enum (use const objects instead — better tree-shaking)
enum JobStatus {
  Pending,
  Processing,
  Completed,
}

// ✅ const assertion
const JobStatus = {
  Pending: 'pending',
  Processing: 'processing',
  Completed: 'completed',
} as const;
type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
```

---

_Document Owner: Engineering Team | Approved: 2026-07-27_
