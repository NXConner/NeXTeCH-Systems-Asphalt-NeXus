import React from 'react';
import UnifiedMapInterface from '../UnifiedMapInterface';

const MiniMapWidget = () => {
  return (
    <div className="w-300 h-200 rounded-12 overflow-hidden shadow-md">
      <UnifiedMapInterface width={300} height={200} />
    </div>
  );
};

export default MiniMapWidget; 