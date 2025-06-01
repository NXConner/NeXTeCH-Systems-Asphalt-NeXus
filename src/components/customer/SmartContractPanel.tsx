import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const contracts = [
  { id: 1, name: 'Maintenance Agreement', status: 'Signed' },
  { id: 2, name: 'Warranty Contract', status: 'Pending' },
  // ...add more as needed
];

export default function SmartContractPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {contracts.map(c => (
            <li key={c.id} className="flex justify-between items-center">
              <span>{c.name}</span>
              <span className={c.status === 'Signed' ? 'text-green-600' : 'text-yellow-600'}>{c.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 