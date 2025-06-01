import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Job } from "@/types/job";
import { Truck, Users, Clock, MapPin, Zap } from "lucide-react";

interface JobResourceOptimizationProps {
  jobs: Job[];
  availableVehicles: number;
  availableDrivers: number;
}

export function JobResourceOptimization({ jobs, availableVehicles, availableDrivers }: JobResourceOptimizationProps) {
  const upcomingJobs = jobs.filter(j => j.status === 'scheduled').slice(0, 3);
  const inProgressJobs = jobs.filter(j => j.status === 'in-progress');
  
  const getOptimizationLevel = (job: Job) => {
    const vehicleRatio = job.assignedVehicles.length / Math.max(job.assignedVehicles.length + 1, 2);
    const crewRatio = job.assignedCrew.length / Math.max(job.assignedCrew.length + 1, 2);
    return Math.round((vehicleRatio + crewRatio) * 50);
  };

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Resource Optimization
        </CardTitle>
        <CardDescription>
          Optimize resource allocation across active and upcoming jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Available Fleet</div>
              <div className="text-2xl font-bold text-blue-600">{availableVehicles}</div>
              <div className="text-xs text-blue-600">vehicles ready</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-800">Available Crew</div>
              <div className="text-2xl font-bold text-purple-600">{availableDrivers}</div>
              <div className="text-xs text-purple-600">drivers ready</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Optimization Opportunities</h4>
            {upcomingJobs.map((job) => {
              const optimization = getOptimizationLevel(job);
              return (
                <div key={job.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`} />
                      <span className="font-medium text-sm">{job.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span>{job.assignedVehicles.length} vehicles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{job.assignedCrew.length} crew</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Resource Optimization</span>
                      <span>{optimization}%</span>
                    </div>
                    <Progress value={optimization} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              Auto-Optimize
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Manual Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
