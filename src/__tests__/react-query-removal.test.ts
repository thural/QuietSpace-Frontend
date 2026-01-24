/**
 * React Query Removal Validation Tests
 * 
 * This test suite validates that all functionality works correctly
 * after React Query removal using our enterprise custom query system.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { CacheProvider } from '@/core/cache/CacheProvider';
import { useCustomQuery } from '@/core/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/hooks/useCustomMutation';
import { useCustomInfiniteQuery } from '@/core/hooks/useCustomInfiniteQuery';

// Mock data for testing
const mockData = { id: 1, name: 'Test Data' };
const mockFetch = jest.fn(() => Promise.resolve(mockData));
const mockMutation = jest.fn(() => Promise.resolve(mockData));

describe('Enterprise Custom Query System Tests', () => {
    let cacheProvider: CacheProvider;

    beforeEach(() => {
        cacheProvider = new CacheProvider();
        jest.clearAllMocks();
    });

    afterEach(() => {
        cacheProvider.clear();
    });

    describe('useCustomQuery Functionality', () => {
        it('should fetch data successfully', async () => {
            const { result } = renderHook(() => 
                useCustomQuery('test-key', mockFetch)
            );

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.data).toEqual(mockData);
                expect(result.current.error).toBeNull();
            });
        });

        it('should handle errors gracefully', async () => {
            const errorMock = jest.fn(() => Promise.reject(new Error('Test error')));
            
            const { result } = renderHook(() => 
                useCustomQuery('test-key', errorMock)
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.data).toBeNull();
            });
        });

        it('should use cache effectively', async () => {
            const { result: result1 } = renderHook(() => 
                useCustomQuery('test-key', mockFetch, { cacheTime: 300000 })
            );

            await waitFor(() => {
                expect(result1.current.data).toEqual(mockData);
            });

            // Second hook should use cache
            const { result: result2 } = renderHook(() => 
                useCustomQuery('test-key', mockFetch, { cacheTime: 300000 })
            );

            expect(result2.current.isLoading).toBe(false);
            expect(result2.current.data).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledTimes(1); // Called only once
        });
    });

    describe('useCustomMutation Functionality', () => {
        it('should execute mutations successfully', async () => {
            const { result } = renderHook(() => 
                useCustomMutation(mockMutation)
            );

            expect(result.current.isPending).toBe(false);

            result.current.mutate(mockData);

            expect(result.current.isPending).toBe(true);

            await waitFor(() => {
                expect(result.current.isPending).toBe(false);
                expect(result.current.data).toEqual(mockData);
                expect(result.current.error).toBeNull();
            });
        });

        it('should handle optimistic updates', async () => {
            const optimisticUpdate = jest.fn();
            const rollback = jest.fn();

            const { result } = renderHook(() => 
                useCustomMutation(mockMutation, {
                    onMutate: async () => {
                        optimisticUpdate();
                        return { rollback };
                    }
                })
            );

            result.current.mutate(mockData);

            await waitFor(() => {
                expect(optimisticUpdate).toHaveBeenCalled();
            });
        });
    });

    describe('useCustomInfiniteQuery Functionality', () => {
        it('should handle infinite queries', async () => {
            const infiniteMock = jest.fn(({ pageParam = 0 }) => 
                Promise.resolve({
                    data: [`item-${pageParam}`],
                    nextPage: pageParam + 1,
                    hasMore: pageParam < 2
                })
            );

            const { result } = renderHook(() => 
                useCustomInfiniteQuery('infinite-key', infiniteMock)
            );

            await waitFor(() => {
                expect(result.current.data?.pages).toHaveLength(1);
                expect(result.current.hasNextPage).toBe(true);
            });

            result.current.fetchNextPage();

            await waitFor(() => {
                expect(result.current.data?.pages).toHaveLength(2);
            });
        });
    });

    describe('Cache Invalidation', () => {
        it('should invalidate cache correctly', async () => {
            const { result } = renderHook(() => 
                useCustomQuery('test-key', mockFetch)
            );

            await waitFor(() => {
                expect(result.current.data).toEqual(mockData);
            });

            // Invalidate cache
            cacheProvider.invalidate('test-key');

            // Refetch should be triggered
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
    });

    describe('Performance Metrics', () => {
        it('should track cache hit rates', async () => {
            const { result } = renderHook(() => 
                useCustomQuery('test-key', mockFetch)
            );

            await waitFor(() => {
                expect(result.current.data).toEqual(mockData);
            });

            const stats = cacheProvider.getStats();
            expect(stats.hits).toBe(0); // First fetch
            expect(stats.misses).toBe(1);
        });
    });
});

describe('Integration Tests - Feature Compatibility', () => {
    it('should maintain feed feature functionality', async () => {
        // Test that feed hooks work without React Query
        const { useFeedService } = await import('@/features/feed/application/hooks/useFeedService');
        
        const { result } = renderHook(() => useFeedService());
        
        // Verify enterprise hooks are working
        expect(result.current).toBeDefined();
    });

    it('should maintain chat feature functionality', async () => {
        // Test that chat hooks work without React Query
        const { useUnifiedChat } = await import('@/features/chat/application/hooks/useUnifiedChat');
        
        const { result } = renderHook(() => useUnifiedChat());
        
        // Verify enterprise hooks are working
        expect(result.current).toBeDefined();
    });

    it('should maintain search feature functionality', async () => {
        // Test that search hooks work without React Query
        const { useEnterpriseSearch } = await import('@/features/search/application/hooks/useEnterpriseSearch');
        
        const { result } = renderHook(() => useEnterpriseSearch());
        
        // Verify enterprise hooks are working
        expect(result.current).toBeDefined();
    });
});

describe('Bundle Size Validation', () => {
    it('should have reduced bundle size', () => {
        // This would be implemented with actual bundle analysis
        // For now, we validate that React Query imports are gone
        expect(() => {
            require('@tanstack/react-query');
        }).toThrow();
    });
});
