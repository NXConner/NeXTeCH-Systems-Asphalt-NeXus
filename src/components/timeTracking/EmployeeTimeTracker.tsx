import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ClockControls } from "./ClockControls";
import { ActivitySelector } from "./ActivitySelector";
import { DailySummary } from "./DailySummary";
import { useLocationTracking } from "@/hooks/useLocationTracking";

interface EmployeeTimeTrackerProps {
  employeeId: string;
  employeeName: string;
}

interface MockTimeEntry {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  total_hours: number;
  status: 'active' | 'completed';
}

interface MockTimeSummary {
  employee_id: string;
  total_hours: number;
  on_site_hours: number;
  travel_hours: number;
  total_miles: number;
}

// Refactored to use real API data. Please implement useTimeTracking hook for fetching and updating time entries and summaries.
export const EmployeeTimeTracker = ({ employeeId, employeeName }: EmployeeTimeTrackerProps) => {
  const { currentLocation, isTracking, startLocationTracking, stopLocationTracking } = useLocationTracking();
  const [activityType, setActivityType] = useState<'on_site' | 'travel' | 'shop' | 'break' | 'lunch'>('on_site');
  
  // Mock data - replace with real Supabase queries once tables are created
  const [currentTimeEntry, setCurrentTimeEntry] = useState<MockTimeEntry | null>(null);
  const [todaySummary] = useState<MockTimeSummary>({
    employee_id: employeeId,
    total_hours: 6.5,
    on_site_hours: 5.2,
    travel_hours: 1.3,
    total_miles: 42.5
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracker - {employeeName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClockControls
              employeeId={employeeId}
              employeeName={employeeName}
              currentTimeEntry={currentTimeEntry}
              onClockIn={setCurrentTimeEntry}
              onClockOut={setCurrentTimeEntry}
              onLocationStart={startLocationTracking}
              onLocationStop={stopLocationTracking}
            />

            <ActivitySelector
              activityType={activityType}
              onActivityChange={setActivityType}
              isTracking={isTracking}
              currentLocation={currentLocation}
              isActive={currentTimeEntry?.status === 'active'}
            />
          </div>
        </CardContent>
      </Card>

      <DailySummary summary={todaySummary} />
    </div>
  );
};
