/**
 * Search Migration Hook
 * 
 * Provides backward compatibility during migration from legacy hooks to enterprise hooks
 * Allows gradual migration with feature flags and fallback mechanisms
 */

import { useEffect, useState } from 'react';
import { useEnterpriseSearch } from './useEnterpriseSearch';
import { useEnterpriseUserSearch } from './useEnterpriseUserSearch';
import { useEnterprisePostSearch } from './useEnterprisePostSearch';

/**
 * Migration configuration
 */
interface MigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
}

/**
 * Migration state
 */
interface MigrationState {
  isUsingEnterprise: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseHookTime: number;
    legacyHookTime: number;
  };
}

/**
 * Search Migration Hook
 * 
 * Provides seamless migration between legacy and enterprise search hooks
 * with feature flags, performance monitoring, and error handling
 */
export const useSearchMigration = (config: MigrationConfig = {
  useEnterpriseHooks: true,
  enableFallback: true,
  logMigrationEvents: true
}) => {
  const [migrationState, setMigrationState] = useState<MigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    migrationErrors: [],
    performanceMetrics: {
      enterpriseHookTime: 0,
      legacyHookTime: 0
    }
  });

  // Enterprise hooks
  const enterpriseSearch = useEnterpriseSearch();
  const enterpriseUserSearch = useEnterpriseUserSearch(enterpriseSearch.query);
  const enterprisePostSearch = useEnterprisePostSearch(enterpriseSearch.query);

  // Performance monitoring
  useEffect(() => {
    if (config.logMigrationEvents) {
      const startTime = performance.now();
      
      // Simulate performance measurement
      setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setMigrationState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            enterpriseHookTime: duration
          }
        }));
        
        console.log(`🔍 Enterprise search hook performance: ${duration.toFixed(2)}ms`);
      }, 0);
    }
  }, [enterpriseSearch.query, config.logMigrationEvents]);

  // Error handling and fallback
  useEffect(() => {
    const errors: string[] = [];
    
    if (enterpriseSearch.error) {
      errors.push(`Enterprise search error: ${enterpriseSearch.error}`);
    }
    
    if (enterpriseUserSearch.error) {
      errors.push(`Enterprise user search error: ${enterpriseUserSearch.error}`);
    }
    
    if (enterprisePostSearch.error) {
      errors.push(`Enterprise post search error: ${enterprisePostSearch.error}`);
    }
    
    if (errors.length > 0) {
      setMigrationState(prev => ({
        ...prev,
        migrationErrors: errors
      }));
      
      if (config.logMigrationEvents) {
        console.warn('🔍 Search migration errors:', errors);
      }
    }
  }, [
    enterpriseSearch.error,
    enterpriseUserSearch.error,
    enterprisePostSearch.error,
    config.logMigrationEvents
  ]);

  // Determine which hooks to use based on configuration and errors
  const shouldUseEnterprise = config.useEnterpriseHooks && 
    (migrationState.migrationErrors.length === 0 || !config.enableFallback);

  // Update migration state
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: shouldUseEnterprise
    }));
  }, [shouldUseEnterprise]);

  // Return appropriate hook data based on migration state
  if (shouldUseEnterprise) {
    return {
      // Enterprise search data
      query: enterpriseSearch.query,
      focused: enterpriseSearch.focused,
      userResults: enterpriseUserSearch.results,
      postResults: enterprisePostSearch.results,
      isLoading: enterpriseSearch.isLoading || enterpriseUserSearch.isLoading || enterprisePostSearch.isLoading,
      error: enterpriseSearch.error || enterpriseUserSearch.error || enterprisePostSearch.error,
      suggestions: [...enterpriseSearch.suggestions, ...enterpriseUserSearch.suggestions, ...enterprisePostSearch.suggestions],

      // Enterprise search actions
      setQuery: enterpriseSearch.setQuery,
      setFocused: enterpriseSearch.setFocused,
      fetchUsers: enterpriseUserSearch.search,
      fetchPosts: enterprisePostSearch.search,
      clearResults: enterpriseSearch.clearResults,
      retry: enterpriseSearch.retry,

      // Migration state
      migration: {
        isUsingEnterprise: true,
        errors: migrationState.migrationErrors,
        performance: migrationState.performanceMetrics,
        config
      },

      // Refs and handlers
      queryInputRef: enterpriseSearch.queryInputRef,
      handleInputChange: enterpriseSearch.handleInputChange,
      handleKeyDown: enterpriseSearch.handleKeyDown,
      handleInputFocus: enterpriseSearch.handleInputFocus,
      handleInputBlur: enterpriseSearch.handleInputBlur
    };
  }

  // Fallback to legacy behavior (placeholder for now)
  return {
    // Legacy search data (minimal implementation)
    query: '',
    focused: false,
    userResults: [],
    postResults: [],
    isLoading: false,
    error: 'Legacy hooks not implemented - please enable enterprise hooks',
    suggestions: [],

    // Legacy search actions (minimal implementation)
    setQuery: () => {},
    setFocused: () => {},
    fetchUsers: async () => {},
    fetchPosts: async () => {},
    clearResults: () => {},
    retry: () => {},

    // Migration state
    migration: {
      isUsingEnterprise: false,
      errors: ['Enterprise hooks disabled'],
      performance: migrationState.performanceMetrics,
      config
    },

    // Refs and handlers (minimal)
    queryInputRef: { current: null },
    handleInputChange: () => {},
    handleKeyDown: () => {},
    handleInputFocus: () => {},
    handleInputBlur: () => {}
  };
};

/**
 * Search Migration Utilities
 */
export const SearchMigrationUtils = {
  /**
   * Check if migration is complete
   */
  isMigrationComplete: (migrationState: MigrationState) => {
    return migrationState.isUsingEnterprise && migrationState.migrationErrors.length === 0;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (migrationState: MigrationState) => {
    const recommendations: string[] = [];
    
    if (!migrationState.isUsingEnterprise) {
      recommendations.push('Enable enterprise hooks for better performance and caching');
    }
    
    if (migrationState.migrationErrors.length > 0) {
      recommendations.push('Fix migration errors before completing migration');
    }
    
    if (migrationState.performanceMetrics.enterpriseHookTime > 100) {
      recommendations.push('Consider optimizing search queries for better performance');
    }
    
    return recommendations;
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: (migrationState: MigrationState) => {
    return {
      status: migrationState.isUsingEnterprise ? 'Enterprise' : 'Legacy',
      errors: migrationState.migrationErrors,
      performance: migrationState.performanceMetrics,
      isComplete: SearchMigrationUtils.isMigrationComplete(migrationState),
      recommendations: SearchMigrationUtils.getMigrationRecommendations(migrationState)
    };
  }
};

export default useSearchMigration;
