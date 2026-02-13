/**
 * Development Logging Configuration
 * 
 * Development-friendly configuration with verbose logging and
 * enhanced debugging features
 */

import { ILoggingSystemConfig } from '../types';

export const developmentLoggingConfig: ILoggingSystemConfig = {
  defaultLevel: 'DEBUG',
  
  loggers: {
    'root': {
      category: 'root',
      level: 'DEBUG',
      additive: false,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app': {
      category: 'app',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app.auth': {
      category: 'app.auth',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app.websocket': {
      category: 'app.websocket',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app.post': {
      category: 'app.post',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app.notification': {
      category: 'app.notification',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
    },
    'app.components': {
      category: 'app.components',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true,
      properties: {
        environment: 'development'
      }
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
        includeColors: true,
        pattern: '%d{HH:mm:ss.SSS} [%level] %category - %message'
      },
      properties: {
        enableColors: true,
        timestampFormat: 'HH:mm:ss.SSS'
      }
    }
  },
  
  layouts: {
    pretty: {
      name: 'pretty',
      type: 'pretty',
      includeColors: true,
      pattern: '%d{HH:mm:ss.SSS} [%level] %category - %message'
    },
    console: {
      name: 'console',
      type: 'pretty',
      includeColors: true,
      pattern: '%d{HH:mm:ss.SSS} [%level] %category - %message'
    }
  },
  
  properties: {
    environment: 'development',
    version: '1.0.0',
    service: 'quiet-space-frontend'
  },
  
  security: {
    enableSanitization: false, // Disabled in development for easier debugging
    sensitiveFields: [],
    maskChar: '*',
    partialMask: false,
    customRules: []
  },
  
  performance: {
    enableMonitoring: true,
    slowOperationThreshold: 100, // Lower threshold for development
    memoryMonitoringInterval: 10000, // More frequent monitoring
    gcMonitoringEnabled: true,
    enableProfiling: true // Enable profiling in development
  },
  
  compliance: {
    enabled: false, // Disabled in development
    dataRetentionDays: 1,
    requireConsent: false,
    anonymizeIPs: false,
    enableAuditTrail: false,
    restrictedRegions: [],
    consentStorageKey: 'logging_consent',
    auditFields: []
  }
};
