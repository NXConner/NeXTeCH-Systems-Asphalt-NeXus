import React from 'react';
import UnifiedMapInterface from '../UnifiedMapInterface';

const MiniMapWidget = () => {
  return (
    <div style={{ width: 300, height: 200, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
      <UnifiedMapInterface width={300} height={200} />
    </div>
  );
};

export default MiniMapWidget; 