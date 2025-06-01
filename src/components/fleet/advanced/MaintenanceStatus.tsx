
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wrench } from "lucide-react";
import { VehicleMetrics } from "@/types/fleetTypes";

interface MaintenanceStatusProps {
  vehicle: VehicleMetrics;
}

export const MaintenanceStatus = ({ vehicle }: MaintenanceStatusProps) => {
  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Maintenance Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Brake Pads</span>
              <span className={`text-sm font-medium ${getHealthColor(vehicle.brakePadLife)}`}>
                {vehicle.brakePadLife}%
              </span>
            </div>
            <Progress value={vehicle.brakePadLife} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Tire Health</span>
              <span className={`text-sm font-medium ${getHealthColor(vehicle.tireHealth)}`}>
                {vehicle.tireHealth}%
              </span>
            </div>
            <Progress value={vehicle.tireHealth} className="h-2" />
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Last Service:</span>
            <span>{vehicle.lastMaintenance}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Next Service:</span>
            <span className="text-blue-600">{vehicle.nextService}</span>
          </div>
        </div>

        <Button size="sm" className="w-full">
          <Wrench className="h-4 w-4 mr-2" />
          Schedule Service
        </Button>
      </CardContent>
    </Card>
  );
};
