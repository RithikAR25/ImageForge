import type { ResizeConfig } from '@imageforge/types';

export const RESIZE_PRESETS: Record<string, ResizeConfig> = {
  THUMBNAIL: { width: 150, height: 150, mode: 'cover', algorithm: 'bicubic', maintainAspectRatio: true },
  WEB_LARGE: { width: 1920, mode: 'fit', algorithm: 'lanczos3', maintainAspectRatio: true },
  INSTAGRAM_SQUARE: { width: 1080, height: 1080, mode: 'cover', algorithm: 'bicubic', maintainAspectRatio: true },
};
