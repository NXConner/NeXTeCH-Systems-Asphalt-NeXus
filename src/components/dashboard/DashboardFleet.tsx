import { ResourceAllocation } from "@/components/dashboard/ResourceAllocation";
import { DriverManagement } from "@/components/fleet/DriverManagement";
import { useResourceData } from "@/hooks/useResourceData";
import { useDriverManagement } from "@/hooks/useDriverManagement";

export const DashboardFleet = () => {
  const { resources, isLoading: resourcesLoading, error: resourcesError } = useResourceData();
  const { drivers, handleDriverSelect, isLoading: driversLoading, error: driversError } = useDriverManagement();
  if (resourcesLoading || driversLoading) return <div>Loading...</div>;
  if (resourcesError || driversError) return <div>Error loading data</div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ResourceAllocation resources={resources} />
      <DriverManagement drivers={drivers} onDriverSelect={handleDriverSelect} />
    </div>
  );
};
