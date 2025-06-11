import { logger } from '@/services/logger';

export interface PerformanceConfig {
  enabled: boolean;
  monitoring: {
    enabled: boolean;
    interval: number;
    metrics: {
      cpu: boolean;
      memory: boolean;
      network: boolean;
      errors: boolean;
    };
  };
  caching: {
    enabled: boolean;
    strategy: 'memory' | 'redis' | 'localStorage';
    ttl: number;
    maxSize: number;
  };
  compression: {
    enabled: boolean;
    level: number;
    threshold: number;
  };
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
  security: {
    enabled: boolean;
    allowedOrigins: string[];
    cors: boolean;
    helmet: boolean;
  };
  logging: {
    enabled: boolean;
    level: 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
}

export const defaultPerformanceConfig: PerformanceConfig = {
  enabled: true,
  monitoring: {
    enabled: true,
    interval: 5000,
    metrics: {
      cpu: true,
      memory: true,
      network: true,
      errors: true
    }
  },
  caching: {
    enabled: true,
    strategy: 'memory',
    ttl: 3600,
    maxSize: 1000
  },
  compression: {
    enabled: true,
    level: 6,
    threshold: 1024
  },
  rateLimiting: {
    enabled: true,
    windowMs: 60000,
    max: 100
  },
  security: {
    enabled: true,
    allowedOrigins: ['*'],
    cors: true,
    helmet: true
  },
  logging: {
    enabled: true,
    level: 'info',
    format: 'json'
  }
};

export function validatePerformanceConfig(config: Partial<PerformanceConfig>): PerformanceConfig {
  const validatedConfig = { ...defaultPerformanceConfig, ...config };

  // Validate monitoring config
  if (validatedConfig.monitoring.interval < 1000) {
    logger.warn('Monitoring interval too low, setting to minimum of 1000ms');
    validatedConfig.monitoring.interval = 1000;
  }

  // Validate caching config
  if (validatedConfig.caching.ttl < 60) {
    logger.warn('Cache TTL too low, setting to minimum of 60 seconds');
    validatedConfig.caching.ttl = 60;
  }

  if (validatedConfig.caching.maxSize < 100) {
    logger.warn('Cache max size too low, setting to minimum of 100 items');
    validatedConfig.caching.maxSize = 100;
  }

  // Validate compression config
  if (validatedConfig.compression.level < 1 || validatedConfig.compression.level > 9) {
    logger.warn('Invalid compression level, setting to default of 6');
    validatedConfig.compression.level = 6;
  }

  if (validatedConfig.compression.threshold < 100) {
    logger.warn('Compression threshold too low, setting to minimum of 100 bytes');
    validatedConfig.compression.threshold = 100;
  }

  // Validate rate limiting config
  if (validatedConfig.rateLimiting.windowMs < 1000) {
    logger.warn('Rate limit window too low, setting to minimum of 1000ms');
    validatedConfig.rateLimiting.windowMs = 1000;
  }

  if (validatedConfig.rateLimiting.max < 1) {
    logger.warn('Rate limit max too low, setting to minimum of 1 request');
    validatedConfig.rateLimiting.max = 1;
  }

  return validatedConfig;
}

export function getEnvironmentConfig(): Partial<PerformanceConfig> {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return {
        monitoring: {
          interval: 10000,
          metrics: {
            cpu: true,
            memory: true,
            network: true,
            errors: true
          }
        },
        caching: {
          strategy: 'redis',
          ttl: 7200,
          maxSize: 5000
        },
        compression: {
          level: 9,
          threshold: 512
        },
        rateLimiting: {
          windowMs: 30000,
          max: 50
        },
        security: {
          allowedOrigins: ['https://yourdomain.com'],
          cors: true,
          helmet: true
        },
        logging: {
          level: 'warn',
          format: 'json'
        }
      };

    case 'staging':
      return {
        monitoring: {
          interval: 5000,
          metrics: {
            cpu: true,
            memory: true,
            network: true,
            errors: true
          }
        },
        caching: {
          strategy: 'memory',
          ttl: 3600,
          maxSize: 1000
        },
        compression: {
          level: 6,
          threshold: 1024
        },
        rateLimiting: {
          windowMs: 60000,
          max: 100
        },
        security: {
          allowedOrigins: ['https://staging.yourdomain.com'],
          cors: true,
          helmet: true
        },
        logging: {
          level: 'info',
          format: 'json'
        }
      };

    case 'development':
    default:
      return {
        monitoring: {
          interval: 2000,
          metrics: {
            cpu: true,
            memory: true,
            network: false,
            errors: true
          }
        },
        caching: {
          strategy: 'memory',
          ttl: 300,
          maxSize: 100
        },
        compression: {
          level: 1,
          threshold: 2048
        },
        rateLimiting: {
          windowMs: 60000,
          max: 1000
        },
        security: {
          allowedOrigins: ['*'],
          cors: true,
          helmet: false
        },
        logging: {
          level: 'debug',
          format: 'text'
        }
      };
  }
}

export function initializePerformanceConfig(): PerformanceConfig {
  const envConfig = getEnvironmentConfig();
  const config = validatePerformanceConfig(envConfig);

  logger.info('Performance configuration initialized', {
    environment: process.env.NODE_ENV,
    config: {
      ...config,
      security: {
        ...config.security,
        allowedOrigins: config.security.allowedOrigins.length
      }
    }
  });

  return config;
}

export const performanceConfig = initializePerformanceConfig(); 