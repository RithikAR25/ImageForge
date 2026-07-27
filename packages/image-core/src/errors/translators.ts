import type { ProcessingErrorCode, ImportErrorCode, StorageErrorCode } from '@imageforge/types';

export class ProcessingError extends Error {
  constructor(
    public readonly code: ProcessingErrorCode,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export class ImportError extends Error {
  constructor(
    public readonly code: ImportErrorCode,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ImportError';
  }
}

export class StorageError extends Error {
  constructor(
    public readonly code: StorageErrorCode,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export function mapWorkerError(error: unknown): ProcessingError {
  if (error instanceof ProcessingError) return error;
  return new ProcessingError('PROCESSING_FAILED', 'Worker execution failed', error);
}

export function mapCodecError(error: unknown, isDecode = true): ProcessingError {
  if (error instanceof ProcessingError) return error;
  return new ProcessingError(isDecode ? 'DECODE_FAILED' : 'ENCODE_FAILED', 'Codec operation failed', error);
}

export function mapImportError(error: unknown): ImportError {
  if (error instanceof ImportError) return error;
  return new ImportError('READ_FAILED', 'Failed to import file', error);
}
