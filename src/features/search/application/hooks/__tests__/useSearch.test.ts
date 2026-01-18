/**
 * useSearch Hook Test.
 * 
 * Tests the main search hook with DI integration.
 */

import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import useSearch from '../useSearch';

// Mock the DI container
jest.mock('../useSearchDI', () => ({
    useSearchService: jest.fn(() => ({
        searchUsers: jest.fn().mockResolvedValue([]),
        searchPosts: jest.fn().mockResolvedValue([])
    })),
    useQueryService: jest.fn(() => ({
        validateQuery: jest.fn().mockReturnValue({ isValid: true }),
        getSuggestions: jest.fn().mockResolvedValue([])
    }))
}));

describe('useSearch Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with empty state', () => {
        const { result } = renderHook(() => useSearch());
        
        expect(result.current.queryInputRef).toBeDefined();
        expect(result.current.focused).toBe(false);
        expect(result.current.userQuery).toBe('');
        expect(result.current.postQuery).toBe('');
        expect(result.current.userQueryList).toEqual([]);
        expect(result.current.postQueryList).toEqual([]);
    });

    it('should provide search functions', () => {
        const { result } = renderHook(() => useSearch());
        
        expect(typeof result.current.fetchUserQuery).toBe('function');
        expect(typeof result.current.fetchPostQuery).toBe('function');
        expect(typeof result.current.setUserQuery).toBe('function');
    });

    it('should handle input changes', () => {
        const { result } = renderHook(() => useSearch());
        
        act(() => {
            result.current.handleInputChange({
                target: { value: 'test query' },
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            } as any);
        });
        
        expect(result.current.userQuery).toBe('test query');
        expect(result.current.focused).toBe(true);
    });

    it('should handle key down events', () => {
        const { result } = renderHook(() => useSearch());
        
        // Mock input ref
        Object.defineProperty(result.current.queryInputRef, 'current', {
            value: { value: 'test', focus: jest.fn() },
            writable: true
        });
        
        act(() => {
            result.current.handleKeyDown({
                key: 'Enter',
                preventDefault: jest.fn()
            } as any);
        });
        
        expect(result.current.postQuery).toBe('test');
    });

    it('should handle escape key', () => {
        const { result } = renderHook(() => useSearch());
        
        act(() => {
            result.current.handleKeyDown({
                key: 'Escape',
                preventDefault: jest.fn()
            } as any);
        });
        
        expect(result.current.focused).toBe(false);
    });

    it('should handle focus events', () => {
        const { result } = renderHook(() => useSearch());
        
        act(() => {
            result.current.handleInputFocus({
                target: { value: 'test' },
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            } as any);
        });
        
        expect(result.current.focused).toBe(true);
    });

    it('should handle blur events', () => {
        const { result } = renderHook(() => useSearch());
        
        act(() => {
            result.current.handleInputBlur({
                target: { value: 'test' },
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            } as any);
        });
        
        // Should log the blur event (current implementation)
        expect(console.log).toHaveBeenCalledWith('(!) unhandled input blur event', 'test');
    });
});
