# Black Box Architecture Quick Reference

## 🚀 Quick Start

### **Import Patterns**
```typescript
// ✅ CORRECT: Import interfaces and factories
import { createCacheService, type ICacheService } from '@/core/cache';
import { createAuthService, type IAuthService } from '@/core/auth';

// ❌ INCORRECT: Import implementation classes
import { CacheService, AuthService } from '@/core/modules';
```

### **Service Creation**
```typescript
// Use factory functions
const cacheService = createCacheService(config);
const authService = createAuthService(config);
const theme = createCustomTheme(themeConfig);
```

---

## 📦 Module Reference

### **Cache (`@/core/cache`)**
```typescript
import { createCacheService, type ICacheService } from '@/core/cache';

const cache = createCacheService({
  strategy: 'lru',
  maxSize: 1000
});
```

### **Auth (`@/core/auth`)**
```typescript
import { createDefaultAuthService, type EnterpriseAuthService } from '@/core/auth';

const auth = createDefaultAuthService({
  provider: 'jwt',
  tokenRefreshInterval: 300000
});
```

### **Theme (`@/core/theme`)**
```typescript
import { createCustomTheme, ThemeProvider, useTheme } from '@/core/theme';

const theme = createCustomTheme({
  name: 'corporate',
  overrides: { colors: { primary: '#1a73e8' } }
});
```

### **WebSocket (`@/core/websocket`)**
```typescript
import { createWebSocketService, type IWebSocketService } from '@/core/websocket';

const ws = createWebSocketService(container, {
  url: 'wss://api.example.com'
});
```

### **Services (`@/core/services`)**
```typescript
import { createLogger, type ILoggerService } from '@/core/services';

const logger = createLogger({
  level: 'info',
  enableConsole: true
});
```

### **DI (`@/core/di`)**
```typescript
import { Container, Injectable, type ServiceIdentifier } from '@/core/di';

const container = new Container();
container.register(TYPES.SERVICE, ServiceClass);
```

### **UI Components (`@/shared/ui/components`)**
```typescript
import { Button, Container, type ButtonProps } from '@/shared/ui/components';

const MyButton = () => (
  <Button variant="primary" size="md">
    Click Me
  </Button>
);
```

---

## 🔧 Development Commands

### **Validation**
```bash
# Check all modules
node complete-black-box-validation.cjs

# Check specific module
node auth-system-validation.cjs
node theme-system-validation.cjs
node ui-library-validation.cjs
```

### **Quality Checks**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test

# Build
npm run build
```

---

## 🎯 Common Patterns

### **Factory Function Pattern**
```typescript
export function createService(config?: ServiceConfig): IService {
  return new Service(config);
}
```

### **Interface Export Pattern**
```typescript
export type { IServiceInterface, ServiceConfig } from './interfaces';
```

### **Legacy Compatibility Pattern**
```typescript
export { ServiceClass as _ServiceClass } from './implementation';
```

---

## ⚠️ Common Mistakes to Avoid

### **1. Wildcard Exports**
```typescript
// ❌ DON'T
export * from './internal';

// ✅ DO
export { specificFunction, specificType } from './internal';
```

### **2. Implementation Exports**
```typescript
// ❌ DON'T
export { ServiceImplementation };

// ✅ DO
export type { IService } from './interfaces';
export { createService } from './factory';
```

### **3. Direct Class Imports**
```typescript
// ❌ DON'T
import { ServiceClass } from '@/core/service';

// ✅ DO
import { createService, type IService } from '@/core/service';
```

---

## 🛠️ Troubleshooting

### **Validation Failures**
```bash
# Check what's failing
node complete-black-box-validation.cjs

# Look for:
# - Wildcard exports
# - Missing factory functions
# - Implementation leakage
```

### **TypeScript Errors**
```bash
# Check types
npx tsc --noEmit

# Common fixes:
# - Add explicit type exports
# - Check import paths
# - Verify interface definitions
```

---

## 📚 Module Structure Template

```
src/core/[module]/
├── index.ts              # Clean exports only
├── factory.ts            # Factory functions
├── interfaces/           # Public types
│   └── index.ts
├── utils.ts              # Utility functions
├── constants.ts          # Constants
├── implementation/       # Hidden implementation
│   ├── Service.ts
│   └── Provider.ts
└── __tests__/            # Tests
    └── [module].test.ts
```

---

## 🎯 Success Checklist

Before committing, ensure:

- [ ] No wildcard exports (`export *`)
- [ ] Factory functions implemented
- [ ] Types properly exported
- [ ] Implementation hidden
- [ ] Validation passes
- [ ] Tests added
- [ ] Documentation updated

---

## 📞 Need Help?

1. Check this quick reference
2. Run validation scripts
3. Review full documentation
4. Check module examples
5. Ask team lead for guidance

---

*Quick Reference Version: 1.0*  
*Last Updated: January 26, 2026*
