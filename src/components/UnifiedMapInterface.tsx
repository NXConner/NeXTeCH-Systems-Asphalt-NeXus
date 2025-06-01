import React from 'react';
import MapGL from 'react-map-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN || '';

const UnifiedMapInterface = () => {
  const [viewState, setViewState] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  if (!MAPBOX_TOKEN) {
    return <div style={{ color: 'red' }}>Mapbox token is missing. Please set VITE_REACT_APP_MAPBOX_TOKEN in your environment.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <MapGL
        {...viewState}
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: 400 }}
      />
    </div>
  );
};

export default UnifiedMapInterface;
export { UnifiedMapInterface }; 