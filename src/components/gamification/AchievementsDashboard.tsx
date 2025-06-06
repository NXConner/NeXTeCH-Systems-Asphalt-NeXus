import React from 'react';
import AchievementBadge from '../ui/AchievementBadge';
import AchievementProgressBar from './AchievementProgressBar';

const achievements = [
  { name: 'Pavement Pro', tier: 'bronze', progress: 20, goal: 5, count: 1 },
  { name: 'Pressure Washing Wizard', tier: 'gold', progress: 80, goal: 50000, count: 40000 },
  { name: 'Sealcoat Star', tier: 'silver', progress: 60, goal: 15, count: 9 },
  { name: 'Crack Crusher', tier: 'bronze', progress: 25, goal: 100, count: 25 },
  { name: 'Drone Master', tier: 'bronze', progress: 10, goal: 1, count: 0 },
  { name: 'Estimate Expert', tier: 'bronze', progress: 10, goal: 5, count: 0 },
  { name: 'Inventory Guru', tier: 'bronze', progress: 0, goal: 5, count: 0 },
  { name: 'Client Closer', tier: 'bronze', progress: 0, goal: 3, count: 0 },
  { name: 'Photo Pro', tier: 'bronze', progress: 0, goal: 10, count: 0 },
  { name: 'Road Warrior', tier: 'bronze', progress: 0, goal: 5, count: 0 },
  { name: 'First Job', tier: 'bronze', progress: 100, goal: 1, count: 1 },
  { name: 'Eco Cleaner', tier: 'bronze', progress: 0, goal: 5, count: 0 },
  { name: 'Night Owl', tier: 'bronze', progress: 0, goal: 1, count: 0 },
  { name: 'Perfect PCI', tier: 'bronze', progress: 0, goal: 1, count: 0 },
  { name: 'Feedback Friend', tier: 'bronze', progress: 0, goal: 1, count: 0 },
];

const AchievementsDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Achievements Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((a, i) => (
          <div key={i} className="space-y-2">
            <AchievementBadge name={a.name} tier={a.tier as any} progress={a.progress} count={a.count} />
            <AchievementProgressBar progress={a.count} goal={a.goal} />
            <div className="text-xs text-muted-foreground">{a.count} / {a.goal} ({a.progress}%)</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsDashboard; 