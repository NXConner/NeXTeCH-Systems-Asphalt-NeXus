import React from 'react';

interface CrackOrPothole {
  id: string;
  type: 'crack' | 'pothole';
  position: { lat: number; lng: number };
  severity: number;
}

interface ARCrackPotholeDetectionProps {
  detections?: CrackOrPothole[];
}

const ARCrackPotholeDetection: React.FC<ARCrackPotholeDetectionProps> = ({ detections = [] }) => {
  if (!detections.length) return <div className="text-xs text-muted-foreground">No cracks or potholes detected.</div>;
  return (
    <div className="absolute inset-0 pointer-events-none z-40" aria-label="Crack and pothole detections overlay">
      {detections.map((d) => (
        <div
          key={d.id}
          role="img"
          aria-label={`${d.type === 'crack' ? 'Crack' : 'Pothole'} detected, severity ${d.severity}`}
          className={`absolute rounded-full ${d.type === 'crack' ? 'bg-yellow-400' : 'bg-red-600'} opacity-70`}
          style={{
            left: `${d.position.lng}%`,
            top: `${d.position.lat}%`,
            width: 24 + d.severity * 4,
            height: 24 + d.severity * 4,
            border: d.type === 'crack' ? '2px dashed #FFD600' : '2px solid #B22222',
          }}
          title={`${d.type === 'crack' ? 'Crack' : 'Pothole'} (Severity: ${d.severity})`}
        />
      ))}
    </div>
  );
};

export default ARCrackPotholeDetection; 