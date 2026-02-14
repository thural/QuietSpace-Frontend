# Complete Development Guide

## 🎯 Overview

This comprehensive guide covers all aspects of development in QuietSpace, including setup, coding standards, testing, deployment, and best practices.

**📖 Related Documentation**: 
- [Enterprise React Decoupling Guide](ENTERPRISE_REACT_DECOUPLING_GUIDE.md) - Class-based component architecture patterns
- [Quality Assurance Guide](QUALITY_ASSURANCE.md) - Testing and quality standards
- [Multiplatform Development Guide](MULTIPLATFORM_DEVELOPMENT.md) - Cross-platform development

---

## 📋 Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [Build & Deployment](#build--deployment)
6. [Performance Optimization](#performance-optimization)
7. [Security Guidelines](#security-guidelines)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## 🛠️ Development Environment Setup

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: v2.30.0 or higher
- **VS Code**: Latest version with recommended extensions
- **Docker**: v20.0.0 or higher (optional)

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/thural/QuietSpace-Frontend.git
cd QuietSpace-Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables:**
```env
# API Configuration
API_BASE_URL=http://localhost:3001
WEBSOCKET_URL=ws://localhost:3001

# Authentication
JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quitespace
REDIS_URL=redis://localhost:6379

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
ENABLE_CHAT=true

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

### **VS Code Setup**
Install these recommended extensions:
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript Importer**: Auto import suggestions
- **GitLens**: Git integration and blame
- **Thunder Client**: API testing
- **Docker**: Docker integration

**VS Code Settings (.vscode/settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

---

## 📁 Project Structure

### **High-Level Structure**
```
src/
├── app/                  # Application-level code
│   ├── components/       # App components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   └── providers/        # Context providers
├── core/                 # Core infrastructure
│   ├── auth/            # Authentication system
│   ├── cache/           # Caching system
│   ├── websocket/       # WebSocket system
│   ├── theme/           # Theme system
│   ├── network/         # Network layer
│   ├── services/        # Core services
│   └── di/              # Dependency injection
├── features/             # Feature modules
│   ├── auth/            # Authentication feature
│   ├── chat/            # Chat feature
│   ├── feed/            # Feed feature
│   ├── analytics/       # Analytics feature
│   └── profile/         # Profile feature
├── shared/               # Shared utilities
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants
│   └── types/           # Shared types
└── platform/             # Platform-specific code
    ├── web/             # Web-specific
    ├── mobile/          # Mobile-specific
    └── desktop/         # Desktop-specific
```

### **Feature Structure**
```
src/features/{feature}/
├── domain/               # Business logic
│   ├── entities/        # Business entities
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Domain services
│   └── types/           # Domain types
├── data/                 # Data access
│   ├── repositories/    # Repository implementations
│   ├── datasources/     # External data sources
│   └── mappers/         # Data transformation
├── application/          # Application layer
│   ├── services/        # Application services
│   ├── hooks/           # Application hooks
│   └── dto/             # Data transfer objects
├── presentation/         # UI layer
│   ├── components/      # UI components
│   ├── hooks/           # Presentation hooks
│   └── styles/          # Component styles
├── di/                   # DI container
│   ├── container.ts     # Feature container
│   ├── types.ts         # DI types
│   └── index.ts         # Exports
└── __tests__/            # Tests
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── e2e/             # End-to-end tests
```

---

## 📝 Coding Standards

### **TypeScript Guidelines**
```typescript
// ✅ CORRECT: Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ CORRECT: Generic types with constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// ❌ INCORRECT: Using 'any' type
interface UserProfile {
  id: any;
  name: any;
  email: any;
}
```

### **Component Standards**
```typescript
// ✅ CORRECT: Functional component with proper typing
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: UserProfile) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const { user, isLoading, error } = useUser(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
```

### **Hook Standards**
```typescript
// ✅ CORRECT: Custom hook with proper typing
const useUser = (userId: string) => {
  const userService = useService<IUserService>(TYPES.USER_SERVICE);
  
  const [state, setState] = useState<UserState>({
    user: null,
    isLoading: false,
    error: null
  });
  
  const loadUser = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await userService.getUser(userId);
      setState({ user, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
    }
  }, [userId, userService]);
  
  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId, loadUser]);
  
  return { ...state, loadUser };
};
```

### **Service Standards**
```typescript
// ✅ CORRECT: Service with dependency injection
@Injectable()
class UserService implements IUserService {
  constructor(
    private dataLayer: IDataLayer,
    private validator: IUserValidator
  ) {}
  
  async getUser(id: string): Promise<User | null> {
    const user = await this.dataLayer.getUser(id);
    return this.validator.sanitizeUser(user);
  }
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    const validation = await this.validator.validate(userData);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    return await this.dataLayer.createUser(userData);
  }
}
```

### **Naming Conventions**
```typescript
// Files and Directories
UserProfile.tsx          // Component (PascalCase)
useUser.ts              // Hook (camelCase)
UserService.ts          // Service (PascalCase)
user.types.ts           // Types (camelCase.types.ts)
USER_CONSTANTS.ts       // Constants (UPPER_SNAKE_CASE)

// Variables and Functions
const userProfile = getUserProfile(id);  // camelCase
const isAuthenticated = checkAuth();    // camelCase

// Classes and Interfaces
class UserService {}                      // PascalCase
interface IUserRepository {}             // PascalCase with I prefix
type AuthResult = {}                     // PascalCase

// Constants
const API_BASE_URL = 'https://api.example.com';  // UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;                     // UPPER_SNAKE_CASE
```

---

## 🧪 Testing Guidelines

### **Testing Strategy**
- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test service interactions
- **Component Tests**: Test React components
- **E2E Tests**: Test user workflows
- **Performance Tests**: Test performance metrics

### **Unit Testing**
```typescript
// Service Unit Test
describe('UserService', () => {
  let userService: UserService;
  let mockDataLayer: jest.Mocked<IDataLayer>;
  let mockValidator: jest.Mocked<IUserValidator>;
  
  beforeEach(() => {
    mockDataLayer = createMockDataLayer();
    mockValidator = createMockUserValidator();
    userService = new UserService(mockDataLayer, mockValidator);
  });
  
  describe('getUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John', email: 'john@example.com' };
      
      mockDataLayer.getUser.mockResolvedValue(expectedUser);
      mockValidator.sanitizeUser.mockReturnValue(expectedUser);
      
      // Act
      const result = await userService.getUser(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDataLayer.getUser).toHaveBeenCalledWith(userId);
      expect(mockValidator.sanitizeUser).toHaveBeenCalledWith(expectedUser);
    });
    
    it('should return null when user not found', async () => {
      // Arrange
      const userId = '123';
      mockDataLayer.getUser.mockResolvedValue(null);
      
      // Act
      const result = await userService.getUser(userId);
      
      // Assert
      expect(result).toBeNull();
      expect(mockDataLayer.getUser).toHaveBeenCalledWith(userId);
    });
  });
});
```

### **Component Testing**
```typescript
// Component Test
describe('UserProfile', () => {
  let mockUserService: jest.Mocked<IUserService>;
  
  beforeEach(() => {
    mockUserService = createMockUserService();
  });
  
  it('should render user profile', async () => {
    // Arrange
    const user = { id: '123', name: 'John', email: 'john@example.com' };
    mockUserService.getUser.mockResolvedValue(user);
    
    // Act
    const { getByText } = render(
      <DIProvider container={createTestContainer()}>
        <UserProfile userId="123" />
      </DIProvider>
    );
    
    // Assert
    expect(getByText('John')).toBeInTheDocument();
    expect(getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('should show loading state', () => {
    // Arrange
    mockUserService.getUser.mockReturnValue(new Promise(() => {}));
    
    // Act
    const { getByTestId } = render(
      <DIProvider container={createTestContainer()}>
        <UserProfile userId="123" />
      </DIProvider>
    );
    
    // Assert
    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### **Integration Testing**
```typescript
// Integration Test
describe('User Feature Integration', () => {
  let container: Container;
  let userService: IUserService;
  
  beforeEach(async () => {
    container = createTestContainer();
    userService = container.getByToken<IUserService>(TYPES.USER_SERVICE);
  });
  
  afterEach(() => {
    container.dispose();
  });
  
  it('should create and retrieve user', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    // Act
    const created = await userService.createUser(userData);
    const retrieved = await userService.getUser(created.id);
    
    // Assert
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(created.id);
    expect(retrieved!.name).toBe('John Doe');
  });
});
```

### **Test Utilities**
```typescript
// Test Container Factory
export function createTestContainer(): Container {
  const container = new Container();
  
  // Register mock services
  container.registerSingleton(TYPES.USER_SERVICE, (c) => 
    new MockUserService()
  );
  
  container.registerSingleton(TYPES.DATA_LAYER, (c) => 
    new MockDataLayer()
  );
  
  return container;
}

// Mock Factory
export function createMockUserService(): jest.Mocked<IUserService> {
  return {
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn()
  } as jest.Mocked<IUserService>;
}

// Test Helper
export function renderWithDI(
  component: React.ReactElement,
  container?: Container
): RenderResult {
  const testContainer = container || createTestContainer();
  
  return render(
    <DIProvider container={testContainer}>
      {component}
    </DIProvider>
  );
}
```

---

## 🏗️ Build & Deployment

### **Build Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### **Build Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/features': resolve(__dirname, 'src/features')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          core: ['@/core'],
          features: ['@/features']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

### **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
      - redis
  
  api:
    image: quitespace-api:latest
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/quitespace
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=quitespace
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: docker build -t quitespace-frontend:${{ github.sha }} .
      
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push quitespace-frontend:${{ github.sha }}
```

---

## ⚡ Performance Optimization

### **Code Splitting**
```typescript
// Lazy loading components
const LazyUserProfile = React.lazy(() => import('./UserProfile'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyUserProfile userId={userId} />
</Suspense>

// Route-based code splitting
const routes = [
  {
    path: '/profile',
    component: React.lazy(() => import('./pages/Profile'))
  },
  {
    path: '/chat',
    component: React.lazy(() => import('./pages/Chat'))
  }
];
```

### **Memoization**
```typescript
// React.memo for components
const UserProfile = React.memo<UserProfileProps>(({ user }) => {
  return <div>{user.name}</div>;
});

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((sum, item) => sum + item.value, 0);
}, [data]);

// useCallback for stable references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### **Performance Monitoring**
```typescript
// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  });
};

// Usage
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  usePerformanceMonitor('UserProfile');
  
  return <div>{user.name}</div>;
};
```

### **Bundle Optimization**
```typescript
// Bundle analyzer
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@/shared/ui'],
          utils: ['@/shared/utils']
        }
      }
    }
  }
});
```

---

## 🔒 Security Guidelines

### **Input Validation**
```typescript
// Input validation
const validateInput = (input: string, type: 'email' | 'username' | 'password'): boolean => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };
  
  return patterns[type].test(input);
};

// Sanitization
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};
```

### **Authentication Security**
```typescript
// Secure token storage
const TokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

// Secure API calls
const secureApiCall = async (url: string, options: RequestInit = {}) => {
  const token = TokenManager.getToken();
  
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, secureOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

### **Content Security Policy**
```typescript
// CSP implementation
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  font-src 'self';
  object-src 'none';
  media-src 'self';
  frame-src 'none';
`;

// Set CSP header
if (typeof window !== 'undefined') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = ContentSecurityPolicy;
  document.head.appendChild(meta);
}
```

---

## 🐛 Debugging & Troubleshooting

### **Common Issues**

#### **TypeScript Errors**
```typescript
// Error: Property 'user' does not exist on type 'UserState'
// Solution: Ensure proper type definitions
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}
```

#### **React Hook Errors**
```typescript
// Error: Too many re-renders
// Solution: Use useCallback for stable references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

#### **DI Container Errors**
```typescript
// Error: Service not registered
// Solution: Ensure service is registered before use
container.registerSingleton(TYPES.USER_SERVICE, (c) => 
  new UserService(c.get(TYPES.DATA_LAYER))
);
```

### **Debugging Tools**
```typescript
// Debug logger
const debug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Performance profiler
const profile = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  debug(`Starting ${name}`);
  
  try {
    const result = await fn();
    const end = performance.now();
    debug(`Completed ${name} in ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    debug(`Failed ${name} in ${(end - start).toFixed(2)}ms`, error);
    throw error;
  }
};
```

### **Troubleshooting Checklist**
- [ ] Check environment variables
- [ ] Verify API endpoints are accessible
- [ ] Check network connectivity
- [ ] Verify database connection
- [ ] Check for TypeScript errors
- [ ] Verify service registration
- [ ] Check for memory leaks
- [ ] Verify bundle size
- [ ] Check for security vulnerabilities
- [ ] Verify test coverage

---

## 📚 Additional Resources

### **Documentation**
- [Architecture Guide](../architecture/ARCHITECTURE_GUIDE.md)
- [Core Systems Guide](../core-modules/CORE_SYSTEMS_GUIDE.md)
- [Features Guide](../features/FEATURES_GUIDE.md)

### **Tools & Utilities**
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Storybook**: Component development
- **Bundle Analyzer**: Bundle size analysis

### **Learning Resources**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Development Status**: Production Ready
