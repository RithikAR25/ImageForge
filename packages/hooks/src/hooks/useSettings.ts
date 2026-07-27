import { useCallback } from 'react';
import { useStore } from 'zustand';
import { settingsStore } from '@imageforge/shared';
import type { AppSettings } from '@imageforge/types';

export function useSettings(): {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
} {
  const settings = useStore(settingsStore, (state) => state.settings);
  
  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    settingsStore.getState().updateSettings(patch);
  }, []);

  return {
    settings,
    updateSettings,
  };
}
