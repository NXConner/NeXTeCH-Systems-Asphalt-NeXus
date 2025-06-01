import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const events = [
  { id: 1, title: 'Sealcoat Crew', date: '2024-07-01', type: 'workforce' },
  { id: 2, title: 'Paver Maintenance', date: '2024-07-02', type: 'equipment' },
  { id: 3, title: 'Rain Delay', date: '2024-07-03', type: 'weather' },
  // ...add more as needed
];

export default function CalendarScheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar & Scheduler</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map(event => (
            <li key={event.id} className="flex justify-between items-center">
              <span>{event.title}</span>
              <span className="text-xs text-muted-foreground">{event.date}</span>
              <span className="text-xs text-gray-500">{event.type}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 