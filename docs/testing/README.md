# Test Directory Structure

This directory contains comprehensive tests for the QuietSpace Frontend core modules, organized to mirror the `src/core` directory structure.

## 📁 Directory Structure

```
test/
├── core/                          # Core module tests (mirrors src/core)
│   ├── auth/                      # Authentication module tests
│   │   └── __tests__/
│   │       ├── FeatureAuthService.test.ts
│   │       └── ... (moved from src/core/auth/__tests__)
│   ├── di/                        # Dependency Injection tests
│   │   └── __tests__/
│   │       └── DIFactory.test.ts
│   ├── network/                   # Network module tests
│   │   └── __tests__/
│   │       └── TokenProvider.test.ts
│   ├── cache/                     # Cache module tests
│   │   └── __tests__/
│   │       └── CacheProvider.test.ts
│   ├── theme/                     # Theme module tests
│   │   └── __tests__/ (moved from src/core/theme/__tests__)
│   ├── websocket/                 # WebSocket module tests
│   ├── services/                  # Services module tests
│   └── ...                        # Other core modules
├── components/                    # Component tests
├── hooks/                         # Hook tests
├── utils/                         # Utility tests
├── jest.config.js                 # Jest configuration
├── jest.setup.cjs                  # Jest setup file
├── run-tests.cjs                  # Test runner script
└── README.md                       # This file
```

## 📁 Files Overview

### **✅ Active Mocks**

#### `jest.d.ts`
- **Purpose**: TypeScript declarations for Jest
- **Usage**: Provides proper type support for Jest mocks and mock functions
- **Status**: ✅ **ACTIVE** - Essential for TypeScript testing

#### `sockjs-client.ts`
- **Purpose**: Mock for SockJS WebSocket library
- **Usage**: Used by WebSocket functionality and real-time features
- **Status**: ✅ **ACTIVE** - Required for WebSocket tests

#### `stompjs.ts`
- **Purpose**: Mock for STOMP messaging protocol library
- **Usage**: Used by chat and real-time messaging features
- **Status**: ✅ **ACTIVE** - Required for STOMP communication tests

## 🎯 Usage Guidelines

### **WebSocket Testing**
These mocks are essential for testing WebSocket-related functionality:
- Chat features
- Real-time notifications
- Live feed updates
- Enterprise WebSocket services

### **Import Pattern**
```typescript
// Mocks are automatically picked up by Jest
// No manual imports required for these mocks

// Example usage in tests
import { Client } from 'stompjs'; // Uses mock implementation
import SockJS from 'sockjs-client'; // Uses mock implementation
```

## 🚫 What NOT to Do

- **Don't remove** these files - they're actively used
- **Don't modify** without updating dependent tests
- **Don't add** new mocks here unless they're for external dependencies

## 📋 Maintenance

### **When to Update**
- When upgrading SockJS or STOMPJS versions
- When changing WebSocket implementation
- When Jest types need updates

### **Related Files**
- WebSocket tests in `test/core/websocket/`
- Feature WebSocket tests in `test/features/*/`
- Jest setup in `test/jest.setup.cjs`

---

**Status**: ✅ **MAINTAINED**  
**Last Updated**: January 27, 2026  
**Dependencies**: Jest, WebSocket features

---

## 🧪 Test Coverage

### ✅ Core Modules with Tests

| Module | Test Files | Coverage | Status |
|--------|------------|----------|--------|
| **DI Module** | 1 file | ✅ Factory Functions | **NEW** |
| **Network Module** | 1 file | ✅ TokenProvider | **NEW** |
| **Cache Module** | 1 file | ✅ CacheProvider | **NEW** |
| **Auth Module** | 15+ files | ✅ Comprehensive | **MOVED** |
| **Theme Module** | 1 file | ✅ Theme System | **MOVED** |
| **Feature Modules** | 25+ files | ✅ Good | **EXISTING** |

### 🎯 Test Categories

#### **1. Unit Tests**
- Factory function testing
- Service implementation testing
- Interface compliance testing
- Error handling validation

#### **2. Integration Tests**
- DI container integration
- Module interaction testing
- Cross-module dependency testing

#### **3. Black Box Pattern Tests**
- Interface compliance validation
- Factory function testing
- Implementation hiding verification

#### **4. Performance Tests**
- Service creation benchmarks
- Memory efficiency validation
- Operation speed testing

## 🚀 Running Tests

### **Option 1: Using the Test Runner Script**
```bash
cd test
node run-tests.cjs
```

### **Option 2: Using Jest Directly**
```bash
cd test
npx jest --config jest.config.js
```

### **Option 3: Running Specific Test Files**
```bash
cd test
npx jest core/di/__tests__/DIFactory.test.ts
npx jest core/network/__tests__/TokenProvider.test.ts
npx jest core/cache/__tests__/CacheProvider.test.ts
```

### **Option 4: Running Tests with Coverage**
```bash
cd test
npx jest --config jest.config.js --coverage
```

## 📊 Test Configuration

### **Jest Configuration** (`jest.config.js`)
- **Environment**: `jsdom` for DOM testing
- **Transform**: `ts-jest` for TypeScript
- **Module Mapping**: Absolute import support (`@/`, `@core/`, etc.)
- **Coverage**: 70% threshold for core modules
- **Setup**: Global mocks and utilities

### **Test Setup** (`jest.setup.cjs`)
- **Global Mocks**: `localStorage`, `fetch`, `IntersectionObserver`, etc.
- **Test Utilities**: Helper functions for common test patterns
- **Cleanup**: Automatic cleanup between tests

## 🎯 Test Patterns

### **Factory Function Testing**
```typescript
describe('Factory Functions', () => {
    it('should create service using factory', () => {
        const service = createService();
        expect(service).toBeDefined();
    });
});
```

### **Black Box Pattern Testing**
```typescript
describe('Black Box Compliance', () => {
    it('should hide implementation details', () => {
        expect(() => createService()).not.toThrow();
        // Implementation classes should not be directly accessible
    });
});
```

### **DI Integration Testing**
```typescript
describe('DI Integration', () => {
    it('should work with DI container', () => {
        const container = createContainer();
        const service = new Service(container);
        expect(service).toBeInstanceOf(Service);
    });
});
```

## 📈 Coverage Goals

### **Current Coverage Targets**
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Coverage Areas**
- **Core Modules**: `src/core/**/*.(ts|tsx)`
- **Shared Components**: `src/shared/**/*.(ts|tsx)`
- **Exclusions**: Stories, index files, type definitions

## 🔧 Test Utilities

### **Global Test Utils** (`testUtils`)
```typescript
// Create mock promises
testUtils.createMockPromise(data, shouldReject);

// Create mock async functions
testUtils.createMockAsync(returnValue, shouldReject);

// Wait for async operations
await testUtils.waitFor(ms);

// Create mock events
const event = testUtils.createMockEvent('click', { detail: data });
```

### **Common Mocks**
- **Storage**: `localStorage`, `sessionStorage`
- **Web APIs**: `fetch`, `IntersectionObserver`, `ResizeObserver`
- **Crypto**: `crypto.subtle` for authentication tests
- **Broadcast**: `BroadcastChannel` for cross-tab communication

## 🎯 Best Practices

### **1. Test Organization**
- Mirror `src/core` directory structure
- Group tests by functionality
- Use descriptive test names

### **2. Mocking Strategy**
- Mock external dependencies
- Use consistent mock patterns
- Clean up mocks between tests

### **3. Assertion Patterns**
- Test public interfaces only
- Validate Black Box compliance
- Include error scenarios

### **4. Performance Testing**
- Benchmark critical operations
- Test memory efficiency
- Validate service creation speed

## 🚀 Next Steps

### **Immediate (Completed)**
- ✅ Move existing tests from `src/core` to `test/core`
- ✅ Create missing tests for DI, Network, Cache modules
- ✅ Set up Jest configuration and utilities

### **Future Enhancements**
- [ ] Add WebSocket module tests
- [ ] Add Services module tests
- [ ] Increase coverage to 80%
- [ ] Add E2E tests for core workflows
- [ ] Add performance benchmarks

## 📋 Migration Status

### **✅ Completed**
- **Directory Structure**: Mirrors `src/core`
- **Existing Tests**: Moved from `src/core/__tests__`
- **New Tests**: Created for DI, Network, Cache modules
- **Configuration**: Jest setup and configuration
- **Utilities**: Test helpers and mocks

### **🔄 In Progress**
- **Test Coverage**: Increasing to 80%
- **Performance Tests**: Adding benchmarks
- **Integration Tests**: Cross-module testing

---

**Status**: ✅ **TEST INFRASTRUCTURE COMPLETE**  
**Coverage**: 70% (Target: 80%)  
**Next**: Add WebSocket and Services tests
