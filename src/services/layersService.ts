import { supabase } from '@/integrations/supabase/client';

export interface Layer {
  id: string;
  name: string;
  url: string;
  visible: boolean;
}

export const getLayers = async (): Promise<Layer[]> => {
  const { data, error } = await supabase.from<Layer>('layers').select('*');
  if (error) {
    if (error.message && error.message.includes('404')) return [];
    throw error;
  }
  return data ?? [];
};

export const addLayer = async (layer: Omit<Layer, 'id'>): Promise<Layer> => {
  const { data, error } = await supabase.from<Layer>('layers').insert([layer]).single();
  if (error) throw error;
  return data;
};

export const removeLayer = async (id: string): Promise<void> => {
  const { error } = await supabase.from<Layer>('layers').delete().eq('id', id);
  if (error) throw error;
};

export const updateLayer = async (id: string, updates: Partial<Omit<Layer, 'id'>>): Promise<void> => {
  const { error } = await supabase.from<Layer>('layers').update(updates).eq('id', id);
  if (error) throw error;
};
