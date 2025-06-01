import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const modules = [
  { id: 1, name: 'OSHA 10', status: 'Completed' },
  { id: 2, name: 'PPE Training', status: 'In Progress' },
  // ...add more as needed
];

export default function TrainingModulePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {modules.map(m => (
            <li key={m.id} className="flex justify-between items-center">
              <span>{m.name}</span>
              <span className={m.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>{m.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 