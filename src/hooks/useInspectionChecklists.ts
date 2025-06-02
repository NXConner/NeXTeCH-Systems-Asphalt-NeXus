import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInspectionChecklists = (employeeId) => {
  const queryClient = useQueryClient();

  const { data: checklists = [], isLoading, error } = useQuery({
    queryKey: ['inspection-checklists', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspection_checklists')
        .select('*')
        .eq('employee_id', employeeId);
      if (error) throw error;
      return data;
    }
  });

  const addChecklist = useMutation({
    mutationFn: async (checklist) => {
      const { data, error } = await supabase
        .from('inspection_checklists')
        .insert(checklist)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['inspection-checklists', employeeId])
  });

  return { checklists, isLoading, error, addChecklist };
}; 