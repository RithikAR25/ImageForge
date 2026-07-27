import type { ImageFile } from './core';
import type { ProcessingOperation } from './processing';

export interface ProcessingEngine {
  isReady(): boolean;
  initialize(): Promise<void>;
  dispose(): void;
  applyOperation(
    input: ImageFile,
    operation: ProcessingOperation,
    signal?: AbortSignal,
  ): Promise<ImageFile>;
}
