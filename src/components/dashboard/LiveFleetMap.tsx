import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Truck, AlertTriangle } from "lucide-react";
import { useFleetData } from "@/hooks/useFleetData";

export function LiveFleetMap() {
  const { vehicles, isLoading, error } = useFleetData();
  if (isLoading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicles</div>;
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const lowFuelVehicles = vehicles.filter(v => v.fuelLevel < 25);
  const maintenanceAlerts = vehicles.filter(v => v.status === 'maintenance');

  const getStatusIndicator = (vehicle) => {
    if (vehicle.fuelLevel < 25) return { color: 'bg-red-500', icon: AlertTriangle };
    if (vehicle.status === 'maintenance') return { color: 'bg-orange-500', icon: AlertTriangle };
    return { color: 'bg-green-500', icon: Truck };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Live Fleet Tracking
        </CardTitle>
        <CardDescription>
          Real-time vehicle locations and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-50 rounded text-center">
              <div className="text-lg font-bold text-green-600">{activeVehicles.length}</div>
              <div className="text-xs text-green-800">Active</div>
            </div>
            <div className="p-2 bg-red-50 rounded text-center">
              <div className="text-lg font-bold text-red-600">{lowFuelVehicles.length}</div>
              <div className="text-xs text-red-800">Low Fuel</div>
            </div>
            <div className="p-2 bg-orange-50 rounded text-center">
              <div className="text-lg font-bold text-orange-600">{maintenanceAlerts.length}</div>
              <div className="text-xs text-orange-800">Alerts</div>
            </div>
          </div>

          {/* Mock Map Placeholder */}
          <div className="h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Interactive Fleet Map</div>
              <div className="text-xs">Real-time GPS tracking</div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {vehicles.slice(0, 4).map((vehicle) => {
              const status = getStatusIndicator(vehicle);
              const StatusIcon = status.icon;
              return (
                <div key={vehicle.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span className="font-medium">{vehicle.licensePlate}</span>
                    <span className="text-muted-foreground">{vehicle.make} {vehicle.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{vehicle.fuelLevel}%</span>
                    <StatusIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full">
            View Full Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
