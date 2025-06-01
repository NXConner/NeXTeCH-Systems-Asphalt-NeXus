import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

// Example: Jobs table (replace with actual table name if different)
const JOBS_TABLE = 'jobs';

type Job = Database['public']['Tables']['jobs']['Row'];

type JobInsert = Database['public']['Tables']['jobs']['Insert'];

type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export const apiService = {
  // Fetch all jobs
  async getJobs() {
    const { data, error } = await supabase.from(JOBS_TABLE).select('*');
    if (error) throw error;
    return data as Job[];
  },
  // Fetch job by ID
  async getJobById(id: string) {
    const { data, error } = await supabase.from(JOBS_TABLE).select('*').eq('id', id).single();
    if (error) throw error;
    return data as Job;
  },
  // Create a new job
  async createJob(job: JobInsert) {
    const { data, error } = await supabase.from(JOBS_TABLE).insert([job]).select().single();
    if (error) throw error;
    return data as Job;
  },
  // Update a job
  async updateJob(id: string, updates: JobUpdate) {
    const { data, error } = await supabase.from(JOBS_TABLE).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Job;
  },
  // Delete a job
  async deleteJob(id: string) {
    const { error } = await supabase.from(JOBS_TABLE).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
}; 