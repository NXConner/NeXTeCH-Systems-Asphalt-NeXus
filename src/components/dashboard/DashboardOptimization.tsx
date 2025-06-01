import { JobResourceOptimization } from "@/components/dashboard/JobResourceOptimization";
import { LiveFleetMap } from "@/components/dashboard/LiveFleetMap";
import { useJobsData } from "@/hooks/useJobsData";

export const DashboardOptimization = () => {
  const { jobs, isLoading, error } = useJobsData();
  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs</div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <JobResourceOptimization 
        jobs={jobs} 
        availableVehicles={5} 
        availableDrivers={3} 
      />
      <LiveFleetMap />
    </div>
  );
};
