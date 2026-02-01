/**
 * Enhanced Search Repository Interface - Enterprise Edition
 * 
 * Comprehensive interface for search data access operations
 * Supports advanced search features, caching, and enterprise-grade functionality
 */

import type { UserList } from "../../../profile/data/models/user";
import type { PostList } from "../../../feed/data/models/index";
import type { SearchQuery, SearchResult, SearchFilters } from "./index";
import type { JwtToken } from "../../../../shared/api/models/common";

/**
 * Enhanced search query interface with pagination and filtering
 */
export interface EnhancedSearchQuery {
  query: string;
  filters?: SearchFilters;
  pagination?: {
    page: number;
    size: number;
    offset?: number;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  highlighting?: {
    enabled: boolean;
    fields: string[];
    preTag: string;
    postTag: string;
  };
  faceting?: {
    enabled: boolean;
    fields: string[];
    size: number;
  };
  aggregations?: {
    enabled: boolean;
    types: string[];
    size: number;
  };
}

/**
 * Search result with metadata and analytics
 */
export interface EnhancedSearchResult extends SearchResult {
  // Enhanced metadata
  searchId: string;
  sessionId?: string;
  userId?: string;

  // Performance metrics
  searchDuration: number;
  cacheHit: boolean;
  indexUsed: string;
  algorithm: 'fulltext' | 'fuzzy' | 'semantic' | 'hybrid';

  // Result quality metrics
  relevanceScore: number;
  confidence: number;
  qualityScore: number;

  // Pagination info
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  // Faceted search results
  facets?: Record<string, Array<{
    value: string;
    count: number;
    selected?: boolean;
  }>>;

  // Aggregations
  aggregations?: Record<string, any>;

  // Highlighting
  highlights?: Record<string, string[]>;

  // Suggestions
  suggestions?: string[];

  // Related searches
  relatedSearches?: string[];

  // Spell corrections
  spellCorrections?: Array<{
    original: string;
    corrected: string;
    confidence: number;
  }>;

  // Search context
  context?: {
    previousQueries: string[];
    userPreferences: Record<string, any>;
    searchHistory: string[];
  };

  // Analytics data
  analytics?: {
    clickThroughRate: number;
    averagePosition: number;
    impressionCount: number;
    conversionRate: number;
  };

  // Debug information
  debug?: {
    queryExplanation: string;
    indexStats: Record<string, any>;
    performanceBreakdown: Record<string, number>;
  };
}

/**
 * Search suggestion interface
 */
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'user' | 'post' | 'tag' | 'category';
  score: number;
  source: 'history' | 'popular' | 'trending' | 'semantic' | 'autocomplete';
  metadata?: {
    userId?: string;
    postId?: string;
    category?: string;
    tag?: string;
    frequency?: number;
    lastUsed?: string;
  };
}

/**
 * Search analytics interface
 */
export interface SearchAnalytics {
  userId: string;
  period: string;
  totalSearches: number;
  uniqueQueries: number;
  averageResults: number;
  averageDuration: number;
  clickThroughRate: number;
  topQueries: Array<{
    query: string;
    count: number;
    avgResults: number;
    ctr: number;
  }>;
  noResultQueries: string[];
  popularFilters: Array<{
    filter: string;
    value: string;
    count: number;
  }>;
  searchTrends: Array<{
    date: string;
    searches: number;
    uniqueUsers: number;
  }>;
  performanceMetrics: {
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

/**
 * Search performance metrics interface
 */
export interface SearchPerformanceMetrics {
  query: string;
  timestamp: string;
  duration: number;
  cacheHit: boolean;
  resultsCount: number;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  indexUsed: string;
  algorithm: string;
  error?: string;
}

/**
 * Search configuration interface
 */
export interface SearchConfiguration {
  // General settings
  maxResults: number;
  defaultPageSize: number;
  maxPageSize: number;

  // Caching settings
  cacheEnabled: boolean;
  cacheTTL: number;
  cacheMaxSize: number;

  // Search algorithms
  defaultAlgorithm: 'fulltext' | 'fuzzy' | 'semantic' | 'hybrid';
  enableFuzzySearch: boolean;
  fuzzyThreshold: number;
  enableSemanticSearch: boolean;

  // Performance settings
  enableHighlighting: boolean;
  enableFaceting: boolean;
  enableAggregations: boolean;
  enableSuggestions: boolean;

  // Analytics settings
  enableAnalytics: boolean;
  anonymizeAnalytics: boolean;
  retentionPeriod: number;

  // Rate limiting
  enableRateLimiting: boolean;
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;

  // Security settings
  enableSearchLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableQuerySanitization: boolean;

  // Index settings
  indexRefreshInterval: number;
  enableRealTimeIndexing: boolean;
  indexShards: number;
  indexReplicas: number;
}

/**
 * Enhanced search repository interface
 */
export interface ISearchRepositoryEnhanced {
  // Basic search operations
  searchUsers(query: string, filters?: SearchFilters): Promise<UserList>;
  searchPosts(query: string, filters?: SearchFilters): Promise<PostList>;
  searchAll(query: string, filters?: SearchFilters): Promise<SearchResult>;

  // Enhanced search operations
  searchEnhanced(query: EnhancedSearchQuery, token?: JwtToken): Promise<EnhancedSearchResult>;
  searchWithAnalytics(query: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Suggestions and autocomplete
  getSuggestions(partialQuery: string, limit?: number, token?: JwtToken): Promise<SearchSuggestion[]>;
  getAutocomplete(partialQuery: string, limit?: number, token?: JwtToken): Promise<string[]>;
  getSmartSuggestions(query: string, userId: string, token?: JwtToken): Promise<SearchSuggestion[]>;

  // Search history and personalization
  getSearchHistory(userId: string, limit?: number, token?: JwtToken): Promise<SearchQuery[]>;
  saveToHistory(query: SearchQuery, userId: string, token?: JwtToken): Promise<void>;
  clearHistory(userId: string, token?: JwtToken): Promise<void>;
  getPersonalizedSuggestions(userId: string, limit?: number, token?: JwtToken): Promise<SearchSuggestion[]>;

  // Trending and popular searches
  getTrendingSearches(limit?: number, token?: JwtToken): Promise<SearchQuery[]>;
  getPopularSearches(limit?: number, token?: JwtToken): Promise<SearchQuery[]>;
  getRecentSearches(limit?: number, token?: JwtToken): Promise<SearchQuery[]>;

  // Advanced search features
  searchByCategory(category: string, query: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult>;
  searchByTags(tags: string[], query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult>;
  searchByLocation(location: string, radius?: number, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult>;
  searchByDateRange(startDate: string, endDate: string, query?: string, filters?: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Advanced filtering
  searchWithFilters(query: string, filters: SearchFilters, token?: JwtToken): Promise<EnhancedSearchResult>;
  searchWithFacets(query: string, facetFields: string[], token?: JwtToken): Promise<EnhancedSearchResult>;
  searchWithAggregations(query: string, aggregationTypes: string[], token?: JwtToken): Promise<EnhancedSearchResult>;

  // Real-time search
  supportsRealTimeSearch(): boolean;
  subscribeToRealTimeSearch(callback: (results: EnhancedSearchResult) => void, token?: JwtToken): () => void;
  enableRealTimeSearch(userId: string, token?: JwtToken): Promise<void>;
  disableRealTimeSearch(userId: string, token?: JwtToken): Promise<void>;

  // Search analytics and metrics
  getSearchAnalytics(userId: string, period: string, token?: JwtToken): Promise<SearchAnalytics>;
  getSearchPerformanceMetrics(query: string, period: string, token?: JwtToken): Promise<SearchPerformanceMetrics[]>;
  recordSearchMetrics(metrics: SearchPerformanceMetrics, token?: JwtToken): Promise<void>;

  // Search configuration and management
  getSearchConfiguration(token?: JwtToken): Promise<SearchConfiguration>;
  updateSearchConfiguration(config: Partial<SearchConfiguration>, token?: JwtToken): Promise<SearchConfiguration>;
  resetSearchConfiguration(token?: JwtToken): Promise<void>;

  // Index management
  getIndexStatus(token?: JwtToken): Promise<Record<string, any>>;
  rebuildIndex(token?: JwtToken): Promise<void>;
  optimizeIndex(token?: JwtToken): Promise<void>;

  // Search health and monitoring
  getSearchHealth(token?: JwtToken): Promise<Record<string, any>>;
  getSearchStatistics(token?: JwtToken): Promise<Record<string, any>>;

  // Advanced search operations
  semanticSearch(query: string, context?: string[], token?: JwtToken): Promise<EnhancedSearchResult>;
  hybridSearch(query: string, weights?: Record<string, number>, token?: JwtToken): Promise<EnhancedSearchResult>;
  federatedSearch(queries: string[], sources: string[], token?: JwtToken): Promise<EnhancedSearchResult[]>;

  // Search optimization
  optimizeQuery(query: string, token?: JwtToken): Promise<string>;
  validateQuery(query: string, token?: JwtToken): Promise<boolean>;
  sanitizeQuery(query: string, token?: JwtToken): Promise<string>;

  // Search debugging
  explainQuery(query: string, token?: JwtToken): Promise<Record<string, any>>;
  debugSearch(query: string, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Search export and import
  exportSearchResults(query: string, format: 'json' | 'csv' | 'xml', token?: JwtToken): Promise<Blob>;
  importSearchData(data: Blob, format: 'json' | 'csv' | 'xml', token?: JwtToken): Promise<void>;

  // Search alerts and notifications
  createSearchAlert(query: string, userId: string, token?: JwtToken): Promise<void>;
  removeSearchAlert(alertId: string, userId: string, token?: JwtToken): Promise<void>;
  getSearchAlerts(userId: string, token?: JwtToken): Promise<SearchQuery[]>;

  // Search collaboration
  shareSearch(searchId: string, userIds: string[], token?: JwtToken): Promise<void>;
  getSharedSearches(userId: string, token?: JwtToken): Promise<EnhancedSearchResult[]>;

  // Search templates
  createSearchTemplate(template: Record<string, any>, userId: string, token?: JwtToken): Promise<void>;
  getSearchTemplates(userId: string, token?: JwtToken): Promise<Record<string, any>[]>;
  applySearchTemplate(templateId: string, userId: string, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Search API compatibility
  getCapabilities(): RepositoryCapabilitiesEnhanced;
  supportsFeature(feature: string): boolean;
  getVersion(): string;

  // Search caching
  getCachedResult(key: string): Promise<EnhancedSearchResult | null>;
  setCachedResult(key: string, result: EnhancedSearchResult, ttl?: number): Promise<void>;
  invalidateCache(pattern?: string): Promise<void>;
  clearCache(): Promise<void>;

  // Search rate limiting
  checkRateLimit(userId: string, token?: JwtToken): Promise<boolean>;
  getRateLimitStatus(userId: string, token?: JwtToken): Promise<Record<string, any>>;

  // Search security
  validateSearchAccess(userId: string, query: string, token?: JwtToken): Promise<boolean>;
  sanitizeSearchResults(results: EnhancedSearchResult, userId: string, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Search internationalization
  searchWithLanguage(query: string, language: string, token?: JwtToken): Promise<EnhancedSearchResult>;
  getSupportedLanguages(token?: JwtToken): Promise<string[]>;

  // Search accessibility
  getAccessibleSearchResults(query: string, accessibilityOptions: Record<string, any>, token?: JwtToken): Promise<EnhancedSearchResult>;

  // Search machine learning
  getMLSearchSuggestions(query: string, userId: string, token?: JwtToken): Promise<SearchSuggestion[]>;
  trainSearchModel(trainingData: any[], token?: JwtToken): Promise<void>;

  // Search A/B testing
  getSearchVariant(userId: string, testId: string, token?: JwtToken): Promise<string>;
  recordSearchABTestResult(testId: string, variant: string, metrics: Record<string, any>, token?: JwtToken): Promise<void>;
}

/**
 * Enhanced repository capabilities interface
 */
export interface RepositoryCapabilitiesEnhanced {
  // Basic capabilities
  supportsUserSearch: boolean;
  supportsPostSearch: boolean;
  supportsRealTime: boolean;
  supportsHistory: boolean;
  supportsSuggestions: boolean;
  supportsAdvancedFilters: boolean;

  // Enhanced capabilities
  supportsSemanticSearch: boolean;
  supportsFuzzySearch: boolean;
  supportsHybridSearch: boolean;
  supportsFacetedSearch: boolean;
  supportsAggregations: boolean;
  supportsHighlighting: boolean;
  supportsAnalytics: boolean;
  supportsPersonalization: boolean;
  supportsInternationalization: boolean;
  supportsAccessibility: boolean;
  supportsMachineLearning: boolean;
  supportsABTesting: boolean;

  // Performance capabilities
  maxResults: number;
  maxPageSize: number;
  supportedAlgorithms: ('fulltext' | 'fuzzy' | 'semantic' | 'hybrid')[];
  supportsCaching: boolean;
  supportsRateLimiting: boolean;

  // Index capabilities
  supportsRealTimeIndexing: boolean;
  supportsIndexOptimization: boolean;
  supportsIndexRebuilding: boolean;
  indexShards: number;
  indexReplicas: number;

  // API capabilities
  supportedFormats: ('json' | 'csv' | 'xml')[];
  supportedLanguages: string[];
  supportedAccessibilityFeatures: string[];

  // Integration capabilities
  supportsWebhooks: boolean;
  supportsIntegrations: string[];
  supportsCollaboration: boolean;

  // Monitoring capabilities
  supportsHealthMonitoring: boolean;
  supportsPerformanceMonitoring: boolean;
  supportsDebugging: boolean;

  // Security capabilities
  supportsAccessControl: boolean;
  supportsDataSanitization: boolean;
  supportsQueryValidation: boolean;
  supportsRateLimitingControl: boolean;
}
