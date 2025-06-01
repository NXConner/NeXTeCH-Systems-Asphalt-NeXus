
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/fleet";
import { Truck, MapPin, Fuel, User } from "lucide-react";

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
}

export function VehicleList({ vehicles, onVehicleSelect }: VehicleListProps) {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'out-of-service':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    return <Truck className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Vehicles ({vehicles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getVehicleIcon(vehicle.type)}
                  <div>
                    <h3 className="font-semibold">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.fuelLevel}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Mileage:</span>
                  <span>{vehicle.mileage.toLocaleString()}</span>
                </div>
                {vehicle.assignedDriver && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Assigned</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Track Location
                </Button>
                {vehicle.status === 'active' && (
                  <Button size="sm" variant="outline">
                    Schedule Maintenance
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
