/**
 * DI Integration Test.
 * 
 * Tests the dependency injection setup for Search feature.
 */

import { renderHook, act } from '@testing-library/react';
import { getSearchDIContainer, resetSearchDIContainer } from '../../../di/SearchDIContainer';
import { useSearchDI, useSearchService } from '../useSearchDI';

describe('Search DI Integration', () => {
    beforeEach(() => {
        resetSearchDIContainer();
    });

    it('should create DI container with default config', () => {
        const container = getSearchDIContainer();
        expect(container).toBeDefined();
        expect(container.getConfig().useMockRepositories).toBe(true);
    });

    it('should create DI container with custom config', () => {
        const container = getSearchDIContainer({ 
            useMockRepositories: false,
            enableLogging: true 
        });
        expect(container.getConfig().useMockRepositories).toBe(false);
        expect(container.getConfig().enableLogging).toBe(true);
    });

    it('should provide search service through hook', () => {
        const { result } = renderHook(() => useSearchService());
        expect(result.current).toBeDefined();
    });

    it('should provide DI container through hook', () => {
        const { result } = renderHook(() => useSearchDI());
        expect(result.current).toBeDefined();
        expect(result.current.getSearchService).toBeDefined();
    });

    it('should resolve dependencies correctly', () => {
        const container = getSearchDIContainer();
        const searchService = container.getSearchService();
        const queryService = container.getQueryService();
        
        expect(searchService).toBeDefined();
        expect(queryService).toBeDefined();
    });

    it('should throw error for unknown service', () => {
        const container = getSearchDIContainer();
        expect(() => container.getService('unknown')).toThrow('Service \'unknown\' not found in container');
    });

    it('should throw error for unknown repository', () => {
        const container = getSearchDIContainer();
        expect(() => container.getRepository('unknown')).toThrow('Repository \'unknown\' not found in container');
    });
});
