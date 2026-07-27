import { createStore } from 'zustand/vanilla';
import type { HistoryEntry } from '@imageforge/types';

export interface HistoryState {
  entries: ReadonlyMap<string, readonly HistoryEntry[]>;
  canUndo: (imageId: string) => boolean;
  canRedo: (imageId: string) => boolean; // Assuming future implementation of redo stack
  push: (entry: HistoryEntry) => void;
  undo: (imageId: string) => HistoryEntry | null;
  redo: (imageId: string) => HistoryEntry | null;
  clearHistory: (imageId: string) => void;
}

export const historyStore = createStore<HistoryState>()((set, get) => ({
  entries: new Map(),

  canUndo: (imageId) => {
    const history = get().entries.get(imageId);
    return !!(history && history.length > 0);
  },

  canRedo: () => false, // Placeholder for actual redo logic

  push: (entry) => {
    set((state) => {
      const newEntries = new Map(state.entries);
      const existing = newEntries.get(entry.imageId) ?? [];
      newEntries.set(entry.imageId, [...existing, entry]);
      return { entries: newEntries };
    });
  },

  undo: (imageId) => {
    let lastEntry: HistoryEntry | null = null;
    set((state) => {
      const history = state.entries.get(imageId);
      if (!history || history.length === 0) return state;

      lastEntry = history[history.length - 1] ?? null;
      const newEntries = new Map(state.entries);
      newEntries.set(imageId, history.slice(0, -1));
      return { entries: newEntries };
    });
    return lastEntry;
  },

  redo: () => null, // Placeholder for actual redo logic

  clearHistory: (imageId) => {
    set((state) => {
      const newEntries = new Map(state.entries);
      newEntries.delete(imageId);
      return { entries: newEntries };
    });
  },
}));
