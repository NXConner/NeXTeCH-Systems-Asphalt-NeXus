
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Calendar, Wrench } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    type: string;
    status: string;
    location: string;
    mileage: string;
    nextMaintenance: string;
    driver: string;
  };
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "In Use":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{vehicle.name}</CardTitle>
              <CardDescription>{vehicle.id} • {vehicle.type}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{vehicle.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Next maintenance: {vehicle.nextMaintenance}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Driver:</span>
          <span>{vehicle.driver}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Mileage:</span>
          <span>{vehicle.mileage} mi</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Wrench className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Track
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
