# Data Service Usage Guide

## 🏗️ Overview

This guide explains how to implement a comprehensive Data Service for each feature following the **Single Responsibility Principle** and 7-layer architectural design principles of QuietSpace Frontend.

## 📋 Architecture Layers

```
Component → Hook → DI → Service → Data → Cache/Repository/WebSocket
```

## 🎯 Data Service Responsibilities (Post-Refactoring)

The Data Service serves as the **intelligent coordinator** that delegates to specialized services:

- **CacheManager** - Handles cache operations only
- **WebSocketManager** - Handles WebSocket coordination only  
- **UpdateStrategy** - Manages data update strategies only
- **QueryExecutor** - Coordinates query execution only
- **DataLayerConfig** - Centralized configuration only

## 🚀 Implementation Pattern (SRP Compliant)

### **1. Base Data Service Structure (Refactored)**

```typescript
// src/core/data/BaseDataService.ts
export abstract class BaseDataService {
  // Core dependencies
  protected cache: ICacheProvider;
  protected webSocket: IWebSocketService;
  protected container: Container;

  // Composed services following SRP
  protected cacheManager: ICacheManager;
  protected updateStrategy: IUpdateStrategy;
  protected webSocketManager: IWebSocketManager;
  protected queryExecutor: IQueryExecutor;

  // Centralized configuration
  protected readonly CACHE_CONFIG: ICacheConfig = DataLayerConfig.CACHE_CONFIG;

  constructor() {
    this.container = useDIContainer();
    this.cache = this.container.get<ICacheProvider>(TYPES.CACHE_SERVICE);
    this.webSocket = this.container.get<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);

    // Initialize composed services
    this.cacheManager = new CacheManager(this.cache);
    this.updateStrategy = new UpdateStrategy();
    this.webSocketManager = new WebSocketManager(this.webSocket, this.updateStrategy);
    this.queryExecutor = new QueryExecutor();
  }
}
```

### **2. Feature-Specific Data Service (Clean API)**

```typescript
// src/features/{feature}/data/{Feature}DataService.ts
export class {Feature}DataService extends BaseDataService {
  constructor() {
    super();
    this.repository = this.container.get<{Feature}Repository>('{Feature}Repository');
  }

  // Feature-specific cache configuration
  private readonly FEATURE_CACHE_CONFIG = {
    REALTIME: { staleTime: 15 * 1000, cacheTime: 2 * 60 * 1000, refetchInterval: 30 * 1000 },
    USER_CONTENT: { staleTime: 60 * 1000, cacheTime: 10 * 60 * 1000, refetchInterval: 2 * 60 * 1000 },
    STATIC: { staleTime: 30 * 60 * 1000, cacheTime: 2 * 60 * 60 * 1000, refetchInterval: undefined },
    CRITICAL: { staleTime: 10 * 1000, cacheTime: 60 * 1000, refetchInterval: 15 * 1000 },
  } as const;

  // Cache-first data fetching with service delegation
  async getData(options: any) {
    const cacheKey = this.generateCacheKey('feature', options);

    // Delegate to CacheManager for cache operations
    const cachedEntry = this.cacheManager.getEntry(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.FEATURE_CACHE_CONFIG.USER_CONTENT.staleTime) {
      return cachedEntry.data;
    }

    // Fetch from repository
    const data = await this.repository.getData(options);

    // Delegate to CacheManager for caching
    this.cacheManager.set(cacheKey, data, this.FEATURE_CACHE_CONFIG.USER_CONTENT.cacheTime);

    // Delegate to WebSocketManager for real-time updates
    this.setupWebSocketListeners(cacheKey);

    return data;
  }

  // Optimistic updates with rollback using composed services
  async updateData(id: string, updateData: any) {
    const currentData = await this.getData({ id });

    // Optimistic update using CacheManager
    const optimisticData = { ...currentData, ...updateData, isOptimistic: true };
    this.cacheManager.set(this.generateCacheKey('feature', { id }), optimisticData);

    try {
      // Update via repository
      const updatedData = await this.repository.updateData(id, updateData);

      // Update cache with real data using CacheManager
      this.cacheManager.set(this.generateCacheKey('feature', { id }), updatedData);

      // Emit WebSocket event
      this.webSocket.send({
        type: 'data.updated',
        data: { id, ...updatedData },
        timestamp: Date.now(),
      });

      return updatedData;
    } catch (error) {
      // Rollback cache to original state using CacheManager
      this.cacheManager.set(this.generateCacheKey('feature', { id }), currentData);
      throw error;
    }
  }

  // Private WebSocket setup using WebSocketManager
  private setupWebSocketListeners(cacheKey: string) {
    const topics = ['data.created', 'data.updated', 'data.deleted'];
    topics.forEach(topic => {
      this.storeUnsubscribeFunction(cacheKey, topic,
        this.webSocket.subscribe(topic, (message) => this.handleWebSocketUpdate(cacheKey, message))
      );
    });
  }
}
```

### **3. Hook Layer Integration**

```typescript
// src/features/{feature}/application/hooks/use{Feature}DataService.ts
export function use{Feature}DataService() {
  const dataService = useMemo(() => new {Feature}DataService(), []);

  const useData = (options: any) => {
    return useCustomQuery(
      ['feature', options],
      () => dataService.getData(options),
      {
        staleTime: dataService.CACHE_CONFIG.USER_CONTENT.staleTime,
        cacheTime: dataService.CACHE_CONFIG.USER_CONTENT.cacheTime,
      }
    );
  };

  const useUpdateData = () => {
    return useCustomMutation(
      ({ id, data }: { id: string; data: any }) => dataService.updateData(id, data),
      {
        optimisticUpdate: true,
        invalidateQueries: (variables) => [['feature', { id: variables.id }]],
        websocketEvents: ['data.updated'],
      }
    );
  };

  return {
    useData,
    useUpdateData,
    cacheOperations: {
      updateCache: dataService.updateCache.bind(dataService),
      invalidateCache: dataService.invalidateCache.bind(dataService),
    },
  };
}
```

### **4. Component Layer Integration**

```typescript
// src/features/{feature}/presentation/hooks/use{Feature}Component.ts
export function use{Feature}Component(options: any) {
  const { useData, useUpdateData, cacheOperations } = use{Feature}DataService();

  const { data, loading, error, refetch } = useData(options);
  const { mutateAsync: updateData } = useUpdateData();

  const handleUpdate = useCallback(async (updateData: any) => {
    try {
      await updateData({ id: data.id, data: updateData });
      // Cache automatically updated via Data Service
    } catch (error) {
      // Error handling
    }
  }, [data.id, updateData]);

  return {
    data,
    loading,
    error,
    handleUpdate,
    refresh: refetch,
    // Direct cache access for advanced use cases
    cacheOperations,
  };
}
```

## 🔄 Data Flow Pattern (Post-Refactoring)

### **Initial Load (Cache-First Strategy)**
1. **Component** calls `use{Feature}Component()`
2. **Hook Layer** calls `use{Feature}DataService()`
3. **Data Service** delegates to **CacheManager** for cache check
4. If cache miss or stale → **Repository** fetches data
5. **Data Service** delegates to **CacheManager** for caching
6. **Data Service** delegates to **WebSocketManager** for listeners
7. Data flows back up through layers to **Component**

### **Real-Time Updates (Service Delegation)**
1. **WebSocket** receives message
2. **Data Service** delegates to **WebSocketManager** for handling
3. **WebSocketManager** delegates to **CacheManager** for cache updates
4. **CacheManager** invalidates related queries
5. **Hook Layer** detects cache changes
6. **Component** re-renders with new data

### **Optimistic Updates (Service Coordination)**
1. **Component** triggers mutation
2. **Hook Layer** calls mutation with optimistic flag
3. **Data Service** delegates to **CacheManager** for immediate update
4. **Component** shows optimistic state
5. **Data Service** sends request to **Repository**
6. On success → **CacheManager** updates with real data
7. On failure → **CacheManager** rolls back to original state

## 🎛️ Service-Specific Configuration Guidelines

### **CacheManager Configuration**
- **TTL Management**: Automatic stale time checking
- **Key Generation**: Consistent cache key patterns
- **Invalidation**: Smart cache invalidation strategies
- **Statistics**: Cache hit rate and performance metrics

### **WebSocketManager Configuration**
- **Topic Management**: Automatic subscription and cleanup
- **Message Handling**: Delegated to appropriate handlers
- **Connection Management**: Health monitoring and reconnection
- **Event Coordination**: Integration with cache updates

### **UpdateStrategy Configuration**
- **Merge Strategy**: Intelligent object/array merging
- **Replace Strategy**: Complete data replacement
- **Append/Prepend**: Array manipulation strategies
- **Custom Strategies**: Extensible for feature-specific needs

## 🔧 Service Composition Benefits

### **Single Responsibility Principle**
- **CacheManager**: Only handles cache operations
- **WebSocketManager**: Only handles WebSocket coordination
- **UpdateStrategy**: Only handles data updates
- **QueryExecutor**: Only handles query execution
- **BaseDataService**: Only coordinates between services

### **Improved Testability**
```typescript
// Before: Hard to test mixed responsibilities
const mockDataService = {
  cache: mockCache,
  webSocket: mockWebSocket,
  // Mixed logic makes testing complex
};

// After: Easy to test individual services
const mockCacheManager = new MockCacheManager();
const mockWebSocketManager = new MockWebSocketManager();
const dataService = new FeatureDataService();
dataService.cacheManager = mockCacheManager;
dataService.webSocketManager = mockWebSocketManager;
```

### **Enhanced Reusability**
```typescript
// Services can be used independently
const cacheManager = new CacheManager(cache);
const webSocketManager = new WebSocketManager(webSocket, updateStrategy);
const updateStrategy = new UpdateStrategy();

// Or composed in different ways
const customDataService = {
  cacheManager,
  webSocketManager,
  updateStrategy,
  customLogic: () => { /* feature-specific logic */ }
};
```

## 🔧 WebSocket Message Patterns

### **Standard Update Message**
```typescript
{
  type: 'entity.updated',
  data: {
    id: 'entity-id',
    field1: 'new-value',
    field2: 'new-value',
  },
  timestamp: 1643723400000,
}
```

### **Partial Update Message**
```typescript
{
  type: 'entity.partial.updated',
  data: {
    id: 'entity-id',
    updates: {
      likes: ['user1', 'user2'],
      likeCount: 2,
    },
  },
  timestamp: 1643723400000,
}
```

### **Creation Message**
```typescript
{
  type: 'entity.created',
  data: {
    id: 'new-entity-id',
    // ... full entity data
  },
  timestamp: 1643723400000,
}
```

### **Deletion Message**
```typescript
{
  type: 'entity.deleted',
  data: {
    id: 'deleted-entity-id',
  },
  timestamp: 1643723400000,
}
```

## 📊 Cache Invalidation Strategies

### **Immediate Invalidation**
```typescript
// Critical data changes
this.cache.invalidate(`user:${userId}`);
this.cache.invalidate(`permissions:${userId}`);
```

### **Smart Invalidation**
```typescript
// Related data updates
this.invalidateRelatedQueries(cacheKey, updatedData);
```

### **Batch Invalidation**
```typescript
// Bulk updates
const patterns = [
  'feed:*',
  `user:${userId}:*`,
  'comments:*',
];
patterns.forEach(pattern => this.invalidateCache(pattern));
```

## 🧪 Testing Strategy

### **Unit Tests**
- Test cache-first behavior
- Test WebSocket message handling
- Test optimistic updates and rollback
- Test cache invalidation

### **Integration Tests**
- Test end-to-end data flow
- Test real-time updates
- Test error handling and recovery
- Test performance under load

### **Mock Strategy**
```typescript
// Mock cache provider
const mockCache = {
  getEntry: jest.fn(),
  set: jest.fn(),
  invalidate: jest.fn(),
  getStats: jest.fn(),
};

// Mock WebSocket service
const mockWebSocket = {
  subscribe: jest.fn(),
  send: jest.fn(),
  isConnected: jest.fn(),
};
```

## 🎯 Best Practices

### **1. Cache Key Strategy**
- Use consistent, predictable cache keys
- Include all relevant parameters in cache key
- Use hierarchical structure: `feature:entity:id:params`

### **2. WebSocket Topic Naming**
- Use descriptive topic names
- Include entity type and ID: `post.123.updated`
- Use wildcards for bulk operations: `post.*.updated`

### **3. Error Handling**
- Always implement rollback for optimistic updates
- Provide meaningful error messages
- Log errors for debugging and monitoring

### **4. Performance Optimization**
- Use appropriate cache TTL values
- Implement cache warming for critical data
- Monitor cache hit rates and performance

### **5. Memory Management**
- Clean up WebSocket listeners on unmount
- Implement cache size limits
- Use weak references where appropriate

## 🚀 Implementation Checklist (Post-Refactoring)

### **Data Service**
- [ ] Extend BaseDataService (SRP compliant)
- [ ] Use composed services (CacheManager, WebSocketManager, etc.)
- [ ] Implement cache-first data fetching with service delegation
- [ ] Set up WebSocket listeners via WebSocketManager
- [ ] Implement optimistic updates with CacheManager rollback
- [ ] Add feature-specific cache configurations

### **Hook Layer**
- [ ] Create use{Feature}DataService hook
- [ ] Integrate with custom query hooks
- [ ] Expose service operations (not direct cache access)
- [ ] Handle loading and error states

### **Component Layer**
- [ ] Create use{Feature}Component hook
- [ ] Provide clean API for components
- [ ] Handle user interactions through service methods
- [ ] Display loading and error states

### **Testing**
- [ ] Unit tests for individual services (CacheManager, WebSocketManager, etc.)
- [ ] Integration tests for Data Service coordination
- [ ] Component tests for UI
- [ ] Performance tests for cache and WebSocket

### **Documentation**
- [ ] API documentation for service interfaces
- [ ] Usage examples with service composition
- [ ] Migration guide from legacy to SRP pattern
- [ ] Troubleshooting guide for service-specific issues

## 📈 Monitoring and Analytics (Service-Level)

### **CacheManager Metrics**
- Hit rate percentage
- Average response time
- Cache size and memory usage
- Invalidation frequency
- Key generation patterns

### **WebSocketManager Metrics**
- Connection uptime
- Message throughput
- Subscription count
- Error rates
- Topic distribution

### **Service Coordination Metrics**
- Request success rate
- Average data fetch time
- Optimistic update success rate
- Rollback frequency
- Service interaction patterns

## 🎯 Migration Benefits Summary

### **Before Refactoring**
- **Mixed Responsibilities**: Single class handling cache, WebSocket, updates, queries
- **Hard to Test**: Complex dependencies and mixed logic
- **Difficult to Maintain**: Changes affect multiple concerns
- **Limited Reusability**: Tightly coupled implementation

### **After Refactoring**
- **Single Responsibility**: Each service has one clear purpose
- **Easy to Test**: Services can be tested independently
- **Simple to Maintain**: Changes isolated to specific services
- **Highly Reusable**: Services can be composed in different ways
- **Clean Architecture**: Proper separation of concerns
- **Better Performance**: Optimized service interactions

This implementation ensures optimal data flow, intelligent caching, and real-time updates while maintaining clean separation of concerns, Single Responsibility Principle compliance, and enterprise-grade performance through service composition.
