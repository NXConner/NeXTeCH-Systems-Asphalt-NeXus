
export interface VehicleMetrics {
  id: string;
  name: string;
  type: string;
  fuelEfficiency: number;
  engineTemp: number;
  oilPressure: number;
  brakePadLife: number;
  tireHealth: number;
  batteryLevel: number;
  diagnosticCode?: string;
  lastMaintenance: string;
  nextService: string;
  totalMiles: number;
  todayMiles: number;
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'trailer' | 'equipment';
  status: 'active' | 'inactive' | 'maintenance' | 'out-of-service';
  location: {
    lat: number;
    lng: number;
    address: string;
    lastUpdate: string;
  };
  driver?: string;
  fuelLevel: number;
  mileage: number;
  maintenanceScore: number;
  route?: string;
  speed: number;
  engineHours: number;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'overdue' | 'warning' | 'critical';
  message: string;
  dueDate: string;
  mileage?: number;
}

export interface RouteOptimization {
  id: string;
  name: string;
  vehicles: string[];
  totalDistance: number;
  estimatedTime: number;
  fuelCost: number;
  efficiency: number;
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  criticalAlerts: number;
  avgFuelLevel: number;
}
