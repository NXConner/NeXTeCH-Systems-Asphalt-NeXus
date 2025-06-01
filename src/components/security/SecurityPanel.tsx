import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const securityFeatures = [
  { id: '2fa', name: 'Two-Factor Authentication', status: 'Enabled' },
  { id: 'audit-log', name: 'Audit Log', status: 'Active' },
  { id: 'encryption', name: 'Data Encryption', status: 'Enabled' },
  // ...add more as needed
];

export default function SecurityPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {securityFeatures.map(f => (
            <li key={f.id} className="flex justify-between items-center">
              <span>{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 