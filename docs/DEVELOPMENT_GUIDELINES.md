# Enhanced Multi-Platform Architecture - Development Guidelines

## 🏗️ Architecture Overview

This document provides comprehensive guidelines for developing with the enhanced multi-platform architecture using Dependency Injection (DI) and Clean Architecture patterns.

## 📋 Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Development Standards](#development-standards)
3. [DI System Usage](#di-system-usage)
4. [Component Development](#component-development)
5. [Style Guidelines](#style-guidelines)
6. [Testing Guidelines](#testing-guidelines)
7. [Performance Guidelines](#performance-guidelines)
8. [Git Workflow](#git-workflow)

---

## 🏗️ Architecture Principles

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Components, Hooks, UI Logic)      │
├─────────────────────────────────────────┤
│          Application Layer             │
│    (Services, Use Cases, Hooks)     │
├─────────────────────────────────────────┤
│             Data Layer                │
│  (Repositories, Data Sources, API)   │
├─────────────────────────────────────────┤
│            Domain Layer                │
│   (Entities, Business Logic, Rules)  │
└─────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Inversion**: High-level modules should not depend on low-level modules
2. **Single Responsibility**: Each class should have one reason to change
3. **Open/Closed**: Open for extension, closed for modification
4. **Interface Segregation**: Clients should not depend on unused interfaces
5. **Dependency Injection**: Use DI container for service management

---

## 📋 Development Standards

### TypeScript Configuration

```typescript
// Enable strict mode for type safety
{
  "compilerOptions": {
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Code Style

```typescript
// Use interfaces for contracts
interface IUserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}

// Use dependency injection decorators
@Injectable({ lifetime: 'singleton' })
export class UserService implements IUserService {
  constructor(@Inject(IUserRepository) private userRepository: IUserRepository) {}
}

// Use React hooks with DI
export const useUserDI = (userId?: string) => {
  const userService = useService(UserService);
  // Hook implementation
};
```

### Naming Conventions

- **Services**: `[Feature]Service` (e.g., `UserService`, `ProfileService`)
- **Repositories**: `[Feature]Repository` (e.g., `UserRepository`, `ProfileRepository`)
- **Hooks**: `use[Feature]DI` (e.g., `useUserDI`, `useProfileDI`)
- **Interfaces**: `I[Feature]Service`, `I[Feature]Repository`
- **Components**: PascalCase (e.g., `UserProfile`, `PostCard`)
- **Files**: kebab-case (e.g., `user-service.ts`, `profile-component.tsx`)

---

## 🔧 DI System Usage

### Service Registration

```typescript
// In ProductionApp.tsx or feature container
const container = Container.create();
container.registerSingleton(UserService);
container.registerSingleton(ProfileService);
```

### Service Implementation

```typescript
@Injectable({ lifetime: 'singleton' })
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository) private userRepository: IUserRepository
  ) {}

  async getUser(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
```

### Hook Usage

```typescript
// In components
const { user, loading, error, updateUser } = useUserDI(userId);

// Always handle loading and error states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Service Lifetimes

- **Singleton**: One instance per container (default for services)
- **Transient**: New instance per injection
- **Scoped**: One instance per request/component

---

## 🎨 Component Development

### Component Structure

```typescript
// Component file structure
src/features/[feature]/presentation/
├── components/
│   ├── [ComponentName].tsx
│   └── [ComponentName].styles.ts
├── hooks/
│   └── use[ComponentName].ts
└── index.ts
```

### Component Template

```typescript
import * as React from 'react';
import { use[Feature]DI } from '../application/hooks/use[Feature]DI';
import { styles } from './[ComponentName].styles';

interface [ComponentName]Props {
  // Props interface
}

export const [ComponentName]: React.FC<[ComponentName]Props> = ({ /* props */ }) => {
  const { data, loading, error } = use[Feature]DI();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div style={styles.container}>
      {/* Component JSX */}
    </div>
  );
};
```

### Responsive Design

```typescript
// Use responsive patterns
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// Render different layouts
return isMobile ? <MobileLayout /> : <WideLayout />;
```

---

## 🎨 Style Guidelines

### Style Separation

```typescript
// styles/[ComponentName].styles.ts
import { CSSProperties } from 'react';

export const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  }
} as const;
```

### Theme Integration

```typescript
// Use theme service for consistent styling
const { theme } = useThemeDI();

const styles = {
  container: {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#1a1a1a'
  }
};
```

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Feature.test.ts
import { render, screen } from '@testing-library/react';
import { DIProvider } from '@/core/di';
import { Container } from '@/core/di';
import { UserService } from '../services/UserService';

describe('UserService', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.create();
    container.registerSingleton(UserService);
  });

  it('should register service', () => {
    const service = container.resolve(UserService);
    expect(service).toBeInstanceOf(UserService);
  });
});
```

### Integration Tests

```typescript
// Feature.integration.test.ts
import { render, screen } from '@testing-library/react';
import { DIProvider } from '@/core/di';
import { FeatureComponent } from '../components/FeatureComponent';

describe('Feature Integration', () => {
  it('should render with DI services', () => {
    const container = Container.create();
    // Register test services
    
    render(
      <DIProvider container={container}>
        <FeatureComponent />
      </DIProvider>
    );
    
    expect(screen.getByText('Feature Content')).toBeInTheDocument();
  });
});
```

---

## ⚡ Performance Guidelines

### React Performance

```typescript
// Use React.memo for component optimization
export const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### DI Performance

```typescript
// Use appropriate service lifetimes
@Injectable({ lifetime: 'singleton' }) // For stateless services
@Injectable({ lifetime: 'scoped' })    // For per-request services
@Injectable({ lifetime: 'transient' }) // For per-use services
```

---

## 🔄 Git Workflow

### Branch Strategy

```
main                    # Production
├── develop             # Integration branch
├── feature/[name]     # Feature branches
├── hotfix/[name]      # Hotfix branches
└── release/[version]   # Release branches
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(auth): add user authentication with DI

- Implement UserService with dependency injection
- Add login and registration functionality
- Include error handling and validation

Closes #123
```

---

## 🚀 Getting Started

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd QuietSpace-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Create New Feature

```bash
# Create feature branch
git checkout -b feature/new-feature

# Create feature structure
mkdir -p src/features/new-feature/{domain,data,application,presentation}
```

### 3. Implement Feature

1. Define domain entities and interfaces
2. Implement repository pattern
3. Create service with DI
4. Build React hook
5. Develop presentation components
6. Add tests
7. Update documentation

### 4. Testing and Deployment

```bash
# Run tests
npm test

# Build for production
npm run build

# Deploy to staging/production
npm run deploy
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Dependency Injection Patterns](https://martinfowler.com/articles/injection.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

---

## 🤝 Contributing

1. Follow the architectural patterns outlined above
2. Write comprehensive tests for new features
3. Update documentation for API changes
4. Ensure code passes all linting and type checks
5. Submit pull requests with clear descriptions

---

*Last updated: January 2026*
*Version: 1.0.0*
