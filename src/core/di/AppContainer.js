/**
 * Application DI Container Setup.
 * 
 * Configures and initializes the dependency injection container
 * with all application services.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../di/container/Container.js').Container} Container
 * @typedef {import('../services/LoggerService.js').LoggerService} LoggerService
 * @typedef {import('../services/ThemeService.js').ThemeService} ThemeService
 * @typedef {import('../cache/index.js').ICacheProvider} ICacheProvider
 * @typedef {import('../cache/index.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('../network/rest/apiClient.js').apiClient} apiClient
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

import { Container } from '../di/container/Container.js';
import { createLogger } from '../services/index.js';
import { createTheme } from '../theme/index.js';
import { EnterpriseAuthService } from '../auth/index.js';
import { createCacheProvider, createCacheServiceManager } from '../cache/index.js';
import { TYPES } from './types.js';
import { apiClient } from '../network/rest/apiClient.js';
import { UserService, UserRepository } from '../services/UserService.js';
import { LoggerService as CoreLoggerService } from '../services/LoggerService.js';
import { ThemeService as CoreThemeService } from '../services/ThemeService.js';
import { EnterpriseWebSocketService } from '../websocket/services/EnterpriseWebSocketService.js';

/**
 * Create application DI container
 * 
 * @function createAppContainer
 * @returns {Container} Configured application container
 * @description Creates and configures the main application DI container
 */
export function createAppContainer() {
    console.log('🏗️ Setting up application DI container...');

    const container = new Container();

    // Register core services using factory functions
    const loggerService = createLogger();
    const themeService = createTheme();
    container.registerInstance('LoggerService', loggerService);
    container.registerInstance('ThemeService', themeService);

    // Register cache services using factory functions
    const cacheServiceManager = createCacheServiceManager();
    const cacheProvider = createCacheProvider();
    container.registerInstance('CacheServiceManager', cacheServiceManager);
    container.registerInstance('CacheProvider', cacheProvider);
    container.registerInstanceByToken(TYPES.CACHE_SERVICE, cacheServiceManager);

    // Register API client and repositories
    container.registerInstanceByToken(TYPES.API_CLIENT, apiClient);

    // Register User services using manual registration + factory functions
    container.registerSingletonByToken(
        TYPES.USER_REPOSITORY,
        UserRepository
    );

    container.registerSingletonByToken(
        TYPES.USER_SERVICE,
        UserService
    );

    // Register Logger service using manual registration
    container.registerSingletonByToken(
        TYPES.LOGGER_SERVICE,
        CoreLoggerService
    );

    // Register Theme service using manual registration
    container.registerSingletonByToken(
        TYPES.THEME_SERVICE,
        CoreThemeService
    );

    // Register WebSocket service using manual registration
    container.registerSingletonByToken(
        TYPES.WEBSOCKET_SERVICE,
        EnterpriseWebSocketService
    );

    // Register enterprise auth service
    const enterpriseAuthService = new EnterpriseAuthService(null, null, null, null, null);
    container.registerInstance(EnterpriseAuthService, enterpriseAuthService);

    // Auth adapter is now handled by the auth service itself

    // Example of using typed string tokens for registration
    // This provides type safety - only valid TYPES values are allowed
    container.registerInstanceByToken(TYPES.AUTH_SERVICE, enterpriseAuthService);

    console.log('✅ Core services registered');
    console.log(`📊 Container stats: ${JSON.stringify(container.getStats())}`);

    return container;
}

/**
 * Initialize application with DI
 * 
 * @function initializeApp
 * @returns {Promise<Container>} Initialized application container
 * @description Initializes the application with DI container and services
 */
export async function initializeApp() {
    const container = createAppContainer();

    // Initialize services
    const themeService = container.get('ThemeService');
    if (themeService && typeof themeService.setTheme === 'function') {
        themeService.setTheme('light');
    }

    // Example of using typed string tokens for retrieval
    // This provides type safety - only valid TYPES values are allowed
    const authService = container.getByToken(TYPES.AUTH_SERVICE);
    const apiClientInstance = container.getByToken(TYPES.API_CLIENT);

    // Initialize auth service if available
    if (authService && 'initialize' in authService && typeof authService.initialize === 'function') {
        authService.initialize().catch(console.error);
    }

    // Example: Demonstrate API client usage
    console.log('🔗 API client configured with baseURL:', apiClientInstance.defaults.baseURL);

    // Example: Demonstrate feed feature service usage
    const feedFeatureService = container.getByToken(TYPES.FEED_FEATURE_SERVICE);
    const postFeatureService = container.getByToken(TYPES.POST_FEATURE_SERVICE);
    console.log('📱 Feed feature services initialized and ready');

    // Example: Demonstrate search feature service usage
    const searchFeatureService = container.getByToken(TYPES.SEARCH_FEATURE_SERVICE);
    console.log('🔍 Search feature services initialized and ready');

    console.log('🚀 Application initialized with DI');

    return container;
}
