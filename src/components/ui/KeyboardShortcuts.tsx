import React from 'react';
import { Button } from './button';

const shortcuts = [
  { id: 1, name: 'Open Search (Ctrl+K)', action: 'search' },
  { id: 2, name: 'Create Job (Ctrl+J)', action: 'job' },
  { id: 3, name: 'Open Notifications (Ctrl+N)', action: 'notifications' },
];

function handleShortcut(action: string) {
  console.log(`Keyboard shortcut: ${action}`);
}

const KeyboardShortcuts = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Keyboard Shortcuts</h2>
    <ul>
      {shortcuts.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleShortcut(option.action)} size="sm" aria-label={`Simulate ${option.name}`}>Simulate</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default KeyboardShortcuts; 