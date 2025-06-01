import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import AchievementBadge from '../ui/AchievementBadge';

const achievements = [
  { id: 'pavement-pro', name: 'Pavement Pro', tier: 'Bronze', progress: 5, goal: 25 },
  { id: 'pressure-wash-wizard', name: 'Pressure Washing Wizard', tier: 'Silver', progress: 10000, goal: 50000 },
  { id: 'sealcoat-star', name: 'Sealcoat Star', tier: 'Gold', progress: 50, goal: 50 },
  // ...add more as needed
];

export default function AchievementsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(a => (
            <div key={a.id} className="flex items-center gap-4">
              <AchievementBadge name={a.name} tier={a.tier} />
              <div className="flex-1">
                <div className="font-medium">{a.name} ({a.tier})</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (a.progress / a.goal) * 100)}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{a.progress} / {a.goal}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 