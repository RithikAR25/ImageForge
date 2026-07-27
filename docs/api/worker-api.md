# Web Worker API Reference

> **Document ID**: api/worker-api
> **Phase**: API Documentation
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Overview

ImageForge's WASM processing runs in dedicated Web Workers. This document describes the internal message protocol between the main thread and the `WasmWorkerPool`.

---

## Architecture

```
Main Thread
    │
    │  postMessage({ type, taskId, payload }, [transfer])
    ▼
WasmWorkerPool (pool of 1-4 Workers)
    │
    │  Dispatches task to available worker
    ▼
Worker Thread
    │  Loads WASM module (once, then cached)
    │  Processes ArrayBuffer
    │  postMessage({ type, taskId, result }, [transfer])
    ▼
Main Thread (resolves Promise)
```

---

## Message Protocol

### Request (Main → Worker)

```typescript
interface WorkerRequest {
  type: 'PROCESS';
  taskId: string; // UUID for tracking
  operation: ProcessingOperation;
  buffer: ArrayBuffer; // Transferred (zero-copy)
}
```

### Response (Worker → Main)

```typescript
type WorkerResponse =
  | {
      type: 'SUCCESS';
      taskId: string;
      output: ArrayBuffer; // Transferred back (zero-copy)
      metadata: {
        duration: number; // ms
        inputSize: number;
        outputSize: number;
      };
    }
  | {
      type: 'ERROR';
      taskId: string;
      error: {
        code: string;
        message: string;
      };
    }
  | {
      type: 'PROGRESS';
      taskId: string;
      percent: number; // 0-100
    };
```

---

## WasmWorkerPool API

```typescript
class WasmWorkerPool {
  constructor(options: { maxWorkers?: number; wasmBaseUrl: string });

  /**
   * Dispatch an image processing task to an available worker.
   * Returns a Promise that resolves with the processed buffer.
   *
   * @param task - The processing task
   * @param signal - Cancellation signal
   */
  async dispatch(
    task: WorkerRequest,
    signal?: AbortSignal,
  ): Promise<WorkerResponse & { type: 'SUCCESS' }>;

  /**
   * Terminate all workers and release resources.
   */
  dispose(): void;

  /**
   * Current number of pending tasks in the queue.
   */
  readonly pendingCount: number;

  /**
   * Current number of active workers processing tasks.
   */
  readonly activeCount: number;
}
```

---

## Transfer List (Zero-Copy)

Both request and response use the Transferable `buffer` in the transfer list:

```typescript
// Dispatching (main thread)
worker.postMessage(
  { type: 'PROCESS', taskId, operation, buffer },
  [buffer], // Transfer ownership to worker — main buffer detached
);

// Responding (worker thread)
self.postMessage(
  { type: 'SUCCESS', taskId, output, metadata },
  [output], // Transfer ownership back to main thread
);
```

This avoids copying potentially large image buffers between threads.

---

## Error Codes

| Code                | Meaning                            |
| ------------------- | ---------------------------------- |
| `WASM_LOAD_FAILED`  | WASM module failed to initialize   |
| `INVALID_OPERATION` | Unknown operation type             |
| `ENCODE_FAILED`     | Codec encoding error               |
| `DECODE_FAILED`     | Image could not be decoded         |
| `OUT_OF_MEMORY`     | WASM heap exhausted                |
| `ABORTED`           | Task was cancelled via AbortSignal |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
