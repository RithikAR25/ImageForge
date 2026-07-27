import type {
  CompressConfig,
  ResizeConfig,
  CropConfig,
  RotateConfig,
  FlipConfig,
  ConvertConfig,
} from '@imageforge/types';

/**
 * Internal abstraction separating execution orchestration from pixel manipulation.
 * Future backends (Squoosh, Canvas, WebCodecs) will implement this.
 */
export interface ImageBackend {
  readonly capabilities: {
    readonly formats: readonly string[];
    readonly version: string;
  };

  compress(buffer: ArrayBuffer, config: CompressConfig): Promise<ArrayBuffer>;
  resize(buffer: ArrayBuffer, config: ResizeConfig): Promise<ArrayBuffer>;
  crop(buffer: ArrayBuffer, config: CropConfig): Promise<ArrayBuffer>;
  rotate(buffer: ArrayBuffer, config: RotateConfig): Promise<ArrayBuffer>;
  flip(buffer: ArrayBuffer, config: FlipConfig): Promise<ArrayBuffer>;
  convert(buffer: ArrayBuffer, config: ConvertConfig): Promise<ArrayBuffer>;
}
