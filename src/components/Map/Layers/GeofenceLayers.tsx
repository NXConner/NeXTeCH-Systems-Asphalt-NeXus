import React from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Geofence {
  id: number;
  geometry: { coordinates: number[][][][] };
  name?: string;
  hazard?: boolean;
}

interface GeofenceLayersProps {
  geofences: Geofence[];
  onDeleteGeofence: (id: number) => void;
}

export const GeofenceLayers: React.FC<GeofenceLayersProps> = ({
  geofences,
  onDeleteGeofence
}) => {
  const geofenceStyle = (feature: any) => {
    const isHazard = feature.properties?.hazard;
    return {
      color: isHazard ? '#FF1744' : '#00E676',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.2
    };
  };

  const onEachGeofence = (feature: any, layer: L.Layer) => {
    const id = feature.properties?.id;
    const name = feature.properties?.name || `Geofence ${id}`;
    const isHazard = feature.properties?.hazard;
    
    layer.bindPopup(() => {
      const container = L.DomUtil.create('div', 'geofence-popup');
      container.innerHTML = `
        <h4>${name}</h4>
        <p>${isHazard ? 'Hazard Area' : 'Safe Area'}</p>
        <button class="delete-btn">Delete</button>
      `;
      
      // Add event listener to delete button
      const deleteBtn = container.querySelector('.delete-btn');
      if (deleteBtn) {
        L.DomEvent.on(deleteBtn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          onDeleteGeofence(id);
        });
      }
      
      return container;
    });
  };

  return (
    <>
      {geofences.map(geofence => {
        // Convert geofence to GeoJSON format
        const geojson = {
          type: 'Feature',
          geometry: geofence.geometry,
          properties: {
            id: geofence.id,
            name: geofence.name,
            hazard: geofence.hazard
          }
        };
        
        return (
          <GeoJSON
            key={geofence.id}
            data={geojson as any}
            style={geofenceStyle}
            onEachFeature={onEachGeofence}
          />
        );
      })}
    </>
  );
};
