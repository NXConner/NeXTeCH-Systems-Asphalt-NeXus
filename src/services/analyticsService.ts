import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  userId: string;
  action: string;
  metadata?: any;
  timestamp?: string;
}

export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  const { error } = await supabase
    .from<AnalyticsEvent>('analytics')
    .insert([{ ...event, timestamp: new Date().toISOString() }]);
  if (error) throw error;
};

export const fetchEvents = async (): Promise<AnalyticsEvent[]> => {
  const { data, error } = await supabase.from<AnalyticsEvent>('analytics').select('*');
  if (error) throw error;
  return data ?? [];
};
