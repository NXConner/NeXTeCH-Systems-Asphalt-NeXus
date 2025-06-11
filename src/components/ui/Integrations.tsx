import React from 'react';
import { Button } from './button';

const integrations = [
  { id: 1, name: 'Google Drive', action: 'google_drive' },
  { id: 2, name: 'QuickBooks', action: 'quickbooks' },
  { id: 3, name: 'Zapier', action: 'zapier' },
];

function handleConnect(action: string) {
  console.log(`Connect integration: ${action}`);
}

const Integrations = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Integrations</h2>
    <ul>
      {integrations.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleConnect(option.action)} size="sm">Connect</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default Integrations; 