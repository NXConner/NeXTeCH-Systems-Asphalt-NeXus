
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FleetDashboard } from "@/components/fleet/FleetDashboard";
import { SchedulingDashboard } from "@/components/scheduling/SchedulingDashboard";
import { MaintenanceTracker } from "@/components/maintenance/MaintenanceTracker";
import { Truck, Calendar, Wrench, BarChart3 } from "lucide-react";

const AdvancedFleetDashboard = () => {
  const [vehicles] = useState([
    {
      id: "VH-001",
      make: "Ford",
      model: "F-150",
      year: 2022,
      licensePlate: "FL-123-ABC",
      status: "active" as const,
      location: "Downtown Job Site",
      fuelLevel: 75,
      mileage: 45000,
      lastService: "2024-01-15",
      nextService: "2024-02-15",
      assignedDriver: "John Smith",
      currentJob: "Main Street Resurfacing"
    },
    {
      id: "VH-002",
      make: "Chevrolet",
      model: "Silverado",
      year: 2021,
      licensePlate: "FL-456-DEF",
      status: "maintenance" as const,
      location: "Service Center",
      fuelLevel: 20,
      mileage: 52000,
      lastService: "2024-01-01",
      nextService: "2024-01-30",
      assignedDriver: "Mike Johnson"
    }
  ]);

  const [scheduleItems] = useState([
    {
      id: "SCH-001",
      type: "job" as const,
      title: "Main Street Resurfacing",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      location: "Main Street, Downtown",
      assignedCrew: ["John Smith", "Mike Johnson"],
      assignedVehicles: ["VH-001"],
      status: "in-progress" as const,
      priority: "high" as const
    }
  ]);

  const [maintenanceItems] = useState([
    {
      id: "MNT-001",
      vehicleId: "VH-002",
      vehicleName: "Chevrolet Silverado (FL-456-DEF)",
      type: "oil-change" as const,
      description: "Oil Change & Filter Replacement",
      priority: "medium" as const,
      status: "overdue" as const,
      dueDate: "2024-01-25",
      estimatedCost: 150,
      assignedTechnician: "Tom Wilson"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Advanced Fleet Management</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive fleet tracking, scheduling, and maintenance management
            </p>
          </div>
        </div>

        <Tabs defaultValue="fleet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="fleet">
              <Truck className="h-4 w-4 mr-2" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="scheduling">
              <Calendar className="h-4 w-4 mr-2" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Wrench className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fleet">
            <FleetDashboard vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="scheduling">
            <SchedulingDashboard scheduleItems={scheduleItems} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTracker maintenanceItems={maintenanceItems} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Fleet Analytics</h3>
              <p className="text-gray-600">Advanced analytics and reporting coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedFleetDashboard;
