import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, auth } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { logger } from '@/services/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        logger.error('Failed to initialize auth', { error });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if email is confirmed
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.email_confirmed_at) {
          await supabase.auth.signOut();
          toast.error('Please confirm your email before signing in');
          navigate('/auth/confirm-email');
          return;
        }
      }
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Please confirm your email before signing in');
      }

      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error) {
      logger.error('Sign in failed', { error });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirmed: false
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Please check your email to confirm your account');
        navigate('/auth/confirm-email');
      }
    } catch (error) {
      logger.error('Sign up failed', { error });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      logger.error('Password reset failed', { error });
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully');
    } catch (error) {
      logger.error('Password update failed', { error });
      throw error;
    }
  };

  const updateProfile = async (data: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      logger.error('Profile update failed', { error });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
