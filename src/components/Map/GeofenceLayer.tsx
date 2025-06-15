import React, { useEffect } from 'react';
import { useMap as useLeafletMap } from 'react-leaflet';
import { GeoJSON } from 'leaflet';
import { getGeofences } from '@/services/geofenceService';
import { useMap } from '@/contexts/MapContext';

const GeofenceLayer: React.FC = () => {
  const map = useLeafletMap();
  const { addTimelineEvent } = useMap();

  useEffect(() => {
    getGeofences().then(geofences => {
      geofences.forEach(g => {
        const layer = new GeoJSON(g.geojson as any);
        layer.addTo(map);
        layer.on('click', () => {
          addTimelineEvent({ user: 'system', action: 'Clicked geofence', details: g });
        });
      });
    });
  }, [map, addTimelineEvent]);

  return null;
};

export default GeofenceLayer;
