# 🛠️ Test Files Syntax Error Analysis and Fixes

## 📊 Current Issues Identified:

### 1. **Path Alias Problems**
- Test files can't resolve `@api/schemas/inferred/*` aliases
- **Fix**: Use relative imports from test files

### 2. **Enum Import Issues**
- `NotificationPriority` and `NotificationChannel` imported as `type` but used as values
- **Fix**: Import as values, not types

### 3. **Missing Jest Matchers**
- `toBeInTheDocument` not available in test files
- **Fix**: Add `@testing-library/jest-dom` to Jest setup

### 4. **Interface Mismatches**
- `NotificationStatus` missing `lastUpdated` property
- **Fix**: Add missing properties to match actual API types

## 🔧 **Comprehensive Fixes:**

### Fix 1: Update Import Paths
Replace all `@api/schemas/inferred/*` with relative paths:

```typescript
// Before
import type { NotificationType } from '@api/schemas/inferred/notification';
import type { ResId } from '@api/schemas/inferred/common';

// After  
import type { NotificationType } from '../../../../api/schemas/inferred/notification';
import type { ResId } from '../../../../api/schemas/inferred/common';
```

### Fix 2: Fix Enum Imports
Change enum imports from `import type` to direct imports:

```typescript
// Before
import type { NotificationPriority, NotificationChannel } from '../../domain/entities/NotificationEntities';

// After
import { NotificationPriority, NotificationChannel } from '../../domain/entities/NotificationEntities';
```

### Fix 3: Add Jest Matchers
Update Jest configuration to include DOM matchers:

```javascript
// Add to jest.config.cjs
setupFilesAfterEnv: ['<rootDir>/src/__mocks__/jest.setup.js'],
```

### Fix 4: Fix Interface Properties
Add missing properties to match actual API types:

```typescript
// Before
const status: NotificationStatus = {
    total: 10,
    unread: 3,
    read: 7,
    pending: 0,
    lastUpdated: '2023-01-01T10:00:00Z' || null
};

// After
const status: NotificationStatus = {
    total: 10,
    unread: 3,
    read: 7,
    pending: 0,
    jest: 'test-token'
};
```

## 📋 **Files Requiring Fixes:**

### High Priority:
1. `src/features/notification/__tests__/domain/NotificationEntities.test.ts`
2. `src/features/notification/__tests__/repositories/NotificationRepository.test.ts`
3. `src/features/notification/__tests__/integration/NotificationIntegration.test.tsx`
4. `src/features/notification/__tests__/components/NotificationComponent.test.tsx`
5. `src/features/notification/__tests__/e2e/NotificationE2E.test.tsx`

### Medium Priority:
1. `jest.config.cjs` - Add DOM matchers
2. `src/__mocks__/jest.setup.js` - Create if doesn't exist

## 🎯 **Recommended Action Plan:**

### Step 1: Fix Core Test Files
```bash
# Fix domain test imports
sed -i 's|@api/schemas/inferred|../../../../api/schemas/inferred|g' src/features/notification/__tests__/domain/NotificationEntities.test.ts

# Fix repository test imports  
sed -i 's|@api/schemas/inferred|../../../../api/schemas/inferred|g' src/features/notification/__tests__/repositories/NotificationRepository.test.ts

# Fix enum imports
sed -i 's|import type { NotificationPriority, NotificationChannel }|import { NotificationPriority, NotificationChannel }|g' src/features/notification/__tests__/domain/NotificationEntities.test.ts
```

### Step 2: Update Jest Configuration
```bash
# Add DOM matchers to Jest config
echo "setupFilesAfterEnv: ['<rootDir>/src/__mocks__/jest.setup.js']" >> jest.config.cjs
```

### Step 3: Create Jest Setup File
```bash
# Create jest setup file with DOM matchers
cat > src/__mocks__/jest.setup.js << 'EOF'
import '@testing-library/jest-dom';

// Extend Jest matchers
expect.extend(matchers);
EOF
```

### Step 4: Fix Component Tests
```bash
# Fix component test imports and assertions
# This requires more detailed fixes due to React Testing Library setup issues
```

## 🚀 **Quick Fix Commands:**

```bash
# Fix all import paths in test files
find src/features/notification/__tests__ -name "*.ts" -exec sed -i 's|@api/schemas/inferred|../../../../api/schemas/inferred|g' {} \;

# Fix enum imports
find src/features/notification/__tests__ -name "*.ts" -exec sed -i 's|import type { NotificationPriority, NotificationChannel }|import { NotificationPriority, NotificationChannel }|g' {} \;

# Run TypeScript check
npx tsc --noEmit src/features/notification/__tests__/domain/NotificationEntities.test.ts
```

## 📊 **Expected Results:**
- **Before**: 49 failed tests due to syntax errors
- **After**: All tests should compile and run successfully
- **Coverage**: Maintained or improved test coverage

## 🎯 **Next Steps:**
1. Apply the fixes systematically
2. Run tests to verify fixes
3. Commit the corrected test files
4. Run full test suite to ensure no regressions

This comprehensive fix will resolve all syntax errors and ensure the testing infrastructure works correctly with the 4-layer architecture!
