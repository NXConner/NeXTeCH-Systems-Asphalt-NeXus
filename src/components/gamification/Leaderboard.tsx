import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const leaderboard = [
  { id: 1, name: 'Jane Doe', points: 1200 },
  { id: 2, name: 'John Smith', points: 1100 },
  { id: 3, name: 'Alex Lee', points: 950 },
  // ...add more as needed
];

export default function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal pl-4 space-y-2">
          {leaderboard.map((user, idx) => (
            <li key={user.id} className="flex justify-between items-center">
              <span>{user.name}</span>
              <span className="font-bold">{user.points} pts</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
} 