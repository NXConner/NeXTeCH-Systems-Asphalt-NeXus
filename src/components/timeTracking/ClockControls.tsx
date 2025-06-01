import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";
import { toast } from "sonner";

interface MockTimeEntry {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  total_hours: number;
  status: 'active' | 'completed';
}

interface ClockControlsProps {
  employeeId: string;
  employeeName: string;
  currentTimeEntry: MockTimeEntry | null;
  onClockIn: (entry: MockTimeEntry) => void;
  onClockOut: (entry: MockTimeEntry) => void;
  onLocationStart: () => void;
  onLocationStop: () => void;
}

// Refactored to use real API data. Please implement useTimeTracking hook for clock in/out and time entry management.

export const ClockControls = ({ 
  employeeId, 
  employeeName, 
  currentTimeEntry, 
  onClockIn, 
  onClockOut,
  onLocationStart,
  onLocationStop 
}: ClockControlsProps) => {
  const handleClockIn = () => {
    const now = new Date().toISOString();
    const newEntry: MockTimeEntry = {
      id: `entry-${Date.now()}`,
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      clock_in: now,
      total_hours: 0,
      status: 'active'
    };
    
    onClockIn(newEntry);
    onLocationStart();
    toast.success("Clocked in successfully");
  };

  const handleClockOut = () => {
    if (!currentTimeEntry) return;
    
    const now = new Date();
    const clockInTime = new Date(currentTimeEntry.clock_in);
    const totalHours = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    
    const updatedEntry = {
      ...currentTimeEntry,
      clock_out: now.toISOString(),
      total_hours: totalHours,
      status: 'completed' as const
    };
    
    onClockOut(updatedEntry);
    onLocationStop();
    toast.success("Clocked out successfully");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!currentTimeEntry || currentTimeEntry.status === 'completed' ? (
          <Button onClick={handleClockIn} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Clock In
          </Button>
        ) : (
          <Button onClick={handleClockOut} variant="destructive" className="flex-1">
            <Square className="h-4 w-4 mr-2" />
            Clock Out
          </Button>
        )}
      </div>

      {currentTimeEntry && currentTimeEntry.status === 'active' && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Clock In:</span>
            <span className="font-mono">{formatTime(currentTimeEntry.clock_in)}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Time:</span>
            <span className="font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Hours Worked:</span>
            <span className="font-mono">
              {((Date.now() - new Date(currentTimeEntry.clock_in).getTime()) / (1000 * 60 * 60)).toFixed(1)}h
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
