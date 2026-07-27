import type { ImageFile, ProcessingEngine, ProcessingOperation, ProcessingResult } from '@imageforge/types';
import { ProcessingError } from '../errors/translators';

export class ImagePipeline {
  constructor(
    private engine: ProcessingEngine,
    private operations: readonly ProcessingOperation[]
  ) {}

  public async execute(image: ImageFile, signal?: AbortSignal): Promise<ProcessingResult> {
    const startTime = Date.now();
    let currentImage = image;
    const appliedOps: ProcessingOperation[] = [];

    if (!this.engine.isReady()) {
      throw new ProcessingError('PROCESSING_FAILED', 'Engine is not ready');
    }

    try {
      for (const op of this.operations) {
        if (signal?.aborted) {
          throw new ProcessingError('ABORTED', 'Pipeline aborted');
        }

        // Apply operation sequentially
        // The engine transfers ownership to the worker, and back to currentImage.buffer
        currentImage = await this.engine.applyOperation(currentImage, op, signal);
        appliedOps.push(op);
      }
    } catch (error) {
      if (error instanceof ProcessingError) throw error;
      throw new ProcessingError('PROCESSING_FAILED', 'Pipeline execution failed', error);
    }

    return {
      output: currentImage,
      appliedOperations: appliedOps,
      duration: Date.now() - startTime,
      inputSize: image.fileSize,
      outputSize: currentImage.fileSize,
    };
  }

  public get operationCount(): number {
    return this.operations.length;
  }
}
