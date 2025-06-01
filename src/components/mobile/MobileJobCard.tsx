
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  Phone
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  clientName: string;
  location: string;
  status: string;
  priority: string;
  estimatedCost: number;
  progress: number;
  startDate: string;
  endDate: string;
  assignedCrew: string[];
}

interface MobileJobCardProps {
  job: Job;
  onStatusChange: (id: string, status: string) => void;
  onCall: (clientName: string) => void;
}

export const MobileJobCard = ({ job, onStatusChange, onCall }: MobileJobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-sm leading-tight">{job.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{job.clientName}</p>
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <Badge className={`${getStatusColor(job.status)} text-xs px-2 py-1`}>
                {job.status}
              </Badge>
              <Badge className={`${getPriorityColor(job.priority)} text-xs px-2 py-1`}>
                {job.priority}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">{job.startDate} - {job.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">{job.assignedCrew.length} crew members</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600 font-medium">${job.estimatedCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress */}
          {job.status === "In Progress" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Progress</span>
                <span>{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs h-8"
              onClick={() => onCall(job.clientName)}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            
            {job.status === "Scheduled" && (
              <Button 
                size="sm"
                className="flex-1 text-xs h-8 bg-blue-600 hover:bg-blue-700"
                onClick={() => onStatusChange(job.id, "In Progress")}
              >
                <Play className="h-3 w-3 mr-1" />
                Start
              </Button>
            )}
            
            {job.status === "In Progress" && (
              <Button 
                size="sm"
                className="flex-1 text-xs h-8 bg-green-600 hover:bg-green-700"
                onClick={() => onStatusChange(job.id, "Completed")}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
