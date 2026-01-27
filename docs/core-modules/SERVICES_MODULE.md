# Services Module Documentation

## Overview

The Services module provides an enterprise-grade logging system with comprehensive features including structured logging, multiple output targets, performance monitoring, and perfect Black Box architecture compliance. It serves as the central logging infrastructure for all other core modules.

## Architecture

### Black Box Pattern Implementation

The Services module follows the **Black Box pattern** with:
- **Clean Public API**: Only interfaces and factory functions exported
- **Hidden Implementation**: Internal logger classes and targets encapsulated
- **Factory Pattern**: Clean logger creation with pre-configured setups
- **Type Safety**: Full TypeScript support with generic log entries

### Module Structure

```
src/core/services/
├── interfaces.ts           # Public interfaces and types
├── factory.ts             # Factory functions for logger creation
├── targets/               # Log output targets
├── formatters/            # Log formatting utilities
├── utils.ts               # Utility functions
└── index.ts              # Clean public API exports
```

## Core Interfaces

### ILoggerService

The main logger service interface:

```typescript
interface ILoggerService {
    // Basic logging methods
    debug(message: string, meta?: Record<string, any>): void;
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, error?: Error, meta?: Record<string, any>): void;
    fatal(message: string, error?: Error, meta?: Record<string, any>): void;
    
    // Structured logging
    log(entry: ILogEntry): void;
    logWithLevel(level: LogLevel, message: string, meta?: Record<string, any>): void;
    
    // Configuration
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    updateConfig(config: Partial<ILoggerConfig>): void;
    getConfig(): ILoggerConfig;
    
    // Context
    setContext(context: Partial<ILoggerContext>): void;
    getContext(): ILoggerContext;
    clearContext(): void;
    
    // Performance
    time(label: string): () => void;
    timer(label: string): LoggerTimer;
    
    // Lifecycle
    dispose(): Promise<void>;
}
```

### Data Types

```typescript
interface ILogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    meta?: Record<string, any>;
    context?: ILoggerContext;
    error?: Error;
    duration?: number;
    tags?: string[];
}

interface ILoggerConfig {
    level: LogLevel;
    targets: ILoggerTarget[];
    format: LogFormat;
    enableColors: boolean;
    enableTimestamps: boolean;
    enableMetadata: boolean;
    maxLogSize: number;
    bufferSize: number;
    flushInterval: number;
}

interface ILoggerTarget {
    name: string;
    minLevel: LogLevel;
    format: LogFormat;
    write(entry: ILogEntry): Promise<void>;
    flush?(): Promise<void>;
    dispose?(): Promise<void>;
}

interface ILoggerContext {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    component?: string;
    version?: string;
    environment?: string;
    [key: string]: any;
}

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

enum LogFormat {
    JSON = 'json',
    TEXT = 'text',
    STRUCTURED = 'structured'
}

interface ILoggerMetrics {
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    averageLogSize: number;
    errorRate: number;
    lastLogTime: Date;
    bufferUtilization: number;
}

interface LoggerTimer {
    start: number;
    label: string;
    end(): number;
}
```

## Factory Functions

### Basic Logger Creation

```typescript
import { 
    createLogger,
    createDefaultLogger,
    createComponentLogger 
} from '@/core/services';

// Create with custom configuration
const logger = createLogger({
    level: LogLevel.INFO,
    targets: [
        {
            name: 'console',
            minLevel: LogLevel.DEBUG,
            format: LogFormat.TEXT,
            write: async (entry) => {
                console.log(formatLogEntry(entry));
            }
        }
    ],
    format: LogFormat.TEXT,
    enableColors: true,
    enableTimestamps: true
});

// Create with default configuration
const defaultLogger = createDefaultLogger();

// Create component-specific logger
const componentLogger = createComponentLogger('UserService', {
    level: LogLevel.DEBUG,
    targets: [
        createConsoleTarget({ minLevel: LogLevel.DEBUG }),
        createFileTarget({ 
            filename: 'logs/user-service.log',
            minLevel: LogLevel.INFO 
        })
    ]
});
```

### Advanced Logger Creation

```typescript
import { 
    createLoggerWithLevel,
    createStructuredLogger,
    createLoggerFromDI 
} from '@/core/services';

// Create with specific log level
const debugLogger = createLoggerWithLevel(LogLevel.DEBUG);

// Create structured logger
const structuredLogger = createStructuredLogger({
    targets: [
        createConsoleTarget({
            format: LogFormat.STRUCTURED,
            enableColors: true
        }),
        createRemoteTarget({
            url: 'https://logs.example.com/api/logs',
            apiKey: 'your-api-key',
            batchSize: 100,
            flushInterval: 5000
        })
    ]
});

// Create using DI container
const container = new Container();
const diLogger = createLoggerFromDI(container, {
    level: LogLevel.INFO
});
```

### Target Creation

```typescript
import { 
    createConsoleTarget,
    createFileTarget,
    createRemoteTarget,
    createCustomTarget 
} from '@/core/services';

// Console target
const consoleTarget = createConsoleTarget({
    name: 'console',
    minLevel: LogLevel.DEBUG,
    format: LogFormat.TEXT,
    enableColors: true,
    enableTimestamps: true
});

// File target
const fileTarget = createFileTarget({
    name: 'file',
    filename: 'logs/app.log',
    minLevel: LogLevel.INFO,
    format: LogFormat.JSON,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    rotationInterval: 86400000 // 24 hours
});

// Remote target
const remoteTarget = createRemoteTarget({
    name: 'remote',
    url: 'https://logs.example.com/api/logs',
    apiKey: 'your-api-key',
    minLevel: LogLevel.WARN,
    format: LogFormat.JSON,
    batchSize: 50,
    flushInterval: 3000,
    retryAttempts: 3,
    timeout: 5000
});

// Custom target
const customTarget = createCustomTarget({
    name: 'custom',
    minLevel: LogLevel.INFO,
    write: async (entry) => {
        // Custom logging logic
        await sendToCustomService(entry);
    }
});
```

## Usage Patterns

### Basic Logging

```typescript
import { createDefaultLogger } from '@/core/services';

const logger = createDefaultLogger();

// Basic logging
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.fatal('Fatal error message');

// Logging with metadata
logger.info('User logged in', {
    userId: '123',
    email: 'user@example.com',
    timestamp: new Date().toISOString()
});

// Logging with errors
try {
    await riskyOperation();
} catch (error) {
    logger.error('Operation failed', error, {
        operation: 'riskyOperation',
        userId: '123'
    });
}
```

### Structured Logging

```typescript
import { createStructuredLogger } from '@/core/services';

const logger = createStructuredLogger();

// Structured log entry
logger.log({
    timestamp: new Date(),
    level: LogLevel.INFO,
    message: 'User action completed',
    meta: {
        userId: '123',
        action: 'purchase',
        productId: '456',
        amount: 99.99,
        currency: 'USD'
    },
    context: {
        component: 'OrderService',
        sessionId: 'abc-123',
        requestId: 'req-456'
    },
    tags: ['user-action', 'purchase']
});

// Using logWithLevel
logger.logWithLevel(LogLevel.WARN, 'High value purchase', {
    amount: 999.99,
    userId: '123'
});
```

### Context Management

```typescript
import { createComponentLogger } from '@/core/services';

const logger = createComponentLogger('UserService');

// Set context
logger.setContext({
    userId: '123',
    sessionId: 'abc-123',
    requestId: 'req-456',
    component: 'UserService'
});

// All logs will include context
logger.info('Fetching user profile');
// Output: { timestamp: "...", level: "INFO", message: "Fetching user profile", context: { userId: "123", sessionId: "abc-123", requestId: "req-456", component: "UserService" } }

// Update context
logger.setContext({
    userId: '456' // Update only userId, keep other context
});

// Clear context
logger.clearContext();

// Get current context
const context = logger.getContext();
console.log('Current context:', context);
```

### Performance Monitoring

```typescript
import { createDefaultLogger } from '@/core/services';

const logger = createDefaultLogger();

// Simple timing
const endTimer = logger.time('database-query');
await performDatabaseQuery();
const duration = endTimer(); // Returns duration in ms
logger.info('Database query completed', { duration });

// Using timer object
const timer = logger.timer('api-request');
try {
    const response = await makeApiRequest();
    const duration = timer.end();
    logger.info('API request successful', { 
        duration,
        status: response.status 
    });
} catch (error) {
    const duration = timer.end();
    logger.error('API request failed', error, { duration });
}

// Performance logging
function createPerformanceLogger(componentName: string) {
    const logger = createComponentLogger(componentName);
    
    return {
        async measure<T>(
            operation: string,
            fn: () => Promise<T>,
            meta?: Record<string, any>
        ): Promise<T> {
            const endTimer = logger.time(operation);
            try {
                const result = await fn();
                const duration = endTimer();
                logger.info(`${operation} completed`, {
                    duration,
                    operation,
                    ...meta
                });
                return result;
            } catch (error) {
                const duration = endTimer();
                logger.error(`${operation} failed`, error, {
                    duration,
                    operation,
                    ...meta
                });
                throw error;
            }
        }
    };
}

// Usage
const perfLogger = createPerformanceLogger('UserService');
const user = await perfLogger.measure('getUser', () => 
    userRepository.findById('123'), 
    { userId: '123' }
);
```

### Component-Specific Logging

```typescript
import { createComponentLogger } from '@/core/services';

class UserService {
    private logger = createComponentLogger('UserService', {
        level: LogLevel.DEBUG,
        targets: [
            createConsoleTarget({ minLevel: LogLevel.DEBUG }),
            createFileTarget({ 
                filename: 'logs/user-service.log',
                minLevel: LogLevel.INFO 
            })
        ]
    });
    
    async createUser(userData: CreateUserRequest): Promise<User> {
        this.logger.debug('Creating user', { userData });
        
        try {
            const user = await this.userRepository.create(userData);
            
            this.logger.info('User created successfully', {
                userId: user.id,
                email: user.email
            });
            
            return user;
        } catch (error) {
            this.logger.error('Failed to create user', error, {
                userData: {
                    email: userData.email,
                    // Don't log sensitive data
                }
            });
            throw error;
        }
    }
    
    async updateUser(id: string, updates: Partial<User>): Promise<User> {
        const timer = this.logger.timer('update-user');
        
        try {
            const user = await this.userRepository.update(id, updates);
            const duration = timer.end();
            
            this.logger.info('User updated successfully', {
                userId: id,
                updatedFields: Object.keys(updates),
                duration
            });
            
            return user;
        } catch (error) {
            const duration = timer.end();
            this.logger.error('Failed to update user', error, {
                userId: id,
                duration
            });
            throw error;
        }
    }
}
```

## Advanced Features

### Multiple Targets

```typescript
import { createLogger, createConsoleTarget, createFileTarget, createRemoteTarget } from '@/core/services';

const logger = createLogger({
    level: LogLevel.DEBUG,
    targets: [
        // Console for development
        createConsoleTarget({
            name: 'console',
            minLevel: LogLevel.DEBUG,
            format: LogFormat.TEXT,
            enableColors: true
        }),
        
        // File for persistence
        createFileTarget({
            name: 'file',
            filename: 'logs/app.log',
            minLevel: LogLevel.INFO,
            format: LogFormat.JSON,
            maxFileSize: 50 * 1024 * 1024, // 50MB
            maxFiles: 10
        }),
        
        // Remote for monitoring
        createRemoteTarget({
            name: 'remote',
            url: 'https://logs.example.com/api/logs',
            apiKey: process.env.LOG_API_KEY,
            minLevel: LogLevel.WARN,
            format: LogFormat.JSON,
            batchSize: 100,
            flushInterval: 5000
        })
    ]
});
```

### Log Filtering and Routing

```typescript
import { createLogger, createCustomTarget } from '@/core/services';

const logger = createLogger({
    level: LogLevel.DEBUG,
    targets: [
        // Route debug logs to debug target
        createCustomTarget({
            name: 'debug',
            minLevel: LogLevel.DEBUG,
            maxLevel: LogLevel.DEBUG,
            write: async (entry) => {
                if (entry.meta?.component === 'UserService') {
                    await sendToDebugService(entry);
                }
            }
        }),
        
        // Route error logs to error tracking
        createCustomTarget({
            name: 'error-tracking',
            minLevel: LogLevel.ERROR,
            write: async (entry) => {
                await sendToErrorTracking(entry);
            }
        }),
        
        // Route performance logs to metrics
        createCustomTarget({
            name: 'metrics',
            minLevel: LogLevel.INFO,
            write: async (entry) => {
                if (entry.duration) {
                    await recordMetric(entry);
                }
            }
        })
    ]
});
```

### Log Formatting

```typescript
import { createLogger, LogFormat, formatLogEntry } from '@/core/services';

const logger = createLogger({
    level: LogLevel.INFO,
    format: LogFormat.JSON,
    targets: [
        createCustomTarget({
            name: 'custom-formatter',
            minLevel: LogLevel.DEBUG,
            write: async (entry) => {
                // Custom formatting
                const formatted = formatLogEntry(entry, {
                    template: '[{timestamp}] {level} [{component}] {message} {meta}',
                    datePattern: 'YYYY-MM-DD HH:mm:ss.SSS',
                    colors: {
                        debug: 'gray',
                        info: 'blue',
                        warn: 'yellow',
                        error: 'red',
                        fatal: 'magenta'
                    }
                });
                
                console.log(formatted);
            }
        })
    ]
});
```

### Buffering and Batching

```typescript
import { createRemoteTarget } from '@/core/services';

const remoteTarget = createRemoteTarget({
    name: 'remote',
    url: 'https://logs.example.com/api/logs',
    apiKey: 'your-api-key',
    minLevel: LogLevel.INFO,
    
    // Buffer configuration
    bufferSize: 1000,
    flushInterval: 5000,
    maxWaitTime: 30000,
    
    // Batch configuration
    batchSize: 50,
    batchTimeout: 2000,
    
    // Retry configuration
    retryAttempts: 3,
    retryDelay: 1000,
    
    // Compression
    compression: true,
    
    // Async write with callback
    write: async (entry) => {
        // This will be called by the target's internal buffering logic
        return await sendToRemoteService(entry);
    }
});
```

## React Integration

### Logger Hook

```typescript
import { useState, useEffect, useCallback } from 'react';
import { createComponentLogger } from '@/core/services';

function useLogger(componentName: string, config?: Partial<ILoggerConfig>) {
    const [logger] = useState(() => 
        createComponentLogger(componentName, config)
    );
    
    const logAction = useCallback((
        level: LogLevel,
        action: string,
        meta?: Record<string, any>
    ) => {
        logger.logWithLevel(level, action, {
            component: componentName,
            timestamp: new Date().toISOString(),
            ...meta
        });
    }, [logger, componentName]);
    
    const logError = useCallback((
        action: string,
        error: Error,
        meta?: Record<string, any>
    ) => {
        logger.error(action, error, {
            component: componentName,
            ...meta
        });
    }, [logger, componentName]);
    
    const logPerformance = useCallback((
        action: string,
        duration: number,
        meta?: Record<string, any>
    ) => {
        logger.info(`${action} completed`, {
            component: componentName,
            duration,
            ...meta
        });
    }, [logger, componentName]);
    
    return {
        logger,
        logAction,
        logError,
        logPerformance,
        debug: (action: string, meta?: Record<string, any>) => 
            logAction(LogLevel.DEBUG, action, meta),
        info: (action: string, meta?: Record<string, any>) => 
            logAction(LogLevel.INFO, action, meta),
        warn: (action: string, meta?: Record<string, any>) => 
            logAction(LogLevel.WARN, action, meta),
        error: logError
    };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
    const logger = useLogger('UserProfile');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const timer = logger.logger.time('fetch-user');
        
        setLoading(true);
        logger.info('Fetching user profile', { userId });
        
        fetchUser(userId)
            .then(user => {
                const duration = timer();
                setUser(user);
                logger.logPerformance('fetch-user', duration, { userId });
            })
            .catch(error => {
                const duration = timer();
                logger.logError('Failed to fetch user', error, { userId, duration });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId, logger]);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;
    
    return <div>{user.name}</div>;
}
```

### Error Boundary with Logging

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createComponentLogger } from '@/core/services';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    private logger = createComponentLogger('ErrorBoundary');
    
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.logger.fatal('React error boundary triggered', error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: 'ErrorBoundary'
        });
    }
    
    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div>
                    <h2>Something went wrong.</h2>
                    <details>
                        {this.state.error?.message}
                    </details>
                </div>
            );
        }
        
        return this.props.children;
    }
}
```

## Configuration

### Environment-Specific Configuration

```typescript
import { createLogger, LogLevel, createConsoleTarget, createFileTarget, createRemoteTarget } from '@/core/services';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
    level: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
    
    targets: [
        // Always include console
        createConsoleTarget({
            name: 'console',
            minLevel: isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
            format: isDevelopment ? LogFormat.TEXT : LogFormat.JSON,
            enableColors: isDevelopment
        }),
        
        // File logging for all environments
        ...(isProduction ? [
            createFileTarget({
                name: 'file',
                filename: 'logs/app.log',
                minLevel: LogLevel.INFO,
                format: LogFormat.JSON,
                maxFileSize: 100 * 1024 * 1024, // 100MB
                maxFiles: 30
            })
        ] : [
            createFileTarget({
                name: 'file',
                filename: 'logs/dev.log',
                minLevel: LogLevel.DEBUG,
                format: LogFormat.TEXT
            })
        ]),
        
        // Remote logging for production
        ...(isProduction ? [
            createRemoteTarget({
                name: 'remote',
                url: process.env.LOG_REMOTE_URL,
                apiKey: process.env.LOG_API_KEY,
                minLevel: LogLevel.WARN,
                format: LogFormat.JSON,
                batchSize: 100,
                flushInterval: 10000
            })
        ] : [])
    ],
    
    format: isDevelopment ? LogFormat.TEXT : LogFormat.JSON,
    enableColors: isDevelopment,
    enableTimestamps: true,
    enableMetadata: true
});
```

### Configuration Files

```typescript
// config/logger/logger.config.ts
export const loggerConfig = {
    development: {
        level: LogLevel.DEBUG,
        targets: [
            {
                type: 'console',
                minLevel: LogLevel.DEBUG,
                format: LogFormat.TEXT,
                enableColors: true
            },
            {
                type: 'file',
                filename: 'logs/dev.log',
                minLevel: LogLevel.DEBUG,
                format: LogFormat.TEXT
            }
        ]
    },
    
    production: {
        level: LogLevel.INFO,
        targets: [
            {
                type: 'console',
                minLevel: LogLevel.WARN,
                format: LogFormat.JSON,
                enableColors: false
            },
            {
                type: 'file',
                filename: 'logs/app.log',
                minLevel: LogLevel.INFO,
                format: LogFormat.JSON,
                maxFileSize: 100 * 1024 * 1024,
                maxFiles: 30
            },
            {
                type: 'remote',
                url: process.env.LOG_REMOTE_URL,
                apiKey: process.env.LOG_API_KEY,
                minLevel: LogLevel.WARN,
                format: LogFormat.JSON,
                batchSize: 100,
                flushInterval: 10000
            }
        ]
    }
};

export const getLoggerConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return loggerConfig[env as keyof typeof loggerConfig];
};
```

## Best Practices

### Structured Logging

```typescript
// Good: Structured logging with consistent metadata
logger.info('User action completed', {
    userId: '123',
    action: 'purchase',
    productId: '456',
    amount: 99.99,
    currency: 'USD',
    timestamp: new Date().toISOString()
});

// Bad: Unstructured message
logger.info('User 123 purchased product 456 for $99.99');
```

### Error Logging

```typescript
// Good: Include error object and context
try {
    await processPayment(paymentData);
} catch (error) {
    logger.error('Payment processing failed', error, {
        userId: paymentData.userId,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        attempt: retryCount
    });
}

// Bad: Only log message
logger.error('Payment failed');
```

### Performance Logging

```typescript
// Good: Use timing for performance monitoring
const timer = logger.timer('database-query');
try {
    const result = await database.query(sql);
    const duration = timer.end();
    logger.info('Database query completed', {
        query: sql,
        duration,
        resultCount: result.length
    });
} catch (error) {
    const duration = timer.end();
    logger.error('Database query failed', error, {
        query: sql,
        duration
    });
}
```

### Component Logging

```typescript
// Good: Component-specific logger with context
class UserService {
    private logger = createComponentLogger('UserService');
    
    constructor() {
        this.logger.setContext({
            version: '1.0.0',
            environment: process.env.NODE_ENV
        });
    }
    
    async createUser(userData: CreateUserRequest): Promise<User> {
        this.logger.setContext({ 
            operation: 'createUser',
            userId: userData.id 
        });
        
        try {
            const user = await this.userRepository.create(userData);
            this.logger.info('User created successfully', {
                userId: user.id,
                email: user.email
            });
            return user;
        } catch (error) {
            this.logger.error('Failed to create user', error);
            throw error;
        } finally {
            this.logger.clearContext();
        }
    }
}
```

## Testing

### Mock Logger

```typescript
import { createMockLogger } from '@/core/services';

// Create mock logger for testing
const mockLogger = createMockLogger();

// Use in tests
test('should log user creation', () => {
    const userService = new UserService(mockLogger);
    
    userService.createUser({ name: 'Test User', email: 'test@example.com' });
    
    expect(mockLogger.info).toHaveBeenCalledWith(
        'User created successfully',
        expect.objectContaining({
            userId: expect.any(String),
            email: 'test@example.com'
        })
    );
});
```

### Log Testing

```typescript
import { createLogger, createMemoryTarget } from '@/core/services';

test('should log to memory target', async () => {
    const memoryTarget = createMemoryTarget();
    const logger = createLogger({
        targets: [memoryTarget]
    });
    
    logger.info('Test message', { key: 'value' });
    
    const logs = memoryTarget.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test message');
    expect(logs[0].meta?.key).toBe('value');
});
```

## Migration Guide

### From Console.log

**Before (console.log):**
```typescript
console.log('User logged in:', user);
console.error('Error:', error);
```

**After (services module):**
```typescript
import { createDefaultLogger } from '@/core/services';

const logger = createDefaultLogger();
logger.info('User logged in', { user });
logger.error('Error occurred', error);
```

### From Other Logging Libraries

**Before (winston):**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});
```

**After (services module):**
```typescript
import { createLogger, createConsoleTarget, LogFormat } from '@/core/services';

const logger = createLogger({
    level: LogLevel.INFO,
    targets: [
        createConsoleTarget({
            format: LogFormat.JSON
        })
    ]
});
```

## Troubleshooting

### Common Issues

1. **Logs Not Appearing**: Check log level and target configuration
2. **Performance Issues**: Reduce log level or use async targets
3. **Memory Issues**: Configure proper buffer sizes and flush intervals
4. **File Permissions**: Ensure log directory is writable

### Debug Mode

```typescript
import { createLogger, LogLevel } from '@/core/services';

const logger = createLogger({
    level: LogLevel.DEBUG,
    targets: [
        createConsoleTarget({
            minLevel: LogLevel.DEBUG,
            format: LogFormat.TEXT,
            enableColors: true
        })
    ],
    debug: true
});

// Enable debug logging for specific component
logger.setContext({ debug: true });
```

## Version Information

- **Current Version**: 1.0.0
- **Black Box Compliance**: 95%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive
- **Log Formats**: JSON, Text, Structured

## Dependencies

- TypeScript - Type safety
- Node.js File System - File logging (polyfilled for browsers)

## Related Modules

- **All Core Modules**: All modules use the services module for logging
- **DI Module**: For dependency injection integration
- **Network Module**: For remote logging targets
