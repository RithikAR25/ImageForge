import { createStore } from 'zustand/vanilla';
import type { AppSettings } from '@imageforge/types';

export interface SettingsState {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  defaultCodec: 'jpeg',
  defaultQuality: 80,
  autoRotateByExif: true,
  stripMetadataOnExport: false,
  maxConcurrentJobs: 4,
  showFileSizeReduction: true,
  language: 'en-US',
};

export const settingsStore = createStore<SettingsState>()((set) => ({
  settings: defaultSettings,

  updateSettings: (patch) => {
    set((state) => ({
      settings: { ...state.settings, ...patch },
    }));
  },

  resetSettings: () => { set({ settings: defaultSettings }); },
}));
