import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const topics = [
  { id: 1, title: 'Best Practices for Crack Repair', posts: 12 },
  { id: 2, title: 'Eco-Friendly Pressure Washing', posts: 8 },
  { id: 3, title: 'Show Off Your Projects', posts: 20 },
  // ...add more as needed
];

export default function ForumBoard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Forum</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {topics.map(t => (
            <li key={t.id} className="flex justify-between items-center">
              <span>{t.title}</span>
              <span className="text-xs text-muted-foreground">{t.posts} posts</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 