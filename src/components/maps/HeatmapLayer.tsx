import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  radius?: number;
  blur?: number;
  maxZoom?: number;
  max?: number;
  gradient?: { [key: number]: string };
}

export function HeatmapLayer({
  points,
  radius = 25,
  blur = 15,
  maxZoom = 10,
  max = 1.0,
  gradient = {
    0.4: 'blue',
    0.6: 'lime',
    0.8: 'yellow',
    1.0: 'red'
  }
}: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing heat layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create new heat layer
    heatLayerRef.current = (L as any).heatLayer(points, {
      radius,
      blur,
      maxZoom,
      max,
      gradient
    }).addTo(map);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, radius, blur, maxZoom, max, gradient]);

  return null;
} 