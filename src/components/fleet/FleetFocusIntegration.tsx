
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FleetOverviewStats } from "./FleetOverviewStats";
import { FleetStatusTab } from "./FleetStatusTab";
import { FleetMaintenanceTab } from "./FleetMaintenanceTab";
import { FleetRoutesTab } from "./FleetRoutesTab";
import { FleetAnalyticsTab } from "./FleetAnalyticsTab";
import { FleetLoadingSkeleton } from "./common/FleetLoadingSkeleton";
import { useFleetData } from "@/hooks/useFleetData";
import { useState } from "react";

export function FleetFocusIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    vehicles, 
    maintenanceAlerts, 
    routes, 
    fleetStats 
  } = useFleetData();

  if (isLoading) {
    return <FleetLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FleetOverviewStats 
        totalVehicles={fleetStats.totalVehicles}
        activeVehicles={fleetStats.activeVehicles}
        criticalAlerts={fleetStats.criticalAlerts}
        avgFuelLevel={fleetStats.avgFuelLevel}
      />

      <Tabs defaultValue="fleet" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="routes">Route Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-4">
          <FleetStatusTab vehicles={vehicles} />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <FleetMaintenanceTab 
            maintenanceAlerts={maintenanceAlerts} 
            vehicles={vehicles}
          />
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <FleetRoutesTab routes={routes} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FleetAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
