import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const rewards = [
  { id: 'premium-theme', name: 'Premium Theme', trigger: 'Gold-tier achievement' },
  { id: 'branding-boost', name: 'Branding Boost', trigger: '10+ contracts' },
  { id: 'cloud-storage', name: 'Cloud Storage Bonus', trigger: 'Photo Pro achievement' },
  // ...add more as needed
];

export default function RewardsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlocked Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {rewards.map(r => (
            <li key={r.id} className="flex justify-between items-center">
              <span>{r.name}</span>
              <span className="text-xs text-muted-foreground">{r.trigger}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 