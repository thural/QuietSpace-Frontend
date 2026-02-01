# Feed Data Directory Structure

## 📁 **Organization Overview**

The Feed data directory is organized into clear subdirectories to separate concerns and improve maintainability:

```
src/features/feed/data/
├── cache/              # Caching strategies and configurations
├── di/                  # Dependency injection configuration
├── hooks/               # React hooks for data access
├── models/              # Data models and types
├── repositories/        # Repository implementations
├── services/            # Data services
├── utils/               # Utility functions
└── index.ts             # Barrel exports
```

---

## 📂 **Directory Details**

### **`cache/`**
- **Purpose**: Caching strategies and configurations for feed data
- **Contents**: Cache configurations, TTL settings, cache keys
- **Usage**: Optimizes data retrieval and reduces API calls

### **`di/`**
- **Purpose**: Dependency injection configuration and factory functions
- **Contents**: 
  - `index.ts` - Main DI exports and factory functions
  - `FeedDataServicesDI.ts` - Service registration and creation
- **Usage**: Centralizes DI setup for all feed data services

### **`hooks/`**
- **Purpose**: React hooks for data access and state management
- **Contents**: Custom hooks for posts, comments, feeds
- **Usage**: Provides clean API for components to access data

### **`models/`**
- **Purpose**: Data models, types, and interfaces
- **Contents**: TypeScript interfaces, enums, type definitions
- **Usage**: Type safety and data contracts

### **`repositories/`**
- **Purpose**: Repository implementations for data access
- **Contents**: 
  - `PostRepository.ts` - Post data access
  - `CommentRepository.ts` - Comment data access
  - `MockPostRepository.ts` - Testing implementation
- **Usage**: Abstracts data source details

### **`services/`**
- **Purpose**: Business logic and data service orchestration
- **Contents**:
  - `FeedDataService.ts` - Main feed service
  - `PostDataService.ts` - Post-specific operations
  - `CommentDataService.ts` - Comment operations
- **Usage**: Coordinates between repositories and cache

### **`utils/`**
- **Purpose**: Utility functions and helpers
- **Contents**: Data transformation, validation, formatting
- **Usage**: Shared utility functions across the data layer

---

## 🔄 **Data Flow Architecture**

```
Component Layer
     ↓ (uses hooks)
Hooks Layer
     ↓ (calls services)
Services Layer
     ↓ (uses repositories)
Repository Layer
     ↓ (accesses cache/API)
Cache/API Layer
```

---

## 🛠️ **DI Configuration**

### **Service Registration**
```typescript
import { registerFeedDataServices } from '@/features/feed/data/di';

// Register all feed data services
registerFeedDataServices(container);
```

### **Factory Functions**
```typescript
import { createFeedDataService } from '@/features/feed/data/di';

// Create service instances manually
const feedService = createFeedDataService(container);
```

### **Service Access**
```typescript
import { useFeedDataService } from '@/features/feed/data/hooks';

// Use in components
const feedService = useFeedDataService();
```

---

## 📊 **Key Benefits**

### **✅ Clear Separation**
- **DI Logic**: Isolated in `di/` folder
- **Business Logic**: In `services/` folder
- **Data Access**: In `repositories/` folder
- **UI Integration**: In `hooks/` folder

### **✅ Maintainability**
- **Easy Navigation**: Clear directory structure
- **Focused Changes**: Each folder has specific purpose
- **Reduced Coupling**: Dependencies managed through DI

### **✅ Testability**
- **Mock Repositories**: Separate for testing
- **DI Configuration**: Easy to override for tests
- **Isolated Services**: Each service can be tested independently

---

## 🎯 **Usage Examples**

### **Using Data Services**
```typescript
import { useFeedDataService } from '@/features/feed/data';

const FeedComponent = () => {
  const feedService = useFeedDataService();
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => feedService.getFeedPosts()
  });
  
  return <PostList posts={posts} />;
};
```

### **DI Configuration**
```typescript
import { FeedDataServicesDI } from '@/features/feed/data/di';

const setupFeedServices = (container: Container) => {
  // Auto-register via decorators
  FeedDataServicesDI.registerFeedDataServices(container);
  
  // Or create manually
  const feedService = FeedDataServicesDI.createFeedDataService(container);
};
```

---

## 📋 **Development Guidelines**

### **Adding New Services**
1. Create service in `services/` folder
2. Add DI factory function in `di/` folder
3. Export from `services/index.ts`
4. Update main `data/index.ts` if needed

### **Adding New Repositories**
1. Create interface in `domain/entities/`
2. Implement in `repositories/` folder
3. Add mock implementation for testing
4. Register in DI configuration

### **Adding New Hooks**
1. Create hook in `hooks/` folder
2. Use DI to get service instances
3. Export from hooks index
4. Document usage examples

---

## 🔧 **Configuration**

### **Cache Configuration**
```typescript
// cache/index.ts
export const FEED_CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100,
  STRATEGY: 'LRU'
} as const;
```

### **DI Configuration**
```typescript
// di/index.ts
export const FEED_DI_CONFIG = {
  USE_MOCKS: process.env.NODE_ENV === 'test',
  CACHE_ENABLED: true,
  WEBSOCKET_ENABLED: true
} as const;
```

---

## 📚 **Related Documentation**

- [Feed Feature Architecture](../../README.md)
- [Auth Separation Architecture](../../../docs/architecture/AUTH_SEPARATION_ARCHITECTURE.md)
- [DI Container Guidelines](../../../docs/architecture/DI_GUIDELINES.md)
- [Testing Best Practices](../../../docs/testing/best-practices.md)

---

## ✅ **Summary**

This reorganized structure provides:

- **Clear Organization**: Each folder has specific responsibilities
- **DI Centralization**: All DI logic in dedicated folder
- **Easy Maintenance**: Clear boundaries and dependencies
- **Better Testing**: Isolated components and easy mocking
- **Scalable Structure**: Easy to add new services and repositories

The DI folder specifically centralizes all dependency injection concerns, making it easier to manage service lifecycles and configurations.
