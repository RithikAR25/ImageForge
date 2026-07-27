# Logging Strategy

> **Document ID**: 40
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the structured logging strategy for ImageForge — how logs are written, structured, filtered, and used for debugging and monitoring.

---

## Logging Principles

1. **No PII in logs**: Never log image names, EXIF GPS, or any user-identifiable data
2. **Structured logs**: All logs are structured JSON (not raw strings)
3. **Level-appropriate**: Each log uses the correct severity level
4. **Actionable**: Every error log includes enough context to diagnose the issue
5. **Environment-aware**: Verbose logging in development; minimal in production

---

## Log Levels

| Level   | Use Case                     | Dev | Production   |
| ------- | ---------------------------- | --- | ------------ |
| `DEBUG` | Detailed internal state      | ✅  | ❌           |
| `INFO`  | Key lifecycle events         | ✅  | ✅ (sampled) |
| `WARN`  | Degraded but recoverable     | ✅  | ✅           |
| `ERROR` | Failures requiring attention | ✅  | ✅           |

---

## Logger Implementation

```typescript
// packages/shared/src/logger/Logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context: string; // Module/component name
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    code?: string;
    stack?: string; // Only in development
  };
}

class Logger {
  constructor(private readonly context: string) {}

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'development') return;
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: Date.now(),
      context: this.context,
      data,
    };

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        code: (error as any).code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
    }

    console.error(JSON.stringify(entry));

    // Optional: forward to error reporter if user opted in
    if (errorReporter.isEnabled()) {
      errorReporter.captureException(error, { extra: entry });
    }
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: this.context,
      data,
    };
    console[level](JSON.stringify(entry));
  }
}

// Factory function
export function createLogger(context: string): Logger {
  return new Logger(context);
}
```

---

## Usage Examples

```typescript
// packages/image-core/src/compress/Compress.ts
const logger = createLogger('image-core.compress');

async function compressJpeg(image: ImageFile, config: CompressConfig): Promise<ImageFile> {
  logger.info('Starting compression', {
    fileSize: image.fileSize,
    dimensions: `${image.width}x${image.height}`,
    targetQuality: config.quality,
  });

  try {
    const result = await mozjpeg.encode(image.buffer, config.quality);

    logger.info('Compression complete', {
      originalSize: image.fileSize,
      resultSize: result.byteLength,
      ratio: (result.byteLength / image.fileSize).toFixed(2),
    });

    return { ...image, buffer: result, fileSize: result.byteLength };
  } catch (err) {
    logger.error('Compression failed', err, {
      fileSize: image.fileSize,
      quality: config.quality,
    });
    throw new ProcessingError('ENCODE_FAILED', 'JPEG compression failed', err);
  }
}
```

---

## What NOT to Log

```typescript
// ❌ Never log image filenames (may contain PII)
logger.info('Processing', { filename: image.name }); // BAD

// ❌ Never log image content
logger.debug('Buffer', { buffer: image.buffer }); // BAD

// ❌ Never log EXIF GPS data
logger.info('Metadata', { gps: exif.gps }); // BAD

// ✅ Log metadata about the image (not the image itself)
logger.info('Processing', {
  fileSize: image.fileSize,
  mimeType: image.mimeType,
  dimensions: `${image.width}x${image.height}`,
}); // GOOD
```

---

## Development DevTools Integration

In development, logs are also formatted for browser DevTools:

```typescript
if (process.env.NODE_ENV === 'development') {
  // Pretty-print with colors in browser console
  console.groupCollapsed(`[${entry.context}] ${entry.message}`);
  console.log('Level:', entry.level);
  console.log('Data:', entry.data);
  if (entry.error) console.error('Error:', entry.error);
  console.groupEnd();
}
```

---

## Related Documents

| Document                                                                 | Relationship   |
| ------------------------------------------------------------------------ | -------------- |
| [39-error-handling-strategy.md](./39-error-handling-strategy.md)         | Error logging  |
| [37-security-architecture.md](./37-security-architecture.md)             | No PII in logs |
| [06-non-functional-requirements.md](./06-non-functional-requirements.md) | NFR-OB-001     |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
