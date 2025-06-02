import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSafetyChecklists = (employeeId) => {
  const queryClient = useQueryClient();

  const { data: checklists = [], isLoading, error } = useQuery({
    queryKey: ['safety-checklists', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safety_checklists')
        .select('*')
        .eq('employee_id', employeeId);
      if (error) throw error;
      return data;
    }
  });

  const addChecklist = useMutation({
    mutationFn: async (checklist) => {
      const { data, error } = await supabase
        .from('safety_checklists')
        .insert(checklist)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['safety-checklists', employeeId])
  });

  return { checklists, isLoading, error, addChecklist };
}; 