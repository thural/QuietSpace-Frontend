/**
 * React Query Search Hook.
 * 
 * Hook that provides React Query-based search functionality.
 * Can be toggled on/off based on configuration.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { UserList } from '@/api/schemas/inferred/user';
import type { PostList } from '@/api/schemas/inferred/post';
import type { SearchFilters } from '../../domain/entities';
import { ReactQuerySearchService } from '../services/ReactQuerySearchService';
import { useSearchDI } from './useSearchDI';
import type { JwtToken } from '@/api/schemas/inferred/common';

/**
 * React Query Search State interface.
 */
export interface ReactQuerySearchState {
    userResults: UseQueryResult<UserList, Error>;
    postResults: UseQueryResult<PostList, Error>;
    isLoading: boolean;
    error: Error | null;
}

/**
 * React Query Search Actions interface.
 */
export interface ReactQuerySearchActions {
    prefetchUsers: (query: string, filters?: SearchFilters) => Promise<void>;
    prefetchPosts: (query: string, filters?: SearchFilters) => Promise<void>;
    invalidateCache: () => void;
}

/**
 * React Query Search Hook.
 * 
 * Provides React Query-based search functionality with toggle support.
 */
export const useReactQuerySearch = (
    userQuery: string,
    postQuery: string,
    filters?: SearchFilters
): ReactQuerySearchState & ReactQuerySearchActions => {
    const [token, setToken] = useState<JwtToken | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Get DI container and configuration
    const diContainer = useSearchDI();
    const config = diContainer.getConfig();

    // Initialize React Query service
    const [reactQueryService, setReactQueryService] = useState<ReactQuerySearchService | null>(null);

    useEffect(() => {
        // Get token from auth store
        const authStore = useAuthStore();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);

        // Initialize React Query service
        if (config.useReactQuery && !reactQueryService) {
            setReactQueryService(new ReactQuerySearchService());
        }

        setIsInitialized(true);
    }, [config.useReactQuery, reactQueryService]);

    // Get search results
    const userResults = reactQueryService?.searchUsers(userQuery, filters, token) || 
        { data: [], isLoading: false, error: null, refetch: () => {} } as UseQueryResult<UserList, Error>;
    
    const postResults = reactQueryService?.searchPosts(postQuery, filters, token) || 
        { data: [], isLoading: false, error: null, refetch: () => {} } as UseQueryResult<PostList, Error>;

    // Combined loading state
    const isLoading = userResults.isLoading || postResults.isLoading;
    const error = userResults.error || postResults.error;

    // Actions
    const prefetchUsers = useCallback(async (query: string, filters?: SearchFilters) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchUsers(query, filters, token);
        }
    }, [reactQueryService, token]);

    const prefetchPosts = useCallback(async (query: string, filters?: SearchFilters) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchPosts(query, filters, token);
        }
    }, [reactQueryService, token]);

    const invalidateCache = useCallback(() => {
        if (reactQueryService) {
            reactQueryService.invalidateSearchCache();
        }
    }, [reactQueryService]);

    return {
        // State
        userResults,
        postResults,
        isLoading,
        error,
        
        // Actions
        prefetchUsers,
        prefetchPosts,
        invalidateCache
    };
};
