import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const documents = [
  { id: 1, name: 'OSHA Certificate', status: 'Valid' },
  { id: 2, name: 'VDOT Permit', status: 'Expired' },
  // ...add more as needed
];

export default function DocumentCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Documents (Customer)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {documents.map(doc => (
            <li key={doc.id} className="flex justify-between items-center">
              <span>{doc.name}</span>
              <span className={doc.status === 'Valid' ? 'text-green-600' : 'text-red-600'}>{doc.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 