import type { WorkerMessage, WorkerEvent } from './worker/protocol';
import type { ProcessingOperation } from '@imageforge/types';
import { ProcessingError } from '../errors/translators';

/**
 * Manages a single WebWorker lifecycle and message passing.
 * Internally used by WasmWorkerPool.
 */
export class WorkerManager {
  private worker: Worker | null = null;
  private pendingJobs = new Map<
    string,
    {
      resolve: (value: ArrayBuffer) => void;
      reject: (reason: unknown) => void;
    }
  >();

  constructor(private scriptUrl: string) {}

  public async initialize(wasmBaseUrl: string): Promise<void> {
    await Promise.resolve();
    if (this.worker) return;
    
    // In a real implementation, this might be a URL to a compiled worker file.
    this.worker = new Worker(this.scriptUrl, { type: 'module' });
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = () => { this.handleFatalError(); };

    this.worker.postMessage({
      type: 'INITIALIZE',
      payload: { wasmBaseUrl },
    } satisfies WorkerMessage);
  }

  public async process(jobId: string, buffer: ArrayBuffer, operation: ProcessingOperation, signal?: AbortSignal): Promise<ArrayBuffer> {
    if (!this.worker) throw new ProcessingError('PROCESSING_FAILED', 'Worker not initialized');

    return new Promise((resolve, reject) => {
      const onAbort = () => {
        this.cancelJob(jobId);
        reject(new ProcessingError('ABORTED', 'Operation aborted'));
        signal?.removeEventListener('abort', onAbort);
      };

      if (signal?.aborted) {
        reject(new ProcessingError('ABORTED', 'Operation aborted before start'));
        return;
      }

      signal?.addEventListener('abort', onAbort);

      this.pendingJobs.set(jobId, { resolve, reject });

      const currentWorker = this.worker;
      if (currentWorker) {
        currentWorker.postMessage(
          {
            type: 'PROCESS',
            jobId,
            payload: { buffer, operation },
          } satisfies WorkerMessage,
          [buffer] // Transfer ownership
        );
      }
    });
  }

  public cancelJob(jobId: string): void {
    if (!this.worker) return;
    this.worker.postMessage({ type: 'CANCEL', jobId } satisfies WorkerMessage);
    const job = this.pendingJobs.get(jobId);
    if (job) {
      job.reject(new ProcessingError('ABORTED', 'Operation cancelled'));
      this.pendingJobs.delete(jobId);
    }
  }

  public dispose(): void {
    if (this.worker) {
      this.worker.postMessage({ type: 'DISPOSE' } satisfies WorkerMessage);
      this.worker.terminate();
      this.worker = null;
    }
    for (const job of this.pendingJobs.values()) {
      job.reject(new ProcessingError('PROCESSING_FAILED', 'Worker disposed'));
    }
    this.pendingJobs.clear();
  }

  private handleMessage(event: MessageEvent<WorkerEvent>): void {
    const data = event.data;
    if (data.type === 'SUCCESS') {
      const job = this.pendingJobs.get(data.jobId);
      if (job) {
        job.resolve(data.payload.buffer);
        this.pendingJobs.delete(data.jobId);
      }
    } else if (data.type === 'ERROR') {
      const job = this.pendingJobs.get(data.jobId);
      if (job) {
        job.reject(new ProcessingError('PROCESSING_FAILED', data.payload.message));
        this.pendingJobs.delete(data.jobId);
      }
    }
  }

  private handleFatalError(): void {
    this.dispose();
  }
}
