/**
 * Core System Utilities
 * 
 * Utility functions for core system operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

import type {
    CoreConfig,
    CoreSystemStatus,
    CoreSystemEvent
} from './types';

import {
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
            if (networkConfig.retryAttempts < networkRules.retryAttempts.min || networkConfig.retryAttempts > networkRules.retryAttempts.max) {
                errors.push(`Network retryAttempts must be between ${networkRules.retryAttempts.min} and ${networkRules.retryAttempts.max}`);
            }
        }

        if (networkConfig.retryDelay !== undefined) {
            if (networkConfig.retryDelay < networkRules.retryDelay.min || networkConfig.retryDelay > networkRules.retryDelay.max) {
                errors.push(`Network retryDelay must be between ${networkRules.retryDelay.min} and ${networkRules.retryDelay.max}ms`);
            }
        }
    }

    return errors;
}

/**
 * Checks the health of the core system
 * 
 * @param status - Core system status
 * @returns Health status string
 */
export function checkCoreSystemHealth(status: CoreSystemStatus): string {
    if (!status.initialized) {
        return 'unhealthy';
    }

    const serviceCount = Object.keys(status.services).length;
    const healthyServices = Object.values(status.services).filter(Boolean).length;
    const healthRatio = serviceCount > 0 ? healthyServices / serviceCount : 0;

    // Check for critical errors first (case insensitive)
    if (status.errors.some(error => error.toLowerCase().includes('critical') || error.toLowerCase().includes('fatal'))) {
        return 'unhealthy';
    }

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
 * @returns System metrics object
 */
export function getCoreSystemMetrics(status: CoreSystemStatus) {
    const serviceCount = Object.keys(status.services).length;
    const healthyServices = Object.values(status.services).filter(Boolean).length;
    const unhealthyServices = serviceCount - healthyServices;
    const errorCount = status.errors.length;
    const healthRatio = serviceCount > 0 ? healthyServices / serviceCount : 0;
    const uptime = status.lastUpdated ? Date.now() - status.lastUpdated.getTime() : 0;

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
            url: 'ws://localhost:8080',
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            timeout: 10000
        },
        theme: {
            name: 'default'
        },
        network: {
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000
        },
        services: {
            level: 'info' as any,
            enableConsole: true,
            enableFile: false,
            enableRemote: false
        }
    };

    // Deep merge for nested objects to preserve defaults
    const mergedConfig = { ...defaultConfig };

    if (overrides) {
        if (overrides.cache) {
            mergedConfig.cache = { ...defaultConfig.cache, ...overrides.cache } as any;
        }
        if (overrides.websocket) {
            mergedConfig.websocket = { ...defaultConfig.websocket, ...overrides.websocket };
        }
        if (overrides.theme) {
            mergedConfig.theme = { ...defaultConfig.theme, ...overrides.theme };
        }
        if (overrides.network) {
            mergedConfig.network = { ...defaultConfig.network, ...overrides.network };
        }
        if (overrides.services) {
            mergedConfig.services = { ...defaultConfig.services, ...overrides.services };
        }
    }

    return mergedConfig;
}
