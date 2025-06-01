import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMaintenanceRecordsData() {
  const { data: maintenanceRecords = [], isLoading, error } = useQuery({
    queryKey: ['maintenance-records'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_records').select('*');
      if (error) throw error;
      return data;
    }
  });
  return { maintenanceRecords, isLoading, error };
} 