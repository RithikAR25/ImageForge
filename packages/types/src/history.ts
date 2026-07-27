import type { ImageFile } from './core';
import type { ProcessingOperation } from './processing';

export interface HistoryEntry {
  readonly id: string;
  readonly imageId: string;
  readonly operation: ProcessingOperation;
  readonly beforeSnapshot: ImageFile;
  readonly afterSnapshot: ImageFile;
  readonly timestamp: Date;
}
