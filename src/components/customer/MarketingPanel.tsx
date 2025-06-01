import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const campaigns = [
  { id: 1, name: 'Summer Promo', status: 'Active' },
  { id: 2, name: 'Loyalty Rewards', status: 'Active' },
  { id: 3, name: 'Referral Program', status: 'Coming Soon' },
  // ...add more as needed
];

export default function MarketingPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing & Loyalty</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {campaigns.map(c => (
            <li key={c.id} className="flex justify-between items-center">
              <span>{c.name}</span>
              <span className={c.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}>{c.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 