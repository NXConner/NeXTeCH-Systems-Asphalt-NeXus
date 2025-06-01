import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from "react";
import { FleetStats } from "@/types/fleetTypes";
import type { Tables } from '@/integrations/supabase/types';

export const useFleetData = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (error) throw error;
      return data as Tables<'vehicles'>[];
    }
  });
  const vehicles = data as Tables<'vehicles'>[];

  // If you want to fetch maintenance alerts and routes, add similar queries here

  const fleetStats: FleetStats = useMemo(() => {
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const avgFuelLevel = vehicles.length > 0 && vehicles[0].fuelLevel !== undefined
      ? Math.round(vehicles.reduce((sum, v) => sum + (v.fuelLevel || 0), 0) / vehicles.length)
      : 0;
    return {
      totalVehicles: vehicles.length,
      activeVehicles,
      criticalAlerts: 0, // You can fetch and calculate this if needed
      avgFuelLevel
    };
  }, [vehicles]);

  return {
    vehicles,
    fleetStats,
    isLoading,
    error
  };
};
