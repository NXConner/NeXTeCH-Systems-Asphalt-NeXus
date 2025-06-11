import React from 'react';
import { Button } from './button';

const apiEndpoints = [
  { id: 1, method: 'GET', path: '/jobs', action: 'Test GET /jobs' },
  { id: 2, method: 'POST', path: '/vehicles', action: 'Test POST /vehicles' },
  { id: 3, method: 'GET', path: '/forum', action: 'Test GET /forum' }
];

export default function API() {
  const handleTest = (action: string) => {
    console.log(`API test: ${action}`);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">API</h2>
      <ul className="space-y-1">
        {apiEndpoints.map(endpoint => (
          <li key={endpoint.id} className="flex justify-between items-center">
            <span>{endpoint.method} {endpoint.path}</span>
            <Button onClick={() => handleTest(endpoint.action)}>Test</Button>
          </li>
        ))}
      </ul>
    </div>
  );
} 