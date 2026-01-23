# Architecture Overview & Developer Onboarding

## 🏗️ Welcome to QuietSpace Architecture

This guide provides new developers with a comprehensive understanding of QuietSpace's large-scale modular multi-platform architecture, development patterns, and best practices for building scalable enterprise applications.

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Modular Design Principles](#modular-design-principles)
3. [Multi-Platform Strategy](#multi-platform-strategy)
4. [Scalability Guidelines](#scalability-guidelines)
5. [Developer Onboarding](#developer-onboarding)
6. [Development Workflow](#development-workflow)
7. [Best Practices](#best-practices)
8. [Custom Query System](#custom-query-system)

---

---

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │   Web App   │ │  Mobile App │ │ Desktop App │    │
│  │ (React/TS)  │ │ (React Native)│ │ (Electron)   │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────────┐
                    │  API Gateway│
                    │ (Express.js) │
                    └─────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ User Service│ │Content Service│ │Analytics     │    │
│  │             │ │             │ │Service       │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │Notification  │ │Search Service│ │Chat Service  │    │
│  │Service       │ │             │ │             │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ PostgreSQL   │ │    Redis    │ │ Elasticsearch│    │
│  │ (Primary)   │ │   (Cache)   │ │   (Search)   │    │
│  └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Core Architectural Patterns

1. **Microservices Architecture** - Independent, scalable services
2. **Domain-Driven Design** - Business logic separation
3. **Event-Driven Communication** - Asynchronous messaging
4. **Dependency Injection** - Loose coupling, testability
5. **Clean Architecture** - Layer separation and dependency inversion

### Technology Stack

**Frontend:**
- **React 18+** with TypeScript
- **React Native** for mobile
- **Electron** for desktop
- **JSS** for styling
- **React Router** for navigation

**Backend:**
- **Node.js** with TypeScript
- **Express.js** for API layer
- **PostgreSQL** for primary data
- **Redis** for caching
- **Elasticsearch** for search
- **RabbitMQ/Kafka** for messaging

**Infrastructure:**
- **Docker** for containerization
- **Kubernetes** for orchestration
- **AWS/GCP** for cloud services
- **Prometheus/Grafana** for monitoring

---

## 🔧 Modular Design Principles

### Feature-Based Architecture

```
src/
├── features/
│   ├── auth/              # Authentication feature
│   │   ├── domain/        # Business logic
│   │   ├── data/          # Data access
│   │   ├── application/   # Services
│   │   ├── presentation/  # UI components
│   │   └── di/           # DI container
│   ├── profile/           # User profile feature
│   ├── analytics/         # Analytics feature
│   ├── notifications/    # Notifications feature
│   └── chat/            # Chat feature
├── core/                 # Shared core functionality
│   ├── di/              # Dependency injection
│   ├── theme/           # Theme system
│   └── utils/           # Utilities
└── shared/               # Shared utilities
    ├── components/       # Reusable components
    ├── hooks/           # Custom hooks
    └── types/           # Shared types
```

### Module Structure Guidelines

Each feature module follows this standardized structure:

```
feature-name/
├── domain/                    # Business logic layer
│   ├── entities/            # Business entities
│   ├── repositories/        # Repository interfaces
│   ├── services/           # Domain services
│   └── types/              # Domain types
├── data/                     # Data access layer
│   ├── repositories/        # Repository implementations
│   ├── models/             # Database models
│   ├── migrations/         # Database migrations
│   └── seeds/              # Seed data
├── application/              # Application layer
│   ├── services/           # Application services
│   ├── hooks/              # React hooks
│   ├── stores/             # State management stores
│   ├── use-cases/          # Use cases
│   └── dto/                # Data transfer objects
├── presentation/             # Presentation layer
│   ├── components/         # All React components
│   │   ├── [component-name].tsx
│   │   └── subfolders/       # Component categories
│   ├── hooks/              # Presentation hooks
│   └── styles/             # Feature-specific styles
│       ├── [component-name].styles.ts
│       └── shared.styles.ts
├── di/                       # DI container
│   ├── container.ts         # Feature container
│   ├── types.ts            # DI types
│   └── index.ts            # Exports
└── __tests__/                 # Tests
    ├── unit/               # Unit tests
    ├── integration/        # Integration tests
    └── e2e/                # End-to-end tests
```

### Standardized Presentation Structure

**All features now follow consistent presentation organization:**

```
presentation/
├── components/         # All React components (no exceptions)
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── subfolder/
│       └── ComponentC.tsx
└── styles/             # Feature-specific styles (no cross-feature mixing)
    ├── ComponentA.styles.ts
    ├── ComponentB.styles.ts
    └── shared.styles.ts
```

**Key Principles:**
- **All components** must be in `components/` folder
- **All feature-specific styles** must be in `styles/` folder
- **Shared styles** remain in `src/styles/shared/`
- **No components** should be directly under `presentation/`
- **No feature-specific styles** should be in `src/styles/`

### Dependency Injection Architecture

```typescript
// Core DI System
interface Container {
  register<T>(token: string, implementation: T): void;
  resolve<T>(token: string): T;
  createScope(): Container;
}

// Feature Container
export const createAuthContainer = (): Container => {
  const container = Container.create();
  
  // Register repositories
  container.registerSingleton(IUserRepository, UserRepository);
  container.registerSingleton(IAuthRepository, AuthRepository);
  
  // Register services
  container.registerSingleton(IAuthService, AuthService);
  container.registerSingleton(IUserService, UserService);
  
  return container;
};

// Main App Container
export const createAppContainer = (): Container => {
  const appContainer = Container.create();
  
  // Register feature containers
  appContainer.registerChild('auth', createAuthContainer());
  appContainer.registerChild('analytics', createAnalyticsContainer());
  appContainer.registerChild('notifications', createNotificationsContainer());
  
  return appContainer;
};
```

---

## 📱 Multi-Platform Strategy

### Platform-Specific Implementations

**Web Platform:**
```typescript
// Web-specific components
export const WebLayout: React.FC = ({ children }) => {
  return (
    <div className="web-layout">
      <Header />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Web-specific hooks
export const useWebStorage = () => {
  return {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key)
  };
};
```

**Mobile Platform:**
```typescript
// React Native components
export const MobileLayout: React.FC = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>{children}</ScrollView>
      <TabBar />
    </SafeAreaView>
  );
};

// Mobile-specific hooks
export const useMobileStorage = () => {
  return {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem
  };
};
```

**Desktop Platform:**
```typescript
// Electron components
export const DesktopLayout: React.FC = ({ children }) => {
  return (
    <div className="desktop-layout">
      <TitleBar />
      <Sidebar />
      <main>{children}</main>
      <StatusBar />
    </div>
  );
};

// Desktop-specific hooks
export const useDesktopStorage = () => {
  const electron = window.require('electron');
  return {
    getItem: electron.ipcRenderer.invoke('storage-get'),
    setItem: electron.ipcRenderer.invoke('storage-set'),
    removeItem: electron.ipcRenderer.invoke('storage-remove')
  };
};
```

### Cross-Platform Abstractions

```typescript
// Platform detection
export const usePlatform = () => {
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'desktop'>('web');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      setPlatform('desktop');
    } else if (typeof window !== 'undefined' && 'ReactNative' in window) {
      setPlatform('mobile');
    } else {
      setPlatform('web');
    }
  }, []);

  return platform;
};

// Platform-agnostic storage hook
export const useStorage = () => {
  const platform = usePlatform();
  
  switch (platform) {
    case 'web':
      return useWebStorage();
    case 'mobile':
      return useMobileStorage();
    case 'desktop':
      return useDesktopStorage();
    default:
      return useWebStorage();
  }
};
```

---

## 📈 Scalability Guidelines

### Horizontal Scaling

**Service Scaling:**
```typescript
// Load balancer configuration
const serviceConfig = {
  userService: {
    instances: 5,
    loadBalancer: 'round-robin',
    healthCheck: '/health',
    resources: {
      cpu: '500m',
      memory: '512Mi'
    }
  },
  analyticsService: {
    instances: 3,
    loadBalancer: 'least-connections',
    healthCheck: '/health',
    resources: {
      cpu: '1000m',
      memory: '1Gi'
    }
  }
};
```

**Database Scaling:**
```sql
-- Read replicas for scaling
CREATE USER analytics_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE analytics TO analytics_readonly;
GRANT USAGE ON SCHEMA public TO analytics_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_readonly;

-- Connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

### Performance Optimization

**Caching Strategy:**
```typescript
// Multi-level caching
export class CacheManager {
  private l1Cache = new Map(); // Memory cache
  private l2Cache = new Redis();  // Redis cache
  private l3Cache = new Database(); // Database cache

  async get(key: string): Promise<any> {
    // L1: Memory cache (fastest)
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key);
    }

    // L2: Redis cache (fast)
    const l2Value = await this.l2Cache.get(key);
    if (l2Value) {
      this.l1Cache.set(key, l2Value);
      return l2Value;
    }

    // L3: Database cache (slow)
    const l3Value = await this.l3Cache.get(key);
    if (l3Value) {
      this.l2Cache.set(key, l3Value);
      this.l1Cache.set(key, l3Value);
      return l3Value;
    }

    return null;
  }
}
```

**Async Processing:**
```typescript
// Event-driven processing
export class EventProcessor {
  async processEvent(event: AnalyticsEvent): Promise<void> {
    // Queue for async processing
    await this.messageQueue.publish('analytics.events', event);

    // Return immediately
    return;
  }

  async handleBatchEvents(): Promise<void> {
    const events = await this.messageQueue.consume('analytics.events', 100);
    
    // Process in batch
    await this.analyticsRepository.insertMany(events);
    
    // Acknowledge processing
    await this.messageQueue.ack(events);
  }
}
```

### Monitoring and Observability

**Metrics Collection:**
```typescript
// Performance metrics
export class MetricsCollector {
  private metrics = new Map();

  recordResponseTime(endpoint: string, duration: number): void {
    const key = `response_time_${endpoint}`;
    this.updateMetric(key, duration);
  }

  recordErrorRate(service: string, error: boolean): void {
    const key = `error_rate_${service}`;
    this.updateMetric(key, error ? 1 : 0);
  }

  recordActiveUsers(count: number): void {
    this.updateMetric('active_users', count);
  }

  private updateMetric(key: string, value: number): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    this.metrics.get(key).push(value);
    
    // Keep only last 1000 values
    if (this.metrics.get(key).length > 1000) {
      this.metrics.get(key).shift();
    }
  }
}
```

---

## 👨‍💻 Developer Onboarding

### Day 1: Environment Setup

**1. Clone Repository:**
```bash
git clone https://github.com/quietspace/QuietSpace-Frontend.git
cd QuietSpace-Frontend
```

**2. Install Dependencies:**
```bash
# Install global tools
npm install -g @quietspace/cli typescript ts-node

# Install project dependencies
npm install

# Setup environment
cp .env.example .env
```

**3. Development Environment:**
```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Start development server
npm run dev

# Verify setup
open http://localhost:3000
```

### Day 2: Architecture Deep Dive

**1. Study Core Concepts:**
- Read [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
- Understand DI system and Clean Architecture
- Review feature structure and patterns

**2. Explore Codebase:**
```bash
# Explore feature structure
find src/features -type f -name "*.ts" | head -20

# Understand DI containers
find src -name "*container*" -type f

# Review existing services
find src -name "*service*" -type f | head -10
```

**3. Run Tests:**
```bash
# Run all tests
npm test

# Run specific feature tests
npm test -- --testPathPattern=auth

# Generate coverage report
npm run test:coverage
```

### Day 3: First Contribution

**1. Choose a Simple Task:**
- Fix a bug in existing feature
- Add a small enhancement
- Improve test coverage

**2. Follow Development Workflow:**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... development work ...

# Run tests
npm test

# Commit changes
git add .
git commit -m "feat(feature): add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

**3. Code Review Process:**
- Request code review from team
- Address feedback and suggestions
- Ensure all tests pass
- Update documentation if needed

### Week 1: First Feature Implementation

**1. Choose a Feature:**
- Small to medium complexity
- Well-defined requirements
- Good learning opportunity

**2. Implementation Steps:**
1. **Domain Layer:** Define entities and business logic
2. **Data Layer:** Implement repositories and data access
3. **Application Layer:** Create services and hooks
4. **Presentation Layer:** Build UI components
5. **DI Container:** Wire everything together
6. **Tests:** Write comprehensive tests
7. **Documentation:** Update relevant docs

**3. Review and Refactor:**
- Code review with senior developer
- Refactor based on feedback
- Ensure architectural compliance
- Update documentation

---

## 🔄 Development Workflow

### Git Workflow

**Branch Strategy:**
```
main                    # Production branch
├── develop             # Integration branch
├── feature/*           # Feature branches
├── hotfix/*            # Emergency fixes
└── release/*           # Release preparation
```

**Commit Guidelines:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(auth): add two-factor authentication
- Implement TOTP service
- Add QR code generation
- Update login flow

Closes #123
```

### Code Review Process

**1. Pull Request Template:**
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

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

**2. Review Criteria:**
- **Architecture Compliance:** Follows established patterns
- **Code Quality:** Clean, readable, maintainable
- **Test Coverage:** Adequate test coverage
- **Performance:** No performance regressions
- **Security:** No security vulnerabilities

---

## 📚 Best Practices

### Code Quality

**1. TypeScript Best Practices:**
```typescript
// Use interfaces for contracts
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

// Use generics for reusable code
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Use union types for enums
type Theme = 'light' | 'dark' | 'auto';
```

**2. React Best Practices:**
```typescript
// Use functional components with hooks
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { user, loading, error } = useUserDI(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return <div>{user.name}</div>;
};

// Use memo for optimization
export default React.memo(UserProfile);
```

**3. Performance Best Practices:**
```typescript
// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// Use useCallback for stable references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// Use lazy loading for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Security Best Practices

**1. Input Validation:**
```typescript
// Validate all inputs
const validateUserInput = (input: UserInput): ValidationResult => {
  const errors: string[] = [];
  
  if (!input.email?.includes('@')) {
    errors.push('Invalid email format');
  }
  
  if (input.password?.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  return { isValid: errors.length === 0, errors };
};
```

**2. Authentication & Authorization:**
```typescript
// Use JWT for authentication
const authenticateToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch (error) {
    return null;
  }
};

// Use role-based authorization
const authorizeUser = (user: User, requiredRole: Role): boolean => {
  return user.roles.includes(requiredRole);
};
```

### Testing Best Practices

**1. Unit Testing:**
```typescript
// Test pure functions
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const user = await userService.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

**2. Integration Testing:**
```typescript
// Test component integration
describe('User Profile Integration', () => {
  it('should render user profile with data', async () => {
    render(
      <DIProvider container={testContainer}>
        <UserProfile userId="test-user" />
      </DIProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Documentation Best Practices

**1. Code Documentation:**
```typescript
/**
 * Creates a new user in the system
 * @param userData - User data to create
 * @returns Promise<User> - Created user object
 * @throws ValidationError - When user data is invalid
 * @example
 * const user = await userService.create({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 */
async createUser(userData: CreateUserDto): Promise<User> {
  // Implementation
}
```

**2. API Documentation:**
```typescript
// Document API endpoints
/**
 * @api {post} /api/users Create user
 * @apiDescription Creates a new user account
 * @apiParam {string} name User's full name
 * @apiParam {string} email User's email address
 * @apiParam {string} password User's password
 * @apiSuccess {201} User created successfully
 * @apiError {400} Invalid user data
 * @apiError {409} User already exists
 */
```

---

## 🎯 Recent Architecture Improvements

### 2026 Refactoring Achievements

**Phase 1: Features Directory Refactoring**
- **Achieved 100% Clean Architecture compliance** across all 9 features
- **Fixed structural inconsistencies** in feed, profile, and search features
- **Completed missing architecture layers** in analytics and content features
- **Standardized component organization** following Clean Architecture principles

**Phase 2: Presentation Structure Standardization**
- **Implemented consistent presentation structure** across all features
- **Moved feature-specific styles** from `src/styles/` to feature `presentation/styles/` folders
- **Organized all components** under `presentation/components/` folders
- **Updated all import paths** to reflect new standardized structure

### Impact on Development Experience

**Before Refactoring:**
- Inconsistent directory structures across features
- Components scattered outside standard locations
- Feature-specific styles mixed with shared styles
- Difficult navigation and maintenance

**After Refactoring:**
- **Perfect consistency** across all 9 features
- **Predictable file locations** for easier development
- **Clear separation** of feature-specific vs shared styles
- **Improved maintainability** and onboarding experience

### Key Architectural Rules Established

1. **All components** must be in `presentation/components/` folders
2. **All feature-specific styles** must be in `presentation/styles/` folders
3. **Shared styles** remain in `src/styles/shared/`
4. **Consistent import patterns** across all features
5. **No exceptions** to structural standards

---

## 🚀 Getting Help

### Resources

**Documentation:**
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [API Documentation](./analytics/API.md)
- [Component Library](./analytics/Components.md)
- [Deployment Guide](./analytics/Deployment.md)

**Tools and Commands:**
```bash
# Development commands
npm run dev              # Start development server
npm run build            # Build for production
npm run test              # Run tests
npm run lint              # Run linting
npm run format            # Format code

# Docker commands
docker-compose up -d      # Start development services
docker-compose logs -f    # View logs
docker-compose down       # Stop services
```

**Getting Support:**
- **Slack:** #development-help channel
- **Email:** dev-support@quietspace.com
- **Documentation:** https://docs.quietspace.com
- **Wiki:** https://wiki.quietspace.com

---

## 🎯 Success Metrics

### Developer Onboarding Success

**Week 1 Goals:**
- ✅ Environment setup complete
- ✅ Basic architecture understanding
- ✅ First contribution merged
- ✅ Development workflow mastered

**Month 1 Goals:**
- ✅ Complete feature implementation
- ✅ Code review participation
- ✅ Documentation contributions
- ✅ Team integration complete

**Quarter 1 Goals:**
- ✅ Independent feature development
- ✅ Architecture improvement contributions
- ✅ Mentorship of new developers
- ✅ Cross-team collaboration

---

*Last updated: January 2026*
*Version: 1.0.0*
*Maintainers: QuietSpace Architecture Team*
