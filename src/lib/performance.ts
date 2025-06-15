import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly MAX_METRICS = 1000;
  private updateTimeout: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL = 5000; // 5 seconds

  private constructor() {
    this.startPeriodicUpdates();
  }

  private startPeriodicUpdates() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setInterval(() => {
      this.logMetrics();
    }, this.UPDATE_INTERVAL);
  }

  private logMetrics() {
    const metrics = this.getMetrics();
    if (metrics.length > 0) {
      logger.info('Performance metrics updated', { metrics });
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMeasure(name: string) {
    if (this.metrics.size >= this.MAX_METRICS) {
      this.metrics.clear();
      logger.warn('Performance metrics buffer cleared due to size limit');
    }

    this.metrics.set(name, {
      name,
      startTime: performance.now()
    });
  }

  public endMeasure(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`No performance metric found for: ${name}`);
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    logger.debug(`Performance metric: ${name}`, {
      duration: metric.duration,
      startTime: metric.startTime,
      endTime: metric.endTime
    });

    this.metrics.set(name, metric);
  }

  public getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  public clearMetrics() {
    this.metrics.clear();
  }

  public dispose() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map();

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
};

// React-specific performance utilities
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();

  return {
    endMeasure: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.debug(`Component render time: ${componentName}`, {
        duration,
        startTime,
        endTime
      });
    }
  };
};

// Memory management utilities
export const clearMemory = () => {
  if (global.gc) {
    global.gc();
    logger.debug('Manual garbage collection triggered');
  }
};

// Cache management
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl
    });
  }

  public get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  public clear() {
    this.cache.clear();
  }

  public remove(key: string) {
    this.cache.delete(key);
  }
}

export const cacheManager = CacheManager.getInstance(); 