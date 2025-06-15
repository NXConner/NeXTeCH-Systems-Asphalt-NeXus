import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, ScaleControl, ZoomControl } from 'react-leaflet';
import { useTheme } from '@/components/ThemeProvider';
import { useMapContext } from '@/contexts/MapContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CoreMapProps {
  width?: string | number;
  height?: string | number;
  center?: [number, number];
  zoom?: number;
  onMapChange?: (bounds: L.LatLngBounds) => void;
}

// Map Controls Component
const MapControls = () => {
  const map = useMap();
  const { theme } = useTheme();

  useEffect(() => {
    // Add scale control
    L.control.scale().addTo(map);

    // Add zoom control
    L.control.zoom({
      position: 'bottomright',
      zoomInText: '+',
      zoomOutText: '-'
    }).addTo(map);

    return () => {
      map.removeControl(L.control.scale());
      map.removeControl(L.control.zoom());
    };
  }, [map]);

  return null;
};

export const CoreMap: React.FC<CoreMapProps> = ({
  width = '100%',
  height = '600px',
  center = [36.6418, -80.2717], // Stuart, VA
  zoom = 13,
  onMapChange
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { theme } = useTheme();
  const { toolMode } = useMapContext();

  // Handle map bounds changes
  const handleMapChange = useCallback((e: L.LeafletEvent) => {
    if (onMapChange) {
      const map = e.target;
      onMapChange(map.getBounds());
    }
  }, [onMapChange]);

  // Handle map loading
  const handleMapReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    setError(error);
    setIsLoading(false);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-destructive">Error loading map: {error.message}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      <div 
        style={{ width, height, position: 'relative' }}
        className="bg-background"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <LoadingSpinner />
          </div>
        )}
        
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ width: '100%', height: '100%' }}
          whenReady={handleMapReady}
          onError={handleError}
          zoomControl={false}
          attributionControl={true}
          minZoom={3}
          maxZoom={18}
          maxBounds={L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))}
          maxBoundsViscosity={1.0}
        >
          <MapControls />
          
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                maxZoom={19}
                maxNativeZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Street">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                maxZoom={19}
                maxNativeZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                maxZoom={17}
                maxNativeZoom={17}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <ScaleControl position="bottomleft" />
        </MapContainer>
      </div>
    </ErrorBoundary>
  );
}; 