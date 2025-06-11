import { supabase, auth } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';
import type { Job } from '@/types/job';

// Example: Jobs table (replace with actual table name if different)
const JOBS_TABLE = 'jobs';

export const apiService = {
  // Fetch all jobs
  getJobs: async () => {
    try {
      const { data, error } = await db.from(JOBS_TABLE).select('*');
      if (error) throw error;
      return data as Job[];
    } catch (error) {
      logger.error('Failed to fetch jobs', { error });
      throw error;
    }
  },
  // Fetch job by ID
  async getJobById(id: string) {
    const { data, error } = await db.from(JOBS_TABLE).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  // Create a new job
  async createJob(job: any) {
    const { data, error } = await db.from(JOBS_TABLE).insert([job]).select().single();
    if (error) throw error;
    return data;
  },
  // Update a job
  async updateJob(id: string, updates: any) {
    const { data, error } = await db.from(JOBS_TABLE).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  // Delete a job
  async deleteJob(id: string) {
    const { error } = await db.from(JOBS_TABLE).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  // Sign up a new user
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signUp(email, password);
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Sign up failed', { error, email });
      throw error;
    }
  },
  // Sign in user
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Sign in failed', { error, email });
      throw error;
    }
  },
  // Sign out user
  signOut: async () => {
    try {
      await auth.signOut();
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  },
  // Fetch the current user's profile
  async getProfile() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from<any, any>('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return data;
  },
  // Update the current user's profile (username, preferences, etc.)
  async updateProfile(profile: { username?: string; avatar_url?: string }) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    const updateData: any = { id: user.id };
    if (profile.username) updateData.username = profile.username;
    if (profile.avatar_url) updateData.avatar_url = profile.avatar_url;
    const { data, error } = await supabase.from<any, any>('profiles').upsert(updateData).single();
    if (error) throw error;
    return data;
  },
  // Upload an avatar image and update profile.avatar_url
  async uploadAvatar(file: File) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}.${ext}`;
    const filePath = `avatars/${fileName}`;
    // Upload to storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatar_url = publicUrlData.publicUrl;
    // Update profile record
    await supabase.from<any, any>('profiles').upsert({ id: user.id, avatar_url });
    return avatar_url;
  },
}; 