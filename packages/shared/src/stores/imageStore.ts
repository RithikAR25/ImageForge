import { createStore } from 'zustand/vanilla';
import type { ImageFile } from '@imageforge/types';

export interface ImageState {
  images: ReadonlyMap<string, ImageFile>;
  activeImageId: string | null;
  addImage: (image: ImageFile) => void;
  removeImage: (id: string) => void;
  setActiveImage: (id: string | null) => void;
  updateImage: (id: string, patch: Partial<ImageFile>) => void;
  clear: () => void;
}

export const imageStore = createStore<ImageState>()((set) => ({
  images: new Map(),
  activeImageId: null,

  addImage: (image) => {
    set((state) => {
      const newImages = new Map(state.images);
      newImages.set(image.id, image);
      return { images: newImages };
    });
  },

  removeImage: (id) => {
    set((state) => {
      const newImages = new Map(state.images);
      newImages.delete(id);
      return {
        images: newImages,
        activeImageId: state.activeImageId === id ? null : state.activeImageId,
      };
    });
  },

  setActiveImage: (id) => { set({ activeImageId: id }); },

  updateImage: (id, patch) => {
    set((state) => {
      const existing = state.images.get(id);
      if (!existing) return state;

      const newImages = new Map(state.images);
      newImages.set(id, { ...existing, ...patch });
      return { images: newImages };
    });
  },

  clear: () => { set({ images: new Map(), activeImageId: null }); },
}));
