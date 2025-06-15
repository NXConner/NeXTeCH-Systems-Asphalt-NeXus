import { createGeofence } from '@/services/geofenceService';

export const importGeoJSON = async (geojson: any) => {
  if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON');
  }
  for (const feature of geojson.features) {
    await createGeofence(feature);
  }
};
