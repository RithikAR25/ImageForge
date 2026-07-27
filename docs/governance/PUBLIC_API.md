# Public API Contracts

> **Document ID**: governance/PUBLIC_API
> **Purpose**: Pre-defined public API contracts for every package — established before implementation begins.
> **Rule**: Implementations MUST match these contracts exactly. Changes require a PR with ADR justification.
> **Last Updated**: 2026-07-27

---

## `@imageforge/types`

Zero runtime code. Only TypeScript types and interfaces.

```typescript
// ─── Core Domain ───────────────────────────────────────────────────────────

export interface ImageFile {
  readonly id: string; // UUID
  readonly buffer: ArrayBuffer; // Raw pixel data
  readonly name: string; // Original filename
  readonly mimeType: string; // e.g. 'image/jpeg'
  readonly width: number;
  readonly height: number;
  readonly fileSize: number; // Bytes
  readonly exif: ExifData | null;
  readonly importedAt: Date;
  readonly isDuplicate: boolean;
  readonly uri: string; // Blob URL (web) or file:// URI (mobile)
  readonly colorSpace: 'sRGB' | 'P3' | 'unknown';
}

export interface ExifData {
  readonly make: string | null;
  readonly model: string | null;
  readonly orientation: number | null;
  readonly dateTaken: Date | null;
  readonly gpsLat: number | null;
  readonly gpsLon: number | null;
  readonly iso: number | null;
  readonly focalLength: number | null;
}

// ─── Processing Operations ─────────────────────────────────────────────────

export type ProcessingOperation =
  | { readonly type: 'compress'; readonly config: CompressConfig }
  | { readonly type: 'resize'; readonly config: ResizeConfig }
  | { readonly type: 'crop'; readonly config: CropConfig }
  | { readonly type: 'rotate'; readonly config: RotateConfig }
  | { readonly type: 'flip'; readonly config: FlipConfig }
  | { readonly type: 'convert'; readonly config: ConvertConfig };

export interface CompressConfig {
  readonly codec: 'jpeg' | 'webp' | 'png' | 'avif';
  readonly quality: number; // 1–100 (ignored for PNG lossless)
  readonly targetSizeKb?: number; // Adaptive compression target
  readonly progressive?: boolean; // JPEG progressive encoding
}

export interface ResizeConfig {
  readonly width?: number;
  readonly height?: number;
  readonly percentage?: number; // Alternative to pixel dimensions
  readonly mode: 'fit' | 'fill' | 'stretch' | 'cover';
  readonly algorithm: 'nearest' | 'bilinear' | 'bicubic' | 'lanczos3' | 'mitchell';
  readonly maintainAspectRatio: boolean;
}

export interface CropConfig {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly unit: 'px' | 'percent';
  readonly shape: 'rectangle' | 'circle';
}

export interface RotateConfig {
  readonly angle: 90 | 180 | 270;
  readonly lossless: boolean; // JPEG lossless rotation
  readonly expand: boolean; // Expand canvas for non-multiple-of-90
}

export interface FlipConfig {
  readonly direction: 'horizontal' | 'vertical' | 'both';
}

export interface ConvertConfig {
  readonly format: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp';
  readonly preserveMetadata: boolean;
}

// ─── Results ───────────────────────────────────────────────────────────────

export interface ProcessingResult {
  readonly output: ImageFile;
  readonly appliedOperations: readonly ProcessingOperation[];
  readonly duration: number; // ms
  readonly inputSize: number; // bytes
  readonly outputSize: number; // bytes
}

// ─── Errors ────────────────────────────────────────────────────────────────

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
  'FILE_TOO_LARGE' | 'UNSUPPORTED_FORMAT' | 'CORRUPTED_FILE' | 'PERMISSION_DENIED' | 'READ_FAILED';

export type StorageErrorCode =
  'QUOTA_EXCEEDED' | 'NOT_FOUND' | 'WRITE_FAILED' | 'READ_FAILED' | 'INIT_FAILED';

// ─── Engine Interface ───────────────────────────────────────────────────────

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

// ─── Storage Interface ─────────────────────────────────────────────────────

export interface StorageAdapter {
  saveImage(image: ImageFile): Promise<void>;
  getImage(id: string): Promise<ImageFile | null>;
  deleteImage(id: string): Promise<void>;
  getAllImages(): Promise<readonly ImageFile[]>;
  clear(): Promise<void>;
}

// ─── Batch ─────────────────────────────────────────────────────────────────

export type BatchJobStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'cancelled';

export interface BatchJob {
  readonly id: string;
  readonly imageId: string;
  readonly pipeline: readonly ProcessingOperation[];
  readonly status: BatchJobStatus;
  readonly progress: number; // 0–100
  readonly error?: { code: string; message: string };
  readonly startedAt?: Date;
  readonly completedAt?: Date;
}

// ─── History ───────────────────────────────────────────────────────────────

export interface HistoryEntry {
  readonly id: string;
  readonly imageId: string;
  readonly operation: ProcessingOperation;
  readonly beforeSnapshot: ImageFile;
  readonly afterSnapshot: ImageFile;
  readonly timestamp: Date;
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface AppSettings {
  readonly theme: 'light' | 'dark' | 'system';
  readonly defaultCodec: 'jpeg' | 'webp' | 'png';
  readonly defaultQuality: number; // 1–100
  readonly autoRotateByExif: boolean;
  readonly stripMetadataOnExport: boolean;
  readonly maxConcurrentJobs: number; // 1–8
  readonly showFileSizeReduction: boolean;
  readonly language: string; // BCP-47 tag
}

// ─── Design Tokens ─────────────────────────────────────────────────────────

export interface DesignTokens {
  readonly color: Record<string, Record<string, string>>; // e.g. color.emerald.500
  readonly typography: Record<
    string,
    {
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing?: number;
    }
  >;
  readonly spacing: Record<string, number>;
  readonly rounded: Record<string, number>;
  readonly motion: Record<
    string,
    {
      duration: number;
      easing: [number, number, number, number];
    }
  >;
}

export interface Theme {
  readonly name: string;
  readonly mode: 'light' | 'dark';
  readonly color: {
    readonly primary: Record<string, string>;
    readonly secondary: Record<string, string>;
    readonly tertiary: Record<string, string>;
    readonly error: Record<string, string>;
    readonly background: Record<string, string>;
    readonly surface: Record<string, string>;
    readonly text: Record<string, string>;
    readonly outline: Record<string, string>;
  };
  readonly typography: DesignTokens['typography'];
  readonly spacing: DesignTokens['spacing'];
  readonly rounded: DesignTokens['rounded'];
  readonly motion: DesignTokens['motion'];
}
```

---

## `@imageforge/shared`

```typescript
// ─── Logger ────────────────────────────────────────────────────────────────

export function createLogger(scope: string): Logger;

export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error?: unknown): void;
}

// ─── Stores (Zustand) ──────────────────────────────────────────────────────

export function useImageStore(): ImageStore;
export interface ImageStore {
  images: ReadonlyMap<string, ImageFile>;
  activeImageId: string | null;
  addImage(image: ImageFile): void;
  removeImage(id: string): void;
  setActiveImage(id: string | null): void;
  updateImage(id: string, patch: Partial<ImageFile>): void;
  clear(): void;
}

export function useSettingsStore(): SettingsStore;
export interface SettingsStore {
  settings: AppSettings;
  updateSettings(patch: Partial<AppSettings>): void;
  resetSettings(): void;
}

export function useHistoryStore(): HistoryStore;
export interface HistoryStore {
  entries: ReadonlyMap<string, readonly HistoryEntry[]>;
  canUndo(imageId: string): boolean;
  canRedo(imageId: string): boolean;
  push(entry: HistoryEntry): void;
  undo(imageId: string): HistoryEntry | null;
  redo(imageId: string): HistoryEntry | null;
  clearHistory(imageId: string): void;
}

export function useBatchStore(): BatchStore;
export interface BatchStore {
  jobs: ReadonlyMap<string, BatchJob>;
  addJob(job: BatchJob): void;
  updateJob(id: string, patch: Partial<BatchJob>): void;
  removeJob(id: string): void;
  clearCompleted(): void;
}

// ─── Utilities ─────────────────────────────────────────────────────────────

export function generateId(): string; // crypto.randomUUID()
export function formatFileSize(bytes: number): string; // "2.4 MB"
export function formatDuration(ms: number): string; // "1.2s"
export function formatPercent(value: number): string; // "82%"
export function clamp(value: number, min: number, max: number): number;

// ─── Constants ─────────────────────────────────────────────────────────────

export const COMPRESSION_PRESETS: Record<string, CompressConfig>;
export const RESIZE_PRESETS: Record<string, ResizeConfig>;
export const SUPPORTED_INPUT_FORMATS: readonly string[]; // MIME types
export const MAX_FILE_SIZE_BYTES: number; // 100MB

// ─── Feature Flags ─────────────────────────────────────────────────────────

export const FEATURE_FLAGS: {
  readonly ENABLE_ENHANCEMENT: boolean;
  readonly ENABLE_BACKGROUND_REMOVAL: boolean;
  readonly ENABLE_GIF: boolean;
  readonly ENABLE_PDF: boolean;
  readonly ENABLE_OCR: boolean;
  readonly ENABLE_AI_ENHANCEMENT: boolean;
};
```

---

## `@imageforge/image-core`

```typescript
// ─── Pipeline ──────────────────────────────────────────────────────────────

export class ImagePipeline {
  constructor(engine: ProcessingEngine, operations: readonly ProcessingOperation[]);
  execute(image: ImageFile, signal?: AbortSignal): Promise<ProcessingResult>;
  readonly operationCount: number;
}

// ─── WASM Engine ───────────────────────────────────────────────────────────

export class WasmWorkerPool implements ProcessingEngine {
  constructor(options: { maxWorkers?: number; wasmBaseUrl: string });
  isReady(): boolean;
  initialize(): Promise<void>;
  dispose(): void;
  applyOperation(
    input: ImageFile,
    op: ProcessingOperation,
    signal?: AbortSignal,
  ): Promise<ImageFile>;
  readonly pendingCount: number;
  readonly activeCount: number;
}

// ─── Operation Factories ───────────────────────────────────────────────────

export function createCompressOperation(config: CompressConfig): ProcessingOperation;
export function createResizeOperation(config: ResizeConfig): ProcessingOperation;
export function createCropOperation(config: CropConfig): ProcessingOperation;
export function createRotateOperation(config: RotateConfig): ProcessingOperation;
export function createFlipOperation(config: FlipConfig): ProcessingOperation;
export function createConvertOperation(config: ConvertConfig): ProcessingOperation;

// ─── Import ────────────────────────────────────────────────────────────────

export class FileImporter {
  importFile(file: File, signal?: AbortSignal): Promise<ImageFile>;
  importFiles(files: FileList, signal?: AbortSignal): AsyncIterable<ImageFile>;
}

export class ThumbnailGenerator {
  generate(image: ImageFile, size?: number): Promise<string>; // Returns Blob URL
}

export class DuplicateDetector {
  check(image: ImageFile, existing: readonly ImageFile[]): boolean;
}

// ─── Export ────────────────────────────────────────────────────────────────

export class Exporter {
  downloadSingle(image: ImageFile): void;
  downloadZip(images: readonly ImageFile[], filename?: string): Promise<void>;
}

// ─── Batch ─────────────────────────────────────────────────────────────────

export class BatchOrchestrator {
  constructor(engine: ProcessingEngine, store: BatchStore);
  enqueue(imageId: string, pipeline: readonly ProcessingOperation[]): BatchJob;
  start(signal?: AbortSignal): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(jobId: string): void;
  cancelAll(): void;
}
```

---

## `@imageforge/hooks`

```typescript
export function useImageProcessor(): {
  process: (
    image: ImageFile,
    ops: ProcessingOperation[],
    signal?: AbortSignal,
  ) => Promise<ProcessingResult>;
  isProcessing: boolean;
  progress: number;
};

export function useBatchQueue(): {
  jobs: readonly BatchJob[];
  enqueue: (imageId: string, pipeline: ProcessingOperation[]) => void;
  start: () => void;
  pause: () => void;
  cancelAll: () => void;
  progress: { completed: number; total: number; percent: number };
};

export function useHistory(imageId: string): {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
};

export function useSettings(): {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
};

export function useActiveImage(): ImageFile | null;
export function useImport(): {
  importFiles: (files: FileList) => Promise<void>;
  isImporting: boolean;
};
export function useExport(): {
  downloadSingle: (image: ImageFile) => void;
  downloadZip: (images: ImageFile[]) => Promise<void>;
};
```

---

## `@imageforge/ui`

```typescript
import { ReactNode } from 'react';
import { Theme } from '@imageforge/types';

// ─── Theme Provider ────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark' | 'system';
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element;

export function useTheme(): Theme;

// ─── Core Primitives ───────────────────────────────────────────────────────
// Note: This is an illustrative set of core primitives.
export function Button(props: any): JSX.Element;
export function Text(props: any): JSX.Element;
export function Input(props: any): JSX.Element;
export function Slider(props: any): JSX.Element;
export function ProgressBar(props: any): JSX.Element;
export function Icon(props: any): JSX.Element;
export function Spinner(props: any): JSX.Element;
export function Toast(props: any): JSX.Element;
export function ScreenContainer(props: any): JSX.Element;
```

---

_Document Owner: Architecture Team | Contracts are frozen at design freeze. Changes require PR + ADR. | 2026-07-27_
