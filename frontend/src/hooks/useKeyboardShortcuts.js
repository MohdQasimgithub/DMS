import { useEffect } from 'react';

/**
 * Global keyboard shortcuts for the DMS application.
 * Ctrl+N = New / Add
 * Escape = Close dialog
 * Ctrl+S = Save (when in form)
 */
export const useKeyboardShortcuts = ({ onNew, onClose, onSave } = {}) => {
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+N — open new form
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        onNew?.();
      }
      // Escape — close dialog
      if (e.key === 'Escape') {
        onClose?.();
      }
      // Ctrl+S — save form
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNew, onClose, onSave]);
};
