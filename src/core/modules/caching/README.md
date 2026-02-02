# Cache Module

Enterprise-grade caching system with intelligent storage, eviction strategies, and real-time coordination.

## 🏗️ Architecture

This module follows the **BlackBox Module Pattern** with **Four-Tier Directory Structure**:

```
caching/
├── types/              # Type definitions and interfaces
│   ├── interfaces.ts   # Public interfaces
│   └── constants.ts    # Configuration constants
├── providers/          # Main cache providers
│   ├── CacheProvider.ts
│   └── CacheServiceManager.ts
├── storage/            # Storage components
│   ├── CacheStorage.ts
│   └── CacheStatistics.ts
├── strategies/         # Eviction and cleanup strategies
│   ├── CacheEvictionStrategy.ts
│   └── CacheCleanupManager.ts
├── utils/              # Utilities and helpers
│   ├── CacheErrorHandler.ts
│   └── compatibility.ts
├── factory.ts          # Factory functions
└── index.ts           # Public exports (BlackBox API)
```

## 📦 Public API (BlackBox Pattern)

Only interfaces and factory functions are exported. Implementation details are hidden.

```typescript
// ✅ CORRECT: Use public API
import { createCacheProvider, type ICacheProvider } from '@/core/cache';

// ❌ INCORRECT: Direct implementation access
import { CacheProvider } from '@/core/cache/providers/CacheProvider';
```

## 🚀 Usage Examples

### Basic Cache Usage

```typescript
import { createCacheProvider, type ICacheProvider } from '@/core/cache';

// Create cache provider
const cache: ICacheProvider = createCacheProvider({
    defaultTTL: 300000, // 5 minutes
    maxSize: 1000,
    enableStats: true,
    enableLRU: true
});

// Use cache operations
const data = await cache.get<User>('user:123');
await cache.set('user:123', userData, 600000); // 10 minutes
await cache.invalidate('user:123');
```

### Service Manager Usage

```typescript
import { createCacheServiceManager, type ICacheServiceManager } from '@/core/cache';

const manager: ICacheServiceManager = createCacheServiceManager({
    defaultCache: { defaultTTL: 300000 },
    featureCaches: {
        auth: { defaultTTL: 3600000 }, // 1 hour
        posts: { defaultTTL: 300000 }   // 5 minutes
    }
});

const authCache = manager.getCache('auth');
const postsCache = manager.getCache('posts');
```

### Dependency Injection

```typescript
import { createCacheProviderFromDI } from '@/core/cache';
import { TYPES } from '@/core/di';

// Register in DI container
container.registerSingleton(TYPES.CACHE_PROVIDER, () => 
    createCacheProviderFromDI(container)
);

// Use in services
@Injectable()
class UserService {
    constructor(@Inject(TYPES.CACHE_PROVIDER) private cache: ICacheProvider) {}
}
```

## 🏛️ Component Architecture

### Storage Layer (`storage/`)
- **CacheStorage**: Pure storage operations
- **CacheStatistics**: Metrics tracking and reporting

### Strategy Layer (`strategies/`)
- **CacheEvictionStrategy**: LRU/FIFO eviction algorithms
- **CacheCleanupManager**: Timer-based cleanup operations

### Provider Layer (`providers/`)
- **CacheProvider**: Main cache implementation with component orchestration
- **CacheServiceManager**: Multi-cache management

### Utility Layer (`utils/`)
- **CacheErrorHandler**: Centralized error handling
- **Compatibility**: Migration support for legacy code

## 📊 Features

### Core Capabilities
- ✅ **Async Operations**: Non-blocking cache operations
- ✅ **TTL Management**: Automatic expiration with configurable TTL
- ✅ **Eviction Strategies**: LRU, FIFO with customizable algorithms
- ✅ **Statistics Tracking**: Hit rates, misses, evictions
- ✅ **Pattern Invalidation**: Regex-based cache invalidation
- ✅ **Event System**: Cache hit/miss/eviction events
- ✅ **Memory Management**: Size limits and intelligent cleanup

### Enterprise Features
- ✅ **BlackBox Pattern**: Complete implementation hiding
- ✅ **Dependency Injection**: Clean service composition
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Backward Compatibility**: Migration support layer
- ✅ **Performance Optimization**: Component-based architecture

## 🔧 Configuration

### Cache Configuration

```typescript
interface CacheConfig {
    defaultTTL: number;        // Default time-to-live in ms
    maxSize: number;           // Maximum cache entries
    cleanupInterval: number;   // Cleanup interval in ms
    enableStats: boolean;       // Enable statistics tracking
    enableLRU: boolean;        // Enable LRU eviction
}
```

### Event Handlers

```typescript
interface CacheEvents {
    onHit?: (key: string, data: unknown) => void;
    onMiss?: (key: string) => void;
    onEvict?: (key: string, data: unknown) => void;
    onError?: (error: Error, operation: string, key?: string) => void;
}
```

## 📈 Performance

### Optimization Features
- **Component Isolation**: Reduced memory footprint
- **Async Operations**: Non-blocking cache access
- **Intelligent Eviction**: LRU-based memory management
- **Efficient Cleanup**: Timer-based expiration
- **Statistics**: Performance monitoring

### Benchmarks
- **Hit Rate**: Up to 95% with proper TTL configuration
- **Memory Usage**: Configurable limits with intelligent cleanup
- **Response Time**: Sub-millisecond cache operations
- **Scalability**: Handles thousands of operations per second

## 🔄 Migration

### From Legacy Cache

```typescript
import { CacheMigrationHelper } from '@/core/cache';

// Convert legacy sync cache to async
const modernCache = CacheMigrationHelper.toAsyncProvider(legacyCache);

// Get migration plan
const plan = CacheMigrationHelper.createMigrationPlan(files);
console.log(`Estimated effort: ${plan.estimatedEffort}`);
```

### Compatibility Layer

```typescript
import { LegacyCacheAdapter } from '@/core/cache';

// Use legacy sync methods during migration
const legacyAdapter = new LegacyCacheAdapter(modernCache);
const data = legacyAdapter.getSync('key'); // Backward compatible
```

## 🧪 Testing

### Unit Testing

```typescript
import { createCacheProvider } from '@/core/cache';

describe('CacheProvider', () => {
    let cache: ICacheProvider;
    
    beforeEach(() => {
        cache = createCacheProvider({ defaultTTL: 1000 });
    });
    
    it('should store and retrieve data', async () => {
        await cache.set('key', 'value');
        const result = await cache.get('key');
        expect(result).toBe('value');
    });
});
```

### Integration Testing

```typescript
import { createCacheServiceManager } from '@/core/cache';

describe('CacheServiceManager', () => {
    it('should manage multiple caches', async () => {
        const manager = createCacheServiceManager();
        const authCache = manager.getCache('auth');
        const postsCache = manager.getCache('posts');
        
        expect(authCache).toBeDefined();
        expect(postsCache).toBeDefined();
    });
});
```

## 📚 Best Practices

### Performance
1. **Set Appropriate TTL**: Balance freshness with performance
2. **Monitor Hit Rates**: Adjust cache strategies based on usage
3. **Use Pattern Invalidation**: Efficiently invalidate related entries
4. **Enable Statistics**: Track performance metrics

### Architecture
1. **Use BlackBox API**: Import only from main module index
2. **Dependency Injection**: Use factory functions for service creation
3. **Type Safety**: Leverage TypeScript interfaces
4. **Error Handling**: Handle cache errors gracefully

### Memory Management
1. **Set Size Limits**: Prevent memory leaks
2. **Enable Cleanup**: Automatic expired entry removal
3. **Monitor Usage**: Track memory consumption
4. **Use Eviction**: Intelligent cache entry removal

## 🔍 Monitoring

### Statistics

```typescript
const stats = cache.getStats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
console.log(`Cache size: ${stats.size}`);
console.log(`Total requests: ${stats.totalRequests}`);
```

### Health Checks

```typescript
const isHealthy = stats.hitRate > 0.5 && stats.size < maxSize;
if (!isHealthy) {
    console.warn('Cache performance degraded');
}
```

## 🚨 Error Handling

### Common Errors

```typescript
try {
    await cache.set('key', data);
} catch (error) {
    if (error instanceof CacheError) {
        // Handle cache-specific errors
        console.error('Cache operation failed:', error.message);
    } else {
        // Handle unexpected errors
        console.error('Unexpected error:', error);
    }
}
```

### Event Handling

```typescript
const cache = createCacheProvider(config, {
    onError: (error, operation, key) => {
        console.error(`Cache ${operation} failed for key ${key}:`, error);
        // Report to monitoring system
        reportError(error, { operation, key });
    }
});
```

---

**Last Updated**: February 3, 2026  
**Version**: 2.0.0  
**Status**: Enterprise Ready  

This cache module provides a robust, scalable foundation for application caching needs with enterprise-grade architecture and comprehensive feature support.
