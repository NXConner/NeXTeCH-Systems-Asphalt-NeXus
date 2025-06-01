
export interface Estimate {
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
    area: number; // square feet
    linearFeet?: number;
  };
  materials: EstimateMaterial[];
  labor: EstimateLabor[];
  equipment: EstimateEquipment[];
  calculations: {
    materialsCost: number;
    laborCost: number;
    equipmentCost: number;
    overhead: number;
    profit: number;
    totalCost: number;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface EstimateMaterial {
  id: string;
  name: string;
  unit: 'sq_ft' | 'linear_ft' | 'tons' | 'gallons' | 'bags';
  quantity: number;
  unitCost: number;
  totalCost: number;
  coverage?: number; // coverage per unit
}

export interface EstimateLabor {
  id: string;
  description: string;
  hours: number;
  rate: number;
  totalCost: number;
}

export interface EstimateEquipment {
  id: string;
  name: string;
  dailyRate: number;
  days: number;
  totalCost: number;
}
