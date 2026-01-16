/**
 * User Search Repository.
 * 
 * Repository implementation for user search operations.
 * Handles user-specific search functionality and data access.
 */

import type { UserList } from "@/api/schemas/inferred/user";
import type { SearchFilters } from "../../domain/entities";
import { BaseSearchRepository, type RepositoryCapabilities } from "./SearchRepository";
import { fetchUsersByQuery } from "../../../../api/requests/userRequests";
import type { JwtToken } from "@/api/schemas/inferred/common";

/**
 * IUserSearchRepository interface.
 * 
 * Extends base search repository with user-specific operations.
 */
export interface IUserSearchRepository extends BaseSearchRepository {
    /**
     * Searches for users by username.
     * 
     * @param username - The username to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to user list
     */
    searchByUsername(username: string, exactMatch?: boolean): Promise<UserList>;

    /**
     * Searches for users by display name.
     * 
     * @param displayName - The display name to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to user list
     */
    searchByDisplayName(displayName: string, exactMatch?: boolean): Promise<UserList>;

    /**
     * Searches for users by bio content.
     * 
     * @param bioQuery - The bio content to search for
     * @returns Promise resolving to user list
     */
    searchByBio(bioQuery: string): Promise<UserList>;

    /**
     * Searches for users by location.
     * 
     * @param location - The location to search for
     * @param radius - Optional search radius in kilometers
     * @returns Promise resolving to user list
     */
    searchByLocation(location: string, radius?: number): Promise<UserList>;

    /**
     * Searches for verified users only.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to verified user list
     */
    searchVerifiedUsers(query: string, filters?: SearchFilters): Promise<UserList>;

    /**
     * Searches for users with minimum followers.
     * 
     * @param query - The search query
     * @param minFollowers - Minimum number of followers
     * @param filters - Optional search filters
     * @returns Promise resolving to user list
     */
    searchUsersByMinFollowers(query: string, minFollowers: number, filters?: SearchFilters): Promise<UserList>;
}

/**
 * UserSearchRepository implementation.
 * 
 * Concrete implementation of user search repository.
 * Integrates with existing user search APIs and data sources.
 */
export class UserSearchRepository extends BaseSearchRepository implements IUserSearchRepository {
    private token: JwtToken | null;

    constructor(token: JwtToken | null = null) {
        super({
            supportsUserSearch: true,
            supportsPostSearch: false,
            supportsRealTime: false,
            supportsHistory: false,
            supportsSuggestions: true,
            supportsAdvancedFilters: true,
            maxResults: 50,
            supportedAlgorithms: ['fulltext', 'fuzzy'],
            supportsCaching: true
        });
        this.token = token;
    }

    /**
     * Searches for users based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to user list
     */
    async searchUsers(query: string, filters?: SearchFilters): Promise<UserList> {
        try {
            console.log('UserSearchRepository: Searching users with query:', query, 'filters:', filters);
            
            // Use existing API function
            const response = await fetchUsersByQuery(query, this.token);
            
            // Extract users from response content
            const users = response.content || [];
            
            console.log('UserSearchRepository: Found', users.length, 'users');
            
            return users;
        } catch (error) {
            console.error('UserSearchRepository: Error searching users:', error);
            return [];
        }
    }

    /**
     * Searches for posts (not supported by user repository).
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to empty post list
     */
    async searchPosts(query: string, filters?: SearchFilters): Promise<any[]> {
        throw new Error('Post search not supported by UserSearchRepository');
    }

    /**
     * Performs comprehensive search (users only).
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to search results
     */
    async searchAll(query: string, filters?: SearchFilters): Promise<any> {
        const users = await this.searchUsers(query, filters);
        
        return {
            query,
            users,
            posts: [],
            timestamp: new Date().toISOString(),
            totalResults: users.length,
            searchDuration: 0,
            hasMore: false,
            metadata: {
                algorithm: 'fulltext',
                relevanceThreshold: 0.3,
                appliedFilters: filters ? Object.keys(filters) : [],
                rankingMethod: 'relevance',
                fromCache: false
            }
        };
    }

    /**
     * Searches for users by username.
     * 
     * @param username - The username to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to user list
     */
    async searchByUsername(username: string, exactMatch: boolean = false): Promise<UserList> {
        const query = exactMatch ? `username:"${username}"` : username;
        return this.searchUsers(query, { type: 'users' });
    }

    /**
     * Searches for users by display name.
     * 
     * @param displayName - The display name to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to user list
     */
    async searchByDisplayName(displayName: string, exactMatch: boolean = false): Promise<UserList> {
        const query = exactMatch ? `displayname:"${displayName}"` : displayName;
        return this.searchUsers(query, { type: 'users' });
    }

    /**
     * Searches for users by bio content.
     * 
     * @param bioQuery - The bio content to search for
     * @returns Promise resolving to user list
     */
    async searchByBio(bioQuery: string): Promise<UserList> {
        const query = `bio:${bioQuery}`;
        return this.searchUsers(query, { type: 'users' });
    }

    /**
     * Searches for users by location.
     * 
     * @param location - The location to search for
     * @param radius - Optional search radius in kilometers
     * @returns Promise resolving to user list
     */
    async searchByLocation(location: string, radius?: number): Promise<UserList> {
        const filters: SearchFilters = {
            type: 'users',
            location: {
                city: location,
                radius: radius || 50
            }
        };
        
        return this.searchUsers(location, filters);
    }

    /**
     * Searches for verified users only.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to verified user list
     */
    async searchVerifiedUsers(query: string, filters?: SearchFilters): Promise<UserList> {
        const searchFilters: SearchFilters = {
            ...filters,
            verified: true,
            type: 'users'
        };
        
        return this.searchUsers(query, searchFilters);
    }

    /**
     * Searches for users with minimum followers.
     * 
     * @param query - The search query
     * @param minFollowers - Minimum number of followers
     * @param filters - Optional search filters
     * @returns Promise resolving to user list
     */
    async searchUsersByMinFollowers(query: string, minFollowers: number, filters?: SearchFilters): Promise<UserList> {
        const searchFilters: SearchFilters = {
            ...filters,
            minFollowers,
            type: 'users'
        };
        
        return this.searchUsers(query, searchFilters);
    }

    /**
     * Gets search suggestions for user searches.
     * 
     * @param partialQuery - The partial search query
     * @returns Promise resolving to suggestions array
     */
    async getSuggestions(partialQuery: string): Promise<string[]> {
        // TODO: Implement with actual suggestion API in Priority 2
        console.log('UserSearchRepository: Getting user suggestions for:', partialQuery);
        
        // Mock suggestions based on common user patterns
        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }

        const mockSuggestions = [
            `${partialQuery}_user`,
            `${partialQuery}official`,
            `the_${partialQuery}`,
            `${partialQuery}2024`,
            `real_${partialQuery}`
        ];

        return mockSuggestions.slice(0, 3);
    }
}
