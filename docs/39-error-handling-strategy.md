# Error Handling Strategy

> **Document ID**: 39
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines a centralized, consistent, production-grade error handling strategy for all layers of the ImageForge application. Inconsistent error handling is a major source of user-facing bugs and poor UX.

---

## Error Handling Principles

1. **Fail fast**: Validate at the earliest possible point
2. **Recover gracefully**: Every error has a recovery path
3. **User-friendly messages**: No raw error objects or stack traces to users
4. **Developer diagnostics**: Full error context available in development and optional error reporting
5. **Never swallow errors silently**: Every catch block must log or handle — never an empty catch
6. **Typed errors**: All errors have TypeScript types, never untyped `unknown`

---

## Error Type Hierarchy

```typescript
// packages/types/src/errors.ts

abstract class ImageForgeError extends Error {
  abstract readonly code: string;
  readonly timestamp: number;

  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = Date.now();
  }
}

// Processing errors
class ProcessingError extends ImageForgeError {
  readonly code: ProcessingErrorCode;

  constructor(code: ProcessingErrorCode, message: string, cause?: unknown) {
    super(message, cause);
    this.code = code;
  }
}

type ProcessingErrorCode =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FORMAT'
  | 'WASM_NOT_INITIALIZED'
  | 'WASM_OUT_OF_MEMORY'
  | 'ENCODE_FAILED'
  | 'DECODE_FAILED'
  | 'ABORTED'
  | 'TIMEOUT';

// Import errors
class ImportError extends ImageForgeError {
  readonly code: ImportErrorCode;
}

type ImportErrorCode =
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'READ_FAILED'
  | 'DUPLICATE_DETECTED'
  | 'PERMISSION_DENIED';

// Storage errors
class StorageError extends ImageForgeError {
  readonly code: StorageErrorCode;
}

type StorageErrorCode = 'QUOTA_EXCEEDED' | 'READ_FAILED' | 'WRITE_FAILED' | 'NOT_FOUND';

// Export errors
class ExportError extends ImageForgeError {
  readonly code: ExportErrorCode;
}

type ExportErrorCode = 'DOWNLOAD_FAILED' | 'ZIP_FAILED' | 'PERMISSION_DENIED';
```

---

## Error Handling by Layer

### Processing Engine Layer

```typescript
// All WASM operations wrap errors in typed ProcessingError
async function runWasmOperation(buffer: ArrayBuffer, config: CompressConfig): Promise<ArrayBuffer> {
  try {
    return await libvips.compress(buffer, config);
  } catch (err) {
    if (err instanceof WebAssembly.RuntimeError) {
      throw new ProcessingError(
        'WASM_OUT_OF_MEMORY',
        'Not enough memory to process this image. Try a smaller file.',
        err,
      );
    }
    throw new ProcessingError(
      'ENCODE_FAILED',
      'Image encoding failed. The file may be corrupted.',
      err,
    );
  }
}
```

### Business Logic Layer (image-core)

```typescript
// Pipeline execution catches and re-wraps
async execute(input: ImageFile, signal?: AbortSignal): Promise<ProcessingResult> {
  try {
    // ... pipeline execution
  } catch (err) {
    if (err instanceof ProcessingError) throw err;  // Re-throw typed errors
    if (signal?.aborted) throw new ProcessingError('ABORTED', 'Cancelled');
    // Unexpected errors wrapped
    throw new ProcessingError('ENCODE_FAILED',
      'An unexpected error occurred during processing.', err);
  }
}
```

### React Hook Layer

```typescript
// useMutation onError translates to user-friendly messages
const compressMutation = useMutation({
  mutationFn: processImage,
  onError: (error) => {
    const message = formatUserMessage(error);
    useUIStore.getState().addToast({
      type: 'error',
      title: 'Processing Failed',
      message,
      action: { label: 'Retry', onClick: () => compressMutation.mutate(params) },
    });
  },
});

function formatUserMessage(error: unknown): string {
  if (error instanceof ProcessingError) {
    return USER_MESSAGES[error.code] ?? 'An error occurred during processing.';
  }
  return 'An unexpected error occurred. Please try again.';
}

const USER_MESSAGES: Record<ProcessingErrorCode, string> = {
  INVALID_INPUT: 'The file appears to be corrupted or invalid.',
  UNSUPPORTED_FORMAT: 'This file format is not supported.',
  WASM_NOT_INITIALIZED: 'The processing engine is still loading. Please wait and try again.',
  WASM_OUT_OF_MEMORY: 'Not enough memory to process this image. Try closing other browser tabs.',
  ENCODE_FAILED: 'Failed to encode the image. The file may be corrupted.',
  DECODE_FAILED: 'Failed to read the image. The file may be corrupted.',
  ABORTED: 'Operation cancelled.',
  TIMEOUT: 'Processing timed out. Try with a smaller image.',
};
```

### UI Layer (Component)

```typescript
// Errors displayed as toasts (non-blocking)
// For batch errors: per-item error state in queue

// Never use try-catch in render functions
// Never swallow errors without logging

// Use React Error Boundary for unexpected errors
class ImageForgeErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to error reporting (if opted in)
    errorReporter.captureException(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## Error Reporting (Opt-In Only)

If the user has opted in to analytics/error reporting:

```typescript
// Optional Sentry integration
import * as Sentry from '@sentry/react-native';

// Only configured if user opted in AND environment is production
if (settings.analyticsOptIn && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    beforeSend: (event) => {
      // Strip any potential PII
      delete event.user;
      delete event.request?.data;
      return event;
    },
  });
}
```

No error reports in development. No error reports without explicit opt-in. No PII in error reports.

---

## Anti-Patterns

❌ **Never** do this:

```typescript
try {
  await processImage(file);
} catch (e) {
  // silent error swallow
}
```

❌ **Never** show raw errors to users:

```typescript
// Bad
Alert.alert('Error', error.message);

// Good
Alert.alert('Error', formatUserMessage(error));
```

❌ **Never** use `any` for error types in catch blocks (use `unknown`):

```typescript
// Bad
} catch (e: any) {
  console.error(e.message); // Type unsafe

// Good
} catch (e: unknown) {
  console.error(e instanceof Error ? e.message : String(e));
}
```

---

## Related Documents

| Document                                                                 | Relationship            |
| ------------------------------------------------------------------------ | ----------------------- |
| [40-logging-strategy.md](./40-logging-strategy.md)                       | Error logging           |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md) | NFR error requirements  |
| [37-security-architecture.md](./37-security-architecture.md)             | Security error handling |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
