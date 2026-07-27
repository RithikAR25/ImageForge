import type { ProcessingEngine, ProcessingOperation, BatchJob } from '@imageforge/types';
import type { BatchState } from '@imageforge/shared';
import { generateId } from '@imageforge/shared';
import { ProcessingError } from '../errors/translators';
import { ImagePipeline } from '../pipeline/imagePipeline';

export interface BatchStoreAdapter {
  getState: () => BatchState;
}

export class BatchOrchestrator {
  private activeJobs = new Set<string>();
  private abortControllers = new Map<string, AbortController>();
  private globalAbortController: AbortController | null = null;
  private isPaused = false;

  constructor(
    private engine: ProcessingEngine,
    private store: BatchStoreAdapter,
    private getBufferForImageId: (imageId: string) => Promise<ArrayBuffer> // Abstracted fetching
  ) {}

  public enqueue(imageId: string, pipelineOps: readonly ProcessingOperation[]): BatchJob {
    const job: BatchJob = {
      id: generateId(),
      imageId,
      pipeline: pipelineOps,
      status: 'pending',
      progress: 0,
    };
    this.store.getState().addJob(job);
    return job;
  }

  public async start(signal?: AbortSignal): Promise<void> {
    await Promise.resolve();
    this.globalAbortController = new AbortController();
    const compositeSignal = signal ? this.combineSignals(signal, this.globalAbortController.signal) : this.globalAbortController.signal;

    // Simple queue processor (ignores concurrency limits for this scaffold)
    const pending = Array.from(this.store.getState().jobs.values()).filter((j) => j.status === 'pending');
    
    for (const job of pending) {
      if (compositeSignal.aborted || this.isPaused) break;
      this.processJob(job.id, compositeSignal).catch(() => { /* handled */ });
    }
  }

  private async processJob(jobId: string, globalSignal: AbortSignal): Promise<void> {
    const job = this.store.getState().jobs.get(jobId);
    if (job?.status !== 'pending') return;

    this.activeJobs.add(jobId);
    this.store.getState().updateJob(jobId, { status: 'processing', startedAt: new Date() });

    const jobController = new AbortController();
    this.abortControllers.set(jobId, jobController);
    const signal = this.combineSignals(globalSignal, jobController.signal);

    try {
      const buffer = await this.getBufferForImageId(job.imageId);
      
      const pipeline = new ImagePipeline(this.engine, job.pipeline);
      
      // We create a mock ImageFile just for the pipeline execution.
      // The store or caller handles the actual persistence logic.
      const mockInput = {
        id: job.imageId,
        buffer,
        name: 'batch-input',
        mimeType: 'application/octet-stream',
        width: 0, height: 0, fileSize: buffer.byteLength,
        exif: null, importedAt: new Date(), isDuplicate: false, uri: '', colorSpace: 'unknown' as const,
      };

      await pipeline.execute(mockInput, signal);
      
      this.store.getState().updateJob(jobId, { status: 'complete', progress: 100, completedAt: new Date() });
    } catch (error) {
      const isAbort = error instanceof ProcessingError && error.code === 'ABORTED';
      const patch: Partial<BatchJob> = { 
        status: isAbort ? 'cancelled' : 'failed', 
        completedAt: new Date(),
        ...(!isAbort ? { error: { code: 'PROCESSING_FAILED', message: String(error) } } : {}),
      };
      this.store.getState().updateJob(jobId, patch);
    } finally {
      this.activeJobs.delete(jobId);
      this.abortControllers.delete(jobId);
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.start().catch(() => { /* handled */ });
  }

  public cancel(jobId: string): void {
    const controller = this.abortControllers.get(jobId);
    if (controller) {
      controller.abort();
    } else {
      // If pending
      const job = this.store.getState().jobs.get(jobId);
      if (job?.status === 'pending') {
        this.store.getState().updateJob(jobId, { status: 'cancelled' });
      }
    }
  }

  public cancelAll(): void {
    this.globalAbortController?.abort();
    for (const [id, job] of this.store.getState().jobs.entries()) {
      if (job.status === 'pending' || job.status === 'processing') {
        this.store.getState().updateJob(id, { status: 'cancelled' });
      }
    }
  }

  private combineSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        return controller.signal;
      }
      signal.addEventListener('abort', () => { controller.abort(); }, { once: true });
    }
    return controller.signal;
  }
}
