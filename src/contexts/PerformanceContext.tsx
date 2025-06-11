import React, { createContext, useContext, useEffect, useState } from 'react';
import { performanceService } from '@/services/performanceService';
import { logger } from '@/services/logger';

interface PerformanceContextType {
  metrics: Record<string, any>;
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
  clearMetrics: () => void;
  setThreshold: (name: string, value: number) => void;
  getThreshold: (name: string) => number | undefined;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export function PerformanceProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = async () => {
    try {
      const data = performanceService.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch performance metrics');
      logger.error('Failed to fetch performance metrics', { error: err });
    } finally {
      setLoading(false);
    }
  };

  const clearMetrics = () => {
    performanceService.clearMetrics();
    setMetrics({});
  };

  const setThreshold = (name: string, value: number) => {
    performanceService.setThreshold(name, value);
  };

  const getThreshold = (name: string) => {
    return performanceService.getThreshold(name);
  };

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        metrics,
        loading,
        error,
        refreshMetrics,
        clearMetrics,
        setThreshold,
        getThreshold
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}

export function usePerformanceMetrics(name: string) {
  const { metrics } = usePerformance();
  return metrics[name] || [];
}

export function usePerformanceThreshold(name: string, threshold: number) {
  const { setThreshold } = usePerformance();

  useEffect(() => {
    setThreshold(name, threshold);
  }, [name, threshold, setThreshold]);

  return usePerformanceMetrics(name).some(
    (metric: any) => metric.value > threshold
  );
}

export function usePerformanceAlert(
  name: string,
  threshold: number,
  onAlert: (metric: any) => void
) {
  const metrics = usePerformanceMetrics(name);

  useEffect(() => {
    const exceededMetrics = metrics.filter(
      (metric: any) => metric.value > threshold
    );
    exceededMetrics.forEach(onAlert);
  }, [metrics, threshold, onAlert]);
}

export function usePerformanceMonitor(options: {
  interval?: number;
  onMetrics?: (metrics: any) => void;
} = {}) {
  const { interval = 5000, onMetrics } = options;
  const { metrics, refreshMetrics, loading, error, clearMetrics } = usePerformance();

  useEffect(() => {
    const monitorInterval = setInterval(() => {
      refreshMetrics();
      onMetrics?.(metrics);
    }, interval);

    return () => clearInterval(monitorInterval);
  }, [interval, onMetrics, refreshMetrics, metrics]);

  return { metrics, refreshMetrics, loading, error, clearMetrics };
}

export function usePerformanceOptimization(options: {
  name: string;
  threshold: number;
  onThresholdExceeded?: (metrics: any) => void;
}) {
  const { name, threshold, onThresholdExceeded } = options;
  const { setThreshold } = usePerformance();
  const metrics = usePerformanceMetrics(name);

  useEffect(() => {
    setThreshold(name, threshold);
  }, [name, threshold, setThreshold]);

  useEffect(() => {
    const exceededMetrics = metrics.filter(
      (metric: any) => metric.value > threshold
    );
    exceededMetrics.forEach(onThresholdExceeded || (() => {}));
  }, [metrics, threshold, onThresholdExceeded]);

  return {
    metrics,
    isExceeded: metrics.some((metric: any) => metric.value > threshold)
  };
}

export function usePerformanceReport({ name, interval = 60000, onReport }: { name: string; interval?: number; onReport?: (report: any) => void; }) {
  const metrics = usePerformanceMetrics(name);

  useEffect(() => {
    const reportInterval = setInterval(() => {
      const report = {
        name,
        timestamp: new Date().toISOString(),
        metrics: {
          count: metrics.length,
          average:
            metrics.reduce((sum: number, m: any) => sum + m.value, 0) /
            metrics.length,
          min: Math.min(...metrics.map((m: any) => m.value)),
          max: Math.max(...metrics.map((m: any) => m.value))
        }
      };
      onReport?.(report);
    }, interval);

    return () => clearInterval(reportInterval);
  }, [name, interval, onReport, metrics]);

  return metrics;
} 