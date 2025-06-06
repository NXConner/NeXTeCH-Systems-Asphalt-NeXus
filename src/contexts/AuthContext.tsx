import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/roles';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  savedCredentials?: { email: string; password: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [savedCredentials, setSavedCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('asphaltpro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Check for saved credentials
    const creds = localStorage.getItem('asphaltpro_saved_credentials');
    if (creds) {
      setSavedCredentials(JSON.parse(creds));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, remember?: boolean): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return false;
    }
    setUser(data.user);
    localStorage.setItem('asphaltpro_user', JSON.stringify(data.user));
    if (remember) {
      localStorage.setItem('asphaltpro_saved_credentials', JSON.stringify({ email, password }));
      setSavedCredentials({ email, password });
    } else {
      localStorage.removeItem('asphaltpro_saved_credentials');
      setSavedCredentials(null);
    }
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
    loading,
    savedCredentials
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
