import { useEffect, useCallback } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

type ShortcutHandler = (event: KeyboardEvent) => void;

type Shortcut = {
  combo: KeyCombo;
  handler: ShortcutHandler;
  description: string;
};

export function useKeyboardShortcut(shortcuts: Shortcut[]) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find((shortcut) => {
        const { combo } = shortcut;
        return (
          event.key.toLowerCase() === combo.key.toLowerCase() &&
          !!event.ctrlKey === !!combo.ctrlKey &&
          !!event.shiftKey === !!combo.shiftKey &&
          !!event.altKey === !!combo.altKey &&
          !!event.metaKey === !!combo.metaKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.handler(event);
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const registerShortcut = useCallback(
    (shortcut: Shortcut) => {
      shortcuts.push(shortcut);
    },
    [shortcuts]
  );

  const unregisterShortcut = useCallback(
    (combo: KeyCombo) => {
      const index = shortcuts.findIndex(
        (shortcut) =>
          shortcut.combo.key === combo.key &&
          shortcut.combo.ctrlKey === combo.ctrlKey &&
          shortcut.combo.shiftKey === combo.shiftKey &&
          shortcut.combo.altKey === combo.altKey &&
          shortcut.combo.metaKey === combo.metaKey
      );

      if (index !== -1) {
        shortcuts.splice(index, 1);
      }
    },
    [shortcuts]
  );

  return {
    registerShortcut,
    unregisterShortcut,
  };
} 