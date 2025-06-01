import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import QuickActions from "@/components/dashboard/QuickActions";
import { ResourceAllocation } from "@/components/dashboard/ResourceAllocation";
import { LiveFleetMap } from "@/components/dashboard/LiveFleetMap";
import { useResourceData } from "@/hooks/useResourceData";

export const DashboardOverview = () => {
  const { resources, isLoading, error } = useResourceData();
  if (isLoading) return <div>Loading resources...</div>;
  if (error) return <div>Error loading resources</div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <UpcomingJobs />
        <ResourceAllocation resources={resources} />
      </div>
      <div className="space-y-6">
        <QuickActions />
        <LiveFleetMap />
      </div>
    </div>
  );
};
