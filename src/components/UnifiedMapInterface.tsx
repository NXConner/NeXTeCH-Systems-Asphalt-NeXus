import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import L, { Map as LeafletMap } from 'leaflet';

interface UnifiedMapInterfaceProps {
  width?: number | string;
  height?: number | string;
}

const STUART_VA_CENTER = { lat: 36.6418, lng: -80.2717 };

const UnifiedMapInterface: React.FC<UnifiedMapInterfaceProps> = ({ width = '100vw', height = 600 }) => {
  const [viewState, setViewState] = React.useState({
    latitude: STUART_VA_CENTER.lat,
    longitude: STUART_VA_CENTER.lng,
    zoom: 17,
    bearing: 0,
    pitch: 0,
  });
  const [mapInstance, setMapInstance] = React.useState<LeafletMap | null>(null);
  const mapRef = useRef<any>(null);
  const [themeModalOpen, setThemeModalOpen] = React.useState(false);

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setViewState(v => ({ ...v, latitude: pos.coords.latitude, longitude: pos.coords.longitude, zoom: 10 }));
        if (mapRef.current) {
          mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 10);
        }
      });
    }
  };

  useEffect(() => {
    const handler = () => {
      setViewState(v => ({ ...v, zoom: 10 }));
      if (mapRef.current) {
        mapRef.current.setZoom(10);
      }
    };
    window.addEventListener('theme-changed', handler);
    return () => window.removeEventListener('theme-changed', handler);
  }, []);

  useEffect(() => {
    const openHandler = () => setThemeModalOpen(true);
    const closeHandler = () => setThemeModalOpen(false);
    window.addEventListener('theme-modal-open', openHandler);
    window.addEventListener('theme-modal-close', closeHandler);
    return () => {
      window.removeEventListener('theme-modal-open', openHandler);
      window.removeEventListener('theme-modal-close', closeHandler);
    };
  }, []);

  useEffect(() => {
    if (mapInstance) {
      mapRef.current = mapInstance;
    }
  }, [mapInstance]);

  const tileLayers = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };
  const attributions = {
    satellite: '&copy; Esri, Maxar, GeoEye',
    street: '&copy; OpenStreetMap contributors',
  };

  return (
    <div style={{
      width: '100%',
      height,
      position: 'relative',
      zIndex: themeModalOpen ? 10 : 'auto',
      pointerEvents: themeModalOpen ? 'none' : 'auto',
      overflow: 'hidden'
    }}>
      <Button style={{ position: 'absolute', zIndex: 1000, top: 10, right: 10 }} onClick={handleGPS}>
        My Location
      </Button>
      <MapContainer
        center={[viewState.latitude, viewState.longitude] as [number, number]}
        zoom={viewState.zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        whenCreated={(instance: LeafletMap) => setMapInstance(instance)}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution={attributions.satellite}
              url={tileLayers.satellite}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street (Road Names)">
            <TileLayer
              attribution={attributions.street}
              url={tileLayers.street}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default UnifiedMapInterface; 