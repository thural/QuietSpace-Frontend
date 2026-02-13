/**
 * Logging Configuration Types
 * 
 * Defines configuration interfaces for the logging system including
 * environment-based configuration and runtime settings.
 */

import { ILoggingSystemConfig, ILoggerConfig, IAppenderConfig, ILayoutConfig, ISecurityConfig, IPerformanceConfig } from './LoggingInterfaces';

/**
 * Environment-specific configuration
 */
export interface IEnvironmentConfig {
  /** Environment name */
  name: 'development' | 'staging' | 'production' | 'test';
  
  /** Default log level for this environment */
  defaultLevel: string;
  
  /** Whether to enable console output */
  enableConsole: boolean;
  
  /** Whether to enable remote logging */
  enableRemote: boolean;
  
  /** Whether to enable sanitization */
  enableSanitization: boolean;
  
  /** Performance settings */
  performance: {
    /** Enable lazy evaluation */
    lazyEvaluation: boolean;
    /** Enable batching */
    batching: boolean;
    /** Batch size */
    batchSize: number;
    /** Batch interval (ms) */
    batchInterval: number;
  };
  
  /** Remote logging settings */
  remote?: {
    /** Endpoint URL */
    url: string;
    /** Authentication headers */
    headers?: Record<string, string>;
    /** Timeout (ms) */
    timeout: number;
    /** Retry settings */
    retry: {
      maxAttempts: number;
      initialDelay: number;
      maxDelay: number;
    };
  };
}

/**
 * Predefined environment configurations
 */
export const ENVIRONMENT_CONFIGS: Record<string, IEnvironmentConfig> = {
  development: {
    name: 'development',
    defaultLevel: 'DEBUG',
    enableConsole: true,
    enableRemote: false,
    enableSanitization: false,
    performance: {
      lazyEvaluation: false,
      batching: false,
      batchSize: 100,
      batchInterval: 1000
    }
  },
  
  staging: {
    name: 'staging',
    defaultLevel: 'INFO',
    enableConsole: true,
    enableRemote: true,
    enableSanitization: true,
    performance: {
      lazyEvaluation: true,
      batching: true,
      batchSize: 50,
      batchInterval: 2000
    },
    remote: {
      url: '/api/logs',
      timeout: 5000,
      retry: {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000
      }
    }
  },
  
  production: {
    name: 'production',
    defaultLevel: 'WARN',
    enableConsole: false,
    enableRemote: true,
    enableSanitization: true,
    performance: {
      lazyEvaluation: true,
      batching: true,
      batchSize: 100,
      batchInterval: 5000
    },
    remote: {
      url: '/api/logs',
      timeout: 10000,
      retry: {
        maxAttempts: 5,
        initialDelay: 2000,
        maxDelay: 30000
      }
    }
  },
  
  test: {
    name: 'test',
    defaultLevel: 'ERROR',
    enableConsole: false,
    enableRemote: false,
    enableSanitization: true,
    performance: {
      lazyEvaluation: true,
      batching: false,
      batchSize: 10,
      batchInterval: 100
    }
  }
};

/**
 * Category-specific configuration
 */
export interface ICategoryConfig {
  /** Category name pattern (regex supported) */
  pattern: string;
  
  /** Log level for this category */
  level: string;
  
  /** Appenders for this category */
  appenders: string[];
  
  /** Whether to inherit parent configuration */
  inherit: boolean;
  
  /** Custom properties */
  properties?: Record<string, any>;
}

/**
 * Runtime configuration manager
 */
export interface IConfigurationManager {
  /** Get current configuration */
  getCurrentConfig(): ILoggingSystemConfig;
  
  /** Update configuration */
  updateConfig(config: Partial<ILoggingSystemConfig>): void;
  
  /** Get environment configuration */
  getEnvironmentConfig(): IEnvironmentConfig;
  
  /** Set environment */
  setEnvironment(env: string): void;
  
  /** Load configuration from source */
  loadConfig(source: string | object): Promise<void>;
  
  /** Save configuration */
  saveConfig(target?: string): Promise<void>;
  
  /** Validate configuration */
  validateConfig(config: ILoggingSystemConfig): boolean;
  
  /** Reset to defaults */
  resetToDefaults(): void;
}

/**
 * Configuration loader interface
 */
export interface IConfigurationLoader {
  /** Load configuration from file */
  loadFromFile(path: string): Promise<ILoggingSystemConfig>;
  
  /** Load configuration from URL */
  loadFromUrl(url: string): Promise<ILoggingSystemConfig>;
  
  /** Load configuration from environment variables */
  loadFromEnvironment(): ILoggingSystemConfig;
  
  /** Load configuration from object */
  loadFromObject(config: object): ILoggingSystemConfig;
  
  /** Merge configurations */
  merge(base: ILoggingSystemConfig, override: Partial<ILoggingSystemConfig>): ILoggingSystemConfig;
}

/**
 * Configuration validator
 */
export interface IConfigurationValidator {
  /** Validate complete configuration */
  validate(config: ILoggingSystemConfig): IValidationResult;
  
  /** Validate logger configuration */
  validateLogger(config: ILoggerConfig): IValidationResult;
  
  /** Validate appender configuration */
  validateAppender(config: IAppenderConfig): IValidationResult;
  
  /** Validate layout configuration */
  validateLayout(config: ILayoutConfig): IValidationResult;
  
  /** Validate security configuration */
  validateSecurity(config: ISecurityConfig): IValidationResult;
  
  /** Validate performance configuration */
  validatePerformance(config: IPerformanceConfig): IValidationResult;
}

/**
 * Validation result
 */
export interface IValidationResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Validation errors */
  errors: IValidationError[];
  
  /** Validation warnings */
  warnings: IValidationWarning[];
}

/**
 * Validation error
 */
export interface IValidationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Path to invalid property */
  path: string;
  
  /** Invalid value */
  value?: any;
}

/**
 * Validation warning
 */
export interface IValidationWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Path to property */
  path: string;
  
  /** Warning value */
  value?: any;
}

/**
 * Configuration change event
 */
export interface IConfigurationChangeEvent {
  /** Change type */
  type: 'added' | 'updated' | 'removed';
  
  /** Property path */
  path: string;
  
  /** Old value */
  oldValue?: any;
  
  /** New value */
  newValue?: any;
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Configuration watcher
 */
export interface IConfigurationWatcher {
  /** Watch for configuration changes */
  watch(callback: (event: IConfigurationChangeEvent) => void): () => void;
  
  /** Stop watching */
  stop(): void;
}

/**
 * Default configuration factory
 */
export class DefaultConfigurationFactory {
  /**
   * Create default configuration
   */
  static createDefault(env: string = 'development'): ILoggingSystemConfig {
    const envConfig = ENVIRONMENT_CONFIGS[env] || ENVIRONMENT_CONFIGS.development;
    
    return {
      defaultLevel: envConfig.defaultLevel,
      loggers: {
        root: {
          category: 'root',
          level: envConfig.defaultLevel,
          additive: true,
          appenders: ['console'],
          includeCaller: false
        }
      },
      appenders: {
        console: {
          name: 'console',
          type: 'console',
          active: envConfig.enableConsole,
          layout: {
            name: 'console',
            type: envConfig.name === 'development' ? 'pretty' : 'json',
            includeColors: envConfig.name === 'development'
          }
        }
      },
      layouts: {
        json: {
          name: 'json',
          type: 'json',
          includeColors: false
        },
        pretty: {
          name: 'pretty',
          type: 'pretty',
          includeColors: true,
          pattern: '%d{HH:mm:ss} [%level] %category - %message'
        }
      },
      properties: {
        environment: envConfig.name,
        version: process.env.npm_package_version || '1.0.0'
      },
      security: {
        enableSanitization: envConfig.enableSanitization,
        sensitiveFields: [
          'password',
          'token',
          'secret',
          'key',
          'auth',
          'credential',
          'ssn',
          'creditCard',
          'bankAccount'
        ],
        maskChar: '*',
        partialMask: true
      },
      performance: {
        enableLazyEvaluation: envConfig.performance.lazyEvaluation,
        maxMessageLength: 10000,
        enableBatching: envConfig.performance.batching,
        monitoring: {
          enabled: false,
          sampleRate: 0.1
        }
      }
    };
  }

  /**
   * Create production configuration
   */
  static createProduction(): ILoggingSystemConfig {
    return this.createDefault('production');
  }

  /**
   * Create development configuration
   */
  static createDevelopment(): ILoggingSystemConfig {
    return this.createDefault('development');
  }

  /**
   * Create test configuration
   */
  static createTest(): ILoggingSystemConfig {
    return this.createDefault('test');
  }

  /**
   * Create staging configuration
   */
  static createStaging(): ILoggingSystemConfig {
    return this.createDefault('staging');
  }
}
