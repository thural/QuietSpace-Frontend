/**
 * Search Feature Service - Enterprise Edition
 * 
 * Enterprise-grade feature service for search functionality
 * Implements business logic, validation, and orchestration for search features
 */

import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { SearchDataService } from '../services/SearchDataService';
import { ISearchRepositoryEnhanced, EnhancedSearchQuery, EnhancedSearchResult, SearchSuggestion, SearchAnalytics, SearchPerformanceMetrics, SearchConfiguration } from '@search/domain/entities/ISearchRepositoryEnhanced';
import { SearchQuery, SearchResult, SearchFilters } from '@search/domain/entities';
import { JwtToken } from '@/shared/api/models/common';

/**
 * Search Feature Service
 * 
 * Implements business logic and orchestration for search features
 * Provides validation, data processing, and cross-service coordination
 */
@Injectable()
export class SearchFeatureService {
  constructor(
    @Inject(TYPES.SEARCH_DATA_SERVICE) private searchDataService: SearchDataService
  ) {}

  // User search business logic
  async searchUsers(query: string, filters?: SearchFilters, token?: JwtToken): Promise<any[]> {
    await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchUsers(query, filters, token);
      await this.processSearchResults(result, 'users');
      return result;
    } catch (error) {
      console.error('Error in user search:', error);
      throw error;
    }
  }

  // Post search business logic
  async searchPosts(query: string, filters?: SearchFilters, token?: JwtToken): Promise<any[]> {
    await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchPosts(query, filters, token);
      await this.processSearchResults(result, 'posts');
      return result;
    } catch (error) {
      console.error('Error in post search:', error);
      throw error;
    }
  }

  // Combined search business logic
  async searchAll(query: string, filters?: SearchFilters, token?: JwtToken): Promise<SearchResult> {
    await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchAll(query, filters, token);
      await this.processSearchResults(result, 'combined');
      return result;
    } catch (error) {
      console.error('Error in combined search:', error);
      throw error;
    }
  }

  // Enhanced search business logic
  async searchEnhanced(query: EnhancedSearchQuery, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateEnhancedSearchQuery(query);
    
    try {
      const result = await this.searchDataService.searchEnhanced(query, token);
      await this.processEnhancedSearchResults(result);
      return result;
    } catch (error) {
      console.error('Error in enhanced search:', error);
      throw error;
    }
  }

  // Search with analytics business logic
  async searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateSearchQuery(query);
    await this.validateUserId(userId);
    
    try {
      const result = await this.searchDataService.searchWithAnalytics(query, userId, token);
      await this.processEnhancedSearchResults(result);
      await this.recordSearchAnalytics(query, userId, result);
      return result;
    } catch (error) {
      console.error('Error in search with analytics:', error);
      throw error;
    }
  }

  // Suggestions business logic
  async getSuggestions(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    await this.validatePartialQuery(partialQuery);
    await this.validateLimit(limit);
    
    try {
      const suggestions = await this.searchDataService.getSuggestions(partialQuery, limit, token);
      await this.processSuggestions(suggestions, partialQuery);
      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  // Autocomplete business logic
  async getAutocomplete(partialQuery: string, limit: number = 10, token?: JwtToken): Promise<string[]> {
    await this.validatePartialQuery(partialQuery);
    await this.validateLimit(limit);
    
    try {
      const suggestions = await this.searchDataService.getAutocomplete(partialQuery, limit, token);
      return suggestions;
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      throw error;
    }
  }

  // Smart suggestions business logic
  async getSmartSuggestions(query: string, userId: string, token?: JwtToken): Promise<SearchSuggestion[]> {
    await this.validateSearchQuery(query);
    await this.validateUserId(userId);
    
    try {
      const suggestions = await this.searchDataService.getSmartSuggestions(query, userId, token);
      await this.processSuggestions(suggestions, query);
      return suggestions;
    } catch (error) {
      console.error('Error getting smart suggestions:', error);
      throw error;
    }
  }

  // Search history business logic
  async getSearchHistory(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    await this.validateUserId(userId);
    await this.validateLimit(limit);
    
    try {
      const history = await this.searchDataService.getSearchHistory(userId, limit, token);
      await this.processSearchHistory(history, userId);
      return history;
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }

  async saveToHistory(query: SearchQuery, userId: string, token?: JwtToken): Promise<void> {
    await this.validateSearchQuery(query.query);
    await this.validateUserId(userId);
    await this.validateSearchQueryData(query);
    
    try {
      await this.searchDataService.saveToHistory(query, userId, token);
      await this.processHistorySave(query, userId);
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }

  async clearHistory(userId: string, token?: JwtToken): Promise<void> {
    await this.validateUserId(userId);
    
    try {
      await this.searchDataService.clearHistory(userId, token);
      await this.processHistoryClear(userId);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  // Personalized suggestions business logic
  async getPersonalizedSuggestions(userId: string, limit: number = 10, token?: JwtToken): Promise<SearchSuggestion[]> {
    await this.validateUserId(userId);
    await this.validateLimit(limit);
    
    try {
      const suggestions = await this.searchDataService.getPersonalizedSuggestions(userId, limit, token);
      await this.processSuggestions(suggestions, 'personalized');
      return suggestions;
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      throw error;
    }
  }

  // Trending searches business logic
  async getTrendingSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    await this.validateLimit(limit);
    
    try {
      const trending = await this.searchDataService.getTrendingSearches(limit, token);
      await this.processTrendingSearches(trending);
      return trending;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      throw error;
    }
  }

  // Popular searches business logic
  async getPopularSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    await this.validateLimit(limit);
    
    try {
      const popular = await this.searchDataService.getPopularSearches(limit, token);
      await this.processPopularSearches(popular);
      return popular;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      throw error;
    }
  }

  // Recent searches business logic
  async getRecentSearches(limit: number = 10, token?: JwtToken): Promise<SearchQuery[]> {
    await this.validateLimit(limit);
    
    try {
      const recent = await this.searchDataService.getRecentSearches(limit, token);
      await this.processRecentSearches(recent);
      return recent;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      throw error;
    }
  }

  // Advanced search features business logic
  async searchByCategory(category: string, query: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateCategory(category);
    await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchByCategory(category, query, filters, token);
      await this.processEnhancedSearchResults(result);
      return result;
    } catch (error) {
      console.error('Error searching by category:', error);
      throw error;
    }
  }

  async searchByTags(tags: string[], query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateTags(tags);
    if (query) await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchByTags(tags, query, filters, token);
      await this.processEnhancedSearchResults(result);
      return result;
    } catch (error) {
      console.error('Error searching by tags:', error);
      throw error;
    }
  }

  async searchByLocation(location: string, radius?: number, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateLocation(location);
    if (radius) await this.validateRadius(radius);
    if (query) await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchByLocation(location, radius, query, filters, token);
      await this.processEnhancedSearchResults(result);
      return result;
    } catch (error) {
      console.error('Error searching by location:', error);
      throw error;
    }
  }

  async searchByDateRange(startDate: string, endDate: string, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult> {
    await this.validateDateRange(startDate, endDate);
    if (query) await this.validateSearchQuery(query);
    await this.validateSearchFilters(filters);
    
    try {
      const result = await this.searchDataService.searchByDateRange(startDate, endDate, query, filters, token);
      await this.processEnhancedSearchResults(result);
      return result;
    } catch (error) {
      console.error('Error searching by date range:', error);
      throw error;
    }
  }

  // Analytics business logic
  async getSearchAnalytics(userId: string, period: string, token?: JwtToken): Promise<SearchAnalytics> {
    await this.validateUserId(userId);
    await this.validatePeriod(period);
    
    try {
      const analytics = await this.searchDataService.getSearchAnalytics(userId, period, token);
      await this.processAnalytics(analytics, userId);
      return analytics;
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw error;
    }
  }

  async getSearchPerformanceMetrics(query: string, period: string, token?: JwtToken): Promise<SearchPerformanceMetrics[]> {
    await this.validateSearchQuery(query);
    await this.validatePeriod(period);
    
    try {
      const metrics = await this.searchDataService.getSearchPerformanceMetrics(query, period, token);
      await this.processPerformanceMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Error getting search performance metrics:', error);
      throw error;
    }
  }

  async recordSearchMetrics(metrics: SearchPerformanceMetrics, token?: JwtToken): Promise<void> {
    await this.validateSearchMetrics(metrics);
    
    try {
      await this.searchDataService.recordSearchMetrics(metrics, token);
      await this.processMetricsRecording(metrics);
    } catch (error) {
      console.error('Error recording search metrics:', error);
      throw error;
    }
  }

  // Configuration business logic
  async getSearchConfiguration(token?: JwtToken): Promise<SearchConfiguration> {
    try {
      const config = await this.searchDataService.getSearchConfiguration(token);
      await this.processConfiguration(config);
      return config;
    } catch (error) {
      console.error('Error getting search configuration:', error);
      throw error;
    }
  }

  async updateSearchConfiguration(config: Partial<SearchConfiguration>, token?: JwtToken): Promise<SearchConfiguration> {
    await this.validateSearchConfiguration(config);
    
    try {
      const updatedConfig = await this.searchDataService.updateSearchConfiguration(config, token);
      await this.processConfigurationUpdate(updatedConfig);
      return updatedConfig;
    } catch (error) {
      console.error('Error updating search configuration:', error);
      throw error;
    }
  }

  // Validation methods
  private async validateSearchQuery(query: string): Promise<void> {
    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required and must be a string');
    }
    
    if (query.length < 1) {
      throw new Error('Search query must be at least 1 character long');
    }
    
    if (query.length > 1000) {
      throw new Error('Search query must be less than 1000 characters');
    }
    
    // Check for potentially malicious content
    if (this.containsMaliciousContent(query)) {
      throw new Error('Search query contains potentially malicious content');
    }
  }

  private async validatePartialQuery(partialQuery: string): Promise<void> {
    if (!partialQuery || typeof partialQuery !== 'string') {
      throw new Error('Partial query is required and must be a string');
    }
    
    if (partialQuery.length > 500) {
      throw new Error('Partial query must be less than 500 characters');
    }
  }

  private async validateEnhancedSearchQuery(query: EnhancedSearchQuery): Promise<void> {
    await this.validateSearchQuery(query.query);
    
    if (query.pagination) {
      if (query.pagination.page < 0) {
        throw new Error('Page number must be non-negative');
      }
      
      if (query.pagination.size < 1 || query.pagination.size > 100) {
        throw new Error('Page size must be between 1 and 100');
      }
    }
    
    if (query.sorting) {
      if (!query.sorting.field || typeof query.sorting.field !== 'string') {
        throw new Error('Sorting field is required');
      }
      
      if (!['asc', 'desc'].includes(query.sorting.direction)) {
        throw new Error('Sorting direction must be "asc" or "desc"');
      }
    }
  }

  private async validateSearchFilters(filters?: SearchFilters): Promise<void> {
    if (!filters) return;
    
    // Validate filter structure and values
    if (typeof filters !== 'object') {
      throw new Error('Search filters must be an object');
    }
    
    // Add specific filter validations as needed
  }

  private async validateUserId(userId: string): Promise<void> {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID is required and must be a string');
    }
  }

  private async validateLimit(limit: number): Promise<void> {
    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new Error('Limit must be a number between 1 and 100');
    }
  }

  private async validateCategory(category: string): Promise<void> {
    if (!category || typeof category !== 'string') {
      throw new Error('Category is required and must be a string');
    }
  }

  private async validateTags(tags: string[]): Promise<void> {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error('Tags must be a non-empty array');
    }
    
    if (tags.length > 50) {
      throw new Error('Maximum 50 tags allowed');
    }
    
    for (const tag of tags) {
      if (typeof tag !== 'string' || tag.length > 50) {
        throw new Error('Each tag must be a string less than 50 characters');
      }
    }
  }

  private async validateLocation(location: string): Promise<void> {
    if (!location || typeof location !== 'string') {
      throw new Error('Location is required and must be a string');
    }
    
    if (location.length > 200) {
      throw new Error('Location must be less than 200 characters');
    }
  }

  private async validateRadius(radius: number): Promise<void> {
    if (typeof radius !== 'number' || radius < 0 || radius > 10000) {
      throw new Error('Radius must be a number between 0 and 10000');
    }
  }

  private async validateDateRange(startDate: string, endDate: string): Promise<void> {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }
    
    if (start >= end) {
      throw new Error('Start date must be before end date');
    }
    
    // Limit date range to 1 year
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > oneYear) {
      throw new Error('Date range cannot exceed 1 year');
    }
  }

  private async validatePeriod(period: string): Promise<void> {
    const validPeriods = ['1h', '24h', '7d', '30d', '90d', '1y'];
    if (!validPeriods.includes(period)) {
      throw new Error(`Period must be one of: ${validPeriods.join(', ')}`);
    }
  }

  private async validateSearchQueryData(query: SearchQuery): Promise<void> {
    if (!query || typeof query !== 'object') {
      throw new Error('Search query data is required and must be an object');
    }
    
    if (!query.query || typeof query.query !== 'string') {
      throw new Error('Search query text is required');
    }
  }

  private async validateSearchMetrics(metrics: SearchPerformanceMetrics): Promise<void> {
    if (!metrics || typeof metrics !== 'object') {
      throw new Error('Search metrics are required and must be an object');
    }
    
    if (!metrics.query || typeof metrics.query !== 'string') {
      throw new Error('Query is required in metrics');
    }
    
    if (typeof metrics.duration !== 'number' || metrics.duration < 0) {
      throw new Error('Duration must be a non-negative number');
    }
  }

  private async validateSearchConfiguration(config: Partial<SearchConfiguration>): Promise<void> {
    if (!config || typeof config !== 'object') {
      throw new Error('Search configuration is required and must be an object');
    }
    
    // Add specific configuration validations as needed
  }

  // Processing methods
  private async processSearchResults(results: any, type: string): Promise<void> {
    // Add business logic for processing search results
    // This could include:
    // - Relevance scoring adjustments
    // - Content filtering
    // - Personalization
    // - Security checks
  }

  private async processEnhancedSearchResults(results: EnhancedSearchResult): Promise<void> {
    // Add business logic for processing enhanced search results
    // This could include:
    // - Advanced relevance scoring
    // - Facet processing
    // - Highlight generation
    // - Analytics tracking
  }

  private async processSuggestions(suggestions: SearchSuggestion[], context: string): Promise<void> {
    // Add business logic for processing suggestions
    // This could include:
    // - Relevance scoring
    // - Personalization
    // - Frequency analysis
    // - Trending analysis
  }

  private async processSearchHistory(history: SearchQuery[], userId: string): Promise<void> {
    // Add business logic for processing search history
    // This could include:
    // - Privacy filtering
    // - Deduplication
    // - Relevance scoring
    // - Analytics tracking
  }

  private async processHistorySave(query: SearchQuery, userId: string): Promise<void> {
    // Add business logic for processing history save
    // This could include:
    // - Analytics tracking
    // - Trending updates
    // - Personalization updates
  }

  private async processHistoryClear(userId: string): Promise<void> {
    // Add business logic for processing history clear
    // This could include:
    // - Analytics tracking
    // - Privacy compliance
    // - Cache invalidation
  }

  private async processTrendingSearches(trending: SearchQuery[]): Promise<void> {
    // Add business logic for processing trending searches
    // This could include:
    // - Relevance validation
    // - Content filtering
    // - Analytics tracking
  }

  private async processPopularSearches(popular: SearchQuery[]): Promise<void> {
    // Add business logic for processing popular searches
    // This could include:
    // - Frequency validation
    // - Content filtering
    // - Analytics tracking
  }

  private async processRecentSearches(recent: SearchQuery[]): Promise<void> {
    // Add business logic for processing recent searches
    // This could include:
    // - Time validation
    // - Content filtering
    // - Privacy checks
  }

  private async recordSearchAnalytics(query: string, userId: string, result: EnhancedSearchResult): Promise<void> {
    // Add business logic for recording search analytics
    // This could include:
    // - Search tracking
    // - User behavior analysis
    // - Performance metrics
  }

  private async processAnalytics(analytics: SearchAnalytics, userId: string): Promise<void> {
    // Add business logic for processing analytics
    // This could include:
    // - Data aggregation
    // - Privacy filtering
    // - Performance calculations
  }

  private async processPerformanceMetrics(metrics: SearchPerformanceMetrics[]): Promise<void> {
    // Add business logic for processing performance metrics
    // This could include:
    // - Data aggregation
    // - Anomaly detection
    // - Performance analysis
  }

  private async processMetricsRecording(metrics: SearchPerformanceMetrics): Promise<void> {
    // Add business logic for processing metrics recording
    // This could include:
    // - Validation
    // - Enrichment
    // - Storage
  }

  private async processConfiguration(config: SearchConfiguration): Promise<void> {
    // Add business logic for processing configuration
    // This could include:
    // - Validation
    // - Default value setting
    // - Security checks
  }

  private async processConfigurationUpdate(config: SearchConfiguration): Promise<void> {
    // Add business logic for processing configuration update
    // This could include:
    // - Validation
    // - Change tracking
    // - Cache invalidation
  }

  // Utility methods
  private containsMaliciousContent(query: string): boolean {
    // Basic malicious content detection
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /expression\s*\(/i,
      /@import/i,
      /vbscript:/i
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(query));
  }
}
