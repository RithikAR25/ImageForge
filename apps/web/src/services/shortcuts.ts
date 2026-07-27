import { useEffect } from 'react';
import { useActiveImage } from '@imageforge/hooks';
import { historyStore } from '@imageforge/shared';

export function useKeyboardShortcuts() {
  const activeImage = useActiveImage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!cmdOrCtrl) return;

      // Undo: Cmd/Ctrl + Z
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (activeImage) {
          historyStore.getState().undo(activeImage.id);
        }
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        if (activeImage) {
          historyStore.getState().redo(activeImage.id);
        }
      }
      
      // Export (mock): Cmd/Ctrl + S
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        // In a real app, we would trigger an export
        console.log('Exporting...', activeImage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);
}
