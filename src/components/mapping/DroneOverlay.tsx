import React from 'react';

// Example props: array of { lat, lng, imageUrl }
export default function DroneOverlay({ data }: { data: Array<{ lat: number; lng: number; imageUrl: string }> }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {data.map((point, i) => (
        <img
          key={i}
          src={point.imageUrl}
          alt="Drone imagery overlay"
          className="absolute rounded shadow-lg opacity-80"
          style={{ left: `${point.lng}%`, top: `${point.lat}%`, width: 64, height: 64 }}
        />
      ))}
    </div>
  );
} 