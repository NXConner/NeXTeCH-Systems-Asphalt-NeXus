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
  Users
} from "lucide-react";
import { AsphaltDetection } from "@/components/mapping/AsphaltDetection";
import { Rnd } from 'react-rnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ARProjection from '../components/ui/ARProjection';
import { fetchMapData } from '@/services/mappingService';
import UnifiedMapInterface from '@/components/UnifiedMapInterface';
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8 p-4 bg-gray-50 rounded shadow">
        <h2 className="font-bold mb-2">Advanced Features Checklist</h2>
        <ul className="space-y-1">
          {advancedFeatures.map((desc, idx) => (
            <li key={idx} className="flex items-center">
              <input type="checkbox" checked={featureChecklist[idx]} onChange={() => handleChecklistToggle(idx)} className="mr-2" aria-label={`Mark feature ${idx+1} as complete: ${desc}`} />
              <span>{idx+1}. {desc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Dynamic Data Integration */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">1. Dynamic Data Integration</h3>
        <Switch checked={liveDataEnabled} onCheckedChange={setLiveDataEnabled} />
        <span className="ml-2">Live Data Updates {liveDataEnabled ? '(Enabled)' : '(Disabled)'}</span>
        {/* Simulated live data update: */}
        {/* useEffect(() => { if (liveDataEnabled) { setInterval(() => setHeatmapPoints(generateLiveData()), 2000); } }, [liveDataEnabled]); */}
      </section>

      {/* 2. Multiple Heatmap Layers */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">2. Multiple Heatmap Layers</h3>
        <Select value={selectedHeatmapLayer} onValueChange={setSelectedHeatmapLayer}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {heatmapLayerOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="ml-2">Current Layer: {selectedHeatmapLayer}</span>
      </section>

      {/* 3. Customizable Heatmap Gradients */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">3. Customizable Heatmap Gradients</h3>
        <div className="flex gap-4 items-center">
          <Button onClick={() => setHeatmapGradient({0.4:'blue',0.8:'orange',1.0:'red'})}>Preset 1</Button>
          <Button onClick={() => setHeatmapGradient({0.4:'green',0.8:'yellow',1.0:'red'})}>Preset 2</Button>
          {/* Color pickers for custom gradient could go here */}
          <span className="ml-2">Current: {JSON.stringify(heatmapGradient)}</span>
        </div>
      </section>

      {/* 4. Data Filtering & Segmentation */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">4. Data Filtering & Segmentation</h3>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="vehicle">Vehicle</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-2">Type: {filterType}</span>
        {/* Time range slider could go here */}
      </section>

      {/* 5. Clustering & Aggregation */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">5. Clustering & Aggregation</h3>
        <Switch checked={clusteringEnabled} onCheckedChange={setClusteringEnabled} />
        <span className="ml-2">Clustering {clusteringEnabled ? 'On' : 'Off'}</span>
        {/* Cluster rendering would be handled in the map */}
      </section>

      {/* 6. Geofencing & Alerts */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">6. Geofencing & Alerts</h3>
        <Button onClick={() => setGeofences([...geofences, {id:Date.now(),name:'New Geofence'}])}>Draw Geofence</Button>
        <ul className="mt-2 text-sm">{geofences.map(g => <li key={g.id}>{g.name}</li>)}</ul>
        <ul className="mt-2 text-xs text-red-600">{alerts.map((a,i) => <li key={i}>{a.message}</li>)}</ul>
      </section>

      {/* 7. Historical Playback/Timeline */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">7. Historical Playback/Timeline</h3>
        <Input type="range" min={0} max={24} value={playbackTime} onChange={e=>setPlaybackTime(Number(e.target.value))} className="w-64" />
        <Button onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</Button>
        <span className="ml-2">Hour: {playbackTime}</span>
      </section>

      {/* 8. Export & Reporting */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">8. Export & Reporting</h3>
        <Button onClick={()=>handleExport('csv')}>Export CSV</Button>
        <Button onClick={()=>handleExport('geojson')} className="ml-2">Export GeoJSON</Button>
        <Button onClick={()=>handleExport('png')} className="ml-2">Export PNG</Button>
      </section>

      {/* 9. Advanced Drawing & Annotation */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">9. Advanced Drawing & Annotation</h3>
        <Select value={drawingMode} onValueChange={setDrawingMode}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="polygon">Polygon</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="point">Point</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-2">Mode: {drawingMode}</span>
        <ul className="mt-2 text-sm">{annotations.map((a,i)=><li key={i}>{a.text||'Annotation'}</li>)}</ul>
      </section>

      {/* 10. Integration with External GIS Data */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">10. Integration with External GIS Data</h3>
        <Button onClick={()=>handleImportGIS(null)}>Import GeoJSON/KML</Button>
        <ul className="mt-2 text-sm">{externalLayers.map((l,i)=><li key={i}>{l.name||'Layer'}</li>)}</ul>
      </section>

      {/* 11. Mobile & Offline Support */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">11. Mobile & Offline Support</h3>
        <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
        <span className="ml-2">Offline Mode {offlineMode ? 'On' : 'Off'}</span>
        {offlineMode && <div className="text-xs text-yellow-600 mt-2">Offline mode enabled. Some features may be unavailable.</div>}
      </section>

      {/* 12. User Access Control & Sharing */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">12. User Access Control & Sharing</h3>
        <Select value={userRole} onValueChange={setUserRole}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleShare} className="ml-2">Share Map</Button>
        <span className="ml-2">Role: {userRole}</span>
      </section>

      {/* 13. Advanced Analytics & Insights */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">13. Advanced Analytics & Insights</h3>
        <div className="text-sm">Hotspots, trends, and predictive analytics coming soon.</div>
        {/* Analytics dashboard UI would go here */}
      </section>

      {/* 14. Custom Map Providers & Styles */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">14. Custom Map Providers & Styles</h3>
        <Select value={mapProvider} onValueChange={setMapProvider}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {mapProviders.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Custom Tile URL" className="w-96 mt-2" />
      </section>

      {/* 15. Integration with Other App Modules */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">15. Integration with Other App Modules</h3>
        <div className="flex gap-4">
          <Button>Go to CRM</Button>
          <Button>Go to Scheduling</Button>
          <Button>Go to Compliance</Button>
        </div>
      </section>

      {/* 16. Accessibility & Usability */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">16. Accessibility & Usability</h3>
        <Switch /> <span className="ml-2">High Contrast Mode</span>
        {/* Add ARIA labels, keyboard navigation, etc. */}
      </section>

      {/* 17. Real-Time Collaboration */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">17. Real-Time Collaboration</h3>
        <ul className="text-sm">{collaborators.map((c,i)=><li key={i}>{c.name||'User'}</li>)}</ul>
        <div className="text-xs text-gray-500">Presence indicators and live editing coming soon.</div>
      </section>

      {/* 18. Map-Based Task Assignment */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">18. Map-Based Task Assignment</h3>
        <Button onClick={()=>setTasks([...tasks,{id:Date.now(),desc:'New Task'}])}>Assign Task</Button>
        <ul className="mt-2 text-sm">{tasks.map(t=><li key={t.id}>{t.desc}</li>)}</ul>
      </section>

      {/* 19. API for Custom Integrations */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">19. API for Custom Integrations</h3>
        <Input type="text" value="https://api.yourapp.com/mapdata" readOnly className="w-96" />
        <Button className="ml-2">Copy Endpoint</Button>
      </section>

      {/* 20. Audit Trail & Change History */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">20. Audit Trail & Change History</h3>
        <ul className="text-sm">{changeHistory.map((c,i)=><li key={i}>{c.desc||'Change'}</li>)}</ul>
        <Button className="mt-2">Revert Last Change</Button>
      </section>

      {/* 21. Weather Data Integration */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">21. Weather Data Integration</h3>
        <Button onClick={()=>setWeatherData({temp:72,condition:'Sunny'})}>Fetch Weather</Button>
        {weatherData && <div className="mt-2">Temp: {weatherData.temp}°F, {weatherData.condition}</div>}
      </section>

      {/* 22. Weather Overlays */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">22. Weather Overlays</h3>
        <Select value={weatherOverlay} onValueChange={setWeatherOverlay}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="radar">Radar</SelectItem>
            <SelectItem value="precip">Precipitation</SelectItem>
            <SelectItem value="temp">Temperature</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-2">Current Overlay: {weatherOverlay}</span>
      </section>

      {/* 23. Weather-based Alerts & Scheduling */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">23. Weather-based Alerts & Scheduling</h3>
        <ul className="text-sm">{weatherAlerts.map((a,i)=><li key={i}>{a}</li>)}</ul>
        <div className="text-xs text-blue-600">Weather-based scheduling suggestions coming soon.</div>
      </section>

      {/* 24. Historical Weather Analytics */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">24. Historical Weather Analytics</h3>
        <Input type="date" className="w-40" />
        <div className="text-xs text-gray-500">Historical weather chart coming soon.</div>
      </section>

      {/* 25. Weather Data in Reports & Exports */}
      <section className="p-4 bg-white rounded shadow mb-4">
        <h3 className="font-bold mb-2">25. Weather Data in Reports & Exports</h3>
        <Button>Export Weather Data</Button>
        <div className="text-xs text-gray-500">Weather data will be included in exported reports.</div>
      </section>

      <ThemeShowcase />
      <ThemeEffectsShowcase />
      <ThemeSelector />
      <div className="mt-8">
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search address..."
          className="mb-2 p-2 border rounded w-full"
          aria-label="Address search"
        />
        <MapContainer
          center={[PATRICK_COUNTY_CENTER.lat, PATRICK_COUNTY_CENTER.lng]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            attribution="© Esri, Maxar, GeoEye"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {showHeatmap && (
            <HeatmapLayer
              points={heatmapPoints}
              options={{ radius: heatmapRadius, blur: heatmapBlur, max: heatmapMax }}
            />
          )}
        </MapContainer>
        <Button style={{ position: 'absolute', zIndex: 1000, top: 10, right: 10 }} onClick={handleGPS}>
          My Location
        </Button>
      </div>
      <div className="mt-8">
        <UnifiedMapInterface height={400} />
      </div>
    </div>
  );
};

export default AdvancedMapping;
