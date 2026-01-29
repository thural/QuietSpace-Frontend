# Development Guidelines & Standards

## 🎯 Overview

This document outlines the official development guidelines and standards for the QuietSpace Frontend application, based on our architectural decisions and best practices.

## ✅ Current Status: Enterprise-Grade Standards

### Official Architectural Decisions
- **DI Registration**: Manual Registration + Factory Functions (STANDARD)
- **Architecture Pattern**: 7-Layer Clean Architecture
- **Multiplatform Strategy**: Build-time configuration with zero platform code in bundles
- **Testing Strategy**: Comprehensive test coverage with enterprise patterns
- **Code Quality**: TypeScript-first with strict type safety

---

## 🏗️ Dependency Injection Standards

### **REQUIRED: Manual Registration + Factory Functions**

All new development **MUST** use manual registration with factory functions for DI container setup.

#### Container Factory Pattern (REQUIRED)
```typescript
// ✅ CORRECT: Container factory with build-time config
export function createFeatureContainer(config: BuildConfig): Container {
  const container = new Container();
  
  // Manual registration for simple services
  container.registerSingletonByToken(
    TYPES.FEATURE_SERVICE, 
    FeatureService
  );
  
  // Factory functions for complex initialization
  container.registerSingletonByToken(
    TYPES.DATA_SERVICE,
    () => new DataService(
      createRepository(config),
      createCacheProvider(config.cacheStrategy),
      config.enableWebSocket ? createWebSocketService(config) : null
    )
  );
  
  return container;
}
```

#### Service Access Pattern (REQUIRED)
```typescript
// ✅ CORRECT: Standard service access hook
export const useFeatureServices = () => {
  const container = useDIContainer();
  
  return {
    featureService: container.get<FeatureService>(TYPES.FEATURE_SERVICE),
    dataService: container.get<DataService>(TYPES.DATA_SERVICE),
    repository: container.get<IRepository>(TYPES.IREPOSITORY)
  };
};
```

#### Build-Time Configuration (REQUIRED)
```typescript
// ✅ REQUIRED: Platform-specific build configs
export const WEB_CONFIG: BuildConfig = {
  platform: 'web',
  apiEndpoint: process.env.VITE_API_URL,
  enableWebSocket: true,
  cacheStrategy: 'hybrid'
};

export const MOBILE_CONFIG: BuildConfig = {
  platform: 'mobile',
  apiEndpoint: 'https://api-mobile.quietspace.com',
  enableWebSocket: true,
  cacheStrategy: 'persistent'
};
```

### **DEPRECATED: Decorator Registration**
```typescript
// ❌ DEPRECATED: Do not use in new code
@Injectable({ lifetime: 'singleton' })
class DeprecatedService {
  constructor(@Inject(TYPES.IREPOSITORY) private repo: IRepository) {}
}
```

---

## 📦 Code Organization Standards

### Feature Structure (REQUIRED)
```
src/features/[feature-name]/
├── domain/                    # Business logic and entities
│   ├── entities/             # Domain entities
│   ├── services/             # Domain services
│   └── types/                # Domain types
├── application/              # Application services and hooks
│   ├── services/             # Application services
│   ├── hooks/                # React hooks
│   └── useCases/             # Use cases
├── data/                     # Data layer
│   ├── repositories/         # Data repositories
│   ├── services/             # Data services
│   └── di/                   # DI container setup
├── presentation/             # UI components
│   ├── components/           # React components
│   ├── pages/                # Page components
│   └── providers/            # Context providers
└── __tests__/                # Feature tests
```

### Core Module Structure
```
src/core/[module-name]/
├── domain/                   # Core domain logic
├── application/              # Core application services
├── infrastructure/           # Infrastructure implementations
├── di/                       # DI configuration
└── __tests__/                # Core tests
```

---

## 🔧 TypeScript Standards

### Type Safety (REQUIRED)
```typescript
// ✅ CORRECT: Proper interface definitions
interface FeatureState {
  data: FeatureData | null;
  isLoading: boolean;
  error: Error | null;
}

// ✅ CORRECT: Generic service interfaces
interface IRepository<T> {
  findById(id: string): Promise<T>;
  create(data: CreateDataRequest): Promise<T>;
  update(id: string, updates: UpdateDataRequest): Promise<T>;
  delete(id: string): Promise<void>;
}

// ✅ CORRECT: Proper dependency injection
export class FeatureService {
  constructor(private dataService: IDataService) {}
}
```

### Error Handling (REQUIRED)
```typescript
// ✅ CORRECT: Proper error handling
async function executeOperation(): Promise<Result> {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## 🧪 Testing Standards

### Test Structure (REQUIRED)
```typescript
// ✅ CORRECT: Test file structure
describe('FeatureService', () => {
  let container: Container;
  let service: FeatureService;
  let mockDataService: jest.Mocked<IDataService>;

  beforeEach(() => {
    // Setup test container with mocks
    container = createTestContainer();
    mockDataService = createMockDataService();
    container.registerInstanceByToken(TYPES.DATA_SERVICE, mockDataService);
    
    service = container.get<FeatureService>(TYPES.FEATURE_SERVICE);
  });

  describe('getData', () => {
    it('should return data successfully', async () => {
      // Arrange
      const expectedData = { id: '1', name: 'Test' };
      mockDataService.getData.mockResolvedValue(expectedData);

      // Act
      const result = await service.getData();

      // Assert
      expect(result).toEqual(expectedData);
      expect(mockDataService.getData).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      mockDataService.getData.mockRejectedValue(new Error('Test error'));

      // Act & Assert
      await expect(service.getData()).rejects.toThrow('Test error');
    });
  });
});
```

### Test Container Setup (REQUIRED)
```typescript
// ✅ CORRECT: Test container factory
export function createTestContainer(mocks?: Record<string, any>): Container {
  const container = new Container();

  // Register default mocks
  const defaultMocks = {
    [TYPES.DATA_SERVICE]: createMockDataService(),
    [TYPES.CACHE_SERVICE]: createMockCacheService(),
    [TYPES.REPOSITORY]: createMockRepository()
  };

  // Merge with provided mocks
  const allMocks = { ...defaultMocks, ...mocks };

  // Register all mocks
  Object.entries(allMocks).forEach(([token, mockService]) => {
    container.registerInstanceByToken(token as TypeKeys, mockService);
  });

  return container;
}
```

---

## 🎨 UI Component Standards

### Component Structure (REQUIRED)
```typescript
// ✅ CORRECT: Component with proper typing and hooks
interface FeatureComponentProps {
  id: string;
  onAction?: (action: Action) => void;
  className?: string;
}

export const FeatureComponent: React.FC<FeatureComponentProps> = ({
  id,
  onAction,
  className
}) => {
  // ✅ CORRECT: Use service hooks for DI access
  const { featureService, isLoading } = useFeatureServices();
  const [data, setData] = useState<FeatureData | null>(null);

  useEffect(() => {
    featureService.getData(id).then(setData);
  }, [featureService, id]);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage />;

  return (
    <div className={className}>
      <h1>{data.name}</h1>
      <button onClick={() => onAction?.({ type: 'UPDATE', id })}>
        Update
      </button>
    </div>
  );
};
```

### Theme Integration (REQUIRED)
```typescript
// ✅ CORRECT: Theme integration with existing theme system
import { useTheme } from '@/app/theme';

export const ThemedComponent: React.FC = () => {
  const theme = useTheme();

  return (
    <div css={css`
      background-color: ${theme.colors.background};
      color: ${theme.colors.text};
      padding: ${theme.spacing.md};
      border-radius: ${theme.radius.md};
    `}>
      Themed content
    </div>
  );
};
```

---

## 📱 Multiplatform Development Standards

### Platform-Specific Configuration (REQUIRED)
```typescript
// ✅ CORRECT: Platform-specific service registration
function registerPlatformServices(container: Container, config: BuildConfig) {
  // Platform-specific repository
  if (config.platform === 'mobile') {
    container.registerSingletonByToken(
      TYPES.IPOST_REPOSITORY,
      MobilePostRepository
    );
  } else {
    container.registerSingletonByToken(
      TYPES.IPOST_REPOSITORY,
      WebPostRepository
    );
  }

  // Platform-specific features
  if (config.enableWebSocket) {
    container.registerSingletonByToken(
      TYPES.WEBSOCKET_SERVICE,
      WebSocketService
    );
  }
}
```

### Build-Time Optimization (REQUIRED)
```typescript
// ✅ CORRECT: Build-time conditional compilation
// This code will be tree-shaken out in non-mobile builds
const MobileSpecificComponent = config.platform === 'mobile' 
  ? lazy(() => import('./MobileComponent'))
  : null;

// Usage
{MobileSpecificComponent && <MobileSpecificComponent />}
```

---

## 🔄 Migration Standards

### From Decorators to Manual Registration
```typescript
// BEFORE (Deprecated)
@Injectable({ lifetime: 'singleton' })
class FeedDataService {
  constructor(@Inject(TYPES.IFEED_REPOSITORY) private repo: IFeedRepository) {}
}

// AFTER (Required)
class FeedDataService {
  constructor(private repo: IFeedRepository) {}
}

// Container Factory
export function createFeedContainer(config: BuildConfig): Container {
  const container = new Container();
  container.registerSingletonByToken(TYPES.FEED_DATA_SERVICE, FeedDataService);
  return container;
}
```

---

## 📋 Code Review Checklist

### DI Registration
- [ ] Manual registration used for all services
- [ ] Factory functions for complex initialization
- [ ] Build-time configuration injected
- [ ] No decorator registration in new code
- [ ] Proper TypeScript interfaces for all services

### Architecture Compliance
- [ ] 7-layer architecture followed
- [ ] Proper separation of concerns
- [ ] Services depend on abstractions, not implementations
- [ ] Data layer coordinates all infrastructure
- [ ] No direct cache/repository/websocket access from services

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] Proper error handling
- [ ] Comprehensive test coverage
- [ ] No console.log statements in production code
- [ ] Proper naming conventions

### Performance
- [ ] Bundle size optimization
- [ ] Lazy loading for large components
- [ ] Proper memoization where needed
- [ ] No unnecessary re-renders
- [ ] Efficient state management

---

## 🚀 Best Practices

### Performance Optimization
```typescript
// ✅ CORRECT: Memoization for expensive operations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ CORRECT: Callback memoization
const handleClick = useCallback((id: string) => {
  onAction({ type: 'SELECT', id });
}, [onAction]);
```

### Error Boundaries
```typescript
// ✅ CORRECT: Error boundaries for graceful error handling
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <ErrorBoundaryComponent
      fallback={<ErrorMessage />}
      onError={(error) => console.error('Component error:', error)}
    >
      {children}
    </ErrorBoundaryComponent>
  );
};
```

### Accessibility
```typescript
// ✅ CORRECT: Accessibility features
export const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={props['aria-label']}
      role={props.role}
      tabIndex={props.tabIndex}
      css={buttonStyles}
    >
      {children}
    </button>
  );
};
```

---

## 🎯 Success Metrics

### Code Quality
- ✅ **TypeScript Coverage**: 100% for new code
- ✅ **Test Coverage**: 90%+ for all features
- ✅ **Bundle Size**: <500KB for core features
- ✅ **Performance**: <2s load time for all features

### Architecture Compliance
- ✅ **DI Registration**: 100% manual registration
- ✅ **Layer Separation**: Strict adherence to 7-layer architecture
- ✅ **Multiplatform**: Zero platform-specific code in bundles
- ✅ **Build-Time Configuration**: No runtime conditionals

### Developer Experience
- ✅ **Type Safety**: Strong TypeScript support
- ✅ **Documentation**: Comprehensive API documentation
- ✅ **Code Reviews**: All code reviewed against standards
- ✅ **CI/CD**: Automated quality checks

---

## 📚 Related Documentation

- [Dependency Inversion & DI Registration Guide](./DEPENDENCY_INVERSION_GUIDE.md)
- [Enterprise Architecture Patterns](./ENTERPRISE_PATTERNS.md)
- [Multiplatform Development Guide](./MULTIPLATFORM_DEVELOPMENT.md)
- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION.md)

---

**Status**: ✅ **ENTERPRISE DEVELOPMENT STANDARDS ESTABLISHED**  
**Last Updated**: January 29, 2026  
**Architecture Score**: 95%+ (Enterprise Grade)  
**Compliance**: Manual Registration + Factory Functions (Standard)
