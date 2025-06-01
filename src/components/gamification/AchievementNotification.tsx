import React from 'react';

export default function AchievementNotification({ achievement, onClose }: { achievement: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 bg-blue-700 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center gap-2 animate-bounce-in">
      <span>🏆 Achievement Unlocked: {achievement}</span>
      <button className="ml-2 text-white font-bold" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
} 