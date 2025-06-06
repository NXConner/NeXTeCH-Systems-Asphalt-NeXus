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
  // Sign up a new user
  async signUp({ email, password, name, avatar }: { email: string; password: string; name: string; avatar?: File | null }) {
    // 1. Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (signUpError) throw signUpError;

    // 2. Sign in to establish session for RLS-protected operations
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
    const user = signInData.user;

    // 3. Upload avatar if provided
    let avatar_url: string | null = null;
    if (avatar && user) {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const { error: storageError } = await supabase.storage.from('avatars').upload(filePath, avatar, { upsert: true });
      if (storageError) throw storageError;
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = publicUrlData.publicUrl;
    }

    // 4. Store profile in 'profiles' table
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email,
        username: name,
        avatar_url
      });
      if (profileError) throw profileError;
    }

    // 5. Return the signed-in user
    return user;
  },
  // Fetch the current user's profile
  async getProfile() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return data;
  },
  // Update the current user's profile (username, preferences, etc.)
  async updateProfile(profile: { username?: string; preferences?: any }) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');
    const updateData = { id: user.id, ...profile };
    const { data, error } = await supabase.from('profiles').upsert(updateData).single();
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
    await supabase.from('profiles').upsert({ id: user.id, avatar_url });
    return avatar_url;
  },
}; 