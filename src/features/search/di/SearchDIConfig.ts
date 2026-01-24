/**
 * Search DI Configuration.
 * 
 * Provides environment-specific configurations for the Search DI container.
 */

import type { DIContainerConfig } from './SearchDIContainer';

/**
 * Development configuration.
 */
export const developmentConfig: DIContainerConfig = {
    useMockRepositories: true,
    enableLogging: true
    // useReactQuery removed - migrated to enterprise hooks
};

/**
 * Production configuration.
 */
export const productionConfig: DIContainerConfig = {
    useMockRepositories: false,
    enableLogging: true // Enable logging in production for debugging
    // useReactQuery removed - migrated to enterprise hooks
};

/**
 * Test configuration.
 */
export const testConfig: DIContainerConfig = {
    useMockRepositories: true,
    enableLogging: false
    // useReactQuery removed - migrated to enterprise hooks
};

/**
 * Get configuration based on environment.
 */
export const getSearchConfig = (): DIContainerConfig => {
    const env = process.env.NODE_ENV || 'development';
    
    switch (env) {
        case 'production':
            return productionConfig;
        case 'test':
            return testConfig;
        default:
            return developmentConfig;
    }
};

/**
 * Custom configuration builder.
 */
export const createSearchConfig = (overrides: Partial<DIContainerConfig>): DIContainerConfig => {
    const baseConfig = getSearchConfig();
    return { ...baseConfig, ...overrides };
};
