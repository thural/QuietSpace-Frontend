/**
 * Core Shared Tests
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
    HEALTH_CHECK_STATUS,
    CORE_FEATURE_FLAGS,
    ENVIRONMENT_FEATURE_FLAGS,
    isFeatureEnabled,
    getAllFeatureFlags,
    enableFeature,
    disableFeature,
    FeatureFlag,
    Environment
} from '../../../src/core';

describe('Core Shared', () => {
    describe('CORE_CONSTANTS', () => {
        it('should have correct initialization timeout', () => {
            expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
        });

        it('should have correct default cache size', () => {
            expect(CORE_CONSTANTS.DEFAULT_CACHE_SIZE).toBe(1000);
        });

        it('should have correct default theme name', () => {
            expect(CORE_CONSTANTS.DEFAULT_THEME_NAME).toBe('default');
        });
    });

    describe('CORE_STATUS', () => {
        it('should have correct status values', () => {
            expect(CORE_STATUS.UNINITIALIZED).toBe('uninitialized');
            expect(CORE_STATUS.INITIALIZING).toBe('initializing');
            expect(CORE_STATUS.INITIALIZED).toBe('initialized');
            expect(CORE_STATUS.ERROR).toBe('error');
        });
    });

    describe('CORE_EVENTS', () => {
        it('should have correct system events', () => {
            expect(CORE_EVENTS.SYSTEM_INITIALIZED).toBe('system:initialized');
            expect(CORE_EVENTS.SYSTEM_ERROR).toBe('system:error');
            expect(CORE_EVENTS.SYSTEM_SHUTDOWN).toBe('system:shutdown');
        });

        it('should have correct service events', () => {
            expect(CORE_EVENTS.SERVICE_CREATED).toBe('service:created');
            expect(CORE_EVENTS.SERVICE_DESTROYED).toBe('service:destroyed');
            expect(CORE_EVENTS.SERVICE_ERROR).toBe('service:error');
        });
    });

    describe('SERVICE_PRIORITY', () => {
        it('should have correct priority levels', () => {
            expect(SERVICE_PRIORITY.CRITICAL).toBe(0);
            expect(SERVICE_PRIORITY.HIGH).toBe(1);
            expect(SERVICE_PRIORITY.NORMAL).toBe(2);
            expect(SERVICE_PRIORITY.LOW).toBe(3);
            expect(SERVICE_PRIORITY.BACKGROUND).toBe(4);
        });
    });

    describe('CORE_ERROR_CODES', () => {
        it('should have correct error codes', () => {
            expect(CORE_ERROR_CODES.INITIALIZATION_FAILED).toBe('CORE_001');
            expect(CORE_ERROR_CODES.CONFIGURATION_INVALID).toBe('CORE_004');
            expect(CORE_ERROR_CODES.SERVICE_NOT_FOUND).toBe('CORE_002');
        });
    });

    describe('CORE_ERROR_MESSAGES', () => {
        it('should have correct error messages', () => {
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED]).toBe('Core system initialization failed');
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.CONFIGURATION_INVALID]).toBe('Configuration is invalid');
        });
    });

    describe('CORE_SERVICE_NAMES', () => {
        it('should have correct service names', () => {
            expect(CORE_SERVICE_NAMES.CACHE).toBe('cache');
            expect(CORE_SERVICE_NAMES.WEBSOCKET).toBe('websocket');
            expect(CORE_SERVICE_NAMES.AUTH).toBe('auth');
            expect(CORE_SERVICE_NAMES.THEME).toBe('theme');
        });
    });

    describe('DEFAULT_CORE_CONFIG', () => {
        it('should have correct default configuration', () => {
            expect(DEFAULT_CORE_CONFIG.cache?.maxSize).toBe(1000);
            expect(DEFAULT_CORE_CONFIG.theme?.name).toBe('default');
        });
    });

    describe('CORE_VALIDATION_RULES', () => {
        it('should have correct cache validation rules', () => {
            expect(CORE_VALIDATION_RULES.cache.maxSize.min).toBe(1);
            expect(CORE_VALIDATION_RULES.cache.maxSize.max).toBe(10000);
            expect(CORE_VALIDATION_RULES.cache.strategy).toContain('lru');
        });
    });

    describe('CORE_PERFORMANCE_METRICS', () => {
        it('should have correct performance metrics', () => {
            expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBe(0.8);
            expect(CORE_PERFORMANCE_METRICS.WEBSOCKET_CONNECTION_TIME_TARGET).toBe(5000);
        });
    });

    describe('CORE_ENVIRONMENT_VARIABLES', () => {
        it('should have correct environment variables', () => {
            expect(CORE_ENVIRONMENT_VARIABLES.NODE_ENV).toBe('NODE_ENV');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_LOG_LEVEL).toBe('CORE_LOG_LEVEL');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_CACHE_SIZE).toBe('CORE_CACHE_SIZE');
        });
    });

    describe('HEALTH_CHECK_STATUS', () => {
        it('should have correct health status values', () => {
            expect(HEALTH_CHECK_STATUS.HEALTHY).toBe('healthy');
            expect(HEALTH_CHECK_STATUS.UNHEALTHY).toBe('unhealthy');
            expect(HEALTH_CHECK_STATUS.DEGRADED).toBe('degraded');
            expect(HEALTH_CHECK_STATUS.UNKNOWN).toBe('unknown');
        });
    });

    describe('Feature Flags', () => {
        describe('CORE_FEATURE_FLAGS', () => {
            it('should have correct core feature flags', () => {
                expect(CORE_FEATURE_FLAGS.ENABLE_METRICS).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_DEBUG_MODE).toBe(false);
                expect(CORE_FEATURE_FLAGS.ENABLE_MOCK_SERVICES).toBe(false);
            });

            it('should have correct module feature flags', () => {
                expect(CORE_FEATURE_FLAGS.ENABLE_CACHE_METRICS).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_WEBSOCKET_RECONNECT).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_AUTH_REFRESH).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_THEME_ANIMATIONS).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_NETWORK_RETRY).toBe(true);
                expect(CORE_FEATURE_FLAGS.ENABLE_SERVICE_LOGGING).toBe(true);
            });
        });

        describe('ENVIRONMENT_FEATURE_FLAGS', () => {
            it('should have development environment flags', () => {
                expect(ENVIRONMENT_FEATURE_FLAGS.development.ENABLE_DEBUG_MODE).toBe(true);
                expect(ENVIRONMENT_FEATURE_FLAGS.development.ENABLE_MOCK_SERVICES).toBe(true);
                expect(ENVIRONMENT_FEATURE_FLAGS.development.ENABLE_DEVELOPER_TOOLS).toBe(true);
            });

            it('should have production environment flags', () => {
                expect(ENVIRONMENT_FEATURE_FLAGS.production.ENABLE_DEBUG_MODE).toBe(false);
                expect(ENVIRONMENT_FEATURE_FLAGS.production.ENABLE_MOCK_SERVICES).toBe(false);
                expect(ENVIRONMENT_FEATURE_FLAGS.production.ENABLE_DEVELOPER_TOOLS).toBe(false);
            });

            it('should have test environment flags', () => {
                expect(ENVIRONMENT_FEATURE_FLAGS.test.ENABLE_DEBUG_MODE).toBe(true);
                expect(ENVIRONMENT_FEATURE_FLAGS.test.ENABLE_MOCK_SERVICES).toBe(true);
                expect(ENVIRONMENT_FEATURE_FLAGS.test.ENABLE_DEVELOPER_TOOLS).toBe(false);
            });
        });

        describe('Feature Flag Functions', () => {
            it('should check feature enabled status', () => {
                expect(isFeatureEnabled('ENABLE_METRICS', 'production')).toBe(true);
                expect(isFeatureEnabled('ENABLE_DEBUG_MODE', 'production')).toBe(false);
                expect(isFeatureEnabled('ENABLE_DEBUG_MODE', 'development')).toBe(true);
            });

            it('should get all feature flags for environment', () => {
                const prodFlags = getAllFeatureFlags('production');
                expect(prodFlags.ENABLE_METRICS).toBe(true);
                expect(prodFlags.ENABLE_DEBUG_MODE).toBe(false);

                const devFlags = getAllFeatureFlags('development');
                expect(devFlags.ENABLE_METRICS).toBe(true);
                expect(devFlags.ENABLE_DEBUG_MODE).toBe(true);
            });

            it('should enable feature for environment', () => {
                expect(() => enableFeature('ENABLE_DEBUG_MODE', 'development')).not.toThrow();
                expect(isFeatureEnabled('ENABLE_DEBUG_MODE', 'development')).toBe(true);
            });

            it('should disable feature for environment', () => {
                expect(() => disableFeature('ENABLE_METRICS', 'production')).not.toThrow();
                expect(isFeatureEnabled('ENABLE_METRICS', 'production')).toBe(false);
            });
        });
    });

    describe('Type Safety', () => {
        it('should maintain type safety for FeatureFlag', () => {
            const flag: FeatureFlag = 'ENABLE_METRICS';
            expect(typeof flag).toBe('string');
        });

        it('should maintain type safety for Environment', () => {
            const env: Environment = 'production';
            expect(['development', 'production', 'test']).toContain(env);
        });
    });

    describe('Integration', () => {
        it('should integrate constants with feature flags', () => {
            expect(CORE_CONSTANTS.DEFAULT_THEME_NAME).toBe('default');
            expect(CORE_FEATURE_FLAGS.ENABLE_THEME_ANIMATIONS).toBe(true);
        });

        it('should integrate error codes with messages', () => {
            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED]).toBeDefined();
            expect(typeof CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED]).toBe('string');
        });

        it('should integrate validation rules with default config', () => {
            expect(DEFAULT_CORE_CONFIG.cache?.maxSize).toBeGreaterThanOrEqual(CORE_VALIDATION_RULES.cache.maxSize.min);
            expect(DEFAULT_CORE_CONFIG.cache?.maxSize).toBeLessThanOrEqual(CORE_VALIDATION_RULES.cache.maxSize.max);
        });
    });

    describe('Consistency', () => {
        it('should have consistent naming patterns', () => {
            const coreConstants = Object.keys(CORE_CONSTANTS);
            const errorMessages = Object.keys(CORE_ERROR_MESSAGES);
            const serviceNames = Object.values(CORE_SERVICE_NAMES);

            expect(coreConstants.length).toBeGreaterThan(0);
            expect(errorMessages.length).toBeGreaterThan(0);
            expect(serviceNames.length).toBeGreaterThan(0);
        });

        it('should have consistent error handling', () => {
            const errorCodes = Object.values(CORE_ERROR_CODES);
            errorCodes.forEach(code => {
                expect(code).toMatch(/^CORE_\d{3}$/);
            });
        });
    });
});
