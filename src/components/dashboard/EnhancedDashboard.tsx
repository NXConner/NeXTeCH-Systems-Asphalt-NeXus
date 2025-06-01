import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, AlertTriangle, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useCrossComponentLinks } from "@/hooks/useCrossComponentLinks";
import { useFleetData } from "@/hooks/useFleetData";
import { useJobsData } from "@/hooks/useJobsData";
import { useMaintenanceRecordsData } from "@/hooks/useMaintenanceRecordsData";

export const EnhancedDashboard = () => {
  const { linkToVehicle, linkToJob, linkToMaintenance } = useCrossComponentLinks();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useFleetData();
  const { jobs, isLoading: jobsLoading, error: jobsError } = useJobsData();
  const { maintenanceRecords, isLoading: maintenanceLoading, error: maintenanceError } = useMaintenanceRecordsData();
  if (vehiclesLoading || jobsLoading || maintenanceLoading) return <div>Loading...</div>;
  if (vehiclesError || jobsError || maintenanceError) return <div>Error loading dashboard data</div>;

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const criticalMaintenanceCount = maintenanceRecords.filter(m => m.priority === 'critical').length;
  const activeJobsCount = jobs.filter(j => j.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => linkToVehicle('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{activeVehicles.length}</div>
                <div className="text-sm text-muted-foreground">Total Vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => linkToJob('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{activeJobsCount}</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => linkToMaintenance('all')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{criticalMaintenanceCount}</div>
                <div className="text-sm text-muted-foreground">Maintenance Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">$124.5K</div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Active Jobs
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => linkToJob('all')}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobs.filter(job => job.status === 'in-progress').map((job) => (
              <div 
                key={job.id} 
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => linkToJob(job.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.customer}</p>
                    <p className="text-xs text-muted-foreground">{job.address}</p>
                  </div>
                  <Badge variant="secondary">{job.priority}</Badge>
                </div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>Est: ${job.estimatedValue.toLocaleString()}</span>
                  <span>Due: {job.estimatedCompletion}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fleet Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Fleet Status
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => linkToVehicle('all')}
            >
              Fleet Management
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeVehicles.slice(0, 3).map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => linkToVehicle(vehicle.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.assignedDriver}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{vehicle.fuelLevel}% Fuel</div>
                    <Badge variant="secondary">{vehicle.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;
