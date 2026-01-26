/**
 * Core System Factory Functions
 * 
 * Factory functions for creating core system services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import type {
    ICoreServices,
    ICacheService,
    ICacheServiceManager,
    IWebSocketService,
    IAuthService,
    IThemeService,
    ILoggerService,
    INetworkService,
    IServiceContainer,
    CoreConfig,
    CacheConfig,
    WebSocketConfig,
    ThemeConfig,
    IServiceConfig
} from './types';

import { createCacheServiceManager } from './cache';
import { createDefaultAuthService } from './auth';
import { createTheme } from './theme';
import { createLogger } from './services';
import { createApiClient } from './network';
import { Container } from './di';

/**
 * Creates a complete core services instance
 * 
 * @param config - Optional core configuration
 * @returns Configured core services
 */
export function createCoreServices(config?: CoreConfig): ICoreServices {
    const container = createServiceContainer();

    // Create individual services
    const cache = createCacheServiceManager(config?.cache);
    const auth = createDefaultAuthService(config?.auth);
    const theme = createTheme(config?.theme);
    const services = createLogger(config?.services);
    const network = createApiClient(config?.network);

    // WebSocket service would be created here if available
    const websocket = {} as IWebSocketService;

    return {
        cache,
        websocket,
        auth,
        theme,
        services,
        network,
        container
    };
}

/**
 * Creates a cache service with optional configuration
 * 
 * @param config - Cache configuration
 * @returns Cache service instance
 */
export function createCacheService(config?: CacheConfig): ICacheServiceManager {
    return createCacheServiceManager(config);
}

/**
 * Creates a WebSocket service with optional configuration
 * 
 * @param config - WebSocket configuration
 * @returns WebSocket service instance
 */
export function createWebSocketService(config?: WebSocketConfig): IWebSocketService {
    // Mock implementation - would use actual WebSocket service
    return {
        connect: async () => { },
        disconnect: async () => { },
        send: async (message) => { },
        subscribe: (event, handler) => () => { },
        isConnected: () => false,
        getState: () => 'disconnected' as any
    };
}

/**
 * Creates an authentication service with optional configuration
 * 
 * @param config - Authentication configuration
 * @returns Authentication service instance
 */
export function createAuthService(config?: any): IAuthService {
    return createDefaultAuthService(config);
}

/**
 * Creates a theme service with optional configuration
 * 
 * @param config - Theme configuration
 * @returns Theme service instance
 */
export function createThemeService(config?: ThemeConfig): IThemeService {
    const theme = createTheme(config);

    return {
        getTheme: () => theme,
        setTheme: (newTheme) => { },
        createTheme: (themeConfig) => createTheme(themeConfig),
        getTokens: () => theme.tokens || {},
        switchTheme: (name) => { }
    };
}

/**
 * Creates a network service with optional configuration
 * 
 * @param config - Network configuration
 * @returns Network service instance
 */
export function createNetworkService(config?: any): INetworkService {
    return createApiClient(config);
}

/**
 * Creates a service container for dependency injection
 * 
 * @returns Service container instance
 */
export function createServiceContainer(): IServiceContainer {
    return new Container();
}

/**
 * Creates a logger service with optional configuration
 * 
 * @param config - Service configuration
 * @returns Logger service instance
 */
export function createLoggerService(config?: IServiceConfig): ILoggerService {
    return createLogger(config);
}

/**
 * Creates a mock core services instance for testing
 * 
 * @param config - Optional configuration
 * @returns Mock core services
 */
export function createMockCoreServices(config?: CoreConfig): ICoreServices {
    return {
        cache: createMockCacheService(),
        websocket: createMockWebSocketService(),
        auth: createMockAuthService(),
        theme: createMockThemeService(),
        services: createMockLoggerService(),
        network: createMockNetworkService(),
        container: createMockServiceContainer()
    };
}

// Mock implementations for testing
function createMockCacheService(): ICacheServiceManager {
    return {
        get: async () => null,
        set: async () => { },
        delete: async () => { },
        clear: async () => { },
        has: async () => false,
        getStats: () => ({ size: 0, hits: 0, misses: 0, hitRate: 0, memoryUsage: 0 }),
        createCache: () => createMockCacheService(),
        getCache: () => null,
        removeCache: () => { },
        clearAll: () => { },
        getAllStats: () => ({})
    };
}

function createMockWebSocketService(): IWebSocketService {
    return {
        connect: async () => { },
        disconnect: async () => { },
        send: async () => { },
        subscribe: () => () => { },
        isConnected: () => false,
        getState: () => 'disconnected' as any
    };
}

function createMockAuthService(): IAuthService {
    return {
        authenticate: async () => ({ success: false }),
        register: async () => ({ success: false }),
        logout: async () => ({ success: false }),
        refreshToken: async () => ({ success: false }),
        validateToken: async () => ({ success: false }),
        getCurrentUser: async () => ({ success: false })
    };
}

function createMockThemeService(): IThemeService {
    return {
        getTheme: () => ({}) as EnhancedTheme,
        setTheme: () => { },
        createTheme: () => ({}) as EnhancedTheme,
        getTokens: () => ({} as ThemeTokens),
        switchTheme: () => { }
    };
}

function createMockLoggerService(): ILoggerService {
    return {
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: () => { },
        setLevel: () => { },
        getLevel: () => LogLevel.INFO
    };
}

function createMockNetworkService(): INetworkService {
    return {
        get: async () => ({ success: false }),
        post: async () => ({ success: false }),
        put: async () => ({ success: false }),
        delete: async () => ({ success: false }),
        setAuth: () => { },
        clearAuth: () => { }
    };
}

function createMockServiceContainer(): IServiceContainer {
    return {
        register: () => { },
        get: () => null,
        has: () => false,
        clear: () => { }
    };
}

// Import LogLevel enum
enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}
