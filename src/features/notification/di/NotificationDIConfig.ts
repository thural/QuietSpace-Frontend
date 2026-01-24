/**
 * Notification DI Config.
 * 
 * Configuration for dependency injection container.
 */

/**
 * Environment detection utility.
 */
const getEnvironment = (): 'development' | 'test' | 'production' => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
        return process.env.NODE_ENV as 'development' | 'test' | 'production';
    }
    
    if (typeof window !== 'undefined' && (window as any).__TEST__) {
        return 'test';
    }
    
    return 'development';
};

/**
 * Get notification DI configuration based on environment.
 */
export const getNotificationConfig = () => {
    const environment = getEnvironment();
    
    const baseConfig = {
        enableLogging: environment === 'development',
        // useReactQuery removed - migrated to enterprise hooks
    };
    
    switch (environment) {
        case 'test':
            return {
                ...baseConfig,
                useMockRepositories: true,
                enableLogging: false,
            };
            
        case 'development':
            return {
                ...baseConfig,
                useMockRepositories: false, // Can be toggled for UI development
            };
            
        case 'production':
            return {
                ...baseConfig,
                useMockRepositories: false,
                enableLogging: false,
            };
            
        default:
            return baseConfig;
    }
};
