# Profile Feature Testing Infrastructure

This directory contains comprehensive testing infrastructure for the Profile feature, including utilities, fixtures, mocks, and helpers to ensure reliable and maintainable tests.

## 📁 Directory Structure

```
__tests__/
├── utils/                    # Test utilities and helper functions
│   └── testUtils.ts         # Common test utilities and factories
├── fixtures/                 # Test data fixtures
│   └── profileFixtures.ts   # Pre-defined test data
├── helpers/                  # Test helpers and setup functions
│   └── testHelpers.ts       # Common test patterns
├── mocks/                    # API and service mocks
│   └── apiMocks.ts          # API mocking utilities
├── integration/              # Integration tests
│   └── Profile.integration.test.tsx
├── performance/             # Performance tests
│   └── Profile.performance.test.tsx
├── di/                      # Dependency injection tests
│   ├── ProfileContainer.test.ts
│   └── ProfileContainerSetup.test.ts
├── Profile.test.tsx          # Main feature tests
├── AdvancedStateManagement.test.ts  # Advanced state tests
├── setupTests.ts             # Test setup configuration
├── jest.config.js            # Jest configuration
├── runTests.js              # Test runner script
└── README.md                # This file
```

## 🛠️ Test Utilities

### MockDataFactory

Creates mock entities for testing:

```typescript
import { MockDataFactory } from '../utils/testUtils';

const userProfile = MockDataFactory.createUserProfile({
  username: 'testuser',
  isVerified: true
});

const userStats = MockDataFactory.createUserStats({
  followersCount: 1000
});
```

### PerformanceUtils

Performance testing utilities:

```typescript
import { PerformanceUtils } from '../utils/testUtils';

const { result, averageTime } = await PerformanceUtils.measureTime(
  () => expensiveOperation(),
  100
);

await PerformanceUtils.expectExecutionTime(
  () => fastOperation(),
  100 // max time in ms
);
```

### StateUtils

State testing utilities:

```typescript
import { StateUtils } from '../utils/testUtils';

const mockState = StateUtils.createMockStoreState({
  userProfile: customProfile
});

await StateUtils.waitForStateUpdate(
  getState,
  (state) => state.isLoading === false
);
```

## 📊 Test Fixtures

Pre-defined test data for common scenarios:

```typescript
import {
  baseUserProfile,
  privateUserProfile,
  highEngagementStats,
  completeProfile
} from '../fixtures/profileFixtures';
```

Available fixtures:
- `baseUserProfile` - Standard public user profile
- `privateUserProfile` - Private account profile
- `unverifiedUserProfile` - Unverified user profile
- `baseUserStats` - Standard user statistics
- `highEngagementStats` - High engagement metrics
- `newUserStats` - New user statistics
- `baseUserConnection` - Standard user connection
- `oneWayConnection` - One-way following
- `mutualConnection` - Mutual connection
- `publicProfileAccess` - Public profile access
- `privateBlockedAccess` - Blocked private profile
- `ownProfileAccess` - Own profile access
- `completeProfile` - Complete profile with all data

## 🧪 Test Helpers

Common test patterns and setup:

```typescript
import {
  setupMockRepository,
  createTestHook,
  setupTestEnvironment,
  runIntegrationTest
} from '../helpers/testHelpers';

// Setup test environment
const { userId, repository, cleanup } = createTestContext({
  userId: 'test-user-123',
  setupMocks: true
});

// Create test hook with mocked dependencies
const { hook, repository } = createTestHook(
  (repo) => () => useProfile(userId, { repository: repo })
);

// Run integration test
await runIntegrationTest(
  () => setupTestContext(),
  async (context) => {
    await context.repository.followUser('user-456');
  },
  (context) => {
    expect(context.repository.isFollowing('user-456')).toBe(true);
  }
);
```

## 🔧 API Mocks

Mock API responses for testing:

```typescript
import { profileApiServer, mockApiResponses } from '../mocks/apiMocks';

// Start mock server
beforeAll(() => {
  profileApiServer.listen();
});

afterAll(() => {
  profileApiServer.close();
});

// Use mock responses
const mockResponse = mockApiResponses.getProfile('user-123');
```

## 📋 Test Categories

### Unit Tests
- Domain logic tests
- Repository tests
- Service tests
- Hook tests

### Integration Tests
- End-to-end workflows
- API integration
- State management integration

### Performance Tests
- Rendering performance
- API response times
- State update performance

### Advanced State Management Tests
- Optimistic updates
- Background sync
- Real-time features
- Cache management

## 🚀 Running Tests

### Run All Profile Tests
```bash
npm test src/features/profile/__tests__
```

### Run Specific Test Categories
```bash
# Unit tests
npm test src/features/profile/__tests__/Profile.test.tsx

# Integration tests
npm test src/features/profile/__tests__/integration/

# Performance tests
npm test src/features/profile/__tests__/performance/

# Advanced state tests
npm test src/features/profile/__tests__/AdvancedStateManagement.test.ts
```

### Run with Coverage
```bash
npm test -- --coverage src/features/profile
```

### Run Custom Test Script
```bash
node src/features/profile/__tests__/runTests.js
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { MockDataFactory } from '../utils/testUtils';
import { setupTestEnvironment } from '../helpers/testHelpers';

describe('Feature Name', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('should do something', () => {
    // Arrange
    const mockData = MockDataFactory.createUserProfile();
    
    // Act
    const result = performAction(mockData);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Best Practices
1. **Use descriptive test names** that explain what is being tested
2. **Arrange-Act-Assert pattern** for clear test structure
3. **Mock external dependencies** using provided utilities
4. **Test both success and error cases**
5. **Use fixtures** for consistent test data
6. **Clean up** after each test to avoid side effects
7. **Test edge cases** and boundary conditions
8. **Keep tests simple** and focused on one behavior
9. **Use performance utilities** for performance-critical code
10. **Document complex scenarios** with comments

## 🔍 Debugging Tests

### Common Issues
1. **Mock not working** - Check mock setup and import order
2. **Async test timing** - Use `waitFor` or `act` utilities
3. **State not updating** - Check state management and hooks
4. **API call not mocked** - Verify mock server setup
5. **Test isolation** - Ensure proper cleanup between tests

### Debugging Tools
- Use `console.log` for debugging test flow
- Check mock call history with `jest.mock.calls`
- Use `screen.debug()` from React Testing Library
- Enable verbose test output with `--verbose` flag

## 📊 Coverage Requirements

Target coverage thresholds:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

Coverage reports are generated in `coverage/` directory.

## 🔄 Continuous Integration

Tests run automatically on:
- Pull requests
- Merge to main
- Scheduled runs

Ensure all tests pass before submitting changes.
