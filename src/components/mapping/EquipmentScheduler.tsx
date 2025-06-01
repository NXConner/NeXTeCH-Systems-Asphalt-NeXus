import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const equipment = [
  { id: 1, name: 'Paver 3000', status: 'Scheduled' },
  { id: 2, name: 'Roller X', status: 'Available' },
  // ...add more as needed
];

export default function EquipmentScheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Scheduler</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {equipment.map(eq => (
            <li key={eq.id} className="flex justify-between items-center">
              <span>{eq.name}</span>
              <span className={eq.status === 'Scheduled' ? 'text-blue-600' : 'text-green-600'}>{eq.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 