export type ProcessingErrorCode =
  | 'INVALID_INPUT'
  | 'DECODE_FAILED'
  | 'ENCODE_FAILED'
  | 'PROCESSING_FAILED'
  | 'OUT_OF_MEMORY'
  | 'ABORTED'
  | 'WASM_LOAD_FAILED'
  | 'UNKNOWN';

export type ImportErrorCode =
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'CORRUPTED_FILE'
  | 'PERMISSION_DENIED'
  | 'READ_FAILED';

export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'NOT_FOUND'
  | 'WRITE_FAILED'
  | 'READ_FAILED'
  | 'INIT_FAILED';
