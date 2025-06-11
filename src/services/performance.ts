import { logger } from './logger';

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, number[]> = new Map();
  private thresholds: Map<string, number> = new Map();
  private observers: Set<PerformanceObserver> = new Set();

  private constructor() {
    this.initializeObservers();
    this.setDefaultThresholds();
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private initializeObservers() {
    // Observe long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('longTasks', entry.duration);
        if (entry.duration > this.thresholds.get('longTask')!) {
          logger.warn('Long task detected', { duration: entry.duration });
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
    this.observers.add(longTaskObserver);

    // Observe layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('layoutShifts', (entry as any).value);
        if ((entry as any).value > this.thresholds.get('layoutShift')!) {
          logger.warn('Layout shift detected', { value: (entry as any).value });
        }
      });
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.add(layoutShiftObserver);

    // Observe first input delay
    const firstInputObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('firstInput', entry.duration);
        if (entry.duration > this.thresholds.get('firstInput')!) {
          logger.warn('High first input delay', { duration: entry.duration });
        }
      });
    });
    firstInputObserver.observe({ entryTypes: ['first-input'] });
    this.observers.add(firstInputObserver);
  }

  private setDefaultThresholds() {
    this.thresholds.set('longTask', 50); // 50ms
    this.thresholds.set('layoutShift', 0.1); // 0.1
    this.thresholds.set('firstInput', 100); // 100ms
    this.thresholds.set('memory', 50 * 1024 * 1024); // 50MB
    this.thresholds.set('cpu', 80); // 80%
  }

  public recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  public getMetricStats(name: string) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      average: avg,
      minimum: min,
      maximum: max,
      p95: this.calculatePercentile(values, 95),
      p99: this.calculatePercentile(values, 99)
    };
  }

  private calculatePercentile(values: number[], percentile: number) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  public async measurePerformance(fn: () => Promise<void> | void) {
    const start = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize;

    try {
      await fn();
    } finally {
      const end = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize;
      const duration = end - start;
      const memoryUsed = endMemory && startMemory ? endMemory - startMemory : 0;

      this.recordMetric('executionTime', duration);
      if (memoryUsed) {
        this.recordMetric('memoryUsage', memoryUsed);
      }

      if (duration > this.thresholds.get('longTask')!) {
        logger.warn('Long execution detected', { duration, memoryUsed });
      }
    }
  }

  public setThreshold(name: string, value: number) {
    this.thresholds.set(name, value);
  }

  public getThreshold(name: string) {
    return this.thresholds.get(name);
  }

  public getMetrics() {
    const result: Record<string, any> = {};
    for (const [name, values] of this.metrics.entries()) {
      result[name] = this.getMetricStats(name);
    }
    return result;
  }

  public clearMetrics() {
    this.metrics.clear();
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceService = PerformanceService.getInstance(); 