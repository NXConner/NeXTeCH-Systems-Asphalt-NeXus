import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MaintenanceItem = Database['public']['Tables']['maintenance_items']['Row'];
type MaintenanceItemInsert = Database['public']['Tables']['maintenance_items']['Insert'];
type MaintenanceItemUpdate = Database['public']['Tables']['maintenance_items']['Update'];

export const useMaintenanceItems = (vehicleId?: string) => {
  const queryClient = useQueryClient();

  // Maintenance Items
  const { data: maintenanceItems = [], isLoading, error } = useQuery({
    queryKey: ['maintenance-items', vehicleId],
    queryFn: async () => {
      let query = supabase.from('maintenance_items').select('*');
      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as MaintenanceItem[];
    }
  });

  // Add Maintenance Item
  const addMaintenanceItem = useMutation({
    mutationFn: async (item: MaintenanceItemInsert) => {
      const { data, error } = await supabase.from('maintenance_items').insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance-items'] })
  });

  // Update Maintenance Item
  const updateMaintenanceItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: MaintenanceItemUpdate }) => {
      const { data, error } = await supabase.from('maintenance_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance-items'] })
  });

  // Get Due Maintenance Items
  const getDueMaintenanceItems = () => {
    const now = new Date();
    return maintenanceItems.filter(item => {
      if (!item.next_due_date) return false;
      const dueDate = new Date(item.next_due_date);
      return dueDate <= now;
    });
  };

  // Get Overdue Maintenance Items
  const getOverdueMaintenanceItems = () => {
    const now = new Date();
    return maintenanceItems.filter(item => {
      if (!item.next_due_date) return false;
      const dueDate = new Date(item.next_due_date);
      return dueDate < now;
    });
  };

  return {
    maintenanceItems,
    isLoading,
    error,
    addMaintenanceItem,
    updateMaintenanceItem,
    getDueMaintenanceItems,
    getOverdueMaintenanceItems
  };
}; 