
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";
import { RouteOptimization } from "@/types/fleetTypes";

interface FleetRoutesTabProps {
  routes: RouteOptimization[];
}

export const FleetRoutesTab = ({ routes }: FleetRoutesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Route Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{route.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {route.vehicles.length} vehicles assigned
                  </p>
                </div>
                <Badge variant="secondary">{route.efficiency}% efficient</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{route.totalDistance} miles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{route.estimatedTime}h estimated</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${route.fuelCost} fuel cost</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{route.efficiency}% efficiency</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Button className="flex-1">
            <Route className="h-4 w-4 mr-2" />
            Optimize Routes
          </Button>
          <Button variant="outline" className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            View Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
