// Landing page for Fleet Asphalt Nexus
// Requires: react-router-dom, shadcn/ui
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const features = [
  'CRM & Customer Management',
  'Estimates & Invoicing',
  'Fleet & Inventory Tracking',
  'Job Scheduling & Time Tracking',
  'Document Management',
  'Advanced Analytics',
  'Mobile Optimization',
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="w-full py-6 px-8 flex justify-between items-center bg-white/80 shadow-sm">
        <div className="text-2xl font-bold text-blue-700 tracking-tight">Asphalt-NexTech_Systems</div>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <section className="max-w-3xl w-full text-center mt-16 mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Asphalt Business Management, Reimagined</h1>
          <p className="text-lg text-gray-600 mb-8">All-in-one platform for CRM, estimates, fleet, jobs, analytics, and more. Built for modern paving and asphalt companies.</p>
          <Button size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/login')}>Get Started</Button>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {features.map((feature) => (
            <Card key={feature} className="p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="text-xl font-semibold text-blue-700 mb-2">{feature}</div>
            </Card>
          ))}
        </section>
      </main>
      <footer className="w-full py-4 text-center text-gray-500 text-sm bg-white/70 border-t">© {new Date().getFullYear()} Asphalt-NexTech_Systems. All rights reserved.</footer>
    </div>
  );
};

export default Landing; 