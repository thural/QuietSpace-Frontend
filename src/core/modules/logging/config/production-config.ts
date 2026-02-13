/**
 * Production Logging Configuration
 * 
 * Production-ready configuration for the centralized logging system
 * with security, performance, and compliance features enabled
 */

import { ILoggingSystemConfig } from '../types';
import { LogLevel } from '../types/LogLevelTypes';

export const productionLoggingConfig: ILoggingSystemConfig = {
  defaultLevel: 'INFO',
  
  loggers: {
    'root': {
      category: 'root',
      level: 'INFO',
      additive: false,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
      }
    },
    'app': {
      category: 'app',
      level: 'INFO',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
      }
    },
    'app.auth': {
      category: 'app.auth',
      level: 'WARN',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production',
        sensitive: true
      }
    },
    'app.websocket': {
      category: 'app.websocket',
      level: 'WARN',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
      }
    },
    'app.post': {
      category: 'app.post',
      level: 'INFO',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
      }
    },
    'app.notification': {
      category: 'app.notification',
      level: 'INFO',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
      }
    },
    'app.components': {
      category: 'app.components',
      level: 'WARN',
      additive: true,
      appenders: ['console', 'remote'],
      includeCaller: false,
      properties: {
        environment: 'production'
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
        type: 'json',
        includeColors: false
      },
      properties: {
        enableColors: false,
        timestampFormat: 'iso'
      }
    },
    remote: {
      name: 'remote',
      type: 'remote',
      active: true,
      layout: {
        name: 'remote',
        type: 'json',
        includeColors: false
      },
      properties: {
        url: process.env.LOGGING_ENDPOINT || 'https://logs.example.com/api/logs',
        batchSize: 100,
        batchInterval: 5000,
        maxRetries: 3,
        retryDelay: 1000,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.LOGGING_API_KEY || ''
        }
      },
      throttling: {
        maxMessagesPerSecond: 100,
        maxBurstSize: 200
      },
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2
      }
    }
  },
  
  layouts: {
    json: {
      name: 'json',
      type: 'json',
      includeColors: false,
      dateFormat: 'iso',
      fields: {
        timestamp: true,
        level: true,
        category: true,
        message: true,
        context: true,
        metadata: true
      }
    },
    console: {
      name: 'console',
      type: 'json',
      includeColors: false,
      dateFormat: 'iso',
      fields: {
        timestamp: true,
        level: true,
        category: true,
        message: true,
        context: true,
        metadata: true
      }
    },
    remote: {
      name: 'remote',
      type: 'json',
      includeColors: false,
      dateFormat: 'iso',
      fields: {
        timestamp: true,
        level: true,
        category: true,
        message: true,
        context: true,
        metadata: true,
        environment: true,
        version: true
      }
    }
  },
  
  properties: {
    environment: 'production',
    version: process.env.APP_VERSION || '1.0.0',
    service: 'quiet-space-frontend'
  },
  
  security: {
    enableSanitization: true,
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
      'phoneNumber',
      'email',
      'address'
    ],
    maskChar: '*',
    partialMask: true,
    customRules: [
      {
        name: 'jwt-token',
        pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
        mask: (value) => value.substring(0, 20) + '...',
        priority: 100
      },
      {
        name: 'ip-address',
        pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
        mask: (value) => value.replace(/\d/g, 'x'),
        priority: 90
      }
    ]
  },
  
  performance: {
    enableMonitoring: true,
    slowOperationThreshold: 1000,
    memoryMonitoringInterval: 30000,
    gcMonitoringEnabled: true,
    enableProfiling: false
  },
  
  compliance: {
    enabled: true,
    dataRetentionDays: 30,
    requireConsent: true,
    anonymizeIPs: true,
    enableAuditTrail: true,
    restrictedRegions: ['EU', 'CA', 'AU'],
    consentStorageKey: 'logging_consent',
    auditFields: [
      'userId',
      'sessionId',
      'action',
      'timestamp',
      'ipAddress',
      'userAgent',
      'result'
    ]
  }
};
