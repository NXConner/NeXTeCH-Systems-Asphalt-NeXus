import { supabase } from '@/integrations/supabase/client';

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return userData?.role === 'admin';
}

export async function getAllUsers(): Promise<User[]> {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return users;
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
}

export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
} 