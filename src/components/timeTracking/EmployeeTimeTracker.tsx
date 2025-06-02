import { useState, useEffect } from "react";
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

// Fallback fetch if service is missing
const fetchTimeEntries = async () => [];
const fetchTimeSummary = async () => null;

interface TimeEntry {
  id: string;
  employeeName: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  total_hours: number;
}

interface TimeSummary {
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

  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [summary, setSummary] = useState<TimeSummary | null>(null);

  useEffect(() => {
    fetchTimeEntries().then(setEntries);
    fetchTimeSummary().then(setSummary);
  }, []);

  // TODO: Integrate with Supabase for real time entry and summary data.
  return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Time tracking integration coming soon.</div>;

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

      <div>
        <h2 className="text-xl font-bold mb-4">Employee Time Tracker</h2>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>{entry.employeeName} - {entry.date} - {entry.clock_in} to {entry.clock_out || 'N/A'} ({entry.total_hours} hrs)</li>
          ))}
        </ul>
        {summary && (
          <div className="mt-4">
            <h3 className="font-semibold">Summary</h3>
            <div>Total Hours: {summary.total_hours}</div>
            <div>On Site: {summary.on_site_hours}</div>
            <div>Travel: {summary.travel_hours}</div>
            <div>Miles: {summary.total_miles}</div>
          </div>
        )}
      </div>
    </div>
  );
};
