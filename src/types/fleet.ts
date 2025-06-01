
export interface Vehicle {
  id: string;
  type: 'truck' | 'paver' | 'roller' | 'excavator' | 'dump-truck' | 'pickup';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'active' | 'maintenance' | 'out-of-service' | 'retired';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: string;
  };
  mileage: number;
  fuelLevel: number;
  assignedDriver?: string;
  assignedJob?: string;
  maintenanceSchedule: MaintenanceRecord[];
  documents: VehicleDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  certifications: string[];
  status: 'active' | 'inactive' | 'on-leave';
  assignedVehicle?: string;
  currentJob?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'repair' | 'inspection' | 'service';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  mileage: number;
  performedBy: string;
  notes: string;
  parts: MaintenancePart[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  cost: number;
  supplier: string;
}

export interface VehicleDocument {
  id: string;
  type: 'registration' | 'insurance' | 'inspection' | 'manual' | 'other';
  name: string;
  url: string;
  expiryDate?: string;
  uploadedAt: string;
}
