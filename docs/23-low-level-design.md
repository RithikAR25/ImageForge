# Low-Level Design

> **Document ID**: 23
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document provides the Low-Level Design (LLD) for ImageForge's most critical modules — the implementation details that enable developers to build the system correctly. Where the HLD says _what_ exists, the LLD says _how_ it works.

---

## 1. CompressOperation — Internal Design

### Responsibility

Take an `ImageFile`, apply lossy/lossless compression with the specified codec and quality, return a new `ImageFile`.

### Input Validation

```typescript
function validateCompressConfig(config: CompressConfig): void {
  const codec = config.codec;
  if (!['jpeg', 'png', 'webp', 'avif'].includes(codec)) {
    throw new ProcessingError('INVALID_INPUT', `Unsupported codec: ${codec}`);
  }
  if (codec === 'jpeg' || codec === 'webp' || codec === 'avif') {
    if (config.quality < 1 || config.quality > 100) {
      throw new ProcessingError(
        'INVALID_INPUT',
        `Quality must be 1–100 for ${codec}, got ${config.quality}`,
      );
    }
  }
  if (codec === 'png') {
    if (config.quality < 0 || config.quality > 9) {
      throw new ProcessingError(
        'INVALID_INPUT',
        `PNG compression level must be 0–9, got ${config.quality}`,
      );
    }
  }
}
```

### Codec Dispatch

```typescript
// Web (WASM)
async function applyCompress(input: ImageFile, config: CompressConfig): Promise<ImageFile> {
  validateCompressConfig(config);

  const encoder = await getEncoder(config.codec); // Lazy-load WASM module

  let outputBuffer: ArrayBuffer;

  if (config.targetSizeKb) {
    outputBuffer = await adaptiveCompress(encoder, input.buffer, config);
  } else {
    outputBuffer = await encoder.encode(input.buffer, config.quality);
  }

  return {
    ...input,
    id: generateId(), // New ID for the output
    buffer: outputBuffer,
    fileSize: outputBuffer.byteLength,
    mimeType: codecToMime(config.codec),
  };
}
```

### Adaptive Compression Algorithm

```
Binary search between quality 1-100:
  lo = 1, hi = 100

  for iteration in 0..9:
    mid = (lo + hi) / 2
    result = encode(input, quality=mid)

    if |result.size - target| / target < 0.1:  // Within ±10%
      return result

    if result.size > target:
      hi = mid - 1   // Too large, reduce quality
    else:
      lo = mid + 1   // Too small, increase quality

  return last_result  // Best approximation after 10 iterations
```

---

## 2. WasmWorkerPool — Internal Design

### Pool Initialization

```typescript
class WasmWorkerPool {
  private workers: WasmWorkerWrapper[] = [];
  private taskQueue: PendingTask[] = [];
  readonly size: number;

  constructor(options: { maxWorkers?: number } = {}) {
    this.size = options.maxWorkers ?? Math.min(4, navigator.hardwareConcurrency ?? 2);

    for (let i = 0; i < this.size; i++) {
      const worker = new Worker(new URL('./wasm.worker.ts', import.meta.url), {
        type: 'module',
        name: `wasm-worker-${i}`,
      });
      this.workers.push(new WasmWorkerWrapper(worker, i));
    }
  }

  async dispatch<T>(task: WasmTask): Promise<T> {
    const worker = this.getIdleWorker() ?? (await this.waitForIdleWorker());
    return worker.execute<T>(task);
  }

  private getIdleWorker(): WasmWorkerWrapper | null {
    return this.workers.find((w) => !w.isbusy) ?? null;
  }

  private waitForIdleWorker(): Promise<WasmWorkerWrapper> {
    return new Promise((resolve) => {
      const handler = (worker: WasmWorkerWrapper) => {
        this.offIdle(handler);
        resolve(worker);
      };
      this.onIdle(handler);
    });
  }
}
```

### Task Message Protocol

```typescript
// Main thread → Worker
type WorkerInboundMessage =
  | { type: 'init'; module: WasmModuleName }
  | { type: 'compress'; id: string; buffer: ArrayBuffer; config: CompressConfig }
  | { type: 'resize'; id: string; buffer: ArrayBuffer; config: ResizeConfig };

// Worker → Main thread
type WorkerOutboundMessage =
  | { type: 'ready'; module: WasmModuleName }
  | { type: 'result'; id: string; buffer: ArrayBuffer }
  | { type: 'progress'; id: string; percent: number }
  | { type: 'error'; id: string; code: string; message: string };
```

### Zero-Copy ArrayBuffer Transfer

```typescript
// Transferable transfer — ownership moves to worker (zero copy)
worker.postMessage(
  { type: 'compress', id: taskId, buffer: imageBuffer, config },
  [imageBuffer], // Transfer list — buffer is now invalid in main thread
);

// Worker returns result the same way
self.postMessage(
  { type: 'result', id: taskId, buffer: resultBuffer },
  [resultBuffer], // Transfer back to main thread
);
```

---

## 3. Zustand Store — Internal Patterns

### Immer Integration

For complex state updates, `immer` middleware is used:

```typescript
const useQueueStore = create<QueueStore>()(
  immer((set, get) => ({
    jobs: new Map(),

    updateJobStatus: (jobId, status) =>
      set((state) => {
        const job = state.jobs.get(jobId);
        if (job) {
          job.status = status;
          job.completedAt = status === 'completed' ? Date.now() : job.completedAt;
        }
      }),
  })),
);
```

### Selector Performance

```typescript
// useShallow prevents re-renders when reference changes but values are the same
const { totalJobs, completedJobs } = useQueueStore(
  useShallow((state) => ({
    totalJobs: state.jobs.size,
    completedJobs: Array.from(state.jobs.values()).filter((j) => j.status === 'completed').length,
  })),
);
```

---

## 4. IndexedDB Schema Migrations

```typescript
class ImageForgeDatabase extends Dexie {
  constructor() {
    super('ImageForgeDB');

    // v1: Initial schema
    this.version(1).stores({
      queues: 'id, status, createdAt',
      jobs: 'id, queueId, status',
      thumbnails: 'imageId, createdAt',
      keyval: 'key',
    });

    // v2: Add projectId to queues (migration: set null for existing records)
    this.version(2)
      .stores({
        queues: 'id, status, createdAt, projectId',
      })
      .upgrade((tx) =>
        tx.queues.toCollection().modify((q) => {
          q.projectId = null;
        }),
      );

    // v3: Add tags support
    this.version(3).stores({
      jobs: 'id, queueId, status, *tags',
    });
  }
}
```

---

## Related Documents

| Document                                                             | Relationship       |
| -------------------------------------------------------------------- | ------------------ |
| [22-high-level-design.md](./22-high-level-design.md)                 | Component overview |
| [29-image-processing-pipeline.md](./29-image-processing-pipeline.md) | Pipeline design    |
| [35-state-management.md](./35-state-management.md)                   | Store patterns     |
| [49b-wasm-architecture.md](./49b-wasm-architecture.md)               | WASM engine        |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
