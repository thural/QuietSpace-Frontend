/**
 * Core System Utilities
 * 
 * Utility functions for core system operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

import type {
    CoreConfig,
    CoreSystemStatus,
    CoreSystemEvent,
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_VALIDATION_RULES
} from './constants';

/**
 * Validates core system configuration
 * 
 * @param config - Configuration to validate
 * @returns Array of validation errors
 */
export function validateCoreConfig(config: any): string[] {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate cache configuration
    if (config.cache) {
        const cacheConfig = config.cache;
        const cacheRules = CORE_VALIDATION_RULES.cache;

        if (cacheConfig.maxSize !== undefined) {
            if (cacheConfig.maxSize < cacheRules.maxSize.min || cacheConfig.maxSize > cacheRules.maxSize.max) {
                errors.push(`Cache maxSize must be between ${cacheRules.maxSize.min} and ${cacheRules.maxSize.max}`);
            }
        }

        if (cacheConfig.defaultTtl !== undefined) {
            if (cacheConfig.defaultTtl < cacheRules.defaultTtl.min || cacheConfig.defaultTtl > cacheRules.defaultTtl.max) {
                errors.push(`Cache defaultTtl must be between ${cacheRules.defaultTtl.min} and ${cacheRules.defaultTtl.max}ms`);
            }
        }

        if (cacheConfig.strategy && !cacheRules.strategy.includes(cacheConfig.strategy)) {
            errors.push(`Cache strategy must be one of: ${cacheRules.strategy.join(', ')}`);
        }
    }
}

// Validate websocket configuration
if (config.websocket) {
    const wsConfig = config.websocket;
    const wsRules = CORE_VALIDATION_RULES.websocket;

    if (wsConfig.reconnectInterval !== undefined) {
        if (wsConfig.reconnectInterval < wsRules.reconnectInterval.min || wsConfig.reconnectInterval > wsRules.reconnectInterval.max) {
            errors.push(`WebSocket reconnectInterval must be between ${wsRules.reconnectInterval.min} and ${wsRules.reconnectInterval.max}ms`);
        }
    }

    if (wsConfig.maxReconnectAttempts !== undefined) {
        if (wsConfig.maxReconnectAttempts < wsRules.maxReconnectAttempts.min || wsConfig.maxReconnectAttempts > wsRules.maxReconnectAttempts.max) {
            errors.push(`WebSocket maxReconnectAttempts must be between ${wsRules.maxReconnectAttempts.min} and ${wsRules.maxReconnectAttempts.max}`);
        }
    }

    if (wsConfig.timeout !== undefined) {
        if (wsConfig.timeout < wsRules.timeout.min || wsConfig.timeout > wsRules.timeout.max) {
            errors.push(`WebSocket timeout must be between ${wsRules.timeout.min} and ${wsRules.timeout.max}ms`);
        }
    }
}

// Validate auth configuration
if (config.auth) {
    const authConfig = config.auth;
    const authRules = CORE_VALIDATION_RULES.auth;

    if (authConfig.tokenRefreshInterval !== undefined) {
        if (authConfig.tokenRefreshInterval < authRules.tokenRefreshInterval.min || authConfig.tokenRefreshInterval > authRules.tokenRefreshInterval.max) {
            errors.push(`Auth tokenRefreshInterval must be between ${authRules.tokenRefreshInterval.min} and ${authRules.tokenRefreshInterval.max}ms`);
        }
    }

    if (authConfig.sessionTimeout !== undefined) {
        if (authConfig.sessionTimeout < authRules.sessionTimeout.min || authConfig.sessionTimeout > authRules.sessionTimeout.max) {
            errors.push(`Auth sessionTimeout must be between ${authRules.sessionTimeout.min} and ${authRules.sessionTimeout.max}ms`);
        }
    }

    if (authConfig.maxLoginAttempts !== undefined) {
        if (authConfig.maxLoginAttempts < authRules.maxLoginAttempts.min || authConfig.maxLoginAttempts > authRules.maxLoginAttempts.max) {
            errors.push(`Auth maxLoginAttempts must be between ${authRules.maxLoginAttempts.min} and ${authRules.maxLoginAttempts.max}`);
        }
    }
}

// Validate network configuration
if (config.network) {
    const networkConfig = config.network;
    const networkRules = CORE_VALIDATION_RULES.network;

    if (networkConfig.timeout !== undefined) {
        if (networkConfig.timeout < networkRules.timeout.min || networkConfig.timeout > networkRules.timeout.max) {
            errors.push(`Network timeout must be between ${networkRules.timeout.min} and ${networkRules.timeout.max}ms`);
        }
    }

    if (networkConfig.retryAttempts !== undefined) {
        if (networkConfig.retryAttempts < networkRules.retryAttempts.min || networkConfig.retryAttempts > networkConfig.retryAttempts.max) {
            errors.push(`Network retryAttempts must be between ${networkConfig.retryAttempts.min} and ${networkConfig.retryAttempts.max}`);
        }
    }

    if (networkConfig.retryDelay !== undefined) {
        if (networkConfig.retryDelay < networkConfig.retryDelay.min || networkConfig.retryDelay > networkConfig.retryDelay.max) {
            errors.push(`Network retryDelay must be between ${networkConfig.retryDelay.min} and ${networkConfig.retryDelay.max}ms`);
        }
    }
}

return errors;
}

/**
 * Initializes the core system with configuration
 * 
 * @param config - Core system configuration
 * @returns Promise resolving to initialization result
 */
export async function initializeCoreSystem(config?: CoreConfig): Promise<CoreSystemStatus> {
    const status: CoreSystemStatus = {
        initialized: false,
        services: {},
        errors: [],
        lastUpdated: new Date()
    };

    try {
        // Validate configuration
        const validationErrors = validateCoreConfig(config);
        if (validationErrors.length > 0) {
            status.errors = validationErrors;
            status.lastUpdated = new Date();
            return status;
        }

        // Initialize services in order of dependency
        const services = ['container', 'cache', 'auth', 'theme', 'services', 'network', 'websocket'];

        for (const serviceName of services) {
            try {
                // Mock initialization - would call actual service initialization
                console.log(`Initializing ${serviceName}...`);
                status.services[serviceName] = true;
            } catch (error) {
                status.errors.push(`Failed to initialize ${serviceName}: ${error}`);
                status.services[serviceName] = false;
            }
        }

        status.initialized = Object.values(status.services).every(Boolean);
        status.lastUpdated = new Date();

        return status;
    } catch (error) {
        status.errors.push(`Core system initialization failed: ${error}`);
        status.lastUpdated = new Date();
        return status;
    }
}

/**
 * Shuts down the core system gracefully
 * 
 * @returns Promise resolving to shutdown result
 */
export async function shutdownCoreSystem(): Promise<CoreSystemStatus> {
    const status: CoreSystemStatus = {
        initialized: false,
        services: {},
        errors: [],
        lastUpdated: new Date()
    };

    try {
        // Shutdown services in reverse order of dependency
        const services = ['websocket', 'network', 'services', 'theme', 'auth', 'cache', 'container'];

        for (const serviceName of services) {
            try {
                // Mock shutdown - would call actual service shutdown
                console.log(`Shutting down ${serviceName}...`);
                status.services[serviceName] = false;
            } catch (error) {
                status.errors.push(`Failed to shutdown ${serviceName}: ${error}`);
                status.services[serviceName] = true; // Still considered running
            }
        }

        status.initialized = false;
        status.lastUpdated = new Date();

        return status;
    } catch (error) {
        status.errors.push(`Core system shutdown failed: ${error}`);
        status.lastUpdated = new Date();
        return status;
    }
}

/**
 * Creates a core system event
 * 
 * @param type - Event type
 * @param payload - Event payload
 * @returns Core system event
 */
export function createCoreSystemEvent(type: string, payload: any): CoreSystemEvent {
    return {
        type,
        payload,
        timestamp: new Date()
    };
}

/**
 * Creates a core system error
 * 
 * @param code - Error code
 * @param message - Error message
 * @param details - Additional error details
 * @returns Core system event with error
 */
export function createCoreSystemError(code: CORE_ERROR_CODES, message?: string, details?: any): CoreSystemEvent {
    const errorMessage = message || CORE_ERROR_MESSAGES[code] || 'Unknown error occurred';

    return createCoreSystemEvent('error', {
        code,
        message: errorMessage,
        details,
        timestamp: new Date()
    });
}

/**
 * Checks if core system is healthy
 * 
 * @param status - Core system status
 * @returns Health status
 */
export function checkCoreSystemHealth(status: CoreSystemStatus): 'healthy' | 'unhealthy' | 'degraded' | 'unknown' {
    if (!status) {
        return 'unknown';
    }

    if (!status.initialized) {
        return 'unhealthy';
    }

    const serviceCount = Object.keys(status.services).length;
    const healthyServiceCount = Object.values(status.services).filter(Boolean).length;
    const healthRatio = healthyServiceCount / serviceCount;

    if (healthRatio === 1) {
        return 'healthy';
    } else if (healthRatio >= 0.5) {
        return 'degraded';
    } else {
        return 'unhealthy';
    }
}

/**
 * Gets core system metrics
 * 
 * @param status - Core system status
 * @returns System metrics
 */
export function getCoreSystemMetrics(status: CoreSystemStatus): {
    serviceCount: number;
    healthyServices: number;
    unhealthyServices: number;
    errorCount: number;
    healthRatio: number;
    uptime: number;
} {
    const serviceCount = Object.keys(status.services).length;
    const healthyServices = Object.values(status.services).filter(Boolean).length;
    const unhealthyServices = serviceCount - healthyServices;
    const errorCount = status.errors.length;
    const healthRatio = serviceCount > 0 ? healthyServices / serviceCount : 0;
    const uptime = status.initialized ? Date.now() - status.lastUpdated.getTime() : 0;

    return {
        serviceCount,
        healthyServices,
        unhealthyServices,
        errorCount,
        healthRatio,
        uptime
    };
}

/**
 * Formats core system status for display
 * 
 * @param status - Core system status
 * @returns Formatted status string
 */
export function formatCoreSystemStatus(status: CoreSystemStatus): string {
    const health = checkCoreSystemHealth(status);
    const metrics = getCoreSystemMetrics(status);

    return `Core System Status: ${status.initialized ? 'Initialized' : 'Not Initialized'}\n` +
        `Health: ${health}\n` +
        `Services: ${metrics.healthyServices}/${metrics.serviceCount} healthy\n` +
        `Errors: ${metrics.errorCount}\n` +
        `Uptime: ${Math.round(metrics.uptime / 1000)}s`;
}

/**
 * Creates a default core configuration
 * 
 * @param overrides - Configuration overrides
 * @returns Default core configuration
 */
export function createDefaultCoreConfig(overrides?: Partial<CoreConfig>): CoreConfig {
    const defaultConfig = {
        cache: {
            maxSize: 1000,
            defaultTtl: 3600000,
            strategy: 'lru' as const,
            enableMetrics: true
        },
        websocket: {
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            timeout: 10000
        },
        auth: {
            tokenRefreshInterval: 300000,
            sessionTimeout: 3600000,
            maxLoginAttempts: 5
        },
        theme: {
            name: 'default',
            variant: 'light'
        },
        network: {
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000
        },
        services: {
            level: 'info' as const,
            enableConsole: true,
            enableFile: false,
            enableRemote: false
        }
    };

    return { ...defaultConfig, ...overrides };
}
