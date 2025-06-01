import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const analytics = [
  { id: 1, name: 'Predictive Maintenance', status: 'Enabled' },
  { id: 2, name: 'Cost Analysis', status: 'Enabled' },
  { id: 3, name: 'Custom Reports', status: 'Coming Soon' },
  // ...add more as needed
];

export default function AdvancedAnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {analytics.map(a => (
            <li key={a.id} className="flex justify-between items-center">
              <span>{a.name}</span>
              <span className={a.status === 'Enabled' ? 'text-green-600' : 'text-yellow-600'}>{a.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 