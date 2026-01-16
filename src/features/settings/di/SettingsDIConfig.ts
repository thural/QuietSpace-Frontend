/**
 * Settings DI Container Configuration.
 * 
 * Provides environment-specific configurations for the Settings DI container.
 */

import type { DIContainerConfig } from './SettingsDIContainer';

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
export const getSettingsConfig = (): DIContainerConfig => {
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
