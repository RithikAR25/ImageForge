import { createStore } from 'zustand/vanilla';
import type { BatchJob } from '@imageforge/types';

export interface BatchState {
  jobs: ReadonlyMap<string, BatchJob>;
  addJob: (job: BatchJob) => void;
  updateJob: (id: string, patch: Partial<BatchJob>) => void;
  removeJob: (id: string) => void;
  clearCompleted: () => void;
}

export const batchStore = createStore<BatchState>()((set) => ({
  jobs: new Map(),

  addJob: (job) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      newJobs.set(job.id, job);
      return { jobs: newJobs };
    });
  },

  updateJob: (id, patch) => {
    set((state) => {
      const existing = state.jobs.get(id);
      if (!existing) return state;

      const newJobs = new Map(state.jobs);
      newJobs.set(id, { ...existing, ...patch });
      return { jobs: newJobs };
    });
  },

  removeJob: (id) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      newJobs.delete(id);
      return { jobs: newJobs };
    });
  },

  clearCompleted: () => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      for (const [id, job] of newJobs.entries()) {
        if (job.status === 'complete' || job.status === 'cancelled') {
          newJobs.delete(id);
        }
      }
      return { jobs: newJobs };
    });
  },
}));
