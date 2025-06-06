// DO NOT create another Supabase client anywhere else. Always import from this file.
// Refactored for environment-based configuration.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_KEY');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);