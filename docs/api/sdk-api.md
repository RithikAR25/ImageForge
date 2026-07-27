# SDK API Reference

> **Document ID**: api/sdk-api
> **Phase**: API Documentation
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Overview

The `@imageforge/image-core` package is the TypeScript SDK for ImageForge's image processing capabilities. It can be used as a standalone library in any Node.js or browser project.

---

## Installation

```bash
npm install @imageforge/image-core @imageforge/types
```

---

## Quick Start

```typescript
import {
  ImagePipeline,
  createCompressOperation,
  createResizeOperation,
  processingEngine,
} from '@imageforge/image-core';

// Initialize the engine once
await processingEngine.initialize();

// Create a pipeline
const pipeline = new ImagePipeline(processingEngine, [
  createResizeOperation({ width: 1080, mode: 'fit', algorithm: 'lanczos3' }),
  createCompressOperation({ codec: 'webp', quality: 82 }),
]);

// Load an image
const buffer = await fetch('/path/to/image.jpg').then((r) => r.arrayBuffer());
const image: ImageFile = {
  id: crypto.randomUUID(),
  uri: '',
  buffer,
  name: 'photo.jpg',
  mimeType: 'image/jpeg',
  width: 2500,
  height: 2000,
  fileSize: buffer.byteLength,
  colorSpace: 'sRGB',
  exif: null,
  importedAt: new Date(),
  isDuplicate: false,
};

// Execute pipeline
const result = await pipeline.execute(image);
console.log(`Compressed from ${image.fileSize} to ${result.output.fileSize} bytes`);
```

---

## API Reference

### `processingEngine`

The default `ProcessingEngine` instance (WASM on Web, Native on Mobile).

```typescript
await processingEngine.initialize(); // Must call before use
const ready = processingEngine.isReady(); // boolean
processingEngine.dispose(); // Release resources
```

### `ImagePipeline`

```typescript
const pipeline = new ImagePipeline(engine, operations);

const result: ProcessingResult = await pipeline.execute(
  image,          // ImageFile
  signal?,        // AbortSignal (optional)
  onProgress?     // (step: number, total: number) => void
);
```

### Operation Factories

```typescript
createCompressOperation(config: CompressConfig): ProcessingOperation
createResizeOperation(config: ResizeConfig): ProcessingOperation
createCropOperation(config: CropConfig): ProcessingOperation
createRotateOperation(config: RotateConfig): ProcessingOperation
createFlipOperation(config: FlipConfig): ProcessingOperation
createConvertOperation(config: ConvertConfig): ProcessingOperation
```

### `BatchOrchestrator`

```typescript
const orchestrator = new BatchOrchestrator(pipeline, {
  maxConcurrency: 4,
  onJobUpdate: (job: BatchJob) => console.log(job.status),
});

await orchestrator.run(jobs, signal);
```

---

## Types

See `@imageforge/types` for all TypeScript interfaces:

```typescript
import type {
  ImageFile,
  ProcessingOperation,
  ProcessingResult,
  CompressConfig,
  ResizeConfig,
  CropConfig,
  BatchJob,
  ProcessingError,
} from '@imageforge/types';
```

---

## Browser Requirements

```json
{
  "targets": {
    "chrome": "91",
    "firefox": "90",
    "safari": "15.4",
    "edge": "91"
  }
}
```

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
