
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar, TrendingUp } from "lucide-react";
import { MaintenanceAlert, FleetVehicle } from "@/types/fleetTypes";

interface FleetMaintenanceTabProps {
  maintenanceAlerts: MaintenanceAlert[];
  vehicles: FleetVehicle[];
}

export const FleetMaintenanceTab = ({ maintenanceAlerts, vehicles }: FleetMaintenanceTabProps) => {
  const getAlertColor = (type: MaintenanceAlert['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'overdue': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Maintenance Alerts & Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {maintenanceAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {vehicles.find(v => v.id === alert.vehicleId)?.name}
                  </h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span>Due: {alert.dueDate}</span>
                    {alert.mileage && <span>@ {alert.mileage.toLocaleString()} miles</span>}
                  </div>
                </div>
                <Badge variant="secondary">{alert.type}</Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
          <Button variant="outline" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
