import React from 'react';
import { Button } from './button';

const supportOptions = [
  { id: 1, name: 'Contact Support', action: 'contact' },
  { id: 2, name: 'Help Center', action: 'help' },
  { id: 3, name: 'Live Chat', action: 'chat' },
];

function handleSupport(action: string) {
  console.log(`Support action: ${action}`);
}

const Support = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Support</h2>
    <ul>
      {supportOptions.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleSupport(option.action)} size="sm">Initiate</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default Support; 