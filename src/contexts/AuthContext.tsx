import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/roles';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('asphaltpro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return false;
    }
    setUser(data.user);
    localStorage.setItem('asphaltpro_user', JSON.stringify(data.user));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('asphaltpro_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
