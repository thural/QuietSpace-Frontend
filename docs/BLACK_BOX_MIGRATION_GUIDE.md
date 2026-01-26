# Black Box Migration Guide

## 🎯 Purpose

This guide helps developers migrate existing modules to the Black Box pattern or create new Black Box-compliant modules.

---

## 📋 Migration Checklist

### **Pre-Migration**
- [ ] Understand current module structure
- [ ] Identify public vs private APIs
- [ ] Run validation to see current state
- [ ] Backup current implementation

### **Migration Steps**
- [ ] Create interfaces for public APIs
- [ ] Create factory functions
- [ ] Update index.ts with clean exports
- [ ] Hide implementation details
- [ ] Add utility functions
- [ ] Add constants
- [ ] Create validation script
- [ ] Update tests
- [ ] Update documentation

### **Post-Migration**
- [ ] Run validation scripts
- [ ] Test all functionality
- [ ] Update dependent code
- [ ] Commit changes
- [ ] Update team documentation

---

## 🔄 Step-by-Step Migration Process

### **Step 1: Analyze Current Module**

```bash
# Check current exports
grep -r "export" src/core/mymodule/

# Find wildcard exports
grep -r "export \*" src/core/mymodule/

# Check implementation exposure
grep -r "export.*class" src/core/mymodule/
```

### **Step 2: Create Interface Structure**

```typescript
// src/core/mymodule/interfaces/index.ts
export interface IMyModuleService {
  method1(): ReturnType;
  method2(param: ParamType): Promise<ResultType>;
}

export interface MyModuleConfig {
  option1: string;
  option2?: number;
  option3?: boolean;
}

export type MyModuleResult = {
  success: boolean;
  data?: any;
  error?: string;
};
```

### **Step 3: Create Factory Functions**

```typescript
// src/core/mymodule/factory.ts
import { MyModuleService } from './implementation/MyModuleService';
import type { IMyModuleService, MyModuleConfig } from './interfaces';

export function createMyModuleService(config?: MyModuleConfig): IMyModuleService {
  const finalConfig = { ...defaultConfig, ...config };
  return new MyModuleService(finalConfig);
}

export function createDefaultMyModuleService(): IMyModuleService {
  return createMyModuleService();
}

export function createCustomMyModuleService(config: MyModuleConfig): IMyModuleService {
  return createMyModuleService(config);
}

export function createMockMyModuleService(): IMyModuleService {
  // Mock implementation for testing
  return {
    method1: () => mockResult,
    method2: async (param) => mockAsyncResult
  };
}
```

### **Step 4: Update Index with Clean Exports**

```typescript
// src/core/mymodule/index.ts
/**
 * My Module Black Box Index
 * 
 * Provides clean public API following Black Box pattern.
 */

// Public types
export type {
  IMyModuleService,
  MyModuleConfig,
  MyModuleResult
} from './interfaces';

// Factory functions
export {
  createMyModuleService,
  createDefaultMyModuleService,
  createCustomMyModuleService,
  createMockMyModuleService
} from './factory';

// Utility functions
export {
  validateMyModuleConfig,
  sanitizeMyModuleData,
  formatMyModuleResult
} from './utils';

// Constants
export {
  MY_MODULE_CONSTANTS,
  DEFAULT_MY_MODULE_CONFIG
} from './constants';

// Legacy exports (backward compatibility)
export {
  MyModuleService as _MyModuleService
} from './implementation/MyModuleService';
```

### **Step 5: Create Utility Functions**

```typescript
// src/core/mymodule/utils.ts
import type { MyModuleConfig, MyModuleResult } from './interfaces';

export function validateMyModuleConfig(config: any): string[] {
  const errors: string[] = [];
  
  if (!config || typeof config !== 'object') {
    errors.push('Config must be an object');
    return errors;
  }
  
  if (!config.option1 || typeof config.option1 !== 'string') {
    errors.push('option1 is required and must be a string');
  }
  
  return errors;
}

export function sanitizeMyModuleData(data: any): any {
  if (!data || typeof data !== 'object') {
    return {};
  }
  
  // Sanitize logic here
  return sanitizedData;
}

export function formatMyModuleResult(result: any): MyModuleResult {
  return {
    success: result.success || false,
    data: result.data,
    error: result.error
  };
}
```

### **Step 6: Create Constants**

```typescript
// src/core/mymodule/constants.ts
export const MY_MODULE_CONSTANTS = {
  DEFAULT_TIMEOUT: 5000,
  MAX_RETRIES: 3,
  API_ENDPOINT: '/api/mymodule'
};

export const DEFAULT_MY_MODULE_CONFIG = {
  option1: 'default',
  option2: 100,
  option3: true
};

export enum MyModuleStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
```

### **Step 7: Create Validation Script**

```typescript
// mymodule-validation.cjs
const fs = require('fs');
const path = require('path');

console.log('🧪 My Module Black Box Validation...\n');

// Test 1: Check files exist
const requiredFiles = [
  'src/core/mymodule/index.ts',
  'src/core/mymodule/factory.ts',
  'src/core/mymodule/interfaces/index.ts',
  'src/core/mymodule/utils.ts',
  'src/core/mymodule/constants.ts'
];

let filesExist = 0;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
    filesExist++;
  } else {
    console.log(`❌ ${file} missing`);
  }
}

// Test 2: Check Black Box compliance
const indexPath = 'src/core/mymodule/index.ts';
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const wildcardExports = (indexContent.match(/export \*/g) || []).length;
  const explicitExports = (indexContent.match(/export \{[^}]+\}/g) || []).length;
  const factoryFunctions = (indexContent.match(/create\w+/g) || []).length;
  
  console.log(`\n📊 Wildcard Exports: ${wildcardExports}`);
  console.log(`📊 Explicit Exports: ${explicitExports}`);
  console.log(`📊 Factory Functions: ${factoryFunctions}`);
  
  if (wildcardExports === 0 && explicitExports > 0) {
    console.log('✅ Black Box Compliant');
  } else {
    console.log('❌ Not Black Box Compliant');
  }
}

console.log(`\n📊 Files: ${filesExist}/${requiredFiles.length} exist`);

if (filesExist === requiredFiles.length) {
  console.log('\n🎉 MY MODULE BLACK BOX MIGRATION: SUCCESS!');
} else {
  console.log('\n⚠️ MY MODULE: NEEDS ATTENTION');
}
```

---

## 🔄 Before/After Examples

### **Before Migration**
```typescript
// src/core/mymodule/index.ts (OLD)
export * from './interfaces';
export * from './implementation';
export * from './utils';

// Usage (OLD)
import { MyModuleService, MyModuleConfig } from '@/core/mymodule';
const service = new MyModuleService(config);
```

### **After Migration**
```typescript
// src/core/mymodule/index.ts (NEW)
export type { IMyModuleService, MyModuleConfig } from './interfaces';
export { createMyModuleService } from './factory';

// Usage (NEW)
import { createMyModuleService, type IMyModuleService } from '@/core/mymodule';
const service: IMyModuleService = createMyModuleService(config);
```

---

## 🛠️ Common Migration Scenarios

### **Scenario 1: Simple Service Module**

**Current Structure:**
```
src/core/simpleservice/
├── index.ts (wildcard exports)
├── SimpleService.ts (implementation)
└── types.ts (interfaces)
```

**Migration Steps:**
1. Create `interfaces/index.ts`
2. Create `factory.ts`
3. Update `index.ts` with clean exports
4. Move `SimpleService.ts` to `implementation/`
5. Add `utils.ts` and `constants.ts`

### **Scenario 2: Complex Module with Sub-modules**

**Current Structure:**
```
src/core/complexmodule/
├── index.ts (mixed exports)
├── services/
├── providers/
├── utils/
└── types/
```

**Migration Steps:**
1. Consolidate interfaces into `interfaces/index.ts`
2. Create unified `factory.ts`
3. Update main `index.ts` with clean exports
4. Move implementations to `implementation/`
5. Create module-specific validation

### **Scenario 3: UI Component Module**

**Current Structure:**
```
src/shared/components/
├── index.ts (component exports)
├── Button.tsx
├── Input.tsx
└── types.ts
```

**Migration Steps:**
1. Create component interfaces
2. Add factory functions for components
3. Update `index.ts` with clean exports
4. Add utility functions
5. Maintain component API compatibility

---

## ⚠️ Migration Pitfalls to Avoid

### **1. Breaking Existing Imports**
```typescript
// ❌ DON'T: Change import paths without migration plan
export { NewServiceName } from './implementation';

// ✅ DO: Maintain backward compatibility
export { OldServiceName as _OldServiceName } from './implementation';
```

### **2. Missing Factory Functions**
```typescript
// ❌ DON'T: Export implementation directly
export { ServiceImplementation };

// ✅ DO: Always provide factory functions
export { createService } from './factory';
```

### **3. Incomplete Type Exports**
```typescript
// ❌ DON'T: Forget to export types
export { createService };

// ✅ DO: Export all public types
export type { IService, ServiceConfig } from './interfaces';
```

### **4. Wildcard Exports in Legacy**
```typescript
// ❌ DON'T: Keep wildcard exports
export * from './legacy';

// ✅ DO: Use explicit exports
export { LegacyFunction, LegacyType } from './legacy';
```

---

## 🧪 Testing Migration

### **Unit Tests**
```typescript
// __tests__/mymodule.test.ts
import { createMyModuleService, createMockMyModuleService } from '../index';

describe('MyModuleService', () => {
  it('should create service with factory', () => {
    const service = createMyModuleService();
    expect(service).toBeDefined();
  });

  it('should create mock service for testing', () => {
    const mockService = createMockMyModuleService();
    expect(mockService.method1()).toBeDefined();
  });
});
```

### **Integration Tests**
```typescript
// __tests__/mymodule.integration.test.ts
import { createMyModuleService } from '../index';

describe('MyModule Integration', () => {
  it('should work with real dependencies', async () => {
    const service = createMyModuleService(realConfig);
    const result = await service.method1();
    expect(result.success).toBe(true);
  });
});
```

---

## 📚 Post-Migration Tasks

### **1. Update Documentation**
- Update API documentation
- Add migration notes to README
- Update examples and tutorials

### **2. Update Dependent Code**
- Find all imports of the module
- Update to use new factory functions
- Test all dependent functionality

### **3. Team Communication**
- Announce migration completion
- Share migration guide
- Provide support during transition

### **4. Monitor Usage**
- Track adoption of new API
- Monitor for issues
- Collect feedback for improvements

---

## 🎯 Success Metrics

A successful migration should achieve:

- ✅ **0 wildcard exports**
- ✅ **Factory functions for all services**
- ✅ **Complete type exports**
- ✅ **Implementation hidden**
- ✅ **Backward compatibility maintained**
- ✅ **All tests passing**
- ✅ **Validation script passing**
- ✅ **Documentation updated**

---

## 📞 Getting Help

### **Resources**
- [Black Box Architecture Documentation](./BLACK_BOX_ARCHITECTURE.md)
- [Quick Reference Guide](./BLACK_BOX_QUICK_REFERENCE.md)
- [Validation Scripts](../complete-black-box-validation.cjs)

### **Support Process**
1. Check this migration guide
2. Run validation scripts
3. Review examples in this guide
4. Consult with team lead
5. Create issue for blocking problems

---

*Migration Guide Version: 1.0*  
*Last Updated: January 26, 2026*
