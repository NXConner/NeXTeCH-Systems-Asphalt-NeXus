import React, { ReactNode, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, ScaleControl, LayerGroup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { RotateCcw, Ruler } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import styles from './UnifiedMapInterface.module.css';

interface UnifiedMapInterfaceProps {
  width?: string;
  height?: number;
  heatmapPoints?: Array<[number, number, number]>;
  droneData?: Array<{lat: number, lng: number, data: any}>;
  pciData?: Array<{lat: number, lng: number, value: number}>;
  children?: ReactNode;
}

// Heatmap Layer Component
const HeatmapLayer = ({ points }: { points: Array<[number, number, number]> }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!points.length) return;
    
    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);
    
    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);
  
  return null;
};

// PCI Data Layer Component
const PCILayer = ({ data }: { data: Array<{lat: number, lng: number, value: number}> }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!data.length) return;
    
    const markers = data.map(point => {
      const color = point.value > 80 ? 'green' : point.value > 60 ? 'yellow' : 'red';
      return L.circleMarker([point.lat, point.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`PCI Value: ${point.value}`);
    });
    
    const layer = L.layerGroup(markers).addTo(map);
    
    return () => {
      map.removeLayer(layer);
    };
  }, [map, data]);
  
  return null;
};

// Drone Data Layer Component
const DroneLayer = ({ data }: { data: Array<{lat: number, lng: number, data: any}> }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!data.length) return;
    
    const markers = data.map(point => 
      L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: styles.droneMarker,
          html: '🚁',
          iconSize: [20, 20]
        })
      }).bindPopup(`Drone Data: ${JSON.stringify(point.data, null, 2)}`)
    );
    
    const layer = L.layerGroup(markers).addTo(map);
    
    return () => {
      map.removeLayer(layer);
    };
  }, [map, data]);
  
  return null;
};

const ResetButton = () => {
  const map = useMap();
  
  const handleReset = useCallback(() => {
    map.setView([36.6418, -80.2717], 13);
  }, [map]);

  return (
    <Button
      variant="outline"
      size="sm"
      className={styles.resetButton}
      onClick={handleReset}
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Reset View
    </Button>
  );
};

export const UnifiedMapInterface: React.FC<UnifiedMapInterfaceProps> = ({
  width = '100vw',
  height = 600,
  heatmapPoints = [],
  droneData = [],
  pciData = [],
  children
}) => {
  const STUART_VA_CENTER = { lat: 36.6418, lng: -80.2717 };
  
  return (
    <div 
      className={styles.mapContainer}
      style={{ width, height }}
    >
      <MapContainer
        center={[STUART_VA_CENTER.lat, STUART_VA_CENTER.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <LayersControl position="topright">
          {/* Base Layers */}
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          {/* Overlay Layers */}
          <LayersControl.Overlay checked name="Street Labels">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              opacity={0.7}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Heatmap">
            <LayerGroup>
              {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="PCI Data">
            <LayerGroup>
              {pciData.length > 0 && <PCILayer data={pciData} />}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Drone Data">
            <LayerGroup>
              {droneData.length > 0 && <DroneLayer data={droneData} />}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <ScaleControl position="bottomleft" />
        <ResetButton />
        {children}
      </MapContainer>
    </div>
  );
};

export default UnifiedMapInterface;
