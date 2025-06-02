import { supabase } from '@/integrations/supabase/client';

export async function fetchMapData() {
  const { data, error } = await supabase.from('map_data').select('*');
  if (error) throw error;
  return data;
} 