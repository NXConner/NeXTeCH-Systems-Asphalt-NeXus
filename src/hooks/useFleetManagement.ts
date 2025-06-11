import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

export const useFleetManagement = () => {
  const queryClient = useQueryClient();

  // Fleet Vehicles
  const { data: fleetVehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (error) throw error;
      return data as Vehicle[];
    }
  });

  // Add Vehicle
  const addVehicle = useMutation({
    mutationFn: async (vehicle: VehicleInsert) => {
      const { data, error } = await supabase.from('vehicles').insert(vehicle).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  });

  // Update Vehicle
  const updateVehicle = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: VehicleUpdate }) => {
      const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  });

  // Get Vehicle by ID
  const getVehicleById = (id: string) => {
    return fleetVehicles.find(vehicle => vehicle.id === id) || null;
  };

  // Get Vehicles by Status
  const getVehiclesByStatus = (status: Vehicle['status']) => {
    return fleetVehicles.filter(vehicle => vehicle.status === status);
  };

  // Get Vehicles by Type
  const getVehiclesByType = (type: Vehicle['type']) => {
    return fleetVehicles.filter(vehicle => vehicle.type === type);
  };

  return {
    fleetVehicles,
    isLoading: vehiclesLoading,
    error: vehiclesError,
    addVehicle,
    updateVehicle,
    getVehicleById,
    getVehiclesByStatus,
    getVehiclesByType
  };
}; 