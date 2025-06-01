
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Driver } from "@/types/driver";
import { User, Star, Clock, AlertTriangle, Phone } from "lucide-react";

interface DriverManagementProps {
  drivers: Driver[];
  onDriverSelect: (driver: Driver) => void;
}

export function DriverManagement({ drivers, onDriverSelect }: DriverManagementProps) {
  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on-leave':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeDrivers = drivers.filter(d => d.status === 'active');
  const availableDrivers = drivers.filter(d => d.status === 'active' && !d.currentJob);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Driver Management
        </CardTitle>
        <CardDescription>
          Manage driver assignments and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">Active Drivers</div>
              <div className="text-2xl font-bold text-green-600">{activeDrivers.length}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Available</div>
              <div className="text-2xl font-bold text-blue-600">{availableDrivers.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {drivers.slice(0, 5).map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-accent" onClick={() => onDriverSelect(driver)}>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{driver.firstName} {driver.lastName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{driver.licenseClass}</span>
                      {driver.currentJob && (
                        <span>• Job: {driver.currentJob}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs">{driver.performanceRating}</span>
                  </div>
                  <Badge className={getStatusColor(driver.status)} variant="secondary">
                    {driver.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            Assign Drivers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
