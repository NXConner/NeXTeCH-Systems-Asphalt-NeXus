import React from 'react';

interface Measurement {
  id: string;
  points: Array<{ lat: number; lng: number }>;
  length: number;
  area?: number;
}

interface ARMeasurementToolProps {
  measurements?: Measurement[];
}

const ARMeasurementTool: React.FC<ARMeasurementToolProps> = ({ measurements = [] }) => {
  if (!measurements.length) return <div className="text-xs text-muted-foreground">No AR measurements.</div>;
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {measurements.map((m) => (
        <div
          key={m.id}
          className="absolute border-2 border-blue-500 bg-blue-200/30 rounded"
          style={{
            left: `${m.points[0].lng}%`,
            top: `${m.points[0].lat}%`,
            width: 40,
            height: 40,
          }}
          title={`Length: ${m.length} ft${m.area ? ", Area: " + m.area + " sq ft" : ''}`}
        />
      ))}
    </div>
  );
};

export default ARMeasurementTool; 