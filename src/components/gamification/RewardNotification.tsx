import React from 'react';

export default function RewardNotification({ reward, onClose }: { reward: string; onClose: () => void }) {
  return (
    <div className="fixed top-20 right-4 bg-green-700 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center gap-2 animate-bounce-in">
      <span>🎁 Reward Unlocked: {reward}</span>
      <button className="ml-2 text-white font-bold" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
} 