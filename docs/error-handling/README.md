# Error Handling System Documentation

## Overview

This document provides comprehensive documentation for the centralized error handling system implemented in the QuietSpace Frontend application.

## Architecture

The error handling system follows a **Black Box pattern** with clean separation of concerns:

- **Core Module** (`src/core/modules/error/`): Framework-agnostic error handling infrastructure
- **Feature Module** (`src/features/error/`): UI-specific error handling components and features

## Quick Start

### Basic Error Handling

```typescript
import { errorHandler, createNetworkError } from '@/core/modules/error';

// Handle an error
const error = await errorHandler.handle(new Error('Something went wrong'));

// Create specific error types
const networkError = createNetworkError('Connection failed', 500, '/api/data');
```

### React Integration

```typescript
import { ErrorBoundary, useErrorHandler } from '@/features/error';

// Error boundary component
<ErrorBoundary onError={(error) => console.error(error)}>
  <MyComponent />
</ErrorBoundary>

// Error handling hook
const { error, handleError, clearError } = useErrorHandler({
  component: 'MyComponent',
  enableLogging: true
});
```

## Core Module Structure

### Types and Interfaces

The core module provides comprehensive type definitions:

```typescript
interface IError {
  id: string;
  message: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  recoverable: boolean;
  recoveryStrategy: ErrorRecoveryStrategy;
  userMessage: string;
  suggestedActions: string[];
  timestamp: Date;
  metadata: Record<string, any>;
  cause?: Error;
  context?: IErrorContext;
  toJSON(): Record<string, any>;
  copy(modifications?: Partial<IError>): IError;
}
```

### Error Categories

```typescript
enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RUNTIME = 'runtime',
  DEPENDENCY = 'dependency',
  SYSTEM = 'system',
  DATABASE = 'database',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}
```

### Error Severity Levels

```typescript
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### Error Classes

The system provides specialized error classes for each category:

#### Network Errors
```typescript
import { NetworkError, NetworkTimeoutError, NetworkAuthenticationError } from '@/core/modules/error';

// Network connection error
const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/data');

// Timeout error
const timeout = new NetworkTimeoutError('Request timeout', 30000, '/api/data');

// Authentication error
const authError = new NetworkAuthenticationError('Invalid token', 'bearer');
```

#### Validation Errors
```typescript
import { ValidationError, RequiredFieldError } from '@/core/modules/error';

// General validation error
const validation = new ValidationError('Invalid input', [
  { field: 'email', message: 'Invalid email format', value: 'invalid-email' }
]);

// Required field error
const required = new RequiredFieldError('name', 'Name is required');
```

#### Authentication Errors
```typescript
import { AuthenticationError, InvalidCredentialsError } from '@/core/modules/error';

// Authentication error
const auth = new AuthenticationError('Authentication failed', 'login', 'user123');

// Invalid credentials
const invalid = new InvalidCredentialsError('Invalid username or password');
```

#### System Errors
```typescript
import { SystemError, MemoryError, DatabaseError } from '@/core/modules/error';

// System error
const system = new SystemError('System failure', 'SystemService', 'initialize');

// Memory error
const memory = new MemoryError('Out of memory', 1024, 2048);

// Database error
const db = new DatabaseError('Database connection failed', 'postgres', 'connect');
```

## Error Factory

The error factory provides a unified way to create errors:

```typescript
import { errorFactory } from '@/core/modules/error';

// Create errors using factory
const networkError = errorFactory.createNetworkError('Connection failed', 500, '/api/data');
const validationError = errorFactory.createValidationError('Invalid email', 'email', 'invalid-email');
const authError = errorFactory.createAuthenticationError('Login failed', 'oauth');
```

### Factory Functions

```typescript
import { 
  createNetworkError,
  createValidationError,
  createAuthenticationError,
  createSystemError
} from '@/core/modules/error';

// Convenience functions
const error = createNetworkError('Connection failed', 500, '/api/data');
```

## Error Handler

The error handler provides centralized error management:

```typescript
import { errorHandler } from '@/core/modules/error';

// Handle errors
const error = await errorHandler.handle(new Error('Something went wrong'), {
  component: 'MyComponent',
  action: 'fetchData'
});

// Get statistics
const stats = errorHandler.getStatistics();

// Subscribe to events
const unsubscribe = errorHandler.subscribe('error_occurred', (event) => {
  console.log('Error occurred:', event.error);
});
```

## Error Utilities

The system provides utility functions for common operations:

```typescript
import { 
  isCriticalError,
  isRecoverableError,
  combineErrors,
  getErrorSummary,
  formatErrorForDisplay
} from '@/core/modules/error';

// Check error properties
if (isCriticalError(error)) {
  // Handle critical error
}

if (isRecoverableError(error)) {
  // Attempt recovery
}

// Combine multiple errors
const combined = combineErrors([error1, error2, error3]);

// Get error summary
const summary = getErrorSummary(error);

// Format for display
const formatted = formatErrorForDisplay(error);
```

## Error Logger

The error logger provides structured logging:

```typescript
import { errorLogger } from '@/core/modules/error';

// Log errors
errorLogger.log(error, { component: 'MyComponent', action: 'fetchData' });

// Log warnings
errorLogger.warn('Deprecated API used', { component: 'MyComponent' });

// Set log level
errorLogger.setLevel('error');

// Get log entries
const logs = errorLogger.getEntries(100);
```

## Feature Module Components

### Error Boundary

The error boundary component catches React errors:

```typescript
import { ErrorBoundary } from '@/features/error';

<ErrorBoundary
  onError={(error, errorInfo) => console.error(error)}
  onRecovery={(error, success) => console.log('Recovery:', success)}
  maxRecoveryAttempts={3}
  enableReporting={true}
>
  <MyComponent />
</ErrorBoundary>
```

### Error Display Components

#### Error Alert
```typescript
import { ErrorAlert } from '@/features/error';

<ErrorAlert
  error={error}
  autoDismiss={true}
  autoDismissDelay={5000}
  position="top-right"
  showProgress={true}
  onDismiss={() => console.log('Dismissed')}
/>
```

#### Error Modal
```typescript
import { ErrorModal } from '@/features/error';

<ErrorModal
  error={error}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onRetry={() => retryOperation()}
  showRetryButton={true}
  showReportButton={true}
/>
```

#### Error Toast
```typescript
import { ErrorToast, useErrorToastContainer } from '@/features/error';

const { toasts, addToast, removeToast } = useErrorToastContainer();

// Add toast
addToast(error);

// Render container
<ErrorToastContainer
  toasts={toasts}
  onRemoveToast={removeToast}
  position="top-right"
/>
```

### React Hooks

#### useErrorHandler Hook
```typescript
import { useErrorHandler } from '@/features/error';

const MyComponent = () => {
  const { error, handleError, clearError, retry } = useErrorHandler({
    component: 'MyComponent',
    action: 'fetchData',
    enableLogging: true,
    onError: (error) => console.error(error)
  });

  const fetchData = async () => {
    try {
      const data = await api.getData();
      return data;
    } catch (err) {
      await handleError(err);
    }
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error.userMessage}</p>
          <button onClick={retry}>Retry</button>
          <button onClick={clearError}>Clear</button>
        </div>
      )}
    </div>
  );
};
```

#### useAsyncErrorHandler Hook
```typescript
import { useAsyncErrorHandler } from '@/features/error';

const MyComponent = () => {
  const { data, loading, execute, error } = useAsyncErrorHandler(
    () => api.getData(),
    { component: 'MyComponent' }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.userMessage}</div>;
  return <div>Data: {JSON.stringify(data)}</div>;
};
```

## Migration Guide

### From Generic Errors

**Before:**
```typescript
throw new Error('Something went wrong');
```

**After:**
```typescript
throw createSystemError('Something went wrong', 'MyComponent', 'myOperation');
```

### From Custom Error Classes

**Before:**
```typescript
class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MyError';
  }
}
```

**After:**
```typescript
const error = createSystemError('Something went wrong', 'MyComponent', 'myOperation');
```

### From Try-Catch Blocks

**Before:**
```typescript
try {
  await operation();
} catch (error) {
  console.error(error);
  throw error;
}
```

**After:**
```typescript
try {
  await operation();
} catch (error) {
  await errorHandler.handle(error, {
    component: 'MyComponent',
    action: 'operation'
  });
  throw createSystemError('Operation failed', 'MyComponent', 'operation');
}
```

## Best Practices

### 1. Use Specific Error Types

```typescript
// Good
throw createNetworkError('API request failed', 500, '/api/data');

// Avoid
throw new Error('API request failed');
```

### 2. Provide Context

```typescript
// Good
await errorHandler.handle(error, {
  component: 'UserService',
  action: 'fetchUser',
  userId: '123'
});

// Avoid
await errorHandler.handle(error);
```

### 3. Use Error Boundaries

```typescript
// Good
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// Avoid
<MyComponent /> // No error boundary
```

### 4. Handle Recoverable Errors

```typescript
// Good
if (error.recoverable) {
  const success = await errorHandler.recover(error);
  if (success) {
    return; // Recovery successful
  }
}

// Avoid
if (error) {
  throw error; // Always re-throw
}
```

### 5. Log Errors Appropriately

```typescript
// Good
errorLogger.log(error, {
  component: 'MyComponent',
  action: 'fetchData',
  userId: '123'
});

// Avoid
console.error(error); // No context
```

## Configuration

### Error Handler Configuration

```typescript
import { ErrorHandler } from '@/core/modules/error';

const customHandler = new ErrorHandler({
  maxHistorySize: 1000,
  classificationService: customClassificationService
});
```

### Error Logger Configuration

```typescript
import { errorLogger } from '@/core/modules/error';

errorLogger.setLevel('error');
```

## Testing

### Unit Testing Error Classes

```typescript
import { NetworkError } from '@/core/modules/error';

describe('NetworkError', () => {
  it('should create network error with correct properties', () => {
    const error = new NetworkError('Connection failed', 'NETWORK_ERROR', 500, '/api/data');
    
    expect(error.category).toBe('network');
    expect(error.severity).toBe('medium');
    expect(error.recoverable).toBe(true);
    expect(error.statusCode).toBe(500);
    expect(error.endpoint).toBe('/api/data');
  });
});
```

### Testing Error Handler

```typescript
import { errorHandler } from '@/core/modules/error';

describe('ErrorHandler', () => {
  it('should handle errors correctly', async () => {
    const error = await errorHandler.handle(new Error('Test error'));
    
    expect(error).toBeDefined();
    expect(error.message).toBe('Test error');
    expect(error.id).toBeDefined();
    expect(error.timestamp).toBeInstanceOf(Date);
  });
});
```

### Testing React Components

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/features/error';

describe('ErrorBoundary', () => {
  it('should catch and display errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

### Error Creation

- Use factory functions for better performance
- Avoid creating unnecessary error objects
- Reuse error instances when possible

### Error Logging

- Use appropriate log levels
- Avoid logging sensitive information
- Consider log rotation for production

### Error Recovery

- Implement exponential backoff for retries
- Limit retry attempts to prevent infinite loops
- Use circuit breakers for external services

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure proper imports and type definitions
2. **Missing Context**: Always provide error context for better debugging
3. **Infinite Retries**: Implement proper retry limits and backoff strategies
4. **Memory Leaks**: Clean up error listeners and subscriptions

### Debugging Tips

1. Use error statistics to identify patterns
2. Check error history for recurring issues
3. Monitor error recovery success rates
4. Use error boundaries to isolate problematic components

## API Reference

### Core Module API

- [Error Types](./api/types.md)
- [Error Classes](./api/classes.md)
- [Error Factory](./api/factory.md)
- [Error Handler](./api/handler.md)
- [Error Utilities](./api/utils.md)

### Feature Module API

- [React Components](./api/components.md)
- [React Hooks](./api/hooks.md)

## Support

For questions or issues related to the error handling system:

1. Check this documentation first
2. Review the API reference
3. Look at the example implementations
4. Check the troubleshooting section

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and changes.
