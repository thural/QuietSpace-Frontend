/**
 * Core Constants Tests
 * 
 * Tests for core system constants, enums, and default values.
 */

import {
    CORE_CONSTANTS,
    CORE_STATUS,
    CORE_EVENTS,
    SERVICE_PRIORITY,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_SERVICE_NAMES,
    DEFAULT_CORE_CONFIG,
    CORE_VALIDATION_RULES,
    CORE_PERFORMANCE_METRICS,
    CORE_ENVIRONMENT_VARIABLES,
    CORE_FEATURE_FLAGS,
    HEALTH_CHECK_STATUS
} from '../../../src/core/constants';

describe('Core Constants', () => {
    describe('CORE_CONSTANTS', () => {
        it('should have all required core constants', () => {
            expect(CORE_CONSTANTS).toBeDefined();
            expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
            expect(CORE_CONSTANTS.MAX_RETRIES).toBe(3);
            expect(CORE_CONSTANTS.RETRY_DELAY).toBe(1000);
        });

        it('should have cache-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_CACHE_SIZE).toBe(1000);
            expect(CORE_CONSTANTS.DEFAULT_CACHE_TTL).toBe(3600000);
            expect(CORE_CONSTANTS.DEFAULT_CACHE_STRATEGY).toBe('lru');
        });

        it('should have websocket-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL).toBe(3000);
            expect(CORE_CONSTANTS.DEFAULT_MAX_RECONNECT_ATTEMPTS).toBe(5);
            expect(CORE_CONSTANTS.DEFAULT_WEBSOCKET_TIMEOUT).toBe(10000);
        });

        it('should have authentication-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL).toBe(300000);
            expect(CORE_CONSTANTS.DEFAULT_SESSION_TIMEOUT).toBe(3600000);
            expect(CORE_CONSTANTS.DEFAULT_MAX_LOGIN_ATTEMPTS).toBe(5);
        });

        it('should have theme-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_THEME_NAME).toBe('default');
            expect(CORE_CONSTANTS.DEFAULT_THEME_VARIANT).toBe('light');
        });

        it('should have network-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_API_TIMEOUT).toBe(30000);
            expect(CORE_CONSTANTS.DEFAULT_RETRY_ATTEMPTS).toBe(3);
            expect(CORE_CONSTANTS.DEFAULT_RETRY_DELAY).toBe(1000);
        });

        it('should have logging-related constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_LOG_LEVEL).toBe('info');
            expect(CORE_CONSTANTS.DEFAULT_LOG_BUFFER_SIZE).toBe(1000);
            expect(CORE_CONSTANTS.DEFAULT_LOG_FLUSH_INTERVAL).toBe(5000);
        });

        it('should have service container constants', () => {
            expect(CORE_CONSTANTS.DEFAULT_SINGLETON_LIFETIME).toBe(0);
            expect(CORE_CONSTANTS.DEFAULT_FACTORY_CACHE_SIZE).toBe(100);
        });

        it('should have immutable constants', () => {
            // Test that constants are readonly
            expect(() => {
                (CORE_CONSTANTS as any).INITIALIZATION_TIMEOUT = 10000;
            }).toThrow();

            expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
        });
    });

    describe('CORE_STATUS', () => {
        it('should have all required status values', () => {
            expect(CORE_STATUS.UNINITIALIZED).toBe('uninitialized');
            expect(CORE_STATUS.INITIALIZING).toBe('initializing');
            expect(CORE_STATUS.INITIALIZED).toBe('initialized');
            expect(CORE_STATUS.ERROR).toBe('error');
            expect(CORE_STATUS.SHUTTING_DOWN).toBe('shutting_down');
            expect(CORE_STATUS.SHUTDOWN).toBe('shutdown');
        });

        it('should have correct number of status values', () => {
            const statusValues = Object.values(CORE_STATUS);
            expect(statusValues).toHaveLength(6);
        });

        it('should have unique status values', () => {
            const statusValues = Object.values(CORE_STATUS);
            const uniqueValues = [...new Set(statusValues)];
            expect(uniqueValues).toHaveLength(statusValues.length);
        });
    });

    describe('CORE_EVENTS', () => {
        it('should have system-level events', () => {
            expect(CORE_EVENTS.SYSTEM_INITIALIZED).toBe('system:initialized');
            expect(CORE_EVENTS.SYSTEM_ERROR).toBe('system:error');
            expect(CORE_EVENTS.SYSTEM_SHUTDOWN).toBe('system:shutdown');
        });

        it('should have service-level events', () => {
            expect(CORE_EVENTS.SERVICE_CREATED).toBe('service:created');
            expect(CORE_EVENTS.SERVICE_DESTROYED).toBe('service:destroyed');
            expect(CORE_EVENTS.SERVICE_ERROR).toBe('service:error');
        });

        it('should have module-specific events', () => {
            expect(CORE_EVENTS.CACHE_CLEARED).toBe('cache:cleared');
            expect(CORE_EVENTS.WEBSOCKET_CONNECTED).toBe('websocket:connected');
            expect(CORE_EVENTS.WEBSOCKET_DISCONNECTED).toBe('websocket:disconnected');
            expect(CORE_EVENTS.AUTH_LOGIN).toBe('auth:login');
            expect(CORE_EVENTS.AUTH_LOGOUT).toBe('auth:logout');
            expect(CORE_EVENTS.THEME_CHANGED).toBe('theme:changed');
            expect(CORE_EVENTS.NETWORK_REQUEST).toBe('network:request');
            expect(CORE_EVENTS.NETWORK_RESPONSE).toBe('network:response');
            expect(CORE_EVENTS.NETWORK_ERROR).toBe('network:error');
        });

        it('should have consistent event naming pattern', () => {
            const events = Object.values(CORE_EVENTS);
            events.forEach(event => {
                expect(event).toMatch(/^[a-z]+:[a-z_]+$/);
            });
        });
    });

    describe('SERVICE_PRIORITY', () => {
        it('should have correct priority values', () => {
            expect(SERVICE_PRIORITY.CRITICAL).toBe(0);
            expect(SERVICE_PRIORITY.HIGH).toBe(1);
            expect(SERVICE_PRIORITY.NORMAL).toBe(2);
            expect(SERVICE_PRIORITY.LOW).toBe(3);
            expect(SERVICE_PRIORITY.BACKGROUND).toBe(4);
        });

        it('should have correct priority ordering', () => {
            expect(SERVICE_PRIORITY.CRITICAL).toBeLessThan(SERVICE_PRIORITY.HIGH);
            expect(SERVICE_PRIORITY.HIGH).toBeLessThan(SERVICE_PRIORITY.NORMAL);
            expect(SERVICE_PRIORITY.NORMAL).toBeLessThan(SERVICE_PRIORITY.LOW);
            expect(SERVICE_PRIORITY.LOW).toBeLessThan(SERVICE_PRIORITY.BACKGROUND);
        });
    });

    describe('CORE_ERROR_CODES', () => {
        it('should have all required error codes', () => {
            expect(CORE_ERROR_CODES.INITIALIZATION_FAILED).toBe('CORE_001');
            expect(CORE_ERROR_CODES.SERVICE_NOT_FOUND).toBe('CORE_002');
            expect(CORE_ERROR_CODES.DEPENDENCY_MISSING).toBe('CORE_003');
            expect(CORE_ERROR_CODES.CONFIGURATION_INVALID).toBe('CORE_004');
            expect(CORE_ERROR_CODES.TIMEOUT).toBe('CORE_005');
            expect(CORE_ERROR_CODES.PERMISSION_DENIED).toBe('CORE_006');
            expect(CORE_ERROR_CODES.AUTHENTICATION_FAILED).toBe('CORE_007');
            expect(CORE_ERROR_CODES.NETWORK_ERROR).toBe('CORE_008');
            expect(CORE_ERROR_CODES.CACHE_ERROR).toBe('CORE_009');
            expect(CORE_ERROR_CODES.WEBSOCKET_ERROR).toBe('CORE_010');
            expect(CORE_ERROR_CODES.THEME_ERROR).toBe('CORE_011');
            expect(CORE_ERROR_CODES.LOGGING_ERROR).toBe('CORE_012');
            expect(CORE_ERROR_CODES.CONTAINER_ERROR).toBe('CORE_013');
        });

        it('should have consistent error code format', () => {
            const errorCodes = Object.values(CORE_ERROR_CODES);
            errorCodes.forEach(code => {
                expect(code).toMatch(/^CORE_\d{3}$/);
            });
        });
    });

    describe('CORE_ERROR_MESSAGES', () => {
        it('should have corresponding messages for all error codes', () => {
            Object.values(CORE_ERROR_CODES).forEach(code => {
                expect(CORE_ERROR_MESSAGES[code]).toBeDefined();
                expect(typeof CORE_ERROR_MESSAGES[code]).toBe('string');
                expect(CORE_ERROR_MESSAGES[code].length).toBeGreaterThan(0);
            });
        });

        it('should have meaningful error messages', () => {
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED]).toBe('Core system initialization failed');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.SERVICE_NOT_FOUND]).toBe('Service not found');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.DEPENDENCY_MISSING]).toBe('Required dependency is missing');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.CONFIGURATION_INVALID]).toBe('Configuration is invalid');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.TIMEOUT]).toBe('Operation timed out');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.PERMISSION_DENIED]).toBe('Permission denied');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.AUTHENTICATION_FAILED]).toBe('Authentication failed');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.NETWORK_ERROR]).toBe('Network error occurred');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.CACHE_ERROR]).toBe('Cache error occurred');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.WEBSOCKET_ERROR]).toBe('WebSocket error occurred');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.THEME_ERROR]).toBe('Theme error occurred');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.LOGGING_ERROR]).toBe('Logging error occurred');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.CONTAINER_ERROR]).toBe('Container error occurred');
        });
    });

    describe('CORE_SERVICE_NAMES', () => {
        it('should have all required service names', () => {
            expect(CORE_SERVICE_NAMES.CACHE).toBe('cache');
            expect(CORE_SERVICE_NAMES.WEBSOCKET).toBe('websocket');
            expect(CORE_SERVICE_NAMES.AUTH).toBe('auth');
            expect(CORE_SERVICE_NAMES.THEME).toBe('theme');
            expect(CORE_SERVICE_NAMES.SERVICES).toBe('services');
            expect(CORE_SERVICE_NAMES.NETWORK).toBe('network');
            expect(CORE_SERVICE_NAMES.CONTAINER).toBe('container');
        });

        it('should have lowercase service names', () => {
            Object.values(CORE_SERVICE_NAMES).forEach(name => {
                expect(name).toBe(name.toLowerCase());
            });
        });
    });

    describe('DEFAULT_CORE_CONFIG', () => {
        it('should have valid default configuration', () => {
            expect(DEFAULT_CORE_CONFIG).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.cache).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.websocket).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.auth).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.theme).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.network).toBeDefined();
            expect(DEFAULT_CORE_CONFIG.services).toBeDefined();
        });

        it('should use core constants in default config', () => {
            expect(DEFAULT_CORE_CONFIG.cache.maxSize).toBe(CORE_CONSTANTS.DEFAULT_CACHE_SIZE);
            expect(DEFAULT_CORE_CONFIG.cache.defaultTtl).toBe(CORE_CONSTANTS.DEFAULT_CACHE_TTL);
            expect(DEFAULT_CORE_CONFIG.cache.strategy).toBe(CORE_CONSTANTS.DEFAULT_CACHE_STRATEGY);
            
            expect(DEFAULT_CORE_CONFIG.websocket.reconnectInterval).toBe(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL);
            expect(DEFAULT_CORE_CONFIG.websocket.maxReconnectAttempts).toBe(CORE_CONSTANTS.DEFAULT_MAX_RECONNECT_ATTEMPTS);
            expect(DEFAULT_CORE_CONFIG.websocket.timeout).toBe(CORE_CONSTANTS.DEFAULT_WEBSOCKET_TIMEOUT);
            
            expect(DEFAULT_CORE_CONFIG.auth.tokenRefreshInterval).toBe(CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL);
            expect(DEFAULT_CORE_CONFIG.auth.sessionTimeout).toBe(CORE_CONSTANTS.DEFAULT_SESSION_TIMEOUT);
            expect(DEFAULT_CORE_CONFIG.auth.maxLoginAttempts).toBe(CORE_CONSTANTS.DEFAULT_MAX_LOGIN_ATTEMPTS);
            
            expect(DEFAULT_CORE_CONFIG.theme.name).toBe(CORE_CONSTANTS.DEFAULT_THEME_NAME);
            expect(DEFAULT_CORE_CONFIG.theme.variant).toBe(CORE_CONSTANTS.DEFAULT_THEME_VARIANT);
            
            expect(DEFAULT_CORE_CONFIG.network.timeout).toBe(CORE_CONSTANTS.DEFAULT_API_TIMEOUT);
            expect(DEFAULT_CORE_CONFIG.network.retryAttempts).toBe(CORE_CONSTANTS.DEFAULT_RETRY_ATTEMPTS);
            expect(DEFAULT_CORE_CONFIG.network.retryDelay).toBe(CORE_CONSTANTS.DEFAULT_RETRY_DELAY);
            
            expect(DEFAULT_CORE_CONFIG.services.level).toBe(CORE_CONSTANTS.DEFAULT_LOG_LEVEL);
        });
    });

    describe('CORE_VALIDATION_RULES', () => {
        it('should have validation rules for all modules', () => {
            expect(CORE_VALIDATION_RULES.cache).toBeDefined();
            expect(CORE_VALIDATION_RULES.websocket).toBeDefined();
            expect(CORE_VALIDATION_RULES.auth).toBeDefined();
            expect(CORE_VALIDATION_RULES.network).toBeDefined();
        });

        it('should have proper validation structure', () => {
            // Cache validation rules
            expect(CORE_VALIDATION_RULES.cache.maxSize).toEqual({ min: 1, max: 10000 });
            expect(CORE_VALIDATION_RULES.cache.defaultTtl).toEqual({ min: 1000, max: 86400000 });
            expect(Array.isArray(CORE_VALIDATION_RULES.cache.strategy)).toBe(true);
            
            // WebSocket validation rules
            expect(CORE_VALIDATION_RULES.websocket.reconnectInterval).toEqual({ min: 1000, max: 30000 });
            expect(CORE_VALIDATION_RULES.websocket.maxReconnectAttempts).toEqual({ min: 1, max: 10 });
            expect(CORE_VALIDATION_RULES.websocket.timeout).toEqual({ min: 1000, max: 60000 });
            
            // Auth validation rules
            expect(CORE_VALIDATION_RULES.auth.tokenRefreshInterval).toEqual({ min: 60000, max: 3600000 });
            expect(CORE_VALIDATION_RULES.auth.sessionTimeout).toEqual({ min: 300000, max: 86400000 });
            expect(CORE_VALIDATION_RULES.auth.maxLoginAttempts).toEqual({ min: 1, max: 10 });
            
            // Network validation rules
            expect(CORE_VALIDATION_RULES.network.timeout).toEqual({ min: 1000, max: 120000 });
            expect(CORE_VALIDATION_RULES.network.retryAttempts).toEqual({ min: 0, max: 5 });
            expect(CORE_VALIDATION_RULES.network.retryDelay).toEqual({ min: 100, max: 10000 });
        });
    });

    describe('CORE_PERFORMANCE_METRICS', () => {
        it('should have all required performance metrics', () => {
            expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBe(0.8);
            expect(CORE_PERFORMANCE_METRICS.WEBSOCKET_CONNECTION_TIME_TARGET).toBe(5000);
            expect(CORE_PERFORMANCE_METRICS.AUTH_LOGIN_TIME_TARGET).toBe(3000);
            expect(CORE_PERFORMANCE_METRICS.NETWORK_REQUEST_TIME_TARGET).toBe(5000);
            expect(CORE_PERFORMANCE_METRICS.THEME_SWITCH_TIME_TARGET).toBe(1000);
            expect(CORE_PERFORMANCE_METRICS.LOG_BUFFER_SIZE).toBe(1000);
            expect(CORE_PERFORMANCE_METRICS.SERVICE_CREATION_TIME_TARGET).toBe(100);
        });

        it('should have reasonable performance targets', () => {
            expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBeLessThanOrEqual(1);
            expect(CORE_PERFORMANCE_METRICS.WEBSOCKET_CONNECTION_TIME_TARGET).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.AUTH_LOGIN_TIME_TARGET).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.NETWORK_REQUEST_TIME_TARGET).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.THEME_SWITCH_TIME_TARGET).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.LOG_BUFFER_SIZE).toBeGreaterThan(0);
            expect(CORE_PERFORMANCE_METRICS.SERVICE_CREATION_TIME_TARGET).toBeGreaterThan(0);
        });
    });

    describe('CORE_ENVIRONMENT_VARIABLES', () => {
        it('should have all required environment variables', () => {
            expect(CORE_ENVIRONMENT_VARIABLES.NODE_ENV).toBe('NODE_ENV');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_LOG_LEVEL).toBe('CORE_LOG_LEVEL');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_CACHE_SIZE).toBe('CORE_CACHE_SIZE');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_WEBSOCKET_URL).toBe('CORE_WEBSOCKET_URL');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_API_BASE_URL).toBe('CORE_API_BASE_URL');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_AUTH_SECRET).toBe('CORE_AUTH_SECRET');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_THEME_DEFAULT).toBe('CORE_THEME_DEFAULT');
        });

        it('should have consistent environment variable naming', () => {
            Object.values(CORE_ENVIRONMENT_VARIABLES).forEach(envVar => {
                expect(envVar).toMatch(/^[A-Z][A-Z_]*$/);
            });
        });
    });

    describe('CORE_FEATURE_FLAGS', () => {
        it('should have all required feature flags', () => {
            expect(CORE_FEATURE_FLAGS.ENABLE_METRICS).toBe(true);
            expect(CORE_FEATURE_FLAGS.ENABLE_PERFORMANCE_MONITORING).toBe(true);
            expect(CORE_FEATURE_FLAGS.ENABLE_ERROR_REPORTING).toBe(true);
            expect(CORE_FEATURE_FLAGS.ENABLE_DEBUG_MODE).toBe(false);
            expect(CORE_FEATURE_FLAGS.ENABLE_MOCK_SERVICES).toBe(false);
            expect(CORE_FEATURE_FLAGS.ENABLE_HEALTH_CHECKS).toBe(true);
            expect(CORE_FEATURE_FLAGS.ENABLE_AUTO_RECOVERY).toBe(true);
        });

        it('should have boolean values for all feature flags', () => {
            Object.values(CORE_FEATURE_FLAGS).forEach(flag => {
                expect(typeof flag).toBe('boolean');
            });
        });
    });

    describe('HEALTH_CHECK_STATUS', () => {
        it('should have all required health status values', () => {
            expect(HEALTH_CHECK_STATUS.HEALTHY).toBe('healthy');
            expect(HEALTH_CHECK_STATUS.UNHEALTHY).toBe('unhealthy');
            expect(HEALTH_CHECK_STATUS.DEGRADED).toBe('degraded');
            expect(HEALTH_CHECK_STATUS.UNKNOWN).toBe('unknown');
        });

        it('should have correct number of health status values', () => {
            const statusValues = Object.values(HEALTH_CHECK_STATUS);
            expect(statusValues).toHaveLength(4);
        });

        it('should have unique health status values', () => {
            const statusValues = Object.values(HEALTH_CHECK_STATUS);
            const uniqueValues = [...new Set(statusValues)];
            expect(uniqueValues).toHaveLength(statusValues.length);
        });
    });

    describe('Constants Integration', () => {
        it('should maintain consistency across constants', () => {
            // Check that default config uses core constants
            expect(DEFAULT_CORE_CONFIG.cache.maxSize).toBe(CORE_CONSTANTS.DEFAULT_CACHE_SIZE);
            expect(DEFAULT_CORE_CONFIG.websocket.reconnectInterval).toBe(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL);
            expect(DEFAULT_CORE_CONFIG.auth.tokenRefreshInterval).toBe(CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL);
            expect(DEFAULT_CORE_CONFIG.theme.name).toBe(CORE_CONSTANTS.DEFAULT_THEME_NAME);
            expect(DEFAULT_CORE_CONFIG.network.timeout).toBe(CORE_CONSTANTS.DEFAULT_API_TIMEOUT);
            expect(DEFAULT_CORE_CONFIG.services.level).toBe(CORE_CONSTANTS.DEFAULT_LOG_LEVEL);
        });

        it('should have validation rules that match constant ranges', () => {
            expect(CORE_VALIDATION_RULES.cache.maxSize.min).toBeLessThanOrEqual(CORE_CONSTANTS.DEFAULT_CACHE_SIZE);
            expect(CORE_VALIDATION_RULES.cache.maxSize.max).toBeGreaterThanOrEqual(CORE_CONSTANTS.DEFAULT_CACHE_SIZE);
            
            expect(CORE_VALIDATION_RULES.websocket.reconnectInterval.min).toBeLessThanOrEqual(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL);
            expect(CORE_VALIDATION_RULES.websocket.reconnectInterval.max).toBeGreaterThanOrEqual(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL);
            
            expect(CORE_VALIDATION_RULES.auth.tokenRefreshInterval.min).toBeLessThanOrEqual(CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL);
            expect(CORE_VALIDATION_RULES.auth.tokenRefreshInterval.max).toBeGreaterThanOrEqual(CORE_CONSTANTS.DEFAULT_TOKEN_REFRESH_INTERVAL);
        });
    });
});
