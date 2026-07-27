import type { ImageFile } from './core';

export interface StorageAdapter {
  saveImage(image: ImageFile): Promise<void>;
  getImage(id: string): Promise<ImageFile | null>;
  deleteImage(id: string): Promise<void>;
  getAllImages(): Promise<readonly ImageFile[]>;
  clear(): Promise<void>;
}
