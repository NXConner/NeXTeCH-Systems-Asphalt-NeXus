import React from 'react';
import { Button } from './button';

const growthMetrics = [
  { id: 1, name: 'User Growth', value: '15%' },
  { id: 2, name: 'Revenue Growth', value: '20%' },
  { id: 3, name: 'Engagement Growth', value: '10%' }
];

export default function Growth() {
  const handleRefresh = (id: number) => {
    console.log(`Refresh growth metric: ${id}`);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Growth</h2>
      <ul className="space-y-1">
        {growthMetrics.map(metric => (
          <li key={metric.id} className="flex justify-between items-center">
            <span>{metric.name}: {metric.value}</span>
            <Button onClick={() => handleRefresh(metric.id)}>Refresh</Button>
          </li>
        ))}
      </ul>
    </div>
  );
} 