import React from 'react';
import { Map } from '@/components/Map';
import { MapProvider } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
} from 'lucide-react';

const MapPage = () => {
  return (
    <MapProvider>
      <div className="flex h-screen">
        {/* Main Map Area */}
        <div className="flex-1">
          <Map
            height="100vh"
            center={[36.6418, -80.2717]} // Stuart, VA
            zoom={13}
          />
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-background border-l">
          <Tabs defaultValue="layers" className="h-full flex flex-col">
            <TabsList className="w-full justify-start border-b px-4 py-2">
              <TabsTrigger value="layers" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 p-4 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Map Layers</CardTitle>
                  <CardDescription>Toggle map layers and overlays</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Base Map</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        Satellite
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        Street
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Layers</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span>Heatmap</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          <span>Drone Data</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span>PCI Data</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Compliance</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Weather</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          <span>Precipitation</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span>Temperature</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="flex-1 p-4 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Map Tools</CardTitle>
                  <CardDescription>Measurement and drawing tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Measurement</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Ruler className="h-4 w-4 mr-2" />
                        Distance
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Calculator className="h-4 w-4 mr-2" />
                        Area
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Drawing</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Layers className="h-4 w-4 mr-2" />
                        Polygon
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        Point
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Export</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        GeoJSON
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="flex-1 p-4 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>View and analyze map data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search location..." className="pl-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Statistics</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Total Area</div>
                        <div className="text-lg font-semibold">1,234 km²</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Points</div>
                        <div className="text-lg font-semibold">567</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Avg. PCI</div>
                        <div className="text-lg font-semibold">78.5</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Compliance</div>
                        <div className="text-lg font-semibold">92%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MapProvider>
  );
};

export default MapPage; 