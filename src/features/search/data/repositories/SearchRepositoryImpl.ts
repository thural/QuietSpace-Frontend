/**
 * Search Repository Implementation - Enterprise Edition
 * 
 * Enterprise-grade search repository implementation
 * Provides raw data access with advanced search capabilities
 */

import { AxiosInstance } from 'axios';
import {
  ISearchRepositoryEnhanced,
  EnhancedSearchQuery,
  EnhancedSearchResult,
  SearchSuggestion,
  SearchAnalytics,
  SearchPerformanceMetrics,
  SearchConfiguration,
  RepositoryCapabilitiesEnhanced,
  SearchQuery,
  SearchResult,
  SearchFilters
} from '@search/domain/entities/ISearchRepositoryEnhanced';
import { UserList } from '@/features/profile/data/models/user';
import { PostList } from '@/features/feed/data/models/post';
import { JwtToken } from '@/shared/api/models/common';
import { IAuthService } from '@/core/auth/interfaces/authInterfaces';

/**
 * Search Repository Implementation
 * 
 * Enterprise-grade repository for search data access
 * Implements advanced search features with caching, analytics, and performance monitoring
 */
export class SearchRepositoryImpl implements ISearchRepositoryEnhanced {
  constructor(
    private apiClient: AxiosInstance,
    private authService: IAuthService
  ) { }

  /**
   * Helper method to get auth token from centralized service
   */
  private async getAuthToken(): Promise<string> {
    try {
      const session = await this.authService.getCurrentSession();
      if (!session || !session.token.accessToken) {
        throw new Error('No valid authentication session found');
      }
      return session.token.accessToken;
    } catch (error) {
      console.error('Error getting auth token from centralized service:', error);
      throw new Error('Authentication failed');
    }
  }

  // Basic search operations
  async searchUsers(query: string, filters?: SearchFilters): Promise<UserList> {
    try {
      const response = await this.apiClient.post<UserList>('/api/search/users', {
        query,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async searchPosts(query: string, filters?: SearchFilters): Promise<PostList> {
    try {
      const response = await this.apiClient.post<PostList>('/api/search/posts', {
        query,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async searchAll(query: string, filters?: SearchFilters): Promise<SearchResult> {
    try {
      const response = await this.apiClient.post<SearchResult>('/api/search/all', {
        query,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error searching all:', error);
      throw error;
    }
  }

  // Enhanced search operations
  async searchEnhanced(query: EnhancedSearchQuery, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/enhanced', {
        query,
        token
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in enhanced search:', error);
      throw error;
    }
  }

  async searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/analytics', {
        query,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in search with analytics:', error);
      throw error;
    }
  }

  // Suggestions and autocomplete
  async getSuggestions(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    try {
      const response = await this.apiClient.post<SearchSuggestion[]>('/api/search/suggestions', {
        partialQuery,
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  async getAutocomplete(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<string[]> {
    try {
      const response = await this.apiClient.post<string[]>('/api/search/autocomplete', {
        partialQuery,
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      throw error;
    }
  }

  async getSmartSuggestions(query: string, userId: string, token?: JwtToken): Promise<SearchSuggestion[]> {
    try {
      const response = await this.apiClient.post<SearchSuggestion[]>('/api/search/smart-suggestions', {
        query,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting smart suggestions:', error);
      throw error;
    }
  }

  // Search history and personalization
  async getSearchHistory(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    try {
      const response = await this.apiClient.post<SearchQuery[]>('/api/search/history', {
        userId,
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }

  async saveToHistory(query: SearchQuery, userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/history/save', {
        query,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }

  async clearHistory(userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.delete('/api/search/history/clear', {
        data: { userId }
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  async getPersonalizedSuggestions(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    try {
      const response = await this.apiClient.post<SearchSuggestion[]>('/api/search/personalized-suggestions', {
        userId,
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      throw error;
    }
  }

  // Trending and popular searches
  async getTrendingSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    try {
      const response = await this.apiClient.post<SearchQuery[]>('/api/search/trending', {
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      throw error;
    }
  }

  async getPopularSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    try {
      const response = await this.apiClient.post<SearchQuery[]>('/api/search/popular', {
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      throw error;
    }
  }

  async getRecentSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    try {
      const response = await this.apiClient.post<SearchQuery[]>('/api/search/recent', {
        limit
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      throw error;
    }
  }

  // Advanced search features
  async searchByCategory(category: string, query: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/category', {
        category,
        query,
        filters
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by category:', error);
      throw error;
    }
  }

  async searchByTags(tags: string[], query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/tags', {
        tags,
        query,
        filters
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by tags:', error);
      throw error;
    }
  }

  async searchByLocation(location: string, radius?: number, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/location', {
        location,
        radius,
        query,
        filters
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by location:', error);
      throw error;
    }
  }

  async searchByDateRange(startDate: string, endDate: string, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/date-range', {
        startDate,
        endDate,
        query,
        filters
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by date range:', error);
      throw error;
    }
  }

  // Search analytics and metrics
  async getSearchAnalytics(userId: string, period: string, token?: JwtToken): Promise<SearchAnalytics> {
    try {
      const response = await this.apiClient.post<SearchAnalytics>('/api/search/analytics', {
        userId,
        period
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw error;
    }
  }

  async getSearchPerformanceMetrics(query: string, period: string, token?: JwtToken): Promise<SearchPerformanceMetrics[]> {
    try {
      const response = await this.apiClient.post<SearchPerformanceMetrics[]>('/api/search/performance-metrics', {
        query,
        period
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search performance metrics:', error);
      throw error;
    }
  }

  async recordSearchMetrics(metrics: SearchPerformanceMetrics, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/metrics', metrics, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error recording search metrics:', error);
      throw error;
    }
  }

  // Search configuration and management
  async getSearchConfiguration(token?: JwtToken): Promise<SearchConfiguration> {
    try {
      const response = await this.apiClient.get<SearchConfiguration>('/api/search/configuration', {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search configuration:', error);
      throw error;
    }
  }

  async updateSearchConfiguration(config: Partial<SearchConfiguration>, token?: JwtToken): Promise<SearchConfiguration> {
    try {
      const response = await this.apiClient.put<SearchConfiguration>('/api/search/configuration', config, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating search configuration:', error);
      throw error;
    }
  }

  async resetSearchConfiguration(token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/configuration/reset', {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error resetting search configuration:', error);
      throw error;
    }
  }

  // Index management
  async getIndexStatus(token?: JwtToken): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.get<Record<string, any>>('/api/search/index/status', {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting index status:', error);
      throw error;
    }
  }

  async rebuildIndex(token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/index/rebuild', {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error rebuilding index:', error);
      throw error;
    }
  }

  async optimizeIndex(token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/index/optimize', {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error optimizing index:', error);
      throw error;
    }
  }

  // Search health and monitoring
  async getSearchHealth(token?: JwtToken): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.get<Record<string, any>>('/api/search/health', {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search health:', error);
      throw error;
    }
  }

  async getSearchStatistics(token?: JwtToken): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.get<Record<string, any>>('/api/search/statistics', {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search statistics:', error);
      throw error;
    }
  }

  // Advanced search operations
  async semanticSearch(query: string, context?: string[], token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/semantic', {
        query,
        context
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw error;
    }
  }

  async hybridSearch(query: string, weights?: Record<string, number>, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/hybrid', {
        query,
        weights
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in hybrid search:', error);
      throw error;
    }
  }

  async federatedSearch(queries: string[], sources: string[], token?: JwtToken): Promise<EnhancedSearchResult[]> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult[]>('/api/search/federated', {
        queries,
        sources
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in federated search:', error);
      throw error;
    }
  }

  // Search optimization
  async optimizeQuery(query: string, token?: JwtToken): Promise<string> {
    try {
      const response = await this.apiClient.post<{ optimizedQuery: string }>('/api/search/optimize', {
        query
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data.optimizedQuery;
    } catch (error) {
      console.error('Error optimizing query:', error);
      throw error;
    }
  }

  async validateQuery(query: string, token?: JwtToken): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ isValid: boolean }>('/api/search/validate', {
        query
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data.isValid;
    } catch (error) {
      console.error('Error validating query:', error);
      throw error;
    }
  }

  async sanitizeQuery(query: string, token?: JwtToken): Promise<string> {
    try {
      const response = await this.apiClient.post<{ sanitizedQuery: string }>('/api/search/sanitize', {
        query
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data.sanitizedQuery;
    } catch (error) {
      console.error('Error sanitizing query:', error);
      throw error;
    }
  }

  // Search debugging
  async explainQuery(query: string, token?: JwtToken): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.post<Record<string, any>>('/api/search/explain', {
        query
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error explaining query:', error);
      throw error;
    }
  }

  async debugSearch(query: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/debug', {
        query
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in debug search:', error);
      throw error;
    }
  }

  // Search export and import
  async exportSearchResults(query: string, format: 'json' | 'csv' | 'xml', token?: JwtToken): Promise<Blob> {
    try {
      const response = await this.apiClient.post('/api/search/export', {
        query,
        format
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting search results:', error);
      throw error;
    }
  }

  async importSearchData(data: Blob, format: 'json' | 'csv' | 'xml', token?: JwtToken): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('data', data);
      formData.append('format', format);

      await this.apiClient.post('/api/search/import', formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error importing search data:', error);
      throw error;
    }
  }

  // Search alerts and notifications
  async createSearchAlert(query: string, userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/alerts/create', {
        query,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error creating search alert:', error);
      throw error;
    }
  }

  async removeSearchAlert(alertId: string, userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.delete('/api/search/alerts/remove', {
        data: { alertId, userId }
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error removing search alert:', error);
      throw error;
    }
  }

  async getSearchAlerts(userId: string, token?: JwtToken): Promise<SearchQuery[]> {
    try {
      const response = await this.apiClient.post<SearchQuery[]>('/api/search/alerts', {
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search alerts:', error);
      throw error;
    }
  }

  // Search collaboration
  async shareSearch(searchId: string, userIds: string[], token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/share', {
        searchId,
        userIds
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error sharing search:', error);
      throw error;
    }
  }

  async getSharedSearches(userId: string, token?: JwtToken): Promise<EnhancedSearchResult[]> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult[]>('/api/search/shared', {
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting shared searches:', error);
      throw error;
    }
  }

  // Search templates
  async createSearchTemplate(template: Record<string, any>, userId: string, token?: JwtToken): Promise<void> {
    try {
      await this.apiClient.post('/api/search/templates/create', {
        template,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
    } catch (error) {
      console.error('Error creating search template:', error);
      throw error;
    }
  }

  async getSearchTemplates(userId: string, token?: JwtToken): Promise<Record<string, any>[]> {
    try {
      const response = await this.apiClient.post<Record<string, any>[]>('/api/search/templates', {
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search templates:', error);
      throw error;
    }
  }

  async applySearchTemplate(templateId: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    try {
      const response = await this.apiClient.post<EnhancedSearchResult>('/api/search/templates/apply', {
        templateId,
        userId
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : `Bearer ${await this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error applying search template:', error);
      throw error;
    }
  }

  // Repository capabilities
  getCapabilities(): RepositoryCapabilitiesEnhanced {
    return {
      // Basic capabilities
      supportsUserSearch: true,
      supportsPostSearch: true,
      supportsRealTime: false,
      supportsHistory: true,
      supportsSuggestions: true,
      supportsAdvancedFilters: true,

      // Enhanced capabilities
      supportsSemanticSearch: true,
      supportsFuzzySearch: true,
      supportsHybridSearch: true,
      supportsFacetedSearch: true,
      supportsAggregations: true,
      supportsHighlighting: true,
      supportsAnalytics: true,
      supportsPersonalization: true,
      supportsInternationalization: true,
      supportsAccessibility: true,
      supportsMachineLearning: true,
      supportsABTesting: true,

      // Performance capabilities
      maxResults: 1000,
      maxPageSize: 100,
      supportedAlgorithms: ['fulltext', 'fuzzy', 'semantic', 'hybrid'],
      supportsCaching: true,
      supportsRateLimiting: true,

      // Index capabilities
      supportsRealTimeIndexing: true,
      supportsIndexOptimization: true,
      supportsIndexRebuilding: true,
      indexShards: 3,
      indexReplicas: 1,

      // API capabilities
      supportedFormats: ['json', 'csv', 'xml'],
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      supportedAccessibilityFeatures: ['screen-reader', 'keyboard-navigation', 'high-contrast'],

      // Integration capabilities
      supportsWebhooks: true,
      supportsIntegrations: ['elasticsearch', 'algolia', 'meilisearch', 'typesense'],
      supportsCollaboration: true,

      // Monitoring capabilities
      supportsHealthMonitoring: true,
      supportsPerformanceMonitoring: true,
      supportsAnalytics: true,
      supportsDebugging: true,

      // Security capabilities
      supportsAccessControl: true,
      supportsDataSanitization: true,
      supportsQueryValidation: true,
      supportsRateLimitingControl: true
    };
  }

  supportsFeature(feature: string): boolean {
    const capabilities = this.getCapabilities();
    return capabilities[feature as keyof RepositoryCapabilitiesEnhanced] || false;
  }

  getVersion(): string {
    return '2.0.0-enterprise';
  }

  // Real-time search (placeholder implementation)
  supportsRealTimeSearch(): boolean {
    return false;
  }

  subscribeToRealTimeSearch(callback: (results: EnhancedSearchResult) => void): () => void {
    // Placeholder implementation
    console.warn('Real-time search not implemented');
    return () => { };
  }

  // Legacy methods for backward compatibility
  async getTrendingSearches(limit?: number): Promise<SearchQuery[]> {
    return this.getTrendingSearches(limit);
  }

  async getSearchHistory(): Promise<SearchQuery[]> {
    // This would need userId - implement proper version
    throw new Error('getSearchHistory requires userId parameter');
  }

  async saveToHistory(query: SearchQuery): Promise<void> {
    // This would need userId - implement proper version
    throw new Error('saveToHistory requires userId parameter');
  }

  async clearHistory(): Promise<void> {
    // This would need userId - implement proper version
    throw new Error('clearHistory requires userId parameter');
  }
}
