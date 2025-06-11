import { logger } from '@/services/logger';
import { performance } from 'perf_hooks';

export interface PerformanceMiddlewareOptions {
  enabled?: boolean;
  logLevel?: 'info' | 'warn' | 'error';
  threshold?: number;
  excludePaths?: string[];
}

export function createPerformanceMiddleware(options: PerformanceMiddlewareOptions = {}) {
  const {
    enabled = true,
    logLevel = 'info',
    threshold = 1000,
    excludePaths = []
  } = options;

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const path = req.path;
    if (excludePaths.some(excludedPath => path.startsWith(excludedPath))) {
      return next();
    }

    const start = performance.now();
    const startMemory = process.memoryUsage();

    res.on('finish', () => {
      const end = performance.now();
      const endMemory = process.memoryUsage();
      const duration = end - start;
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;

      const metrics = {
        path,
        method: req.method,
        duration,
        memoryUsed,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      };

      if (duration > threshold) {
        logger.warn('Slow request detected', metrics);
      } else {
        logger[logLevel]('Request completed', metrics);
      }
    });

    next();
  };
}

export function createMemoryMiddleware(options: {
  enabled?: boolean;
  threshold?: number;
  interval?: number;
} = {}) {
  const {
    enabled = true,
    threshold = 0.8,
    interval = 60000
  } = options;

  let lastCheck = Date.now();

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const now = Date.now();
    if (now - lastCheck >= interval) {
      const memoryUsage = process.memoryUsage();
      const heapUsed = memoryUsage.heapUsed / memoryUsage.heapTotal;

      if (heapUsed > threshold) {
        logger.warn('High memory usage detected', {
          heapUsed,
          threshold,
          memoryUsage,
          timestamp: new Date().toISOString()
        });
      }

      lastCheck = now;
    }

    next();
  };
}

export function createErrorMiddleware(options: {
  enabled?: boolean;
  logLevel?: 'error' | 'warn';
} = {}) {
  const {
    enabled = true,
    logLevel = 'error'
  } = options;

  return (err: any, req: any, res: any, next: any) => {
    if (!enabled) {
      return next(err);
    }

    logger[logLevel]('Error occurred', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    next(err);
  };
}

export function createCompressionMiddleware(options: {
  enabled?: boolean;
  level?: number;
  threshold?: number;
} = {}) {
  const {
    enabled = true,
    level = 6,
    threshold = 1024
  } = options;

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const originalSend = res.send;
    res.send = function (body: any) {
      if (typeof body === 'string' && body.length > threshold) {
        // Implement compression logic here
        // This is a placeholder for actual compression implementation
        logger.info('Compressing response', {
          originalSize: body.length,
          path: req.path,
          timestamp: new Date().toISOString()
        });
      }
      return originalSend.call(this, body);
    };

    next();
  };
}

export function createCachingMiddleware(options: {
  enabled?: boolean;
  duration?: number;
  excludePaths?: string[];
} = {}) {
  const {
    enabled = true,
    duration = 3600,
    excludePaths = []
  } = options;

  const cache = new Map();

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const path = req.path;
    if (excludePaths.some(excludedPath => path.startsWith(excludedPath))) {
      return next();
    }

    const key = `${req.method}:${path}`;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      logger.info('Serving from cache', {
        path,
        method: req.method,
        timestamp: new Date().toISOString()
      });
      return res.json(cached.data);
    }

    const originalJson = res.json;
    res.json = function (data: any) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      return originalJson.call(this, data);
    };

    next();
  };
}

export function createRateLimitMiddleware(options: {
  enabled?: boolean;
  windowMs?: number;
  max?: number;
} = {}) {
  const {
    enabled = true,
    windowMs = 60000,
    max = 100
  } = options;

  const requests = new Map();

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const ipRequests = requests.get(ip);
    ipRequests.push(now);

    // Remove old requests
    while (ipRequests[0] < windowStart) {
      ipRequests.shift();
    }

    if (ipRequests.length > max) {
      logger.warn('Rate limit exceeded', {
        ip,
        count: ipRequests.length,
        max,
        timestamp: new Date().toISOString()
      });
      return res.status(429).json({
        error: 'Too many requests'
      });
    }

    next();
  };
}

export function createSecurityMiddleware(options: {
  enabled?: boolean;
  allowedOrigins?: string[];
} = {}) {
  const {
    enabled = true,
    allowedOrigins = ['*']
  } = options;

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes('*') && !allowedOrigins.includes(origin)) {
      logger.warn('Invalid origin', {
        origin,
        allowedOrigins,
        timestamp: new Date().toISOString()
      });
      return res.status(403).json({
        error: 'Invalid origin'
      });
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    next();
  };
}

export function createLoggingMiddleware(options: {
  enabled?: boolean;
  logLevel?: 'info' | 'debug';
  excludePaths?: string[];
} = {}) {
  const {
    enabled = true,
    logLevel = 'info',
    excludePaths = []
  } = options;

  return async (req: any, res: any, next: any) => {
    if (!enabled) {
      return next();
    }

    const path = req.path;
    if (excludePaths.some(excludedPath => path.startsWith(excludedPath))) {
      return next();
    }

    const start = performance.now();

    res.on('finish', () => {
      const duration = performance.now() - start;
      logger[logLevel]('Request completed', {
        method: req.method,
        path,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString()
      });
    });

    next();
  };
} 