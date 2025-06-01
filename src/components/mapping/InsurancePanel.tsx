import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const policies = [
  { id: 1, name: 'General Liability', status: 'Active' },
  { id: 2, name: 'Equipment Warranty', status: 'Expired' },
  // ...add more as needed
];

export default function InsurancePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance & Warranty</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {policies.map(p => (
            <li key={p.id} className="flex justify-between items-center">
              <span>{p.name}</span>
              <span className={p.status === 'Active' ? 'text-green-600' : 'text-red-600'}>{p.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 