import { supabase } from '@/integrations/supabase/client';

export async function fetchInventory() {
  const { data, error } = await supabase.from('inventory_items').select('*');
  if (error) throw error;
  return data;
}

export async function updateInventoryItem(id, updates) {
  const { data, error } = await supabase.from('inventory_items').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
} 