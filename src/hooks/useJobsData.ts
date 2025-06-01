import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

export function useJobsData() {
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      return await apiService.getJobs();
    }
  });
  return { jobs, isLoading, error };
} 