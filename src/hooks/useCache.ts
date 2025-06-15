import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

type CacheItem<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

type Cache = {
  [key: string]: CacheItem<any>;
};

export function useCache() {
  const [cache, setCache] = useState<Cache>(() => {
    const savedCache = localStorage.getItem('app-cache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    localStorage.setItem('app-cache', JSON.stringify(cache));
  }, [cache]);

  const set = useCallback(
    <T>(key: string, data: T, ttl: number = 3600000) => {
      setCache((prev) => ({
        ...prev,
        [key]: {
          data,
          timestamp: Date.now(),
          ttl,
        },
      }));

      trackEvent({
        category: 'Cache',
        action: 'set',
        label: key,
      });
    },
    [trackEvent]
  );

  const get = useCallback(
    <T>(key: string): T | null => {
      const item = cache[key];
      if (!item) return null;

      const isExpired = Date.now() - item.timestamp > item.ttl;
      if (isExpired) {
        remove(key);
        return null;
      }

      trackEvent({
        category: 'Cache',
        action: 'get',
        label: key,
      });

      return item.data as T;
    },
    [cache, trackEvent]
  );

  const remove = useCallback(
    (key: string) => {
      setCache((prev) => {
        const { [key]: removed, ...rest } = prev;
        return rest;
      });

      trackEvent({
        category: 'Cache',
        action: 'remove',
        label: key,
      });
    },
    [trackEvent]
  );

  const clear = useCallback(() => {
    setCache({});
    trackEvent({
      category: 'Cache',
      action: 'clear',
    });
  }, [trackEvent]);

  const cleanup = useCallback(() => {
    const now = Date.now();
    const newCache = Object.entries(cache).reduce((acc, [key, item]) => {
      if (now - item.timestamp <= item.ttl) {
        acc[key] = item;
      }
      return acc;
    }, {} as Cache);

    setCache(newCache);
  }, [cache]);

  useEffect(() => {
    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    return () => clearInterval(interval);
  }, [cleanup]);

  return {
    set,
    get,
    remove,
    clear,
    cleanup,
  };
} 