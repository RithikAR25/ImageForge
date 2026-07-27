import type { ImageFile } from '@imageforge/types';
import JSZip from 'jszip';
import { ProcessingError } from '../errors/translators';

export class Exporter {
  public downloadSingle(image: ImageFile): void {
    if (typeof document === 'undefined') return;

    const blob = new Blob([image.buffer], { type: image.mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
  }

  public async downloadZip(images: readonly ImageFile[], filename = 'export.zip'): Promise<void> {
    if (images.length === 0) return;

    try {
      const zip = new JSZip();
      
      for (const img of images) {
        zip.file(img.name, img.buffer);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      
      if (typeof document !== 'undefined') {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
      }
    } catch (error) {
      throw new ProcessingError('PROCESSING_FAILED', 'Failed to generate ZIP', error);
    }
  }
}
