import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useTimeTracking(employeeId: string) {
  const queryClient = useQueryClient();

  const { data: timeEntries = [], isLoading } = useQuery(['timeEntries', employeeId], async () => {
    const { data, error } = await supabase.from('time_entries').select('*').eq('employee_id', employeeId).order('clock_in', { ascending: false });
    if (error) throw error;
    return data;
  });

  type Entry = {
    [key: string]: any;
  };

  type UpdateArgs = { id: string; updates: Entry };

  const clockIn = useMutation({
    mutationFn: async (entry: Entry) => {
      const { data, error } = await supabase.from('time_entries').insert([entry]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['timeEntries', employeeId])
  });

  const clockOut = useMutation({
    mutationFn: async ({ id, updates }: UpdateArgs) => {
      const { data, error } = await supabase.from('time_entries').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['timeEntries', employeeId])
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, updates }: UpdateArgs) => {
      const { data, error } = await supabase.from('time_entries').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['timeEntries', employeeId])
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('time_entries').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(['timeEntries', employeeId])
  });

  return { timeEntries, isLoading, clockIn, clockOut, updateEntry, deleteEntry };
} 