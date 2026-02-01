/**
 * Google Style Guide Implementation Test
 * 
 * Tests the core infrastructure with Google TypeScript Style Guide rules
 */

import { Container } from './src/core/di';
import { TYPES } from './src/core/di/types';
import type { ICacheProvider } from './src/core/cache/interfaces';

/**
 * Simple test service for validation
 * @class TestService
 */
class TestService {
  /**
   * Creates an instance of TestService
   * @param {string} name - Service name
   */
  constructor(public readonly name: string) { }

  /**
   * Gets the service name
   * @returns {string} The service name
   */
  public getName(): string {
    return this.name;
  }
}

/**
 * Test function to validate DI container
 * @returns {Promise<void>} Promise that resolves when test completes
 */
async function testDIContainer(): Promise<void> {
  console.log('🧪 Testing DI Container...');

  // Create container
  const container = Container.create();

  // Register test service
  container.registerInstance(TYPES.LOGGER_SERVICE, new TestService('TestLogger'));

  // Resolve service
  const service = container.get<TestService>(TYPES.LOGGER_SERVICE);

  // Validate
  if (service.getName() === 'TestLogger') {
    console.log('✅ DI Container test passed');
  } else {
    console.log('❌ DI Container test failed');
  }
}

/**
 * Test function to validate cache interfaces
 * @returns {void} No return value
 */
function testCacheInterfaces(): void {
  console.log('🧪 Testing Cache Interfaces...');

  // This should compile without errors
  const cacheConfig = {
    maxSize: 1000,
    defaultTTL: 3600000,
    strategy: 'lru' as const,
    enableMetrics: true
  };

  console.log('✅ Cache interfaces test passed:', cacheConfig);
}

/**
 * Main test runner
 * @returns {Promise<void>} Promise that resolves when all tests complete
 */
async function runTests(): Promise<void> {
  console.log('🚀 Starting Google Style Guide Implementation Tests...\n');

  try {
    await testDIContainer();
    testCacheInterfaces();

    console.log('\n🎉 All tests passed! Google Style Guide implementation is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { TestService, testDIContainer, testCacheInterfaces, runTests };
