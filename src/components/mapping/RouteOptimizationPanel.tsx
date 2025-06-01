import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const routes = [
  { id: 1, name: 'Route A', stops: 8, optimized: true },
  { id: 2, name: 'Route B', stops: 5, optimized: false },
  // ...add more as needed
];

export default function RouteOptimizationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {routes.map(route => (
            <li key={route.id} className="flex justify-between items-center">
              <span>{route.name}</span>
              <span className={route.optimized ? 'text-green-600' : 'text-yellow-600'}>
                {route.optimized ? 'Optimized' : 'Needs Optimization'}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 