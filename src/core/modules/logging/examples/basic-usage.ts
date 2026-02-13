/**
 * Basic Usage Example
 * 
 * Demonstrates basic usage of the centralized logging system.
 */

import { getLogger, configureLogging, LogLevel } from '../index';

// Configure logging system
configureLogging({
  defaultLevel: 'INFO',
  loggers: {
    root: {
      category: 'root',
      level: 'INFO',
      additive: true,
      appenders: ['console'],
      includeCaller: false
    },
    'app.auth': {
      category: 'app.auth',
      level: 'DEBUG',
      additive: true,
      appenders: ['console'],
      includeCaller: true
    },
    'app.api': {
      category: 'app.api',
      level: 'WARN',
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
  }
});

// Get loggers
const rootLogger = getLogger('root');
const authLogger = getLogger('app.auth');
const apiLogger = getLogger('app.api');

// Basic logging examples
function demonstrateBasicLogging() {
  // Simple message logging
  rootLogger.info('Application started');
  rootLogger.warn('This is a warning message');
  rootLogger.error('This is an error message');

  // Parameterized logging (SLF4J-style)
  const userId = 'user123';
  const action = 'login';
  authLogger.info('User {} performed {} action', userId, action);

  // Logging with context
  authLogger.debug(
    { 
      userId: 'user123', 
      sessionId: 'sess456', 
      component: 'AuthService' 
    },
    'Authentication attempt for user {}',
    userId
  );

  // Error logging with stack trace
  try {
    throw new Error('Something went wrong');
  } catch (error) {
    rootLogger.error(
      { component: 'ErrorHandler' },
      'Error occurred: {}',
      error.message
    );
  }
}

// Performance monitoring example
function demonstratePerformanceMonitoring() {
  const perfLogger = getLogger('app.performance');
  
  // Performance monitoring wrapper
  const result = perfLogger.withPerformanceMonitoring(
    () => {
      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 100) {
        // Busy wait
      }
      return 'operation result';
    },
    'data-processing'
  );
  
  console.log('Operation result:', result);
}

// Security logging example
function demonstrateSecurityLogging() {
  const securityLogger = getLogger('app.security');
  
  // Security events
  securityLogger.security(
    { 
      userId: 'user123', 
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    },
    'Failed login attempt from IP {} for user {}',
    '192.168.1.100',
    'user123'
  );
  
  securityLogger.security(
    { 
      userId: 'admin',
      action: 'privilege_escalation',
      resource: '/admin/settings'
    },
    'Privilege escalation attempt by user {} on resource {}',
    'admin',
    '/admin/settings'
  );
}

// Metrics logging example
function demonstrateMetricsLogging() {
  const metricsLogger = getLogger('app.metrics');
  
  // Performance metrics
  metricsLogger.metrics(
    { 
      component: 'DatabaseService',
      operation: 'query',
      duration: 45
    },
    'Database query completed in {}ms',
    45
  );
  
  // Business metrics
  metricsLogger.metrics(
    { 
      component: 'UserService',
      event: 'user_registration',
      userId: 'user456'
    },
    'New user registered: {}',
    'user456'
  );
}

// Audit logging example
function demonstrateAuditLogging() {
  const auditLogger = getLogger('app.audit');
  
  // Audit events
  auditLogger.audit(
    { 
      userId: 'admin',
      action: 'user_created',
      targetUserId: 'user789',
      timestamp: new Date().toISOString()
    },
    'Admin {} created new user {}',
    'admin',
    'user789'
  );
  
  auditLogger.audit(
    { 
      userId: 'user123',
      action: 'data_export',
      resource: '/api/reports',
      recordCount: 1500
    },
    'User {} exported {} records from {}',
    'user123',
    1500,
    '/api/reports'
  );
}

// Run all demonstrations
export function runLoggingExamples() {
  console.log('=== Basic Logging Examples ===');
  demonstrateBasicLogging();
  
  console.log('\n=== Performance Monitoring Examples ===');
  demonstratePerformanceMonitoring();
  
  console.log('\n=== Security Logging Examples ===');
  demonstrateSecurityLogging();
  
  console.log('\n=== Metrics Logging Examples ===');
  demonstrateMetricsLogging();
  
  console.log('\n=== Audit Logging Examples ===');
  demonstrateAuditLogging();
}

// Example usage in React components
export function useComponentLogger(componentName: string) {
  return getLogger(`app.components.${componentName}`);
}

// Example usage in API services
export function useServiceLogger(serviceName: string) {
  return getLogger(`app.services.${serviceName}`);
}

// Example usage in utilities
export function useUtilityLogger(utilityName: string) {
  return getLogger(`app.utils.${utilityName}`);
}
