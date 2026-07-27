import { useState, useCallback, useRef } from 'react';
import type { ImageFile, ProcessingOperation, ProcessingResult } from '@imageforge/types';
import { ImagePipeline } from '@imageforge/image-core';
import { useEngineContainer } from '../context/EngineProvider';

export function useImageProcessor(): {
  process: (image: ImageFile, ops: ProcessingOperation[], signal?: AbortSignal) => Promise<ProcessingResult>;
  isProcessing: boolean;
  progress: number;
  error: Error | null;
  cancel: () => void;
  reset: () => void;
} {
  const container = useEngineContainer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const process = useCallback(async (
    image: ImageFile,
    ops: ProcessingOperation[],
    signal?: AbortSignal
  ): Promise<ProcessingResult> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    abortControllerRef.current = new AbortController();
    
    // Combine signals if one is provided
    const compositeSignal = signal 
      ? combineSignals(signal, abortControllerRef.current.signal) 
      : abortControllerRef.current.signal;

    try {
      const pipeline = new ImagePipeline(container.workerPool, ops);
      // We don't have progress reporting out of ImagePipeline yet, but we stub it.
      // A more complete implementation might listen to WasmWorkerPool events.
      setProgress(10); 
      const result = await pipeline.execute(image, compositeSignal);
      setProgress(100);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [container]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setIsProcessing(false);
    setProgress(0);
    setError(null);
  }, [cancel]);

  return {
    process,
    isProcessing,
    progress,
    error,
    cancel,
    reset,
  };
}

function combineSignals(signal1: AbortSignal, signal2: AbortSignal): AbortSignal {
  if (signal1.aborted) return signal1;
  if (signal2.aborted) return signal2;

  const controller = new AbortController();
  const onAbort = () => {
    controller.abort();
    signal1.removeEventListener('abort', onAbort);
    signal2.removeEventListener('abort', onAbort);
  };

  signal1.addEventListener('abort', onAbort, { once: true });
  signal2.addEventListener('abort', onAbort, { once: true });

  return controller.signal;
}
