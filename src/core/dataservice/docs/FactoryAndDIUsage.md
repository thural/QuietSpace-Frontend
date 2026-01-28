# Data Service Module - Factory & DI Container Usage

## Overview

Features can create and manage data services using two primary approaches:
1. **Factory Functions** - Direct creation with configuration
2. **DI Container** - Dependency injection with automatic service resolution

## Approach 1: Factory Functions

### Basic Factory Usage

```typescript
// src/features/posts/data/PostDataServiceFactory.ts
import { createDataService, createDefaultDataService } from '@/core/dataservice';
import { PostDataService } from './PostDataService';

/**
 * Create a post data service with default configuration
 */
export function createPostDataService(): PostDataService {
  return createDefaultDataService(PostDataService);
}

/**
 * Create a post data service with custom cache configuration
 */
export function createPostDataServiceWithCache() {
  return createDataService(PostDataService, {
    customCacheConfig: {
      USER_CONTENT: {
        staleTime: 10 * 60 * 1000,    // 10 minutes
        cacheTime: 30 * 60 * 1000,    // 30 minutes
        refetchInterval: 5 * 60 * 1000 // 5 minutes
      }
    }
  });
}

/**
 * Create a post data service with custom services
 */
export function createPostDataServiceWithServices(
  cacheProvider: ICacheProvider,
  webSocketService: IWebSocketService
) {
  return createDataService(PostDataService, {
    cache: cacheProvider,
    webSocket: webSocketService
  });
}

/**
 * Create a post data service for specific environment
 */
export function createPostDataServiceForEnvironment(
  environment: 'development' | 'production' | 'test' = 'production'
) {
  return createDataServiceForEnvironment(PostDataService, environment);
}

/**
 * Create multiple post data services with shared configuration
 */
export function createMultiplePostServices() {
  return createDataServices([
    PostDataService,
    AnotherDataService,
    ThirdDataService
  ], {
    customCacheConfig: {
      USER_CONTENT: {
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        refetchInterval: 2 * 60 * 1000
      }
    }
  });
}
```

### Feature Usage with Factories

```typescript
// src/features/posts/hooks/usePosts.ts
import { createPostDataService, createPostDataServiceWithCache } from '../data/PostDataServiceFactory';

export function usePosts() {
  // Simple factory usage
  const dataService = createPostDataService();
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 5 * 60 * 1000 }
  );
}

export function usePostsWithCustomCache() {
  // Factory with custom cache
  const dataService = createPostDataServiceWithCache();
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 10 * 60 * 1000 }
  );
}

export function usePostsWithCustomServices() {
  // Factory with custom services
  const cacheProvider = new CustomCacheProvider();
  const webSocketService = new CustomWebSocketService();
  const dataService = createPostDataServiceWithServices(cacheProvider, webSocketService);
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 5 * 60 * 1000 }
  );
}
```

### Environment-Specific Factories

```typescript
// src/features/posts/data/PostDataServiceFactory.ts
import { createDataServiceForEnvironment } from '@/core/dataservice';

/**
 * Environment-specific post data service creation
 */
export function createEnvironmentAwarePostService() {
  const environment = process.env.NODE_ENV || 'development';
  
  return createDataServiceForEnvironment(PostDataService, environment as any);
}

/**
 * Production-optimized post service
 */
export function createProductionPostService() {
  return createDataService(PostDataService, {
    customCacheConfig: {
      USER_CONTENT: {
        staleTime: 15 * 60 * 1000,    // 15 minutes (longer for production)
        cacheTime: 60 * 60 * 1000,    // 1 hour (longer cache)
        refetchInterval: 10 * 60 * 1000 // 10 minutes (less frequent)
      }
    }
  });
}

/**
 * Development-optimized post service
 */
export function createDevelopmentPostService() {
  return createDataService(PostDataService, {
    customCacheConfig: {
      USER_CONTENT: {
        staleTime: 30 * 1000,         // 30 seconds (shorter for development)
        cacheTime: 5 * 60 * 1000,     // 5 minutes (shorter cache)
        refetchInterval: 10 * 1000    // 10 seconds (more frequent)
      }
    }
  });
}
```

## Approach 2: DI Container Integration

### DI Container Registration

```typescript
// src/features/posts/di/PostServiceRegistration.ts
import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { PostDataService } from '../data/PostDataService';
import { PostRepository } from '../data/PostRepository';
import { CacheProvider } from '../cache/CacheProvider';
import { WebSocketService } from '../websocket/WebSocketService';

/**
 * Register post feature services in DI container
 */
export function registerPostServices(container: Container) {
  // Register repository
  container.bind<IPostRepository>('PostRepository').to(PostRepository).inSingletonScope();
  
  // Register cache provider
  container.bind<ICacheProvider>('PostCacheProvider').to(CacheProvider).inSingletonScope();
  
  // Register WebSocket service
  container.bind<IWebSocketService>('PostWebSocketService').to(WebSocketService).inSingletonScope();
  
  // Register data service with dependencies
  container.bind<IBaseDataService>('PostDataService').toDynamicValue((context) => {
    const repository = context.container.get<IPostRepository>('PostRepository');
    const cache = context.container.get<ICacheProvider>('PostCacheProvider');
    const webSocket = context.container.get<IWebSocketService>('PostWebSocketService');
    
    return new PostDataService(repository, cache, webSocket);
  }).inSingletonScope();
  
  // Register factory function
  container.bind<() => PostDataService>('PostServiceFactory').toDynamicValue((context) => {
    return () => context.container.get<PostDataService>('PostDataService');
  });
}

/**
 * Register post data service with custom configuration
 */
export function registerPostServiceWithConfig(container: Container, config: any) {
  container.bind<IBaseDataService>('PostDataService').toDynamicValue((context) => {
    const cache = context.container.get<ICacheProvider>(TYPES.CACHE_SERVICE);
    const webSocket = context.container.get<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);
    
    return createDataService(PostDataService, {
      cache,
      webSocket,
      customCacheConfig: config
    });
  }).inSingletonScope();
}
```

### DI Container Usage

```typescript
// src/features/posts/hooks/usePostsWithDI.ts
import { useDIContainer } from '@/core/di';
import { createDataServiceFromDI, createDefaultDataServiceFromDI } from '@/core/dataservice';
import { PostDataService } from '../data/PostDataService';

/**
 * Hook using DI container - default service
 */
export function usePostsWithDI() {
  const container = useDIContainer();
  
  // Get data service from DI container
  const dataService = createDefaultDataServiceFromDI(container) as PostDataService;
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 5 * 60 * 1000 }
  );
}

/**
 * Hook using DI container - with cache
 */
export function usePostsWithDIAndCache() {
  const container = useDIContainer();
  
  // Get data service with cache from DI container
  const dataService = createDataServiceWithCacheFromDI(container) as PostDataService;
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 10 * 60 * 1000 }
  );
}

/**
 * Hook using DI container - direct service resolution
 */
export function usePostsWithDirectDI() {
  const container = useDIContainer();
  
  // Get service directly from container
  const dataService = container.get<PostDataService>('PostDataService');
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 5 * 60 * 1000 }
  );
}

/**
 * Hook using DI container - factory pattern
 */
export function usePostsWithFactoryDI() {
  const container = useDIContainer();
  
  // Get factory from container
  const postServiceFactory = container.get<() => PostDataService>('PostServiceFactory');
  const dataService = postServiceFactory();
  
  return useQuery(
    'posts',
    () => dataService.getPosts(),
    { staleTime: 5 * 60 * 1000 }
  );
}
```

### Advanced DI Container Patterns

```typescript
// src/features/posts/di/AdvancedPostServiceRegistration.ts
import { Container } from '@/core/di/container/Container';
import { createDataService } from '@/core/dataservice';
import { PostDataService } from '../data/PostDataService';

/**
 * Register multiple post service variants
 */
export function registerPostServiceVariants(container: Container) {
  // Development post service
  container.bind<PostDataService>('DevelopmentPostService').toDynamicValue((context) => {
    return createDataService(PostDataService, {
      customCacheConfig: {
        USER_CONTENT: {
          staleTime: 30 * 1000,
          cacheTime: 5 * 60 * 1000,
          refetchInterval: 10 * 1000
        }
      }
    });
  }).inSingletonScope();
  
  // Production post service
  container.bind<PostDataService>('ProductionPostService').toDynamicValue((context) => {
    return createDataService(PostDataService, {
      customCacheConfig: {
        USER_CONTENT: {
          staleTime: 15 * 60 * 1000,
          cacheTime: 60 * 60 * 1000,
          refetchInterval: 10 * 60 * 1000
        }
      }
    });
  }).inSingletonScope();
  
  // Test post service
  container.bind<PostDataService>('TestPostService').toDynamicValue((context) => {
    return createDataService(PostDataService, {
      customCacheConfig: {
        USER_CONTENT: {
          staleTime: 0,
          cacheTime: 0,
          refetchInterval: undefined
        }
      }
    });
  }).inSingletonScope();
}

/**
 * Environment-aware service resolution
 */
export function getPostServiceForEnvironment(container: Container): PostDataService {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'production':
      return container.get<PostDataService>('ProductionPostService');
    case 'test':
      return container.get<PostDataService>('TestPostService');
    default:
      return container.get<PostDataService>('DevelopmentPostService');
  }
}
```

## Comparison: Factory vs DI Container

### Factory Functions - Pros & Cons

**Pros:**
- ✅ Simple and explicit
- ✅ No setup required
- ✅ Easy to understand
- ✅ Direct control over configuration
- ✅ Good for testing and prototyping

**Cons:**
- ❌ Manual dependency management
- ❌ Harder to mock in tests
- ❌ No automatic service resolution
- ❌ More boilerplate for complex scenarios

### DI Container - Pros & Cons

**Pros:**
- ✅ Automatic dependency resolution
- ✅ Easy to mock for testing
- ✅ Centralized configuration
- ✅ Better for large applications
- ✅ Supports service lifetime management

**Cons:**
- ❌ More complex setup
- ❌ Learning curve
- ❌ Overhead for simple cases
- ❌ Magic can be harder to debug

## Usage Examples

### Simple Feature (Factory Approach)

```typescript
// src/features/simple-feature/hooks/useData.ts
import { createDefaultDataService } from '@/core/dataservice';
import { SimpleDataService } from '../data/SimpleDataService';

export function useSimpleData() {
  const dataService = createDefaultDataService(SimpleDataService);
  
  return useQuery(
    'simple-data',
    () => dataService.getData(),
    { staleTime: 5 * 60 * 1000 }
  );
}
```

### Complex Feature (DI Container Approach)

```typescript
// src/features/complex-feature/hooks/useData.ts
import { useDIContainer } from '@/core/di';
import { createDataServiceFromDI } from '@/core/dataservice';

export function useComplexData() {
  const container = useDIContainer();
  const dataService = createDataServiceFromDI(container);
  
  return useQuery(
    'complex-data',
    () => dataService.getData(),
    { staleTime: 10 * 60 * 1000 }
  );
}
```

### Hybrid Approach

```typescript
// src/features/hybrid-feature/hooks/useData.ts
import { createDataService } from '@/core/dataservice';
import { useDIContainer } from '@/core/di';

export function useHybridData() {
  const container = useDIContainer();
  
  // Get some dependencies from DI container
  const cache = container.get<ICacheProvider>(TYPES.CACHE_SERVICE);
  
  // Create service with factory using DI dependencies
  const dataService = createDataService(HybridDataService, {
    cache,
    webSocket: container.get<IWebSocketService>(TYPES.WEBSOCKET_SERVICE)
  });
  
  return useQuery(
    'hybrid-data',
    () => dataService.getData(),
    { staleTime: 7 * 60 * 1000 }
  );
}
```

## Best Practices

### 1. **Choose the Right Approach**
- **Factory**: Small features, simple dependencies, quick prototyping
- **DI Container**: Large features, complex dependencies, enterprise applications

### 2. **Configuration Management**
- Use environment-specific configurations
- Centralize cache strategies
- Make configuration reusable

### 3. **Testing Considerations**
- Factory: Easy to create test instances
- DI Container: Easy to mock dependencies
- Both approaches support testing

### 4. **Performance**
- Factory: No container lookup overhead
- DI Container: Slight overhead but better for complex scenarios

### 5. **Maintainability**
- Factory: Clear dependencies
- DI Container: Centralized dependency management

Both approaches are fully supported and can be used based on your specific needs and application complexity!
