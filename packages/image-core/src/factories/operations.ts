import type {
  CompressConfig,
  ResizeConfig,
  CropConfig,
  RotateConfig,
  FlipConfig,
  ConvertConfig,
  ProcessingOperation,
} from '@imageforge/types';

export function createCompressOperation(config: CompressConfig): ProcessingOperation {
  return { type: 'compress', config };
}

export function createResizeOperation(config: ResizeConfig): ProcessingOperation {
  return { type: 'resize', config };
}

export function createCropOperation(config: CropConfig): ProcessingOperation {
  return { type: 'crop', config };
}

export function createRotateOperation(config: RotateConfig): ProcessingOperation {
  return { type: 'rotate', config };
}

export function createFlipOperation(config: FlipConfig): ProcessingOperation {
  return { type: 'flip', config };
}

export function createConvertOperation(config: ConvertConfig): ProcessingOperation {
  return { type: 'convert', config };
}
