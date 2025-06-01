
export interface SafetyIncident {
  id: string;
  type: 'injury' | 'near-miss' | 'property-damage' | 'environmental' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  jobId?: string;
  vehicleId?: string;
  driverId?: string;
  injuredPersons: string[];
  witnessNames: string[];
  immediateActions: string;
  rootCause?: string;
  correctiveActions: string[];
  followUpRequired: boolean;
  reportedBy: string;
  investigatedBy?: string;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  reportDate: string;
  incidentDate: string;
  photos: string[];
  documents: string[];
}

export interface SafetyTraining {
  id: string;
  title: string;
  description: string;
  type: 'orientation' | 'refresher' | 'specialized' | 'certification';
  duration: number; // in hours
  expiryPeriod?: number; // in months
  required: boolean;
  materials: string[];
  createdAt: string;
}

export interface EmployeeTraining {
  id: string;
  employeeId: string;
  trainingId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'expired';
  scheduledDate?: string;
  completedDate?: string;
  expiryDate?: string;
  score?: number;
  certificateUrl?: string;
  notes?: string;
}
