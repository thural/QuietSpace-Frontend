/**
 * Core System Hooks
 *
 * React hooks for accessing core system services following Black Box pattern.
 * Provides clean access to all core services with proper error handling.
 */

import React, { useContext, useCallback, useMemo } from 'react';

import type {
    ICoreServices,
    ICacheService,
    ICacheServiceManager,
    IWebSocketService,
    IAuthService,
    IThemeService,
    ILoggerService,
    INetworkService,
    CoreConfig
} from './types';

// Mock context for now - would be implemented with proper context providers
const CoreServicesContext = React.createContext<ICoreServices | null>(null);

/**
 * Hook for accessing all core services
 *
 * @returns Core services instance
 */
export function useCoreServices(): ICoreServices {
    const context = useContext(CoreServicesContext);

    if (!context) {
        throw new Error('useCoreServices must be used within a CoreServicesProvider');
    }

    return context;
}

/**
 * Hook for accessing cache service
 *
 * @returns Cache service instance
 */
export function useCacheService(): ICacheServiceManager {
    const services = useCoreServices();
    return services.cache;
}

/**
 * Hook for accessing WebSocket service
 *
 * @returns WebSocket service instance
 */
export function useWebSocketService(): IWebSocketService {
    const services = useCoreServices();
    return services.websocket;
}

/**
 * Hook for accessing authentication service
 *
 * @returns Authentication service instance
 */
export function useAuthService(): IAuthService {
    const services = useCoreServices();
    return services.auth;
}

/**
 * Hook for accessing theme service
 *
 * @returns Theme service instance
 */
export function useThemeService(): IThemeService {
    const services = useCoreServices();
    return services.theme;
}

/**
 * Hook for accessing logger service
 *
 * @returns Logger service instance
 */
export function useLoggerService(): ILoggerService {
    const services = useCoreServices();
    return services.services;
}

/**
 * Hook for accessing network service
 *
 * @returns Network service instance
 */
export function useNetworkService(): INetworkService {
    const services = useCoreServices();
    return services.network;
}

/**
 * Hook for accessing service container
 *
 * @returns Service container instance
 */
export function useServiceContainer(): IServiceContainer {
    const services = useCoreServices();
    return services.container;
}

/**
 * Hook for creating core services with configuration
 *
 * @param config - Core configuration
 * @returns Configured core services
 */
export function useCreateCoreServices(config?: CoreConfig): ICoreServices {
    return useMemo(() => {
        // This would use the actual factory function
        return createMockCoreServices(config);
    }, [config]);
}

/**
 * Hook for checking if core services are initialized
 *
 * @returns Initialization status
 */
export function useCoreServicesInitialized(): boolean {
    const services = useCoreServices();
    return services !== null;
}

/**
 * Hook for getting core services status
 *
 * @returns Core services status
 */
export function useCoreServicesStatus(): {
    initialized: boolean;
    servicesCount: number;
    errors: string[];
} {
    const services = useCoreServices();

    return useMemo(() => ({
        initialized: services !== null,
        servicesCount: services ? 7 : 0,
        errors: services ? [] : ['Core services not initialized']
    }), [services]);
}

// Mock factory function for now
function createMockCoreServices(config?: CoreConfig): ICoreServices {
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

// Mock implementations
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
        getTheme: () => ({}) as any,
        setTheme: () => { },
        createTheme: () => ({}) as any,
        getTokens: () => ({} as any),
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
        getLevel: () => 'info' as any
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
