import { useCallback } from 'react';
import { useStore } from 'zustand';
import { historyStore, imageStore } from '@imageforge/shared';

export function useHistory(imageId: string): {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
} {
  const entriesMap = useStore(historyStore, (state) => state.entries);
  const history = entriesMap.get(imageId);
  
  const canUndo = !!(history && history.length > 0);
  const canRedo = historyStore.getState().canRedo(imageId);

  const undo = useCallback(() => {
    const lastEntry = historyStore.getState().undo(imageId);
    if (lastEntry) {
      // Revert the image state
      imageStore.getState().updateImage(imageId, lastEntry.beforeSnapshot);
    }
  }, [imageId]);

  const redo = useCallback(() => {
    const nextEntry = historyStore.getState().redo(imageId);
    if (nextEntry) {
      // Apply the image state
      imageStore.getState().updateImage(imageId, nextEntry.afterSnapshot);
    }
  }, [imageId]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
