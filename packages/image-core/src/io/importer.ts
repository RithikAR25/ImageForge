import type { ImageFile } from '@imageforge/types';
import { generateId } from '@imageforge/shared';
import * as exifr from 'exifr';
import { ImportError } from '../errors/translators';

interface ExifResult {
  Make?: string;
  Model?: string;
  Orientation?: number;
  DateTimeOriginal?: string | number | Date;
  latitude?: number;
  longitude?: number;
  ISO?: number;
  FocalLength?: number;
}

export class FileImporter {
  public async importFile(file: File, signal?: AbortSignal): Promise<ImageFile> {
    if (signal?.aborted) throw new ImportError('READ_FAILED', 'Import aborted');

    try {
      const buffer = await file.arrayBuffer();
      
      let exif: ExifResult | null = null;
      try {
        // Only attempt to parse EXIF for JPEG/TIFF/HEIC
        if (file.type.includes('jpeg') || file.type.includes('tiff') || file.type.includes('heic')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          exif = await exifr.parse(buffer, ['Make', 'Model', 'Orientation', 'DateTimeOriginal', 'latitude', 'longitude', 'ISO', 'FocalLength']);
        }
      } catch {
        // Exif parsing failure shouldn't abort the entire import
      }

      return {
        id: generateId(),
        buffer,
        name: file.name,
        mimeType: file.type,
        width: 0, // Placeholder: typically need an ImageBitmap or decoder to get real dimensions without EXIF
        height: 0,
        fileSize: file.size,
        exif: exif ? {
          make: exif.Make ?? null,
          model: exif.Model ?? null,
          orientation: exif.Orientation ?? null,
          dateTaken: exif.DateTimeOriginal ? new Date(exif.DateTimeOriginal) : null,
          gpsLat: exif.latitude ?? null,
          gpsLon: exif.longitude ?? null,
          iso: exif.ISO ?? null,
          focalLength: exif.FocalLength ?? null,
        } : null,
        importedAt: new Date(),
        isDuplicate: false,
        uri: typeof URL !== 'undefined' ? URL.createObjectURL(file) : `file://${file.name}`,
        colorSpace: 'unknown',
      };
    } catch (error) {
      throw new ImportError('READ_FAILED', 'Failed to read file buffer', error);
    }
  }

  public async *importFiles(files: FileList, signal?: AbortSignal): AsyncIterable<ImageFile> {
    for (let i = 0; i < files.length; i++) {
      if (signal?.aborted) throw new ImportError('READ_FAILED', 'Import aborted');
      const file = files.item(i);
      if (file) {
        yield await this.importFile(file, signal);
      }
    }
  }
}

export class ThumbnailGenerator {
  public async generate(image: ImageFile): Promise<string> {
    await Promise.resolve(); // Simulate async work
    // In a real environment, we'd use Canvas API or a lightweight decoder to generate a blob URL.
    // For this architecture mock, return the original URI.
    return image.uri;
  }
}

export class DuplicateDetector {
  public check(image: ImageFile, existing: readonly ImageFile[]): boolean {
    return existing.some((e) => e.name === image.name && e.fileSize === image.fileSize);
  }
}
