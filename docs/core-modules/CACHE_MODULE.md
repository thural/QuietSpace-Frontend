# Cache Module Documentation

## Overview

The Cache module provides an enterprise-grade caching system with multiple layers, advanced features, and perfect Black Box architecture compliance. It offers both simple interfaces for basic use cases and sophisticated features for enterprise scenarios.

## Architecture

### Black Box Pattern Implementation

The Cache module follows the **Black Box pattern** with:
- **Clean Public API**: Only interfaces and factory functions exported
- **Hidden Implementation**: Internal classes completely encapsulated
- **Factory Pattern**: Clean service creation with dependency injection support
- **Type Safety**: Full TypeScript support throughout

### Module Structure

```
src/core/cache/
├── interfaces.ts          # Public interfaces and types
├── factory.ts            # Factory functions for service creation
├── CacheProvider.ts      # Core cache implementation (internal)
├── CacheServiceManager.ts # Multi-feature cache management (internal)
└── index.ts             # Clean public API exports
```

## Core Interfaces

### ICacheProvider

The main cache interface providing complete CRUD operations:

```typescript
interface ICacheProvider {
    // Basic operations
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttl?: number): void;
    invalidate(key: string): boolean;
    delete(key: string): boolean; // Alias for invalidate
    clear(): void;
    has(key: string): boolean;
    
    // Advanced operations
    getEntry<T>(key: string): CacheEntry<T> | null;
    invalidatePattern(pattern: string | RegExp): number;
    
    // Management
    getStats(): CacheStats;
    getConfig(): CacheConfig;
    updateConfig(newConfig: Partial<CacheConfig>): void;
    dispose(): void;
}
```

### ICacheServiceManager

Multi-feature cache management:

```typescript
interface ICacheServiceManager {
    getCache(featureName: string): ICacheProvider;
    invalidateFeature(featureName: string): void;
    invalidatePattern(pattern: string): number;
    getGlobalStats(): Record<string, any>;
    dispose(): void;
}
```

### Data Types

```typescript
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}

interface CacheConfig {
    defaultTTL: number;        // Default time-to-live in ms
    maxSize: number;           // Maximum cache size
    cleanupInterval: number;   // Cleanup interval in ms
    enableStats: boolean;      // Enable statistics tracking
    enableLRU: boolean;        // Enable LRU eviction
}

interface CacheStats {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    totalRequests: number;
}
```

## Factory Functions

### Basic Cache Creation

```typescript
import { createCacheProvider, createDefaultCacheProvider } from '@/core/cache';

// Create with custom configuration
const cache = createCacheProvider({
    defaultTTL: 300000,    // 5 minutes
    maxSize: 1000,
    enableStats: true,
    enableLRU: true
}, {
    onHit: (key, data) => console.log(`Cache hit: ${key}`),
    onMiss: (key) => console.log(`Cache miss: ${key}`),
    onEvict: (key, data) => console.log(`Cache evict: ${key}`),
    onError: (error, operation, key) => console.error(`Cache error: ${operation}`, error)
});

// Create with default configuration
const defaultCache = createDefaultCacheProvider();
```

### Multi-Feature Cache Management

```typescript
import { createCacheServiceManager } from '@/core/cache';

const cacheManager = createCacheServiceManager({
    defaultCache: {
        defaultTTL: 300000,    // 5 minutes
        maxSize: 1000
    },
    featureCaches: {
        'feed': {
            defaultTTL: 60000,    // 1 minute for feed data
            maxSize: 500
        },
        'auth': {
            defaultTTL: 900000,    // 15 minutes for auth data
            maxSize: 100
        },
        'profile': {
            defaultTTL: 1800000,   // 30 minutes for profile data
            maxSize: 200
        }
    }
});

// Get feature-specific cache
const feedCache = cacheManager.getCache('feed');
const authCache = cacheManager.getCache('auth');
```

### Dependency Injection Integration

```typescript
import { createCacheProviderFromDI, createCacheServiceManagerFromDI } from '@/core/cache';
import { Container } from '@/core/di';

const container = new Container();

// Create using DI container
const cache = createCacheProviderFromDI(container, {
    defaultTTL: 300000
});

const cacheManager = createCacheServiceManagerFromDI(container, {
    defaultCache: { defaultTTL: 300000 }
});
```

## Usage Patterns

### Basic Caching

```typescript
// Store data
cache.set('user:123', userData, 300000); // 5 minutes TTL

// Retrieve data
const user = cache.get('user:123');
if (user) {
    console.log('User data from cache:', user);
} else {
    console.log('User not in cache, fetching from API...');
}

// Check if data exists
if (cache.has('user:123')) {
    const user = cache.get('user:123');
}

// Remove specific entry
cache.invalidate('user:123');

// Clear all cache
cache.clear();
```

### Pattern-Based Invalidation

```typescript
// Invalidate all user-related cache entries
const invalidatedCount = cache.invalidatePattern(/^user_*/);

// Invalidate all cache entries matching a pattern
const messageCount = cache.invalidatePattern(/^chat_.*_messages$/);

console.log(`Invalidated ${invalidatedCount} user entries`);
console.log(`Invalidated ${messageCount} message entries`);
```

### Statistics and Monitoring

```typescript
// Get cache statistics
const stats = cache.getStats();
console.log('Cache Statistics:', {
    size: stats.size,
    hitRate: `${(stats.hitRate * 100).toFixed(1)}%`,
    hits: stats.hits,
    misses: stats.misses,
    evictions: stats.evictions,
    totalRequests: stats.totalRequests
});

// Get global statistics for all features
const globalStats = cacheManager.getGlobalStats();
console.log('Global Cache Stats:', globalStats);
```

### Event-Driven Caching

```typescript
const cache = createCacheProvider(
    { defaultTTL: 300000, enableStats: true },
    {
        onHit: (key, data) => {
            console.log(`✅ Cache hit: ${key}`);
            // Track analytics
            analytics.track('cache_hit', { key });
        },
        onMiss: (key) => {
            console.log(`❌ Cache miss: ${key}`);
            // Track analytics
            analytics.track('cache_miss', { key });
        },
        onEvict: (key, data) => {
            console.log(`🗑️ Cache evict: ${key}`);
            // Log evictions for monitoring
            logger.info('cache_eviction', { key, dataSize: JSON.stringify(data).length });
        },
        onError: (error, operation, key) => {
            console.error(`💥 Cache error: ${operation}`, error);
            // Report errors
            errorReporting.report(error, { operation, key });
        }
    }
);
```

## Advanced Features

### Advanced Cache Manager

For enterprise scenarios, the system includes an advanced cache manager with:

- **Multi-Tier Caching**: Memory, Disk, Network, CDN tiers
- **Intelligent Cache Warming**: Predictive data preloading
- **Adaptive Sizing**: Dynamic tier size optimization
- **Compression**: Space optimization
- **Encryption**: Security for sensitive data
- **Advanced Analytics**: Performance monitoring and insights

```typescript
import { AdvancedCacheManagerProvider } from '@/features/chat/presentation/components/performance/AdvancedCacheManager';

<AdvancedCacheManagerProvider config={{
    enableMultiTier: true,
    enableIntelligentWarming: true,
    enableCompression: true,
    maxMemorySize: 100 * 1024 * 1024, // 100MB
    maxDiskSize: 500 * 1024 * 1024,   // 500MB
    compressionThreshold: 1024        // 1KB
}}>
    <App />
</AdvancedCacheManagerProvider>
```

### Cache Entry Details

```typescript
// Get detailed cache entry information
const entry = cache.getEntry('user:123');
if (entry) {
    console.log('Cache Entry Details:', {
        data: entry.data,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccessed: Date.now() - entry.lastAccessed
    });
}
```

### Configuration Updates

```typescript
// Update cache configuration at runtime
cache.updateConfig({
    defaultTTL: 600000,    // Increase to 10 minutes
    maxSize: 2000,         // Increase max size
    enableStats: true      // Enable statistics
});
```

## Best Practices

### Cache Key Strategy

```typescript
// Use hierarchical keys
const userKey = `user:${userId}`;
const userPostsKey = `user:${userId}:posts`;
const postCommentsKey = `post:${postId}:comments`;

// Include versioning for cache invalidation
const userKeyV2 = `user:v2:${userId}`;

// Use consistent naming patterns
const CACHE_KEYS = {
    USER: (id: string) => `user:${id}`,
    USER_POSTS: (id: string) => `user:${id}:posts`,
    POST_COMMENTS: (id: string) => `post:${id}:comments`,
    SEARCH_RESULTS: (query: string) => `search:${encodeURIComponent(query)}`
};
```

### TTL Management

```typescript
const TTL = {
    SHORT: 60000,          // 1 minute - frequently changing data
    MEDIUM: 300000,        // 5 minutes - moderate change frequency
    LONG: 1800000,         // 30 minutes - slow changing data
    VERY_LONG: 3600000      // 1 hour - static data
};

// Usage
cache.set(CACHE_KEYS.USER(userId), userData, TTL.MEDIUM);
cache.set(CACHE_KEYS.USER_POSTS(userId), posts, TTL.SHORT);
cache.set(CACHE_KEYS.POST_COMMENTS(postId), comments, TTL.SHORT);
```

### Memory Management

```typescript
// Monitor cache size and clean up if needed
const stats = cache.getStats();
if (stats.size > maxSize * 0.9) {
    console.warn('Cache approaching size limit, consider cleanup');
    // Implement cleanup strategy
    cache.invalidatePattern(/^temp_*/);
}

// Use LRU eviction for automatic cleanup
const cache = createCacheProvider({
    maxSize: 1000,
    enableLRU: true,
    cleanupInterval: 60000  // Clean expired entries every minute
});
```

### Error Handling

```typescript
const cache = createCacheProvider(
    { defaultTTL: 300000 },
    {
        onError: (error, operation, key) => {
            console.error(`Cache error during ${operation}:`, error);
            
            // Report to monitoring service
            monitoring.reportError(error, {
                operation,
                key,
                timestamp: Date.now()
            });
            
            // Fallback behavior
            if (operation === 'get') {
                // Continue without cache
                return null;
            }
        }
    }
);
```

## Integration Examples

### React Integration

```typescript
import { useEffect, useState } from 'react';
import { createDefaultCacheProvider } from '@/core/cache';

const cache = createDefaultCacheProvider();

function useCachedData<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Try cache first
        const cachedData = cache.get<T>(key);
        if (cachedData) {
            setData(cachedData);
            return;
        }

        // Fetch fresh data
        setLoading(true);
        fetcher()
            .then(freshData => {
                cache.set(key, freshData, ttl);
                setData(freshData);
                setError(null);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [key, fetcher, ttl]);

    return { data, loading, error };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
    const { data: user, loading, error } = useCachedData(
        `user:${userId}`,
        () => fetchUser(userId),
        300000 // 5 minutes
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found</div>;

    return <div>{user.name}</div>;
}
```

### Feature-Specific Caching

```typescript
// services/feedService.ts
import { createCacheServiceManager } from '@/core/cache';

const cacheManager = createCacheServiceManager({
    defaultCache: { defaultTTL: 300000, maxSize: 1000 },
    featureCaches: {
        'feed': { defaultTTL: 60000, maxSize: 500 }
    }
});

const feedCache = cacheManager.getCache('feed');

export const feedService = {
    async getPosts(userId: string): Promise<Post[]> {
        const cacheKey = `posts:${userId}`;
        
        // Try cache first
        let posts = feedCache.get<Post[]>(cacheKey);
        if (posts) {
            return posts;
        }

        // Fetch from API
        posts = await api.fetchPosts(userId);
        
        // Cache for 1 minute
        feedCache.set(cacheKey, posts, 60000);
        
        return posts;
    },

    invalidateUserPosts(userId: string): void {
        feedCache.invalidatePattern(`posts:${userId}*`);
    }
};
```

## Performance Considerations

### Cache Hit Rate Optimization

```typescript
// Monitor hit rates and adjust TTL accordingly
const stats = cache.getStats();
if (stats.hitRate < 0.7) {
    console.warn('Low cache hit rate, consider increasing TTL');
    cache.updateConfig({ defaultTTL: currentTTL * 1.5 });
}
```

### Memory Usage

```typescript
// Monitor memory usage
const stats = cache.getStats();
const memoryUsage = process.memoryUsage();
const cacheMemoryRatio = stats.size / (memoryUsage.heapUsed / 1024 / 1024);

if (cacheMemoryRatio > 0.3) {
    console.warn('Cache using significant memory, consider cleanup');
}
```

### Cleanup Strategies

```typescript
// Implement periodic cleanup
setInterval(() => {
    const stats = cache.getStats();
    console.log('Cache cleanup:', stats);
    
    // Clean up old entries if needed
    if (stats.evictions > 100) {
        console.log('High eviction count, consider increasing cache size');
    }
}, 300000); // Every 5 minutes
```

## Testing

### Mock Cache for Testing

```typescript
import { createMockCacheProvider } from '@/core/cache';

// In tests
const mockCache = createMockCacheProvider();

test('should cache and retrieve data', () => {
    mockCache.set('test-key', 'test-value');
    expect(mockCache.get('test-key')).toBe('test-value');
});

test('should handle cache misses', () => {
    expect(mockCache.get('non-existent-key')).toBeNull();
});
```

## Migration Guide

### From Direct Implementation to Factory Pattern

**Before (deprecated):**
```typescript
import { CacheProvider } from '@/core/cache/CacheProvider';
const cache = new CacheProvider(config);
```

**After (recommended):**
```typescript
import { createCacheProvider } from '@/core/cache';
const cache = createCacheProvider(config);
```

### From Legacy Exports

**Before (deprecated):**
```typescript
import { _CacheProvider } from '@/core/cache';
```

**After (recommended):**
```typescript
import { createCacheProvider } from '@/core/cache';
const cache = createCacheProvider();
```

## Troubleshooting

### Common Issues

1. **Low Hit Rate**: Increase TTL or review cache key strategy
2. **Memory Issues**: Reduce maxSize or enable more aggressive cleanup
3. **Performance Issues**: Disable statistics if not needed
4. **Stale Data**: Implement proper invalidation strategies

### Debug Mode

```typescript
const cache = createCacheProvider(
    { defaultTTL: 300000, enableStats: true },
    {
        onHit: (key, data) => console.debug(`🎯 Cache hit: ${key}`),
        onMiss: (key) => console.debug(`❌ Cache miss: ${key}`),
        onEvict: (key, data) => console.debug(`🗑️ Cache evict: ${key}`),
        onError: (error, operation, key) => console.debug(`💥 Cache error: ${operation}`, error)
    }
);
```

## Version Information

- **Current Version**: 1.0.0
- **Black Box Compliance**: 95%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive

## Dependencies

- `@core/di` - Dependency injection support
- TypeScript - Type safety

## Related Modules

- **Network Module**: For API caching
- **Services Module**: For logging cache operations
- **DI Module**: For dependency injection integration
