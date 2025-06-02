import { useState } from "react";
import { OptimizedVehicleSelector } from "./advanced/OptimizedVehicleSelector";
import { VehicleDiagnostics } from "./advanced/VehicleDiagnostics";
import { MaintenanceStatus } from "./advanced/MaintenanceStatus";
import { PerformanceMetrics } from "./advanced/PerformanceMetrics";
import { FleetOverviewTable } from "./advanced/FleetOverviewTable";
import { FleetLoadingSkeleton } from "./common/FleetLoadingSkeleton";
import { useFleetData } from '@/hooks/useFleetData';
import { VehicleMetrics } from "@/types/fleetTypes";

export function AdvancedFleetTracking() {
  const { vehicles, isLoading, error } = useFleetData();
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicles[0]?.id || '');
  const [timeRange, setTimeRange] = useState('24h');

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  if (isLoading) {
    return <FleetLoadingSkeleton />;
  }
  if (error) {
    return <div>Error loading fleet data</div>;
  }

  return (
    <div className="space-y-6">
      <OptimizedVehicleSelector
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        timeRange={timeRange}
        onVehicleChange={setSelectedVehicle}
        onTimeRangeChange={setTimeRange}
      />

      {selectedVehicleData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VehicleDiagnostics vehicle={selectedVehicleData} />
            <MaintenanceStatus vehicle={selectedVehicleData} />
            <PerformanceMetrics vehicle={selectedVehicleData} />
          </div>

          <FleetOverviewTable 
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />
        </>
      )}
    </div>
  );
}
