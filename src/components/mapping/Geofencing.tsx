import React from 'react';

interface Geofence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  active: boolean;
}

interface GeofencingProps {
  geofences?: Geofence[];
}

const Geofencing: React.FC<GeofencingProps> = ({ geofences = [] }) => {
  if (!geofences.length) return <div className="text-xs text-muted-foreground">No geofences defined.</div>;
  return (
    <div className="absolute inset-0 pointer-events-none z-40" aria-label="Geofencing overlay">
      {geofences.map((gf) => (
        <div
          key={gf.id}
          className={`absolute rounded-full border-2 ${gf.active ? 'border-green-500' : 'border-gray-400'}`}
          style={{
            left: `${gf.center.lng}%`,
            top: `${gf.center.lat}%`,
            width: gf.radius / 2,
            height: gf.radius / 2,
            background: gf.active ? 'rgba(0,255,0,0.1)' : 'rgba(128,128,128,0.1)',
            pointerEvents: 'none',
          }}
          title={gf.name}
          role="img"
          aria-label={`Geofence: ${gf.name}, radius ${gf.radius} meters, ${gf.active ? 'active' : 'inactive'}`}
        />
      ))}
    </div>
  );
};

export default Geofencing; 