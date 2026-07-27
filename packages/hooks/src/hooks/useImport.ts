import { useState, useCallback } from 'react';
import { imageStore } from '@imageforge/shared';
import { useEngineContainer } from '../context/EngineProvider';

export function useImport(): {
  importFiles: (files: FileList) => Promise<void>;
  isImporting: boolean;
  progress: number;
  error: Error | null;
} {
  const container = useEngineContainer();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const importFiles = useCallback(async (files: FileList) => {
    setIsImporting(true);
    setProgress(0);
    setError(null);
    
    try {
      const newImages = [];
      const total = files.length;
      
      for (let i = 0; i < total; i++) {
        const file = files[i];
        if (file) {
          const image = await container.importer.importFile(file);
          newImages.push(image);
        }
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      // Add to store
      const store = imageStore.getState();
      newImages.forEach(img => { store.addImage(img); });
      
      // Auto-select the first imported image if none is selected
      if (!store.activeImageId && newImages.length > 0 && newImages[0]) {
        store.setActiveImage(newImages[0].id);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsImporting(false);
      setProgress(100);
    }
  }, [container]);

  return {
    importFiles,
    isImporting,
    progress,
    error,
  };
}
