import { logger } from './logger';
import { performanceConfig } from '@/config/performance';
import { performance } from 'perf_hooks';

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, any[]>;
  private observers: Map<string, any>;
  private thresholds: Map<string, number>;

  private constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = new Map();
    this.initializeObservers();
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private initializeObservers() {
    if (!performanceConfig.monitoring.enabled) return;

    // Long tasks observer
    if (typeof PerformanceObserver !== 'undefined') {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            logger.warn('Long task detected', {
              name: entry.name,
              duration: entry.duration,
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longTask', longTaskObserver);
      } catch (e) {
        logger.error('Failed to initialize long task observer', { error: e });
      }

      // Layout shifts observer
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.value > 0.1) {
            logger.warn('Layout shift detected', {
              value: entry.value,
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layoutShift', layoutShiftObserver);
      } catch (e) {
        logger.error('Failed to initialize layout shift observer', { error: e });
      }

      // First input delay observer
      const firstInputObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 100) {
            logger.warn('First input delay detected', {
              duration: entry.duration,
              timestamp: new Date().toISOString()
            });
          }
        });
      });

      try {
        firstInputObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('firstInput', firstInputObserver);
      } catch (e) {
        logger.error('Failed to initialize first input observer', { error: e });
      }
    }
  }

  public recordMetric(name: string, value: any) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push({
      value,
      timestamp: Date.now()
    });
  }

  public getMetrics(name?: string) {
    if (name) {
      return this.metrics.get(name) || [];
    }
    return Object.fromEntries(this.metrics);
  }

  public getStats(name: string) {
    const values = this.metrics.get(name)?.map(m => m.value) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      count: values.length,
      average: avg,
      min,
      max,
      p50,
      p90,
      p95,
      p99
    };
  }

  public setThreshold(name: string, value: number) {
    this.thresholds.set(name, value);
  }

  public getThreshold(name: string) {
    return this.thresholds.get(name);
  }

  public async measurePerformance<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    const startMemory = process.memoryUsage();

    try {
      const result = await fn();
      const end = performance.now();
      const endMemory = process.memoryUsage();
      const duration = end - start;
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;

      this.recordMetric(name, {
        duration,
        memoryUsed,
        timestamp: new Date().toISOString()
      });

      const threshold = this.getThreshold(name);
      if (threshold && duration > threshold) {
        logger.warn('Performance threshold exceeded', {
          name,
          duration,
          threshold,
          timestamp: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      logger.error('Performance measurement failed', {
        name,
        error,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  public clearMetrics(name?: string) {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceService = PerformanceService.getInstance(); 