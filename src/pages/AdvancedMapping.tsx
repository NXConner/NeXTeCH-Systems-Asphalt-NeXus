import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  MapPin, 
  Ruler, 
  Layers, 
  Navigation, 
  Camera,
  Download,
  Zap,
  Droplets,
  Activity,
  Users,
  Calculator,
  FileSpreadsheet
} from "lucide-react";
import { AsphaltDetection } from "@/components/mapping/AsphaltDetection";
import { Rnd } from 'react-rnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ARProjection from '../components/ui/ARProjection';
import { fetchMapData } from '@/services/mappingService';
import { UnifiedMapInterface } from '@/components/Map';
import ThemeSelector from '@/components/ui/theme-selector';
import { ThemeShowcase } from '@/components/ui/theme-showcase';
import { ThemeEffectsShowcase } from '@/components/ui/theme-effects-showcase';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet-control-geocoder';

// Fix for L.heatLayer type error
// @ts-ignore
declare module 'leaflet' {
  namespace heatLayer {
    function heatLayer(latlngs: any[], options?: any): any;
  }
  function heatLayer(latlngs: any[], options?: any): any;
}

const mapProviders = [
  { id: 'leaflet', name: 'Leaflet OSM', style: 'osm' },
  { id: 'esri', name: 'Esri World Imagery', style: 'esri' },
  { id: 'qgis', name: 'QGIS', style: 'qgis' },
];

function HeatmapLayer({ points, options }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    // @ts-ignore
    const heatLayer = L.heatLayer(points, options).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);
  return null;
}

// Types for advanced features
interface Geofence { id: number; name: string; }
interface Alert { message: string; }
interface Annotation { text?: string; }
interface ExternalLayer { name?: string; }
interface Collaborator { name?: string; }
interface Task { id: number; desc: string; }
interface Change { desc?: string; }
interface Weather { temp: number; condition: string; }

const PATRICK_COUNTY_CENTER = { lat: 36.6354, lng: -80.3210 };

const AdvancedMapping = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMode, setMapMode] = useState<"measure" | "pressure-wash" | "detect">("detect");
  const [showEmployeeTracking, setShowEmployeeTracking] = useState(true);
  const [measurements, setMeasurements] = useState({
    area: 0,
    perimeter: 0,
    dirtyZones: 0,
    cleanZones: 0
  });
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [provider, setProvider] = useState('esri');
  const [isPopout, setIsPopout] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [asphaltHighlight, setAsphaltHighlight] = useState(true);
  const [complianceZones, setComplianceZones] = useState<any[]>([]);
  const [dirtyZones, setDirtyZones] = useState<any[]>([]);
  const [cleanZones, setCleanZones] = useState<any[]>([]);
  const [geofencingEnabled, setGeofencingEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [inGeofence, setInGeofence] = useState(false);
  const [pciData, setPciData] = useState<any[]>([]);
  const [pciLoading, setPciLoading] = useState(false);
  const [pciError, setPciError] = useState<string|null>(null);
  const [editingZone, setEditingZone] = useState<any|null>(null);
  const [arMode, setArMode] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapRadius, setHeatmapRadius] = useState(25);
  const [heatmapBlur, setHeatmapBlur] = useState(15);
  const [heatmapMax, setHeatmapMax] = useState(1.0);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // --- ADVANCED FEATURE 1: Dynamic Data Integration ---
  // Toggle for live data updates (WebSocket/polling)
  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
  // Placeholder for live data connection logic
  // useEffect(() => { if (liveDataEnabled) { /* connect to WebSocket or polling */ } }, [liveDataEnabled]);

  // --- ADVANCED FEATURE 2: Multiple Heatmap Layers ---
  const heatmapLayerOptions = [
    { label: 'Employee Activity', value: 'employee' },
    { label: 'Vehicle Density', value: 'vehicle' },
    { label: 'Maintenance Issues', value: 'maintenance' },
  ];
  const [selectedHeatmapLayer, setSelectedHeatmapLayer] = useState(heatmapLayerOptions[0].value);
  // Placeholder for switching heatmap datasets
  // const heatmapPoints = useMemo(() => getPointsForLayer(selectedHeatmapLayer), [selectedHeatmapLayer]);

  // --- ADVANCED FEATURE 3: Customizable Heatmap Gradients ---
  const [heatmapGradient, setHeatmapGradient] = useState({
    0.4: 'blue',
    0.8: 'orange',
    1.0: 'red',
  });
  // UI for selecting gradient (color pickers or presets)
  // ...

  // --- ADVANCED FEATURE 4: Data Filtering & Segmentation ---
  const [filterType, setFilterType] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState([0, 24]);
  // UI for filtering by type, time, status
  // ...

  // --- ADVANCED FEATURE 5: Clustering & Aggregation ---
  const [clusteringEnabled, setClusteringEnabled] = useState(false);
  // Placeholder for clustering logic
  // ...

  // --- ADVANCED FEATURE 6: Geofencing & Alerts ---
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [externalLayers, setExternalLayers] = useState<ExternalLayer[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [changeHistory, setChangeHistory] = useState<Change[]>([]);
  const [weatherData, setWeatherData] = useState<Weather|null>(null);
  // UI for drawing geofences and showing alerts
  // ...

  // --- ADVANCED FEATURE 7: Historical Playback/Timeline ---
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // UI for time slider and playback controls
  // ...

  // --- ADVANCED FEATURE 8: Export & Reporting ---
  const handleExport = (type) => { /* Export logic for map, CSV, GeoJSON */ };
  // UI for export buttons
  // ...

  // --- ADVANCED FEATURE 9: Advanced Drawing & Annotation ---
  const [drawingMode, setDrawingMode] = useState('none');
  // UI for drawing tools and annotation controls
  // ...

  // --- ADVANCED FEATURE 10: Integration with External GIS Data ---
  const handleImportGIS = (file) => { /* Import logic for GeoJSON/KML */ };
  // UI for import/export GIS layers
  // ...

  // --- ADVANCED FEATURE 11: Mobile & Offline Support ---
  const [offlineMode, setOfflineMode] = useState(false);
  // Placeholder for offline tile/data caching
  // ...

  // --- ADVANCED FEATURE 12: User Access Control & Sharing ---
  const [userRole, setUserRole] = useState('viewer');
  const handleShare = () => { /* Share logic */ };
  // UI for role selection and sharing
  // ...

  // --- ADVANCED FEATURE 13: Advanced Analytics & Insights ---
  const [analyticsData, setAnalyticsData] = useState(null);
  // UI for analytics dashboard
  // ...

  // --- ADVANCED FEATURE 14: Custom Map Providers & Styles ---
  const [mapProvider, setMapProvider] = useState('esri');
  // UI for switching basemaps and custom tile URLs
  // ...

  // --- ADVANCED FEATURE 15: Integration with Other App Modules ---
  // Placeholder for linking map to CRM, scheduling, compliance
  // ...

  // --- ADVANCED FEATURE 16: Accessibility & Usability ---
  // Add ARIA labels, keyboard navigation, high-contrast toggle
  // ...

  // --- ADVANCED FEATURE 17: Real-Time Collaboration ---
  // Placeholder for multi-user editing logic
  // ...

  // --- ADVANCED FEATURE 18: Map-Based Task Assignment ---
  // UI for assigning tasks by drawing/selecting areas
  // ...

  // --- ADVANCED FEATURE 19: API for Custom Integrations ---
  // Placeholder for REST endpoints and API docs
  // ...

  // --- ADVANCED FEATURE 20: Audit Trail & Change History ---
  // UI for viewing/reverting map changes
  // ...

  // --- ADVANCED FEATURE 21: Weather Data Integration ---
  // Placeholder for fetching weather from pave-wise-weather-cast
  // ...

  // --- ADVANCED FEATURE 22: Weather Overlays (Radar, Precipitation, Temperature) ---
  const [weatherOverlay, setWeatherOverlay] = useState('none');
  // UI for toggling weather overlays
  // ...

  // --- ADVANCED FEATURE 23: Weather-based Alerts & Scheduling ---
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  // Placeholder for weather-triggered notifications
  // ...

  // --- ADVANCED FEATURE 24: Historical Weather Analytics ---
  const [historicalWeather, setHistoricalWeather] = useState(null);
  // UI for viewing historical weather on map
  // ...

  // --- ADVANCED FEATURE 25: Weather Data in Reports & Exports ---
  // Add weather data to export/report logic
  // ...

  const geofenceRegion = useMemo(() => ({
    id: 'demo-geofence',
    name: 'HQ Lot',
    center: { lat: 37.5, lng: -77.4 },
    radius: 0.001 // ~100m
  }), []);

  const advancedFeatures = [
    'Dynamic Data Integration',
    'Multiple Heatmap Layers',
    'Customizable Heatmap Gradients',
    'Data Filtering & Segmentation',
    'Clustering & Aggregation',
    'Geofencing & Alerts',
    'Historical Playback/Timeline',
    'Export & Reporting',
    'Advanced Drawing & Annotation',
    'Integration with External GIS Data',
    'Mobile & Offline Support',
    'User Access Control & Sharing',
    'Advanced Analytics & Insights',
    'Custom Map Providers & Styles',
    'Integration with Other App Modules',
    'Accessibility & Usability',
    'Real-Time Collaboration',
    'Map-Based Task Assignment',
    'API for Custom Integrations',
    'Audit Trail & Change History',
    // Weather integration features
    'Weather Data Integration',
    'Weather Overlays (Radar, Precipitation, Temperature)',
    'Weather-based Alerts & Scheduling',
    'Historical Weather Analytics',
    'Weather Data in Reports & Exports',
  ];
  const [featureChecklist, setFeatureChecklist] = useState(Array(advancedFeatures.length).fill(false));
  const handleChecklistToggle = idx => setFeatureChecklist(list => list.map((v, i) => i === idx ? !v : v));

  const handleGeocodeSearch = async () => {
    if (!searchQuery.trim()) return;
    // TODO: Integrate Mapbox or Google Maps geocoding API here
    // Example: fetch geocode and pan/zoom map
    setSearchQuery("");
  };

  const handleModeSwitch = (mode: typeof mapMode) => {
    setMapMode(mode);
    if (mode === "pressure-wash") {
      // Reset dirty/clean zones
      setMeasurements(prev => ({ ...prev, dirtyZones: 0, cleanZones: 0 }));
    }
  };

  const handleAreaSelect = (area: any) => {
    setSelectedArea(area);
    setMeasurements(prev => ({
      ...prev,
      area: area.area,
      perimeter: (area.length + area.width) * 2
    }));
  };

  const exportToEstimate = () => {
    if (selectedArea) {
      // Navigate to estimates with pre-filled data
      console.log('Exporting to estimate:', selectedArea);
      // This would integrate with the estimates system
      window.location.href = `/estimates-management?area=${selectedArea.area}&length=${selectedArea.length}&width=${selectedArea.width}`;
    }
  };

  const exportToGeoJSON = () => {
    const geoData = {
      type: "FeatureCollection",
      features: selectedArea ? [{
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [selectedArea.coordinates.map((coord: any) => [coord.x, coord.y])]
        },
        properties: {
          id: selectedArea.id,
          area: selectedArea.area,
          length: selectedArea.length,
          width: selectedArea.width,
          confidence: selectedArea.confidence,
          manuallyEdited: selectedArea.manuallyEdited
        }
      }] : []
    };
    
    const blob = new Blob([JSON.stringify(geoData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asphalt-detection.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDrawZone = (zone: any) => {
    if (zone.type === 'dirty') {
      setDirtyZones(prev => [...prev, { ...zone, id: Date.now() }]);
    } else if (zone.type === 'clean') {
      setCleanZones(prev => [...prev, { ...zone, id: Date.now() }]);
    }
  };

  const handleBeforeAfterPhotoUpload = (type: 'before' | 'after', file: File) => {
    // TODO: Upload logic
    console.log(`Photo uploaded (${type}):`, file);
  };

  const handleDropLineTemplate = (template: string) => {
    // TODO: Add dropped template to selectedArea or map
    console.log('Dropped line template:', template, selectedArea);
  };

  useEffect(() => {
    if (geofencingEnabled) {
      const geoId = navigator.geolocation.watchPosition(
        pos => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.warn('Geolocation error', err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(geoId);
    }
  }, [geofencingEnabled]);

  useEffect(() => {
    if (geofencingEnabled && currentLocation) {
      const dist = Math.sqrt(
        Math.pow(currentLocation.lat - geofenceRegion.center.lat, 2) +
        Math.pow(currentLocation.lng - geofenceRegion.center.lng, 2)
      );
      const inside = dist < geofenceRegion.radius;
      setInGeofence(inside);
      // Optionally: show notification or badge
      if (inside) {
        // TODO: Show entry notification
        console.log('Entered geofence:', geofenceRegion.name);
      } else {
        // TODO: Show exit notification
        console.log('Exited geofence:', geofenceRegion.name);
      }
    }
  }, [geofencingEnabled, currentLocation, geofenceRegion]);

  useEffect(() => {
    setPciLoading(true);
    setPciError(null);
    // TODO: Replace with real API endpoint
    fetch('/api/assessments/pci')
      .then(res => res.json())
      .then(data => {
        setPciData(data);
        setPciLoading(false);
      })
      .catch(err => {
        setPciError('Failed to load PCI data');
        setPciLoading(false);
      });
  }, []);

  // Load/save compliance zones from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('complianceZones');
    if (saved) setComplianceZones(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem('complianceZones', JSON.stringify(complianceZones));
  }, [complianceZones]);

  const addComplianceZone = useCallback(() => {
    const newZone = {
      id: Date.now().toString(),
      x: 100, y: 100, width: 120, height: 80,
      compliant: true,
      tooltip: 'New compliance zone'
    };
    setComplianceZones(zones => [...zones, newZone]);
    setEditingZone(newZone);
  }, []);
  const updateComplianceZone = (id: string, updates: any) => {
    setComplianceZones(zones => zones.map(z => z.id === id ? { ...z, ...updates } : z));
  };
  const deleteComplianceZone = (id: string) => {
    setComplianceZones(zones => zones.filter(z => z.id !== id));
    setEditingZone(null);
  };

  useEffect(() => {
    fetchMapData().then(setMapData);
  }, []);

  const mapRef = useRef<any>(null);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    if (mapRef.current && L.Control.Geocoder) {
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
      })
        .on('markgeocode', function(e) {
          const bbox = e.geocode.bbox;
          const poly = L.polygon([
            [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
            [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
            [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
            [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
          ]).addTo(mapRef.current);
          mapRef.current.fitBounds(poly.getBounds());
        })
        .addTo(mapRef.current);
      return () => {
        geocoder.remove();
      };
    }
  }, [mapRef]);

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        if (mapRef.current) {
          mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 15);
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Map Section */}
      <div className="w-full h-[50vh] relative">
        <UnifiedMapInterface 
          height="100%" 
          width="100%"
          heatmapPoints={heatmapPoints}
          droneData={[]}
          pciData={pciData}
          provider={provider}
        />
        
        {/* Theme Selector */}
        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
          <ThemeSelector />
        </div>

        {/* Search and Location Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search address..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGeocodeSearch()}
              />
            </div>
          </div>
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGPS}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Current Location</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              <span>Layers</span>
            </Button>
          </div>
        </div>

        {/* Map Source Selector */}
        <div className="absolute bottom-4 left-4 z-[1000]">
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
            <Select
              value={provider}
              onValueChange={setProvider}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select map source" />
              </SelectTrigger>
              <SelectContent>
                {mapProviders.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tools */}
        <div className="absolute bottom-4 right-4 z-[1000] flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
          >
            <Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSpreadsheet(!showSpreadsheet)}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Spreadsheet</span>
          </Button>
        </div>
      </div>

      {/* Tools and Content Section */}
      <div className="flex-1 overflow-auto p-4 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Map Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Heatmap</Label>
                <Switch
                  checked={showHeatmap}
                  onCheckedChange={setShowHeatmap}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Geofencing</Label>
                <Switch
                  checked={geofencingEnabled}
                  onCheckedChange={setGeofencingEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>AR Mode</Label>
                <Switch
                  checked={arMode}
                  onCheckedChange={setArMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Measurements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="font-medium">{measurements.area.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Perimeter</span>
                  <span className="font-medium">{measurements.perimeter.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dirty Zones</span>
                  <span className="font-medium">{measurements.dirtyZones}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Clean Zones</span>
                  <span className="font-medium">{measurements.cleanZones}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Weather & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherData ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-medium">{weatherData.temp}°F</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Condition</span>
                    <span className="font-medium">{weatherData.condition}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Weather data not available</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMapping;
