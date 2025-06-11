import React from 'react';
import { Button } from './button';

const analytics = [
  { id: 1, name: 'User Retention', action: 'retention' },
  { id: 2, name: 'Churn Rate', action: 'churn' },
  { id: 3, name: 'Lifetime Value', action: 'lifetime' },
];

function handleView(action: string) {
  console.log(`View analytics: ${action}`);
}

const AdvancedAnalytics = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Advanced Analytics</h2>
    <ul>
      {analytics.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleView(option.action)} size="sm">View</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default AdvancedAnalytics; 