import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useMapContext } from '@/contexts/MapContext';
import * as L from 'leaflet';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';

export const MeasurementTools: React.FC = () => {
  const map = useMap();
  const measureControlRef = useRef<L.Control.Measure | null>(null);
  const { isMeasuring, setIsMeasuring } = useMapContext();

  useEffect(() => {
    if (!map) return;

    // Initialize measurement control
    const measureControl = new L.Control.Measure({
      position: 'topleft',
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      localization: 'en',
      popupOptions: {
        className: 'leaflet-measure-resultpopup',
        autoPanPadding: [10, 10]
      },
      measureOptions: {
        showSegmentLength: true,
        showArea: true,
        showClearControl: true,
        showControlTooltip: true
      }
    });

    // Add control to map
    map.addControl(measureControl);
    measureControlRef.current = measureControl;

    // Handle measurement events
    map.on('measure:start', () => {
      console.log('Measurement started');
    });

    map.on('measure:finish', (e: any) => {
      console.log('Measurement finished:', e);
    });

    map.on('measure:clear', () => {
      console.log('Measurement cleared');
    });

    return () => {
      if (measureControlRef.current) {
        map.removeControl(measureControlRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !measureControlRef.current) return;

    if (isMeasuring) {
      // Enable measurement mode
      measureControlRef.current.enable();
    } else {
      // Disable measurement mode
      measureControlRef.current.disable();
    }
  }, [isMeasuring, map]);

  return null;
}; 