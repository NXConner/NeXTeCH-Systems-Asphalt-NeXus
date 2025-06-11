import { logger } from '@/services/logger';

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  options: {
    maxSize?: number;
    ttl?: number;
  } = {}
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();
  const { maxSize = 100, ttl } = options;

  return function memoizedFunction(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key)!;
      if (!ttl || Date.now() - timestamp < ttl) {
        return value;
      }
      cache.delete(key);
    }

    const result = func(...args);
    cache.set(key, { value: result, timestamp: Date.now() });

    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  } as T;
}

export function batch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    let currentIndex = 0;

    function processNextBatch() {
      if (currentIndex >= items.length) {
        resolve();
        return;
      }

      const batch = items.slice(
        currentIndex,
        currentIndex + batchSize
      );

      processor(batch)
        .then(() => {
          currentIndex += batchSize;
          processNextBatch();
        })
        .catch(reject);
    }

    processNextBatch();
  });
}

export function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    function attempt() {
      fn()
        .then(resolve)
        .catch((error) => {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(error);
            return;
          }

          const nextDelay = delay * Math.pow(backoff, attempts - 1);
          setTimeout(attempt, nextDelay);
        });
    }

    attempt();
  });
}

export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const start = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize;

  return Promise.resolve(fn()).finally(() => {
    const end = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize;
    const duration = end - start;
    const memoryUsed = endMemory && startMemory ? endMemory - startMemory : 0;

    logger.info('Performance measurement', {
      name,
      duration,
      memoryUsed,
      timestamp: new Date().toISOString()
    });
  });
}

export function createPerformanceMarker(name: string) {
  const start = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize;

  return {
    end: () => {
      const end = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize;
      const duration = end - start;
      const memoryUsed = endMemory && startMemory ? endMemory - startMemory : 0;

      logger.info('Performance marker', {
        name,
        duration,
        memoryUsed,
        timestamp: new Date().toISOString()
      });

      return { duration, memoryUsed };
    }
  };
}

export function createPerformanceTracker() {
  const markers: Record<string, number[]> = {};
  const memory: number[] = [];

  return {
    mark: (name: string) => {
      if (!markers[name]) {
        markers[name] = [];
      }
      markers[name].push(performance.now());
    },

    measure: (name: string) => {
      if (!markers[name] || markers[name].length === 0) {
        logger.warn('No marker found', { name });
        return null;
      }

      const start = markers[name].pop()!;
      const end = performance.now();
      const duration = end - start;

      if (performance.memory) {
        memory.push(performance.memory.usedJSHeapSize);
      }

      return { duration, timestamp: new Date().toISOString() };
    },

    getStats: () => {
      const stats: Record<string, any> = {};

      for (const [name, times] of Object.entries(markers)) {
        if (times.length === 0) continue;

        const durations = times.map((time, index) => {
          if (index === times.length - 1) return null;
          return times[index + 1] - time;
        }).filter(Boolean) as number[];

        if (durations.length === 0) continue;

        stats[name] = {
          count: durations.length,
          average: durations.reduce((a, b) => a + b, 0) / durations.length,
          min: Math.min(...durations),
          max: Math.max(...durations)
        };
      }

      if (memory.length > 0) {
        stats.memory = {
          average: memory.reduce((a, b) => a + b, 0) / memory.length,
          min: Math.min(...memory),
          max: Math.max(...memory)
        };
      }

      return stats;
    },

    clear: () => {
      Object.keys(markers).forEach(key => {
        markers[key] = [];
      });
      memory.length = 0;
    }
  };
}

export function createPerformanceMonitor(options: {
  interval?: number;
  onMetrics?: (metrics: any) => void;
} = {}) {
  const { interval = 5000, onMetrics } = options;
  const tracker = createPerformanceTracker();
  let monitorInterval: NodeJS.Timeout;

  return {
    start: () => {
      monitorInterval = setInterval(() => {
        const metrics = tracker.getStats();
        onMetrics?.(metrics);
      }, interval);
    },

    stop: () => {
      clearInterval(monitorInterval);
    },

    getMetrics: () => tracker.getStats(),
    mark: tracker.mark,
    measure: tracker.measure,
    clear: tracker.clear
  };
} 