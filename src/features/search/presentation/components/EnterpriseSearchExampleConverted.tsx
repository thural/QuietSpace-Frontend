/**
 * Enterprise Search Example Component
 * 
 * Demonstrates the usage of enterprise search hooks with
 * advanced features like caching, error handling, and suggestions
 */

import React from 'react';
import { useEnterpriseSearch } from '@features/search/application/hooks';
import { UserList } from '@/features/profile/data/models/user';
import { PostList } from '@/features/feed/data/models/post';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Search Result interface
 */
export interface ISearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  content?: string;
  author?: any;
  createdAt?: Date;
  metadata?: any;
}

/**
 * Search Metrics interface
 */
export interface ISearchMetrics {
  queryCount: number;
  cacheHitRate: number;
  averageQueryTime: number;
  totalResults: number;
}

/**
 * Enterprise Search Example Props
 */
export interface IEnterpriseSearchExampleProps extends IBaseComponentProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
  enableMigrationMode?: boolean;
}

/**
 * Enterprise Search Example State
 */
export interface IEnterpriseSearchExampleState extends IBaseComponentState {
  query: string;
  results: ISearchResult[];
  isLoading: boolean;
  errorMessage: string | null;
  showSuggestions: boolean;
  selectedCategory: 'all' | 'users' | 'posts';
  metrics: ISearchMetrics | null;
  lastQuery: string | null;
  searchHistory: string[];
}

/**
 * Enterprise Search Example Component
 * 
 * Demonstrates enterprise search capabilities with:
 * - Advanced search with caching and suggestions
 * - Real-time results and metrics
 * - Search history and categorization
 * - Migration support for legacy systems
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseSearchExample extends BaseClassComponent<IEnterpriseSearchExampleProps, IEnterpriseSearchExampleState> {
  private searchTimeout: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseSearchExampleState> {
    const {
      showSuggestions = true,
      enableMigrationMode = false
    } = this.props;

    return {
      query: '',
      results: [],
      isLoading: false,
      errorMessage: null,
      showSuggestions,
      selectedCategory: 'all',
      metrics: null,
      lastQuery: null,
      searchHistory: []
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeSearch();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupSearch();
  }

  /**
   * Initialize search system
   */
  private initializeSearch(): void {
    console.log('🔍 Enterprise search example initialized');
  }

  /**
   * Cleanup search
   */
  private cleanupSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }

  /**
   * Get enterprise search data
   */
  private getEnterpriseSearchData() {
    const { enableMigrationMode = false } = this.props;
    const { query, selectedCategory } = this.state;

    // Use either migration hook or direct enterprise hook
    const searchData = enableMigrationMode
      ? this.useSearchMigrationClass(query, selectedCategory)
      : this.useEnterpriseSearchClass(query, selectedCategory);

    return searchData;
  }

  /**
   * Class-based version of useEnterpriseSearch hook
   */
  private useEnterpriseSearchClass(query: string, category: string) {
    // Mock implementation that matches the hook interface
    return {
      results: this.generateMockResults(query, category),
      isLoading: this.state.isLoading,
      error: this.state.error,
      metrics: this.state.metrics || {
        queryCount: 0,
        cacheHitRate: 0.75,
        averageQueryTime: 120,
        totalResults: 0
      },
      suggestions: this.generateSuggestions(query),
      searchHistory: this.state.searchHistory,
      search: this.performSearch,
      clearResults: this.clearResults,
      addToHistory: this.addToHistory
    };
  }

  /**
   * Class-based version of useSearchMigration hook
   */
  private useSearchMigrationClass(query: string, category: string) {
    // Mock implementation that matches the hook interface
    return {
      results: this.generateMockResults(query, category),
      migration: {
        isUsingEnterprise: true,
        config: { enableCaching: true, maxResults: 50 },
        errors: [],
        performance: {
          enterpriseQueryTime: 85.2,
          legacyQueryTime: 156.8,
          migrationTime: 2.3
        }
      },
      isLoading: this.state.isLoading,
      error: this.state.errorMessage,
      suggestions: this.generateSuggestions(query),
      searchHistory: this.state.searchHistory,
      search: this.performSearch,
      clearResults: this.clearResults,
      migrateToEnterprise: () => console.log('Migrating to enterprise search')
    };
  }

  /**
   * Generate mock results
   */
  private generateMockResults(query: string, category: string): ISearchResult[] {
    if (!query) return [];

    const mockUsers: ISearchResult[] = [
      {
        id: 'user-1',
        type: 'user',
        title: 'John Doe',
        content: 'Software developer with expertise in React and TypeScript',
        author: { name: 'John Doe', username: 'johndoe' },
        metadata: { followers: 1234, following: 567 }
      },
      {
        id: 'user-2',
        type: 'user',
        title: 'Jane Smith',
        content: 'Product manager specializing in user experience',
        author: { name: 'Jane Smith', username: 'janesmith' },
        metadata: { followers: 892, following: 234 }
      }
    ];

    const mockPosts: ISearchResult[] = [
      {
        id: 'post-1',
        type: 'post',
        title: 'Getting Started with React Hooks',
        content: 'Learn how to use React Hooks to build modern applications...',
        author: { name: 'John Doe' },
        createdAt: new Date('2024-01-15'),
        metadata: { likes: 45, comments: 12, shares: 8 }
      },
      {
        id: 'post-2',
        type: 'post',
        title: 'TypeScript Best Practices',
        content: 'Discover the best practices for writing type-safe TypeScript code...',
        author: { name: 'Jane Smith' },
        createdAt: new Date('2024-01-10'),
        metadata: { likes: 67, comments: 23, shares: 15 }
      }
    ];

    let results = [];
    if (category === 'all' || category === 'users') {
      results = results.concat(mockUsers);
    }
    if (category === 'all' || category === 'posts') {
      results = results.concat(mockPosts);
    }

    return results.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      (result.content && result.content.toLowerCase().includes(query.toLowerCase()))
    );
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(query: string): string[] {
    if (!query) return [];

    const suggestions = [
      'React Hooks tutorial',
      'TypeScript configuration',
      'Enterprise architecture',
      'Performance optimization',
      'User experience design'
    ];

    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Handle query change
   */
  private handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    this.safeSetState({ query });

    // Debounced search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.performSearch(query);
    }, 300);
  };

  /**
   * Perform search
   */
  private performSearch = (query?: string): void => {
    const searchQuery = query || this.state.query;

    if (!searchQuery.trim()) {
      this.clearResults();
      return;
    }

    this.safeSetState({
      isLoading: true,
      error: null,
      lastQuery: searchQuery
    });

    // Simulate search delay
    setTimeout(() => {
      const results = this.generateMockResults(searchQuery, this.state.selectedCategory);
      const metrics = {
        queryCount: (this.state.metrics?.queryCount || 0) + 1,
        cacheHitRate: Math.random() * 0.3 + 0.7, // 70-100%
        averageQueryTime: Math.random() * 100 + 50, // 50-150ms
        totalResults: results.length
      };

      this.safeSetState({
        results,
        isLoading: false,
        metrics
      });

      this.addToHistory(searchQuery);
    }, 200);
  };

  /**
   * Clear results
   */
  private clearResults = (): void => {
    this.safeSetState({
      results: [],
      error: null,
      lastQuery: null
    });
  };

  /**
   * Add to search history
   */
  private addToHistory = (query: string): void => {
    this.safeSetState(prev => ({
      searchHistory: [query, ...prev.searchHistory.filter(h => h !== query)].slice(0, 10)
    }));
  };

  /**
   * Handle category change
   */
  private handleCategoryChange = (category: 'all' | 'users' | 'posts'): void => {
    this.safeSetState({ selectedCategory: category });
    if (this.state.query) {
      this.performSearch();
    }
  };

  /**
   * Handle result click
   */
  private handleResultClick = (result: ISearchResult): void => {
    console.log('Result clicked:', result);
    // Navigate to result or perform action
  };

  /**
   * Handle suggestion click
   */
  private handleSuggestionClick = (suggestion: string): void => {
    this.safeSetState({ query: suggestion });
    this.performSearch(suggestion);
  };

  /**
   * Render search input
   */
  private renderSearchInput(): React.ReactNode {
    const { query, showSuggestions } = this.state;
    const { placeholder = 'Search users, posts, and more...' } = this.props;
    const searchData = this.getEnterpriseSearchData();

    return (
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={this.handleQueryChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showSuggestions && query && searchData.suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
            {searchData.suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => this.handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="text-sm">{suggestion}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render category filters
   */
  private renderCategoryFilters(): React.ReactNode {
    const { selectedCategory } = this.state;

    return (
      <div className="flex space-x-2 mb-4">
        {(['all', 'users', 'posts'] as const).map(category => (
          <button
            key={category}
            onClick={() => this.handleCategoryChange(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render search results
   */
  private renderSearchResults(): React.ReactNode {
    const { results, isLoading, errorMessage } = this.state;

    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      );
    }

    if (errorMessage) {
      return (
        <ErrorMessage
          error={errorMessage}
          onRetry={() => this.performSearch()}
          onClear={() => this.safeSetState({ errorMessage: null })}
          variant="default"
        />
      );
    }

    if (results.length === 0 && this.state.lastQuery) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No results found</div>
          <div className="text-sm">Try adjusting your search or filters</div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => this.handleResultClick(result)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {result.type === 'user' ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {result.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-gray-500">@{result.author?.username}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {result.content?.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  By {result.author?.name} • {result.createdAt?.toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render search metrics
   */
  private renderSearchMetrics(): React.ReactNode {
    const { metrics, searchHistory } = this.state;

    if (!metrics) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Search Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Queries</div>
            <div className="font-medium">{metrics.queryCount}</div>
          </div>
          <div>
            <div className="text-gray-500">Cache Hit Rate</div>
            <div className="font-medium">{(metrics.cacheHitRate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-500">Avg Time</div>
            <div className="font-medium">{metrics.averageQueryTime.toFixed(0)}ms</div>
          </div>
          <div>
            <div className="text-gray-500">Results</div>
            <div className="font-medium">{metrics.totalResults}</div>
          </div>
        </div>

        {searchHistory.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Recent Searches</div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => this.handleSuggestionClick(item)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', enableMigrationMode = false } = this.props;
    const { lastQuery } = this.state;

    return (
      <div className={`enterprise-search-example p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise Search Example
          </h1>
          <p className="text-gray-600">
            Advanced search with caching, suggestions, and real-time results
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {this.renderSearchInput()}
        </div>

        {/* Category Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {this.renderCategoryFilters()}
        </div>

        {/* Search Results */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium mb-4">
            {lastQuery ? `Results for "${lastQuery}"` : 'Search Results'}
          </h2>
          {this.renderSearchResults()}
        </div>

        {/* Search Metrics */}
        {this.renderSearchMetrics()}
      </div>
    );
  }
}

export default EnterpriseSearchExample;
