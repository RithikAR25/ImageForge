import type { ProcessingEngine, ImageFile, ProcessingOperation } from '@imageforge/types';
import { generateId } from '@imageforge/shared';
import { WorkerManager } from './workerManager';
import { ProcessingError } from '../errors/translators';

export class WasmWorkerPool implements ProcessingEngine {
  private workers: WorkerManager[] = [];
  private _isReady = false;
  private currentWorkerIndex = 0;

  constructor(private options: { maxWorkers?: number; wasmBaseUrl: string; workerScriptUrl: string }) {}

  public isReady(): boolean {
    return this._isReady;
  }

  public async initialize(): Promise<void> {
    const numWorkers = this.options.maxWorkers ?? 2; // Default to 2 workers
    
    const initPromises = [];
    for (let i = 0; i < numWorkers; i++) {
      const manager = new WorkerManager(this.options.workerScriptUrl);
      this.workers.push(manager);
      initPromises.push(manager.initialize(this.options.wasmBaseUrl));
    }

    await Promise.all(initPromises);
    this._isReady = true;
  }

  public dispose(): void {
    for (const worker of this.workers) {
      worker.dispose();
    }
    this.workers = [];
    this._isReady = false;
  }

  public async applyOperation(
    input: ImageFile,
    operation: ProcessingOperation,
    signal?: AbortSignal,
  ): Promise<ImageFile> {
    if (!this._isReady || this.workers.length === 0) {
      throw new ProcessingError('PROCESSING_FAILED', 'Worker pool is not ready');
    }

    // Round-robin selection
    const worker = this.workers[this.currentWorkerIndex];
    if (!worker) {
      throw new ProcessingError('PROCESSING_FAILED', 'Worker not found');
    }
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workers.length;

    const jobId = generateId();

    // The buffer is transferred, meaning input.buffer becomes detached.
    // The main thread loses ownership of it here!
    const resultBuffer = await worker.process(jobId, input.buffer, operation, signal);

    // Reconstruct the ImageFile with the new buffer (backend takes ownership and returns a new/modified buffer)
    return {
      ...input,
      buffer: resultBuffer,
      fileSize: resultBuffer.byteLength,
      // Metadata dimensions etc might need updating if crop/resize happened, 
      // but for this core engine layer, we rely on the backend to provide updated metadata eventually.
      // (Simplified for architectural placeholder).
    };
  }

  public readonly pendingCount = 0; // Stub
  public readonly activeCount = 0; // Stub
}
