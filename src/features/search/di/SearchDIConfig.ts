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
};

/**
 * Production configuration.
 */
export const productionConfig: DIContainerConfig = {
    useMockRepositories: false,
    enableLogging: true // Enable logging in production for debugging
};

/**
 * Test configuration.
 */
export const testConfig: DIContainerConfig = {
    useMockRepositories: true,
    enableLogging: false
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
