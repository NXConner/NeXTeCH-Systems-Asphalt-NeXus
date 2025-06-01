
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleMetrics {
  id: string;
  name: string;
  type: string;
  fuelEfficiency: number;
  engineTemp: number;
  oilPressure: number;
  brakePadLife: number;
  tireHealth: number;
  batteryLevel: number;
  diagnosticCode?: string;
  lastMaintenance: string;
  nextService: string;
  totalMiles: number;
  todayMiles: number;
}

interface FleetOverviewTableProps {
  vehicles: VehicleMetrics[];
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

export const FleetOverviewTable = ({ vehicles, selectedVehicle, onVehicleSelect }: FleetOverviewTableProps) => {
  const getHealthBadge = (value: number) => {
    if (value >= 80) return "bg-green-100 text-green-800";
    if (value >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTempStatus = (temp: number) => {
    if (temp < 180) return { color: "text-blue-600", status: "Cold" };
    if (temp < 200) return { color: "text-green-600", status: "Normal" };
    if (temp < 220) return { color: "text-yellow-600", status: "Warm" };
    return { color: "text-red-600", status: "Hot" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className={`
                p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedVehicle === vehicle.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
              `}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getHealthBadge(vehicle.tireHealth)}>
                    {vehicle.tireHealth}% Health
                  </Badge>
                  {vehicle.diagnosticCode && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Alert
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fuel Efficiency:</span>
                  <div className="font-medium">{vehicle.fuelEfficiency} MPG</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Engine Temp:</span>
                  <div className={`font-medium ${getTempStatus(vehicle.engineTemp).color}`}>
                    {vehicle.engineTemp}°F
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Today's Miles:</span>
                  <div className="font-medium">{vehicle.todayMiles}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Service:</span>
                  <div className="font-medium text-blue-600">{vehicle.nextService}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
