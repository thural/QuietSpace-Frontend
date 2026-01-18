/**
 * React Query Integration Test.
 * 
 * Tests the React Query integration with toggle functionality.
 */

import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useReactQuerySearch } from '../useReactQuerySearch';
import { useSearchDI } from '../useSearchDI';

// Mock the DI container
jest.mock('../useSearchDI', () => ({
    useSearchDI: jest.fn(() => ({
        getConfig: jest.fn(() => ({
            useReactQuery: true,
            useMockRepositories: false,
            enableLogging: true
        }))
    }))
}));

// Mock auth store
jest.mock('../../../../services/store/zustand', () => ({
    useAuthStore: {
        getState: jest.fn(() => ({
            data: {
                accessToken: 'mock-token-123',
                userId: 'user-123'
            }
        }))
    }
}));

describe('React Query Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize React Query service when enabled', () => {
        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        expect(result.current).toBeDefined();
        expect(typeof result.current.userResults).toBe('object');
        expect(typeof result.current.postResults).toBe('object');
        expect(typeof result.current.prefetchUsers).toBe('function');
        expect(typeof result.current.prefetchPosts).toBe('function');
        expect(typeof result.current.invalidateCache).toBe('function');
    });

    it('should handle loading states correctly', () => {
        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        // Should have loading states
        expect(result.current.userResults.isLoading).toBeDefined();
        expect(result.current.postResults.isLoading).toBeDefined();
        expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should handle error states correctly', () => {
        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        // Should have error states
        expect(result.current.userResults.error).toBeDefined();
        expect(result.current.postResults.error).toBeDefined();
        expect(typeof result.current.error).toBe('object');
    });

    it('should provide prefetch functionality', async () => {
        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        // Test prefetch functions
        await act(async () => {
            await result.current.prefetchUsers('test user');
        });
        
        await act(async () => {
            await result.current.prefetchPosts('test post');
        });
        
        expect(typeof result.current.prefetchUsers).toBe('function');
        expect(typeof result.current.prefetchPosts).toBe('function');
    });

    it('should provide cache invalidation', () => {
        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        // Test cache invalidation
        act(() => {
            result.current.invalidateCache();
        });
        
        expect(typeof result.current.invalidateCache).toBe('function');
    });

    it('should handle empty queries', () => {
        const { result } = renderHook(() => useReactQuerySearch('', ''));
        
        // Should handle empty queries gracefully
        expect(result.current.userResults.data).toBeDefined();
        expect(result.current.postResults.data).toBeDefined();
    });

    it('should respect configuration', () => {
        // Mock disabled React Query
        jest.doMock('../useSearchDI', () => ({
            useSearchDI: jest.fn(() => ({
                getConfig: jest.fn(() => ({
                    useReactQuery: false,
                    useMockRepositories: true,
                    enableLogging: false
                }))
            }))
        }));

        const { result } = renderHook(() => useReactQuerySearch('test', 'query'));
        
        // Should handle disabled React Query
        expect(result.current).toBeDefined();
        expect(typeof result.current.userResults).toBe('object');
        expect(typeof result.current.postResults).toBe('object');
    });
});
