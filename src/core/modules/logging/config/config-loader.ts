/**
 * Configuration Loader
 * 
 * Loads the appropriate logging configuration based on environment
 */

import { ILoggingSystemConfig } from '../types';
import { developmentLoggingConfig } from './development-config';
import { productionLoggingConfig } from './production-config';

/**
 * Get logging configuration based on environment
 */
export function getLoggingConfig(): ILoggingSystemConfig {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'production':
      return productionLoggingConfig;
    case 'staging':
      return {
        ...productionLoggingConfig,
        defaultLevel: 'INFO',
        properties: {
          ...productionLoggingConfig.properties,
          environment: 'staging'
        }
      };
    case 'test':
      return {
        ...developmentLoggingConfig,
        defaultLevel: 'ERROR',
        loggers: {
          root: {
            category: 'root',
            level: 'ERROR',
            additive: false,
            appenders: ['console'],
            includeCaller: false,
            properties: {
              environment: 'test'
            }
          },
          app: {
            category: 'app',
            level: 'ERROR',
            additive: true,
            appenders: ['console'],
            includeCaller: false,
            properties: {
              environment: 'test'
            }
          }
        },
        properties: {
          environment: 'test',
          version: '1.0.0',
          service: 'quiet-space-frontend'
        },
        security: {
          enableSanitization: false,
          sensitiveFields: [],
          maskChar: '*',
          partialMask: false,
          customRules: []
        },
        performance: {
          enableMonitoring: false,
          slowOperationThreshold: 1000,
          memoryMonitoringInterval: 30000,
          gcMonitoringEnabled: false,
          enableProfiling: false
        },
        compliance: {
          enabled: false,
          dataRetentionDays: 1,
          requireConsent: false,
          anonymizeIPs: false,
          enableAuditTrail: false,
          restrictedRegions: [],
          consentStorageKey: 'logging_consent',
          auditFields: []
        }
      };
    case 'development':
    default:
      return developmentLoggingConfig;
  }
}

/**
 * Get environment-specific logging configuration
 */
export function getEnvironmentConfig(env: string = process.env.NODE_ENV || 'development'): ILoggingSystemConfig {
  switch (env) {
    case 'production':
      return productionLoggingConfig;
    case 'staging':
      return {
        ...productionLoggingConfig,
        defaultLevel: 'INFO',
        properties: {
          ...productionLoggingConfig.properties,
          environment: 'staging'
        }
      };
    case 'test':
      return {
        ...developmentLoggingConfig,
        defaultLevel: 'ERROR',
        properties: {
          ...developmentLoggingConfig.properties,
          environment: 'test'
        }
      };
    default:
      return developmentLoggingConfig;
  }
}

/**
 * Validate logging configuration
 */
export function validateConfig(config: ILoggingSystemConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required properties
  if (!config.defaultLevel) {
    errors.push('defaultLevel is required');
  }
  
  if (!config.loggers || Object.keys(config.loggers).length === 0) {
    errors.push('At least one logger must be configured');
  }
  
  if (!config.appenders || Object.keys(config.appenders).length === 0) {
    errors.push('At least one appender must be configured');
  }
  
  // Validate logger configurations
  if (config.loggers) {
    for (const [name, logger] of Object.entries(config.loggers)) {
      if (!logger.category) {
        errors.push(`Logger ${name}: category is required`);
      }
      if (!logger.level) {
        errors.push(`Logger ${name}: level is required`);
      }
      if (!Array.isArray(logger.appenders)) {
        errors.push(`Logger ${name}: appenders must be an array`);
      }
    }
  }
  
  // Validate appender configurations
  if (config.appenders) {
    for (const [name, appender] of Object.entries(config.appenders)) {
      if (!appender.name) {
        errors.push(`Appender ${name}: name is required`);
      }
      if (!appender.type) {
        errors.push(`Appender ${name}: type is required`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
