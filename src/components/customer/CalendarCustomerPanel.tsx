import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const appointments = [
  { id: 1, date: '2024-07-10', status: 'Confirmed' },
  { id: 2, date: '2024-07-15', status: 'Pending' },
  // ...add more as needed
];

export default function CalendarCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments & Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {appointments.map(a => (
            <li key={a.id} className="flex justify-between items-center">
              <span>{a.date}</span>
              <span className={a.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}>{a.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 