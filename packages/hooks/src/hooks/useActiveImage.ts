import { useStore } from 'zustand';
import { imageStore } from '@imageforge/shared';
import type { ImageFile } from '@imageforge/types';

export function useActiveImage(): ImageFile | null {
  return useStore(imageStore, (state) => {
    if (!state.activeImageId) return null;
    return state.images.get(state.activeImageId) ?? null;
  });
}
