import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

export const supabase = createClient(
  config.api.supabase.url,
  config.api.supabase.anonKey
); 