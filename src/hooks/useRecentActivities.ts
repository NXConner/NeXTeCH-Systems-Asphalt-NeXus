import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select(`
          id,
          type,
          description,
          timestamp,
          user:users (
            id,
            name,
            avatar
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;

      setActivities(data || []);
      logger.info('Recent activities fetched successfully');
    } catch (err) {
      const error = err as Error;
      setError(error);
      logger.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const subscription = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { activities, loading, error };
}; 