import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const features = [
  { id: 1, name: 'Offline Mode', status: 'Available' },
  { id: 2, name: 'Push Notifications', status: 'Coming Soon' },
  // ...add more as needed
];

export default function PWAPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile App & PWA</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map(f => (
            <li key={f.id} className="flex justify-between items-center">
              <span>{f.name}</span>
              <span className={f.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}>{f.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 