import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { FleetStats } from "@/components/fleet/FleetStats";
import { VehicleList } from "@/components/fleet/VehicleList";
import { Vehicle } from "@/types/fleet";
import { AdvancedFleetTracking } from "@/components/fleet/AdvancedFleetTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceAllocation } from "@/components/dashboard/ResourceAllocation";
import { DriverManagement } from "@/components/fleet/DriverManagement";
import { useDriverManagement } from "@/hooks/useDriverManagement";
import { useResourceData } from "@/hooks/useResourceData";
import { useFleetData } from "@/hooks/useFleetData";

const FleetManagement = () => {
  const { resources, isLoading: resourcesLoading, error: resourcesError } = useResourceData();
  const { drivers, handleDriverSelect, isLoading: driversLoading, error: driversError } = useDriverManagement();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useFleetData();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    driversOnDuty: vehicles.filter(v => v.assignedDriver).length,
    vehiclesInMaintenance: vehicles.filter(v => v.status === 'maintenance').length
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    console.log('Selected vehicle:', vehicle);
  };

  if (resourcesLoading || driversLoading || vehiclesLoading) return <div>Loading...</div>;
  if (resourcesError || driversError || vehiclesError) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your asphalt equipment fleet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <FleetStats stats={fleetStats} />

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Diagnostics</TabsTrigger>
          <TabsTrigger value="management">Vehicle Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VehicleList vehicles={vehicles} onVehicleSelect={handleVehicleSelect} />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common fleet management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Schedule Maintenance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Assign Drivers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Track Fuel Usage
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedFleetTracking />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResourceAllocation resources={resources} />
            <DriverManagement drivers={drivers} onDriverSelect={handleDriverSelect} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetManagement;
