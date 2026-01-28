# Data Service Module - Clean API Guide

## Overview

The Data Service Module provides a clean, Single Responsibility Principle-compliant architecture for feature-specific data services. Features extend `BaseDataService` to implement their data coordination logic with intelligent caching, WebSocket integration, and optimistic updates.

## Architecture

```
Component Layer → Hook Layer → DI Container → Service Layer → Data Service → Cache/Repository/WebSocket Layers
```

### Core Services (SRP Compliant)

- **CacheManager**: Handles cache operations only
- **UpdateStrategy**: Manages data update strategies only  
- **WebSocketManager**: Handles WebSocket coordination only
- **QueryExecutor**: Coordinates query execution only
- **DataServiceConfig**: Centralized configuration only

## Quick Start for Features

### 1. Create Feature Data Service

```typescript
import { BaseDataService } from '@/core/dataservice';

export class MyFeatureDataService extends BaseDataService {
  constructor() {
    super();
    // Feature-specific initialization
  }

  // Implement feature-specific methods
  async getData() {
    // Use inherited services:
    // - this.cacheManager: Cache operations
    // - this.webSocketManager: WebSocket coordination  
    // - this.updateStrategy: Update strategies
    // - this.queryExecutor: Query coordination
  }
}
```

### 2. Use Composed Services

```typescript
// Cache operations
const cachedData = this.cacheManager.get(key);
this.cacheManager.set(key, data, ttl);
this.cacheManager.invalidate(key);

// WebSocket coordination
this.setupWebSocketListeners(key, topics, strategy);
this.handleWebSocketUpdate(key, message, strategy);

// Query coordination  
const result = this.executeQuery(key, fetcher, options);
const mutation = this.executeMutation(fetcher, options);
```

### 3. Feature-Specific Configuration

```typescript
export class MyFeatureDataService extends BaseDataService {
  private readonly FEATURE_CACHE_CONFIG = {
    REALTIME: { staleTime: 15 * 1000, cacheTime: 2 * 60 * 1000 },
    STATIC: { staleTime: 30 * 60 * 1000, cacheTime: 2 * 60 * 60 * 1000 },
  } as const;

  async getRealtimeData() {
    const cacheKey = this.generateCacheKey('realtime', { params });
    
    // Use feature-specific cache config
    const cachedEntry = this.cacheManager.getEntry(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.FEATURE_CACHE_CONFIG.REALTIME.staleTime) {
      return cachedEntry.data;
    }

    // Fetch and cache
    const data = await this.repository.getData();
    this.cacheManager.set(cacheKey, data, this.FEATURE_CACHE_CONFIG.REALTIME.cacheTime);
    
    return data;
  }
}
```

## Available Services

### CacheManager

```typescript
// Get cached data
const data = this.cacheManager.get<T>(key);

// Set cached data
this.cacheManager.set(key, data, ttl);

// Check if data is stale
const isStale = this.cacheManager.isStale(key, staleTime);

// Get cache entry with metadata
const entry = this.cacheManager.getEntry(key);

// Invalidate cache
this.cacheManager.invalidate(key);

// Get cache statistics
const stats = this.cacheManager.getStats();
```

### WebSocketManager

```typescript
// Set up listeners
this.webSocketManager.setupListeners(
  cacheKey,
  topics,
  updateStrategy,
  this.cacheManager,
  this.CACHE_CONFIG
);

// Handle messages
this.webSocketManager.handleMessage(
  cacheKey,
  message,
  updateStrategy,
  this.cacheManager,
  this.CACHE_CONFIG
);

// Store unsubscribe functions
this.webSocketManager.storeUnsubscribeFunction(cacheKey, topic, unsubscribe);

// Cleanup
this.webSocketManager.cleanup(cacheKey, topics);
```

### UpdateStrategy

```typescript
// Apply update strategies
const updatedData = this.updateStrategy.apply(currentData, newData, 'merge');
const replacedData = this.updateStrategy.apply(currentData, newData, 'replace');
const appendedData = this.updateStrategy.apply(currentData, newData, 'append');
const prependedData = this.updateStrategy.apply(currentData, newData, 'prepend');

// Check strategy support
const supportsMerge = this.updateStrategy.supports('merge');
```

### QueryExecutor

```typescript
// Execute queries
const query = this.queryExecutor.executeQuery(key, fetcher, options, cacheManager, webSocketManager);
const mutation = this.queryExecutor.executeMutation(fetcher, options, cacheManager, webSocketManager);
const infiniteQuery = this.queryExecutor.executeInfiniteQuery(key, fetcher, options, cacheManager, webSocketManager);
```

## Configuration

### Base Cache Config

```typescript
// Available from this.CACHE_CONFIG
{
  USER_CONTENT: { staleTime: 2 * 60 * 1000, cacheTime: 15 * 60 * 1000 },
  REALTIME: { staleTime: 30 * 1000, cacheTime: 5 * 60 * 1000 },
  STATIC: { staleTime: 30 * 60 * 1000, cacheTime: 2 * 60 * 60 * 1000 },
  CRITICAL: { staleTime: 10 * 1000, cacheTime: 60 * 1000 }
}
```

### Update Strategies

```typescript
type UpdateStrategyType = 'merge' | 'replace' | 'append' | 'prepend';
```

## Best Practices

### 1. Cache Key Generation

```typescript
// Use the provided utility
const cacheKey = this.generateCacheKey('resource', { id, page, filters });

// Results in: "resource:id:1:page:2:filters:{\"type\":\"all\"}"
```

### 2. WebSocket Integration

```typescript
// Set up listeners for real-time updates
private setupWebSocketListeners(cacheKey: string) {
  const topics = ['resource.created', 'resource.updated', 'resource.deleted'];
  
  topics.forEach(topic => {
    this.storeUnsubscribeFunction(cacheKey, topic,
      this.webSocket.subscribe(topic, (message) => {
        this.handleWebSocketUpdate(cacheKey, message, 'merge');
      })
    );
  });
}
```

### 3. Optimistic Updates

```typescript
async createResource(data: any) {
  const tempId = `temp_${Date.now()}`;
  const optimisticData = { ...data, id: tempId, isOptimistic: true };
  
  // Optimistic cache update
  this.updateCacheOptimistic(optimisticData);
  
  try {
    const created = await this.repository.create(data);
    this.updateCacheReplaceOptimistic(tempId, created);
    
    // Emit WebSocket event
    this.webSocket.send({ type: 'resource.created', data: created });
    return created;
  } catch (error) {
    // Rollback optimistic update
    this.updateCacheRemoveOptimistic(tempId);
    throw error;
  }
}
```

### 4. Error Handling

```typescript
async getData() {
  try {
    const cacheKey = this.generateCacheKey('data', { params });
    
    // Check cache first
    const cachedEntry = this.cacheManager.getEntry(cacheKey);
    if (cachedEntry && !this.cacheManager.isStale(cacheKey, this.FEATURE_CACHE_CONFIG.DATA.staleTime)) {
      return cachedEntry.data;
    }

    // Fetch from repository
    const data = await this.repository.getData(params);
    
    // Cache result
    this.cacheManager.set(cacheKey, data, this.FEATURE_CACHE_CONFIG.DATA.cacheTime);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

## Migration from Old API

### Before (Mixed Responsibilities)

```typescript
// Old BaseDataService - multiple responsibilities
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

### After (Clean SRP)

```typescript
// New BaseDataService - single responsibility per service
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

## Examples

### Feed Feature Example

```typescript
export class FeedDataService extends BaseDataService {
  async getFeedPosts(options: FeedOptions) {
    const cacheKey = this.generateCacheKey('feed', options);
    
    // Use CacheManager for cache operations
    const cachedEntry = this.cacheManager.getEntry(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.FEED_CACHE_CONFIG.FEED_REALTIME.staleTime) {
      return cachedEntry.data;
    }

    const posts = await this.repository.getFeedPosts(options);
    this.cacheManager.set(cacheKey, posts, this.FEED_CACHE_CONFIG.FEED_REALTIME.cacheTime);
    
    // Use WebSocketManager for real-time updates
    this.setupFeedWebSocketListeners(cacheKey);
    
    return posts;
  }

  private setupFeedWebSocketListeners(cacheKey: string) {
    const topics = ['post.created', 'post.updated', 'post.deleted'];
    topics.forEach(topic => {
      this.storeUnsubscribeFunction(cacheKey, topic,
        this.webSocket.subscribe(topic, (message) => {
          // Use UpdateStrategy for data updates
          this.handleFeedWebSocketUpdate(cacheKey, message);
        })
      );
    });
  }
}
```

## Testing

### Mock Services

```typescript
// Mock CacheManager
const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  getEntry: jest.fn(),
  isStale: jest.fn(),
  invalidate: jest.fn(),
  getStats: jest.fn()
} as jest.Mocked<ICacheManager>;

// Mock WebSocketManager  
const mockWebSocketManager = {
  setupListeners: jest.fn(),
  handleMessage: jest.fn(),
  storeUnsubscribeFunction: jest.fn(),
  cleanup: jest.fn()
} as jest.Mocked<IWebSocketManager>;

// Use in tests
const service = new MyFeatureDataService();
service.cacheManager = mockCacheManager;
service.webSocketManager = mockWebSocketManager;
```

## Performance Considerations

1. **Cache TTL**: Use appropriate TTL for different data types
2. **WebSocket Topics**: Subscribe only to necessary topics
3. **Update Strategies**: Choose optimal strategy for data type
4. **Memory Management**: Clean up WebSocket listeners properly
5. **Error Boundaries**: Handle errors gracefully without breaking cache

## Support

For questions or issues with the Data Service Module:
- Check this documentation first
- Review existing feature implementations (FeedDataService)
- Contact the Core Architecture team
