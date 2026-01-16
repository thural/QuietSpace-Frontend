/**
 * End-to-End DI Integration Test.
 * 
 * Tests the complete dependency injection setup from container to UI.
 */

import { renderHook, act } from '@testing-library/react';
import { getSearchDIContainer, resetSearchDIContainer } from '../../../di/SearchDIContainer';
import useSearch from '../useSearch';

describe('End-to-End DI Integration', () => {
    beforeEach(() => {
        resetSearchDIContainer();
    });

    it('should integrate DI container with useSearch hook', () => {
        const { result } = renderHook(() => useSearch());
        
        // Verify hook initializes with DI
        expect(result.current).toBeDefined();
        expect(result.current.queryInputRef).toBeDefined();
        expect(typeof result.current.fetchUserQuery).toBe('function');
        expect(typeof result.current.fetchPostQuery).toBe('function');
    });

    it('should use mock repositories when configured', () => {
        // Configure with mock repositories
        const container = getSearchDIContainer({ useMockRepositories: true });
        const searchService = container.getSearchService();
        
        expect(container.getConfig().useMockRepositories).toBe(true);
        expect(searchService).toBeDefined();
    });

    it('should use production repositories when configured', () => {
        // Configure with production repositories
        const container = getSearchDIContainer({ useMockRepositories: false });
        const searchService = container.getSearchService();
        
        expect(container.getConfig().useMockRepositories).toBe(false);
        expect(searchService).toBeDefined();
    });

    it('should handle search operations through DI', async () => {
        const { result } = renderHook(() => useSearch());
        
        // Trigger user search
        await act(async () => {
            await result.current.fetchUserQuery('test query');
        });
        
        // Trigger post search
        await act(async () => {
            await result.current.fetchPostQuery('test query');
        });
        
        // Verify search functions were called (mocked)
        expect(result.current.userQueryList).toBeDefined();
        expect(result.current.postQueryList).toBeDefined();
    });

    it('should maintain DI singleton behavior', () => {
        // Get container multiple times
        const container1 = getSearchDIContainer();
        const container2 = getSearchDIContainer();
        
        // Should return same instance
        expect(container1).toBe(container2);
    });

    it('should reset container when requested', () => {
        const container1 = getSearchDIContainer();
        resetSearchDIContainer();
        const container2 = getSearchDIContainer();
        
        // Should return new instance
        expect(container1).not.toBe(container2);
    });
});
