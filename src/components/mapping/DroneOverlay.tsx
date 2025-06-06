import React from 'react';

interface DroneOverlayProps {
  data?: Array<{ lat: number; lng: number; imageUrl: string }>;
}

const DroneOverlay: React.FC<DroneOverlayProps> = ({ data = [] }) => {
  if (!data.length) return <div className="text-xs text-muted-foreground">No drone imagery available.</div>;
  return (
    <div className="absolute inset-0 pointer-events-none z-40" aria-label="Drone imagery overlay">
      {data.map((point, i) => (
        <img
          key={i}
          src={point.imageUrl}
          alt={`Drone imagery at lat ${point.lat}, lng ${point.lng}`}
          className="absolute rounded shadow-lg opacity-80"
          style={{ left: `${point.lng}%`, top: `${point.lat}%`, width: 64, height: 64 }}
        />
      ))}
    </div>
  );
};

export default DroneOverlay; 