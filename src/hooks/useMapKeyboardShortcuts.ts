import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutActions {
  zoomIn?: () => void;
  zoomOut?: () => void;
  panLeft?: () => void;
  panRight?: () => void;
  panUp?: () => void;
  panDown?: () => void;
  toggleFullscreen?: () => void;
  resetView?: () => void;
  toggleDrawing?: () => void;
  escape?: () => void;
  toggleDarkMode?: () => void;
  save?: () => void;
}

export const useMapKeyboardShortcuts = (actions: KeyboardShortcutActions, enabled: boolean = true) => {
  const actionsRef = useRef(actions);
  
  // Update the ref when actions change
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle keyboard shortcuts when typing in an input, textarea, etc.
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement instanceof HTMLSelectElement
    ) {
      return;
    }
    
    const { key, ctrlKey, shiftKey } = event;
    const currentActions = actionsRef.current;
    
    switch (key.toLowerCase()) {
      case '=':
      case '+':
        if (currentActions.zoomIn) {
          event.preventDefault();
          currentActions.zoomIn();
        }
        break;
      case '-':
      case '_':
        if (currentActions.zoomOut) {
          event.preventDefault();
          currentActions.zoomOut();
        }
        break;
      case 'arrowleft':
        if (currentActions.panLeft) {
          event.preventDefault();
          currentActions.panLeft();
        }
        break;
      case 'arrowright':
        if (currentActions.panRight) {
          event.preventDefault();
          currentActions.panRight();
        }
        break;
      case 'arrowup':
        if (currentActions.panUp) {
          event.preventDefault();
          currentActions.panUp();
        }
        break;
      case 'arrowdown':
        if (currentActions.panDown) {
          event.preventDefault();
          currentActions.panDown();
        }
        break;
      case 'f':
        if (currentActions.toggleFullscreen && ctrlKey) {
          event.preventDefault();
          currentActions.toggleFullscreen();
        }
        break;
      case 'r':
        if (currentActions.resetView && ctrlKey) {
          event.preventDefault();
          currentActions.resetView();
        }
        break;
      case 'd':
        if (currentActions.toggleDrawing && ctrlKey) {
          event.preventDefault();
          currentActions.toggleDrawing();
        }
        break;
      case 'escape':
        if (currentActions.escape) {
          currentActions.escape();
        }
        break;
      case 't':
        if (currentActions.toggleDarkMode && ctrlKey) {
          event.preventDefault();
          currentActions.toggleDarkMode();
        }
        break;
      case 's':
        if (currentActions.save && ctrlKey) {
          event.preventDefault();
          currentActions.save();
        }
        break;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Return the list of available shortcuts for documentation
  return {
    shortcuts: [
      { key: '+/=', description: 'Zoom in' },
      { key: '-/_', description: 'Zoom out' },
      { key: 'Arrow keys', description: 'Pan the map' },
      { key: 'Ctrl+F', description: 'Toggle fullscreen' },
      { key: 'Ctrl+R', description: 'Reset view' },
      { key: 'Ctrl+D', description: 'Toggle drawing mode' },
      { key: 'Esc', description: 'Exit current mode' },
      { key: 'Ctrl+T', description: 'Toggle dark mode' },
      { key: 'Ctrl+S', description: 'Save current state' }
    ]
  };
};
