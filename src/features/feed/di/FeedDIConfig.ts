/**
 * Feed DI Configuration.
 * 
 * Configuration object for Feed feature dependency injection.
 * Allows switching between mock and real implementations.
 */

export interface FeedDIConfig {
    useMockRepositories: boolean;
    enableRealTimeUpdates: boolean;
    enableOptimisticUpdates: boolean;
    apiBaseUrl?: string;
    defaultPageSize?: number;
    enableCaching?: boolean;
}

/**
 * Default DI configuration for Feed feature
 */
export const DEFAULT_FEED_DI_CONFIG: FeedDIConfig = {
    useMockRepositories: false,
    enableRealTimeUpdates: true,
    enableOptimisticUpdates: true,
    apiBaseUrl: undefined,
    defaultPageSize: 10,
    enableCaching: true
};

/**
 * Environment-specific configurations
 */
export const ENVIRONMENT_FEED_CONFIGS: Record<string, FeedDIConfig> = {
    development: {
        ...DEFAULT_FEED_DI_CONFIG,
        useMockRepositories: true,
        enableRealTimeUpdates: false,
        enableOptimisticUpdates: false
    },
    staging: {
        ...DEFAULT_FEED_DI_CONFIG,
        useMockRepositories: false,
        enableRealTimeUpdates: true,
        enableOptimisticUpdates: true
    },
    production: {
        ...DEFAULT_FEED_DI_CONFIG,
        useMockRepositories: false,
        enableRealTimeUpdates: true,
        enableOptimisticUpdates: true
    }
};

/**
 * Get current environment configuration
 */
export const getFeedDIConfig = (): FeedDIConfig => {
    const environment = process.env.NODE_ENV || 'development';
    return ENVIRONMENT_FEED_CONFIGS[environment] || DEFAULT_FEED_DI_CONFIG;
};
