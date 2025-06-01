
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Truck, 
  Play, 
  Pause, 
  CheckCircle,
  Eye,
  Edit
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  clientName: string;
  projectType: string;
  location: string;
  estimatedCost: number;
  actualCost: number;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignedCrew: string[];
  assignedVehicles: string[];
  description: string;
}

interface JobsListProps {
  jobs: Job[];
  onStatusChange: (id: string, status: string) => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const JobsList = ({ jobs, onStatusChange, onProgressUpdate }: JobsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "On Hold":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  <Badge className={getPriorityColor(job.priority)}>
                    {job.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{job.id} • {job.clientName} • {job.projectType}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{job.startDate} - {job.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{job.assignedCrew.length} crew members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{job.assignedVehicles.length} vehicles</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">{job.description}</p>

                {job.status === "In Progress" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${job.estimatedCost.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Estimated cost</p>
                  {job.actualCost > 0 && (
                    <p className="text-sm text-gray-600">
                      Actual: ${job.actualCost.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  {job.status === "Scheduled" && (
                    <Button 
                      size="sm"
                      onClick={() => onStatusChange(job.id, "In Progress")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {job.status === "In Progress" && (
                    <>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusChange(job.id, "On Hold")}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onStatusChange(job.id, "Completed")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { JobsList };
