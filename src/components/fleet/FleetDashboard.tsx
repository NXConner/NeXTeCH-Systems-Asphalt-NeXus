
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  AlertTriangle, 
  Fuel, 
  MapPin, 
  Clock,
  Wrench,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'out-of-service';
  location: string;
  fuelLevel: number;
  mileage: number;
  lastService: string;
  nextService: string;
  assignedDriver: string;
  currentJob?: string;
}

interface FleetDashboardProps {
  vehicles: Vehicle[];
}

export const FleetDashboard = ({ vehicles }: FleetDashboardProps) => {
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance');
  const lowFuelVehicles = vehicles.filter(v => v.fuelLevel < 25);
  const averageFuel = vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length;

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'out-of-service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelColor = (level: number) => {
    if (level < 25) return 'text-red-600';
    if (level < 50) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <div className="text-sm text-muted-foreground">Total Vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{maintenanceVehicles.length}</div>
                <div className="text-sm text-muted-foreground">In Maintenance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(averageFuel)}%</div>
                <div className="text-sm text-muted-foreground">Avg Fuel Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-muted-foreground">Fleet Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Active Fleet ({activeVehicles.length})
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              View Map
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                      <p className="text-xs text-muted-foreground">Driver: {vehicle.assignedDriver}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`font-semibold ${getFuelColor(vehicle.fuelLevel)}`}>
                        {vehicle.fuelLevel}%
                      </div>
                      <div className="text-xs text-muted-foreground">Fuel</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold">{vehicle.mileage.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Miles</div>
                    </div>
                    
                    <div className="text-center">
                      <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                        {vehicle.status}
                      </Badge>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
                
                {vehicle.currentJob && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <strong>Current Job:</strong> {vehicle.currentJob}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Alerts */}
      {maintenanceVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Wrench className="h-5 w-5" />
              Maintenance Required ({maintenanceVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <div>
                    <h4 className="font-medium">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                    <p className="text-xs text-orange-600">Next service due: {vehicle.nextService}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Schedule Service
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Fuel Alerts */}
      {lowFuelVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Fuel className="h-5 w-5" />
              Low Fuel Alerts ({lowFuelVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowFuelVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                    <div className="mt-1">
                      <Progress value={vehicle.fuelLevel} className="h-2 w-32" />
                      <p className="text-xs text-red-600 mt-1">{vehicle.fuelLevel}% fuel remaining</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Find Gas Station
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
