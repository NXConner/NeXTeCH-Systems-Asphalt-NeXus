import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDailyLogs = (employeeId) => {
  const queryClient = useQueryClient();

  const { data: dailyLogs = [], isLoading, error } = useQuery({
    queryKey: ['daily-logs', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('employee_id', employeeId);
      if (error) throw error;
      return data;
    }
  });

  const addDailyLog = useMutation({
    mutationFn: async (log) => {
      const { data, error } = await supabase
        .from('daily_logs')
        .insert(log)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['daily-logs', employeeId])
  });

  return { dailyLogs, isLoading, error, addDailyLog };
}; 