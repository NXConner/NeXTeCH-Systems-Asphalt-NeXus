import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { config } from '@/config/env';

type RealtimeSubscription = {
  channel: RealtimeChannel;
  unsubscribe: () => void;
};

export function useRealtime<T>(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: T) => void
) {
  const [subscription, setSubscription] = useState<RealtimeSubscription | null>(null);

  useEffect(() => {
    if (!config.features.realTime) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        (payload) => {
          callback(payload.new as T);
        }
      )
      .subscribe();

    setSubscription({
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
      },
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [table, event, callback]);

  return subscription;
} 