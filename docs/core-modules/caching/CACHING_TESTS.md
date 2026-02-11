# Cache Module Tests

This directory contains comprehensive tests for the caching module located in `~/src/core/modules/caching`.

## Test Structure

### Test Files

- **`CacheProvider.test.ts`** - Tests the main cache provider implementation
- **`CacheServiceManager.test.ts`** - Tests the cache service manager for multi-feature caching
- **`CacheStorage.test.ts`** - Tests the underlying cache storage mechanism
- **`CacheStatistics.test.ts`** - Tests statistics tracking and performance metrics
- **`CacheEvictionStrategy.test.ts`** - Tests LRU eviction strategy implementation
- **`CacheCleanupManager.test.ts`** - Tests automatic cleanup of expired entries
- **`CacheErrorHandler.test.ts`** - Tests error handling and recovery mechanisms
- **`factory.test.ts`** - Tests factory functions for creating cache instances
- **`integration.test.ts`** - End-to-end integration tests

### Configuration Files

- **`jest.config.js`** - Jest configuration specific to cache module tests
- **`setup.ts`** - Global test setup and utilities
- **`README.md`** - This file

## Running Tests

### Run All Cache Tests

```bash
# From project root
npm test -- src/core/modules/caching

# Or from cache module directory
cd src/core/modules/caching
npm test
```

### Run Specific Test Files

```bash
# Run only provider tests
npm test -- CacheProvider.test.ts

# Run integration tests
npm test -- integration.test.ts

# Run multiple test files
npm test -- CacheProvider.test.ts CacheStorage.test.ts
```

### Run Tests with Coverage

```bash
# Generate coverage report for cache module
npm test -- --coverage src/core/modules/caching

# Generate coverage with specific thresholds
npm test -- --coverage --coverageThreshold='{"src/core/modules/caching/":{"branches":85,"functions":85,"lines":85,"statements":85}}'
```

### Watch Mode

```bash
# Run tests in watch mode for development
npm test -- --watch src/core/modules/caching
```

## Test Coverage

The test suite covers:

### Core Functionality
- ✅ Basic cache operations (get, set, delete, clear)
- ✅ TTL (Time-To-Live) management
- ✅ Pattern-based invalidation
- ✅ Cache entry metadata

### Performance Features
- ✅ LRU eviction strategy
- ✅ Statistics tracking
- ✅ Memory management
- ✅ High-volume operations

### Service Management
- ✅ Multi-feature cache management
- ✅ Feature-specific configurations
- ✅ Global statistics aggregation
- ✅ Cross-feature operations

### Error Handling
- ✅ Error classification and recovery
- ✅ Circuit breaker pattern
- ✅ Retry mechanisms
- ✅ Graceful degradation

### Integration
- ✅ End-to-end workflows
- ✅ Real-world scenarios
- ✅ Performance under load
- ✅ Memory cleanup

## Test Utilities

### Global Test Helpers

The `setup.ts` file provides global utilities:

```typescript
// Create mock cache entry
createMockCacheEntry(data, ttl, timestamp)

// Create mock cache configuration
createMockCacheConfig(overrides)
```

### Mock Implementations

Tests use comprehensive mock implementations for:

- **Cache Storage** - In-memory Map-based storage
- **Statistics Tracking** - Mock performance metrics
- **Eviction Strategy** - Mock LRU implementation
- **Cleanup Manager** - Mock timer-based cleanup

## Performance Benchmarks

### Expected Performance

- **Single Operations**: < 1ms
- **1000 Operations**: < 100ms
- **10,000 Operations**: < 1000ms
- **Memory Usage**: Proportional to cache size
- **Cleanup Operations**: < 10ms for 1000 entries

### Load Testing

Integration tests include performance scenarios:

```typescript
// High-volume operations test
test('should handle high-volume operations efficiently', async () => {
    const operationCount = 1000;
    // ... test implementation
});
```

## Debugging Tests

### Common Issues

1. **Timer Issues**: Tests use fake timers with `jest.useFakeTimers()`
2. **Async Operations**: All cache operations are async - use `await`
3. **Memory Leaks**: Ensure proper cleanup in `afterEach`
4. **Race Conditions**: Use `Promise.all()` for concurrent operations

### Debugging Tips

```typescript
// Enable verbose logging
console.log('Cache state:', await cacheProvider.getStats());

// Check cache contents
const keys = await cacheProvider.keys();
console.log('Cache keys:', keys);

// Verify configuration
console.log('Cache config:', cacheProvider.getConfig());
```

## Contributing

### Adding New Tests

1. Follow existing naming conventions (`*.test.ts`)
2. Use descriptive test names
3. Test both success and failure scenarios
4. Include performance considerations
5. Add proper cleanup in `afterEach`

### Test Structure

```typescript
describe('Component/Feature', () => {
    let component: ComponentType;

    beforeEach(() => {
        // Setup
        component = createComponent();
    });

    afterEach(() => {
        // Cleanup
        component.dispose();
    });

    describe('Specific Feature', () => {
        test('should do something', async () => {
            // Test implementation
        });
    });
});
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Statements**: 85%
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%

### Coverage Reports

Coverage reports are generated in:

```bash
# HTML report
coverage/lcov-report/index.html

# Text summary
coverage/lcov.info

# Console output
npm test -- --coverage
```

## Continuous Integration

### CI Configuration

Tests run automatically on:

- **Pull Requests**: Full test suite with coverage
- **Main Branch**: Full test suite with coverage
- **Feature Branches**: Subset of tests for faster feedback

### Test Results

- ✅ All tests must pass
- ✅ Coverage thresholds must be met
- ✅ Performance benchmarks must be maintained
- ✅ No memory leaks in test suites

## Troubleshooting

### Common Test Failures

1. **Timeout Errors**: Increase timeout with `jest.setTimeout(10000)`
2. **Mock Issues**: Clear mocks in `beforeEach`
3. **Async Issues**: Ensure all promises are awaited
4. **Memory Issues**: Check for proper cleanup

### Getting Help

- Check existing test patterns
- Review Jest documentation
- Consult test utilities in `setup.ts`
- Look at integration test examples

## Future Enhancements

### Planned Test Improvements

- [ ] Add browser environment tests
- [ ] Implement visual regression tests
- [ ] Add load testing scenarios
- [ ] Enhance error simulation
- [ ] Add benchmark comparisons

### Test Metrics

Track these metrics over time:

- Test execution time
- Coverage percentage
- Memory usage during tests
- Error detection rate
- Performance benchmarks
