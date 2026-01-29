# Data Layer Module Documentation

## Overview

The Data Layer module provides an enterprise-grade intelligent data coordination system with **Single Responsibility Principle compliance**, clean service composition, and perfect BlackBox architecture. It offers both simple interfaces for basic use cases and sophisticated features for enterprise scenarios.

## Architecture

### Single Responsibility Principle (SRP) Implementation

The Data Layer module has been **refactored to follow SRP** with composed services:

- **CacheManager**: Handles cache operations only
- **UpdateStrategy**: Manages data update strategies only  
- **WebSocketManager**: Handles WebSocket coordination only
- **QueryExecutor**: Coordinates query execution only
- **DataLayerConfig**: Centralized configuration only

### Facade Pattern Implementation

The Data Layer module follows the **Facade pattern** with:
- **Clean Public API**: Only interfaces and factory functions exported
- **Hidden Implementation**: Internal classes completely encapsulated
- **Factory Pattern**: Clean service creation with dependency injection support
- **Type Safety**: Full TypeScript support throughout

### Module Structure

```
src/core/data/
├── interfaces.ts          # Public interfaces and types
├── factory.ts            # Factory functions for service creation
├── BaseDataService.ts     # Core data service with composed services
├── config/
│   └── DataLayerConfig.ts # Centralized configuration
├── services/
│   ├── ICacheManager.ts   # Cache manager interface
│   ├── CacheManager.ts     # Cache manager implementation
│   ├── IUpdateStrategy.ts  # Update strategy interface
│   ├── UpdateStrategy.ts    # Update strategy implementation
│   ├── IWebSocketManager.ts # WebSocket manager interface
│   ├── WebSocketManager.ts  # WebSocket manager implementation
│   ├── IQueryExecutor.ts    # Query executor interface
│   ├── QueryExecutor.ts     # Query executor implementation
│   └── index.ts            # Service exports
└── index.ts             # Clean public API exports
```

### 7-Layer Architecture Integration

The Data Layer module fits perfectly into the 7-layer architecture:

```
Component Layer → Hook Layer → DI Container → Service Layer → Data → Cache/Repository/WebSocket Layers
```

### Service Composition Architecture

```
BaseDataService (Coordination Layer)
├── CacheManager (Cache Operations)
├── UpdateStrategy (Data Updates)
├── WebSocketManager (Real-time Updates)
├── QueryExecutor (Query Coordination)
└── DataLayerConfig (Configuration)
```

## Core Services

### ICacheManager

Handles all cache operations with TTL management and invalidation:

```typescript
interface ICacheManager {
    get<T>(key: string): T | undefined;
    set<T>(key: string, data: T, ttl?: number): void;
    getEntry(key: string): CacheEntry<T> | undefined;
    isStale(key: string, staleTime: number): boolean;
    invalidate(key: string): void;
    generateKey(base: string, params?: Record<string, any>): string;
    getStats(): CacheStats;
}
```

### IUpdateStrategy

Manages data update strategies for different scenarios:

```typescript
interface IUpdateStrategy {
    apply(currentData: any, newData: any, strategy: UpdateStrategyType): any;
    supports(strategy: UpdateStrategyType): boolean;
}

type UpdateStrategyType = 'merge' | 'replace' | 'append' | 'prepend';
```

### IWebSocketManager

Handles WebSocket coordination and real-time updates:

```typescript
interface IWebSocketManager {
    setupListeners(key: string, topics: string[], strategy: UpdateStrategyType, cacheManager: ICacheManager, config: ICacheConfig): void;
    handleMessage(key: string, message: any, strategy: UpdateStrategyType, cacheManager: ICacheManager, config: ICacheConfig): void;
    storeUnsubscribeFunction(key: string, topic: string, unsubscribe: () => void): void;
    cleanup(key: string, topics: string[]): void;
}
```

### IQueryExecutor

Coordinates query execution with cache and WebSocket integration:

```typescript
interface IQueryExecutor {
    executeQuery<T>(key: string | string[], fetcher: () => Promise<T>, options: IDataLayerQueryOptions<T>, cacheManager: ICacheManager, webSocketManager: IWebSocketManager): Promise<T>;
    executeMutation<TData, TError, TVariables>(fetcher: (variables: TVariables) => Promise<TData>, options: IDataLayerMutationOptions<TData, TError, TVariables>, cacheManager: ICacheManager, webSocketManager: IWebSocketManager): Promise<TData>;
    executeInfiniteQuery<T>(key: string | string[], fetcher: (pageParam: number) => Promise<{ data: T[]; hasNextPage: boolean; hasPreviousPage?: boolean }>, options: IDataLayerInfiniteQueryOptions<T>, cacheManager: ICacheManager, webSocketManager: IWebSocketManager): Promise<T>;
}
```

### DataLayerConfig

Centralized configuration management:

```typescript
export class DataLayerConfig {
    static readonly CACHE_CONFIG: ICacheConfig = {
        REALTIME: { staleTime: 30 * 1000, cacheTime: 5 * 60 * 1000, refetchInterval: 60 * 1000 },
        USER_CONTENT: { staleTime: 2 * 60 * 1000, cacheTime: 15 * 60 * 1000, refetchInterval: 5 * 60 * 1000 },
        STATIC: { staleTime: 30 * 60 * 1000, cacheTime: 2 * 60 * 60 * 1000, refetchInterval: undefined },
        CRITICAL: { staleTime: 10 * 1000, cacheTime: 60 * 1000, refetchInterval: 30 * 1000 },
    };
    
    static getCacheConfig(environment?: string): ICacheConfig;
    static getStrategyConfig(strategy: string, environment?: string): any;
}
```

### ICacheConfig

Cache configuration strategies for different data types:

```typescript
interface ICacheConfig {
    REALTIME: {
        staleTime: number;      // Time before data is considered stale
        cacheTime: number;      // Time data remains in cache
        refetchInterval: number; // Automatic refetch interval
    };
    USER_CONTENT: {
        staleTime: number;
        cacheTime: number;
        refetchInterval: number;
    };
    STATIC: {
        staleTime: number;
        cacheTime: number;
        refetchInterval: number | undefined;
    };
    CRITICAL: {
        staleTime: number;
        cacheTime: number;
        refetchInterval: number;
    };
}
```

### WebSocket Update Strategies

```typescript
type WebSocketUpdateStrategy = 'merge' | 'replace' | 'append' | 'prepend';
```

### Data Layer Options

```typescript
interface IDataLayerQueryOptions<T> extends QueryOptions<T> {
    cacheStrategy?: keyof ICacheConfig;
    websocketTopics?: string[];
    updateStrategy?: WebSocketUpdateStrategy;
}

interface IDataLayerMutationOptions<TData, TError, TVariables> extends MutationOptions<TData, TError, TVariables> {
    invalidateQueries?: string[];
    optimisticUpdate?: boolean;
    websocketEvents?: string[];
}
```

## Factory Functions

### Basic Data Service Creation

```typescript
import { createDefaultDataLayer } from '@/core/data';

// Create with default configuration
const dataService = createDefaultDataLayer(YourDataServiceClass);
```

### Custom Configuration

```typescript
import { 
    createDataLayer,
    createDataLayerWithCache,
    createDataLayerWithServices 
} from '@/core/data';

// Create with custom cache configuration
const dataService = createDataLayerWithCache(YourDataServiceClass, {
    REALTIME: {
        staleTime: 15 * 1000,  // 15 seconds
        cacheTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 30 * 1000, // 30 seconds
    }
});

// Create with custom services
const dataService = createDataLayerWithServices(
    YourDataServiceClass,
    customCacheProvider,
    customWebSocketService
);
```

### Environment-Specific Configuration

```typescript
import { createDataLayerForEnvironment } from '@/core/data';

// Create for development environment
const devDataService = createDataLayerForEnvironment(
    YourDataServiceClass,
    'development'
);

// Create for production environment
const prodDataService = createDataLayerForEnvironment(
    YourDataServiceClass,
    'production'
);
```

### Multiple Data Services

```typescript
import { createDataLayers, createDataLayersWithIndividualConfig } from '@/core/data';

// Create multiple with shared configuration
const dataServices = createDataLayers([
    FeedDataService,
    UserDataService,
    ChatDataService
], {
    customCacheConfig: {
        REALTIME: {
            staleTime: 30 * 1000,
            cacheTime: 5 * 60 * 1000,
            refetchInterval: 60 * 1000,
        }
    }
});

// Create with individual configurations
const dataServices = createDataLayersWithIndividualConfig([
    [FeedDataService, { customCacheConfig: feedConfig }],
    [UserDataService, { customCacheConfig: userConfig }],
    [ChatDataService, { customCacheConfig: chatConfig }]
]);
```

## Implementation Example

### Creating a Feature-Specific Data Service (SRP Compliant)

```typescript
import { BaseDataService } from '@/core/data';
import type { IDataRepository } from '@/core/data';

export class FeedDataService extends BaseDataService {
    protected repository: IFeedRepository;

    constructor() {
        super();
        this.repository = this.container.get<IFeedRepository>('FeedRepository');
    }

    // Feature-specific cache configuration
    private readonly FEED_CACHE_CONFIG = {
        FEED_REALTIME: { staleTime: 15 * 1000, cacheTime: 2 * 60 * 1000, refetchInterval: 30 * 1000 },
        POSTS: { staleTime: 60 * 1000, cacheTime: 10 * 60 * 1000, refetchInterval: 2 * 60 * 1000 },
        COMMENTS: { staleTime: 30 * 1000, cacheTime: 5 * 60 * 1000, refetchInterval: 60 * 1000 },
        INTERACTIONS: { staleTime: 10 * 1000, cacheTime: 60 * 1000, refetchInterval: 15 * 1000 },
    } as const;

    async getFeedPosts(options: any) {
        const cacheKey = this.generateCacheKey('feed', options);
        
        // Use CacheManager for cache operations
        const cachedEntry = this.cacheManager.getEntry(cacheKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < this.FEED_CACHE_CONFIG.FEED_REALTIME.staleTime) {
            return cachedEntry.data;
        }

        // Fetch from repository
        const posts = await this.repository.getFeedPosts(options);
        
        // Cache with feature-specific TTL using CacheManager
        this.cacheManager.set(cacheKey, posts, this.FEED_CACHE_CONFIG.FEED_REALTIME.cacheTime);
        
        // Set up WebSocket listeners using WebSocketManager
        this.setupFeedWebSocketListeners(cacheKey);
        
        return posts;
    }

    async createPost(postData: any) {
        const tempId = `temp_${Date.now()}`;
        const optimisticPost = {
            ...postData,
            id: tempId,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        // Optimistic update using CacheManager
        this.updateFeedCacheOptimistic(optimisticPost);

        try {
            const createdPost = await this.repository.createPost(postData);
            
            // Update cache with real post using CacheManager
            this.updateFeedCacheReplaceOptimistic(tempId, createdPost);
            
            // Emit WebSocket event
            this.webSocket.send({
                type: 'post.created',
                data: createdPost,
                timestamp: Date.now(),
            });

            return createdPost;
        } catch (error) {
            // Rollback optimistic update
            this.updateFeedCacheRemoveOptimistic(tempId);
            throw error;
        }
    }

    // Private WebSocket setup using WebSocketManager
    private setupFeedWebSocketListeners(cacheKey: string) {
        const topics = ['post.created', 'post.updated', 'post.deleted'];
        topics.forEach(topic => {
            this.storeUnsubscribeFunction(cacheKey, topic,
                this.webSocket.subscribe(topic, (message) => this.handleFeedWebSocketUpdate(cacheKey, message))
            );
        });
    }

    // Private cache update methods using CacheManager
    private updateFeedCacheOptimistic(post: any) {
        const globalFeedKey = this.generateCacheKey('feed', { userId: 'global', page: 1, limit: 20 });
        const globalFeed = this.cacheManager.getEntry(globalFeedKey);
        if (globalFeed && Array.isArray(globalFeed.data)) {
            this.cacheManager.set(globalFeedKey, [post, ...globalFeed.data], this.FEED_CACHE_CONFIG.FEED_REALTIME.cacheTime);
        }
    }
}
```

### Using the Data Service in Hooks

```typescript
import { useFeedDataService } from '@/features/feed/application/hooks/useFeedDataService';

export function useFeedComponent() {
    const dataService = useFeedDataService();

    const { data, loading, error } = useCustomQuery(
        ['feed', { page: 1, limit: 20 }],
        () => dataService.getFeedPosts({ page: 1, limit: 20 }),
        {
            staleTime: 15 * 1000,
            cacheTime: 2 * 60 * 1000,
        }
    );

    const createPostMutation = useCustomMutation(
        (postData: any) => dataService.createPost(postData),
        {
            optimisticUpdate: true,
            onSuccess: () => {
                // Cache automatically updated via data service
            },
        }
    );

    return {
        posts: data,
        loading,
        error,
        createPost: createPostMutation.mutateAsync,
    };
}
```

## Cache Strategies

### REALTIME Strategy
- **Use Case**: Chat messages, live notifications, real-time counts
- **Configuration**: 30s stale time, 5min cache time, 1min refetch
- **Features**: Fast updates, frequent refresh

### USER_CONTENT Strategy
- **Use Case**: Posts, comments, user-generated content
- **Configuration**: 2min stale time, 15min cache time, 5min refetch
- **Features**: Balanced performance and freshness

### STATIC Strategy
- **Use Case**: User profiles, settings, reference data
- **Configuration**: 30min stale time, 2hr cache time, no refetch
- **Features**: Long-term caching, manual refresh

### CRITICAL Strategy
- **Use Case**: Authentication, permissions, critical data
- **Configuration**: 10s stale time, 1min cache time, 30s refetch
- **Features**: Maximum freshness, high availability

## WebSocket Integration

### Automatic Cache Updates

```typescript
// Set up listeners for real-time updates
this.setupWebSocketListeners(
    ['feed', 'global'],           // Cache key
    ['post.created', 'post.updated'], // WebSocket topics
    'merge'                       // Update strategy
);
```

### Update Strategies

- **merge**: Merge objects or arrays by ID
- **replace**: Replace entire cache entry
- **append**: Add to end of array
- **prepend**: Add to beginning of array

### WebSocket Message Format

```typescript
{
    type: 'post.updated',
    data: {
        id: 'post-123',
        title: 'Updated Title',
        content: 'Updated content',
    },
    timestamp: 1643723400000,
}
```

## Optimistic Updates

### Automatic Rollback

```typescript
async createPost(postData: any) {
    const tempId = `temp_${Date.now()}`;
    const optimisticPost = { ...postData, id: tempId, isOptimistic: true };

    // Optimistic update
    this.updateCache(['feed'], optimisticPost);

    try {
        const realPost = await this.repository.createPost(postData);
        // Replace optimistic with real data
        this.updateCache(['feed'], realPost);
        return realPost;
    } catch (error) {
        // Automatic rollback on failure
        this.invalidateCache(['feed']);
        throw error;
    }
}
```

## Performance Monitoring

### Cache Statistics

```typescript
const stats = dataService.getCacheStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Cache size:', stats.size);
console.log('Total requests:', stats.totalRequests);
```

### WebSocket Monitoring

```typescript
// Monitor connection status
const isConnected = dataService.webSocket.isConnected();

// Track subscription count
const subscriptionCount = dataService.webSocket.getSubscriptions().length;
```

## Testing

### Mock Implementation

```typescript
import { createDataLayerWithServices } from '@/core/data';

const mockCache = {
    getEntry: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    getStats: jest.fn(),
};

const mockWebSocket = {
    subscribe: jest.fn(),
    send: jest.fn(),
    isConnected: jest.fn(),
};

const dataService = createDataLayerWithServices(
    TestDataService,
    mockCache,
    mockWebSocket
);
```

### Unit Test Example

```typescript
describe('FeedDataService', () => {
    let dataService: FeedDataService;

    beforeEach(() => {
        dataService = createDefaultDataLayer(FeedDataService);
    });

    it('should return cached data if not stale', async () => {
        const cachedPosts = [{ id: '1', content: 'Test post' }];
        jest.spyOn(dataService, 'getCachedData').mockReturnValue(cachedPosts);
        jest.spyOn(dataService, 'isDataStale').mockReturnValue(false);

        const result = await dataService.getFeedPosts({});

        expect(result).toEqual(cachedPosts);
    });

    it('should fetch data if cache is stale', async () => {
        const freshPosts = [{ id: '2', content: 'Fresh post' }];
        jest.spyOn(dataService, 'isDataStale').mockReturnValue(true);
        jest.spyOn(dataService.repository, 'getFeedPosts').mockResolvedValue(freshPosts);

        const result = await dataService.getFeedPosts({});

        expect(result).toEqual(freshPosts);
        expect(dataService.repository.getFeedPosts).toHaveBeenCalled();
    });
});
```

## Best Practices

### 1. Cache Key Strategy
- Use consistent, predictable cache keys
- Include all relevant parameters in cache key
- Use hierarchical structure: `feature:entity:id:params`

### 2. WebSocket Topic Naming
- Use descriptive topic names
- Include entity type and ID: `post.123.updated`
- Use wildcards for bulk operations: `post.*.updated`

### 3. Error Handling
- Always implement rollback for optimistic updates
- Provide meaningful error messages
- Log errors for debugging and monitoring

### 4. Performance Optimization
- Use appropriate cache TTL values
- Implement cache warming for critical data
- Monitor cache hit rates and performance

### 5. Memory Management
- Clean up WebSocket listeners on unmount
- Implement cache size limits
- Use weak references where appropriate

## Migration Guide

### From Legacy BaseDataService (Pre-Refactoring)

```typescript
// BEFORE (Mixed Responsibilities)
export class OldDataService extends BaseDataService {
    async getData() {
        // Direct cache access
        const cached = this.cache.get(key);
        
        // Direct WebSocket access  
        this.webSocket.subscribe(topic, handler);
        
        // Mixed update logic
        if (strategy === 'merge') {
            // Complex merge logic here
        }
    }
}
```

```typescript
// AFTER (SRP Compliant)
export class NewDataService extends BaseDataService {
    async getData() {
        // Delegate to CacheManager
        const cachedEntry = this.cacheManager.getEntry(key);
        
        // Delegate to WebSocketManager
        this.setupWebSocketListeners(key, topics, strategy);
        
        // Delegate to UpdateStrategy
        const updatedData = this.updateStrategy.apply(currentData, newData, strategy);
    }
}
```

### Benefits of Migration

- **Single Responsibility**: Each service has one clear purpose
- **Better Testability**: Services can be tested independently
- **Improved Maintainability**: Changes isolated to specific services
- **Enhanced Reusability**: Services can be used independently
- **Clean Architecture**: Proper separation of concerns

## Module Information

- **Version**: 2.0.0 (SRP Compliant)
- **Dependencies**: Core Cache Module, Core WebSocket Module, Core DI Module
- **Type Safety**: Full TypeScript support
- **Testing**: Comprehensive test utilities
- **Documentation**: Complete API documentation and examples
- **Architecture**: Single Responsibility Principle compliant

## Features

- ✅ **Single Responsibility Principle**: Each service has one clear responsibility
- ✅ **Service Composition**: Clean composition of specialized services
- ✅ **Cache-first data fetching** with intelligent TTL management
- ✅ **Real-time WebSocket integration** with automatic cache updates
- ✅ **Optimistic updates** with automatic rollback
- ✅ **Multiple cache strategies** for different data types
- ✅ **Dependency injection support** with factory pattern
- ✅ **TypeScript support** with full type safety
- ✅ **BlackBox architecture** with clean public API
- ✅ **Performance monitoring** with cache statistics
- ✅ **Environment-specific configuration** support
- ✅ **Comprehensive testing utilities** and mock support
- ✅ **Clean API documentation** and usage examples

This Data Layer module provides a solid foundation for implementing intelligent data coordination across all features while maintaining clean architectural separation, Single Responsibility Principle compliance, and enterprise-grade performance.
