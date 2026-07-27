import { useState, useCallback } from 'react';
import type { ImageFile } from '@imageforge/types';
import { useEngineContainer } from '../context/EngineProvider';

export function useExport(): {
  downloadSingle: (image: ImageFile) => void;
  downloadZip: (images: readonly ImageFile[], filename?: string) => Promise<void>;
  isExporting: boolean;
  progress: number;
  error: Error | null;
} {
  const container = useEngineContainer();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const downloadSingle = useCallback((image: ImageFile) => {
    try {
      container.exporter.downloadSingle(image);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [container]);

  const downloadZip = useCallback(async (images: readonly ImageFile[], filename?: string) => {
    setIsExporting(true);
    setProgress(0);
    setError(null);
    
    try {
      setProgress(50); // jszip takes time
      await container.exporter.downloadZip(images, filename);
      setProgress(100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      setIsExporting(false);
    }
  }, [container]);

  return {
    downloadSingle,
    downloadZip,
    isExporting,
    progress,
    error,
  };
}
