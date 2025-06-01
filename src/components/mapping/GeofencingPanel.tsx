import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const geofences = [
  { id: 1, name: 'HQ Perimeter', status: 'Active' },
  { id: 2, name: 'Jobsite 12', status: 'Inactive' },
  // ...add more as needed
];

export default function GeofencingPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geofencing</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {geofences.map(gf => (
            <li key={gf.id} className="flex justify-between items-center">
              <span>{gf.name}</span>
              <span className={gf.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>{gf.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 