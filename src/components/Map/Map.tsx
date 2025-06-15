import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, ScaleControl } from 'react-leaflet';
import { MapLayers } from './Layers/MapLayers';
import { MapTools } from './Tools/MapTools';
import { DrawingTools } from './Tools/DrawingTools';
import { GeofenceLayers } from './Layers/GeofenceLayers';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useMap as useMapContext } from '@/contexts/MapContext';
import { useTheme } from '@/components/ThemeProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet-draw';
import 'leaflet-control-geocoder';
import { 
  Search, 
  MapPin, 
  Ruler, 
  Layers as LayersIcon, 
  Navigation as NavigationIcon,
  Camera,
  Download,
  Zap,
  Droplets,
  Activity,
  Users,
  Calculator,
  FileSpreadsheet,
  Save,
  Upload,
  Eye,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface MapProps {
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
    // Add geocoder control
    const geocoder = (L.Control as any).geocoder({
      defaultMarkGeocode: false,
      position: 'topleft',
      placeholder: 'Search location...',
      errorMessage: 'Nothing found.',
      showResultIcons: true
    })
      .on('markgeocode', function(e: any) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest()
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

    // Add scale control
    L.control.scale().addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
};

export const Map: React.FC<MapProps> = ({
  width = '100%',
  height = '600px',
  center = [36.6418, -80.2717], // Stuart, VA
  zoom = 13,
  onMapChange
}) => {
  // State for various map features
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showDrone, setShowDrone] = useState(false);
  const [showPCI, setShowPCI] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [measurement, setMeasurement] = useState('');
  const [drawingMode, setDrawingMode] = useState<'none' | 'polygon' | 'line' | 'point'>('none');
  const [weatherOverlay, setWeatherOverlay] = useState<'none' | 'radar' | 'precipitation' | 'temperature'>('none');
  const [offlineMode, setOfflineMode] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [showAR, setShowAR] = useState(false);

  // Map context for advanced features
  const { 
    toolMode,
    startDraw,
    startEdit,
    saveEdits,
    cancelEdit,
    timeline,
    geofences,
    layers 
  } = useMapContext();

  // Handle map bounds changes
  const handleMapChange = useCallback((e: L.LeafletEvent) => {
    if (onMapChange) {
      const map = e.target;
      onMapChange(map.getBounds());
    }
  }, [onMapChange]);

  // Handle drawing complete
  const handleDrawComplete = useCallback((geojson: any) => {
    console.log('Drawing complete:', geojson);
    // Implement your drawing complete logic here
  }, []);

  // Handle measurement change
  const handleMeasurementChange = useCallback((value: string) => {
    setMeasurement(value);
  }, []);

  // Handle clear drawings
  const handleClearDrawings = useCallback(() => {
    // Implement your clear drawings logic here
  }, []);

  // Handle export GeoJSON
  const handleExportGeoJSON = useCallback(() => {
    // Implement your export logic here
  }, []);

  // Handle delete geofence
  const handleDeleteGeofence = useCallback((id: number) => {
    // Implement your delete geofence logic here
  }, []);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        whenReady={(map) => {
          map.target.on('moveend', handleMapChange);
        }}
      >
        {/* Map Controls */}
        <MapControls />
        
        {/* Map Layers */}
        <MapLayers
          showHeatmap={showHeatmap}
          showDrone={showDrone}
          showPCI={showPCI}
          showCompliance={showCompliance}
          heatmapPoints={[]}
          droneData={[]}
          pciData={[]}
          basemap={basemap}
        />

        {/* Geofence Layers */}
        <GeofenceLayers
          geofences={geofences}
          onDeleteGeofence={handleDeleteGeofence}
        />

        {/* Scale Control */}
        <ScaleControl position="bottomleft" />
      </MapContainer>

      {/* Map Tools */}
      <MapTools
        measuring={measuring}
        onStartMeasuring={() => setMeasuring(true)}
        onStopMeasuring={() => setMeasuring(false)}
        measurement={measurement}
        onToggleJobSites={() => {/* Implement toggle */}}
        onToggleFleet={() => {/* Implement toggle */}}
        onToggleHazards={() => {/* Implement toggle */}}
        onToggleCollaborators={() => setShowCollaborators(!showCollaborators)}
        onToggleAR={() => setShowAR(!showAR)}
      />

      {/* Drawing Tools */}
      <DrawingTools
        onDrawComplete={handleDrawComplete}
        onMeasurementChange={handleMeasurementChange}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        onClearDrawings={handleClearDrawings}
        onExportGeoJSON={handleExportGeoJSON}
      />

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <Select
            value={basemap}
            onValueChange={(value: 'satellite' | 'street') => setBasemap(value)}
          >
            <option value="satellite">Satellite</option>
            <option value="street">Street Map</option>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
            />
            <span>Heatmap</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={showDrone}
              onCheckedChange={setShowDrone}
            />
            <span>Drone Data</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={showPCI}
              onCheckedChange={setShowPCI}
            />
            <span>PCI Data</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={showCompliance}
              onCheckedChange={setShowCompliance}
            />
            <span>Compliance</span>
          </div>

          <Select
            value={weatherOverlay}
            onValueChange={(value: 'none' | 'radar' | 'precipitation' | 'temperature') => setWeatherOverlay(value)}
          >
            <option value="none">No Weather</option>
            <option value="radar">Radar</option>
            <option value="precipitation">Precipitation</option>
            <option value="temperature">Temperature</option>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
            <span>Offline Mode</span>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="absolute bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* Implement export */}}
            title="Export Map"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* Implement import */}}
            title="Import Data"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* Implement save */}}
            title="Save View"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 