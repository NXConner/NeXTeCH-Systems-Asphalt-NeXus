import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const dispatches = [
  { id: 1, route: 'Route A', status: 'En Route' },
  { id: 2, route: 'Route B', status: 'Scheduled' },
  // ...add more as needed
];

export default function DispatchCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch & Route Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {dispatches.map(d => (
            <li key={d.id} className="flex justify-between items-center">
              <span>{d.route}</span>
              <span className={d.status === 'En Route' ? 'text-green-600' : 'text-yellow-600'}>{d.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 