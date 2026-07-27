export interface ImageFile {
  readonly id: string;
  readonly buffer: ArrayBuffer;
  readonly name: string;
  readonly mimeType: string;
  readonly width: number;
  readonly height: number;
  readonly fileSize: number;
  readonly exif: ExifData | null;
  readonly importedAt: Date;
  readonly isDuplicate: boolean;
  readonly uri: string;
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
