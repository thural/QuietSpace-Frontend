/**
 * Chat DI Container Configuration.
 * 
 * Provides environment-specific configurations for Chat DI container.
 */

import type { DIContainerConfig } from './ChatDIContainer';

/**
 * Development configuration.
 */
export const developmentConfig: DIContainerConfig = {
    useMockRepositories: true,
    enableLogging: true,
    useReactQuery: false // Disabled by default in development
};

/**
 * Production configuration.
 */
export const productionConfig: DIContainerConfig = {
    useMockRepositories: false,
    enableLogging: true, // Enable logging in production for debugging
    useReactQuery: true
};

/**
 * Test configuration.
 */
export const testConfig: DIContainerConfig = {
    useMockRepositories: true,
    enableLogging: false,
    useReactQuery: false
};

/**
 * Get configuration based on environment.
 */
export const getChatConfig = (): DIContainerConfig => {
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
