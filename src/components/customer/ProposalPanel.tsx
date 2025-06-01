import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const proposals = [
  { id: 1, name: 'Sealcoating Project', status: 'Pending Signature' },
  { id: 2, name: 'Paving Project', status: 'Signed' },
  // ...add more as needed
];

export default function ProposalPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposals & Bids</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {proposals.map(p => (
            <li key={p.id} className="flex justify-between items-center">
              <span>{p.name}</span>
              <span className={p.status === 'Signed' ? 'text-green-600' : 'text-yellow-600'}>{p.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 