import { useEffect, useRef, useCallback, useState } from 'react';
import { performanceService } from '@/services/performanceService';
import { logger } from '@/services/logger';
import { useAnalytics } from './useAnalytics';

export interface PerformanceOptions {
  name?: string;
  threshold?: number;
  onThresholdExceeded?: (metrics: any) => void;
}

export function usePerformance(options: PerformanceOptions = {}) {
  const { name, threshold, onThresholdExceeded } = options;
  const measurementRef = useRef<{ start: number; startMemory: any } | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    if (threshold && name) {
      performanceService.setThreshold(name, threshold);
    }
  }, [threshold, name]);

  const startMeasurement = useCallback(() => {
    measurementRef.current = {
      start: performance.now(),
      startMemory: process.memoryUsage()
    };
  }, []);

  const endMeasurement = useCallback(() => {
    if (!measurementRef.current) return null;

    const end = performance.now();
    const endMemory = process.memoryUsage();
    const duration = end - measurementRef.current.start;
    const memoryUsed = endMemory.heapUsed - measurementRef.current.startMemory.heapUsed;

    const metrics = {
      duration,
      memoryUsed,
      timestamp: new Date().toISOString()
    };

    if (name) {
      performanceService.recordMetric(name, metrics);
    }

    if (threshold && duration > threshold) {
      logger.warn('Performance threshold exceeded', {
        name,
        duration,
        threshold,
        timestamp: new Date().toISOString()
      });
      onThresholdExceeded?.(metrics);
    }

    measurementRef.current = null;
    return metrics;
  }, [name, threshold, onThresholdExceeded]);

  const measure = useCallback(async <T>(fn: () => Promise<T> | T): Promise<T> => {
    if (name) {
      return performanceService.measurePerformance(name, fn);
    }

    startMeasurement();
    try {
      const result = await fn();
      endMeasurement();
      return result;
    } catch (error) {
      endMeasurement();
      throw error;
    }
  }, [name, startMeasurement, endMeasurement]);

  useEffect(() => {
    return () => {
      if (measurementRef.current) {
        endMeasurement();
      }
    };
  }, [endMeasurement]);

  useEffect(() => {
    if (!window.performance) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: PerformanceMetric = {
          name: entry.name,
          value: entry.duration,
          rating: getRating(entry.duration, entry.name),
        };

        setMetrics((prev) => [...prev, metric]);
        trackPerformance(metric);
      }
    });

    observer.observe({ entryTypes: ['measure', 'resource', 'paint'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getRating = (value: number, name: string): PerformanceMetric['rating'] => {
    const thresholds = {
      'First Contentful Paint': { good: 1800, poor: 3000 },
      'Largest Contentful Paint': { good: 2500, poor: 4000 },
      'First Input Delay': { good: 100, poor: 300 },
      'Cumulative Layout Shift': { good: 0.1, poor: 0.25 },
      'Time to Interactive': { good: 3800, poor: 7300 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getMetricsByRating = (rating: PerformanceMetric['rating']) => {
    return metrics.filter((metric) => metric.rating === rating);
  };

  return {
    startMeasurement,
    endMeasurement,
    measure,
    metrics,
    getMetricsByRating,
  };
}

export function usePerformanceMetrics(name: string) {
  const metrics = performanceService.getMetrics(name);
  const stats = performanceService.getStats(name);

  return {
    metrics,
    stats
  };
}

export function usePerformanceThreshold(name: string, threshold: number) {
  useEffect(() => {
    performanceService.setThreshold(name, threshold);
  }, [name, threshold]);

  return useCallback((value: number) => {
    return value > threshold;
  }, [threshold]);
}

export function useMemoryUsage() {
  const [memoryUsage, setMemoryUsage] = useState<any>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      setMemoryUsage(process.memoryUsage());
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
}

export function useNavigationTiming() {
  const [timing, setTiming] = useState<any>(null);

  useEffect(() => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        setTiming(navigationTiming);
      }
    }
  }, []);

  return timing;
}

export function useResourceTiming() {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const resourceTiming = performance.getEntriesByType('resource');
      setResources(resourceTiming);
    }
  }, []);

  return resources;
}

export function useLongTasks() {
  const [longTasks, setLongTasks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        setLongTasks(list.getEntries());
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        return () => observer.disconnect();
      } catch (e) {
        logger.error('Failed to initialize long task observer', { error: e });
      }
    }
  }, []);

  return longTasks;
}

export function useLayoutShifts() {
  const [layoutShifts, setLayoutShifts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        setLayoutShifts(list.getEntries());
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        return () => observer.disconnect();
      } catch (e) {
        logger.error('Failed to initialize layout shift observer', { error: e });
      }
    }
  }, []);

  return layoutShifts;
}

export function useFirstInputDelay() {
  const [firstInput, setFirstInput] = useState<any>(null);

  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        setFirstInput(list.getEntries()[0]);
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
        return () => observer.disconnect();
      } catch (e) {
        logger.error('Failed to initialize first input observer', { error: e });
      }
    }
  }, []);

  return firstInput;
} 