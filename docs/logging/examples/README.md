# Logging System Examples

This directory contains practical examples demonstrating how to use the centralized logging system in various scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [React Integration](#react-integration)
- [Performance Monitoring](#performance-monitoring)
- [Security Logging](#security-logging)
- [Error Handling](#error-handling)
- [API Integration](#api-integration)
- [Configuration Examples](#configuration-examples)
- [Advanced Patterns](#advanced-patterns)

## Basic Usage

### Simple Logging

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.examples.basic');

// Basic logging
logger.info('Application started');
logger.warn('Using deprecated API');
logger.error('An error occurred', error);

// With context
logger.info(
  { userId: 'user123', action: 'login' },
  'User action completed'
);

// Parameterized logging
logger.info('User {} logged in from {}', userId, ipAddress);
```

### Different Log Levels

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.examples.levels');

// Different log levels
logger.trace('Detailed debugging information');
logger.debug('Debug information');
logger.info('General information');
logger.audit('Security audit event');
logger.warn('Warning message');
logger.metrics('Performance metric');
logger.error('Error occurred');
logger.security('Security event');
logger.fatal('Critical system error');
```

### Conditional Logging

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.examples.conditional');

// Check if level is enabled before expensive operations
if (logger.isEnabled('DEBUG')) {
  const debugInfo = getExpensiveDebugInfo();
  logger.debug('Debug info: {}', debugInfo);
}

// Use performance monitoring wrapper
const result = logger.withPerformanceMonitoring(
  () => processLargeDataset(data),
  'data-processing'
);
```

## React Integration

### Functional Component with Hook

```typescript
import React, { useEffect, useState } from 'react';
import { useLogger } from '@/features/logging/hooks';

function UserProfile({ userId }: { userId: string }) {
  const logger = useLogger({
    category: 'app.components.UserProfile',
    defaultContext: { userId },
    enablePerformanceMonitoring: true
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    logger.info('Component mounted', { userId });
    
    // Load user data with performance monitoring
    const { result } = logger.withPerformanceMonitoringAsync(
      () => loadUserData(userId),
      'user-data-load'
    );
    setUser(result);
  }, [userId, logger]);

  const handleUpdate = (data: any) => {
    logger.info('Updating user profile', { userId });
    
    const { result } = logger.withPerformanceMonitoringAsync(
      () => updateUserProfile(userId, data),
      'user-profile-update'
    );
    setUser(result);
  };

  return (
    <div>
      <h1>User Profile</h1>
      <button onClick={() => handleUpdate({ name: 'John' })}>
        Update Name
      </button>
    </div>
  );
}
```

### Class Component

```typescript
import React from 'react';
import { getLogger } from '@/core/modules/logging';

class DataGrid extends React.Component {
  private logger = getLogger('app.components.DataGrid');

  componentDidMount() {
    this.logger.info('DataGrid component mounted');
    this.loadData();
  }

  private async loadData() {
    this.logger.info('Loading data...');
    
    try {
      const { result } = this.logger.withPerformanceMonitoringAsync(
        () => fetchGridData(),
        'grid-data-load'
      );
      this.setState({ data: result });
      this.logger.info('Data loaded successfully', { recordCount: result.length });
    } catch (error) {
      this.logger.error('Failed to load data', error);
    }
  }

  render() {
    return <div>Data Grid</div>;
  }
}
```

### Error Boundary

```typescript
import React from 'react';
import { LoggingErrorBoundary } from '@/features/logging/components';

class App extends React.Component {
  render() {
    return (
      <LoggingErrorBoundary logger={getLogger('app.root')}>
        <MyApp />
      </LoggingErrorBoundary>
    );
  }
}

class MyComponent extends React.Component {
  render() {
    if (this.props.error) {
      throw new Error('Component error');
    }
    return <div>My Component</div>;
  }
}
```

### Custom Hook

```typescript
import { useCallback } from 'react';
import { useLogger } from '@/features/logging/hooks';

function useApiLogger(apiName: string) {
  const logger = useLogger({
    category: `app.api.${apiName}`,
    autoComponentContext: false
  });

  const logApiCall = useCallback((
    method: string,
    url: string,
    options?: RequestInit
  ) => {
      logger.info('API call: {} {}', method, url);
      
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });
    }, [logger]);

  const logApiResponse = useCallback((
    method: string,
    url: string,
    response: Response,
    duration: number
  ) => {
      if (response.ok) {
        logger.info('API success: {} {} in {}ms', method, url, duration);
      } else {
        logger.error('API error: {} {} in {}ms', method, url, duration);
      }
    }, [logger]);

  return { logApiCall, logApiResponse };
}
```

## Performance Monitoring

### Basic Performance Monitoring

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.performance');

// Simple performance monitoring
function processData(data: any[]) {
  const { result, measurement } = logger.withPerformanceMonitoring(
    () => {
      return data.map(item => expensiveOperation(item));
    },
    'data-processing'
  );
  
  return result;
}

// Async performance monitoring
async function fetchUserData(userId: string) {
  const { result, measurement } = await logger.withPerformanceMonitoringAsync(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    },
    'user-fetch'
  );
  
  return result;
}
```

### Performance Monitoring Hook

```typescript
import { useLogRenders } from '@/features/logging/hooks';

function ExpensiveComponent({ data }: { data: any[] }) {
  const { stats, resetStats } = useLogRenders({
    componentName: 'ExpensiveComponent',
    trackRenderTime: true,
    excessiveRenderThreshold: 5,
    slowRenderThreshold: 16
  });

  // Log performance issues
  if (stats.excessiveRenders) {
    const logger = getLogger('app.components.ExpensiveComponent');
    logger.warn('Excessive renders detected', {
      rendersPerSecond: stats.rendersPerSecond,
      totalRenders: stats.totalRenders
    });
  }

  if (stats.slowRenders) {
    const logger = getLogger('app.components.ExpensiveComponent');
    logger.warn('Slow render detected', {
      lastRenderTime: stats.lastRenderTime,
      averageRenderTime: stats.averageRenderTime
    });
  }

  return (
    <div>
      <button onClick={resetStats}>Reset Stats</button>
      <div>Render count: {stats.totalRenders}</div>
      <div>Avg render time: {stats.averageRenderTime.toFixed(2)}ms</div>
      <ExpensiveDataGrid data={data} />
    </div>
  );
}
```

### Performance Analytics

```typescript
import { PerformanceUtils } from '@/core/modules/logging';

// Create performance monitor
const monitor = PerformanceUtils;

// Measure function performance
function measureFunction<T>(name: string, fn: () => T): T {
  const { result, measurement } = PerformanceUtils.measure(name, fn);
  
  // Log performance data
  const logger = getLogger('app.performance');
  logger.info('Performance: {} completed in {}ms', name, measurement.duration);
  
  return result;
}

// Get performance statistics
function logPerformanceStats() {
  const stats = PerformanceUtils.getPerformanceSummary();
  const logger = getLogger('app.performance');
  
  logger.info('Performance summary:', {
    totalMeasurements: stats.totalMeasurementNames,
    totalMeasurementsCount: stats.totalMeasurements,
    slowestOperations: stats.slowestOperations.slice(0, 3),
    fastestOperations: stats.fastestOperations.slice(0, 3)
  });
}
```

## Security Logging

### Basic Security Logging

```typescript
import { getLogger } from '@/core/modules/logging';

const securityLogger = getLogger('app.security');

// Security events
securityLogger.security(
  { 
    userId: 'user123',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    action: 'login_attempt'
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
  'Admin {} attempted to access {}',
  'admin',
  '/admin/settings'
);
```

### Compliance Logging

```typescript
import { getLogger } from '@/core/modules/logging';

const auditLogger = getLogger('app.audit');

// Audit events
auditLogger.audit(
  {
    userId: 'user123',
    action: 'data_export',
    resource: '/api/reports',
    recordCount: 1500
  },
  'User {} exported {} records',
  'user123',
  1500
);

auditLogger.audit(
  {
    userId: 'admin',
    action: 'user_created',
    targetUserId: 'user456',
    timestamp: new Date().toISOString()
  },
  'Admin {} created new user {}',
  'admin',
  'user456'
);
```

### Data Sanitization

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.sensitive');

// Sensitive data will be automatically sanitized
logger.info('User login attempt', {
  username: 'john.doe',
  password: 'secret123',  // Will be masked
  token: 'abc123xyz',     // Will be masked
  email: 'john@example.com'
});

// Output: User login attempt { username: "john.doe", password: "***", token: "***", email: "john@example.com" }
```

## Error Handling

### Try-Catch with Context

```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.error');

async function apiCall(endpoint: string) {
  logger.info('Starting API call to {}', endpoint);
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    logger.info('API call successful', { 
      endpoint, 
      status: response.status,
      dataSize: JSON.stringify(data).length 
    });
    
    return data;
  } catch (error) {
    logger.error('API call failed', {
      endpoint,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

### Error Boundary with Logging

```typescript
import React from 'react';
import { getLogger } from '@/core/modules/logging';

class ErrorBoundary extends React.Component {
  private logger = getLogger('app.boundaries');

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.logger.error('Component boundary caught error', {
      component: errorInfo.componentStack,
      error: error.message,
      stack: error.stack
    });
  }

  render() {
    return (
      <div>
        <h1>Something went wrong.</h1>
        <details>
          {this.props.children}
        </details>
      </div>
    );
  }
}
```

### Error Context Creation

```typescript
import { getLogger, LoggingUtils } from '@/core/modules/logging';

const logger = getLogger('app.error');

function handleError(error: Error, context?: Record<string, any>) {
  const errorContext = LoggingUtils.createErrorContext(error, context);
  
  logger.error('Error occurred', errorContext);
}

// Usage
try {
  riskyOperation();
} catch (error) {
  handleError(error, { component: 'DataProcessor', operation: 'processData' });
}
```

## API Integration

### HTTP Client with Logging

```typescript
import { getLogger } from '@/core/modules/logging';

class ApiClient {
  private logger = getLogger('app.api.ApiClient');

  async request<T>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const startTime = performance.now();
    
    this.logger.info('API request: {} {}', method, url);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options
      });

      const duration = performance.now() - startTime;
      
      if (response.ok) {
        this.logger.info('API success: {} {} in {}ms', method, url, duration);
        return response.json();
      } else {
        this.logger.error('API error: {} {} in {}ms', method, url, duration);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logger.error('API request failed: {} {} in {}ms', method, url, duration, error.message);
      throw error;
    }
  }
}
```

### GraphQL Client with Logging

```typescript
import { getLogger } from '@/core/modules/logging';

class GraphQLClient {
  private logger = getLogger('app.graphql.GraphQLClient');

  async query(query: string, variables?: Record<string, any>) {
    const startTime = performance.now();
    
    this.logger.info('GraphQL query: {}', query);
    if (variables) {
      this.logger.debug('GraphQL variables: {}', variables);
    }
    
    try {
      const result = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });

      const duration = performance.now() - startTime;
      const data = await result.json();
      
      if (data.errors) {
        this.logger.error('GraphQL errors: {}', data.errors);
        throw new Error('GraphQL query failed');
      }
      
      this.logger.info('GraphQL success in {}ms', duration);
      return data.data;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logger.error('GraphQL request failed in {}ms: {}', duration, error.message);
      throw error;
    }
  }
}
```

### WebSocket Client with Logging

```typescript
import { getLogger } from '@/core/modules/logging';

class WebSocketClient {
  private logger = getLogger('app.websocket.WebSocketClient');
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.logger.info('Connecting to WebSocket: {}', url);
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      this.logger.info('WebSocket connected: {}', url);
    };
    
    this.ws.onmessage = (event) => {
      this.logger.debug('WebSocket message received', {
        size: event.data.length,
        type: event.type
      });
    };
    
    this.ws.onerror = (error) => {
      this.logger.error('WebSocket error: {}', error.message);
    };
    
    this.ws.onclose = (event) => {
      this.logger.warn('WebSocket closed: {}', event.code, event.reason);
    };
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.logger.debug('Sending WebSocket message', {
        type: typeof message,
        size: JSON.stringify(message).length
      });
      this.ws.send(JSON.stringify(message));
    } else {
      this.logger.warn('WebSocket not ready for sending');
    }
  }
}
```

## Configuration Examples

### Environment-Specific Configuration

```typescript
import { configureLogging } from '@/core/modules/logging';

// Development configuration
if (process.env.NODE_ENV === 'development') {
  configureLogging({
    defaultLevel: 'DEBUG',
    loggers: {
      'app.root': {
        category: 'app.root',
        level: 'DEBUG',
        appenders: ['console'],
        includeCaller: true
      }
    },
    appenders: {
      console: {
        type: 'console',
        active: true,
        layout: {
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
  });
}

// Production configuration
if (process.env.NODE_ENV === 'production') {
  configureLogging({
    defaultLevel: 'WARN',
    loggers: {
      'app.root': {
        category: 'app.root',
        level: 'WARN',
        appenders: ['remote'],
        includeCaller: false
      }
    },
    appenders: {
      remote: {
        type: 'remote',
        active: true,
        url: process.env.LOGGING_ENDPOINT || '/api/logs',
        layout: {
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
          maxDelay: 30000
        }
      }
    },
    security: {
      enableSanitization: true,
      sensitiveFields: ['password', 'token', 'secret', 'key']
    },
    performance: {
      enableLazyEvaluation: true,
      enableBatching: true,
      maxMessageLength: 5000
    }
  });
}
```

### Category-Specific Configuration

```typescript
import { configureLogging } from '@/core/modules/logging';

configureLogging({
  loggers: {
    // Authentication logging
    'app.auth': {
      category: 'app.auth',
      level: 'DEBUG',
      appenders: ['console', 'remote'],
      includeCaller: false
    },
    
    // API logging
    'app.api': {
      category: 'app.api',
      level: 'INFO',
      appenders: ['console', 'remote'],
      includeCaller: false
    },
    
    // Component logging
    'app.components': {
      category: 'app.components',
      level: 'INFO',
      appenders: ['console'],
      includeCaller: true
    },
    
    // Security logging
    'app.security': {
      category: 'app.security',
      level: 'INFO',
      appenders: ['console', 'remote', 'file'],
      includeCaller: false
    }
  }
});
```

### Custom Appender Configuration

```typescript
import { configureLogging, registerAppenderType } from '@/core/modules/logging';

// Register custom appender
registerAppenderType('database', (config) => {
  return new DatabaseAppender(config);
});

// Configure with custom appender
configureLogging({
  appenders: {
    database: {
      type: 'database',
      active: true,
      connectionString: 'postgresql://localhost:5432/logs',
      table: 'application_logs',
      layout: {
        type: 'json',
        includeColors: false
      }
    }
  }
});
```

## Advanced Patterns

### Context Builder Pattern

```typescript
import { LoggingContextBuilder } from '@/core/modules/logging';

function createUserActionLogger(userId: string, action: string) {
  const logger = getLogger('app.user.actions');
  
  const context = new LoggingContextBuilder()
    .withUserId(userId)
    .withAction(action)
    .withRoute(window.location.pathname)
    .withUserAgent(navigator.userAgent)
    .withAdditionalData('timestamp', new Date().toISOString())
    .build();
  
  logger.info('User action', context);
}

// Usage
createUserActionLogger('user123', 'login');
```

### Logger Factory Pattern

```typescript
import { LoggerFactory } from '@/core/modules/logging';

class ServiceLoggerFactory {
  private static instance: LoggerFactory;
  
  static getInstance(): LoggerFactory {
    if (!ServiceLoggerFactory.instance) {
      ServiceLoggerFactory.instance = new LoggerFactory();
    }
    return ServiceLoggerFactory.instance;
  }
  
  static createServiceLogger(serviceName: string) {
    const factory = ServiceLoggerFactory.getInstance();
    return factory.createLogger(`app.services.${serviceName}`, {
      category: `app.services.${serviceName}`,
      level: 'INFO',
      appenders: ['console', 'remote'],
      properties: {
        service: serviceName,
        version: '1.0.0'
      }
    });
  }
}

// Usage
const userServiceLogger = ServiceLoggerFactory.createServiceLogger('UserService');
const apiServiceLogger = ServiceLoggerFactory.createServiceLogger('ApiService');
```

### Performance Decorator Pattern

```typescript
import { getLogger } from '@/core/modules/logging';

function LogPerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const logger = getLogger(`app.performance.${target.constructor.name}`);
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const { result, measurement } = logger.withPerformanceMonitoringAsync(
        () => originalMethod.apply(this, args),
        operationName || `${target.constructor.name}.${propertyName}`
      );
      
      return result;
    };
    
    return descriptor;
  };
}

// Usage
class DataService {
  @LogPerformance('data-processing')
  async processData(data: any[]) {
    return data.map(item => expensiveOperation(item));
  }
  
  @LogPerformance()
  async saveData(data: any) {
    return database.save(data);
  }
}
```

### Error Handling Middleware

```typescript
import { getLogger } from '@/core/modules/logging';

function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: Record<string, any>,
  logger?: ILogger
): Promise<T> {
  const fallbackLogger = logger || getLogger('app.error');
  
  try {
    return await operation();
  } catch (error) {
    fallbackLogger.error('Operation failed', {
      ...context,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Usage
const result = await withErrorHandling(
  () => apiCall(endpoint),
  { operation: 'data-fetch', endpoint },
  apiLogger
);
```

---

These examples demonstrate practical usage patterns for the centralized logging system. For more examples, see the individual example files in this directory.
