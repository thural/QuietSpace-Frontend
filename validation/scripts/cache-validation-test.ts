/**
 * Cache Black Box Migration Validation Test
 * 
 * Validates that the cache Black Box migration works correctly
 * and all features can use the new public API properly.
 */

import { createCacheProvider, type ICacheProvider } from './src/core/cache/index';

// Test data
interface TestData {
    id: string;
    name: string;
    timestamp: number;
}

/**
 * Test basic cache operations
 */
async function testBasicCacheOperations() {
    console.log('🧪 Testing Basic Cache Operations...');

    try {
        // Create cache provider using Black Box factory
        const cache: ICacheProvider = createCacheProvider();
        console.log('✅ Cache provider created successfully');

        // Test data
        const testData: TestData = {
            id: 'test-1',
            name: 'Test Data',
            timestamp: Date.now()
        };

        // Test set operation
        cache.set('test-key', testData, 60000); // 1 minute TTL
        console.log('✅ Cache set operation successful');

        // Test get operation
        const retrieved = cache.get<TestData>('test-key');
        if (retrieved && retrieved.id === testData.id) {
            console.log('✅ Cache get operation successful');
        } else {
            throw new Error('Cache get operation failed - data mismatch');
        }

        // Test has operation
        if (cache.has('test-key')) {
            console.log('✅ Cache has operation successful');
        } else {
            throw new Error('Cache has operation failed');
        }

        // Test delete operation
        cache.delete('test-key');
        if (!cache.has('test-key')) {
            console.log('✅ Cache delete operation successful');
        } else {
            throw new Error('Cache delete operation failed');
        }

        // Test clear operation
        cache.set('temp-key', 'temp-value');
        cache.clear();
        if (!cache.has('temp-key')) {
            console.log('✅ Cache clear operation successful');
        } else {
            throw new Error('Cache clear operation failed');
        }

        console.log('🎉 All basic cache operations passed!\n');
        return true;

    } catch (error) {
        console.error('❌ Basic cache operations failed:', error);
        return false;
    }
}

/**
 * Test cache statistics
 */
async function testCacheStatistics() {
    console.log('🧪 Testing Cache Statistics...');

    try {
        const cache: ICacheProvider = createCacheProvider();

        // Add some test data
        cache.set('stat-test-1', 'value1');
        cache.set('stat-test-2', 'value2');
        cache.set('stat-test-3', 'value3');

        // Get statistics
        const stats = cache.getStats();
        console.log('📊 Cache Stats:', stats);

        if (stats && typeof stats.size === 'number') {
            console.log('✅ Cache statistics working correctly');
        } else {
            throw new Error('Cache statistics not working');
        }

        console.log('🎉 Cache statistics test passed!\n');
        return true;

    } catch (error) {
        console.error('❌ Cache statistics test failed:', error);
        return false;
    }
}

/**
 * Test cache with different data types
 */
async function testCacheDataTypes() {
    console.log('🧪 Testing Cache with Different Data Types...');

    try {
        const cache: ICacheProvider = createCacheProvider();

        // Test string
        cache.set('string-test', 'hello world');
        const stringValue = cache.get<string>('string-test');
        if (stringValue !== 'hello world') {
            throw new Error('String caching failed');
        }

        // Test number
        cache.set('number-test', 42);
        const numberValue = cache.get<number>('number-test');
        if (numberValue !== 42) {
            throw new Error('Number caching failed');
        }

        // Test object
        const testObject = { name: 'John', age: 30 };
        cache.set('object-test', testObject);
        const objectValue = cache.get<typeof testObject>('object-test');
        if (!objectValue || objectValue.name !== 'John') {
            throw new Error('Object caching failed');
        }

        // Test array
        const testArray = [1, 2, 3, 4, 5];
        cache.set('array-test', testArray);
        const arrayValue = cache.get<number[]>('array-test');
        if (!arrayValue || arrayValue.length !== 5) {
            throw new Error('Array caching failed');
        }

        console.log('✅ All data types cached successfully');
        console.log('🎉 Cache data types test passed!\n');
        return true;

    } catch (error) {
        console.error('❌ Cache data types test failed:', error);
        return false;
    }
}

/**
 * Test cache TTL (Time To Live)
 */
async function testCacheTTL() {
    console.log('🧪 Testing Cache TTL...');

    try {
        const cache: ICacheProvider = createCacheProvider();

        // Set data with very short TTL (100ms)
        cache.set('ttl-test', 'should-expire', 100);

        // Should be available immediately
        if (cache.has('ttl-test')) {
            console.log('✅ Data available immediately after setting');
        } else {
            throw new Error('Data not available immediately');
        }

        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 150));

        // Should be expired now
        if (!cache.has('ttl-test')) {
            console.log('✅ Data expired correctly after TTL');
        } else {
            throw new Error('Data did not expire after TTL');
        }

        console.log('🎉 Cache TTL test passed!\n');
        return true;

    } catch (error) {
        console.error('❌ Cache TTL test failed:', error);
        return false;
    }
}

/**
 * Run all validation tests
 */
async function runCacheValidationTests() {
    console.log('🚀 Starting Cache Black Box Migration Validation Tests\n');
    console.log('='.repeat(60));

    const results = [
        await testBasicCacheOperations(),
        await testCacheStatistics(),
        await testCacheDataTypes(),
        await testCacheTTL()
    ];

    const passedTests = results.filter(result => result).length;
    const totalTests = results.length;

    console.log('='.repeat(60));
    console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
        console.log('🎉 All cache validation tests passed!');
        console.log('✅ Cache Black Box Migration is working correctly!');
        return true;
    } else {
        console.log('❌ Some tests failed. Please check the implementation.');
        return false;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runCacheValidationTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export {
    runCacheValidationTests,
    testBasicCacheOperations,
    testCacheStatistics,
    testCacheDataTypes,
    testCacheTTL
};
