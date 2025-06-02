import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useObjectives = (employeeId) => {
  const queryClient = useQueryClient();

  const { data: objectives = [], isLoading, error } = useQuery({
    queryKey: ['objectives', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('objectives')
        .select('*')
        .eq('assigned_to', employeeId);
      if (error) throw error;
      return data;
    }
  });

  const addObjective = useMutation({
    mutationFn: async (objective) => {
      const { data, error } = await supabase
        .from('objectives')
        .insert(objective)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['objectives', employeeId])
  });

  return { objectives, isLoading, error, addObjective };
}; 