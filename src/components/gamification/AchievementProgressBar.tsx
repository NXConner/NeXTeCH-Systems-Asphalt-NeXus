import React from 'react';

export default function AchievementProgressBar({ progress, goal }: { progress: number; goal: number }) {
  const percent = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  );
} 