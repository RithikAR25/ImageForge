# Background Job System

> **Document ID**: 32
> **Phase**: 2 — Architecture
> **Status**: Approved
> **Last Updated**: 2026-07-27
> **Owner**: Architecture Team

---

## Purpose

This document defines the background job system — the infrastructure that runs image processing jobs concurrently without blocking the UI, with support for pause, resume, cancellation, and retry.

---

## Architecture Overview

The background job system is built on three layers:

```
┌─────────────────────────────────────────┐
│         UI Layer (React)                │
│  BatchScreen ← queueStore (Zustand)     │
└────────────────┬────────────────────────┘
                 │ actions / subscribe
┌────────────────▼────────────────────────┐
│      BatchOrchestrator                  │
│  (concurrency control, abort, retry)    │
└────────────────┬────────────────────────┘
                 │ dispatch tasks
┌────────────────▼────────────────────────┐
│        WasmWorkerPool                   │
│  (pre-warmed workers, zero-copy data)   │
└─────────────────────────────────────────┘
```

---

## Concurrency Control — Semaphore

```typescript
// packages/image-core/src/utils/Semaphore.ts

class Semaphore {
  private count: number;
  private queue: Array<() => void> = [];

  constructor(private readonly max: number) {
    this.count = max;
  }

  async acquire(): Promise<void> {
    if (this.count > 0) {
      this.count--;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.count++;
    }
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }
}

// Usage: limit to 4 concurrent jobs
const semaphore = new Semaphore(workerPool.size);
await Promise.all(jobs.map((job) => semaphore.run(() => processJob(job))));
```

---

## Pause / Resume Mechanism

The batch engine uses a **cooperative pause** model:

- On pause: set `status = 'paused'` in queueStore
- Workers finish their current job, then check `status` before picking up the next
- On resume: set `status = 'running'`; workers continue

```typescript
// Before each job, check if paused
private async processNextJob(): Promise<void> {
  while (true) {
    if (this.abortController.signal.aborted) return;

    const status = useQueueStore.getState().status;
    if (status === 'paused') {
      await this.waitForResume();
      continue;
    }

    const job = this.getNextPendingJob();
    if (!job) return; // No more jobs

    await this.processJob(job);
  }
}

private waitForResume(): Promise<void> {
  return new Promise(resolve => {
    const unsubscribe = useQueueStore.subscribe(
      state => state.status,
      (status) => {
        if (status === 'running') {
          unsubscribe();
          resolve();
        }
      }
    );
  });
}
```

---

## Retry Strategy

Failed jobs can be retried with exponential backoff:

```typescript
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

async function processJobWithRetry(job: BatchJob): Promise<void> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await processJob(job);
      return;
    } catch (error) {
      if (isAbortError(error)) throw error; // Don't retry aborts

      if (attempt === MAX_RETRIES) {
        updateJob(job.id, { status: 'failed', error: formatError(error) });
        return;
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      updateJob(job.id, { status: 'retrying', retryCount: attempt + 1 });
      await sleep(delay);
    }
  }
}
```

---

## Job Priority Queue

Jobs are processed in FIFO order by default. Priority queue support is planned for Phase 2:

```typescript
// Phase 2: Priority levels
type JobPriority = 'high' | 'normal' | 'low';

// High priority: jobs manually moved to front of queue
// Normal: default order
// Low: jobs deprioritized by user
```

---

## Mobile Background Processing

On mobile, the OS can suspend background apps. The system handles this:

- **iOS**: `expo-background-fetch` for short background tasks (< 30s)
- **Android**: `WorkManager` (via Expo Config Plugin) for reliable background processing
- **Strategy**: If the app is backgrounded mid-batch, pause the queue. On foreground, resume automatically.

```typescript
import * as BackgroundFetch from 'expo-background-fetch';

// Register background task (mobile only)
await BackgroundFetch.registerTaskAsync('imageforge-background-process', {
  minimumInterval: 15 * 60, // 15 minutes
  stopOnTerminate: false,
  startOnBoot: false,
});
```

---

## Related Documents

| Document                                                         | Relationship       |
| ---------------------------------------------------------------- | ------------------ |
| [30-batch-processing-engine.md](./30-batch-processing-engine.md) | Batch queue design |
| [49b-wasm-architecture.md](./49b-wasm-architecture.md)           | Worker pool        |
| [35-state-management.md](./35-state-management.md)               | queueStore         |

---

_Document Owner: Architecture Team | Approved: 2026-07-27_
