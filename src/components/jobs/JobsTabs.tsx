
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin } from "lucide-react";
import { JobsList } from "./JobsList";
import { JobsFilters } from "./JobsFilters";
import { ExportUtility } from "@/components/export/ExportUtility";

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

interface JobsTabsProps {
  jobs: Job[];
  onStatusChange: (id: string, status: string) => void;
  onProgressUpdate: (id: string, progress: number) => void;
  onFiltersChange: (filters: any) => void;
}

export const JobsTabs = ({ jobs, onStatusChange, onProgressUpdate, onFiltersChange }: JobsTabsProps) => {
  const exportFields = [
    { key: 'id', label: 'Job ID' },
    { key: 'title', label: 'Title' },
    { key: 'clientName', label: 'Client' },
    { key: 'projectType', label: 'Project Type' },
    { key: 'location', label: 'Location' },
    { key: 'estimatedCost', label: 'Estimated Cost' },
    { key: 'actualCost', label: 'Actual Cost' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'progress', label: 'Progress' }
  ];

  return (
    <Tabs defaultValue="jobs" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="jobs">Jobs</TabsTrigger>
        <TabsTrigger value="scheduling">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </TabsTrigger>
        <TabsTrigger value="map">
          <MapPin className="h-4 w-4 mr-2" />
          Map View
        </TabsTrigger>
      </TabsList>

      <TabsContent value="jobs" className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <JobsFilters
            onFiltersChange={onFiltersChange}
            availableStatuses={["Scheduled", "In Progress", "Completed", "On Hold", "Cancelled"]}
            availablePriorities={["Low", "Medium", "High", "Urgent"]}
            availableProjectTypes={["Road Repair", "Parking Lot", "Driveway", "Maintenance", "Striping"]}
          />
          
          <ExportUtility
            data={jobs}
            filename="jobs"
            availableFields={exportFields}
            type="jobs"
          />
        </div>

        <JobsList
          jobs={jobs}
          onStatusChange={onStatusChange}
          onProgressUpdate={onProgressUpdate}
        />
      </TabsContent>

      <TabsContent value="scheduling">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Job Scheduling Calendar</h3>
          <p className="text-gray-600">Calendar view for job scheduling coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="map">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Job Locations Map</h3>
          <p className="text-gray-600">Interactive map view coming soon...</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
