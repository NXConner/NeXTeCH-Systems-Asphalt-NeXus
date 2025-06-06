import React from 'react';
import AchievementBadge from '../ui/AchievementBadge';

const badges = [
  { name: 'Pressure Washing Wizard', tier: 'gold' },
  { name: 'Sealcoat Star', tier: 'silver' },
  { name: 'Crack Crusher', tier: 'bronze' },
  // Add more as earned
];

export default function BadgeGallery() {
  if (!badges.length) return <div className="text-muted-foreground">No badges earned yet.</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Badge Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((b, i) => (
          <AchievementBadge key={i} name={b.name} tier={b.tier as any} />
        ))}
      </div>
    </div>
  );
} 