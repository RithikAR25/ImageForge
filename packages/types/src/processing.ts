import type { ImageFile } from './core';

export type ProcessingOperation =
  | { readonly type: 'compress'; readonly config: CompressConfig }
  | { readonly type: 'resize'; readonly config: ResizeConfig }
  | { readonly type: 'crop'; readonly config: CropConfig }
  | { readonly type: 'rotate'; readonly config: RotateConfig }
  | { readonly type: 'flip'; readonly config: FlipConfig }
  | { readonly type: 'convert'; readonly config: ConvertConfig };

export interface CompressConfig {
  readonly codec: 'jpeg' | 'webp' | 'png' | 'avif';
  readonly quality: number;
  readonly targetSizeKb?: number;
  readonly progressive?: boolean;
}

export interface ResizeConfig {
  readonly width?: number;
  readonly height?: number;
  readonly percentage?: number;
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
  readonly lossless: boolean;
  readonly expand: boolean;
}

export interface FlipConfig {
  readonly direction: 'horizontal' | 'vertical' | 'both';
}

export interface ConvertConfig {
  readonly format: 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp';
  readonly preserveMetadata: boolean;
}

export interface ProcessingResult {
  readonly output: ImageFile;
  readonly appliedOperations: readonly ProcessingOperation[];
  readonly duration: number;
  readonly inputSize: number;
  readonly outputSize: number;
}
