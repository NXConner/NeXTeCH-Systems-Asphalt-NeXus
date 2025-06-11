import React from 'react';
import { Button } from './button';

const customizationOptions = [
  { id: 1, name: 'Theme', action: 'theme' },
  { id: 2, name: 'Layout', action: 'layout' },
  { id: 3, name: 'Language', action: 'language' },
];

function handleCustomize(action: string) {
  console.log(`Customization action: ${action}`);
}

const Customization = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Customization</h2>
    <ul>
      {customizationOptions.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleCustomize(option.action)} size="sm">Apply</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default Customization; 