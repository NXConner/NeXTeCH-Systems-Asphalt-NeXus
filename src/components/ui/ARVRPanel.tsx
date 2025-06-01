import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

const features = [
  { id: 1, name: 'AR Measurement', status: 'Coming Soon' },
  { id: 2, name: 'VR Training', status: 'Coming Soon' },
  // ...add more as needed
];

export default function ARVRPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AR/VR Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map(f => (
            <li key={f.id} className="flex justify-between items-center">
              <span>{f.name}</span>
              <span className="text-yellow-600">{f.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 