
export interface TimeEntry {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours: number;
  regular_hours: number;
  overtime_hours: number;
  location_data: LocationData[];
  status: 'active' | 'completed' | 'pending_approval';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LocationData {
  id: string;
  time_entry_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed?: number;
  activity_type: 'on_site' | 'travel' | 'shop' | 'break' | 'lunch';
  address?: string;
  job_site_id?: string;
  created_at: string;
}

export interface EmployeeTimeSummary {
  employee_id: string;
  employee_name: string;
  date: string;
  total_hours: number;
  on_site_hours: number;
  travel_hours: number;
  shop_hours: number;
  break_hours: number;
  total_miles: number;
  avg_speed: number;
  locations_visited: number;
}

export interface TravelSegment {
  id: string;
  time_entry_id: string;
  start_location: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  end_location: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  distance_miles: number;
  duration_minutes: number;
  avg_speed_mph: number;
  max_speed_mph: number;
  travel_type: 'to_site' | 'between_sites' | 'to_shop' | 'from_shop';
}
