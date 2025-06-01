
export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'repair' | 'inspection' | 'warranty';
  category: 'engine' | 'transmission' | 'brakes' | 'tires' | 'hydraulics' | 'electrical' | 'body' | 'safety';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  laborHours: number;
  parts: MaintenancePart[];
  mechanicId?: string;
  shopId?: string;
  mileageAtService: number;
  nextServiceMileage?: number;
  nextServiceDate?: string;
  warranty?: string;
  photos: string[];
  documents: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskType: string;
  intervalType: 'mileage' | 'time' | 'hours';
  intervalValue: number;
  description: string;
  estimatedCost: number;
  isActive: boolean;
}
