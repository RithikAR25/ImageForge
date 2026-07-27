import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import {
  ImagePipeline,
  WasmWorkerPool,
  BatchOrchestrator,
  FileImporter,
  Exporter,
  ThumbnailGenerator,
} from '@imageforge/image-core';
import { batchStore, imageStore } from '@imageforge/shared';

interface EngineContainer {
  pipeline: ImagePipeline;
  workerPool: WasmWorkerPool;
  batch: BatchOrchestrator;
  importer: FileImporter;
  exporter: Exporter;
  thumbnails: ThumbnailGenerator;
}

const EngineContext = createContext<EngineContainer | null>(null);

export interface ImageForgeProviderProps {
  children: ReactNode;
  services?: Partial<EngineContainer>; // For testing overrides
}

export function ImageForgeProvider({ children, services }: ImageForgeProviderProps): React.JSX.Element {
  const containerRef = useRef<EngineContainer | null>(null);

  // Lazy initialization of the engine container
  if (!containerRef.current) {
    const workerPool = services?.workerPool ?? new WasmWorkerPool({ wasmBaseUrl: '/wasm', workerScriptUrl: '/worker.js' });
    const batch = services?.batch ?? new BatchOrchestrator(
      workerPool,
      { getState: () => batchStore.getState() },
      async (imageId: string) => {
        await Promise.resolve();
        const image = imageStore.getState().images.get(imageId);
        if (!image) throw new Error(`Image ${imageId} not found`);
        return image.buffer;
      }
    );
    const importer = services?.importer ?? new FileImporter();
    const exporter = services?.exporter ?? new Exporter();
    const thumbnails = services?.thumbnails ?? new ThumbnailGenerator();
    const pipeline = services?.pipeline ?? new ImagePipeline(workerPool, []);

    containerRef.current = {
      workerPool,
      batch,
      importer,
      exporter,
      thumbnails,
      pipeline,
    };
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.workerPool.dispose();
        containerRef.current.batch.cancelAll();
      }
    };
  }, []);

  return (
    <EngineContext.Provider value={containerRef.current}>
      {children}
    </EngineContext.Provider>
  );
}

// Internal hook for consuming the context within this package
export function useEngineContainer(): EngineContainer {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error('useEngineContainer must be used within an ImageForgeProvider');
  }
  return context;
}
