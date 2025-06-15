import React, { useState } from 'react';
import { bufferGeofence, calculateArea, snapToRoads } from '@/services/geofenceActions';
import type { Feature } from 'geojson';

const GeofenceActions: React.FC<{ feature: Feature }> = ({ feature }) => {
  const [buffered, setBuffered] = useState<Feature | null>(null);
  const [areaVal, setAreaVal] = useState<number | null>(null);

  const handleBuffer = () => {
    const result = bufferGeofence(feature, 100);
    setBuffered(result);
  };

  const handleArea = () => {
    const a = calculateArea(feature);
    setAreaVal(a);
  };

  const handleSnap = async () => {
    const snapped = await snapToRoads(feature);
    setBuffered(snapped);
  };

  return (
    <div className="geofence-actions">
      <h3>Geofence Actions</h3>
      <button onClick={handleBuffer}>Buffer (+100m)</button>
      <button onClick={handleArea}>Calculate Area</button>
      <button onClick={handleSnap}>Snap to Roads</button>
      {areaVal !== null && <div>Area: {areaVal.toFixed(2)} sqm</div>}
    </div>
  );
};

export default GeofenceActions; 