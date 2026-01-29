/**
 * Search Data Service - Enterprise Edition
 * 
 * Enterprise-grade data service for search functionality
 * Provides intelligent caching, orchestration, and performance optimization
 */

import type { ICacheProvider } from '@/core/cache';
import { BaseDataService } from '@/core/dataservice/BaseDataService';
import type { IWebSocketService } from '@/core/websocket/types';
import { JwtToken } from '@/shared/api/models/common';
import { SearchFilters, SearchQuery, SearchResult } from '@search/domain/entities';
import { EnhancedSearchQuery, EnhancedSearchResult, ISearchRepositoryEnhanced, SearchAnalytics, SearchConfiguration, SearchPerformanceMetrics, SearchSuggestion } from '@search/domain/entities/ISearchRepositoryEnhanced';
import { SEARCH_CACHE_INVALIDATION, SEARCH_CACHE_KEYS, SEARCH_CACHE_TTL } from '../cache/SearchCacheKeys';

/**
 * Search Data Service
 * 
 * Provides intelligent caching and orchestration for search data
 * Implements enterprise-grade caching with search-specific strategies
 * Extends BaseDataService for composed services and proper separation of concerns
 */
export class SearchDataService extends BaseDataService {
  private repository: ISearchRepositoryEnhanced;

  constructor(
    repository: ISearchRepositoryEnhanced,
    cacheService: ICacheProvider,
    webSocketService: IWebSocketService
  ) {
    super(); // Initialize BaseDataService with composed services
    this.repository = repository;
  }

  // Basic search operations with caching
  async searchUsers(query: string, filters?: SearchFilters, token?: JwtToken): Promise<any[]> {
    const cacheKey = this.generateCacheKey('user-search', { query, filters, page: 0, limit: 20 });

    try {
      // Use BaseDataService caching with composed services
      const queryResult = this.executeQuery(
        cacheKey,
        () => this.repository.searchUsers(query, filters),
        {
          cacheStrategy: 'USER_CONTENT',
          websocketTopics: query ? [`search:${query}:users`] : [],
          updateStrategy: 'merge'
        }
      );

      // Execute the query and return the data
      const result = await queryResult;
      return result.data as any[];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async searchPosts(query: string, filters?: SearchFilters, token?: JwtToken): Promise<any[]> {
    const cacheKey = this.generateCacheKey('post-search', { query, filters, page: 0, limit: 20 });

    try {
      // Use BaseDataService caching with composed services
      const queryResult = this.executeQuery(
        cacheKey,
        () => this.repository.searchPosts(query, filters),
        {
          cacheStrategy: 'USER_CONTENT',
          websocketTopics: query ? [`search:${query}:posts`] : [],
          updateStrategy: 'merge'
        }
      );

      // Execute the query and return the data
      const result = await queryResult;
      return result.data as any[];
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async searchAll(query: string, filters?: SearchFilters, token?: JwtToken): Promise<SearchResult> {
    const cacheKey = this.generateCacheKey('combined-search', { query, filters, page: 0, limit: 20 });

    try {
      // Use BaseDataService caching with composed services
      const queryResult = this.executeQuery(
        cacheKey,
        () => this.repository.searchAll(query, filters),
        {
          cacheStrategy: 'USER_CONTENT',
          websocketTopics: query ? [`search:${query}:all`] : [],
          updateStrategy: 'merge'
        }
      );

      // Execute the query and return the data
      const result = await queryResult;
      return result.data as SearchResult;
    } catch (error) {
      console.error('Error searching all:', error);
      throw error;
    }
  }

  // Enhanced search operations with caching
  async searchEnhanced(query: EnhancedSearchQuery, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = this.generateCacheKey('advanced-search', {
      query: query.query,
      page: query.pagination?.page || 0,
      size: query.pagination?.size || 20
    });

    try {
      // Use BaseDataService caching with composed services
      const queryResult = this.executeQuery(
        cacheKey,
        () => this.repository.searchEnhanced(query),
        {
          cacheStrategy: 'USER_CONTENT',
          websocketTopics: query.query ? [`search:${query.query}:enhanced`] : [],
          updateStrategy: 'merge'
        }
      );

      // Execute the query and return the data
      const result = await queryResult;
      return result.data as EnhancedSearchResult;
    } catch (error) {
      console.error('Error in enhanced search:', error);
      throw error;
    }
  }

  async searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = SEARCH_CACHE_KEYS.SEARCH_ANALYTICS(userId, '24h');

    try {
      const result = await this.repository.searchWithAnalytics(query, userId, token);

      // Cache analytics data separately
      if (result.analytics) {
        this.cache.set(cacheKey, result.analytics, SEARCH_CACHE_TTL.SEARCH_ANALYTICS);
      }

      return result;
    } catch (error) {
      console.error('Error in search with analytics:', error);
      throw error;
    }
  }

  // Suggestions and autocomplete with caching
  async getSuggestions(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    const cacheKey = SEARCH_CACHE_KEYS.SUGGESTIONS(partialQuery, limit);

    let data = this.cache.get<SearchSuggestion[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getSuggestions(partialQuery, limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.SUGGESTIONS);
      }

      return data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  async getAutocomplete(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<string[]> {
    const cacheKey = SEARCH_CACHE_KEYS.AUTOCOMPLETE(partialQuery, limit);

    let data = this.cache.get<string[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getAutocomplete(partialQuery, limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.AUTOCOMPLETE);
      }

      return data;
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      throw error;
    }
  }

  async getSmartSuggestions(query: string, userId: string, token?: JwtToken): Promise<SearchSuggestion[]> {
    const cacheKey = SEARCH_CACHE_KEYS.RECOMMENDATIONS(userId, 10);

    try {
      const suggestions = await this.repository.getSmartSuggestions(query, userId, token);

      // Cache recommendations for longer
      if (suggestions) {
        this.cache.set(cacheKey, suggestions, SEARCH_CACHE_TTL.RECOMMENDATIONS);
      }

      return suggestions;
    } catch (error) {
      console.error('Error getting smart suggestions:', error);
      throw error;
    }
  }

  // Search history with caching
  async getSearchHistory(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    const cacheKey = SEARCH_CACHE_KEYS.SEARCH_HISTORY(userId);

    let data = this.cache.get<SearchQuery[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getSearchHistory(userId, limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.SEARCH_HISTORY);
      }

      return data;
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }

  async saveToHistory(query: SearchQuery, userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.repository.saveToHistory(query, userId, token);

      // Invalidate history cache
      const historyKey = SEARCH_CACHE_KEYS.SEARCH_HISTORY(userId);
      this.cache.invalidate(historyKey);

      // Invalidate recent searches cache
      const recentKey = SEARCH_CACHE_KEYS.RECENT_SEARCHES(userId, 10);
      this.cache.invalidate(recentKey);
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }

  async clearHistory(userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.repository.clearHistory(userId, token);

      // Invalidate all user-related search caches
      const invalidationKeys = SEARCH_CACHE_INVALIDATION.invalidateUserSearchData(userId);
      for (const key of invalidationKeys) {
        this.cache.invalidatePattern(key);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  async getPersonalizedSuggestions(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    const cacheKey = SEARCH_CACHE_KEYS.RECOMMENDATIONS(userId, limit);

    let data = this.cache.get<SearchSuggestion[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getPersonalizedSuggestions(userId, limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.RECOMMENDATIONS);
      }

      return data;
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      throw error;
    }
  }

  // Trending and popular searches with caching
  async getTrendingSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    const cacheKey = SEARCH_CACHE_KEYS.TRENDING_SEARCHES(limit);

    let data = this.cache.get<SearchQuery[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getTrendingSearches(limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.TRENDING_SEARCHES);
      }

      return data;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      throw error;
    }
  }

  async getPopularSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    const cacheKey = SEARCH_CACHE_KEYS.POPULAR_SEARCHES(limit);

    let data = this.cache.get<SearchQuery[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getPopularSearches(limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.POPULAR_SEARCHES);
      }

      return data;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      throw error;
    }
  }

  async getRecentSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    const cacheKey = SEARCH_CACHE_KEYS.RECENT_SEARCHES;

    let data = this.cache.get<SearchQuery[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getRecentSearches(limit, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.RECENT_SEARCHES);
      }

      return data;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      throw error;
    }
  }

  // Advanced search features
  async searchByCategory(category: string, query: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = SEARCH_CACHE_KEYS.CATEGORY_SEARCH(category, query, 0, 20);

    let data = this.cache.get<EnhancedSearchResult>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.searchByCategory(category, query, filters, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.CATEGORY_SEARCH);
      }

      return data;
    } catch (error) {
      console.error('Error searching by category:', error);
      throw error;
    }
  }

  async searchByTags(tags: string[], query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const tagKey = tags.join(',');
    const cacheKey = SEARCH_CACHE_KEYS.TAG_SEARCH(tagKey, 0, 20);

    let data = this.cache.get<EnhancedSearchResult>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.searchByTags(tags, query, filters, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.TAG_SEARCH);
      }

      return data;
    } catch (error) {
      console.error('Error searching by tags:', error);
      throw error;
    }
  }

  async searchByLocation(location: string, radius?: number, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = SEARCH_CACHE_KEYS.LOCATION_SEARCH(location, 0, 20);

    let data = this.cache.get<EnhancedSearchResult>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.searchByLocation(location, radius, query, filters, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.LOCATION_SEARCH);
      }

      return data;
    } catch (error) {
      console.error('Error searching by location:', error);
      throw error;
    }
  }

  async searchByDateRange(startDate: string, endDate: string, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = SEARCH_CACHE_KEYS.DATE_RANGE_SEARCH(startDate, endDate, 0, 20);

    let data = this.cache.get<EnhancedSearchResult>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.searchByDateRange(startDate, endDate, query, filters, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.DATE_RANGE_SEARCH);
      }

      return data;
    } catch (error) {
      console.error('Error searching by date range:', error);
      throw error;
    }
  }

  // Search analytics and metrics
  async searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = this.generateCacheKey('search-analytics', { userId, timeframe: '24h' });

    try {
      // Use BaseDataService caching with composed services
      const queryResult = this.executeQuery(
        cacheKey,
        () => this.repository.searchWithAnalytics(query, userId),
        {
          cacheStrategy: 'USER_CONTENT',
          websocketTopics: [`search:${query}:analytics:${userId}`],
          updateStrategy: 'merge'
        }
      );

      // Execute the query and return the data
      const result = await queryResult;
      return result.data as EnhancedSearchResult;
    } catch (error) {
      console.error('Error in search with analytics:', error);
      throw error;
    }
  }

  async getSearchAnalytics(userId: string, period: string, token?: JwtToken): Promise<SearchAnalytics> {
    const cacheKey = SEARCH_CACHE_KEYS.SEARCH_ANALYTICS(userId, period);

    let data = this.cache.get<SearchAnalytics>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getSearchAnalytics(userId, period, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.SEARCH_ANALYTICS);
      }

      return data;
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw error;
    }
  }

  async getSearchPerformanceMetrics(query: string, period: string, token?: JwtToken): Promise<SearchPerformanceMetrics[]> {
    const cacheKey = SEARCH_CACHE_KEYS.SEARCH_PERFORMANCE(query, period);

    let data = this.cache.get<SearchPerformanceMetrics[]>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getSearchPerformanceMetrics(query, period, token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.SEARCH_PERFORMANCE);
      }

      return data;
    } catch (error) {
      console.error('Error getting search performance metrics:', error);
      throw error;
    }
  }

  async recordSearchMetrics(metrics: SearchPerformanceMetrics, token?: JwtToken): Promise<void> {
    try {
      await this.repository.recordSearchMetrics(metrics, token);

      // Invalidate performance cache
      const perfKey = SEARCH_CACHE_KEYS.SEARCH_PERFORMANCE(metrics.query, '24h');
      this.cache.invalidate(perfKey);
    } catch (error) {
      console.error('Error recording search metrics:', error);
      throw error;
    }
  }

  // Search configuration with caching
  async getSearchConfiguration(token?: JwtToken): Promise<SearchConfiguration> {
    const cacheKey = SEARCH_CACHE_KEYS.SEARCH_CONFIG();

    let data = this.cache.get<SearchConfiguration>(cacheKey);
    if (data) return data;

    try {
      data = await this.repository.getSearchConfiguration(token);

      if (data) {
        this.cache.set(cacheKey, data, SEARCH_CACHE_TTL.SEARCH_CONFIG);
      }

      return data;
    } catch (error) {
      console.error('Error getting search configuration:', error);
      throw error;
    }
  }

  async updateSearchConfiguration(config: Partial<SearchConfiguration>, token?: JwtToken): Promise<SearchConfiguration> {
    try {
      const updatedConfig = await this.repository.updateSearchConfiguration(config, token);

      // Invalidate configuration cache
      const configKey = SEARCH_CACHE_KEYS.SEARCH_CONFIG();
      this.cache.invalidate(configKey);

      return updatedConfig;
    } catch (error) {
      console.error('Error updating search configuration:', error);
      throw error;
    }
  }

  // Cache management
  getCachedResult(key: string): Promise<EnhancedSearchResult | null> {
    return Promise.resolve(this.cache.get<EnhancedSearchResult>(key) || null);
  }

  setCachedResult(key: string, result: EnhancedSearchResult, ttl?: number): Promise<void> {
    this.updateCache(key, result);
    return Promise.resolve();
  }

  invalidateCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        // Use BaseDataService pattern-based invalidation
        super.invalidateCache(pattern);
      } else {
        // Clear all search cache
        super.invalidateCache('search');
      }
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
    return Promise.resolve();
  }

  clearCache(): Promise<void> {
    try {
      // Use BaseDataService to clear all search cache
      super.invalidateCache('search');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
    return Promise.resolve();
  }

  // Cache statistics and monitoring
  getCacheStats(): any {
    try {
      // Use BaseDataService cache statistics
      return super.getCacheStats();
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  // Cache warming
  async warmCache(queries: string[], token?: JwtToken): Promise<void> {
    try {
      for (const query of queries) {
        // Pre-warm common search patterns
        await this.searchUsers(query, undefined, token);
        await this.searchPosts(query, undefined, token);
        await this.searchAll(query, undefined, token);
        await this.getSuggestions(query, 5, token);
      }
    } catch (error) {
      console.error('Error warming cache:', error);
    }
  }

  // Cache optimization
  optimizeCache(): void {
    // Clean up expired entries
    this.cache.cleanup();
  }

  // Cache health check
  async checkCacheHealth(): Promise<Record<string, any>> {
    const stats = this.getCacheStats();
    const health = {
      status: 'healthy',
      cacheSize: stats.size || 0,
      hitRate: stats.hitRate || 0,
      memoryUsage: stats.memoryUsage || 0,
      lastCleanup: stats.lastCleanup || new Date().toISOString(),
      issues: [] as string[]
    };

    // Check for potential issues
    if (health.cacheSize > 10000) {
      health.issues.push('Cache size is large, consider cleanup');
    }

    if (health.hitRate < 0.5) {
      health.issues.push('Low cache hit rate, consider TTL adjustment');
    }

    if (health.memoryUsage > 100 * 1024 * 1024) { // 100MB
      health.issues.push('High memory usage, consider cache size limits');
    }

    if (health.issues.length > 0) {
      health.status = 'warning';
    }

    return health;
  }
}
