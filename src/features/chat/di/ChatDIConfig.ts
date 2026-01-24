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
