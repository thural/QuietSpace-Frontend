/**
 * Data Service Configuration
 * 
 * Centralized configuration for cache strategies and settings
 */

/**
 * Data Service Configuration class
 */
export class DataServiceConfig {
  /**
   * Cache configuration for optimal performance
   */
  static get CACHE_CONFIG() {
    return Object.freeze({
      // Real-time data - short stale time, frequent updates
      REALTIME: {
        staleTime: 30 * 1000, // 30 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // 1 minute
      },
      // User-generated content - medium stale time
      USER_CONTENT: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        cacheTime: 15 * 60 * 1000, // 15 minutes
        refetchInterval: 5 * 60 * 1000, // 5 minutes
      },
      // Static content - long stale time
      STATIC: {
        staleTime: 30 * 60 * 1000, // 30 minutes
        cacheTime: 2 * 60 * 60 * 1000, // 2 hours
        refetchInterval: undefined,
      },
      // Critical data - very short stale time
      CRITICAL: {
        staleTime: 10 * 1000, // 10 seconds
        cacheTime: 60 * 1000, // 1 minute
        refetchInterval: 30 * 1000, // 30 seconds
      },
    });
  }

  /**
   * Environment-specific configurations
   */
  static get ENVIRONMENT_CONFIGS() {
    return Object.freeze({
      development: {
        REALTIME: {
          staleTime: 5 * 1000,  // 5 seconds - faster refresh for development
          cacheTime: 30 * 1000, // 30 seconds - shorter cache for development
          refetchInterval: 10 * 1000, // 10 seconds
        },
        USER_CONTENT: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 2 * 60 * 1000, // 2 minutes
          refetchInterval: 60 * 1000, // 1 minute
        },
      },
      production: {
        REALTIME: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 5 * 60 * 1000, // 5 minutes
          refetchInterval: 60 * 1000, // 1 minute
        },
        USER_CONTENT: {
          staleTime: 2 * 60 * 1000, // 2 minutes
          cacheTime: 15 * 60 * 1000, // 15 minutes
          refetchInterval: 5 * 60 * 1000, // 5 minutes
        },
      },
      test: {
        REALTIME: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined,
        },
        USER_CONTENT: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined,
        },
      },
    });
  }

  /**
   * Get cache configuration for environment
   * 
   * @param {string} environment - Environment name (development, production, test)
   * @returns {Object} Cache configuration for the environment
   */
  static getCacheConfig(environment = 'production') {
    const envConfig = this.ENVIRONMENT_CONFIGS[environment];
    return {
      ...this.CACHE_CONFIG,
      ...envConfig,
    };
  }

  /**
   * Get cache strategy configuration
   * 
   * @param {string} strategy - Strategy name
   * @param {string} [environment] - Environment name
   * @returns {Object} Strategy configuration
   */
  static getStrategyConfig(strategy, environment) {
    const config = environment ? this.getCacheConfig(environment) : this.CACHE_CONFIG;
    return config[strategy];
  }
}
