import { useState, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

export function useErrorBoundary() {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const { trackError } = useAnalytics();

  const handleError = useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      setState({
        hasError: true,
        error,
        errorInfo,
      });

      trackError(error, {
        componentStack: errorInfo.componentStack,
      });
    },
    [trackError]
  );

  const resetError = useCallback(() => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }, []);

  return {
    ...state,
    handleError,
    resetError,
  };
} 