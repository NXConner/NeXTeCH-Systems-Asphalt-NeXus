
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Route, TrendingUp } from "lucide-react";
import { VehicleMetrics } from "@/types/fleetTypes";

interface PerformanceMetricsProps {
  vehicle: VehicleMetrics;
}

export const PerformanceMetrics = ({ vehicle }: PerformanceMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Fuel Efficiency</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{vehicle.fuelEfficiency} MPG</div>
            <div className="text-xs text-green-600">+8% vs avg</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Today's Miles</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{vehicle.todayMiles}</div>
            <div className="text-xs text-muted-foreground">
              {vehicle.totalMiles.toLocaleString()} total
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm">Utilization</span>
          </div>
          <div className="text-right">
            <div className="font-medium">87%</div>
            <div className="text-xs text-green-600">Above target</div>
          </div>
        </div>

        <Button size="sm" variant="outline" className="w-full">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
};
