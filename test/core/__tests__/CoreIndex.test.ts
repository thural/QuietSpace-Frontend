/**
 * Core Index Tests
 * 
 * Tests for core system index file exports and public API.
 */

import {
    // Types
    ICacheService,
    ICacheServiceManager,
    IWebSocketService,
    IAuthService,
    IThemeService,
    ILoggerService,
    INetworkService,
    IServiceContainer,
    ICoreServices,
    CacheEntry,
    CacheStats,
    CacheConfig,
    WebSocketMessage,
    WebSocketConfig,
    AuthCredentials,
    AuthUser,
    AuthToken,
    AuthSession,
    AuthResult,
    ThemeConfig,
    ThemeTokens,
    EnhancedTheme,
    ApiResponse,
    ApiError,
    IServiceConfig,
    ServiceIdentifier,
    ServiceFactory,
    ServiceDescriptor,
    CoreConfig,
    CoreSystemEvent,
    LogLevel,

    // Enums
    WebSocketState,
    CORE_STATUS,
    CORE_EVENTS,
    SERVICE_PRIORITY,
    CORE_ERROR_CODES,
    HEALTH_CHECK_STATUS,

    // Constants
    CORE_CONSTANTS,
    CORE_ERROR_MESSAGES,
    CORE_SERVICE_NAMES,
    DEFAULT_CORE_CONFIG,
    CORE_VALIDATION_RULES,
    CORE_PERFORMANCE_METRICS,
    CORE_ENVIRONMENT_VARIABLES,
    CORE_FEATURE_FLAGS,

    // Feature Flags
    CORE_FEATURE_FLAGS as featureFlags,
    isFeatureEnabled,
    getAllFeatureFlags,
    enableFeature,
    disableFeature,

    // DI
    container,
    initializeContainer,
    getContainer,
    createMockContainer,
    TYPES,

    // Legacy
    _LegacyExports
} from '../../../src/core';

describe('Core Index', () => {
    describe('Type Exports', () => {
        it('should export all service interfaces', () => {
            // These should be available as types (we can't test typeof on types)
            // Instead, we'll verify they're defined by checking they don't throw errors when used
            expect(() => {
                const test: ICacheService = {} as ICacheService;
                const test2: ICacheServiceManager = {} as ICacheServiceManager;
                const test3: IWebSocketService = {} as IWebSocketService;
                const test4: IAuthService = {} as IAuthService;
                const test5: IThemeService = {} as IThemeService;
                const test6: ILoggerService = {} as ILoggerService;
                const test7: INetworkService = {} as INetworkService;
                const test8: IServiceContainer = {} as IServiceContainer;
                const test9: ICoreServices = {} as ICoreServices;
            }).not.toThrow();
        });

        it('should export all data types', () => {
            // These should be available as types
            expect(() => {
                const test1: CacheEntry = {} as CacheEntry;
                const test2: CacheStats = {} as CacheStats;
                const test3: CacheConfig = {} as CacheConfig;
                const test4: WebSocketMessage = {} as WebSocketMessage;
                const test5: WebSocketConfig = {} as WebSocketConfig;
                const test6: AuthCredentials = {} as AuthCredentials;
                const test7: AuthUser = {} as AuthUser;
                const test8: AuthToken = {} as AuthToken;
                const test9: AuthSession = {} as AuthSession;
                const test10: AuthResult = {} as AuthResult;
                const test11: ThemeConfig = {} as ThemeConfig;
                const test12: ThemeTokens = {} as ThemeTokens;
                const test13: EnhancedTheme = {} as EnhancedTheme;
                const test14: ApiResponse = {} as ApiResponse;
                const test15: ApiError = {} as ApiError;
                const test16: IServiceConfig = {} as IServiceConfig;
                const test17: ServiceIdentifier = 'test';
                const test18: ServiceFactory<string> = () => 'test';
                const test19: ServiceDescriptor = { identifier: 'test', factory: () => 'test' };
                const test20: CoreConfig = {} as CoreConfig;
                const test21: CoreSystemEvent = {} as CoreSystemEvent;
                const test22: LogLevel = LogLevel.INFO;
            }).not.toThrow();
        });

        it('should export all enums', () => {
            // These should be available as values
            expect(WebSocketState).toBeDefined();
            expect(CORE_STATUS).toBeDefined();
            expect(CORE_EVENTS).toBeDefined();
            expect(SERVICE_PRIORITY).toBeDefined();
            expect(CORE_ERROR_CODES).toBeDefined();
            expect(HEALTH_CHECK_STATUS).toBeDefined();

            // Test enum values
            expect(WebSocketState.DISCONNECTED).toBe('disconnected');
            expect(CORE_STATUS.UNINITIALIZED).toBe('uninitialized');
            expect(CORE_EVENTS.SYSTEM_INITIALIZED).toBe('system:initialized');
            expect(SERVICE_PRIORITY.CRITICAL).toBe(0);
            expect(CORE_ERROR_CODES.INITIALIZATION_FAILED).toBe('CORE_001');
            expect(HEALTH_CHECK_STATUS.HEALTHY).toBe('healthy');
        });
    });

    describe('Constant Exports', () => {
        it('should export all core constants', () => {
            expect(CORE_CONSTANTS).toBeDefined();
            expect(CORE_ERROR_MESSAGES).toBeDefined();
            expect(CORE_SERVICE_NAMES).toBeDefined();
            expect(DEFAULT_CORE_CONFIG).toBeDefined();
            expect(CORE_VALIDATION_RULES).toBeDefined();
            expect(CORE_PERFORMANCE_METRICS).toBeDefined();
            expect(CORE_ENVIRONMENT_VARIABLES).toBeDefined();
            expect(CORE_FEATURE_FLAGS).toBeDefined();

            // Test constant values
            expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
            expect(CORE_CONSTANTS.DEFAULT_CACHE_SIZE).toBe(1000);
            expect(CORE_CONSTANTS.DEFAULT_THEME_NAME).toBe('default');

            expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED]).toBe('Core system initialization failed');

            expect(CORE_SERVICE_NAMES.CACHE).toBe('cache');
            expect(CORE_SERVICE_NAMES.AUTH).toBe('auth');
            expect(CORE_SERVICE_NAMES.THEME).toBe('theme');

            expect(DEFAULT_CORE_CONFIG.cache?.maxSize).toBe(1000);
            expect(DEFAULT_CORE_CONFIG.theme?.name).toBe('default');

            expect(CORE_VALIDATION_RULES.cache.maxSize).toEqual({ min: 1, max: 10000 });

            expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBe(0.8);

            expect(CORE_ENVIRONMENT_VARIABLES.NODE_ENV).toBe('NODE_ENV');
            expect(CORE_ENVIRONMENT_VARIABLES.CORE_LOG_LEVEL).toBe('CORE_LOG_LEVEL');

            expect(CORE_FEATURE_FLAGS.ENABLE_METRICS).toBe(true);
            expect(CORE_FEATURE_FLAGS.ENABLE_DEBUG_MODE).toBe(false);
        });
    });

    describe('Feature Flag Exports', () => {
        it('should export feature flag functions and constants', () => {
            expect(typeof isFeatureEnabled).toBe('function');
            expect(typeof getAllFeatureFlags).toBe('function');
            expect(typeof enableFeature).toBe('function');
            expect(typeof disableFeature).toBe('function');

            expect(featureFlags).toBeDefined();
            expect(featureFlags.ENABLE_METRICS).toBe(true);
        });

        it('should work with feature flag functions', () => {
            // Test feature flag checking
            expect(isFeatureEnabled('ENABLE_METRICS')).toBe(true);
            expect(isFeatureEnabled('ENABLE_DEBUG_MODE')).toBe(false);

            // Test getting all flags
            const allFlags = getAllFeatureFlags();
            expect(allFlags).toBeDefined();
            expect(typeof allFlags).toBe('object');

            // Test enabling/disabling flags (these should not throw)
            expect(() => enableFeature('ENABLE_DEBUG_MODE', 'development')).not.toThrow();
            expect(() => disableFeature('ENABLE_METRICS', 'production')).not.toThrow();
        });
    });

    describe('DI Container Exports', () => {
        it('should export DI container functions and types', () => {
            expect(typeof initializeContainer).toBe('function');
            expect(typeof getContainer).toBe('function');
            expect(typeof createMockContainer).toBe('function');

            expect(container).toBeDefined();
            expect(TYPES).toBeDefined();
            expect(typeof TYPES).toBe('object');
        });

        it('should work with DI container functions', () => {
            // These should not throw
            expect(() => initializeContainer()).not.toThrow();
            expect(() => getContainer()).not.toThrow();
            expect(() => createMockContainer()).not.toThrow();
        });
    });

    describe('Legacy Exports', () => {
        it('should export legacy exports with underscore prefix', () => {
            expect(_LegacyExports).toBeDefined();
            expect(typeof _LegacyExports).toBe('object');
        });

        it('should have proper legacy export structure', () => {
            // Legacy exports should be available but marked as deprecated
            expect(_LegacyExports).toBeDefined();
            // The exact structure depends on what's exported as legacy
        });
    });

    describe('Export Completeness', () => {
        it('should export all expected items', () => {
            // Verify that key exports are available
            expect(() => {
                const test: ICacheService = {} as ICacheService;
                const test2: IWebSocketService = {} as IWebSocketService;
                const test3: IAuthService = {} as IAuthService;
                const test4: IThemeService = {} as IThemeService;
                const test5: ILoggerService = {} as ILoggerService;
                const test6: INetworkService = {} as INetworkService;
                const test7: IServiceContainer = {} as IServiceContainer;
                const test8: ICoreServices = {} as ICoreServices;
            }).not.toThrow();

            expect(WebSocketState).toBeDefined();
            expect(CORE_STATUS).toBeDefined();
            expect(CORE_EVENTS).toBeDefined();
            expect(SERVICE_PRIORITY).toBeDefined();
            expect(CORE_ERROR_CODES).toBeDefined();
            expect(HEALTH_CHECK_STATUS).toBeDefined();

            expect(CORE_CONSTANTS).toBeDefined();
            expect(CORE_ERROR_MESSAGES).toBeDefined();
            expect(CORE_SERVICE_NAMES).toBeDefined();
            expect(DEFAULT_CORE_CONFIG).toBeDefined();
            expect(CORE_VALIDATION_RULES).toBeDefined();
            expect(CORE_PERFORMANCE_METRICS).toBeDefined();
            expect(CORE_ENVIRONMENT_VARIABLES).toBeDefined();
            expect(CORE_FEATURE_FLAGS).toBeDefined();

            expect(isFeatureEnabled).toBeDefined();
            expect(getAllFeatureFlags).toBeDefined();
            expect(enableFeature).toBeDefined();
            expect(disableFeature).toBeDefined();

            expect(initializeContainer).toBeDefined();
            expect(getContainer).toBeDefined();
            expect(createMockContainer).toBeDefined();

            expect(container).toBeDefined();
            expect(TYPES).toBeDefined();
            expect(_LegacyExports).toBeDefined();
        });

        it('should not export implementation details', () => {
            // Implementation classes should not be exported directly
            // This ensures Black Box pattern compliance
            const implementationExports = [
                // These should NOT be available (implementation details)
                'CacheProvider',
                'WebSocketProvider',
                'AuthProvider',
                'ThemeProvider',
                'LoggerProvider',
                'NetworkProvider',
                'ServiceContainer'
            ];

            implementationExports.forEach(exportName => {
                expect(() => eval(exportName)).toThrow();
            });
        });
    });

    describe('Type Safety', () => {
        it('should maintain type safety for exported items', () => {
            // Test that exported types work correctly
            const cacheConfig: CacheConfig = {
                maxSize: 1000,
                strategy: 'lru'
            };

            const webSocketState: WebSocketState = WebSocketState.CONNECTED;
            const logLevel: LogLevel = LogLevel.INFO;

            expect(cacheConfig.maxSize).toBe(1000);
            expect(webSocketState).toBe('connected');
            expect(logLevel).toBe('info');
        });

        it('should provide correct types for functions', () => {
            // Test function signatures
            expect(typeof isFeatureEnabled).toBe('function');
            expect(typeof getAllFeatureFlags).toBe('function');
            expect(typeof enableFeature).toBe('function');
            expect(typeof disableFeature).toBe('function');

            // These should not throw TypeScript errors
            const isEnabled: boolean = isFeatureEnabled('ENABLE_METRICS');
            const allFlags: Record<string, boolean> = getAllFeatureFlags();

            expect(typeof isEnabled).toBe('boolean');
            expect(typeof allFlags).toBe('object');
        });
    });

    describe('Black Box Pattern Compliance', () => {
        it('should only export public API', () => {
            // Should export interfaces, types, enums, constants, and factory functions
            // Should not export implementation classes

            const publicExports = [
                // Enums and values
                'WebSocketState', 'CORE_STATUS', 'CORE_EVENTS', 'LogLevel',
                'CORE_CONSTANTS', 'CORE_ERROR_MESSAGES', 'CORE_SERVICE_NAMES',

                // Functions
                'isFeatureEnabled', 'getAllFeatureFlags', 'enableFeature', 'disableFeature',
                'container', 'initializeContainer', 'getContainer', 'createMockContainer',
                'TYPES'
            ];

            publicExports.forEach(exportName => {
                expect(eval(exportName)).toBeDefined();
            });
        });

        it('should hide implementation details', () => {
            // Implementation details should not be directly accessible
            // This ensures consumers can't depend on internal implementation

            // These should throw errors because they're not exported
            const implementationDetails = [
                'CacheProvider',
                'WebSocketProvider',
                'AuthProvider',
                'ThemeProvider',
                'LoggerProvider',
                'NetworkProvider',
                'ServiceContainer',
                'ServiceRegistry'
            ];

            implementationDetails.forEach(detail => {
                expect(() => eval(detail)).toThrow();
            });
        });

        it('should provide factory functions for service creation', () => {
            // Should provide clean factory functions instead of constructors
            expect(typeof initializeContainer).toBe('function');
            expect(typeof getContainer).toBe('function');
            expect(typeof createMockContainer).toBe('function');

            expect(container).toBeDefined();

            // These should work without errors
            expect(() => {
                const c = container;
                initializeContainer();
                const container2 = getContainer();
                const mockContainer = createMockContainer();
            }).not.toThrow();
        });
    });

    describe('Integration with Core Modules', () => {
        it('should provide consistent API across modules', () => {
            // Test that exports from different core modules are consistent
            expect(typeof CORE_CONSTANTS).toBe('object');
            expect(typeof CORE_ERROR_MESSAGES).toBe('object');
            expect(typeof CORE_SERVICE_NAMES).toBe('object');

            // Test that constants have expected structure
            expect(CORE_CONSTANTS).toHaveProperty('INITIALIZATION_TIMEOUT');
            expect(CORE_CONSTANTS).toHaveProperty('DEFAULT_CACHE_SIZE');
            expect(CORE_CONSTANTS).toHaveProperty('DEFAULT_THEME_NAME');

            expect(CORE_ERROR_MESSAGES).toHaveProperty(CORE_ERROR_CODES.INITIALIZATION_FAILED);
            expect(CORE_SERVICE_NAMES).toHaveProperty('CACHE');
            expect(CORE_SERVICE_NAMES).toHaveProperty('AUTH');
            expect(CORE_SERVICE_NAMES).toHaveProperty('THEME');
        });

        it('should maintain backward compatibility', () => {
            // Legacy exports should be available for backward compatibility
            expect(_LegacyExports).toBeDefined();

            // Should not break existing code that depends on legacy exports
            expect(typeof _LegacyExports).toBe('object');
        });
    });
});
