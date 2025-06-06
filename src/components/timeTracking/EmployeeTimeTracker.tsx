import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ClockControls } from "./ClockControls";
import { ActivitySelector } from "./ActivitySelector";
import { DailySummary } from "./DailySummary";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useTimeTracking } from './useTimeTracking';

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
  const { timeEntries, isLoading, addTimeEntry, updateTimeEntry, deleteTimeEntry, summary } = useTimeTracking(employeeId);
  const { currentLocation, isTracking, startLocationTracking, stopLocationTracking } = useLocationTracking();
  const [activityType, setActivityType] = useState<'on_site' | 'travel' | 'shop' | 'break' | 'lunch'>('on_site');

  // Remove mock data

  // UI for time tracking
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Employee Time Tracker</h2>
      <div className="mb-2">Current Location: {currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : 'N/A'}</div>
      <div className="mb-2">Tracking: {isTracking ? 'On' : 'Off'}</div>
      <button onClick={isTracking ? stopLocationTracking : startLocationTracking} className="btn btn-primary mb-2">
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>
      <div className="mb-2">Activity Type: {activityType}</div>
      <select value={activityType} onChange={e => setActivityType(e.target.value as any)} className="mb-2" title="Select activity type">
        <option value="on_site">On Site</option>
        <option value="travel">Travel</option>
        <option value="shop">Shop</option>
        <option value="break">Break</option>
        <option value="lunch">Lunch</option>
      </select>
      <div className="mb-2">Today's Summary: {summary ? `${summary.total_hours} hours, ${summary.total_miles} miles` : 'N/A'}</div>
      <h3 className="font-bold mt-4">Time Entries</h3>
      <ul>
        {timeEntries.map(entry => (
          <li key={entry.id} className="mb-2">
            {entry.activity_type} | {entry.start_time} - {entry.end_time}
            <button onClick={() => deleteTimeEntry.mutate(entry.id)} className="ml-2 text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addTimeEntry.mutate({ employee_id: employeeId, activity_type: activityType, start_time: new Date().toISOString(), end_time: null })} className="btn btn-success mt-2">Add Entry</button>
    </div>
  );
};
