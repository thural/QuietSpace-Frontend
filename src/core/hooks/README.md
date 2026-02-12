# Core Hooks - Enterprise Edition

This directory contains all React hooks organized by category for better maintainability and separation of concerns.

## 📁 **Directory Structure**

```
core/hooks/
├── index.ts                    # Main export file
├── query/                      # Query Management Hooks
│   ├── index.ts
│   ├── useCustomQuery.ts
│   ├── useCustomMutation.ts
│   ├── useCustomInfiniteQuery.ts
│   ├── useQueryState.ts
│   └── useWebSocketCacheUpdater.ts
├── ui/                         # UI Integration Hooks
│   ├── index.ts
│   ├── theme/                   # Theme hooks
│   │   ├── index.ts
│   │   ├── themeHooks.ts
│   │   ├── utilityHooks.ts
│   │   └── useThemeEnhancement.ts
│   └── dependency-injection/   # DI hooks
│       ├── index.ts
│       └── ReactProvider.tsx
├── services/                   # Service Integration Hooks
│   ├── index.ts
│   ├── hooks.ts
│   └── migrationUtils.ts
└── feature/                    # Feature-Specific Hooks
    ├── index.ts
    ├── useAuthentication.ts
    └── useWebSocket.ts
```

## 🎯 **Hook Categories**

### **Query Management (`/query`)**
Enterprise-grade query hooks with caching and state management:
- `useCustomQuery` - Data fetching with caching
- `useCustomMutation` - Data mutations with optimistic updates
- `useCustomInfiniteQuery` - Pagination support
- `useQueryState` - Global query state management
- `useWebSocketCacheUpdater` - WebSocket cache integration

### **UI Integration (`/ui`)**
React integration hooks for UI components:
- **Theme hooks** (`/ui/theme`):
  - `useEnhancedTheme` - Theme context access
  - `useThemeSwitch` - Dynamic theme switching
  - `useThemeTokens` - Design token access
  - `useTheme` - Backward compatibility
  - `useResponsiveStyles` - Responsive styling utilities
  - `useThemeEnhancement` - Theme enhancement logic

- **Dependency Injection hooks** (`/ui/dependency-injection`):
  - `DIProvider` - DI context provider
  - `useDIContainer` - Container access
  - `useService` - Service resolution
  - `useTryService` - Safe service resolution
  - `useHasService` - Service existence check

### **Service Integration (`/services`)**
Hooks for accessing core services:
- `useCoreServices` - Access to all core services
- `useAuthService` - Authentication service access
- `useThemeService` - Theme service access
- `HookMigrationManager` - Migration utilities

### **Feature Hooks (`/feature`)**
Feature-specific hooks for enterprise functionality:
- **Authentication hooks**:
  - `useEnterpriseAuth` - Enterprise authentication
  - `useFeatureAuth` - Feature-based authentication
  - `useReactiveFeatureAuth` - Reactive feature auth

- **WebSocket hooks**:
  - `useEnterpriseWebSocket` - Enterprise WebSocket
  - `useFeatureWebSocket` - Feature-specific WebSocket
  - `useWebSocketConnection` - Connection management
  - `useWebSocketMetrics` - Performance metrics

## 📦 **Usage Examples**

### **Query Hooks**
```typescript
import { useCustomQuery, useCustomMutation } from '@/core/hooks/query';

const { data, isLoading, error } = useCustomQuery(
  ['users'],
  () => fetchUsers(),
  { staleTime: 5000 }
);

const { mutate } = useCustomMutation(
  (userData) => createUser(userData),
  {
    onSuccess: () => console.log('User created'),
    optimisticUpdate: (cache, userData) => {
      // Optimistic update logic
    }
  }
);
```

### **Theme Hooks**
```typescript
import { useThemeSwitch, useThemeTokens } from '@/core/hooks/ui/theme';

const { currentVariant, setVariant, availableVariants } = useThemeSwitch();
const theme = useThemeTokens();

const handleThemeChange = (variant: string) => {
  setVariant(variant);
};
```

### **DI Hooks**
```typescript
import { useService, useDIContainer } from '@/core/hooks/ui/dependency-injection';

const container = useDIContainer();
const authService = useService(IAuthService);

// Safe service access
const service = useTryService(IOptionalService);
const hasService = useHasService(IOptionalService);
```

### **Service Hooks**
```typescript
import { useAuthService, useThemeService } from '@/core/hooks/services';

const authService = useAuthService();
const themeService = useThemeService();

// Use services directly
const user = await authService.getCurrentUser();
const theme = await themeService.getCurrentTheme();
```

## 🔄 **Migration from Old Structure**

### **Before (Scattered across modules)**
```typescript
// Old imports from various locations
import { useCustomQuery } from '@/core/modules/hooks';
import { useThemeSwitch } from '@/core/modules/theming/hooks';
import { useDIContainer } from '@/core/modules/dependency-injection/providers';
```

### **After (Unified structure)**
```typescript
// New imports from unified location
import { useCustomQuery } from '@/core/hooks/query';
import { useThemeSwitch } from '@/core/hooks/ui/theme';
import { useDIContainer } from '@/core/hooks/ui/dependency-injection';

// Or import everything from main index
import { 
  useCustomQuery, 
  useThemeSwitch, 
  useDIContainer 
} from '@/core/hooks';
```

## 🎯 **Benefits of This Structure**

1. **Clean Separation**: Hooks organized by purpose and responsibility
2. **Better Discoverability**: Easy to find hooks by category
3. **Maintainability**: Clear structure for long-term maintenance
4. **Scalability**: Easy to add new hooks in appropriate categories
5. **Type Safety**: Full TypeScript support with proper exports
6. **Documentation**: Clear usage examples and API documentation

## 📈 **Breaking Changes**

This migration introduces breaking changes for external consumers:

### **Import Path Changes**
- All hook imports now use `@/core/hooks` as base path
- Category-specific imports available for better tree-shaking
- Main index exports all hooks for convenience

### **Module Changes**
- Core modules no longer export React hooks directly
- Service logic completely separated from React integration
- Better adherence to Black Box architecture pattern

## 🔧 **Development Guidelines**

### **Adding New Hooks**
1. Choose appropriate category (`query`, `ui`, `services`, `feature`)
2. Create hook file in appropriate directory
3. Update category index.ts exports
4. Update main index.ts if needed
5. Add documentation and examples

### **Hook Categories**
- **Query**: Data fetching, caching, state management
- **UI**: React integration, themes, DI providers
- **Services**: Core service access and integration
- **Feature**: Specific feature implementations

### **Best Practices**
- Keep hooks focused on single responsibility
- Use proper TypeScript types
- Include comprehensive JSDoc documentation
- Follow existing naming conventions
- Test hooks independently
