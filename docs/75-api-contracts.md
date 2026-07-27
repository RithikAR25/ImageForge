# API Contracts

> **Document ID**: 75
> **Phase**: 4 — Feature Specifications
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the public API contracts for ImageForge's published npm packages. These contracts are the stability boundary — breaking changes require a major version bump.

---

## `@imageforge/image-core` Public API

### ProcessingEngine Interface

```typescript
/**
 * The core abstraction for all image processing.
 * Implemented per-platform (WASM on Web, Native on Mobile).
 */
interface ProcessingEngine {
  /**
   * Initialize the processing engine.
   * Must be called before any operations.
   * @throws {ProcessingError} if initialization fails
   */
  initialize(): Promise<void>;

  /**
   * Check if the engine is initialized and ready.
   */
  isReady(): boolean;

  /**
   * Apply a single processing operation to an image.
   * @param input - The source image
   * @param operation - The operation to apply
   * @param signal - Optional AbortSignal to cancel the operation
   * @throws {ProcessingError} if operation fails or is aborted
   */
  applyOperation(
    input: ImageFile,
    operation: ProcessingOperation,
    signal?: AbortSignal,
  ): Promise<ImageFile>;

  /**
   * Release resources held by the engine.
   */
  dispose(): void;
}
```

### ImagePipeline

```typescript
/**
 * Orchestrates an ordered sequence of processing operations.
 * @example
 * const pipeline = new ImagePipeline(engine, [
 *   { type: 'compress', config: { codec: 'webp', quality: 80 } },
 *   { type: 'resize', config: { width: 1080, mode: 'fit', algorithm: 'lanczos3' } },
 * ]);
 * const result = await pipeline.execute(image, signal, onProgress);
 */
class ImagePipeline {
  constructor(engine: ProcessingEngine, operations: ProcessingOperation[]);

  /**
   * Execute all operations in sequence on the input image.
   * @param input - Source image
   * @param signal - Optional AbortSignal
   * @param onProgress - Called with (step, total) as operations complete
   */
  execute(
    input: ImageFile,
    signal?: AbortSignal,
    onProgress?: (step: number, total: number) => void,
  ): Promise<ProcessingResult>;
}
```

### Factory Functions

```typescript
/**
 * Create a compress operation.
 * @param config - Compression configuration
 * @throws {ValidationError} if config values are invalid
 */
function createCompressOperation(config: CompressConfig): ProcessingOperation;

/**
 * Create a resize operation.
 */
function createResizeOperation(config: ResizeConfig): ProcessingOperation;

/**
 * Create a crop operation.
 */
function createCropOperation(config: CropConfig): ProcessingOperation;
```

---

## `@imageforge/types` Public API

### ImageFile

```typescript
/**
 * Represents an image loaded into ImageForge.
 * This is the central data structure of the system.
 */
interface ImageFile {
  /** Unique identifier (UUID v4) */
  readonly id: string;
  /** Local URI or Blob URL */
  readonly uri: string;
  /** Raw image data */
  readonly buffer: ArrayBuffer;
  /** Original filename */
  readonly name: string;
  /** IANA MIME type */
  readonly mimeType: string;
  /** Width in pixels */
  readonly width: number;
  /** Height in pixels */
  readonly height: number;
  /** File size in bytes */
  readonly fileSize: number;
  /** Color space */
  readonly colorSpace: ColorSpace;
  /** EXIF metadata, null if not present or parsing failed */
  readonly exif: ExifData | null;
  /** When the image was imported */
  readonly importedAt: Date;
  /** Whether this image was detected as a duplicate */
  readonly isDuplicate: boolean;
}

type ColorSpace = 'sRGB' | 'Display P3' | 'Adobe RGB' | 'unknown';
```

### ProcessingOperation (Discriminated Union)

```typescript
type ProcessingOperation =
  | CompressOperation
  | ResizeOperation
  | CropOperation
  | RotateOperation
  | FlipOperation
  | ConvertOperation;

interface CompressOperation {
  readonly type: 'compress';
  readonly config: CompressConfig;
}

interface CompressConfig {
  readonly codec: 'jpeg' | 'png' | 'webp';
  /** Quality 1-100 for lossy, 0-9 for PNG compression level */
  readonly quality: number;
  /** Target file size in KB (adaptive compression) */
  readonly targetSizeKb?: number;
}
```

---

## Versioning Policy

| Change Type                   | Version Bump          |
| ----------------------------- | --------------------- |
| Breaking change to public API | Major (1.x.x → 2.0.0) |
| New public function/type      | Minor (1.0.x → 1.1.0) |
| Bug fix, internal refactor    | Patch (1.0.0 → 1.0.1) |

**Stable public API** = everything exported from `src/index.ts`  
**Unstable/internal** = everything NOT exported from `src/index.ts`

---

## Plugin API (Phase 2)

```typescript
/**
 * Interface that all plugins must implement.
 */
interface ImageForgePlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;

  /** Called when the plugin is loaded */
  onLoad(api: PluginAPI): void;

  /** Process function — receives image buffer, returns processed buffer */
  process(input: ArrayBuffer, config: unknown, signal?: AbortSignal): Promise<ArrayBuffer>;
}

interface PluginAPI {
  /** Register a new operation type */
  registerOperation(descriptor: OperationDescriptor): void;
}
```

---

## Related Documents

| Document                                                             | Relationship            |
| -------------------------------------------------------------------- | ----------------------- |
| [29-image-processing-pipeline.md](./29-image-processing-pipeline.md) | Implementation          |
| [42-domain-model.md](./42-domain-model.md)                           | Entity definitions      |
| [47-api-versioning-strategy.md](./47-api-versioning-strategy.md)     | Versioning policy       |
| [docs/api/image-core-api.md](./api/image-core-api.md)                | Generated API reference |

---

_Document Owner: Architecture Team | Review Cycle: Per-major-release | Approved: 2026-07-27_
