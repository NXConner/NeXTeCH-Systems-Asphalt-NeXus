import { buffer, area } from '@turf/turf';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';

export const bufferGeofence = (
  feature: Feature<Polygon | MultiPolygon, GeoJsonProperties>,
  distance: number
): Feature<Polygon | MultiPolygon, GeoJsonProperties> => {
  return buffer(feature, distance) as Feature<Polygon | MultiPolygon, GeoJsonProperties>;
};

export const calculateArea = (
  feature: Feature<Polygon | MultiPolygon, GeoJsonProperties>
): number => {
  return area(feature);
};

export const snapToRoads = async (
  feature: Feature<Polygon | MultiPolygon, GeoJsonProperties>
): Promise<Feature<Polygon | MultiPolygon, GeoJsonProperties>> => {
  // Implement road snapping logic or call external API
  return feature;
};
