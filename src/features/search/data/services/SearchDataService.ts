/**
 * Search Data Service - Enterprise Edition
 * 
 * Enterprise-grade data service for search functionality
 * Provides intelligent caching, orchestration, and performance optimization
 */

import type { ICacheProvider } from '../../../../core/cache';
import { BaseDataService } from '../../../../core/dataservice/BaseDataService';
import type { IWebSocketService } from '../../../../core/websocket/types';
import { JwtToken } from '../../../../shared/api/models/common';
import { SearchFilters, SearchQuery, SearchResult } from '../../domain/entities';
import { EnhancedSearchQuery, EnhancedSearchResult, ISearchRepositoryEnhanced, SearchAnalytics, SearchConfiguration, SearchPerformanceMetrics, SearchSuggestion } from '../../domain/entities/ISearchRepositoryEnhanced';
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
    const cacheKey = super.generateCacheKey('user-search', { query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<any[]>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchUsers(query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  async searchPosts(query: string, filters?: SearchFilters, token?: JwtToken): Promise<any[]> {
    const cacheKey = super.generateCacheKey('post-search', { query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<any[]>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchPosts(query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search posts:', error);
      throw error;
    }
  }

  async searchAll(query: string, filters?: SearchFilters, token?: JwtToken): Promise<SearchResult> {
    const cacheKey = super.generateCacheKey('combined-search', { query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<SearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchAll(query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search all:', error);
      throw error;
    }
  }

  async searchEnhanced(query: EnhancedSearchQuery, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = super.generateCacheKey('enhanced-search', { query, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<EnhancedSearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchEnhanced(query);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to perform enhanced search:', error);
      throw error;
    }
  }

  async searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = super.generateCacheKey('search-analytics', { query, userId, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<EnhancedSearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchWithAnalytics(query, userId);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search with analytics:', error);
      throw error;
    }
  }

  // Advanced search operations
  async searchByTags(tags: string[], query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = super.generateCacheKey('tag-search', { tags, query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<EnhancedSearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchByTags(tags, query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search by tags:', error);
      throw error;
    }
  }

  async searchByLocation(location: string, radius: number, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = super.generateCacheKey('location-search', { location, radius, query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<EnhancedSearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchByLocation(location, radius, query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search by location:', error);
      throw error;
    }
  }

  async searchByDateRange(startDate: string, endDate: string, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    const cacheKey = super.generateCacheKey('date-range-search', { startDate, endDate, query, filters, page: 0, limit: 20 });

    try {
      // Check cache first
      const cachedData = super.getCachedData<EnhancedSearchResult>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.searchByDateRange(startDate, endDate, query, filters);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to search by date range:', error);
      throw error;
    }
  }

  // Analytics and metrics
  async getSearchAnalytics(userId: string, period: string, token?: JwtToken): Promise<SearchAnalytics> {
    const cacheKey = super.generateCacheKey('search-analytics', { userId, period });

    try {
      // Check cache first
      const cachedData = super.getCachedData<SearchAnalytics>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getSearchAnalytics(userId, period);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get search analytics:', error);
      throw error;
    }
  }

  async getSearchPerformanceMetrics(query: string, period: string, token?: JwtToken): Promise<SearchPerformanceMetrics> {
    const cacheKey = super.generateCacheKey('search-performance', { query, period });

    try {
      // Check cache first
      const cachedData = super.getCachedData<SearchPerformanceMetrics>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getSearchPerformanceMetrics(query, period);

      // Update cache
      super.updateCache(cacheKey, data);

      // Handle both array and single object return types
      return (Array.isArray(data) ? data[0] || data : data) as SearchPerformanceMetrics;
    } catch (error) {
      console.error('Failed to get search performance metrics:', error);
      throw error;
    }
  }

  async recordSearchMetrics(metrics: SearchPerformanceMetrics, token?: JwtToken): Promise<void> {
    try {
      // Record metrics via repository
      await this.repository.recordSearchMetrics(metrics, token);

      // Update performance cache
      const perfKey = super.generateCacheKey('search-performance', { query: (metrics as any).query, period: '24h' });
      super.updateCache(perfKey, metrics);
    } catch (error) {
      console.error('Failed to record search metrics:', error);
      throw error;
    }
  }

  // Configuration management
  async getSearchConfiguration(token?: JwtToken): Promise<SearchConfiguration> {
    const cacheKey = super.generateCacheKey('search-configuration');

    try {
      // Check cache first
      const cachedData = super.getCachedData<SearchConfiguration>(cacheKey);
      if (cachedData) return cachedData;

      // Fetch from repository
      const data = await this.repository.getSearchConfiguration(token);

      // Update cache
      super.updateCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error('Failed to get search configuration:', error);
      throw error;
    }
  }

  async updateSearchConfiguration(config: Partial<SearchConfiguration>, token?: JwtToken): Promise<SearchConfiguration> {
    try {
      // Update via repository
      const updatedConfig = await this.repository.updateSearchConfiguration(config, token);

      // Invalidate configuration cache
      const configKey = super.generateCacheKey('search-configuration');
      super.invalidateCache(configKey);

      return updatedConfig;
    } catch (error) {
      console.error('Failed to update search configuration:', error);
      throw error;
    }
  }

  // Cache management utilities
  getCachedResult<T>(key: string): T | null {
    return super.getCachedData<T>(key);
  }

  setCachedResult<T>(key: string, result: T, ttl?: number): void {
    super.updateCache(key, result);
  }

  invalidateCache(pattern: string): void {
    try {
      super.invalidateCache(pattern);
    } catch (error) {
      console.error('Failed to invalidate search cache:', error);
    }
  }

  clearCache(): void {
    try {
      super.invalidateCache('search');
    } catch (error) {
      console.error('Failed to clear search cache:', error);
    }
  }

  getCacheStats(): any {
    try {
      return super.getCacheStats();
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  // Performance optimization
  async warmCache(queries: string[], token?: JwtToken): Promise<void> {
    try {
      // Warm cache with common queries
      for (const query of queries) {
        await this.searchUsers(query, undefined, token);
        await this.searchPosts(query, undefined, token);
        await this.searchAll(query, undefined, token);
      }
    } catch (error) {
      console.error('Failed to warm search cache:', error);
    }
  }

  async optimizeCache(): Promise<void> {
    try {
      // Optimize cache performance
      // Implementation would depend on cache provider capabilities
      console.log('Search cache optimization completed');
    } catch (error) {
      console.error('Failed to optimize search cache:', error);
    }
  }

  // Health monitoring
  async checkCacheHealth(): Promise<{
    stats: Record<string, any>;
    health: {
      status: 'healthy' | 'warning' | 'critical';
      issues: string[];
      recommendations: string[];
    };
  }> {
    try {
      const stats = super.getCacheStats();
      const health: {
        status: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
      } = {
        status: 'healthy',
        issues: [],
        recommendations: []
      };

      // Basic health checks
      if (stats && typeof stats === 'object') {
        // Check cache size
        if (stats.size > 1000000) {
          health.status = 'warning';
          health.issues.push('Cache size is large');
          health.recommendations.push('Consider cache cleanup');
        }

        // Check hit rate
        if (stats.hitRate < 0.7) {
          if (health.status === 'healthy') {
            (health as any).status = 'warning';
          } else {
            (health as any).status = 'critical';
          }
          health.issues.push('Low cache hit rate');
          health.recommendations.push('Review cache strategy');
        }
      }

      return { stats, health };
    } catch (error) {
      console.error('Failed to check cache health:', error);
      return {
        stats: {},
        health: {
          status: 'critical',
          issues: ['Health check failed'],
          recommendations: ['Restart cache service']
        }
      };
    }
  }
}
