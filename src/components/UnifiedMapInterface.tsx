import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const UnifiedMapInterface = () => {
  const [viewState, setViewState] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  // Only OpenStreetMap (Leaflet)
  return (
    <div style={{ width: '100%', height: 400 }}>
      <MapContainer
        center={[viewState.latitude, viewState.longitude]}
        zoom={viewState.zoom}
        style={{ width: '100%', height: 400 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default UnifiedMapInterface; 