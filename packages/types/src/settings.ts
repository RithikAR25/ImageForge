export interface AppSettings {
  readonly theme: 'light' | 'dark' | 'system';
  readonly defaultCodec: 'jpeg' | 'webp' | 'png';
  readonly defaultQuality: number;
  readonly autoRotateByExif: boolean;
  readonly stripMetadataOnExport: boolean;
  readonly maxConcurrentJobs: number;
  readonly showFileSizeReduction: boolean;
  readonly language: string;
}
