# Development Guide

## 🎯 Overview

This comprehensive development guide provides everything developers need to work effectively with the QuietSpace Frontend codebase, including setup procedures, coding standards, architectural patterns, and best practices for enterprise-grade React development.

## ✅ Prerequisites

### Required Tools
- **Node.js**: 18+ (LTS version recommended)
- **npm**: 9+ or **yarn**: 1.22+
- **Git**: 2.30+
- **VS Code**: Recommended IDE with extensions
- **Docker**: 20+ (for containerized development)

### VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🚀 Getting Started

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/quietspace/QuietSpace-Frontend.git
cd QuietSpace-Frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev
```

### 2. Environment Configuration

Create `.env.local` for development-specific settings:

```env
# Development configuration
NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true

# Debug settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### 3. Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:debug         # Start with debug logging

# Building
npm run build            # Build for production
npm run build:analyze     # Analyze bundle size

# Testing
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
npm run format            # Format code with Prettier
npm run type-check        # Run TypeScript type checking

# Database
npm run db:seed           # Seed development database
npm run db:reset          # Reset database
```

## 🏗️ Project Structure

### Directory Overview

```
src/
├── app/                   # Application-level components
│   ├── App.tsx           # Main application component
│   ├── DIApp.tsx         # Dependency injection setup
│   └── styles/           # App-level styles
├── core/                  # Core functionality
│   ├── auth/            # Authentication system
│   ├── di/              # Dependency injection
│   ├── theme/           # Theme system
│   ├── query/           # Custom query system
│   └── utils/           # Utility functions
├── features/             # Feature modules
│   ├── auth/            # Authentication feature
│   ├── chat/            # Chat feature
│   ├── analytics/       # Analytics feature
│   ├── feed/            # Feed feature
│   ├── notifications/   # Notifications feature
│   ├── profile/         # Profile feature
│   └── search/          # Search feature
├── shared/               # Shared components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom hooks
│   ├── types/           # Shared types
│   └── utils/           # Shared utilities
└── types/               # Global type definitions
```

### Feature Structure Pattern

Each feature follows this standardized structure:

```
feature-name/
├── domain/                    # Business logic layer
│   ├── entities/            # Business entities
│   ├── repositories/        # Repository interfaces
│   ├── services/           # Domain services
│   └── types/              # Domain types
├── data/                     # Data access layer
│   ├── repositories/        # Repository implementations
│   ├── models/             # Data models
│   └── migrations/         # Database migrations
├── application/              # Application layer
│   ├── services/           # Application services
│   ├── hooks/              # React hooks
│   ├── stores/             # State management
│   └── dto/                # Data transfer objects
├── presentation/             # Presentation layer
│   ├── components/         # All React components (MANDATORY)
│   ├── hooks/              # Presentation hooks
│   └── styles/             # Feature-specific styles (MANDATORY)
├── di/                       # DI container
│   ├── container.ts         # Feature container
│   ├── types.ts            # DI types
│   └── index.ts            # Exports
└── __tests__/                 # Tests
    ├── unit/               # Unit tests
    ├── integration/        # Integration tests
    └── e2e/                # End-to-end tests
```

## 🔧 Development Workflow

### 1. Feature Development

#### Creating a New Feature

```bash
# Use the feature generator script
npm run generate:feature MyFeature

# Or create manually
mkdir -p src/features/myfeature/{domain,data,application,presentation,di,__tests__}
```

#### Feature Component Template

```typescript
// src/features/myfeature/presentation/components/MyComponent.tsx
import * as React from 'react';
import { useMyFeatureDI } from '../application/hooks/useMyFeatureDI';
import { styles } from '../styles/MyComponent.styles';

interface MyComponentProps {
  id: string;
  // Add other props
}

export const MyComponent: React.FC<MyComponentProps> = ({ id }) => {
  const { data, loading, error, updateData } = useMyFeatureDI(id);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data found</div>;
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{data.title}</h2>
      <p style={styles.description}>{data.description}</p>
      <button 
        style={styles.button}
        onClick={() => updateData({ ...data, updated: true })}
      >
        Update
      </button>
    </div>
  );
};

export default React.memo(MyComponent);
```

#### Feature Styles Template

```typescript
// src/features/myfeature/presentation/styles/MyComponent.styles.ts
import { CSSProperties } from 'react';

export const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  } as CSSProperties,
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827'
  } as CSSProperties,
  
  description: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#6b7280',
    marginBottom: '16px'
  } as CSSProperties,
  
  button: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  } as CSSProperties
} as const;
```

### 2. Dependency Injection

#### Service Registration

```typescript
// src/features/myfeature/di/container.ts
import { Container } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { MyFeatureService } from '../application/services/MyFeatureService';
import { MyFeatureRepository } from '../data/repositories/MyFeatureRepository';

export const createMyFeatureContainer = (): Container => {
  const container = Container.create();
  
  // Register repositories (transient)
  container.registerTransientByToken(
    TYPES.MY_FEATURE_REPOSITORY,
    MyFeatureRepository
  );
  
  // Register services (singleton)
  container.registerSingletonByToken(
    TYPES.MY_FEATURE_SERVICE,
    MyFeatureService
  );
  
  return container;
};
```

#### Hook Implementation

```typescript
// src/features/myfeature/application/hooks/useMyFeatureDI.ts
import { useService } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { MyFeatureService } from '../services/MyFeatureService';
import { MyFeatureRepository } from '../../data/repositories/MyFeatureRepository';

export const useMyFeatureDI = (id?: string) => {
  const service = useService<MyFeatureService>(TYPES.MY_FEATURE_SERVICE);
  const repository = useService<MyFeatureRepository>(TYPES.MY_FEATURE_REPOSITORY);
  
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      
      service.getData(id)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [id, service]);
  
  const updateData = async (updates: any) => {
    if (!id) return;
    
    try {
      setLoading(true);
      const updated = await service.updateData(id, updates);
      setData(updated);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data,
    loading,
    error,
    updateData
  };
};
```

### 3. Custom Query System Usage

#### Data Fetching

```typescript
// Using custom query system
import { useCustomQuery } from '@/core/query';

const { data, isLoading, error, refetch } = useCustomQuery(
  ['myfeature', id],
  () => myFeatureService.getData(id),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    onSuccess: (data) => {
      console.log('Data loaded:', data);
    },
    onError: (error) => {
      console.error('Error loading data:', error);
    }
  }
);
```

#### Data Mutation

```typescript
// Using custom mutation
import { useCustomMutation } from '@/core/query';

const { mutate, isLoading, error } = useCustomMutation(
  (data: CreateDataRequest) => myFeatureService.createData(data),
  {
    onSuccess: (result, variables) => {
      console.log('Data created:', result);
      // Invalidate related caches
      invalidateCache.invalidateFeature();
    },
    optimisticUpdate: (cache, variables) => {
      // Optimistic update logic
      const optimisticData = { ...variables, id: 'temp-id' };
      cache.set(['myfeature', 'temp-id'], optimisticData);
      
      return () => {
        // Rollback function
        cache.invalidate(['myfeature', 'temp-id']);
      };
    }
  }
);
```

## 📝 Coding Standards

### 1. TypeScript Guidelines

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

// Use union types for enums
type Theme = 'light' | 'dark' | 'auto';
type Status = 'pending' | 'loading' | 'success' | 'error';

// Use generics for reusable components
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

// Use utility types
type PartialUser = Partial<User>;
type UserWithoutId = Omit<User, 'id'>;
type UserWithRoles = User & { roles: Role[] };
```

#### Function Signatures

```typescript
// Use explicit return types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Use async/await with proper typing
async function fetchUser(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

// Use generic functions for reusability
function createRepository<T>(baseUrl: string): Repository<T> {
  return {
    findAll: () => api.get<T[]>(baseUrl),
    findById: (id: string) => api.get<T>(`${baseUrl}/${id}`),
    create: (data: T) => api.post<T>(baseUrl, data),
    update: (id: string, data: Partial<T>) => api.put<T>(`${baseUrl}/${id}`, data),
    delete: (id: string) => api.delete(`${baseUrl}/${id}`)
  };
}
```

### 2. React Component Guidelines

#### Functional Components

```typescript
// Use functional components with hooks
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUpdate, 
  className 
}) => {
  const { user, loading, error, updateUser } = useUserDI(userId);
  
  const handleUpdate = useCallback(async (updates: Partial<User>) => {
    const updated = await updateUser(updates);
    onUpdate?.(updated);
  }, [updateUser, onUpdate]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return (
    <div className={className}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => handleUpdate({ name: 'Updated Name' })}>
        Update Name
      </button>
    </div>
  );
};

// Use React.memo for optimization
export default React.memo(UserProfile);
```

#### Custom Hooks

```typescript
// Custom hooks for reusable logic
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);
  
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);
  
  return { data, loading, error, execute };
}
```

### 3. Styling Guidelines

#### Component Styles

```typescript
// Use CSS-in-JS with theme integration
import { useEnhancedTheme } from '@/core/theme';

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    backgroundColor: (props: { theme: EnhancedTheme }) => props.theme.colors.background.primary,
    borderRadius: (props: { theme: EnhancedTheme }) => props.theme.radius.lg,
    boxShadow: (props: { theme: EnhancedTheme }) => props.theme.shadows.md
  },
  
  title: {
    fontSize: (props: { theme: EnhancedTheme }) => props.theme.typography.fontSize.xl,
    fontWeight: (props: { theme: EnhancedTheme }) => props.theme.typography.fontWeight.bold,
    color: (props: { theme: EnhancedTheme }) => props.theme.colors.text.primary,
    marginBottom: (props: { theme: EnhancedTheme }) => props.theme.spacing.md
  },
  
  button: {
    padding: (props: { theme: EnhancedTheme }) => `${props.theme.spacing.sm} ${props.theme.spacing.lg}`,
    backgroundColor: (props: { theme: EnhancedTheme }) => props.theme.colors.brand[500],
    color: (props: { theme: EnhancedTheme }) => props.theme.colors.text.inverse,
    border: 'none',
    borderRadius: (props: { theme: EnhancedTheme }) => props.theme.radius.md,
    cursor: 'pointer',
    transition: (props: { theme: EnhancedTheme }) => `all ${props.theme.animation.duration.fast} ${props.theme.animation.easing.ease}`,
    
    '&:hover': {
      backgroundColor: (props: { theme: EnhancedTheme }) => props.theme.colors.brand[600],
    },
    
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  }
};
```

#### Responsive Design

```typescript
// Use responsive utilities
import { media } from '@/core/theme';

export const responsiveStyles = {
  container: {
    padding: '24px',
    
    // Mobile styles
    [media.mobile]: {
      padding: '16px'
    },
    
    // Tablet styles
    [media.tablet]: {
      padding: '20px'
    },
    
    // Desktop styles
    [media.desktop]: {
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto'
    }
  }
};
```

## 🧪 Testing Guidelines

### 1. Unit Testing

#### Component Testing

```typescript
// src/features/myfeature/__tests__/components/MyComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DIProvider } from '@/core/di';
import { MyComponent } from '../components/MyComponent';
import { createTestContainer } from '../__tests__/testUtils';

describe('MyComponent', () => {
  const testContainer = createTestContainer();
  
  it('should render component with data', async () => {
    const mockData = { id: '1', title: 'Test Title', description: 'Test Description' };
    
    render(
      <DIProvider container={testContainer}>
        <MyComponent id="1" />
      </DIProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });
  
  it('should handle update action', async () => {
    render(
      <DIProvider container={testContainer}>
        <MyComponent id="1" />
      </DIProvider>
    );
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(updateButton).toBeDisabled();
    });
  });
});
```

#### Hook Testing

```typescript
// src/features/myfeature/__tests__/hooks/useMyFeatureDI.test.ts
import { renderHook, act } from '@testing-library/react';
import { DIProvider } from '@/core/di';
import { useMyFeatureDI } from '../hooks/useMyFeatureDI';
import { createTestContainer } from '../__tests__/testUtils';

describe('useMyFeatureDI', () => {
  const testContainer = createTestContainer();
  
  it('should load data successfully', async () => {
    const { result } = renderHook(() => useMyFeatureDI('1'), {
      wrapper: ({ children }) => (
        <DIProvider container={testContainer}>
          {children}
        </DIProvider>
      )
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

### 2. Integration Testing

```typescript
// src/features/myfeature/__tests__/integration/MyFeature.integration.test.ts
import { render, screen } from '@testing-library/react';
import { DIProvider } from '@/core/di';
import { MyFeaturePage } from '../presentation/MyFeaturePage';
import { createTestContainer } from '../__tests__/testUtils';

describe('MyFeature Integration', () => {
  const testContainer = createTestContainer();
  
  it('should complete full user flow', async () => {
    render(
      <DIProvider container={testContainer}>
        <MyFeaturePage />
      </DIProvider>
    );
    
    // Test initial state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Feature Data')).toBeInTheDocument();
    });
    
    // Test user interaction
    const createButton = screen.getByText('Create New');
    fireEvent.click(createButton);
    
    // Test form submission
    const nameInput = screen.getByLabelText('Name');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(nameInput, { target: { value: 'Test Item' } });
    fireEvent.click(submitButton);
    
    // Verify result
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Guidelines

### 1. React Performance

#### Optimization Techniques

```typescript
// Use React.memo for component optimization
export const OptimizedComponent = React.memo(({ data }: { data: any[] }) => {
  return (
    <div>
      {data.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
});

// Use useMemo for expensive calculations
const ExpensiveComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  return <div>Total: {expensiveValue}</div>;
};

// Use useCallback for stable function references
const ComponentWithCallback: React.FC<{ onItemClick: (id: string) => void }> = ({ onItemClick }) => {
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <div>
      {items.map(item => (
        <Item key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  );
};

// Use lazy loading for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => (
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  </div>
);
```

### 2. Bundle Optimization

#### Code Splitting

```typescript
// Route-based code splitting
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Suspense>
  </Router>
);

// Feature-based code splitting
const AnalyticsDashboard = lazy(() => import('../features/analytics/AnalyticsDashboard'));
const ChatInterface = lazy(() => import('../features/chat/ChatInterface'));
```

## 📋 Git Workflow

### 1. Branch Strategy

```bash
# Main branches
main                    # Production
develop                 # Integration

# Feature branches
feature/user-authentication
feature/chat-real-time
feature/analytics-dashboard

# Release branches
release/v1.2.0

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug
```

### 2. Commit Guidelines

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```bash
feat(auth): add multi-factor authentication

- Implement TOTP authentication
- Add SMS verification option
- Update user profile with MFA settings
- Add MFA configuration UI

Closes #123

fix(chat): resolve memory leak in WebSocket connection

- Fix event listener cleanup
- Add proper connection disposal
- Update WebSocket service tests

refactor(analytics): optimize data processing performance

- Implement chunked processing for large datasets
- Add parallel processing for aggregations
- Reduce memory usage by 40%
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Performance impact considered
```

## 🔧 Debugging

### 1. Development Tools

#### React DevTools

```typescript
// Add component names for debugging
const MyComponent: React.FC = () => {
  return <div>Content</div>;
};
MyComponent.displayName = 'MyComponent';

// Use React Profiler for performance analysis
import { Profiler } from 'react';

const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  console.log('Component render:', { id, phase, actualDuration });
};

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

#### Custom Query Debugging

```typescript
// Enable query debugging
import { useCustomQuery } from '@/core/query';

const { data, isLoading, error } = useCustomQuery(
  ['users', userId],
  () => userService.getUser(userId),
  {
    // Enable debug mode
    debug: true,
    
    // Add custom logging
    onSuccess: (data) => {
      console.log('Query success:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  }
);
```

### 2. Performance Monitoring

#### React Performance

```typescript
// Use React DevTools Profiler
import { Profiler, onRenderCallback } from 'react';

const onRenderCallback: onRenderCallback = (id, phase, actualDuration) => {
  if (actualDuration > 16) { // More than one frame
    console.warn(`Slow render detected: ${id} took ${actualDuration}ms`);
  }
};

<Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
  <ExpensiveComponent />
</Profiler>

// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (renderCount.current > 1 && timeSinceLastRender < 100) {
      console.warn(`Component ${componentName} re-rendered quickly: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = now;
  });
  
  return renderCount.current;
};
```

## 📚 Resources

### Documentation
- [Architecture Overview](../architecture/ARCHITECTURE_OVERVIEW.md)
- [Enterprise Patterns](../architecture/ENTERPRISE_PATTERNS.md)
- [Feature Documentation](../features/)
- [Core Modules](../core-modules/)

### Tools and Libraries
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [styled-components](https://styled-components.com/)
- [Dependency Injection](https://github.com/inversify/InversifyJS)

### Best Practices
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

---

**Status: ✅ PRODUCTION READY**

This development guide provides comprehensive procedures and standards for effective development on the QuietSpace Frontend codebase.
