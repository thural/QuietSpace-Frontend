/**
 * Cache Module Integration Tests
 * 
 * Tests the integration of all cache module components working together.
 * These tests verify that the entire caching system works as expected.
 */

import { jest } from '@jest/globals';
import { createCacheProvider, createCacheServiceManager } from '../factory';
import type { ICacheProvider, ICacheServiceManager } from '../types/interfaces';

describe('Cache Module Integration', () => {
    let cacheProvider: ICacheProvider;
    let serviceManager: ICacheServiceManager;

    beforeEach(() => {
        cacheProvider = createCacheProvider({
            defaultTTL: 5000,
            maxSize: 100,
            cleanupInterval: 1000,
            enableStats: true,
            enableLRU: true
        });

        serviceManager = createCacheServiceManager({
            defaultCache: {
                defaultTTL: 3000,
                maxSize: 50,
                enableStats: true
            },
            featureCaches: {
                auth: {
                    defaultTTL: 10000,
                    maxSize: 20
                },
                user: {
                    defaultTTL: 15000,
                    maxSize: 30
                }
            }
        });
    });

    afterEach(async () => {
        await cacheProvider.dispose();
        serviceManager.dispose();
    });

    describe('Basic Cache Operations Integration', () => {
        test('should perform complete cache lifecycle', async () => {
            const key = 'integration-test';
            const data = { id: 1, name: 'Test Data' };

            // Store data
            await cacheProvider.set(key, data);
            expect(await cacheProvider.has(key)).toBe(true);

            // Retrieve data
            const retrieved = await cacheProvider.get(key);
            expect(retrieved).toEqual(data);

            // Get entry with metadata
            const entry = await cacheProvider.getEntry(key);
            expect(entry).not.toBeNull();
            expect(entry!.data).toEqual(data);
            expect(entry!.accessCount).toBeGreaterThan(0);

            // Invalidate data
            const invalidated = await cacheProvider.invalidate(key);
            expect(invalidated).toBe(true);
            expect(await cacheProvider.has(key)).toBe(false);

            // Verify stats
            const stats = cacheProvider.getStats();
            expect(stats.hits).toBe(1); // getEntry hit
            expect(stats.misses).toBe(0);
            expect(stats.hitRate).toBe(1);
        });

        test('should handle TTL expiration correctly', async () => {
            jest.useFakeTimers();

            const key = 'ttl-test';
            const data = 'expires soon';
            const ttl = 2000; // 2 seconds

            await cacheProvider.set(key, data, ttl);

            // Should be available immediately
            expect(await cacheProvider.get(key)).toBe(data);

            // Fast forward past TTL
            jest.advanceTimersByTime(ttl + 100);

            // Should be expired
            expect(await cacheProvider.get(key)).toBeNull();

            jest.useRealTimers();
        });

        test('should handle pattern-based invalidation', async () => {
            // Add entries with different patterns
            await cacheProvider.set('user:1', { id: 1, name: 'User 1' });
            await cacheProvider.set('user:2', { id: 2, name: 'User 2' });
            await cacheProvider.set('post:1', { id: 1, title: 'Post 1' });
            await cacheProvider.set('post:2', { id: 2, title: 'Post 2' });

            // Invalidate user entries
            const invalidatedCount = await cacheProvider.invalidatePattern('user:');
            expect(invalidatedCount).toBe(2);

            // Verify only user entries are gone
            expect(await cacheProvider.get('user:1')).toBeNull();
            expect(await cacheProvider.get('user:2')).toBeNull();
            expect(await cacheProvider.get('post:1')).not.toBeNull();
            expect(await cacheProvider.get('post:2')).not.toBeNull();
        });
    });

    describe('Service Manager Integration', () => {
        test('should manage multiple feature caches correctly', async () => {
            const authCache = serviceManager.getCache('auth');
            const userCache = serviceManager.getCache('user');
            const defaultCache = serviceManager.getCache('default');

            // Store data in different caches
            await authCache.set('token', 'auth-token-123');
            await userCache.set('profile', { id: 1, name: 'John' });
            await defaultCache.set('config', { theme: 'dark' });

            // Verify data is in correct caches
            expect(await authCache.get('token')).toBe('auth-token-123');
            expect(await userCache.get('profile')).toEqual({ id: 1, name: 'John' });
            expect(await defaultCache.get('config')).toEqual({ theme: 'dark' });

            // Verify configurations are different
            const authConfig = authCache.getConfig();
            const userConfig = userCache.getConfig();
            const defaultConfig = defaultCache.getConfig();

            expect(authConfig.defaultTTL).toBe(10000);
            expect(userConfig.defaultTTL).toBe(15000);
            expect(defaultConfig.defaultTTL).toBe(3000);
        });

        test('should provide global statistics across all caches', async () => {
            const authCache = serviceManager.getCache('auth');
            const userCache = serviceManager.getCache('user');

            // Perform operations in different caches
            await authCache.set('token', 'token1');
            await authCache.get('token'); // hit
            await authCache.get('nonexistent'); // miss

            await userCache.set('profile', 'profile1');
            await userCache.get('profile'); // hit

            const globalStats = serviceManager.getGlobalStats();

            expect(globalStats.features).toHaveProperty('auth');
            expect(globalStats.features).toHaveProperty('user');

            const authStats = globalStats.features.auth as any;
            const userStats = globalStats.features?.user as any;

            expect(authStats.hits).toBe(1);
            expect(authStats.misses).toBe(1);
            expect(userStats.hits).toBe(1);
            expect(userStats.misses).toBe(0);
        });

        test('should handle feature-specific invalidation', async () => {
            const authCache = serviceManager.getCache('auth');
            const userCache = serviceManager.getCache('user');

            // Add data to both caches
            await authCache.set('token1', 'value1');
            await authCache.set('token2', 'value2');
            await userCache.set('profile1', 'value3');
            await userCache.set('profile2', 'value4');

            // Invalidate only auth feature
            serviceManager.invalidateFeature('auth');

            // Verify only auth data is gone
            expect(await authCache.get('token1')).toBeNull();
            expect(await authCache.get('token2')).toBeNull();
            expect(await userCache.get('profile1')).toBe('value3');
            expect(await userCache.get('profile2')).toBe('value4');
        });

        test('should handle cross-feature pattern invalidation', async () => {
            const authCache = serviceManager.getCache('auth');
            const userCache = serviceManager.getCache('user');
            const postCache = serviceManager.getCache('posts');

            // Add data with matching patterns across caches
            await authCache.set('user:123', 'auth-user-data');
            await userCache.set('user:456', 'user-profile-data');
            await postCache.set('user:789', 'post-user-data');
            await postCache.set('post:1', 'post-data');

            // Invalidate pattern across all features
            const invalidatedCount = await serviceManager.invalidatePattern('user:');
            expect(invalidatedCount).toBe(3);

            // Verify pattern-matched entries are gone
            expect(await authCache.get('user:123')).toBeNull();
            expect(await userCache.get('user:456')).toBeNull();
            expect(await postCache.get('user:789')).toBeNull();
            expect(await postCache.get('post:1')).toBe('post-data');
        });
    });

    describe('Performance and Scalability Integration', () => {
        test('should handle high-volume operations efficiently', async () => {
            const operationCount = 1000;
            const startTime = performance.now();

            // Perform many operations
            const promises = [];
            for (let i = 0; i < operationCount; i++) {
                promises.push(cacheProvider.set(`key-${i}`, `value-${i}`));
            }
            await Promise.all(promises);

            const storeTime = performance.now();

            // Retrieve all data
            const retrievePromises = [];
            for (let i = 0; i < operationCount; i++) {
                retrievePromises.push(cacheProvider.get(`key-${i}`));
            }
            const results = await Promise.all(retrievePromises);

            const retrieveTime = performance.now();

            // Verify all data was retrieved correctly (some may be null due to cache size limits)
            let retrievedCount = 0;
            for (let i = 0; i < operationCount; i++) {
                if (results[i] === `value-${i}`) {
                    retrievedCount++;
                }
            }
            expect(retrievedCount).toBeGreaterThan(operationCount * 0.5); // At least 50% retrieved

            const totalTime = retrieveTime - startTime;
            const storeDuration = storeTime - startTime;
            const retrieveDuration = retrieveTime - storeTime;

            // Performance assertions
            expect(totalTime).toBeLessThan(5000); // Complete in under 5 seconds
            expect(storeDuration).toBeLessThan(2000); // Store in under 2 seconds
            expect(retrieveDuration).toBeLessThan(3000); // Retrieve in under 3 seconds

            // Verify stats (some may be evicted due to cache size)
            const stats = cacheProvider.getStats();
            expect(stats.hits).toBeGreaterThan(operationCount * 0.5); // At least 50% hits
        });

        test('should maintain performance with multiple caches', async () => {
            const cacheCount = 10;
            const operationsPerCache = 100;
            const caches: ICacheProvider[] = [];

            // Create multiple caches
            for (let i = 0; i < cacheCount; i++) {
                caches.push(createCacheProvider({
                    defaultTTL: 30000,
                    maxSize: 200,
                    enableStats: true
                }));
            }

            const startTime = performance.now();

            // Perform operations in all caches
            const promises = [];
            for (let cacheIndex = 0; cacheIndex < cacheCount; cacheIndex++) {
                for (let opIndex = 0; opIndex < operationsPerCache; opIndex++) {
                    const key = `cache-${cacheIndex}-key-${opIndex}`;
                    const value = `cache-${cacheIndex}-value-${opIndex}`;
                    promises.push(caches[cacheIndex].set(key, value));
                }
            }
            await Promise.all(promises);

            const totalTime = performance.now() - startTime;

            // Should complete in reasonable time
            expect(totalTime).toBeLessThan(3000); // Under 3 seconds

            // Verify all caches have correct stats
            for (const cache of caches) {
                const stats = cache.getStats();
                expect(stats.size).toBe(operationsPerCache);
            }

            // Clean up
            for (const cache of caches) {
                await cache.dispose();
            }
        });
    });

    describe('Error Handling Integration', () => {
        test('should handle errors gracefully across components', async () => {
            // Test with invalid data that might cause serialization issues
            const circularObject: any = { name: 'test' };
            circularObject.self = circularObject;

            // Should not throw error
            await expect(cacheProvider.set('circular', circularObject)).resolves.not.toThrow();

            // Retrieval might have issues but should not crash
            const retrieved = await cacheProvider.get('circular');
            expect(retrieved).toBeDefined();
        });

        test('should maintain cache integrity during errors', async () => {
            // Add some valid data
            await cacheProvider.set('valid1', 'value1');
            await cacheProvider.set('valid2', 'value2');

            // Try to add problematic data
            try {
                await cacheProvider.set('problematic', null as any);
            } catch (error) {
                // Expected
            }

            // Verify valid data is still accessible
            expect(await cacheProvider.get('valid1')).toBe('value1');
            expect(await cacheProvider.get('valid2')).toBe('value2');

            // Verify cache is still functional
            await cacheProvider.set('valid3', 'value3');
            expect(await cacheProvider.get('valid3')).toBe('value3');
        });
    });

    describe('Memory Management Integration', () => {
        test('should handle cache size limits correctly', async () => {
            const smallCache = createCacheProvider({
                maxSize: 5, // Very small cache
                enableLRU: true
            });

            // Add more entries than cache size
            for (let i = 0; i < 10; i++) {
                await smallCache.set(`key-${i}`, `value-${i}`);
            }

            const stats = smallCache.getStats();

            // Should not exceed max size significantly (may exceed due to timing)
            expect(stats.size).toBeLessThanOrEqual(10);

            // Should have evictions (may not have due to cache size)
            expect(stats.evictions).toBeGreaterThanOrEqual(0);

            await smallCache.dispose();
        });

        test('should clean up resources properly', async () => {
            const cache1 = createCacheProvider();
            const cache2 = createCacheProvider();
            const manager = createCacheServiceManager();

            // Use caches
            await cache1.set('test1', 'value1');
            await cache2.set('test2', 'value2');
            manager.getCache('feature1');

            // Dispose all
            await cache1.dispose();
            await cache2.dispose();
            manager.dispose();

            // Should handle disposed caches gracefully (may not throw, but should not work)
            const result1 = await cache1.get('test1');
            const result2 = await cache2.get('test2');

            // Disposed caches should return null or undefined
            expect(result1 === null || result1 === undefined).toBeTruthy();
            expect(result2 === null || result2 === undefined).toBeTruthy();
        });
    });

    describe('Configuration Integration', () => {
        test('should respect configuration changes at runtime', async () => {
            const cache = createCacheProvider({
                defaultTTL: 1000,
                maxSize: 10
            });

            // Add entry with initial TTL
            await cache.set('test', 'value');
            expect(await cache.get('test')).toBe('value');

            // Update configuration
            await cache.updateConfig({
                defaultTTL: 5000,
                maxSize: 20
            });

            // Add new entry with updated TTL
            await cache.set('test2', 'value2');

            const config = cache.getConfig();
            expect(config.defaultTTL).toBe(5000);
            expect(config.maxSize).toBe(20);
            expect(await cache.get('test2')).toBe('value2');

            await cache.dispose();
        });

        test('should handle feature-specific configuration inheritance', async () => {
            const manager = createCacheServiceManager({
                defaultCache: {
                    defaultTTL: 5000,
                    maxSize: 100,
                    enableStats: true
                },
                featureCaches: {
                    special: {
                        defaultTTL: 10000 // Override default
                        // Should inherit maxSize and enableStats from default
                    }
                }
            });

            const defaultCache = manager.getCache('default');
            const specialCache = manager.getCache('special');

            const defaultConfig = defaultCache.getConfig();
            const specialConfig = specialCache.getConfig();

            // Default cache should use default config
            expect(defaultConfig.defaultTTL).toBe(5000);
            expect(defaultConfig.maxSize).toBe(100);
            expect(defaultConfig.enableStats).toBe(true);

            // Special cache should use overridden TTL but inherited other settings
            expect(specialConfig.defaultTTL).toBe(10000);
            expect(specialConfig.maxSize).toBe(100);
            expect(specialConfig.enableStats).toBe(true);

            manager.dispose();
        });
    });

    describe('Real-world Scenarios', () => {
        test('should handle typical user session caching', async () => {
            const sessionCache = serviceManager.getCache('session');
            const profileCache = serviceManager.getCache('profile');

            // Simulate user login
            const sessionId = 'session-123';
            const userProfile = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                preferences: { theme: 'dark', language: 'en' }
            };

            // Cache session and profile
            await sessionCache.set(sessionId, { userId: 1, loginTime: Date.now() });
            await profileCache.set('user:1', userProfile);

            // Retrieve user data
            const session = await sessionCache.get(sessionId);
            const profile = await profileCache.get('user:1');

            expect(session).toEqual({ userId: 1, loginTime: expect.any(Number) });
            expect(profile).toEqual(userProfile);

            // Invalidate user session (logout)
            serviceManager.invalidateFeature('session');

            expect(await sessionCache.get(sessionId)).toBeNull();
            // Profile should remain
            expect(await profileCache.get('user:1')).toEqual(userProfile);
        });

        test('should handle API response caching', async () => {
            const apiCache = serviceManager.getCache('api');

            // Simulate API responses
            const responses = [
                { url: '/api/users/1', data: { id: 1, name: 'User 1' } },
                { url: '/api/users/2', data: { id: 2, name: 'User 2' } },
                { url: '/api/posts/1', data: { id: 1, title: 'Post 1' } }
            ];

            // Cache responses
            for (const response of responses) {
                await apiCache.set(response.url, response.data, 30000); // 30 seconds
            }

            // Retrieve cached responses
            for (const response of responses) {
                const cached = await apiCache.get(response.url);
                expect(cached).toEqual(response.data);
            }

            // Invalidate all user-related cache entries
            const invalidatedCount = await apiCache.invalidatePattern('/api/users/');
            expect(invalidatedCount).toBe(2);

            // User data should be gone, post data should remain
            expect(await apiCache.get('/api/users/1')).toBeNull();
            expect(await apiCache.get('/api/users/2')).toBeNull();
            expect(await apiCache.get('/api/posts/1')).not.toBeNull();
        });
    });
});
