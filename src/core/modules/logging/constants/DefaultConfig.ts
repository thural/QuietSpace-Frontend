/**
 * Default Configuration Constants
 * 
 * Default configuration values for the logging system.
 */

import { ILoggingSystemConfig, ISecurityConfig, IPerformanceConfig } from '../types';

/**
 * Default security configuration
 */
export const DEFAULT_SECURITY_CONFIG: ISecurityConfig = {
  enableSanitization: false,
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
    'ssn',
    'creditCard',
    'bankAccount',
    'apiKey',
    'privateKey',
    'accessToken',
    'refreshToken'
  ],
  maskChar: '*',
  partialMask: true
};

/**
 * Default performance configuration
 */
export const DEFAULT_PERFORMANCE_CONFIG: IPerformanceConfig = {
  enableLazyEvaluation: true,
  maxMessageLength: 10000,
  enableBatching: false,
  monitoring: {
    enabled: false,
    sampleRate: 0.1
  }
};

/**
 * Default logging system configuration
 */
export const DEFAULT_LOGGING_CONFIG: ILoggingSystemConfig = {
  defaultLevel: 'INFO',
  loggers: {
    root: {
      category: 'root',
      level: 'INFO',
      additive: true,
      appenders: ['console'],
      includeCaller: false
    }
  },
  appenders: {
    console: {
      name: 'console',
      type: 'console',
      active: true,
      layout: {
        name: 'console',
        type: 'pretty',
        includeColors: true
      }
    }
  },
  layouts: {
    pretty: {
      name: 'pretty',
      type: 'pretty',
      includeColors: true,
      pattern: '%d{HH:mm:ss} [%level] %category - %message'
    },
    json: {
      name: 'json',
      type: 'json',
      includeColors: false
    }
  },
  properties: {
    environment: 'development',
    version: '1.0.0',
    application: 'QuietSpace'
  },
  security: DEFAULT_SECURITY_CONFIG,
  performance: DEFAULT_PERFORMANCE_CONFIG
};

/**
 * Development environment configuration
 */
export const DEVELOPMENT_CONFIG: Partial<ILoggingSystemConfig> = {
  defaultLevel: 'DEBUG',
  loggers: {
    root: {
      category: 'root',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true
    }
  },
  appenders: {
    console: {
      name: 'console',
      type: 'console',
      active: true,
      layout: {
        name: 'console',
        type: 'pretty',
        includeColors: true
      }
    }
  },
  security: {
    enableSanitization: false
  },
  performance: {
    enableLazyEvaluation: false,
    monitoring: {
      enabled: true,
      sampleRate: 1.0
    }
  }
};

/**
 * Test environment configuration
 */
export const TEST_CONFIG: Partial<ILoggingSystemConfig> = {
  defaultLevel: 'ERROR',
  loggers: {
    root: {
      category: 'root',
      level: 'ERROR',
      additive: true,
      appenders: ['console'],
      includeCaller: false
    }
  },
  security: {
    enableSanitization: true
  },
  performance: {
    enableLazyEvaluation: true,
    enableBatching: false
  }
};

/**
 * Staging environment configuration
 */
export const STAGING_CONFIG: Partial<ILoggingSystemConfig> = {
  defaultLevel: 'INFO',
  loggers: {
    root: {
      category: 'root',
      level: 'INFO',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false
    }
  },
  appenders: {
    console: {
      name: 'console',
      type: 'console',
      active: true,
      layout: {
        name: 'console',
        type: 'json',
        includeColors: false
      }
    },
    remote: {
      name: 'remote',
      type: 'remote',
      active: true,
      url: '/api/logs',
      layout: {
        name: 'remote',
        type: 'json',
        includeColors: false
      },
      throttling: {
        maxBatchSize: 50,
        maxInterval: 2000,
        maxPerSecond: 25
      },
      retry: {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        exponentialBackoff: true
      }
    }
  },
  security: {
    enableSanitization: true
  },
  performance: {
    enableLazyEvaluation: true,
    enableBatching: true,
    monitoring: {
      enabled: true,
      sampleRate: 0.5
    }
  }
};

/**
 * Production environment configuration
 */
export const PRODUCTION_CONFIG: Partial<ILoggingSystemConfig> = {
  defaultLevel: 'WARN',
  loggers: {
    root: {
      category: 'root',
      level: 'WARN',
      additive: true,
      appenders: ['remote'],
      includeCaller: false
    }
  },
  appenders: {
    remote: {
      name: 'remote',
      type: 'remote',
      active: true,
      url: '/api/logs',
      layout: {
        name: 'remote',
        type: 'json',
        includeColors: false
      },
      throttling: {
        maxBatchSize: 100,
        maxInterval: 5000,
        maxPerSecond: 50
      },
      retry: {
        maxAttempts: 5,
        initialDelay: 2000,
        maxDelay: 30000,
        exponentialBackoff: true
      }
    }
  },
  security: {
    enableSanitization: true
  },
  performance: {
    enableLazyEvaluation: true,
    enableBatching: true,
    maxMessageLength: 5000,
    monitoring: {
      enabled: false,
      sampleRate: 0.01
    }
  }
};

/**
 * Environment-specific configurations
 */
export const ENVIRONMENT_CONFIGS = {
  development: DEVELOPMENT_CONFIG,
  test: TEST_CONFIG,
  staging: STAGING_CONFIG,
  production: PRODUCTION_CONFIG
} as const;

/**
 * Default appender configurations
 */
export const DEFAULT_APPENDER_CONFIGS = {
  console: {
    name: 'console',
    type: 'console',
    active: true,
    layout: {
      name: 'console',
      type: 'pretty',
      includeColors: true
    }
  },
  remote: {
    name: 'remote',
    type: 'remote',
    active: false,
    url: '/api/logs',
    layout: {
      name: 'remote',
      type: 'json',
      includeColors: false
    },
    throttling: {
      maxBatchSize: 100,
      maxInterval: 5000,
      maxPerSecond: 50
    },
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      exponentialBackoff: true
    }
  },
  memory: {
    name: 'memory',
    type: 'memory',
    active: false,
    maxSize: 1000,
    layout: {
      name: 'memory',
      type: 'json',
      includeColors: false
    }
  },
  localStorage: {
    name: 'localStorage',
    type: 'localStorage',
    active: false,
    key: 'logs',
    maxSize: 1000,
    layout: {
      name: 'localStorage',
      type: 'json',
      includeColors: false
    }
  }
} as const;

/**
 * Default layout configurations
 */
export const DEFAULT_LAYOUT_CONFIGS = {
  pretty: {
    name: 'pretty',
    type: 'pretty',
    includeColors: true,
    pattern: '%d{HH:mm:ss} [%level] %category - %message'
  },
  json: {
    name: 'json',
    type: 'json',
    includeColors: false
  },
  grafana: {
    name: 'grafana',
    type: 'json',
    includeColors: false,
    fields: {
      job: 'react-app',
      instance: 'browser',
      level: '%level',
      category: '%category',
      message: '%message'
    }
  }
} as const;

/**
 * Default logger configurations
 */
export const DEFAULT_LOGGER_CONFIGS = {
  root: {
    category: 'root',
    level: 'INFO',
    additive: true,
    appenders: ['console'],
    includeCaller: false
  },
  'app.components': {
    category: 'app.components',
    level: 'INFO',
    additive: true,
    appenders: ['console'],
    includeCaller: true
  },
  'app.services': {
    category: 'app.services',
    level: 'INFO',
    additive: true,
    appenders: ['console'],
    includeCaller: false
  },
  'app.api': {
    category: 'app.api',
    level: 'WARN',
    additive: true,
    appenders: ['console'],
    includeCaller: false
  },
  'app.auth': {
    category: 'app.auth',
    level: 'DEBUG',
    additive: true,
    appenders: ['console'],
    includeCaller: false
  },
  'app.security': {
    category: 'app.security',
    level: 'INFO',
    additive: true,
    appenders: ['console'],
    includeCaller: false
  }
} as const;

/**
 * Get configuration for environment
 */
export function getEnvironmentConfig(environment: string): Partial<ILoggingSystemConfig> {
  return (ENVIRONMENT_CONFIGS as any)[environment] || DEVELOPMENT_CONFIG;
}

/**
 * Get default appender configuration
 */
export function getDefaultAppenderConfig(type: string) {
  return (DEFAULT_APPENDER_CONFIGS as any)[type];
}

/**
 * Get default layout configuration
 */
export function getDefaultLayoutConfig(type: string) {
  return (DEFAULT_LAYOUT_CONFIGS as any)[type];
}

/**
 * Get default logger configuration
 */
export function getDefaultLoggerConfig(category: string) {
  return (DEFAULT_LOGGER_CONFIGS as any)[category];
}
