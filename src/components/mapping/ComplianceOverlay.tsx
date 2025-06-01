import React from 'react';

// Example props: array of { lat, lng, type, warning }
export default function ComplianceOverlay({ data }: { data: Array<{ lat: number; lng: number; type: string; warning?: string }> }) {
  const getColor = (type: string) => {
    if (type === 'ADA') return 'bg-blue-400';
    if (type === 'VDOT') return 'bg-orange-400';
    return 'bg-gray-400';
  };
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {data.map((point, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-50 ${getColor(point.type)}`}
          style={{ left: `${point.lng}%`, top: `${point.lat}%`, width: 32, height: 32 }}
          title={point.warning || point.type}
        >
          {point.warning && (
            <span className="absolute left-8 top-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">{point.warning}</span>
          )}
        </div>
      ))}
    </div>
  );
} 