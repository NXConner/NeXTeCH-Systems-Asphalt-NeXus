import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const apis = [
  { id: 'crm', name: 'CRM API', status: 'Available' },
  { id: 'mapping', name: 'Mapping API', status: 'Available' },
  { id: 'analytics', name: 'Analytics API', status: 'Coming Soon' },
  // ...add more as needed
];

export default function OpenAPIExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open API & Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {apis.map(api => (
            <li key={api.id} className="flex justify-between items-center">
              <span>{api.name}</span>
              <span className="text-xs text-muted-foreground">{api.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 