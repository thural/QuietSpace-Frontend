/**
 * Platform-Specific DI Container Factory
 * 
 * Implements the Manual Registration + Factory Functions pattern
 * with build-time configuration for maximum tree-shaking.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../container/Container.js').Container} Container
 * @typedef {import('../types.js').TypeKeys} TypeKeys
 * @typedef {import('../../config/types.js').BuildConfig} BuildConfig
 * @typedef {import('../../config/types.js').Platform} Platform
 * @typedef {import('../../config/platform-configs.js').PLATFORM_CONFIG} PLATFORM_CONFIG
 */

import { Container } from '../container/Container.js';
import { TYPES } from '../types.js';
import { PLATFORM_CONFIG } from '../../config/platform-configs.js';

/**
 * Platform-Specific Service Registration
 * Services are registered based on platform capabilities
 * 
 * @function registerPlatformServices
 * @param {Container} container - DI container instance
 * @param {BuildConfig} config - Build configuration
 * @returns {void}
 * @description Registers platform-specific services based on capabilities
 */
function registerPlatformServices(container, config) {
    // WebSocket Service - Only for platforms that support it
    if (config.enableWebSocket) {
        container.registerSingletonByToken(
            TYPES.WEBSOCKET_SERVICE,
            () => {
                // Placeholder for WebSocket service
                console.log('WebSocket service would be registered here');
                return { connect: () => { }, disconnect: () => { } };
            }
        );
    }

    // Cache Service - Platform-specific implementations
    if (config.cacheStrategy === 'memory') {
        container.registerSingletonByToken(
            TYPES.CACHE_SERVICE,
            () => {
                // Placeholder for Memory Cache Provider
                console.log('Memory cache provider would be registered here');
                return { get: () => { }, set: () => { }, clear: () => { } };
            }
        );
    } else if (config.cacheStrategy === 'persistent') {
        container.registerSingletonByToken(
            TYPES.CACHE_SERVICE,
            () => {
                // Placeholder for Persistent Cache Provider
                console.log('Persistent cache provider would be registered here');
                return { get: () => { }, set: () => { }, clear: () => { } };
            }
        );
    } else {
        // Hybrid strategy
        container.registerSingletonByToken(
            TYPES.CACHE_SERVICE,
            () => {
                // Placeholder for Hybrid Cache Provider
                console.log('Hybrid cache provider would be registered here');
                return { get: () => { }, set: () => { }, clear: () => { } };
            }
        );
    }

    // Push Notifications - Only for platforms that support it
    if (config.enablePushNotifications) {
        if (config.platform === 'mobile') {
            container.registerSingletonByToken(
                TYPES.PUSH_NOTIFICATION_SERVICE,
                () => {
                    // Placeholder for Mobile Push Service
                    console.log('Mobile push service would be registered here');
                    return { subscribe: () => { }, unsubscribe: () => { } };
                }
            );
        } else if (config.platform === 'web') {
            container.registerSingletonByToken(
                TYPES.PUSH_NOTIFICATION_SERVICE,
                () => {
                    // Placeholder for Web Push Service
                    console.log('Web push service would be registered here');
                    return { subscribe: () => { }, unsubscribe: () => { } };
                }
            );
        } else if (config.platform === 'desktop') {
            container.registerSingletonByToken(
                TYPES.PUSH_NOTIFICATION_SERVICE,
                () => {
                    // Placeholder for Desktop Push Service
                    console.log('Desktop push service would be registered here');
                    return { subscribe: () => { }, unsubscribe: () => { } };
                }
            );
        }
    }

    // Background Sync - Only for platforms that support it
    if (config.enableBackgroundSync && (config.platform === 'mobile' || config.platform === 'desktop')) {
        container.registerSingletonByToken(
            'BACKGROUND_SYNC_SERVICE',
            () => {
                // Placeholder for Background Sync Service
                console.log('Background sync service would be registered here');
                return { sync: () => { }, schedule: () => { } };
            }
        );
    }

    // Platform-specific repositories
    registerPlatformRepositories(container, config);
}

/**
 * Platform-Specific Repository Registration
 * 
 * @function registerPlatformRepositories
 * @param {Container} container - DI container instance
 * @param {BuildConfig} config - Build configuration
 * @returns {void}
 * @description Registers platform-specific repository implementations
 */
function registerPlatformRepositories(container, config) {
    // Feed Repository - Platform-specific implementations
    if (config.platform === 'mobile') {
        container.registerSingletonByToken(
            TYPES.IFEED_REPOSITORY,
            () => {
                // Placeholder for Mobile Feed Repository
                console.log('Mobile feed repository would be registered here');
                return { getFeed: () => { }, createPost: () => { } };
            }
        );
    } else if (config.platform === 'server') {
        container.registerSingletonByToken(
            TYPES.IFEED_REPOSITORY,
            () => {
                // Placeholder for Server Feed Repository
                console.log('Server feed repository would be registered here');
                return { getFeed: () => { }, createPost: () => { } };
            }
        );
    } else {
        // Web and Desktop use the same repository
        container.registerSingletonByToken(
            TYPES.IFEED_REPOSITORY,
            () => {
                // Placeholder for Web Feed Repository
                console.log('Web feed repository would be registered here');
                return { getFeed: () => { }, createPost: () => { } };
            }
        );
    }

    // Post Repository - Platform-specific implementations
    if (config.platform === 'mobile') {
        container.registerSingletonByToken(
            TYPES.IPOST_REPOSITORY,
            () => {
                // Placeholder for Mobile Post Repository
                console.log('Mobile post repository would be registered here');
                return { getPost: () => { }, updatePost: () => { } };
            }
        );
    } else if (config.platform === 'server') {
        container.registerSingletonByToken(
            TYPES.IPOST_REPOSITORY,
            () => {
                // Placeholder for Server Post Repository
                console.log('Server post repository would be registered here');
                return { getPost: () => { }, updatePost: () => { } };
            }
        );
    } else {
        // Web and Desktop use the same repository
        container.registerSingletonByToken(
            TYPES.IPOST_REPOSITORY,
            () => {
                // Placeholder for Web Post Repository
                console.log('Web post repository would be registered here');
                return { getPost: () => { }, updatePost: () => { } };
            }
        );
    }

    // Chat Repository - Platform-specific implementations
    if (config.platform === 'server') {
        container.registerSingletonByToken(
            TYPES.ICHAT_REPOSITORY,
            () => {
                // Placeholder for Server Chat Repository
                console.log('Server chat repository would be registered here');
                return { getMessages: () => { }, sendMessage: () => { } };
            }
        );
    } else {
        // All client platforms use the same repository
        container.registerSingletonByToken(
            TYPES.ICHAT_REPOSITORY,
            () => {
                // Placeholder for Client Chat Repository
                console.log('Client chat repository would be registered here');
                return { getMessages: () => { }, sendMessage: () => { } };
            }
        );
    }
}

/**
 * Core Service Registration
 * Services that are common across all platforms
 * 
 * @function registerCoreServices
 * @param {Container} container - DI container instance
 * @param {BuildConfig} config - Build configuration
 * @returns {void}
 * @description Registers core services common to all platforms
 */
function registerCoreServices(container, config) {
    // Authentication Service - Core service
    container.registerSingletonByToken(
        TYPES.AUTH_SERVICE,
        () => {
            // Placeholder for Auth Service
            console.log('Auth service would be registered here');
            return { login: () => { }, logout: () => { }, isAuthenticated: () => false };
        }
    );

    // Logger Service - Platform-specific log levels
    container.registerSingletonByToken(
        'LOGGER_SERVICE',
        () => {
            // Placeholder for Logger Service
            console.log('Logger service would be registered here');
            return { log: () => { }, error: () => { }, warn: () => { }, info: () => { } };
        }
    );

    // API Service - Platform-specific endpoints
    container.registerSingletonByToken(
        'API_SERVICE',
        () => {
            // Placeholder for API Service
            console.log('API service would be registered here');
            return { get: () => { }, post: () => { }, put: () => { }, delete: () => { } };
        }
    );

    // Theme Service - All platforms
    container.registerSingletonByToken(
        'THEME_SERVICE',
        () => {
            // Placeholder for Theme Service
            console.log('Theme service would be registered here');
            return { getTheme: () => { }, setTheme: () => { } };
        }
    );
}

/**
 * Feature Service Registration
 * Register feature-specific services with platform considerations
 * 
 * @function registerFeatureServices
 * @param {Container} container - DI container instance
 * @param {BuildConfig} config - Build configuration
 * @returns {void}
 * @description Registers feature-specific services with platform considerations
 */
function registerFeatureServices(container, config) {
    // Feed Data Service - Uses platform-specific repositories
    container.registerSingletonByToken(
        TYPES.FEED_DATA_SERVICE,
        () => {
            // Placeholder for Feed Data Service
            console.log('Feed data service would be registered here');
            return {
                getFeed: () => { },
                createPost: () => { },
                getPost: () => { },
                updatePost: () => { },
                deletePost: () => { }
            };
        }
    );

    // Chat Data Service - Real-time features only on supported platforms
    if (config.enableRealtimeFeatures) {
        container.registerSingletonByToken(
            TYPES.CHAT_DATA_SERVICE,
            () => {
                // Placeholder for Chat Data Service
                console.log('Chat data service would be registered here');
                return {
                    getMessages: () => { },
                    sendMessage: () => { },
                    getChatRooms: () => { },
                    createChatRoom: () => { }
                };
            }
        );
    }

    // Notification Service - Platform-specific implementations
    if (config.enablePushNotifications) {
        container.registerSingletonByToken(
            TYPES.NOTIFICATION_DATA_SERVICE,
            () => {
                // Placeholder for Notification Service
                console.log('Notification service would be registered here');
                return {
                    getNotifications: () => { },
                    markAsRead: () => { },
                    sendNotification: () => { }
                };
            }
        );
    }
}

/**
 * Create Platform-Specific DI Container
 * 
 * This is the main factory function that creates a container with
 * platform-specific services registered according to the build configuration.
 * 
 * @function createPlatformContainer
 * @param {BuildConfig} [config=PLATFORM_CONFIG] - Platform-specific build configuration
 * @returns {Container} Configured DI container with platform-appropriate services
 * @description Creates a DI container with platform-specific services
 */
export function createPlatformContainer(config = PLATFORM_CONFIG) {
    const container = new Container();

    // Register core services (common to all platforms)
    registerCoreServices(container, config);

    // Register platform-specific services
    registerPlatformServices(container, config);

    // Register feature services
    registerFeatureServices(container, config);

    // Log container creation in development
    if (config.enableDevTools && config.logLevel !== 'none') {
        console.log(`🚀 Platform DI Container created for: ${config.platform}`);
        console.log(`📦 Bundle optimization: ${config.bundleOptimization}`);
        console.log(`🔗 WebSocket: ${config.enableWebSocket ? 'enabled' : 'disabled'}`);
        console.log(`💾 Cache strategy: ${config.cacheStrategy}`);
    }

    return container;
}

/**
 * Create Development Container
 * Enhanced container with development-specific features
 * 
 * @function createDevelopmentContainer
 * @param {Platform} [platform] - Target platform
 * @returns {Container} Development container with enhanced features
 * @description Creates a container optimized for development
 */
export function createDevelopmentContainer(platform) {
    const config = { ...PLATFORM_CONFIG, enableDevTools: true, logLevel: 'debug' };
    if (platform) {
        config.platform = platform;
    }

    return createPlatformContainer(config);
}

/**
 * Create Production Container
 * Optimized container for production builds
 * 
 * @function createProductionContainer
 * @param {Platform} [platform] - Target platform
 * @returns {Container} Production container with optimizations
 * @description Creates a container optimized for production
 */
export function createProductionContainer(platform) {
    const config = { ...PLATFORM_CONFIG, enableDevTools: false, logLevel: 'error' };
    if (platform) {
        config.platform = platform;
    }

    return createPlatformContainer(config);
}

/**
 * Create Test Container
 * Container for testing with mock services
 * 
 * @function createTestContainer
 * @param {Record<string, any>} [mocks] - Mock services to register
 * @param {Platform} [platform='web'] - Target platform for testing
 * @returns {Container} Test container with mock services
 * @description Creates a container for testing with optional mock services
 */
export function createTestContainer(mocks, platform = 'web') {
    const config = { ...PLATFORM_CONFIG, platform, enableDevTools: true, logLevel: 'debug' };
    const container = createPlatformContainer(config);

    // Register mock services if provided
    if (mocks) {
        Object.entries(mocks).forEach(([token, mockService]) => {
            container.registerInstanceByToken(token, mockService);
        });
    }

    return container;
}

/**
 * Get Container Statistics
 * Returns container information for debugging and monitoring
 * 
 * @function getContainerStats
 * @param {Container} container - DI container instance
 * @returns {Object} Container statistics
 * @description Returns container statistics for debugging and monitoring
 */
export function getContainerStats(container) {
    return container.getStats();
}
