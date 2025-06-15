import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Navigation, 
  Users, 
  Clock, 
  Zap,
  Activity,
  TrendingUp,
  Eye,
  Settings,
  Car
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import HeatmapLayer from '../maps/HeatmapLayer';
import DroneOverlay from '../mapping/DroneOverlay';
import PCIHeatmapOverlay from '../mapping/PCIHeatmapOverlay';

interface EmployeeLocation {
  id: string;
  name: string;
  position: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'break' | 'offline';
  speed: number;
  lastUpdate: string;
  currentJob?: string;
  todayHours: number;
  completedTasks: number;
  efficiency: number;
}

interface MapSource {
  id: string;
  name: string;
  url: string;
  attribution: string;
  type: 'satellite' | 'street' | 'terrain' | 'dark';
}

interface VehicleLocation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: string;
  speed: number;
  lastUpdate: string;
  driver?: string;
}

const PATRICK_COUNTY_CENTER = { lat: 36.6354, lng: -80.3210 };

export function EmployeeTrackingMap() {
  const [employees, setEmployees] = useState<EmployeeLocation[]>([]);
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [mapSource, setMapSource] = useState("satellite");
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const mapRef = useRef<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showDrone, setShowDrone] = useState(false);
  const [showPCI, setShowPCI] = useState(false);

  const mapSources: MapSource[] = [
    {
      id: "osm",
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      type: "street"
    },
    {
      id: "satellite",
      name: "Satellite (Esri)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri, Maxar, GeoEye",
      type: "satellite"
    },
    {
      id: "terrain",
      name: "Terrain (Stamen)",
      url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
      attribution: "© Stamen Design, CC BY 3.0",
      type: "terrain"
    },
    {
      id: "dark",
      name: "Dark Mode (CartoDB)",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution: "© CartoDB, © OpenStreetMap",
      type: "dark"
    },
    {
      id: "topo",
      name: "Topographic (USGS)",
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      attribution: "© USGS",
      type: "terrain"
    }
  ];

  useEffect(() => {
    let empSub: any, vehSub: any;
    async function fetchAndSubscribe() {
      // Fetch employee locations
      const { data: locations, error } = await supabase
        .from('employee_locations')
        .select('*');
      if (!error && locations) {
        setEmployees(locations.map((loc: any) => ({
          id: loc.user_id,
          name: loc.name || 'Unknown',
          position: loc.position || '',
          lat: loc.lat,
          lng: loc.lng,
          status: 'active',
          speed: 0,
          lastUpdate: loc.timestamp,
          currentJob: '',
          todayHours: 0,
          completedTasks: 0,
          efficiency: 0
        })));
      }
      // Fetch vehicle locations
      const { data: vehiclesData, error: vehError } = await supabase
        .from('vehicles')
        .select('*');
      if (!vehError && vehiclesData) {
        setVehicles(vehiclesData.map((v: any) => ({
          id: v.id,
          name: v.name,
          type: v.type,
          lat: v.location.lat,
          lng: v.location.lng,
          status: v.status,
          speed: v.speed,
          lastUpdate: v.location.lastUpdate,
          driver: v.driver
        })));
      }
      // Subscribe to employee locations
      empSub = supabase
        .channel('employee_locations')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_locations' }, payload => {
          setEmployees(prev => {
            const idx = prev.findIndex(e => e.id === payload.new.user_id);
            const updated = {
              id: payload.new.user_id,
              name: payload.new.name || 'Unknown',
              position: payload.new.position || '',
              lat: payload.new.lat,
              lng: payload.new.lng,
              status: 'active',
              speed: 0,
              lastUpdate: payload.new.timestamp,
              currentJob: '',
              todayHours: 0,
              completedTasks: 0,
              efficiency: 0
            };
            if (idx !== -1) {
              const arr = [...prev];
              arr[idx] = updated;
              return arr;
            } else {
              return [...prev, updated];
            }
          });
        })
        .subscribe();
      // Subscribe to vehicle locations
      vehSub = supabase
        .channel('vehicles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, payload => {
          setVehicles(prev => {
            const idx = prev.findIndex(v => v.id === payload.new.id);
            const updated = {
              id: payload.new.id,
              name: payload.new.name,
              type: payload.new.type,
              lat: payload.new.location.lat,
              lng: payload.new.location.lng,
              status: payload.new.status,
              speed: payload.new.speed,
              lastUpdate: payload.new.location.lastUpdate,
              driver: payload.new.driver
            };
            if (idx !== -1) {
              const arr = [...prev];
              arr[idx] = updated;
              return arr;
            } else {
              return [...prev, updated];
            }
          });
        })
        .subscribe();
    }
    fetchAndSubscribe();
    return () => {
      if (empSub) supabase.removeChannel(empSub);
      if (vehSub) supabase.removeChannel(vehSub);
    };
  }, []);

  const getStatusColor = (status: EmployeeLocation['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'break': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: EmployeeLocation['status']) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'idle': return <Clock className="h-4 w-4" />;
      case 'break': return <Clock className="h-4 w-4" />;
      case 'offline': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    return `${Math.round(diff / 3600)}h ago`;
  };

  const selectedEmp = employees.find(emp => emp.id === selectedEmployee);

  const stats = {
    totalEmployees: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    avgEfficiency: Math.round(employees.reduce((sum, e) => sum + e.efficiency, 0) / employees.length),
    totalHours: employees.reduce((sum, e) => sum + e.todayHours, 0)
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        if (mapRef.current) {
          mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 10);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                <div className="text-sm text-muted-foreground">Total Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.avgEfficiency}%</div>
                <div className="text-sm text-muted-foreground">Avg Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-700" />
              <div>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <div className="text-sm text-muted-foreground">Vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Real-Time Employee Tracking
                </span>
                <div className="flex gap-2">
                  <Select value={mapSource} onValueChange={setMapSource}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mapSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    variant={trackingEnabled ? "default" : "outline"}
                    onClick={() => setTrackingEnabled(!trackingEnabled)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {trackingEnabled ? "Live" : "Paused"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <div style={{ position: 'absolute', zIndex: 1100, top: 10, left: 10, display: 'flex', gap: 8 }}>
                  <Button size="sm" variant={showHeatmap ? 'default' : 'outline'} onClick={() => setShowHeatmap(v => !v)}>Heatmap</Button>
                  <Button size="sm" variant={showDrone ? 'default' : 'outline'} onClick={() => setShowDrone(v => !v)}>Drone</Button>
                  <Button size="sm" variant={showPCI ? 'default' : 'outline'} onClick={() => setShowPCI(v => !v)}>PCI</Button>
                </div>
                <Button style={{ position: 'absolute', zIndex: 1000, top: 10, right: 10 }} onClick={handleGPS}>
                  My Location
                </Button>
                <MapContainer
                  center={[PATRICK_COUNTY_CENTER.lat, PATRICK_COUNTY_CENTER.lng]}
                  zoom={14}
                  style={{ width: '100%', height: 600 }}
                  scrollWheelZoom={true}
                  className="h-[600px] w-full"
                  whenCreated={mapInstance => { mapRef.current = mapInstance; }}
                >
                  <TileLayer
                    attribution={mapSources.find(s => s.id === mapSource)?.attribution}
                    url={mapSources.find(s => s.id === mapSource)?.url || mapSources[1].url}
                  />
                  {employees.map((employee) => (
                    <Marker
                      key={employee.id}
                      position={[employee.lat, employee.lng]}
                      icon={L.divIcon({
                        className: `employee-marker ${selectedEmployee === employee.id ? 'ring-2 ring-blue-500 scale-110' : ''}`,
                        html: `<div style='background:#fff;padding:4px 8px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);display:flex;align-items:center;gap:4px;'>👤 ${employee.name}</div>`
                      })}
                      eventHandlers={{
                        click: () => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]}>{employee.name} ({employee.status})</Tooltip>
                      <Popup>
                        <div>
                          <strong>{employee.name}</strong><br />
                          {employee.position}<br />
                          Status: {employee.status}<br />
                          Last update: {formatTimestamp(employee.lastUpdate)}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {vehicles.map((vehicle) => (
                    <Marker
                      key={vehicle.id}
                      position={[vehicle.lat, vehicle.lng]}
                      icon={L.divIcon({
                        className: 'vehicle-marker',
                        html: `<div style='background:#e0f2fe;padding:4px 8px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);display:flex;align-items:center;gap:4px;'>🚗 ${vehicle.name}</div>`
                      })}
                    >
                      <Tooltip direction="top" offset={[0, -10]}>{vehicle.name} ({vehicle.status})</Tooltip>
                      <Popup>
                        <div>
                          <strong>{vehicle.name}</strong><br />
                          Type: {vehicle.type}<br />
                          Status: {vehicle.status}<br />
                          Last update: {formatTimestamp(vehicle.lastUpdate)}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {showHeatmap && (
                    <HeatmapLayer points={[]} />
                  )}
                  {showDrone && (
                    <DroneOverlay data={[]} />
                  )}
                  {showPCI && (
                    <PCIHeatmapOverlay pciData={[]} />
                  )}
                </MapContainer>
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium mb-2">Status Legend</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Idle</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Break</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Offline</span>
                    </div>
                  </div>
                </div>
                
                {/* Real-time indicator */}
                {trackingEnabled && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Tracking
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Details & Stats */}
        <div className="space-y-6">
          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div 
                    key={employee.id} 
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedEmployee === employee.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{employee.name}</h4>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <Badge className={getStatusColor(employee.status)} variant="secondary">
                        {employee.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(employee.lastUpdate)}
                      </div>
                      {employee.currentJob && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3" />
                          {employee.currentJob}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Employee Details */}
          {selectedEmp && (
            <Card>
              <CardHeader>
                <CardTitle>Employee Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stats" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{selectedEmp.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Position:</span>
                          <span>{selectedEmp.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Today's Hours:</span>
                          <span>{selectedEmp.todayHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span>{selectedEmp.completedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span className={selectedEmp.efficiency >= 90 ? 'text-green-600 font-medium' : selectedEmp.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                            {selectedEmp.efficiency}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Job:</span>
                          <span className="text-right">{selectedEmp.currentJob || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Location Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedEmp.status)} variant="secondary">
                            {selectedEmp.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span>{selectedEmp.speed} mph</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coordinates:</span>
                          <span className="font-mono text-xs">
                            {selectedEmp.lat.toFixed(4)}, {selectedEmp.lng.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Update:</span>
                          <span>{formatTimestamp(selectedEmp.lastUpdate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 mr-2" />
                        Center
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Track
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
