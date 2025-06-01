
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calculator, 
  MapPin, 
  Phone, 
  Clock,
  Camera,
  FileText,
  Users
} from "lucide-react";

interface QuickActionsProps {
  onNewJob: () => void;
  onNewEstimate: () => void;
  onViewMap: () => void;
  onTimeTracking: () => void;
  onTakePhoto: () => void;
  onViewReports: () => void;
}

export const QuickActions = ({ 
  onNewJob, 
  onNewEstimate, 
  onViewMap, 
  onTimeTracking, 
  onTakePhoto, 
  onViewReports 
}: QuickActionsProps) => {
  const actions = [
    { icon: Plus, label: "New Job", action: onNewJob, color: "bg-blue-500" },
    { icon: Calculator, label: "Estimate", action: onNewEstimate, color: "bg-green-500" },
    { icon: MapPin, label: "Map", action: onViewMap, color: "bg-purple-500" },
    { icon: Clock, label: "Time", action: onTimeTracking, color: "bg-orange-500" },
    { icon: Camera, label: "Photo", action: onTakePhoto, color: "bg-pink-500" },
    { icon: FileText, label: "Reports", action: onViewReports, color: "bg-indigo-500" }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col h-16 p-2 space-y-1"
              onClick={action.action}
            >
              <div className={`p-2 rounded-full ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
