
import { useState } from "react";
import { JobsHeader } from "./JobsHeader";
import { JobsStats } from "./JobsStats";
import { JobsDialog } from "./JobsDialog";
import { JobsTabs } from "./JobsTabs";
import { toast } from "sonner";

export const JobsContainer = () => {
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    status: [],
    priority: [],
    projectType: [],
    searchTerm: ''
  });

  const [jobs, setJobs] = useState([
    {
      id: "JOB-001",
      title: "Main Street Resurfacing",
      clientName: "City Municipality",
      projectType: "Road Repair",
      location: "Main Street, Downtown",
      estimatedCost: 45000,
      actualCost: 43500,
      status: "In Progress",
      priority: "High",
      startDate: "2024-01-22",
      endDate: "2024-01-28",
      progress: 75,
      assignedCrew: ["John Smith", "Mike Johnson"],
      assignedVehicles: ["TRUCK-001", "PAVER-002"],
      description: "Complete resurfacing of Main Street including pothole repairs"
    },
    {
      id: "JOB-002",
      title: "ABC Construction Parking Lot",
      clientName: "ABC Construction",
      projectType: "Parking Lot",
      location: "123 Business Park",
      estimatedCost: 25000,
      actualCost: 0,
      status: "Scheduled",
      priority: "Medium",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      progress: 0,
      assignedCrew: ["Sarah Wilson", "David Brown"],
      assignedVehicles: ["TRUCK-002", "ROLLER-001"],
      description: "New parking lot construction with drainage and striping"
    },
    {
      id: "JOB-003",
      title: "Oak Avenue Driveway",
      clientName: "Residential Client",
      projectType: "Driveway",
      location: "456 Oak Avenue",
      estimatedCost: 8500,
      actualCost: 8200,
      status: "Completed",
      priority: "Low",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      progress: 100,
      assignedCrew: ["Tom Anderson"],
      assignedVehicles: ["TRUCK-003"],
      description: "Residential driveway paving with decorative edging"
    }
  ]);

  const handleCreateJob = (jobData: any) => {
    const newJob = {
      id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
      ...jobData,
      progress: 0,
      actualCost: 0,
      status: "Scheduled"
    };
    setJobs([...jobs, newJob]);
    toast.success("Job created successfully");
  };

  const handleStatusChange = (id: string, status: string) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status } : job
    ));
    toast.success(`Job ${id} status updated to ${status}`);
  };

  const handleProgressUpdate = (id: string, progress: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, progress } : job
    ));
    toast.success(`Job ${id} progress updated to ${progress}%`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.searchTerm || 
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(job.status);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(job.priority);
    const matchesProjectType = filters.projectType.length === 0 || filters.projectType.includes(job.projectType);

    return matchesSearch && matchesStatus && matchesPriority && matchesProjectType;
  });

  const totalValue = jobs.reduce((sum, job) => sum + job.estimatedCost, 0);
  const completedJobs = jobs.filter(job => job.status === "Completed").length;
  const inProgressJobs = jobs.filter(job => job.status === "In Progress").length;
  const scheduledJobs = jobs.filter(job => job.status === "Scheduled").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <JobsHeader />
        <JobsDialog onCreateJob={handleCreateJob} />
      </div>

      <JobsStats
        totalJobs={jobs.length}
        completedJobs={completedJobs}
        inProgressJobs={inProgressJobs}
        scheduledJobs={scheduledJobs}
        totalValue={totalValue}
      />

      <JobsTabs
        jobs={filteredJobs}
        onStatusChange={handleStatusChange}
        onProgressUpdate={handleProgressUpdate}
        onFiltersChange={setFilters}
      />
    </div>
  );
};
