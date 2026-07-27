import type { CompressConfig } from '@imageforge/types';

export const COMPRESSION_PRESETS: Record<string, CompressConfig> = {
  HIGH_QUALITY: { codec: 'jpeg', quality: 90, progressive: true },
  BALANCED: { codec: 'webp', quality: 75 },
  MAX_COMPRESSION: { codec: 'webp', quality: 50 },
  LOSSLESS: { codec: 'png', quality: 100 },
};
