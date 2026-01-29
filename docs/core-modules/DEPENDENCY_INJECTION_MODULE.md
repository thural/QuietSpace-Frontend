# Dependency Injection Module Documentation

## Overview

The Dependency Injection (DI) module provides an enterprise-grade IoC container system inspired by Flutter patterns. It offers comprehensive dependency management, service lifetime control, and perfect BlackBox architecture compliance for scalable application architecture.

## Architecture

### Facade Pattern Implementation

The DI module follows the **Facade pattern** with:
- **Clean Public API**: Only interfaces, factory functions, and decorators exported
- **Hidden Implementation**: Internal container and registry classes encapsulated
- **Factory Pattern**: Clean container creation with pre-configured setups
- **Type Safety**: Full TypeScript support with generic constraints

### Module Structure

```
src/core/di/
├── container/               # Container implementation
├── registry/               # Service registry
├── decorators/             # DI decorators
├── providers/              # React providers
├── factory/                # Factory functions
├── types/                  # Type definitions
└── index.ts               # Clean public API exports
```

## Core Interfaces

### ServiceContainer

The main DI container interface:

```typescript
interface ServiceContainer {
    // Service registration
    register<T>(token: ServiceIdentifier<T>, factory: ServiceFactory<T>, options?: ServiceOptions): void;
    registerSingleton<T>(token: ServiceIdentifier<T>, factory: ServiceFactory<T>): void;
    registerTransient<T>(token: ServiceIdentifier<T>, factory: ServiceFactory<T>): void;
    registerScoped<T>(token: ServiceIdentifier<T>, factory: ServiceFactory<T>): void;
    
    // Service resolution
    get<T>(token: ServiceIdentifier<T>): T;
    tryGet<T>(token: ServiceIdentifier<T>): T | null;
    getAll<T>(token: ServiceIdentifier<T>): T[];
    has<T>(token: ServiceIdentifier<T>): boolean;
    
    // Container management
    createScope(): ServiceContainer;
    isDisposed: boolean;
    dispose(): void;
    
    // Inspection
    getRegisteredServices(): ServiceDescriptor[];
    getServiceInfo<T>(token: ServiceIdentifier<T>): ServiceDescriptor | null;
}
```

### ServiceRegistry

Service registry interface:

```typescript
interface ServiceRegistry {
    // Registration
    register<T>(token: ServiceIdentifier<T>, descriptor: ServiceDescriptor): void;
    unregister<T>(token: ServiceIdentifier<T>): boolean;
    
    // Resolution
    resolve<T>(token: ServiceIdentifier<T>, context?: DIContext): T;
    canResolve<T>(token: ServiceIdentifier<T>): boolean;
    
    // Management
    clear(): void;
    getDescriptors(): Map<string, ServiceDescriptor>;
    
    // Lifecycle
    initialize(): Promise<void>;
    dispose(): Promise<void>;
}
```

### Data Types

```typescript
type ServiceIdentifier<T = any> = Constructor<T> | string | symbol | InjectionToken<T>;

type ServiceFactory<T> = (container: ServiceContainer) => T;

type Constructor<T = any> = new (...args: any[]) => T;

interface ServiceDescriptor {
    token: ServiceIdentifier;
    factory: ServiceFactory;
    lifetime: ServiceLifetime;
    options?: ServiceOptions;
    dependencies?: ServiceIdentifier[];
    metadata?: Record<string, any>;
}

enum ServiceLifetime {
    SINGLETON = 'singleton',
    TRANSIENT = 'transient',
    SCOPED = 'scoped'
}

interface ServiceOptions {
    tags?: string[];
    priority?: number;
    lazy?: boolean;
    replaceExisting?: boolean;
}

interface DIContext {
    container: ServiceContainer;
    scope?: string;
    resolving?: Set<ServiceIdentifier>;
}

class InjectionToken<T = any> {
    constructor(public readonly description: string) {}
}
```

## Decorators

### Injectable

Mark classes as injectable services:

```typescript
import { Injectable } from '@/core/di';

@Injectable()
class UserService {
    constructor(private database: DatabaseService) {}
    
    async getUser(id: string): Promise<User> {
        return this.database.findUser(id);
    }
}

@Injectable({ lifetime: ServiceLifetime.SINGLETON })
class CacheService {
    private cache = new Map<string, any>();
    
    get<T>(key: string): T | null {
        return this.cache.get(key) || null;
    }
    
    set<T>(key: string, value: T): void {
        this.cache.set(key, value);
    }
}
```

### Inject

Inject dependencies into constructors:

```typescript
import { Inject, Injectable } from '@/core/di';

@Injectable()
class OrderService {
    constructor(
        @Inject('DatabaseService') private database: DatabaseService,
        @Inject('CacheService') private cache: CacheService,
        @Inject(new InjectionToken<Logger>('Logger')) private logger: Logger
    ) {}
    
    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        this.logger.info('Creating order', { orderData });
        
        // Try cache first
        const cached = this.cache.get(`order:${orderData.id}`);
        if (cached) return cached;
        
        // Create order
        const order = await this.database.createOrder(orderData);
        this.cache.set(`order:${order.id}`, order);
        
        return order;
    }
}
```

## Factory Functions

### Basic Container Creation

```typescript
import { 
    createContainer,
    createAutoContainer,
    createContainerWithServices 
} from '@/core/di';

// Create empty container
const container = createContainer();

// Create auto-discovery container
const autoContainer = createAutoContainer({
    scanPaths: ['src/services', 'src/repositories'],
    excludePatterns: ['**/*.test.ts', '**/*.spec.ts']
});

// Create container with pre-configured services
const configuredContainer = createContainerWithServices({
    services: [
        {
            token: 'DatabaseService',
            factory: () => new DatabaseService(),
            lifetime: ServiceLifetime.SINGLETON
        },
        {
            token: 'CacheService',
            factory: () => new CacheService(),
            lifetime: ServiceLifetime.SINGLETON
        }
    ]
});
```

### Environment-Specific Containers

```typescript
import { 
    createDevelopmentContainer,
    createProductionContainer,
    createTestContainer 
} from '@/core/di';

// Development container with debug services
const devContainer = createDevelopmentContainer({
    enableLogging: true,
    enableMocks: true,
    mockServices: {
        'ExternalApiService': () => new MockExternalApiService()
    }
});

// Production container with optimizations
const prodContainer = createProductionContainer({
    enableCaching: true,
    enableMetrics: true,
    lazyLoading: true
});

// Test container with isolated services
const testContainer = createTestContainer({
    isolation: true,
    autoCleanup: true,
    mockServices: {
        'DatabaseService': () => new MockDatabaseService(),
        'EmailService': () => new MockEmailService()
    }
});
```

### Scoped Containers

```typescript
import { 
    createScopedContainer,
    createChildContainer 
} from '@/core/di';

// Create scoped container for web requests
const requestContainer = createScopedContainer('request', {
    parent: rootContainer,
    services: [
        {
            token: 'RequestContext',
            factory: () => new RequestContext(),
            lifetime: ServiceLifetime.SCOPED
        }
    ]
});

// Create child container for specific features
const featureContainer = createChildContainer(rootContainer, {
    services: [
        {
            token: 'FeatureConfig',
            factory: () => new FeatureConfig(),
            lifetime: ServiceLifetime.SINGLETON
        }
    ]
});
```

## Usage Patterns

### Basic Service Registration

```typescript
import { createContainer, ServiceLifetime } from '@/core/di';

const container = createContainer();

// Register services
container.register('DatabaseService', () => new DatabaseService(), {
    lifetime: ServiceLifetime.SINGLETON
});

container.register('UserService', (c) => 
    new UserService(c.get('DatabaseService')), 
    { lifetime: ServiceLifetime.TRANSIENT }
);

container.registerSingleton('CacheService', () => new CacheService());

container.registerScoped('RequestContext', () => new RequestContext());

// Resolve services
const userService = container.get('UserService');
const cacheService = container.get('CacheService');
```

### Class-Based Registration

```typescript
import { Injectable, Inject, createContainer } from '@/core/di';

@Injectable()
class DatabaseService {
    constructor() {
        console.log('DatabaseService created');
    }
}

@Injectable()
class UserService {
    constructor(
        @Inject(DatabaseService) private database: DatabaseService
    ) {}
    
    async getUser(id: string): Promise<User> {
        return this.database.findUser(id);
    }
}

// Auto-register classes
const container = createContainer();
container.registerClass(DatabaseService, ServiceLifetime.SINGLETON);
container.registerClass(UserService, ServiceLifetime.TRANSIENT);

const userService = container.get(UserService);
```

### Token-Based Registration

```typescript
import { InjectionToken, createContainer } from '@/core/di';

// Define tokens
const DATABASE_TOKEN = new InjectionToken<DatabaseService>('DatabaseService');
const LOGGER_TOKEN = new InjectionToken<Logger>('Logger');

// Register with tokens
const container = createContainer();
container.register(DATABASE_TOKEN, () => new PostgreSQLService(), {
    lifetime: ServiceLifetime.SINGLETON
});

container.register(LOGGER, () => new ConsoleLogger(), {
    lifetime: ServiceLifetime.SINGLETON
});

// Resolve with tokens
const database = container.get(DATABASE_TOKEN);
const logger = container.get(LOGGER_TOKEN);
```

### Service Lifetime Management

```typescript
import { createContainer, ServiceLifetime } from '@/core/di';

const container = createContainer();

// Singleton - Same instance for all resolutions
container.registerSingleton('ConfigService', () => new ConfigService());

const config1 = container.get('ConfigService');
const config2 = container.get('ConfigService');
console.log(config1 === config2); // true

// Transient - New instance for each resolution
container.register('UserService', () => new UserService(), {
    lifetime: ServiceLifetime.TRANSIENT
});

const user1 = container.get('UserService');
const user2 = container.get('UserService');
console.log(user1 === user2); // false

// Scoped - Same instance within scope
const scope = container.createScope();
scope.register('RequestContext', () => new RequestContext(), {
    lifetime: ServiceLifetime.SCOPED
});

const context1 = scope.get('RequestContext');
const context2 = scope.get('RequestContext');
console.log(context1 === context2); // true

const context3 = container.get('RequestContext'); // Different scope
console.log(context1 === context3); // false
```

## React Integration

### DI Provider

```typescript
import { DIProvider, useDIContainer, useService } from '@/core/di';

function App() {
    const container = useMemo(() => {
        const container = createContainer();
        
        // Register services
        container.registerSingleton('UserService', () => new UserService());
        container.registerSingleton('AuthService', () => new AuthService());
        
        return container;
    }, []);
    
    return (
        <DIProvider container={container}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </DIProvider>
    );
}

function ProfilePage() {
    const userService = useService('UserService');
    const authService = useService('AuthService');
    
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        userService.getCurrentUser().then(setUser);
    }, [userService]);
    
    return (
        <div>
            <h1>Profile</h1>
            {user && <p>Welcome, {user.name}!</p>}
            <button onClick={() => authService.logout()}>
                Logout
            </button>
        </div>
    );
}
```

### Advanced React Patterns

```typescript
import { 
    useDIContainer, 
    useService, 
    useTryService, 
    useHasService,
    useDIScope 
} from '@/core/di';

function ServiceComponent({ serviceName }: { serviceName: string }) {
    const container = useDIContainer();
    
    // Check if service exists
    const hasService = useHasService(serviceName);
    
    // Try to get service (returns null if not found)
    const service = useTryService(serviceName);
    
    // Get service (throws if not found)
    const requiredService = useService(serviceName);
    
    // Use scoped services
    const { createScope } = useDIScope();
    
    const handleScopedOperation = useCallback(() => {
        const scope = createScope('operation');
        const scopedService = scope.get('OperationService');
        return scopedService.execute();
    }, [createScope]);
    
    if (!hasService) {
        return <div>Service {serviceName} not found</div>;
    }
    
    return (
        <div>
            <p>Service: {serviceName}</p>
            <p>Available: {hasService ? 'Yes' : 'No'}</p>
            <button onClick={handleScopedOperation}>
                Execute Scoped Operation
            </button>
        </div>
    );
}
```

## Advanced Features

### Service Discovery

```typescript
import { createContainer } from '@/core/di';

const container = createContainer();

// Register services with tags
container.register('UserService', () => new UserService(), {
    tags: ['business', 'user']
});

container.register('OrderService', () => new OrderService(), {
    tags: ['business', 'order']
});

container.register('EmailService', () => new EmailService(), {
    tags: ['communication', 'email']
});

// Discover services by tags
const businessServices = container.getServicesByTag('business');
console.log(businessServices); // [UserService, OrderService]

const communicationServices = container.getServicesByTag('communication');
console.log(communicationServices); // [EmailService]
```

### Service Interceptors

```typescript
import { createContainer } from '@/core/di';

const container = createContainer();

// Add resolution interceptor
container.addInterceptor({
    beforeResolve: (token, context) => {
        console.log(`Resolving service: ${token}`);
    },
    afterResolve: (token, instance, context) => {
        console.log(`Service resolved: ${token}`, instance);
    },
    onError: (token, error, context) => {
        console.error(`Error resolving ${token}:`, error);
    }
});

// Register service
container.register('UserService', () => new UserService());

// Resolution will trigger interceptors
const userService = container.get('UserService');
```

### Service Health Monitoring

```typescript
import { createContainer } from '@/core/di';

const container = createContainer();

// Register health check
container.registerHealthCheck('DatabaseService', async () => {
    const db = container.get('DatabaseService');
    return await db.ping();
});

container.registerHealthCheck('ExternalApiService', async () => {
    const api = container.get('ExternalApiService');
    return await api.healthCheck();
});

// Check all services health
const healthStatus = await container.checkHealth();
console.log(healthStatus);
// {
//   DatabaseService: { healthy: true, responseTime: 10 },
//   ExternalApiService: { healthy: false, error: 'Connection timeout' }
// }
```

### Service Metrics

```typescript
import { createContainer } from '@/core/di';

const container = createContainer({
    enableMetrics: true
});

// Register services
container.register('UserService', () => new UserService());

// Use services
container.get('UserService');
container.get('UserService');
container.get('UserService');

// Get metrics
const metrics = container.getMetrics();
console.log(metrics);
// {
//   'UserService': {
//     resolutionCount: 3,
//     averageResolutionTime: 2.5,
//     errorCount: 0,
//     lastResolved: '2023-01-01T12:00:00Z'
//   }
// }
```

## Configuration

### Container Configuration

```typescript
import { createContainer } from '@/core/di';

const container = createContainer({
    // Enable auto-discovery
    autoDiscovery: {
        enabled: true,
        paths: ['src/services', 'src/repositories'],
        exclude: ['**/*.test.ts']
    },
    
    // Enable metrics
    metrics: {
        enabled: true,
        collectResolutionTime: true,
        collectErrorCounts: true
    },
    
    // Enable health checks
    healthChecks: {
        enabled: true,
        interval: 30000, // 30 seconds
        timeout: 5000    // 5 seconds
    },
    
    // Enable caching
    caching: {
        enabled: true,
        maxSize: 100,
        ttl: 300000 // 5 minutes
    }
});
```

### Environment-Specific Configuration

```typescript
import { 
    createDevelopmentContainer,
    createProductionContainer 
} from '@/core/di';

const isDevelopment = process.env.NODE_ENV === 'development';

const container = isDevelopment 
    ? createDevelopmentContainer({
        enableLogging: true,
        enableMocks: true,
        mockServices: {
            'ExternalApiService': () => new MockExternalApiService()
        }
    })
    : createProductionContainer({
        enableCaching: true,
        enableMetrics: true,
        lazyLoading: true
    });
```

## Best Practices

### Service Design

```typescript
// Good: Small, focused services
@Injectable()
class UserRepository {
    constructor(@Inject('DatabaseService') private db: DatabaseService) {}
    
    async findById(id: string): Promise<User | null> {
        return this.db.users.find(id);
    }
    
    async save(user: User): Promise<User> {
        return this.db.users.save(user);
    }
}

@Injectable()
class UserService {
    constructor(
        @Inject(UserRepository) private userRepo: UserRepository,
        @Inject('CacheService') private cache: CacheService
    ) {}
    
    async getUser(id: string): Promise<User | null> {
        // Try cache first
        const cached = this.cache.get(`user:${id}`);
        if (cached) return cached;
        
        // Get from repository
        const user = await this.userRepo.findById(id);
        if (user) {
            this.cache.set(`user:${id}`, user, 300000); // 5 minutes
        }
        
        return user;
    }
}
```

### Error Handling

```typescript
import { createContainer, ServiceLifetime } from '@/core/di';

const container = createContainer({
    errorHandling: {
        strategy: 'throw', // or 'return-null', 'return-default'
        logErrors: true,
        errorHandler: (error, token) => {
            console.error(`Error resolving ${token}:`, error);
            // Send to error tracking service
            errorTracker.track(error, { token });
        }
    }
});

// Register service with error handling
container.register('RiskyService', () => {
    if (Math.random() > 0.5) {
        throw new Error('Random failure');
    }
    return new RiskyService();
}, {
    lifetime: ServiceLifetime.TRANSIENT,
    retryAttempts: 3,
    retryDelay: 1000
});
```

### Performance Optimization

```typescript
import { createContainer } from '@/core/di';

const container = createContainer({
    // Enable lazy loading
    lazyLoading: true,
    
    // Enable caching
    caching: {
        enabled: true,
        maxSize: 100,
        ttl: 300000
    },
    
    // Enable service pooling
    pooling: {
        enabled: true,
        maxSize: 10,
        minSize: 2
    }
});

// Register expensive service with lazy loading
container.register('ExpensiveService', () => {
    console.log('Creating expensive service...');
    return new ExpensiveService();
}, {
    lazy: true,
    lifetime: ServiceLifetime.SINGLETON
});
```

## Testing

### Test Containers

```typescript
import { createTestContainer } from '@/core/di';

describe('UserService', () => {
    let container: ServiceContainer;
    let userService: UserService;
    
    beforeEach(() => {
        container = createTestContainer({
            isolation: true,
            autoCleanup: true,
            mockServices: {
                'DatabaseService': () => new MockDatabaseService(),
                'EmailService': () => new MockEmailService()
            }
        });
        
        userService = container.get(UserService);
    });
    
    afterEach(() => {
        container.dispose();
    });
    
    test('should create user', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com' };
        const user = await userService.createUser(userData);
        
        expect(user.id).toBeDefined();
        expect(user.name).toBe(userData.name);
    });
});
```

### Mock Services

```typescript
import { createContainer } from '@/core/di';

// Create mock service
class MockUserService {
    async getUser(id: string): Promise<User> {
        return {
            id,
            name: 'Mock User',
            email: 'mock@example.com'
        };
    }
}

// Register mock for testing
const testContainer = createContainer();
testContainer.register('UserService', () => new MockUserService());

// Test with mock
const userService = testContainer.get('UserService');
const user = await userService.getUser('123');
expect(user.name).toBe('Mock User');
```

## Migration Guide

### From Manual Service Creation

**Before (manual):**
```typescript
class UserService {
    private database: DatabaseService;
    private cache: CacheService;
    
    constructor() {
        this.database = new DatabaseService();
        this.cache = new CacheService();
    }
}

const userService = new UserService();
```

**After (DI):**
```typescript
@Injectable()
class UserService {
    constructor(
        @Inject('DatabaseService') private database: DatabaseService,
        @Inject('CacheService') private cache: CacheService
    ) {}
}

const container = createContainer();
container.registerSingleton('DatabaseService', () => new DatabaseService());
container.registerSingleton('CacheService', () => new CacheService());
container.registerSingleton(UserService);

const userService = container.get(UserService);
```

### From Legacy DI Systems

**Before (legacy):**
```typescript
import { SomeLegacyDIContainer } from 'some-library';
const container = new SomeLegacyDIContainer();
container.register('UserService', UserService);
```

**After (modern):**
```typescript
import { createContainer } from '@/core/di';
const container = createContainer();
container.registerSingleton(UserService);
```

## Troubleshooting

### Common Issues

1. **Circular Dependencies**: Use `@Inject` with forwardRef or redesign services
2. **Service Not Found**: Check registration and token matching
3. **Memory Leaks**: Ensure proper container disposal
4. **Performance Issues**: Enable lazy loading and caching

### Debug Mode

```typescript
import { createContainer } from '@/core/di';

const container = createContainer({
    debug: true,
    logging: {
        level: 'debug',
        includeStackTrace: true,
        logResolutions: true,
        logRegistrations: true
    }
});

// Get container statistics
const stats = container.getStats();
console.log('Container Stats:', stats);
```

## Version Information

- **Current Version**: 1.0.0
- **BlackBox Compliance**: 95%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive
- **Inspired By**: Flutter DI patterns

## Dependencies

- TypeScript - Type safety and decorators
- Reflect-metadata - Decorator metadata (polyfill required)

## Related Modules

- **All Core Modules**: All modules use DI for service management
- **Network Module**: For HTTP client injection
- **Authentication Module**: For auth service injection
- **Cache Module**: For cache service injection
