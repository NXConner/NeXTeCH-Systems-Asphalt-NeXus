import { useState, useCallback } from 'react';
import { getSupabaseClient } from '@/integrations/supabase/client';

type ErrorSeverity = 'warning' | 'error' | 'critical';

interface MapError {
  id: string;
  message: string;
  details?: any;
  severity: ErrorSeverity;
  timestamp: string;
  component?: string;
}

interface UseMapErrorOptions {
  logToConsole?: boolean;
  logToServer?: boolean;
  showUserFeedback?: boolean;
}

export const useMapError = (options: UseMapErrorOptions = {}) => {
  const { 
    logToConsole = true, 
    logToServer = true,
    showUserFeedback = true
  } = options;
  
  const [errors, setErrors] = useState<MapError[]>([]);
  const [latestError, setLatestError] = useState<MapError | null>(null);
  const [hasError, setHasError] = useState(false);
  
  const generateErrorId = () => {
    return `map-error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };
  
  const logError = useCallback(async (
    message: string, 
    details?: any, 
    severity: ErrorSeverity = 'error',
    component?: string
  ) => {
    const errorObj: MapError = {
      id: generateErrorId(),
      message,
      details,
      severity,
      timestamp: new Date().toISOString(),
      component
    };
    
    // Update state with new error
    setErrors(prev => [errorObj, ...prev]);
    setLatestError(errorObj);
    setHasError(true);
    
    // Log to console if enabled
    if (logToConsole) {
      console.error(`[Map ${severity}]`, message, details);
    }
    
    // Log to server if enabled
    if (logToServer) {
      try {
        const supabase = getSupabaseClient();
        await supabase
          .from('error_logs')
          .insert([{
            message,
            details: JSON.stringify(details),
            severity,
            component,
            created_at: errorObj.timestamp
          }])
          .select();
      } catch (err) {
        // Don't throw errors from the error handler
        console.error('Failed to log map error to server:', err);
      }
    }
    
    return errorObj;
  }, [logToConsole, logToServer]);
  
  const clearErrors = useCallback(() => {
    setErrors([]);
    setLatestError(null);
    setHasError(false);
  }, []);
  
  const dismissError = useCallback((id: string) => {
    setErrors(prev => prev.filter(err => err.id !== id));
    // If we just removed the latest error, update latestError
    if (latestError?.id === id) {
      const newErrors = errors.filter(err => err.id !== id);
      setLatestError(newErrors.length > 0 ? newErrors[0] : null);
      setHasError(newErrors.length > 0);
    }
  }, [errors, latestError]);

  return {
    errors,
    latestError,
    hasError,
    logError,
    clearErrors,
    dismissError,
    // Helper methods for different error types
    logWarning: (message: string, details?: any, component?: string) => 
      logError(message, details, 'warning', component),
    logError: (message: string, details?: any, component?: string) => 
      logError(message, details, 'error', component),
    logCritical: (message: string, details?: any, component?: string) => 
      logError(message, details, 'critical', component),
  };
};
