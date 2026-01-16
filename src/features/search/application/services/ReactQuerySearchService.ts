/**
 * React Query Search Service.
 * 
 * Service that wraps React Query for search operations.
 * Provides caching, background updates, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { UserList } from '@/api/schemas/inferred/user';
import type { PostList } from '@/api/schemas/inferred/post';
import type { SearchFilters } from '../../domain/entities';
import { fetchUsersByQuery } from '../../../../api/requests/userRequests';
import { fetchPostQuery } from '../../../../api/requests/postRequests';
import type { JwtToken } from '@/api/schemas/inferred/common';

/**
 * React Query Search Service interface.
 */
export interface IReactQuerySearchService {
    searchUsers(query: string, filters?: SearchFilters, token?: JwtToken): UseQueryResult<UserList, Error>;
    searchPosts(query: string, filters?: SearchFilters, token?: JwtToken): UseQueryResult<PostList, Error>;
    prefetchUsers(query: string, filters?: SearchFilters, token?: JwtToken): Promise<void>;
    prefetchPosts(query: string, filters?: SearchFilters, token?: JwtToken): Promise<void>;
    invalidateSearchCache(): void;
}

/**
 * React Query Search Service implementation.
 */
export class ReactQuerySearchService implements IReactQuerySearchService {
    private queryClient = useQueryClient();

    /**
     * Search users with React Query.
     */
    searchUsers(query: string, filters?: SearchFilters, token?: JwtToken): UseQueryResult<UserList, Error> {
        return useQuery({
            queryKey: ['searchUsers', query, filters],
            queryFn: async () => {
                const response = await fetchUsersByQuery(query, token);
                return response.content || [];
            },
            enabled: query.length > 0 && !!token,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (new property name)
        });
    }

    /**
     * Search posts with React Query.
     */
    searchPosts(query: string, filters?: SearchFilters, token?: JwtToken): UseQueryResult<PostList, Error> {
        return useQuery({
            queryKey: ['searchPosts', query, filters],
            queryFn: async () => {
                const response = await fetchPostQuery(query, token);
                return response.content || [];
            },
            enabled: query.length > 0 && !!token,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (new property name)
        });
    }

    /**
     * Prefetch users for better UX.
     */
    prefetchUsers(query: string, filters?: SearchFilters, token?: JwtToken): Promise<void> {
        return this.queryClient.prefetchQuery({
            queryKey: ['searchUsers', query, filters],
            queryFn: async () => {
                const response = await fetchUsersByQuery(query, token);
                return response.content || [];
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    /**
     * Prefetch posts for better UX.
     */
    prefetchPosts(query: string, filters?: SearchFilters, token?: JwtToken): Promise<void> {
        return this.queryClient.prefetchQuery({
            queryKey: ['searchPosts', query, filters],
            queryFn: async () => {
                const response = await fetchPostQuery(query, token);
                return response.content || [];
            },
            staleTime: 5 * 60 * 1000,
        });
    }

    /**
     * Invalidate search cache.
     */
    invalidateSearchCache(): void {
        this.queryClient.invalidateQueries({ queryKey: ['searchUsers'] });
        this.queryClient.invalidateQueries({ queryKey: ['searchPosts'] });
    }
}
