
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Activity, AlertTriangle, Fuel } from "lucide-react";

interface FleetOverviewStatsProps {
  totalVehicles: number;
  activeVehicles: number;
  criticalAlerts: number;
  avgFuelLevel: number;
}

export const FleetOverviewStats = ({ 
  totalVehicles, 
  activeVehicles, 
  criticalAlerts, 
  avgFuelLevel 
}: FleetOverviewStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{totalVehicles}</div>
              <div className="text-sm text-muted-foreground">Total Fleet</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{activeVehicles}</div>
              <div className="text-sm text-muted-foreground">Active Now</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">{criticalAlerts}</div>
              <div className="text-sm text-muted-foreground">Critical Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{avgFuelLevel}%</div>
              <div className="text-sm text-muted-foreground">Avg Fuel Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
