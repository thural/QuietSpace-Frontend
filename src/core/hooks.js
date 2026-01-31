/**
 * Core System Hooks
 * 
 * React hooks for accessing core system services following Black Box pattern.
 * Provides clean access to all core services with proper error handling.
 */

import React, { useContext, useCallback, useMemo } from 'react';

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').ICoreServices} ICoreServices
 * @typedef {import('./types.js').ICacheService} ICacheService
 * @typedef {import('./types.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('./types.js').IWebSocketService} IWebSocketService
 * @typedef {import('./types.js').IAuthService} IAuthService
 * @typedef {import('./types.js').IThemeService} IThemeService
 * @typedef {import('./types.js').ILoggerService} ILoggerService
 * @typedef {import('./types.js').INetworkService} INetworkService
 * @typedef {import('./config.js').CoreConfig} CoreConfig
 */

// Mock context for now - would be implemented with proper context providers
const CoreServicesContext = React.createContext(null);

/**
 * Hook for accessing all core services
 * 
 * @function useCoreServices
 * @returns {ICoreServices} Core services instance
 * @description Hook for accessing all core services from React context
 */
export function useCoreServices() {
    const context = useContext(CoreServicesContext);
    
    if (!context) {
        throw new Error('useCoreServices must be used within a CoreServicesProvider');
    }
    
    return context;
}

/**
 * Hook for accessing cache service
 * 
 * @function useCacheService
 * @returns {ICacheServiceManager} Cache service instance
 * @description Hook for accessing cache service from core services
 */
export function useCacheService() {
    const coreServices = useCoreServices();
    return coreServices.cache;
}

/**
 * Hook for accessing authentication service
 * 
 * @function useAuthService
 * @returns {IAuthService} Authentication service instance
 * @description Hook for accessing authentication service from core services
 */
export function useAuthService() {
    const coreServices = useCoreServices();
    return coreServices.auth;
}

/**
 * Hook for accessing theme service
 * 
 * @function useThemeService
 * @returns {IThemeService} Theme service instance
 * @description Hook for accessing theme service from core services
 */
export function useThemeService() {
    const coreServices = useCoreServices();
    return coreServices.theme;
}

/**
 * Hook for accessing logger service
 * 
 * @function useLoggerService
 * @returns {ILoggerService} Logger service instance
 * @description Hook for accessing logger service from core services
 */
export function useLoggerService() {
    const coreServices = useCoreServices();
    return coreServices.services;
}

/**
 * Hook for accessing network service
 * 
 * @function useNetworkService
 * @returns {INetworkService} Network service instance
 * @description Hook for accessing network service from core services
 */
export function useNetworkService() {
    const coreServices = useCoreServices();
    return coreServices.network;
}

/**
 * Hook for accessing WebSocket service
 * 
 * @function useWebSocketService
 * @returns {IWebSocketService} WebSocket service instance
 * @description Hook for accessing WebSocket service from core services
 */
export function useWebSocketService() {
    const coreServices = useCoreServices();
    return coreServices.websocket;
}

/**
 * Hook for accessing service container
 * 
 * @function useServiceContainer
 * @returns {IServiceContainer} Service container instance
 * @description Hook for accessing service container from core services
 */
export function useServiceContainer() {
    const coreServices = useCoreServices();
    return coreServices.container;
}

/**
 * Hook for checking if core services are ready
 * 
 * @function useCoreServicesReady
 * @returns {boolean} Whether core services are ready
 * @description Hook for checking if core services are initialized and ready
 */
export function useCoreServicesReady() {
    const coreServices = useCoreServices();
    
    return useMemo(() => {
        // Check if all services are properly initialized
        return coreServices && 
               coreServices.cache && 
               coreServices.auth && 
               coreServices.theme && 
               coreServices.services && 
               coreServices.network;
    }, [coreServices]);
}

/**
 * Hook for getting core services status
 * 
 * @function useCoreServicesStatus
 * @returns {Object} Core services status object
 * @description Hook for getting status of all core services
 */
export function useCoreServicesStatus() {
    const coreServices = useCoreServices();
    
    return useMemo(() => {
        return {
            cache: !!coreServices.cache,
            auth: !!coreServices.auth,
            theme: !!coreServices.theme,
            services: !!coreServices.services,
            network: !!coreServices.network,
            websocket: !!coreServices.websocket,
            container: !!coreServices.container,
            ready: useCoreServicesReady()
        };
    }, [coreServices]);
}

/**
 * Hook for creating a memoized service accessor
 * 
 * @function createServiceHook
 * @param {string} serviceName - Name of the service
 * @returns {Function} Hook function for accessing the service
 * @description Creates a memoized hook for accessing a specific service
 */
export function createServiceHook(serviceName) {
    return function useService() {
        const coreServices = useCoreServices();
        const service = coreServices[serviceName];
        
        if (!service) {
            throw new Error(`Service '${serviceName}' is not available in core services`);
        }
        
        return service;
    };
}

/**
 * Hook for accessing multiple services
 * 
 * @function useServices
 * @param {string[]} serviceNames - Array of service names to access
 * @returns {Object} Object containing requested services
 * @description Hook for accessing multiple core services at once
 */
export function useServices(serviceNames) {
    const coreServices = useCoreServices();
    
    return useMemo(() => {
        const services = {};
        
        for (const serviceName of serviceNames) {
            const service = coreServices[serviceName];
            if (service) {
                services[serviceName] = service;
            }
        }
        
        return services;
    }, [coreServices, serviceNames]);
}

/**
 * Hook for service with error handling
 * 
 * @function useServiceWithErrorHandling
 * @param {string} serviceName - Name of the service
 * @param {Function} errorHandler - Error handler function
 * @returns {any} Service instance or error
 * @description Hook for accessing a service with custom error handling
 */
export function useServiceWithErrorHandling(serviceName, errorHandler) {
    try {
        const coreServices = useCoreServices();
        const service = coreServices[serviceName];
        
        if (!service) {
            throw new Error(`Service '${serviceName}' is not available in core services`);
        }
        
        return service;
    } catch (error) {
        if (errorHandler) {
            return errorHandler(error);
        }
        throw error;
    }
}

/**
 * Hook for checking service availability
 * 
 * @function useServiceAvailability
 * @param {string} serviceName - Name of the service to check
 * @returns {boolean} Whether service is available
 * @description Hook for checking if a specific service is available
 */
export function useServiceAvailability(serviceName) {
    const coreServices = useCoreServices();
    
    return useMemo(() => {
        return !!coreServices[serviceName];
    }, [coreServices, serviceName]);
}

/**
 * Hook for getting service health status
 * 
 * @function useServiceHealth
 * @param {string} serviceName - Name of the service to check
 * @returns {Object} Health status object
 * @description Hook for getting health status of a specific service
 */
export function useServiceHealth(serviceName) {
    const service = useServiceWithErrorHandling(serviceName);
    
    return useMemo(() => {
        // Basic health check - can be extended with actual health checks
        return {
            available: !!service,
            healthy: !!service,
            lastChecked: Date.now(),
            serviceName
        };
    }, [service, serviceName]);
}

// Export context provider for use in app setup
export { CoreServicesContext };
