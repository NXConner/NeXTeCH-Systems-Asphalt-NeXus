import { useState, useCallback } from 'react';
import { useCache } from './useCache';
import { useAnalytics } from './useAnalytics';
import { useNotifications } from './useNotifications';
import { config } from '@/config/env';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestOptions = {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
  cache?: boolean;
  cacheTTL?: number;
  showNotification?: boolean;
};

type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

export function useApi<T>(endpoint: string, options: RequestOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const { set: setCache, get: getCache } = useCache();
  const { trackEvent, trackError } = useAnalytics();
  const { addNotification } = useNotifications();

  const fetchData = useCallback(async () => {
    const {
      method = 'GET',
      body,
      headers = {},
      cache = true,
      cacheTTL = 3600000,
      showNotification = true,
    } = options;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body)}`;

    try {
      setLoading(true);
      setError(null);

      if (cache && method === 'GET') {
        const cachedData = getCache<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${config.api.url}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      if (cache && method === 'GET') {
        setCache(cacheKey, result, cacheTTL);
      }

      trackEvent({
        category: 'API',
        action: method.toLowerCase(),
        label: endpoint,
      });

      if (showNotification) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Request completed successfully',
        });
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      trackError(error, { endpoint, method });
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint, options, setCache, getCache, trackEvent, trackError, addNotification]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
} 