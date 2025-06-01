
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, MapPin, Calendar, Wrench, User, Gauge } from "lucide-react";

interface VehicleDetailsProps {
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
  children: React.ReactNode;
}

const VehicleDetails = ({ vehicle, children }: VehicleDetailsProps) => {
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

  const maintenanceHistory = [
    { date: "2024-05-15", type: "Oil Change", cost: "$150" },
    { date: "2024-04-20", type: "Tire Replacement", cost: "$800" },
    { date: "2024-03-10", type: "Brake Service", cost: "$300" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            {vehicle.name}
          </DialogTitle>
          <DialogDescription>
            {vehicle.id} • {vehicle.type}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(vehicle.status)}>
              {vehicle.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{vehicle.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Driver</p>
                <p className="text-sm text-gray-600">{vehicle.driver}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Mileage</p>
                <p className="text-sm text-gray-600">{vehicle.mileage} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Next Maintenance</p>
                <p className="text-sm text-gray-600">{vehicle.nextMaintenance}</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance History</CardTitle>
              <CardDescription>Recent maintenance and repairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <p className="font-medium text-green-600">{item.cost}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1">
              <Wrench className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="flex-1">
              Edit Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetails;
