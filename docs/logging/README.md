# Centralized Logging System Documentation

## Overview

The centralized logging system provides enterprise-grade logging capabilities for large-scale React applications. It follows a Black Box architecture pattern with comprehensive security, performance optimization, and compliance features.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Core Concepts](#core-concepts)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Usage

```typescript
import { getLogger } from '@/core/modules/logging';

// Get a logger for your component
const logger = getLogger('app.components.MyComponent');

// Log messages with different levels
logger.info('Component mounted successfully');
logger.warn('Deprecated prop used');
logger.error('Failed to load data', error);

// Parameterized logging (performance optimized)
logger.info('User {} logged in from {}', userId, ipAddress);

// Log with context
logger.info(
  { userId, action: 'login', component: 'AuthService' },
  'Authentication successful'
);
```

### React Hook Usage

```typescript
import { useLogger } from '@/features/logging/hooks';

function MyComponent() {
  const logger = useLogger({
    category: 'app.components.MyComponent',
    enablePerformanceMonitoring: true
  });

  const handleClick = () => {
    logger.info('Button clicked', { buttonId: 'submit' });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Architecture

### Black Box Pattern

The logging system follows a Black Box architecture pattern:

```
┌─────────────────────────────────────────┐
│           Logging System                │
├─────────────────────────────────────────┤
│  Core Module (Framework Agnostic)       │
│  ├── Types & Interfaces                 │
│  ├── Base Classes                      │
│  ├── Factory Pattern                   │
│  ├── Utilities & Helpers               │
│  └── Security & Compliance            │
├─────────────────────────────────────────┤
│  Feature Module (React Integration)     │
│  ├── React Hooks                       │
│  ├── Components                        │
│  ├── Context Providers                 │
│  └── Error Boundaries                  │
└─────────────────────────────────────────┘
```

### Key Components

1. **Core Module** (`src/core/modules/logging/`)
   - Framework-agnostic logging infrastructure
   - Types, interfaces, and base classes
   - Factory pattern for dependency injection
   - Security and compliance features

2. **Feature Module** (`src/features/logging/`)
   - React-specific integration
   - Hooks and components
   - Context providers
   - Error boundaries

## Core Concepts

### Log Levels

The system supports standard and custom log levels:

| Level | Priority | Description |
|-------|----------|-------------|
| TRACE | 0 | Most detailed information |
| DEBUG | 10 | Detailed debugging information |
| INFO | 20 | General runtime information |
| AUDIT | 25 | Security and compliance events |
| WARN | 30 | Warning conditions |
| METRICS | 35 | Performance and business metrics |
| ERROR | 40 | Error conditions |
| SECURITY | 45 | Security-related events |
| FATAL | 50 | Critical system failures |

### Parameterized Logging

The system uses SLF4J-style parameterized logging for performance:

```typescript
// ✅ Efficient - only formats if level is enabled
logger.info('User {} logged in at {}', userId, timestamp);

// ❌ Inefficient - always formats
logger.info(`User ${userId} logged in at ${timestamp}`);
```

### Context Management

Rich context provides additional information for log entries:

```typescript
interface ILoggingContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  route?: string;
  userAgent?: string;
  environment?: string;
  additionalData?: Record<string, any>;
}
```

## Installation

The logging system is included in the core modules. No additional dependencies are required.

### Dependencies

The system uses only built-in browser APIs and standard JavaScript features:

- **No external dependencies** for core functionality
- **Optional dependencies** for specific features:
  - `axios` for remote appender (if needed)
  - React hooks for React integration

## Configuration

### Environment-Based Configuration

The system automatically detects the environment and applies appropriate settings:

```typescript
// Development
{
  defaultLevel: 'DEBUG',
  enableConsole: true,
  enableRemote: false,
  enableSanitization: false
}

// Production
{
  defaultLevel: 'WARN',
  enableConsole: false,
  enableRemote: true,
  enableSanitization: true
}
```

### Custom Configuration

```typescript
import { configureLogging } from '@/core/modules/logging';

configureLogging({
  defaultLevel: 'INFO',
  loggers: {
    'app.auth': {
      category: 'app.auth',
      level: 'DEBUG',
      appenders: ['console', 'remote']
    }
  },
  appenders: {
    remote: {
      type: 'remote',
      url: '/api/logs',
      throttling: {
        maxBatchSize: 100,
        maxInterval: 5000
      }
    }
  }
});
```

## Usage Examples

### Basic Logging

```typescript
const logger = getLogger('app.services.DataService');

// Simple logging
logger.info('Data service initialized');
logger.error('Failed to fetch data', error);

// With context
logger.info(
  { userId: 'user123', requestId: 'req-456' },
  'Data loaded successfully'
);
```

### Performance Monitoring

```typescript
// Automatic performance monitoring
const logger = getLogger('app.components.DataGrid');

const result = logger.withPerformanceMonitoring(
  () => processLargeDataset(data),
  'data-processing'
);

// Async performance monitoring
const result = await logger.withPerformanceMonitoringAsync(
  () => fetchUserData(userId),
  'user-fetch'
);
```

### Security Logging

```typescript
const securityLogger = getLogger('app.security');

securityLogger.security(
  { 
    userId: 'user123', 
    ip: '192.168.1.100',
    action: 'login_attempt' 
  },
  'Failed login attempt from IP {} for user {}',
  '192.168.1.100',
  'user123'
);
```

### React Integration

```typescript
import { useLogger, useLogRenders } from '@/features/logging/hooks';

function MyComponent({ userId }: { userId: string }) {
  const logger = useLogger({
    category: 'app.components.MyComponent',
    defaultContext: { userId }
  });

  const { stats } = useLogRenders({
    componentName: 'MyComponent',
    trackRenderTime: true,
    excessiveRenderThreshold: 10
  });

  useEffect(() => {
    logger.info('Component mounted', { userId });
  }, [userId]);

  return <div>My Component</div>;
}
```

### Error Boundary Integration

```typescript
import { LoggingErrorBoundary } from '@/features/logging/components';

function App() {
  return (
    <LoggingErrorBoundary logger={getLogger('app.root')}>
      <MyApp />
    </LoggingErrorBoundary>
  );
}
```

## API Reference

### Core Interfaces

#### ILogger

```typescript
interface ILogger {
  readonly category: string;
  readonly level: string;
  
  isEnabled(level: string): boolean;
  
  trace(context?: ILoggingContext, message?: string, ...args: any[]): void;
  debug(context?: ILoggingContext, message?: string, ...args: any[]): void;
  info(context?: ILoggingContext, message?: string, ...args: any[]): void;
  audit(context?: ILoggingContext, message?: string, ...args: any[]): void;
  warn(context?: ILoggingContext, message?: string, ...args: any[]): void;
  metrics(context?: ILoggingContext, message?: string, ...args: any[]): void;
  error(context?: ILoggingContext, message?: string, ...args: any[]): void;
  security(context?: ILoggingContext, message?: string, ...args: any[]): void;
  fatal(context?: ILoggingContext, message?: string, ...args: any[]): void;
  
  setLevel(level: string): void;
  addAppender(appender: IAppender): void;
  removeAppender(appender: IAppender): void;
  getAppenders(): IAppender[];
}
```

#### IAppender

```typescript
interface IAppender {
  readonly name: string;
  readonly layout: ILayout;
  readonly active: boolean;
  
  append(entry: ILogEntry): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  configure(config: IAppenderConfig): void;
  isReady(): boolean;
}
```

#### ILayout

```typescript
interface ILayout {
  readonly name: string;
  
  format(entry: ILogEntry): string;
  configure(config: ILayoutConfig): void;
  getContentType(): string;
}
```

### React Hooks

#### useLogger

```typescript
function useLogger(options: UseLoggerOptions): UseLoggerResult;

interface UseLoggerOptions {
  category: string;
  defaultContext?: ILoggingContext;
  enablePerformanceMonitoring?: boolean;
  autoComponentContext?: boolean;
}
```

#### useLogRenders

```typescript
function useLogRenders(options: UseLogRendersOptions): {
  stats: RenderStats;
  resetStats: () => void;
  logRenderInfo: () => void;
}
```

## Migration Guide

### From console.log

**Before:**
```typescript
console.log('User logged in:', userId);
console.error('API error:', error);
console.warn('Deprecated API used');
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.auth');

logger.info('User logged in: {}', userId);
logger.error('API error: {}', error.message);
logger.warn('Deprecated API used');
```

### From Custom Logger

**Before:**
```typescript
class CustomLogger {
  log(level: string, message: string) {
    console.log(`[${level}] ${message}`);
  }
}
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.custom');
logger.info(message);
```

### Migration Steps

1. **Identify Logging Points**
   - Search for `console.log`, `console.error`, `console.warn`
   - Find custom logging implementations
   - Locate error handling code

2. **Replace with Centralized Logger**
   - Import `getLogger`
   - Create category-specific loggers
   - Replace logging calls

3. **Add Context Information**
   - Add relevant context to log entries
   - Use parameterized logging
   - Include component/action information

4. **Configure Appenders**
   - Set up appropriate appenders for each environment
   - Configure remote logging for production
   - Enable security features as needed

## Best Practices

### Performance Optimization

1. **Use Parameterized Logging**
   ```typescript
   // ✅ Good
   logger.info('User {} logged in', userId);
   
   // ❌ Avoid
   logger.info(`User ${userId} logged in`);
   ```

2. **Check Log Levels**
   ```typescript
   // ✅ Good
   if (logger.isEnabled('DEBUG')) {
     logger.debug('Expensive debug info: {}', expensiveOperation());
   }
   ```

3. **Use Context Wisely**
   ```typescript
   // ✅ Good - relevant context
   logger.info('User action', { userId, action: 'login' });
   
   // ❌ Avoid - too much data
   logger.info('User action', { userId, entireStateObject });
   ```

### Security Best Practices

1. **Enable Sanitization in Production**
   ```typescript
   // Production configuration
   {
     security: {
       enableSanitization: true,
       sensitiveFields: ['password', 'token', 'secret']
     }
   }
   ```

2. **Use Security Level for Sensitive Events**
   ```typescript
   securityLogger.security(
     { userId, ip: clientIP },
     'Failed login attempt from {}',
     clientIP
   );
   ```

3. **Avoid Logging Sensitive Data**
   ```typescript
   // ✅ Good - sanitized
   logger.info('User authenticated', { userId: 'user123' });
   
   // ❌ Avoid - sensitive data
   logger.info('User authenticated', { password: 'secret123' });
   ```

### Error Handling

1. **Log Errors with Context**
   ```typescript
   try {
     await apiCall();
   } catch (error) {
     logger.error(
       { 
         component: 'DataService',
         action: 'apiCall',
         requestId: req.id 
       },
       'API call failed: {}',
       error.message
     );
   }
   ```

2. **Include Stack Traces**
   ```typescript
   logger.error(
     { component: 'Component', stackTrace: error.stack },
     'Component error: {}',
     error.message
   );
   ```

### React Integration

1. **Use Category-Specific Loggers**
   ```typescript
   const logger = useLogger({
     category: 'app.components.UserProfile',
     autoComponentContext: true
   });
   ```

2. **Monitor Performance**
   ```typescript
   const { stats } = useLogRenders({
     componentName: 'UserProfile',
     trackRenderTime: true
   });
   ```

3. **Handle Errors in Boundaries**
   ```typescript
   <LoggingErrorBoundary logger={getLogger('app.root')}>
     <MyComponent />
   </LoggingErrorBoundary>
   ```

## Troubleshooting

### Common Issues

#### Logger Not Working

**Problem:** Logger not outputting messages

**Solution:**
1. Check if logger level is enabled
2. Verify appenders are configured
3. Ensure logger is not disabled

```typescript
// Debug logging setup
const logger = getLogger('test');
console.log('Logger level:', logger.level);
console.log('Appenders:', logger.getAppenders().length);
console.log('Is DEBUG enabled:', logger.isEnabled('DEBUG'));
```

#### Performance Issues

**Problem:** Logging causing performance problems

**Solution:**
1. Enable lazy evaluation
2. Use parameterized logging
3. Check for excessive logging

```typescript
// Enable lazy evaluation
configureLogging({
  performance: {
    enableLazyEvaluation: true
  }
});
```

#### Security Issues

**Problem:** Sensitive data appearing in logs

**Solution:**
1. Enable sanitization
2. Configure sensitive fields
3. Use security level for sensitive events

```typescript
configureLogging({
  security: {
    enableSanitization: true,
    sensitiveFields: ['password', 'token', 'secret']
  }
});
```

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
// Enable debug logging
configureLogging({
  defaultLevel: 'DEBUG',
  appenders: {
    console: {
      type: 'console',
      active: true,
      layout: {
        type: 'pretty',
        includeColors: true
      }
    }
  }
});
```

### Performance Monitoring

Monitor logging performance:

```typescript
import { PerformanceUtils } from '@/core/modules/logging';

// Get performance stats
const stats = PerformanceUtils.getPerformanceSummary();
console.log('Performance stats:', stats);
```

## Support

For questions, issues, or contributions:

1. **Documentation:** Check this README and API reference
2. **Examples:** See `src/core/modules/logging/examples/`
3. **Tests:** Review test files for usage patterns
4. **Issues:** Create GitHub issues with detailed information

---

**Version:** 1.0.0  
**Last Updated:** 2023-01-01  
**Maintainer:** Logging Team
