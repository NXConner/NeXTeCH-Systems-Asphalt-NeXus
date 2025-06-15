// Single Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

export const supabase = createClient(
  config.api.supabase.url,
  config.api.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          role: 'admin' | 'manager' | 'employee';
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
          assigned_to: string;
          location: {
            lat: number;
            lng: number;
            address: string;
          };
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      fleet: {
        Row: {
          id: string;
          name: string;
          type: string;
          status: 'active' | 'maintenance' | 'retired';
          created_at: string;
          updated_at: string;
          last_maintenance: string;
          next_maintenance: string;
        };
        Insert: Omit<Database['public']['Tables']['fleet']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fleet']['Insert']>;
      };
    };
  };
}; 