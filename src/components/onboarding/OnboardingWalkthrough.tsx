import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const steps = [
  { title: 'Dashboard', description: 'Overview of your business, quick stats, and navigation.' },
  { title: 'Jobs', description: 'Manage and schedule all your projects and jobs.' },
  { title: 'Estimates', description: 'Create, track, and convert estimates to jobs.' },
  { title: 'CRM', description: 'Track leads, customers, and follow-ups.' },
  { title: 'Inventory', description: 'Audit, scan, and manage materials and supplies.' },
  { title: 'Fleet', description: 'Monitor vehicles, GPS, and maintenance.' },
  { title: 'Reports', description: 'View analytics, export data, and build custom reports.' },
  { title: 'Settings', description: 'Configure integrations, users, and preferences.' },
];

export default function OnboardingWalkthrough() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(() => !localStorage.getItem('onboardingComplete'));

  useEffect(() => {
    if (!visible) return;
    if (localStorage.getItem('onboardingComplete')) setVisible(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{steps[step].title}</h2>
        <p className="mb-6 text-muted-foreground">{steps[step].description}</p>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)}>Next</Button>
          ) : (
            <Button onClick={() => setStep(0)}>Finish</Button>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => {
            localStorage.setItem('onboardingComplete', 'true');
            setVisible(false);
          }}
        >
          Exit Onboarding
        </Button>
      </div>
    </div>
  );
} 