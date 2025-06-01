
export interface Job {
  id: string;
  title: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  project: {
    type: 'paving' | 'maintenance' | 'striping' | 'sealcoating' | 'patching';
    description: string;
    location: string;
    estimatedArea: number;
    estimatedCost: number;
  };
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  schedule: {
    startDate: string;
    endDate: string;
    estimatedDuration: number; // in days
  };
  assignedVehicles: string[];
  assignedCrew: string[];
  progress: number; // 0-100
  timeline: JobTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface JobTimelineEvent {
  id: string;
  type: 'created' | 'scheduled' | 'started' | 'progress' | 'completed' | 'note';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}
