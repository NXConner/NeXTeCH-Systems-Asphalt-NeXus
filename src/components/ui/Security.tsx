import React from 'react';
import { Button } from './button';

const securityOptions = [
  { id: 1, name: 'Enable 2FA', action: '2fa' },
  { id: 2, name: 'Change Password', action: 'password' },
  { id: 3, name: 'View Audit Logs', action: 'audit' },
];

function handleSecurity(action: string) {
  console.log(`Security action: ${action}`);
}

const Security = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Security</h2>
    <ul>
      {securityOptions.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleSecurity(option.action)} size="sm">Trigger</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default Security; 