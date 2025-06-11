import React from 'react';
import { Button } from './button';

const steps = [
  { id: 1, name: 'Welcome', action: 'welcome' },
  { id: 2, name: 'Dashboard Overview', action: 'dashboard' },
  { id: 3, name: 'Create Your First Job', action: 'create_job' },
];

function handleStart(action: string) {
  console.log(`Onboarding step: ${action}`);
}

const OnboardingTour = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="font-bold mb-2">Onboarding Tour</h2>
    <ul>
      {steps.map(option => (
        <li key={option.id} className="flex items-center justify-between mb-2">
          <span>{option.name}</span>
          <Button onClick={() => handleStart(option.action)} size="sm" aria-label={`Start ${option.name} step`}>Start</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default OnboardingTour; 