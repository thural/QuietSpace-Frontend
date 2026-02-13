# Migration Guide

This guide helps you migrate from existing logging solutions to the centralized logging system.

## Table of Contents

- [Migration Overview](#migration-overview)
- [Pre-Migration Checklist](#pre-migration-checklist)
- [Step-by-Step Migration](#step-by-step-migration)
- [Common Migration Patterns](#common-migration-patterns)
- [Validation and Testing](#validation-and-testing)
- [Troubleshooting](#troubleshooting)

## Migration Overview

The centralized logging system provides a unified approach to logging across the entire application. This guide helps you migrate from:

- `console.log` statements
- Custom logging implementations
- Third-party logging libraries
- Inconsistent logging patterns

## Pre-Migration Checklist

### 1. Audit Existing Code

Search for existing logging patterns:

```bash
# Find console.log statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx"

# Find custom logger imports
grep -r "Logger\|logging" src/ --include="*.ts" --include="*.tsx"

# Find error handling patterns
grep -r "console\.error\|console\.warn" src/ --include="*.ts" --include="*.tsx"
```

### 2. Identify Logging Categories

Create a spreadsheet or document to track:

| Current Location | Category | Priority | Notes |
|----------------|----------|---------|-------|
| `console.log` | app.utils | High | General utility logging |
| `console.error` | app.auth | High | Authentication errors |
| CustomLogger | app.api | Medium | API logging |

### 3. Plan Migration Strategy

- **Phase 1**: Core modules (auth, network, api)
- **Phase 2**: Utility functions
- **Phase 3**: UI components
- **Phase 4**: Error handling

## Step-by-Step Migration

### Step 1: Install and Configure

1. **Import the logging system**
```typescript
import { getLogger, configureLogging } from '@/core/modules/logging';
```

2. **Set up basic configuration**
```typescript
// In your app initialization
configureLogging({
  defaultLevel: process.env.NODE_ENV === 'production' ? 'WARN' : 'INFO',
  loggers: {
    'app.root': {
      category: 'app.root',
      level: 'INFO',
      appenders: ['console']
    }
  }
});
```

### Step 2: Replace console.log Statements

#### Basic Replacement

**Before:**
```typescript
console.log('User logged in:', userId);
console.log('API response:', data);
console.log('Component mounted');
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.auth');
logger.info('User logged in: {}', userId);

const apiLogger = getLogger('app.api');
apiLogger.info('API response received: {}', JSON.stringify(data));

const componentLogger = getLogger('app.components');
componentLogger.info('Component mounted');
```

#### Error Logging Replacement

**Before:**
```typescript
console.error('API request failed:', error);
console.warn('Deprecated prop used:', propName);
```

**After:**
```typescript
const logger = getLogger('app.api');
logger.error('API request failed: {}', error.message);

const componentLogger = getLogger('app.components');
componentLogger.warn('Deprecated prop used: {}', propName);
```

### Step 3: Migrate Custom Loggers

#### Simple Custom Logger

**Before:**
```typescript
class MyLogger {
  log(level: string, message: string) {
    console.log(`[${level}] ${message}`);
  }
}

const logger = new MyLogger();
logger.log('INFO', 'Application started');
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.mylogger');
logger.info('Application started');
```

#### Advanced Custom Logger

**Before:**
```typescript
class AdvancedLogger {
  private context: any;
  
  constructor(context: any) {
    this.context = context;
  }
  
  info(message: string, data?: any) {
    console.log(`[${this.context.module}] INFO: ${message}`, data);
  }
  
  error(message: string, error: Error) {
    console.error(`[${this.context.module}] ERROR: ${message}`, error);
  }
}

const logger = new AdvancedLogger({ module: 'auth' });
logger.info('User authenticated', { userId });
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.auth');
logger.info('User authenticated', { userId });
logger.error('Authentication failed', error.message);
```

### Step 4: Add Context Information

#### Basic Context

**Before:**
```typescript
console.log('User action:', action);
console.log('API call:', endpoint);
```

**After:**
```typescript
const logger = getLogger('app.user');
logger.info('User action: {}', action);

const apiLogger = getLogger('app.api');
apiLogger.info('API call to {}', endpoint);
```

#### Rich Context

**Before:**
```typescript
console.log('User logged in', userId, timestamp, ip);
console.log('API error', error, endpoint, requestId);
```

**After:**
```typescript
const logger = getLogger('app.auth');
logger.info(
  { 
    userId, 
    action: 'login',
    timestamp: new Date().toISOString(),
    ip: clientIP 
  },
  'User logged in'
);

const apiLogger = getLogger('app.api');
apiLogger.error(
  { 
    endpoint, 
    requestId,
    error: error.message,
    statusCode: response.status 
  },
  'API error: {}',
  endpoint
);
```

### Step 5: Implement Parameterized Logging

#### String Concatenation

**Before:**
```typescript
console.log('User ' + userId + ' performed action ' + action + ' at ' + timestamp);
```

**After:**
```typescript
logger.info('User {} performed action {} at {}', userId, action, timestamp);
```

#### Template Literals

**Before:**
```typescript
console.log(`User ${userId} performed action ${action} at ${timestamp}`);
```

**After:**
```typescript
logger.info('User {} performed action {} at {}', userId, action, timestamp);
```

### Step 6: Migrate React Components

#### Class Components

**Before:**
```typescript
class MyComponent extends React.Component {
  componentDidMount() {
    console.log('MyComponent mounted');
  }
  
  handleClick() {
    console.log('Button clicked');
  }
  
  render() {
    return <div>My Component</div>;
  }
}
```

**After:**
```typescript
import { useLogger } from '@/features/logging/hooks';

class MyComponent extends React.Component {
  private logger = getLogger('app.components.MyComponent');
  
  componentDidMount() {
    this.logger.info('MyComponent mounted');
  }
  
  handleClick() {
    this.logger.info('Button clicked');
  }
  
  render() {
    return <div>My Component</div>;
  }
}
```

#### Functional Components

**Before:**
```typescript
function MyComponent() {
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return <button onClick={handleClick}>Click me</button>;
}
```

**After:**
```typescript
import { useLogger } from '@/features/logging/hooks';

function MyComponent() {
  const logger = useLogger({
    category: 'app.components.MyComponent',
    autoComponentContext: true
  });
  
  const handleClick = () => {
    logger.info('Button clicked');
  };
  
  useEffect(() => {
    logger.info('Component mounted');
  }, [logger]);
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Step 7: Migrate Error Handling

#### Try-Catch Blocks

**Before:**
```typescript
try {
  await apiCall();
} catch (error) {
  console.error('API call failed:', error);
}
```

**After:**
```typescript
const logger = getLogger('app.api');

try {
  await apiCall();
} catch (error) {
  logger.error('API call failed: {}', error.message);
}
```

#### Error Boundaries

**Before:**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    console.error('Component error:', error);
  }
}
```

**After:**
```typescript
import { LoggingErrorBoundary } from '@/features/logging/components';

class ErrorBoundary extends React.Component {
  private logger = getLogger('app.boundaries');
  
  componentDidCatch(error: Error) {
    this.logger.error('Component error: {}', error.message);
  }
}
```

## Common Migration Patterns

### 1. Service Layer Migration

**Before:**
```typescript
class UserService {
  async login(credentials: Credentials) {
    console.log('Login attempt for user:', credentials.username);
    try {
      const result = await api.login(credentials);
      console.log('Login successful');
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}
```

**After:**
```typescript
class UserService {
  private logger = getLogger('app.services.UserService');
  
  async login(credentials: Credentials) {
    this.logger.info('Login attempt for user: {}', credentials.username);
    try {
      const result = await api.login(credentials);
      this.logger.info('Login successful for user: {}', credentials.username);
      return result;
    } catch (error) {
      this.logger.error('Login failed for user {}: {}', credentials.username, error.message);
      throw error;
    }
  }
}
```

### 2. API Client Migration

**Before:**
```typescript
class ApiClient {
  async get(endpoint: string) {
    console.log(`GET ${endpoint}`);
    try {
      const response = await fetch(endpoint);
      console.log(`Response status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }
}
```

**After:**
```typescript
class ApiClient {
  private logger = getLogger('app.api.ApiClient');
  
  async get(endpoint: string) {
    this.logger.info('GET {}', endpoint);
    try {
      const response = await fetch(endpoint);
      this.logger.info('Response status: {} for {}', response.status, endpoint);
      return response.json();
    } catch (error) {
      this.logger.error('GET {} failed: {}', endpoint, error.message);
      throw error;
    }
  }
}
```

### 3. Utility Function Migration

**Before:**
```typescript
export function formatDate(date: Date): string {
  console.log('Formatting date:', date);
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  const isValid = email.includes('@');
  console.log('Email validation result:', isValid, 'for:', email);
  return isValid;
}
```

**After:**
```typescript
import { getLogger } from '@/core/modules/logging';

const logger = getLogger('app.utils');

export function formatDate(date: Date): string {
  logger.debug('Formatting date: {}', date.toISOString());
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  const isValid = email.includes('@');
  logger.debug('Email validation result: {} for {}', isValid, email);
  return isValid;
}
```

## Validation and Testing

### 1. Unit Testing

Test your migrated logging:

```typescript
describe('UserService Migration', () => {
  it('should log login attempts', () => {
    const logger = getLogger('app.services.UserService');
    const mockLogger = jest.mocked(logger);
    
    const userService = new UserService();
    userService.login({ username: 'test' });
    
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Login attempt for user: {}',
      'test'
    );
  });
});
```

### 2. Integration Testing

Test logging integration:

```typescript
describe('Logging Integration', () => {
  it('should log to console in development', () => {
    const logger = getLogger('test.integration');
    const consoleSpy = jest.spyOn(console, 'log');
    
    logger.info('Test message');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test message')
    );
  });
});
```

### 3. Performance Testing

Test logging performance:

```typescript
describe('Logging Performance', () => {
  it('should not impact performance significantly', () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      logger.info('Performance test message {}', i);
    }
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100); // Should be very fast
  });
});
```

## Troubleshooting

### Common Issues

#### Issue: Logger Not Outputting

**Problem:** Logger messages not appearing in console

**Solutions:**
1. Check log level configuration
2. Verify appenders are active
3. Ensure logging is not disabled

```typescript
// Debug logging setup
const logger = getLogger('test');
console.log('Logger level:', logger.level);
console.log('Appenders:', logger.getAppenders().length);
console.log('Is INFO enabled:', logger.isEnabled('INFO'));
```

#### Issue: Performance Degradation

**Problem:** Application slower after migration

**Solutions:**
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

// Check logging frequency
const stats = PerformanceUtils.getPerformanceSummary();
console.log('Logging stats:', stats);
```

#### Issue: Sensitive Data in Logs

**Problem:** Sensitive information appearing in logs

**Solutions:**
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

### Migration Validation

After migration, validate:

1. **All console.log statements replaced**
2. **Context information added**
3. **Parameterized logging used**
4. **Performance optimized**
5. **Security configured**

### Rollback Plan

If issues arise, you can temporarily rollback:

```typescript
// Temporary fallback
const logger = getLogger('app.fallback');
if (!logger.getAppenders().length) {
  // Fallback to console
  console.log('Fallback logging:', message);
}
```

## Support

For migration assistance:

1. **Review this guide** thoroughly
2. **Check examples** in `docs/logging/examples/`
3. **Run tests** to validate migration
4. **Monitor performance** after migration
5. **Check logs** for proper output

---

**Happy Migration!** 🚀
