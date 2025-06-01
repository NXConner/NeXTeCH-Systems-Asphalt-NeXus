import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const workforce = [
  { id: 1, name: 'Crew A', status: 'Scheduled' },
  { id: 2, name: 'Crew B', status: 'Available' },
  // ...add more as needed
];

export default function WorkforceScheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workforce Scheduler</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {workforce.map(wf => (
            <li key={wf.id} className="flex justify-between items-center">
              <span>{wf.name}</span>
              <span className={wf.status === 'Scheduled' ? 'text-blue-600' : 'text-green-600'}>{wf.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 