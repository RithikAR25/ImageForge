import { useMemo, useCallback } from 'react';
import { useStore } from 'zustand';
import { batchStore } from '@imageforge/shared';
import type { BatchJob, ProcessingOperation } from '@imageforge/types';
import { useEngineContainer } from '../context/EngineProvider';

export function useBatchQueue(): {
  jobs: readonly BatchJob[];
  enqueue: (imageId: string, pipeline: ProcessingOperation[]) => void;
  start: () => void;
  pause: () => void;
  cancelAll: () => void;
  progress: { completed: number; total: number; percent: number };
} {
  const container = useEngineContainer();
  const jobsMap = useStore(batchStore, (state) => state.jobs);
  
  const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);
  
  const progress = useMemo(() => {
    if (jobs.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = jobs.filter(j => j.status === 'complete').length;
    return {
      completed,
      total: jobs.length,
      percent: Math.round((completed / jobs.length) * 100),
    };
  }, [jobs]);

  const enqueue = useCallback((imageId: string, pipeline: ProcessingOperation[]) => {
    container.batch.enqueue(imageId, pipeline);
  }, [container]);

  const start = useCallback(() => {
    container.batch.start().catch(() => { /* handled internally */ });
  }, [container]);

  const pause = useCallback(() => {
    container.batch.pause();
  }, [container]);

  const cancelAll = useCallback(() => {
    container.batch.cancelAll();
  }, [container]);

  return {
    jobs,
    enqueue,
    start,
    pause,
    cancelAll,
    progress,
  };
}
