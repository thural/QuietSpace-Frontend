# Troubleshooting Guide

> 🎯 **Common Issues and Solutions for QuietSpace Frontend Development**

This guide provides solutions to common problems, debugging techniques, and troubleshooting steps for QuietSpace Frontend development.

---

## 📋 **Table of Contents**

- [Development Environment Issues](#-development-environment-issues)
- [Build and Compilation Errors](#-build-and-compilation-errors)
- [Runtime Errors](#-runtime-errors)
- [Performance Issues](#-performance-issues)
- [Authentication Problems](#-authentication-problems)
- [Cache Issues](#-cache-issues)
- [UI Component Issues](#-ui-component-issues)
- [API and Network Issues](#-api-and-network-issues)
- [Testing Problems](#-testing-problems)
- [Debugging Techniques](#-debugging-techniques)

---

## 🛠️ **Development Environment Issues**

### **Issue: Node.js Version Compatibility**

**Problem**: 
```
Error: Node.js version X.X.X is not supported. Requires Node.js >= 18.0.0
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 18.20.0
nvm use 18.20.0

# Or download from nodejs.org
```

**Prevention**: Add `.nvmrc` file to project root:
```
18.20.0
```

### **Issue: Package Installation Failures**

**Problem**:
```
npm ERR! peer dep missing: react@^18.0.0
npm ERR! code ERESOLVE
```

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### **Issue: Port Already in Use**

**Problem**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

---

## 🔨 **Build and Compilation Errors**

### **Issue: TypeScript Compilation Errors**

**Problem**:
```
error TS2307: Cannot find module '@/core/cache' or its corresponding type declarations.
```

**Solution**:
1. **Check tsconfig.json paths**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/core/*": ["src/core/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

2. **Verify file exists**:
```bash
find src -name "cache" -type d
ls -la src/core/cache/
```

3. **Check import statement**:
```typescript
// Correct
import { createCacheProvider } from '@/core/cache';

// Incorrect
import { createCacheProvider } from './core/cache';
```

### **Issue: Module Resolution Errors**

**Problem**:
```
Error: Cannot resolve module 'styled-components'
```

**Solution**:
```bash
# Check if module is installed
npm list styled-components

# Install missing module
npm install styled-components

# Check for version conflicts
npm ls styled-components
```

### **Issue: ESLint Configuration Errors**

**Problem**:
```
Error: ESLint configuration in .eslintrc.js is invalid
```

**Solution**:
1. **Validate ESLint config**:
```bash
npx eslint --print-config .eslintrc.js
```

2. **Check for syntax errors** in config file
3. **Update to latest ESLint**:
```bash
npm install eslint@latest --save-dev
```

---

## 🚨 **Runtime Errors**

### **Issue: React Hydration Mismatch**

**Problem**:
```
Warning: Text content does not match. Server: "Client" Client: "Server"
```

**Solution**:
```typescript
// Use useEffect for client-only content
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) {
  return null; // or loading placeholder
}
```

### **Issue: Cannot Read Property of Undefined**

**Problem**:
```
TypeError: Cannot read properties of undefined (reading 'map')
```

**Solution**:
```typescript
// Add null checks
const items = data?.items || [];
const list = items.map(item => <li key={item.id}>{item.name}</li>);

// Or use optional chaining
const list = data?.items?.map(item => <li key={item.id}>{item.name}</li>);
```

### **Issue: Memory Leaks**

**Problem**: Application becomes slow over time, memory usage increases

**Solution**:
```typescript
// Clean up subscriptions and timers
useEffect(() => {
  const subscription = someService.subscribe();
  const timer = setInterval(() => {}, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);

// Use useCallback and useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething(data);
}, [data]);
```

---

## ⚡ **Performance Issues**

### **Issue: Slow Initial Load**

**Problem**: Application takes more than 3 seconds to load

**Solution**:
1. **Check bundle size**:
```bash
npm run build
npx vite-bundle-analyzer dist
```

2. **Implement code splitting**:
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

3. **Optimize images and assets**:
```typescript
// Use next/image or lazy loading
const LazyImage = ({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    loading="lazy" 
    decoding="async"
  />
);
```

### **Issue: Slow Re-renders**

**Problem**: Components re-render unnecessarily

**Solution**:
```typescript
// Use React.memo
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveTransform(item));
}, [data]);

// Use useCallback for stable references
const handleClick = useCallback((id) => {
  onItemClick(id);
}, [onItemClick]);
```

---

## 🔐 **Authentication Problems**

### **Issue: Login Fails Silently**

**Problem**: Login button shows loading but never completes

**Solution**:
```typescript
// Add error handling
const { login, error, isLoading } = useEnterpriseAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
  } catch (error) {
    console.error('Login failed:', error);
    // Show error to user
    setError(error.message);
  }
};

// Check network requests in browser dev tools
// Verify API endpoints are accessible
```

### **Issue: Token Expired**

**Problem**: User gets logged out unexpectedly

**Solution**:
```typescript
// Implement token refresh
const { refreshToken } = useEnterpriseAuth();

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      await refreshToken();
    } catch (error) {
      // Refresh failed, logout user
      logout();
    }
  }, 4 * 60 * 1000); // Every 4 minutes

  return () => clearInterval(interval);
}, []);
```

---

## 🗄️ **Cache Issues**

### **Issue: Cache Not Updating**

**Problem**: Data remains stale after updates

**Solution**:
```typescript
// Invalidate cache after mutations
const mutation = useCustomMutation(updateData, {
  onSuccess: () => {
    queryClient.invalidateQueries(['data-key']);
    queryClient.refetchQueries(['data-key']);
  }
});

// Or use optimistic updates
const mutation = useCustomMutation(updateData, {
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['data-key']);
    const previousData = queryClient.getQueryData(['data-key']);
    queryClient.setQueryData(['data-key'], newData);
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['data-key'], context.previousData);
  }
});
```

### **Issue: Cache Memory Leak**

**Problem**: Cache grows indefinitely

**Solution**:
```typescript
// Configure cache limits
const cache = createCacheProvider({
  maxSize: 1000,        // Max entries
  defaultTTL: 300000,    // 5 minutes
  cleanupInterval: 60000, // Clean up every minute
  enableLRU: true         // Enable LRU eviction
});

// Monitor cache size
useEffect(() => {
  const interval = setInterval(() => {
    const stats = cache.getStats();
    if (stats.size > 500) {
      console.warn('Cache size is large:', stats.size);
    }
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

---

## 🎨 **UI Component Issues**

### **Issue: Theme Not Applying**

**Problem**: Components don't use theme colors

**Solution**:
```typescript
// Check theme provider setup
import { ThemeProvider } from '@/core/theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// Use theme in styled components
const StyledComponent = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.primary};
  background-color: ${props => props.theme.colors.background.primary};
`;

// Or use theme hook
const { theme } = useEnhancedTheme();
```

### **Issue: Responsive Design Not Working**

**Problem**: Layout breaks on mobile devices

**Solution**:
```typescript
// Use responsive breakpoints
const StyledComponent = styled.div`
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 50%;
    padding: ${props => props.theme.spacing.md};
  }
`;

// Or use responsive utilities
import { media } from '@/core/theme';

const StyledComponent = styled.div`
  ${media.mobile(css`
    width: 100%;
  `)}
  
  ${media.tablet(css`
    width: 50%;
  `)}
`;
```

---

## 🌐 **API and Network Issues**

### **Issue: CORS Errors**

**Problem**:
```
Access to fetch at 'http://localhost:3001/api' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
```typescript
// Configure proxy in vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

// Or configure CORS on server
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### **Issue: Network Timeouts**

**Problem**: Requests timeout frequently

**Solution**:
```typescript
// Configure timeout in API client
const apiClient = axios.create({
  timeout: 10000, // 10 seconds
  retry: 3,
  retryDelay: (retryCount) => retryCount * 1000
});

// Or use custom timeout in queries
const { data } = useCustomQuery(
  ['api-data'],
  () => apiClient.get('/data'),
  {
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  }
);
```

---

## 🧪 **Testing Problems**

### **Issue: Test Fails with Module Resolution**

**Problem**:
```
Jest encountered an unexpected token
```

**Solution**:
```javascript
// Configure Jest for TypeScript and modules
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs']
};
```

### **Issue: Mock Not Working**

**Problem**: Mocked functions return undefined

**Solution**:
```typescript
// Proper mocking
import { useCustomQuery } from '@/core/query';

jest.mock('@/core/query', () => ({
  useCustomQuery: jest.fn()
}));

// In test
const mockUseCustomQuery = useCustomQuery as jest.MockedFunction<typeof useCustomQuery>;
mockUseCustomQuery.mockReturnValue({
  data: mockData,
  isLoading: false,
  error: null
});
```

---

## 🔍 **Debugging Techniques**

### **1. Browser DevTools**

**Console Debugging**:
```typescript
// Add console logs for debugging
console.log('Data:', data);
console.log('State:', { isLoading, error });
console.table(data); // For arrays/objects

// Use debugger statement
debugger; // Pauses execution in dev tools
```

**Network Tab**:
- Check API requests and responses
- Verify status codes and headers
- Monitor request timing

**Performance Tab**:
- Record performance profiles
- Identify bottlenecks
- Monitor memory usage

### **2. React DevTools**

**Component Profiling**:
```typescript
// Wrap components with Profiler
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <MyComponent />
</Profiler>
```

**State Inspection**:
- Install React DevTools browser extension
- Inspect component props and state
- View component hierarchy

### **3. VS Code Debugging**

**Launch Configuration**:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Next.js",
  "program": "${workspaceFolder}/node_modules/.bin/next",
  "args": ["dev"],
  "cwd": "${workspaceFolder}",
  "runtimeArgs": ["--inspect"],
  "env": {
    "NODE_OPTIONS": "--inspect"
  }
}
```

**Breakpoints**:
- Set breakpoints in TypeScript files
- Use conditional breakpoints
- Watch variables and expressions

---

## 📋 **Common Debugging Checklist**

### **Before Debugging**:
- [ ] Check browser console for errors
- [ ] Verify network requests in dev tools
- [ ] Check environment variables
- [ ] Verify dependencies are installed

### **During Debugging**:
- [ ] Use console.log strategically
- [ ] Set breakpoints in key functions
- [ ] Monitor component props and state
- [ ] Check API responses

### **After Debugging**:
- [ ] Remove debug console.log statements
- [ ] Add proper error handling
- [ ] Write tests for fixed issues
- [ ] Document the solution

---

## 🆘 **Getting Help**

### **Internal Resources**:
- [Development Guide](../development-guides/DEVELOPMENT_GUIDE.md)
- [API Documentation](../api/API_DOCUMENTATION.md)
- [Usage Examples](../examples/INTERACTIVE_EXAMPLES.md)

### **External Resources**:
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Stack Overflow](https://stackoverflow.com/)

### **Community Support**:
- Check GitHub issues for similar problems
- Search existing discussions
- Create detailed bug reports with reproduction steps

---

## 🚨 **Emergency Procedures**

### **Production Issues**:
1. **Check error monitoring dashboard**
2. **Review recent deployments**
3. **Check system health metrics**
4. **Rollback if necessary**

### **Development Blockers**:
1. **Check git status for uncommitted changes**
2. **Try resetting to known good state**
3. **Ask team members for help**
4. **Create minimal reproduction case**

---

**🎯 This troubleshooting guide provides solutions to the most common issues encountered during QuietSpace Frontend development. Use it as your first reference when encountering problems.**

---

*Last Updated: January 26, 2026*  
*Troubleshooting Version: 1.0.0*  
*Status: ✅ PRODUCTION READY*
