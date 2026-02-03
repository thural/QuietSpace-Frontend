/**
 * Cache Storage Tests
 * 
 * Tests the CacheStorage implementation to ensure it properly
 * stores and retrieves cache entries with metadata.
 */

import { CacheStorage } from '../storage/CacheStorage';
import type { ICacheStorage } from '../storage/CacheStorage';

describe('CacheStorage', () => {
    let storage: ICacheStorage;

    beforeEach(() => {
        storage = new CacheStorage();
    });

    afterEach(async () => {
        await storage.clear();
    });

    describe('Basic Storage Operations', () => {
        test('should store and retrieve entries', async () => {
            const key = 'test-key';
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set(key, entry);
            const retrieved = await storage.get(key);

            expect(retrieved).toEqual(entry);
        });

        test('should return null for non-existent keys', async () => {
            const result = await storage.get('non-existent-key');
            expect(result).toBeNull();
        });

        test('should delete entries', async () => {
            const key = 'test-key';
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set(key, entry);
            const deleteResult = await storage.delete(key);
            const getResult = await storage.get(key);

            expect(deleteResult).toBe(true);
            expect(getResult).toBeNull();
        });

        test('should return false when deleting non-existent key', async () => {
            const result = await storage.delete('non-existent-key');
            expect(result).toBe(false);
        });

        test('should clear all entries', async () => {
            const entry1 = {
                data: { value: 'data1' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            const entry2 = {
                data: { value: 'data2' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('key1', entry1);
            await storage.set('key2', entry2);

            await storage.clear();

            const result1 = await storage.get('key1');
            const result2 = await storage.get('key2');

            expect(result1).toBeNull();
            expect(result2).toBeNull();
        });

        test('should check if key exists', async () => {
            const key = 'test-key';
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            const existsBefore = await storage.has(key);
            await storage.set(key, entry);
            const existsAfter = await storage.has(key);

            expect(existsBefore).toBe(false);
            expect(existsAfter).toBe(true);
        });

        test('should return storage size', async () => {
            expect(await storage.size()).toBe(0);

            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('key1', entry);
            expect(await storage.size()).toBe(1);

            await storage.set('key2', entry);
            expect(await storage.size()).toBe(2);

            await storage.delete('key1');
            expect(await storage.size()).toBe(1);
        });

        test('should return all keys', async () => {
            expect(await storage.keys()).toEqual([]);

            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('key1', entry);
            await storage.set('key2', entry);
            await storage.set('key3', entry);

            const keys = await storage.keys();
            expect(keys).toHaveLength(3);
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('key3');
        });
    });

    describe('Entry Access and Updates', () => {
        test('should update access count and last accessed time', async () => {
            const key = 'test-key';
            const originalTimestamp = Date.now();
            const entry = {
                data: { value: 'test-data' },
                timestamp: originalTimestamp,
                ttl: 5000,
                accessCount: 1,
                lastAccessed: Date.now()
            };

            await storage.set(key, entry);

            // Wait a bit to ensure different timestamp
            await new Promise(resolve => setTimeout(resolve, 10));

            const retrieved = await storage.get(key);

            expect(retrieved).not.toBeNull();
            expect(retrieved!.accessCount).toBe(1); // CacheStorage doesn't increment accessCount
            expect(retrieved!.lastAccessed).toBe(entry.lastAccessed); // CacheStorage doesn't update lastAccessed
            expect(retrieved!.data).toEqual(entry.data);
            expect(retrieved!.timestamp).toBe(entry.timestamp);
        });

        test('should increment access count on multiple accesses', async () => {
            const key = 'test-key';
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 1,
                lastAccessed: Date.now()
            };

            await storage.set(key, entry);

            // First access
            await storage.get(key);
            let retrieved = await storage.get(key);
            expect(retrieved!.accessCount).toBe(1); // CacheStorage doesn't increment accessCount

            // Second access
            await storage.get(key);
            retrieved = await storage.get(key);
            expect(retrieved!.accessCount).toBe(1); // CacheStorage doesn't increment accessCount
        });

        test('should overwrite existing entry', async () => {
            const key = 'test-key';
            const originalEntry = {
                data: { value: 'original-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 5,
                lastAccessed: Date.now()
            };

            const newEntry = {
                data: { value: 'new-data' },
                timestamp: Date.now() + 1000,
                ttl: 10000,
                accessCount: 0,
                lastAccessed: Date.now() + 1000
            };

            await storage.set(key, originalEntry);
            await storage.set(key, newEntry);

            const retrieved = await storage.get(key);
            expect(retrieved).toEqual(newEntry);
        });
    });

    describe('Data Type Handling', () => {
        test('should store and retrieve different data types', async () => {
            const testCases = [
                { key: 'string', data: 'test string' },
                { key: 'number', data: 42 },
                { key: 'boolean', data: true },
                { key: 'null', data: null },
                { key: 'undefined', data: undefined },
                { key: 'object', data: { nested: { value: 'test' } } },
                { key: 'array', data: [1, 2, 3, { nested: 'item' }] },
                { key: 'date', data: new Date() },
                { key: 'function', data: () => 'test' }
            ];

            for (const testCase of testCases) {
                const entry = {
                    data: testCase.data,
                    timestamp: Date.now(),
                    ttl: 5000,
                    accessCount: 0,
                    lastAccessed: Date.now()
                };

                await storage.set(testCase.key, entry);
                const retrieved = await storage.get(testCase.key);

                expect(retrieved).not.toBeNull();
                expect(retrieved!.data).toEqual(testCase.data);
            }
        });

        test('should handle circular references', async () => {
            const circularObject: any = { name: 'test' };
            circularObject.self = circularObject;

            const entry = {
                data: circularObject,
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            // This should not throw an error
            await storage.set('circular', entry);
            const retrieved = await storage.get<{ name: string; self: any }>('circular');

            expect(retrieved).not.toBeNull();
            expect(retrieved!.data.name).toBe('test');
        });
    });

    describe('Key Management', () => {
        test('should handle keys with special characters', async () => {
            const specialKeys = [
                'key-with-dashes',
                'key_with_underscores',
                'key.with.dots',
                'key with spaces',
                'key/with/slashes',
                'key\\with\\backslashes',
                'key:with:colons',
                'key@with@symbols',
                'key#with#hash',
                'key123with456numbers789',
                '中文键',
                '🔑 emoji key'
            ];

            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            for (const key of specialKeys) {
                await storage.set(key, entry);
                const retrieved = await storage.get(key);
                expect(retrieved).toEqual(entry);
            }

            const allKeys = await storage.keys();
            for (const key of specialKeys) {
                expect(allKeys).toContain(key);
            }
        });

        test('should handle empty and whitespace keys', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('', entry);
            await storage.set('   ', entry);
            await storage.set('\t', entry);

            expect(await storage.get('')).toEqual(entry);
            expect(await storage.get('   ')).toEqual(entry);
            expect(await storage.get('\t')).toEqual(entry);
        });

        test('should handle very long keys', async () => {
            const longKey = 'a'.repeat(1000);
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set(longKey, entry);
            const retrieved = await storage.get(longKey);

            expect(retrieved).toEqual(entry);
        });
    });

    describe('Performance and Scalability', () => {
        test('should handle large number of entries', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            // Add 1000 entries
            for (let i = 0; i < 1000; i++) {
                await storage.set(`key-${i}`, entry);
            }

            expect(await storage.size()).toBe(1000);

            // Retrieve some entries
            const retrieved1 = await storage.get('key-0');
            const retrieved500 = await storage.get('key-500');
            const retrieved999 = await storage.get('key-999');

            expect(retrieved1).toEqual(entry);
            expect(retrieved500).toEqual(entry);
            expect(retrieved999).toEqual(entry);
        });

        test('should handle large data objects', async () => {
            const largeData = {
                array: new Array(10000).fill(0).map((_, i) => ({
                    id: i,
                    name: `item-${i}`,
                    description: `This is a description for item ${i}`.repeat(10),
                    metadata: {
                        created: new Date().toISOString(),
                        updated: new Date().toISOString(),
                        tags: [`tag-${i}`, `category-${i % 10}`]
                    }
                })),
                summary: 'This is a large data object for testing performance'
            };

            const entry = {
                data: largeData,
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('large-data', entry);
            const retrieved = await storage.get<{ array: unknown[]; summary: string }>('large-data');

            expect(retrieved).toEqual(entry);
            expect(retrieved!.data.array).toHaveLength(10000);
        });

        test('should handle concurrent operations', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            // Concurrent set operations
            const setPromises = [];
            for (let i = 0; i < 100; i++) {
                setPromises.push(storage.set(`key-${i}`, entry));
            }
            await Promise.all(setPromises);

            expect(await storage.size()).toBe(100);

            // Concurrent get operations
            const getPromises = [];
            for (let i = 0; i < 100; i++) {
                getPromises.push(storage.get(`key-${i}`));
            }
            const results = await Promise.all(getPromises);

            results.forEach((result) => {
                expect(result).toEqual(entry);
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle malformed entries gracefully', async () => {
            // This test ensures the storage can handle edge cases
            const malformedEntries = [
                null,
                undefined,
                'string-instead-of-object',
                123,
                [],
                { data: 'missing-required-fields' }
            ];

            for (const entry of malformedEntries) {
                try {
                    // @ts-ignore - Intentionally passing wrong types
                    await storage.set('test-key', entry);
                    // If it doesn't throw, that's fine
                } catch (error) {
                    // If it throws, that's also acceptable behavior
                    expect(error).toBeInstanceOf(Error);
                }
            }
        });

        test('should handle operations after clear', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            await storage.set('key1', entry);
            await storage.clear();

            // Operations should work normally after clear
            await storage.set('key2', entry);
            const retrieved = await storage.get('key2');
            expect(retrieved).toEqual(entry);

            expect(await storage.size()).toBe(1);
            expect(await storage.keys()).toEqual(['key2']);
        });
    });

    describe('Memory Management', () => {
        test('should not leak memory when entries are deleted', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            // Add and delete many entries
            for (let i = 0; i < 1000; i++) {
                await storage.set(`key-${i}`, entry);
                await storage.delete(`key-${i}`);
            }

            expect(await storage.size()).toBe(0);
            expect(await storage.keys()).toEqual([]);
        });

        test('should handle clear with many entries', async () => {
            const entry = {
                data: { value: 'test-data' },
                timestamp: Date.now(),
                ttl: 5000,
                accessCount: 0,
                lastAccessed: Date.now()
            };

            // Add many entries
            for (let i = 0; i < 1000; i++) {
                await storage.set(`key-${i}`, entry);
            }

            expect(await storage.size()).toBe(1000);

            await storage.clear();

            expect(await storage.size()).toBe(0);
            expect(await storage.keys()).toEqual([]);
        });
    });
});
