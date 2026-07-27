import { useMemo } from 'react';
import { useStore } from 'zustand';
import { imageStore } from '@imageforge/shared';
import type { ImageFile } from '@imageforge/types';

export function useImages(): {
  images: ImageFile[];
  activeImageId: string | null;
  setActiveImage: (id: string | null) => void;
  removeImage: (id: string) => void;
  clear: () => void;
} {
  const imagesMap = useStore(imageStore, (state) => state.images);
  const activeImageId = useStore(imageStore, (state) => state.activeImageId);
  const setActiveImage = imageStore.getState().setActiveImage;
  const removeImage = imageStore.getState().removeImage;
  const clear = imageStore.getState().clear;

  const images = useMemo(() => Array.from(imagesMap.values()), [imagesMap]);

  return {
    images,
    activeImageId,
    setActiveImage,
    removeImage,
    clear,
  };
}
