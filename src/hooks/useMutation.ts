import { useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type MutationResult<T> = {
  data: T | null;
  error: PostgrestError | null;
  loading: boolean;
  mutate: (data: Partial<T>) => Promise<void>;
};

export function useMutation<T extends { id: string }>(
  table: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: PostgrestError) => void;
  }
): MutationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = async (mutationData: Partial<T>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: mutationError } = await supabase
        .from(table)
        .upsert(mutationData)
        .select()
        .single();

      if (mutationError) throw mutationError;

      setData(result as T);
      options?.onSuccess?.(result as T);
    } catch (err) {
      const error = err as PostgrestError;
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    mutate,
  };
} 