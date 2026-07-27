import type { ProcessingOperation } from './processing';

export type BatchJobStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'cancelled';

export interface BatchJob {
  readonly id: string;
  readonly imageId: string;
  readonly pipeline: readonly ProcessingOperation[];
  readonly status: BatchJobStatus;
  readonly progress: number;
  readonly error?: { code: string; message: string };
  readonly startedAt?: Date;
  readonly completedAt?: Date;
}
