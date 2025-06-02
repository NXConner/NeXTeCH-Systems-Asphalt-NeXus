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
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import ARProjection from '../components/ui/ARProjection';
import { fetchMapData } from '@/services/mappingService';

const mapProviders = [
  { id: 'leaflet', name: 'Leaflet OSM', style: 'osm' },
  { id: 'esri', name: 'Esri World Imagery', style: 'esri' },
  { id: 'usgs', name: 'USGS Topo', style: 'usgs' },
  { id: 'qgis', name: 'QGIS', style: 'qgis' },
];

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
  const [provider, setProvider] = useState(mapProviders[0].id);
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

  const geofenceRegion = useMemo(() => ({
    id: 'demo-geofence',
    name: 'HQ Lot',
    center: { lat: 37.5, lng: -77.4 },
    radius: 0.001 // ~100m
  }), []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Advanced Mapping & Measurement</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered asphalt detection with manual editing and real-time employee tracking
        </p>
      </div>

      {/* Search & Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Geocoding & Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Enter address (e.g., 123 Main St, City, State)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGeocodeSearch()}
              />
            </div>
            <Button onClick={handleGeocodeSearch}>
              <MapPin className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-sm font-medium">Mode:</span>
            <div className="flex gap-2">
              <Button 
                variant={mapMode === "measure" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeSwitch("measure")}
              >
                <Ruler className="h-4 w-4 mr-2" />
                Measure
              </Button>
              <Button 
                variant={mapMode === "pressure-wash" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeSwitch("pressure-wash")}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Pressure Wash
              </Button>
              <Button 
                variant={mapMode === "detect" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeSwitch("detect")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Detect
              </Button>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Users className="h-4 w-4" />
              <span className="text-sm">Employee Tracking</span>
              <Switch 
                checked={showEmployeeTracking} 
                onCheckedChange={setShowEmployeeTracking}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          {mapMode === "detect" ? (
            <AsphaltDetection 
              onAreaSelect={handleAreaSelect}
              showEmployeeTracking={showEmployeeTracking}
              highlight={asphaltHighlight}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Interactive Map
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={exportToGeoJSON}>
                      <Download className="h-4 w-4 mr-2" />
                      Export GeoJSON
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 h-96 rounded-lg flex items-center justify-center relative">
                  {/* Mock Map Interface */}
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600">Interactive Satellite Map</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {mapMode === "measure" && "Draw shapes to measure area & perimeter"}
                      {mapMode === "pressure-wash" && "Mark dirty (red) and clean (green) zones"}
                    </p>
                  </div>
                  
                  {/* Mode-specific overlays */}
                  {mapMode === "pressure-wash" && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-red-100 text-red-800">Dirty Zones</Badge>
                      <Badge className="bg-green-100 text-green-800">Clean Zones</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Measurement Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>Total Area:</span>
                  <span className="font-mono">{measurements.area.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Perimeter:</span>
                  <span className="font-mono">{measurements.perimeter.toLocaleString()} ft</span>
                </div>
              </div>
              
              {mapMode === "pressure-wash" && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Dirty Zones:</span>
                    <span className="font-mono text-red-600">{measurements.dirtyZones.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clean Zones:</span>
                    <span className="font-mono text-green-600">{measurements.cleanZones.toLocaleString()} sq ft</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Est. Water: {Math.round(measurements.dirtyZones * 0.5)} gallons
                  </div>
                </div>
              )}
              
              {selectedArea && (
                <div className="pt-2 border-t">
                  <Button onClick={exportToEstimate} className="w-full">
                    Export to Estimate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employee Tracking Panel */}
          {showEmployeeTracking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Live Employee Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">John Doe</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Jane Smith</span>
                    </div>
                    <Badge variant="outline" className="text-orange-600">Break</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Mike Johnson</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600">Travel</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PCI Heatmap Control */}
          <Card>
            <CardHeader>
              <CardTitle>PCI Heatmap</CardTitle>
              <CardDescription>Pavement Condition Index overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span>Show Heatmap</span>
                <Switch />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Excellent (85-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Fair (55-85)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Poor (0-55)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="provider-select">Map Provider</Label>
              <Select id="provider-select" title="Select map provider" aria-label="Select map provider" value={provider} onValueChange={setProvider}>
                <SelectTrigger title="Map provider" aria-label="Map provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mapProviders.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={()=>setIsPopout(v=>!v)}>{isPopout?'Dock':'Popout'}</Button>
              <Button onClick={()=>setIsPinned(v=>!v)}>{isPinned?'Unpin':'Pin'}</Button>
              <Switch checked={asphaltHighlight} onCheckedChange={setAsphaltHighlight} /> Asphalt Highlight
              <div className="mt-2 flex items-center gap-2">
                <Switch checked={geofencingEnabled} onCheckedChange={setGeofencingEnabled} /> Geofencing
                {geofencingEnabled && (
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${inGeofence ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {inGeofence ? 'Inside Geofence' : 'Outside Geofence'}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PCI Heatmap Overlay (choropleth) */}
      {mapMode === 'detect' && pciData.length > 0 && !pciLoading && (
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={pciData.map(p => ({lat: p.lat, lng: p.lng, value: p.pci}))}
          longitudeExtractor={m => m.lng}
          latitudeExtractor={m => m.lat}
          intensityExtractor={m => m.value}
          max={100}
          radius={30}
          blur={20}
          gradient={{0.55: 'red', 0.85: 'yellow', 1.0: 'green'}}
        />
      )}
      {pciLoading && <div className="text-center text-sm text-muted-foreground">Loading PCI data...</div>}
      {pciError && <div className="text-center text-sm text-red-600">{pciError}</div>}

      {/* Compliance Overlays (VDOT/ADA/DEQ) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <Button size="sm" onClick={addComplianceZone}>Add Compliance Zone</Button>
      </div>
      {complianceZones && complianceZones.map(zone => (
        <div
          key={zone.id}
          className={`absolute z-10 border-2 ${zone.compliant ? 'border-green-500' : 'border-red-500'}`}
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
            background: zone.compliant ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)',
            filter: zone.compliant ? 'blur(2px)' : 'hue-rotate(180deg)',
            borderRadius: '8px',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
          title={zone.tooltip}
          onClick={() => setEditingZone(zone)}
          draggable
          onDragEnd={e => updateComplianceZone(zone.id, { x: e.clientX, y: e.clientY })}
        />
      ))}
      {editingZone && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="font-bold mb-2">Edit Compliance Zone</h3>
            <label className="block mb-2">Tooltip
              <input className="w-full border p-1" value={editingZone.tooltip} onChange={e => updateComplianceZone(editingZone.id, { tooltip: e.target.value })} />
            </label>
            <label className="block mb-2">Compliant
              <input type="checkbox" checked={editingZone.compliant} onChange={e => updateComplianceZone(editingZone.id, { compliant: e.target.checked })} />
            </label>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => setEditingZone(null)}>Close</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteComplianceZone(editingZone.id)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Pressure Wash Mode: Interactive dirty/clean zone drawing */}
      {mapMode === 'pressure-wash' && dirtyZones && cleanZones && (
        <PressureWashZoneDrawer
          dirtyZones={dirtyZones}
          cleanZones={cleanZones}
          onDrawZone={handleDrawZone}
          onPhotoUpload={handleBeforeAfterPhotoUpload}
        />
      )}

      {/* Line Striping Templates */}
      <LineStripingTemplateLibrary
        onDropTemplate={handleDropLineTemplate}
        selectedArea={selectedArea}
      />

      {/* AR Mode Toggle */}
      <div className="fixed top-4 left-4 z-40">
        <Button onClick={() => setArMode(v => !v)}>{arMode ? 'Exit AR Mode' : 'Enter AR Mode'}</Button>
      </div>
      {arMode && (
        <ARProjection
          type="measurement"
          content="Area: 500 sq ft, Cost: $5,000"
          position={{ lat: 100, lng: 200 }}
          overlays={[
            ...pciData.map(p => ({ type: 'pci', content: '', position: { lat: p.lat, lng: p.lng }, pciScore: p.pci })),
            ...complianceZones.map(z => ({ type: 'compliance', content: z.tooltip, position: { lat: z.x, lng: z.y }, compliant: z.compliant, tooltip: z.tooltip })),
            // Mock cracks
            { type: 'crack', content: 'Crack Detected', position: { lat: 120, lng: 210 }, tooltip: 'Crack severity: High' }
          ]}
        />
      )}
    </div>
  );
};

export default AdvancedMapping;
