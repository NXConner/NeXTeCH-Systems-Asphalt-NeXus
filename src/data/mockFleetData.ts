// All mock fleet vehicle data removed. Please use hooks and API integrations for real data.

import { VehicleMetrics, FleetVehicle, MaintenanceAlert, RouteOptimization } from "@/types/fleetTypes";

export const mockAdvancedVehicles: VehicleMetrics[] = [
  {
    id: "ADV-001",
    name: "Asphalt Truck Alpha",
    type: "Heavy Duty Truck",
    fuelEfficiency: 7.2,
    engineTemp: 195,
    oilPressure: 45,
    brakePadLife: 78,
    tireHealth: 85,
    batteryLevel: 92,
    lastMaintenance: "2024-01-15",
    nextService: "2024-02-15",
    totalMiles: 87432,
    todayMiles: 127
  },
  {
    id: "ADV-002", 
    name: "Sealcoat Sprayer Beta",
    type: "Specialized Equipment",
    fuelEfficiency: 9.1,
    engineTemp: 188,
    oilPressure: 42,
    brakePadLife: 92,
    tireHealth: 91,
    batteryLevel: 88,
    diagnosticCode: "P0420",
    lastMaintenance: "2024-01-20",
    nextService: "2024-02-20",
    totalMiles: 45673,
    todayMiles: 89
  },
  {
    id: "ADV-003",
    name: "Line Striper Gamma", 
    type: "Utility Vehicle",
    fuelEfficiency: 12.5,
    engineTemp: 182,
    oilPressure: 38,
    brakePadLife: 45,
    tireHealth: 67,
    batteryLevel: 95,
    lastMaintenance: "2024-01-10",
    nextService: "2024-02-10",
    totalMiles: 62890,
    todayMiles: 156
  }
];

export const mockFleetVehicles: FleetVehicle[] = [
  {
    id: "FL-001",
    name: "Service Truck Alpha",
    type: "truck",
    status: "active",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "Downtown Manhattan, NY",
      lastUpdate: new Date().toISOString()
    },
    driver: "John Martinez",
    fuelLevel: 85,
    mileage: 45230,
    maintenanceScore: 92,
    route: "Route A - Midtown Loop",
    speed: 35,
    engineHours: 2847
  },
  {
    id: "FL-002", 
    name: "Utility Van Beta",
    type: "van",
    status: "active",
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: "Central Park West, NY",
      lastUpdate: new Date(Date.now() - 300000).toISOString()
    },
    driver: "Sarah Chen",
    fuelLevel: 62,
    mileage: 38950,
    maintenanceScore: 88,
    route: "Route B - Uptown Circuit",
    speed: 0,
    engineHours: 2156
  },
  {
    id: "FL-003",
    name: "Heavy Equipment Trailer",
    type: "trailer",
    status: "maintenance",
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: "Fleet Depot, Queens NY",
      lastUpdate: new Date(Date.now() - 7200000).toISOString()
    },
    fuelLevel: 0,
    mileage: 67890,
    maintenanceScore: 45,
    speed: 0,
    engineHours: 4521
  }
];

export const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "ALT-001",
    vehicleId: "FL-003",
    type: "critical",
    message: "Hydraulic system pressure low - immediate attention required",
    dueDate: "2024-01-27",
    mileage: 67890
  },
  {
    id: "ALT-002", 
    vehicleId: "FL-002",
    type: "scheduled",
    message: "Oil change and filter replacement due",
    dueDate: "2024-02-05",
    mileage: 39000
  },
  {
    id: "ALT-003",
    vehicleId: "FL-001", 
    type: "warning",
    message: "Tire pressure monitoring - front left tire",
    dueDate: "2024-01-30"
  }
];

export const mockRoutes: RouteOptimization[] = [
  {
    id: "RT-001",
    name: "Manhattan Service Route",
    vehicles: ["FL-001", "FL-002"],
    totalDistance: 45.6,
    estimatedTime: 3.5,
    fuelCost: 28.50,
    efficiency: 94
  },
  {
    id: "RT-002",
    name: "Outer Borough Circuit", 
    vehicles: ["FL-002"],
    totalDistance: 67.2,
    estimatedTime: 4.8,
    fuelCost: 42.30,
    efficiency: 87
  }
];
