// Map component

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, ScaleControl } from 'react-leaflet';
import { MapLayers } from './Layers/MapLayers';
import { MapTools } from './Tools/MapTools';
import { DrawingTools } from './Tools/DrawingTools';
import { GeofenceLayers } from './Layers/GeofenceLayers';
import { WeatherOverlay } from './Layers/WeatherOverlay';
import { CollaborationLayer } from './Layers/CollaborationLayer';
import { AnalyticsOverlay } from './Layers/AnalyticsOverlay';
import { ARControls } from './Tools/ARControls';
import { OfflineManager } from './Tools/OfflineManager';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useMap as useMapContext } from '@/contexts/MapContext';
import { useTheme } from '@/components/ThemeProvider';
import { useWeather } from '@/hooks/useWeather';
import { useOffline } from '@/hooks/useOffline';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useAnalytics } from '@/hooks/useAnalytics';
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
  RotateCcw,
  Bell,
  Share2,
  History,
  BarChart2,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { MapProvider } from '@/contexts/MapContext';
import { CoreMap } from './CoreMap';
import { MeasurementTools } from './Tools/MeasurementTools';
import { LayerManager } from './Layers/LayerManager';
import { GeofenceManager } from './GeofenceManager';
import { SearchBar } from './SearchBar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ResponsiveLayout } from './ResponsiveLayout';
import { Resizable } from 're-resizable';
import { useMapSize } from '@/hooks/useMapSize';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { logger } from '@/lib/logger';

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  sidebarContent?: React.ReactNode;
  height?: string;
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

const DEFAULT_MAP_SIZE = {
  width: '50%',
  height: '50vh'
};

export const Map: React.FC<MapProps> = ({
  initialCenter = [51.505, -0.09],
  initialZoom = 13,
  sidebarContent,
  height = '100vh'
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showDrone, setShowDrone] = useState(false);
  const [showPCI, setShowPCI] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [measurement, setMeasurement] = useState('');
  const [drawingMode, setDrawingMode] = useState<'none' | 'polygon' | 'line' | 'point'>('none');
  
  const { weatherData, loading: weatherLoading } = useWeather();
  const [weatherOverlay, setWeatherOverlay] = useState<'none' | 'radar' | 'precipitation' | 'temperature'>('none');
  
  const { isOffline, syncData, cachedTiles } = useOffline();
  const [offlineMode, setOfflineMode] = useState(false);
  
  const { collaborators, shareMap, assignTask } = useCollaboration();
  const [showCollaborators, setShowCollaborators] = useState(true);
  
  const [showAR, setShowAR] = useState(false);
  const [arMode, setARMode] = useState<'measure' | 'navigate' | 'visualize'>('measure');
  
  const { analyticsData, generateReport } = useAnalytics();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<'heatmap' | 'clusters' | 'choropleth'>('heatmap');
  
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

  const { mapSize, setMapSize, isFullscreen, toggleFullscreen } = useMapSize();
  const [savedSize, setSavedSize] = useLocalStorage('mapSize', DEFAULT_MAP_SIZE);
  const [isResizing, setIsResizing] = useState(false);

  // Auto-adjust map size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isResizing) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        setMapSize({
          width: `${windowWidth * 0.5}px`,
          height: `${windowHeight * 0.5}px`
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isResizing, setMapSize]);

  // Save map size
  const handleSaveSize = useCallback(() => {
    setSavedSize(mapSize);
    logger.info('Map size saved', { size: mapSize });
  }, [mapSize, setSavedSize]);

  // Reset to saved size
  const handleResetSize = useCallback(() => {
    setMapSize(savedSize);
    logger.info('Map size reset to saved size', { size: savedSize });
  }, [savedSize, setMapSize]);

  const handleMapChange = useCallback((e: L.LeafletEvent) => {
    if (onMapChange) {
      const map = e.target;
      onMapChange(map.getBounds());
    }
  }, [onMapChange]);

  const handleDrawComplete = useCallback((geojson: any) => {
    console.log('Drawing complete:', geojson);
    // Implement your drawing complete logic here
  }, []);

  const handleMeasurementChange = useCallback((value: string) => {
    setMeasurement(value);
  }, []);

  const handleClearDrawings = useCallback(() => {
    // Implement your clear drawings logic here
  }, []);

  const handleExportGeoJSON = useCallback(() => {
    // Implement your export logic here
  }, []);

  const handleDeleteGeofence = useCallback((id: number) => {
    // Implement your delete geofence logic here
  }, []);

  const handleAssignTask = useCallback((area: L.LatLngBounds, task: any) => {
    assignTask(area, task);
  }, [assignTask]);

  const handleShareMap = useCallback(() => {
    shareMap();
  }, [shareMap]);

  const handleGenerateReport = useCallback(() => {
    generateReport();
  }, [generateReport]);

  return (
    <ResponsiveLayout sidebarContent={sidebarContent}>
      <MapProvider>
        <div className="relative w-full h-full">
          <Resizable
            size={mapSize}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={(e, direction, ref, d) => {
              setIsResizing(false);
              setMapSize({
                width: `${ref.offsetWidth}px`,
                height: `${ref.offsetHeight}px`
              });
            }}
            minWidth={300}
            minHeight={300}
            maxWidth="100%"
            maxHeight="100%"
            className="relative"
          >
            <MapContainer
              center={initialCenter}
              zoom={initialZoom}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
              }}
            >
              <CoreMap onMapChange={onMapChange} />
              <MapControls />
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

              {weatherOverlay !== 'none' && (
                <WeatherOverlay
                  type={weatherOverlay}
                  data={weatherData}
                  loading={weatherLoading}
                />
              )}

              {showCollaborators && (
                <CollaborationLayer
                  collaborators={collaborators}
                  onAssignTask={handleAssignTask}
                />
              )}

              {showAnalytics && (
                <AnalyticsOverlay
                  visible={showAnalytics}
                  type={analyticsType}
                  data={analyticsData}
                  onGenerateReport={handleGenerateReport}
                />
              )}

              <GeofenceLayers
                geofences={geofences}
                onDeleteGeofence={handleDeleteGeofence}
              />

              <ScaleControl position="bottomleft" />
            </MapContainer>

            <div className="absolute top-2 right-2 z-[1000] flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="bg-background/80 backdrop-blur-sm"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveSize}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </Resizable>

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

          <DrawingTools
            onDrawComplete={handleDrawComplete}
            onMeasurementChange={handleMeasurementChange}
            drawingMode={drawingMode}
            setDrawingMode={setDrawingMode}
            onClearDrawings={handleClearDrawings}
            onExportGeoJSON={handleExportGeoJSON}
          />

          <MeasurementTools />
          <LayerManager />

          <OfflineManager
            isOffline={isOffline}
            onSync={syncData}
            cachedTiles={cachedTiles}
          />

          {showAR && (
            <ARControls
              mode={arMode}
              onModeChange={setARMode}
            />
          )}
        </div>

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

            <div className="flex items-center gap-2">
              <Switch
                checked={showAnalytics}
                onCheckedChange={setShowAnalytics}
              />
              <span>Analytics</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportGeoJSON}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareMap}
              title="Share Map"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Implement history */}}
              title="View History"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGenerateReport}
              title="Generate Report"
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Implement settings */}}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {measuring && (
          <div className="absolute bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
            <div className="text-sm font-medium">
              {measurement || 'Click to start measuring'}
            </div>
          </div>
        )}
      </MapProvider>

      <GeofenceManager onGeofenceChange={setGeofences} />
      <SearchBar />
      <ThemeSwitcher isDarkMode={isDarkMode} onThemeChange={toggleTheme} />
    </ResponsiveLayout>
  );
};

export default Map;
