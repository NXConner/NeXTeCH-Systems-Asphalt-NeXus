
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation,
  Activity,
  Car,
  Building,
  Coffee
} from "lucide-react";

interface ActivitySelectorProps {
  activityType: 'on_site' | 'travel' | 'shop' | 'break' | 'lunch';
  onActivityChange: (activity: 'on_site' | 'travel' | 'shop' | 'break' | 'lunch') => void;
  isTracking: boolean;
  currentLocation: GeolocationPosition | null;
  isActive: boolean;
}

export const ActivitySelector = ({ 
  activityType, 
  onActivityChange, 
  isTracking, 
  currentLocation,
  isActive 
}: ActivitySelectorProps) => {
  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'on_site': return <MapPin className="h-4 w-4" />;
      case 'travel': return <Car className="h-4 w-4" />;
      case 'shop': return <Building className="h-4 w-4" />;
      case 'break':
      case 'lunch': return <Coffee className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Current Activity</label>
        <div className="grid grid-cols-2 gap-2">
          {(['on_site', 'travel', 'shop', 'break'] as const).map((activity) => (
            <Button
              key={activity}
              variant={activityType === activity ? "default" : "outline"}
              onClick={() => onActivityChange(activity)}
              className="justify-start"
              disabled={!isActive}
            >
              {getActivityIcon(activity)}
              <span className="ml-2 capitalize">{activity.replace('_', ' ')}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Location Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          <span className="text-sm font-medium">Location Tracking</span>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? "Active" : "Inactive"}
          </Badge>
        </div>
        {currentLocation && (
          <div className="text-xs text-muted-foreground">
            Lat: {currentLocation.coords.latitude.toFixed(6)}, 
            Lng: {currentLocation.coords.longitude.toFixed(6)}
            {currentLocation.coords.speed && (
              <span> • Speed: {(currentLocation.coords.speed * 2.237).toFixed(1)} mph</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
