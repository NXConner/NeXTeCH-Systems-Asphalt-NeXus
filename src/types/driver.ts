
export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseClass: 'A' | 'B' | 'C' | 'CDL-A' | 'CDL-B';
  licenseExpiry: string;
  certifications: string[];
  status: 'active' | 'inactive' | 'on-leave' | 'suspended';
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
  hourlyRate: number;
  skills: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  performanceRating: number; // 1-5
  totalHours: number;
  createdAt: string;
  updatedAt: string;
}
