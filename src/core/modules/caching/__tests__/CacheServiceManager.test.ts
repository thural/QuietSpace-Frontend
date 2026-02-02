/**
 * Cache Service Manager Tests
 * 
 * Tests the CacheServiceManager implementation to ensure it properly
 * manages multiple cache instances and provides centralized cache management.
 */

import { CacheServiceManager } from '../providers/CacheServiceManager';
import type { ICacheProvider, CacheServiceConfig } from '../types/interfaces';

// Mock CacheProvider implementation
class MockCacheProvider implements ICacheProvider {
    private storage = new Map<string, any>();
    private stats = {
        size: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        evictions: 0,
        totalRequests: 0
    };

    async get<T>(key: string): Promise<T | null> {
        this.stats.totalRequests++;
        const entry = this.storage.get(key);
        if (entry && !this.isExpired(entry)) {
            this.stats.hits++;
            this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
            return entry.data;
        }
        this.stats.misses++;
        this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
        return null;
    }

    async getEntry<T>(key: string): Promise<any> {
        const entry = this.storage.get(key);
        if (entry && !this.isExpired(entry)) {
            return entry;
        }
        return null;
    }

    async set<T>(key: string, data: T, ttl?: number): Promise<void> {
        const entry = {
            data,
            timestamp: Date.now(),
            ttl: ttl || 300000, // 5 minutes default
            accessCount: 0,
            lastAccessed: Date.now()
        };
        this.storage.set(key, entry);
        this.stats.size = this.storage.size;
    }

    async invalidate(key: string): Promise<boolean> {
        const existed = this.storage.has(key);
        this.storage.delete(key);
        this.stats.size = this.storage.size;
        return existed;
    }

    async delete(key: string): Promise<boolean> {
        return this.invalidate(key);
    }

    async invalidatePattern(pattern: string | RegExp): Promise<number> {
        const keys = Array.from(this.storage.keys());
        let invalidatedCount = 0;

        for (const key of keys) {
            if (this.matchesPattern(key, pattern)) {
                this.storage.delete(key);
                invalidatedCount++;
            }
        }

        this.stats.size = this.storage.size;
        return invalidatedCount;
    }

    async clear(): Promise<void> {
        this.storage.clear();
        this.stats.size = 0;
    }

    async has(key: string): Promise<boolean> {
        const entry = this.storage.get(key);
        return entry !== undefined && !this.isExpired(entry);
    }

    getStats() {
        return { ...this.stats };
    }

    getConfig() {
        return {
            defaultTTL: 300000,
            maxSize: 1000,
            cleanupInterval: 60000,
            enableStats: true,
            enableLRU: true
        };
    }

    async updateConfig(newConfig: any): Promise<void> {
        // Mock implementation
    }

    async dispose(): Promise<void> {
        this.storage.clear();
    }

    private isExpired(entry: any): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    private matchesPattern(key: string, pattern: string | RegExp): boolean {
        if (pattern instanceof RegExp) {
            return pattern.test(key);
        }
        return key.includes(pattern);
    }
}

describe('CacheServiceManager', () => {
    let cacheManager: CacheServiceManager;
    let config: CacheServiceConfig;

    beforeEach(() => {
        config = {
            defaultCache: {
                defaultTTL: 5000,
                maxSize: 100,
                cleanupInterval: 1000,
                enableStats: true,
                enableLRU: true
            },
            featureCaches: {
                auth: {
                    defaultTTL: 10000,
                    maxSize: 50
                },
                user: {
                    defaultTTL: 15000,
                    maxSize: 200
                }
            }
        };

        cacheManager = new CacheServiceManager(config);
    });

    afterEach(() => {
        cacheManager.dispose();
    });

    describe('Cache Instance Management', () => {
        test('should create cache instance for feature', () => {
            const authCache = cacheManager.getCache('auth');
            
            expect(authCache).toBeDefined();
            expect(typeof authCache.get).toBe('function');
            expect(typeof authCache.set).toBe('function');
            expect(typeof authCache.invalidate).toBe('function');
        });

        test('should return same cache instance for same feature', () => {
            const authCache1 = cacheManager.getCache('auth');
            const authCache2 = cacheManager.getCache('auth');
            
            expect(authCache1).toBe(authCache2);
        });

        test('should create different cache instances for different features', () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            
            expect(authCache).not.toBe(userCache);
        });

        test('should use feature-specific configuration when available', () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            const defaultCache = cacheManager.getCache('unknown');

            const authConfig = authCache.getConfig();
            const userConfig = userCache.getConfig();
            const defaultConfig = defaultCache.getConfig();

            // Auth should use feature-specific config
            expect(authConfig.defaultTTL).toBe(10000);
            expect(authConfig.maxSize).toBe(50);

            // User should use feature-specific config
            expect(userConfig.defaultTTL).toBe(15000);
            expect(userConfig.maxSize).toBe(200);

            // Unknown feature should use default config
            expect(defaultConfig.defaultTTL).toBe(5000);
            expect(defaultConfig.maxSize).toBe(100);
        });

        test('should use default configuration when no feature-specific config exists', () => {
            const unknownCache = cacheManager.getCache('unknown-feature');
            const config = unknownCache.getConfig();
            
            expect(config.defaultTTL).toBe(5000);
            expect(config.maxSize).toBe(100);
            expect(config.cleanupInterval).toBe(1000);
            expect(config.enableStats).toBe(true);
            expect(config.enableLRU).toBe(true);
        });
    });

    describe('Feature Invalidation', () => {
        test('should invalidate all entries for specific feature', async () => {
            const authCache = cacheManager.getCache('auth');
            
            // Add some data to auth cache
            await authCache.set('token1', 'value1');
            await authCache.set('token2', 'value2');
            await authCache.set('user1', 'value3');

            // Verify data exists
            expect(await authCache.get('token1')).toBe('value1');
            expect(await authCache.get('token2')).toBe('value2');
            expect(await authCache.get('user1')).toBe('value3');

            // Invalidate auth feature
            cacheManager.invalidateFeature('auth');

            // Verify all auth cache data is cleared
            expect(await authCache.get('token1')).toBeNull();
            expect(await authCache.get('token2')).toBeNull();
            expect(await authCache.get('user1')).toBeNull();
        });

        test('should not affect other features when invalidating specific feature', async () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            
            // Add data to both caches
            await authCache.set('token1', 'auth-value');
            await userCache.set('profile1', 'user-value');

            // Invalidate only auth feature
            cacheManager.invalidateFeature('auth');

            // Auth cache should be cleared
            expect(await authCache.get('token1')).toBeNull();
            
            // User cache should be unaffected
            expect(await userCache.get('profile1')).toBe('user-value');
        });
    });

    describe('Pattern Invalidation Across Features', () => {
        test('should invalidate matching entries across all features', async () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            const feedCache = cacheManager.getCache('feed');
            
            // Add data with different patterns
            await authCache.set('user:123', 'auth-user-data');
            await authCache.set('token:abc', 'auth-token-data');
            await userCache.set('user:456', 'user-profile-data');
            await userCache.set('profile:789', 'user-profile-info');
            await feedCache.set('user:123', 'feed-user-data');
            await feedCache.set('post:1', 'feed-post-data');

            // Invalidate pattern matching 'user:' across all features
            const invalidatedCount = await cacheManager.invalidatePattern('user:');

            expect(invalidatedCount).toBe(3); // 3 entries with 'user:' prefix

            // Verify user: entries are gone
            expect(await authCache.get('user:123')).toBeNull();
            expect(await userCache.get('user:456')).toBeNull();
            expect(await feedCache.get('user:123')).toBeNull();

            // Verify other entries remain
            expect(await authCache.get('token:abc')).toBe('auth-token-data');
            expect(await userCache.get('profile:789')).toBe('user-profile-info');
            expect(await feedCache.get('post:1')).toBe('feed-post-data');
        });

        test('should handle regex patterns across features', async () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            
            // Add data
            await authCache.set('session123', 'session-data');
            await authCache.set('token456', 'token-data');
            await userCache.set('session789', 'user-session');
            await userCache.set('profile012', 'profile-data');

            // Invalidate with regex pattern for sessions
            const pattern = /^session/;
            const invalidatedCount = await cacheManager.invalidatePattern(pattern);

            expect(invalidatedCount).toBe(2); // 2 session entries

            // Verify sessions are gone
            expect(await authCache.get('session123')).toBeNull();
            expect(await userCache.get('session789')).toBeNull();

            // Verify other entries remain
            expect(await authCache.get('token456')).toBe('token-data');
            expect(await userCache.get('profile012')).toBe('profile-data');
        });

        test('should return 0 when no entries match pattern', async () => {
            const authCache = cacheManager.getCache('auth');
            await authCache.set('token1', 'value1');

            const invalidatedCount = await cacheManager.invalidatePattern('nonexistent:');
            expect(invalidatedCount).toBe(0);
        });
    });

    describe('Global Statistics', () => {
        test('should return aggregated statistics across all features', async () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            
            // Add some data and perform operations
            await authCache.set('token1', 'value1');
            await authCache.get('token1'); // hit
            await authCache.get('nonexistent'); // miss

            await userCache.set('profile1', 'value2');
            await userCache.get('profile1'); // hit

            const globalStats = cacheManager.getGlobalStats();

            expect(globalStats).toHaveProperty('auth');
            expect(globalStats).toHaveProperty('user');
            
            const authStats = globalStats.auth as any;
            const userStats = globalStats.user as any;

            expect(authStats.hits).toBe(1);
            expect(authStats.misses).toBe(1);
            expect(authStats.totalRequests).toBe(2);
            
            expect(userStats.hits).toBe(1);
            expect(userStats.misses).toBe(0);
            expect(userStats.totalRequests).toBe(1);
        });

        test('should return empty stats for features with no activity', () => {
            const globalStats = cacheManager.getGlobalStats();
            
            // Should have stats for created caches even if no activity
            expect(globalStats).toBeDefined();
            expect(typeof globalStats).toBe('object');
        });
    });

    describe('Resource Management', () => {
        test('should dispose all cache instances', () => {
            const authCache = cacheManager.getCache('auth');
            const userCache = cacheManager.getCache('user');
            const feedCache = cacheManager.getCache('feed');

            const authDisposeSpy = jest.spyOn(authCache, 'dispose');
            const userDisposeSpy = jest.spyOn(userCache, 'dispose');
            const feedDisposeSpy = jest.spyOn(feedCache, 'dispose');

            cacheManager.dispose();

            expect(authDisposeSpy).toHaveBeenCalled();
            expect(userDisposeSpy).toHaveBeenCalled();
            expect(feedDisposeSpy).toHaveBeenCalled();
        });

        test('should handle disposal of empty manager', () => {
            const emptyManager = new CacheServiceManager();
            
            expect(() => {
                emptyManager.dispose();
            }).not.toThrow();
        });
    });

    describe('Configuration Validation', () => {
        test('should work with no configuration provided', () => {
            const defaultManager = new CacheServiceManager();
            const cache = defaultManager.getCache('test');
            
            expect(cache).toBeDefined();
            
            const config = cache.getConfig();
            expect(config.defaultTTL).toBeGreaterThan(0);
            expect(config.maxSize).toBeGreaterThan(0);
        });

        test('should work with empty configuration object', () => {
            const emptyConfigManager = new CacheServiceManager({});
            const cache = emptyConfigManager.getCache('test');
            
            expect(cache).toBeDefined();
        });

        test('should handle partial default configuration', () => {
            const partialConfigManager = new CacheServiceManager({
                defaultCache: {
                    defaultTTL: 20000
                    // Other properties should use defaults
                }
            });
            
            const cache = partialConfigManager.getCache('test');
            const config = cache.getConfig();
            
            expect(config.defaultTTL).toBe(20000);
            expect(config.maxSize).toBeGreaterThan(0); // Should use default
        });
    });

    describe('Edge Cases', () => {
        test('should handle feature names with special characters', () => {
            const specialCache = cacheManager.getCache('feature-with-dashes_and_underscores123');
            
            expect(specialCache).toBeDefined();
        });

        test('should handle empty feature name', () => {
            const emptyFeatureCache = cacheManager.getCache('');
            
            expect(emptyFeatureCache).toBeDefined();
        });

        test('should handle large number of features', () => {
            const caches = [];
            
            // Create 100 different feature caches
            for (let i = 0; i < 100; i++) {
                const cache = cacheManager.getCache(`feature-${i}`);
                caches.push(cache);
            }
            
            // All should be valid cache instances
            caches.forEach(cache => {
                expect(cache).toBeDefined();
                expect(typeof cache.get).toBe('function');
            });
        });
    });
});
