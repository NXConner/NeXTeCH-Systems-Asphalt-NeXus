import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Users, AlertTriangle } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: 'vehicle' | 'crew';
  status: 'available' | 'assigned' | 'maintenance';
  currentJob?: string;
  utilization: number;
}

interface ResourceAllocationProps {
  resources: Resource[];
}

export function ResourceAllocation({ resources }: ResourceAllocationProps) {
  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const availableResources = resources.filter(r => r.status === 'available');
  const overUtilized = resources.filter(r => r.utilization >= 90);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Resource Allocation
          {overUtilized.length > 0 && (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          )}
        </CardTitle>
        <CardDescription>
          Monitor vehicle and crew assignments across active jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">Available Resources</div>
              <div className="text-2xl font-bold text-green-600">{availableResources.length}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-800">Over-Utilized</div>
              <div className="text-2xl font-bold text-orange-600">{overUtilized.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {resources.slice(0, 5).map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  {resource.type === 'vehicle' ? (
                    <Truck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Users className="h-4 w-4 text-purple-600" />
                  )}
                  <div>
                    <div className="font-medium">{resource.name}</div>
                    {resource.currentJob && (
                      <div className="text-xs text-muted-foreground">
                        Job: {resource.currentJob}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getUtilizationColor(resource.utilization)}`}>
                    {resource.utilization}%
                  </span>
                  <Badge className={getStatusColor(resource.status)} variant="secondary">
                    {resource.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            Optimize Allocation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResourceAllocation;
