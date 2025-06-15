import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/services/analyticsService';

interface AnalyticsContextType {
  track: (action: string, metadata?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const track = (action: string, metadata?: any) => {
    trackEvent({ userId: user?.id ?? '', action, metadata });
  };

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return ctx;
};
