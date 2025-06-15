import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';
import HeatmapLayer from '@/components/maps/HeatmapLayer';
import DroneOverlay from '@/components/mapping/DroneOverlay';
import PCIHeatmapOverlay from '@/components/mapping/PCIHeatmapOverlay';
import ComplianceOverlay from '@/components/mapping/ComplianceOverlay';

interface MapLayersProps {
  showHeatmap: boolean;
  showDrone: boolean;
  showPCI: boolean;
  showCompliance: boolean;
  heatmapPoints: Array<[number, number, number]>;
  droneData: Array<{lat: number, lng: number, data: any}>;
  pciData: Array<{lat: number, lng: number, value: number}>;
  basemap: 'satellite' | 'street';
}

export const MapLayers: React.FC<MapLayersProps> = ({
  showHeatmap,
  showDrone,
  showPCI,
  showCompliance,
  heatmapPoints,
  droneData,
  pciData,
  basemap
}) => {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked={basemap === 'satellite'} name="Satellite">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={basemap === 'street'} name="Street">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </LayersControl.BaseLayer>
      
      {showHeatmap && (
        <LayersControl.Overlay checked name="Heatmap">
          <HeatmapLayer points={heatmapPoints} />
        </LayersControl.Overlay>
      )}
      
      {showDrone && (
        <LayersControl.Overlay checked name="Drone Data">
          <DroneOverlay data={droneData} />
        </LayersControl.Overlay>
      )}
      
      {showPCI && (
        <LayersControl.Overlay checked name="PCI Heatmap">
          <PCIHeatmapOverlay data={pciData} />
        </LayersControl.Overlay>
      )}
      
      {showCompliance && (
        <LayersControl.Overlay checked name="Compliance">
          <ComplianceOverlay />
        </LayersControl.Overlay>
      )}
    </LayersControl>
  );
}; 