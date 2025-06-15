import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useMapContext } from '@/contexts/MapContext';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

export const DrawingTools: React.FC = () => {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const { isDrawing, setIsDrawing } = useMapContext();

  useEffect(() => {
    if (!map) return;

    // Initialize drawing control
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#3388ff',
            weight: 3
          }
        },
        polygon: {
          shapeOptions: {
            color: '#3388ff',
            weight: 3,
            fillOpacity: 0.2
          }
        },
        circle: {
          shapeOptions: {
            color: '#3388ff',
            weight: 3,
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3388ff',
            weight: 3,
            fillOpacity: 0.2
          }
        },
        marker: {
          icon: new L.Icon.Default()
        }
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
        remove: true
      }
    });

    // Add control to map
    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    // Handle drawing events
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      const type = e.layerType;
      
      // Add layer to map
      layer.addTo(map);
      
      // Add to feature group
      drawControl.options.edit.featureGroup.addLayer(layer);
      
      // Save to database or state
      console.log('Created:', type, layer.toGeoJSON());
    });

    map.on(L.Draw.Event.EDITED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        console.log('Edited:', layer.toGeoJSON());
      });
    });

    map.on(L.Draw.Event.DELETED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        console.log('Deleted:', layer.toGeoJSON());
      });
    });

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !drawControlRef.current) return;

    if (isDrawing) {
      // Enable drawing mode
      drawControlRef.current.setDrawingOptions({
        polyline: true,
        polygon: true,
        circle: true,
        rectangle: true,
        marker: true
      });
    } else {
      // Disable drawing mode
      drawControlRef.current.setDrawingOptions({
        polyline: false,
        polygon: false,
        circle: false,
        rectangle: false,
        marker: false
      });
    }
  }, [isDrawing, map]);

  return null;
};
