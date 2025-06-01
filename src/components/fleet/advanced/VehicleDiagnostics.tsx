
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Thermometer, Gauge, Zap } from "lucide-react";

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

interface VehicleDiagnosticsProps {
  vehicle: VehicleMetrics;
}

export const VehicleDiagnostics = ({ vehicle }: VehicleDiagnosticsProps) => {
  const getTempStatus = (temp: number) => {
    if (temp < 180) return { color: "text-blue-600", status: "Cold" };
    if (temp < 200) return { color: "text-green-600", status: "Normal" };
    if (temp < 220) return { color: "text-yellow-600", status: "Warm" };
    return { color: "text-red-600", status: "Hot" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Engine Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Engine Temp</span>
          </div>
          <div className="text-right">
            <div className={`font-medium ${getTempStatus(vehicle.engineTemp).color}`}>
              {vehicle.engineTemp}°F
            </div>
            <div className="text-xs text-muted-foreground">
              {getTempStatus(vehicle.engineTemp).status}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Oil Pressure</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{vehicle.oilPressure} PSI</div>
            <div className="text-xs text-green-600">Normal</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-sm">Battery</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{vehicle.batteryLevel}%</div>
            <Progress value={vehicle.batteryLevel} className="w-16 h-2" />
          </div>
        </div>

        {vehicle.diagnosticCode && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Diagnostic Code</span>
            </div>
            <div className="text-sm text-yellow-800 mt-1">
              {vehicle.diagnosticCode} - Catalytic Converter Efficiency
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
