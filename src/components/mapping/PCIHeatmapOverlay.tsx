import React from 'react';

// Example props: array of { lat, lng, pciScore }
export default function PCIHeatmapOverlay({ data }: { data: Array<{ lat: number; lng: number; pciScore: number }> }) {
  // Color scale: green (good) -> yellow (fair) -> red (poor)
  const getColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-400';
    return 'bg-red-500';
  };
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {data.map((point, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-60 ${getColor(point.pciScore)}`}
          style={{ left: `${point.lng}%`, top: `${point.lat}%`, width: 24, height: 24 }}
          title={`PCI: ${point.pciScore}`}
        />
      ))}
    </div>
  );
} 