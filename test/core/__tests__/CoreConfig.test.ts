/**
 * Core Configuration Tests
 * 
 * Tests for core system configuration functionality including
 * validation, factory functions, and environment-specific configs.
 */

import {
    CoreConfig,
    CacheConfig,
    WebSocketConfig,
    AuthConfig,
    ThemeConfig,
    NetworkConfig,
    ServiceConfig,
    DEFAULT_CONFIG,
    DEVELOPMENT_CONFIG,
    PRODUCTION_CONFIG,
    TEST_CONFIG,
    createCacheConfig,
    createWebSocketConfig,
    createAuthConfig,
    createThemeConfig,
    createNetworkConfig,
    createServiceConfig,
    createCoreConfig,
    getDevelopmentConfig,
    getProductionConfig,
    getTestConfig,
    validateCacheConfig,
    validateWebSocketConfig,
    validateAuthConfig,
    validateNetworkConfig,
    validateServiceConfig,
    validateCoreConfig
} from '../../../src/core/config';

describe('Core Configuration', () => {
    describe('Default Configurations', () => {
        it('should have valid default cache configuration', () => {
            const cacheConfig = DEFAULT_CONFIG.cache!;

            expect(cacheConfig.maxSize).toBe(1000);
            expect(cacheConfig.defaultTtl).toBe(3600000);
            expect(cacheConfig.strategy).toBe('lru');
            expect(cacheConfig.enableMetrics).toBe(true);
        });

        it('should have valid default websocket configuration', () => {
            const wsConfig = DEFAULT_CONFIG.websocket!;

            expect(wsConfig.reconnectInterval).toBe(3000);
            expect(wsConfig.maxReconnectAttempts).toBe(5);
            expect(wsConfig.timeout).toBe(10000);
        });

        it('should have valid default auth configuration', () => {
            const authConfig = DEFAULT_CONFIG.auth!;

            expect(authConfig.tokenRefreshInterval).toBe(300000);
            expect(authConfig.sessionTimeout).toBe(3600000);
            expect(authConfig.maxLoginAttempts).toBe(5);
            expect(authConfig.enableTwoFactorAuth).toBe(false);
            expect(authConfig.passwordMinLength).toBe(8);
            expect(authConfig.requireEmailVerification).toBe(true);
            expect(authConfig.enableSocialLogin).toBe(true);
            expect(authConfig.socialProviders).toEqual(['google', 'github', 'microsoft']);
        });

        it('should have valid default theme configuration', () => {
            const themeConfig = DEFAULT_CONFIG.theme!;

            expect(themeConfig.name).toBe('default');
            expect(themeConfig.variant).toBe('light');
        });

        it('should have valid default network configuration', () => {
            const networkConfig = DEFAULT_CONFIG.network!;

            expect(networkConfig.timeout).toBe(30000);
            expect(networkConfig.retryAttempts).toBe(3);
            expect(networkConfig.retryDelay).toBe(1000);
            expect(networkConfig.enableAuth).toBe(true);
        });

        it('should have valid default service configuration', () => {
            const serviceConfig = DEFAULT_CONFIG.services!;

            expect(serviceConfig.level).toBe('info');
            expect(serviceConfig.enableConsole).toBe(true);
            expect(serviceConfig.enableFile).toBe(false);
            expect(serviceConfig.enableRemote).toBe(false);
        });
    });

    describe('Environment Configurations', () => {
        it('should create valid development configuration', () => {
            expect(DEVELOPMENT_CONFIG.debug).toBe(true);
            expect(DEVELOPMENT_CONFIG.mockServices).toBe(true);
            expect(DEVELOPMENT_CONFIG.enableHotReload).toBe(true);
            expect(DEVELOPMENT_CONFIG.logLevel).toBe('debug');
        });

        it('should create valid production configuration', () => {
            expect(PRODUCTION_CONFIG.debug).toBe(false);
            expect(PRODUCTION_CONFIG.mockServices).toBe(false);
            expect(PRODUCTION_CONFIG.enableHotReload).toBe(false);
            expect(PRODUCTION_CONFIG.logLevel).toBe('info');
        });

        it('should create valid test configuration', () => {
            expect(TEST_CONFIG.debug).toBe(true);
            expect(TEST_CONFIG.mockServices).toBe(true);
            expect(TEST_CONFIG.enableHotReload).toBe(false);
            expect(TEST_CONFIG.logLevel).toBe('debug');
            expect(TEST_CONFIG.testTimeout).toBe(5000);
        });
    });

    describe('Factory Functions', () => {
        it('should create cache config with overrides', () => {
            const config = createCacheConfig({
                maxSize: 500,
                strategy: 'fifo'
            });

            expect(config.maxSize).toBe(500);
            expect(config.strategy).toBe('fifo');
            expect(config.defaultTtl).toBe(3600000); // default preserved
        });

        it('should create websocket config with overrides', () => {
            const config = createWebSocketConfig({
                url: 'ws://localhost:8080',
                reconnectInterval: 5000
            });

            expect(config.url).toBe('ws://localhost:8080');
            expect(config.reconnectInterval).toBe(5000);
            expect(config.maxReconnectAttempts).toBe(5); // default preserved
        });

        it('should create auth config with overrides', () => {
            const config = createAuthConfig({
                enableTwoFactorAuth: true,
                passwordMinLength: 12
            });

            expect(config.enableTwoFactorAuth).toBe(true);
            expect(config.passwordMinLength).toBe(12);
            expect(config.tokenRefreshInterval).toBe(300000); // default preserved
        });

        it('should create theme config with overrides', () => {
            const config = createThemeConfig({
                name: 'dark',
                colors: { primary: '#000' }
            });

            expect(config.name).toBe('dark');
            expect(config.colors?.primary).toBe('#000');
            expect(config.variant).toBe('light'); // default preserved
        });

        it('should create network config with overrides', () => {
            const config = createNetworkConfig({
                baseURL: 'https://api.example.com',
                timeout: 60000
            });

            expect(config.baseURL).toBe('https://api.example.com');
            expect(config.timeout).toBe(60000);
            expect(config.retryAttempts).toBe(3); // default preserved
        });

        it('should create service config with overrides', () => {
            const config = createServiceConfig({
                level: 'debug',
                enableFile: true
            });

            expect(config.level).toBe('debug');
            expect(config.enableFile).toBe(true);
            expect(config.enableConsole).toBe(true); // default preserved
        });

        it('should create core config with overrides', () => {
            const config = createCoreConfig({
                cache: { maxSize: 2000 },
                auth: { enableTwoFactorAuth: true }
            });

            expect(config.cache?.maxSize).toBe(2000);
            expect(config.auth?.enableTwoFactorAuth).toBe(true);
            expect(config.websocket?.reconnectInterval).toBe(3000); // default preserved
        });
    });

    describe('Environment-Specific Getters', () => {
        it('should get development config with overrides', () => {
            const config = getDevelopmentConfig({
                logLevel: 'warn'
            });

            expect(config.debug).toBe(true);
            expect(config.logLevel).toBe('warn');
            expect(config.mockServices).toBe(true);
        });

        it('should get production config with overrides', () => {
            const config = getProductionConfig({
                services: { level: 'error' }
            });

            expect(config.debug).toBe(false);
            expect(config.services?.level).toBe('error');
            expect(config.mockServices).toBe(false);
        });

        it('should get test config with overrides', () => {
            const config = getTestConfig({
                testTimeout: 10000
            });

            expect(config.debug).toBe(true);
            expect(config.testTimeout).toBe(10000);
            expect(config.mockServices).toBe(true);
        });
    });

    describe('Validation Functions', () => {
        describe('validateCacheConfig', () => {
            it('should validate valid cache config', () => {
                const config: CacheConfig = {
                    maxSize: 1000,
                    defaultTtl: 3600000,
                    strategy: 'lru'
                };

                const errors = validateCacheConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should detect invalid cache maxSize', () => {
                const config: CacheConfig = {
                    maxSize: 20000 // invalid - should be <= 10000
                };

                const errors = validateCacheConfig(config);
                expect(errors).toContain('Cache maxSize must be between 1 and 10000');
            });

            it('should detect invalid cache defaultTtl', () => {
                const config: CacheConfig = {
                    defaultTtl: 500 // invalid
                };

                const errors = validateCacheConfig(config);
                expect(errors).toContain('Cache defaultTtl must be between 1000ms and 24 hours');
            });

            it('should detect invalid cache strategy', () => {
                const config: CacheConfig = {
                    strategy: 'invalid' as any
                };

                const errors = validateCacheConfig(config);
                expect(errors).toContain('Cache strategy must be one of: lru, fifo, lfu');
            });
        });

        describe('validateWebSocketConfig', () => {
            it('should validate valid websocket config', () => {
                const config: WebSocketConfig = {
                    reconnectInterval: 3000,
                    maxReconnectAttempts: 5,
                    timeout: 10000
                };

                const errors = validateWebSocketConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should detect invalid reconnect interval', () => {
                const config: WebSocketConfig = {
                    reconnectInterval: 500 // invalid
                };

                const errors = validateWebSocketConfig(config);
                expect(errors).toContain('WebSocket reconnectInterval must be between 1s and 30s');
            });

            it('should detect invalid max reconnect attempts', () => {
                const config: WebSocketConfig = {
                    maxReconnectAttempts: 20 // invalid - should be <= 10
                };

                const errors = validateWebSocketConfig(config);
                expect(errors).toContain('WebSocket maxReconnectAttempts must be between 1 and 10');
            });

            it('should detect invalid timeout', () => {
                const config: WebSocketConfig = {
                    timeout: 500 // invalid
                };

                const errors = validateWebSocketConfig(config);
                expect(errors).toContain('WebSocket timeout must be between 1s and 60s');
            });
        });

        describe('validateAuthConfig', () => {
            it('should validate valid auth config', () => {
                const config: AuthConfig = {
                    tokenRefreshInterval: 300000,
                    sessionTimeout: 3600000,
                    maxLoginAttempts: 5
                };

                const errors = validateAuthConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should detect invalid token refresh interval', () => {
                const config: AuthConfig = {
                    tokenRefreshInterval: 30000 // invalid
                };

                const errors = validateAuthConfig(config);
                expect(errors).toContain('Auth tokenRefreshInterval must be between 1 minute and 1 hour');
            });

            it('should detect invalid session timeout', () => {
                const config: AuthConfig = {
                    sessionTimeout: 60000 // invalid
                };

                const errors = validateAuthConfig(config);
                expect(errors).toContain('Auth sessionTimeout must be between 5 minutes and 24 hours');
            });

            it('should detect invalid max login attempts', () => {
                const config: AuthConfig = {
                    maxLoginAttempts: 20 // invalid - should be <= 10
                };

                const errors = validateAuthConfig(config);
                expect(errors).toContain('Auth maxLoginAttempts must be between 1 and 10');
            });
        });

        describe('validateNetworkConfig', () => {
            it('should validate valid network config', () => {
                const config: NetworkConfig = {
                    timeout: 30000,
                    retryAttempts: 3,
                    retryDelay: 1000
                };

                const errors = validateNetworkConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should detect invalid timeout', () => {
                const config: NetworkConfig = {
                    timeout: 500 // invalid
                };

                const errors = validateNetworkConfig(config);
                expect(errors).toContain('Network timeout must be between 1s and 2 minutes');
            });

            it('should detect invalid retry attempts', () => {
                const config: NetworkConfig = {
                    retryAttempts: 10 // invalid
                };

                const errors = validateNetworkConfig(config);
                expect(errors).toContain('Network retryAttempts must be between 0 and 5');
            });

            it('should detect invalid retry delay', () => {
                const config: NetworkConfig = {
                    retryDelay: 50 // invalid
                };

                const errors = validateNetworkConfig(config);
                expect(errors).toContain('Network retryDelay must be between 100ms and 10s');
            });
        });

        describe('validateServiceConfig', () => {
            it('should validate valid service config', () => {
                const config: ServiceConfig = {
                    level: 'info'
                };

                const errors = validateServiceConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should detect invalid log level', () => {
                const config: ServiceConfig = {
                    level: 'invalid' as any
                };

                const errors = validateServiceConfig(config);
                expect(errors).toContain('Service level must be one of: debug, info, warn, error');
            });
        });

        describe('validateCoreConfig', () => {
            it('should validate valid core config', () => {
                const config: CoreConfig = {
                    cache: { maxSize: 1000 },
                    websocket: { reconnectInterval: 3000 },
                    auth: { tokenRefreshInterval: 300000 },
                    network: { timeout: 30000 },
                    services: { level: 'info' }
                };

                const errors = validateCoreConfig(config);
                expect(errors).toHaveLength(0);
            });

            it('should accumulate errors from all sub-configs', () => {
                const config: CoreConfig = {
                    cache: { maxSize: 20000 }, // invalid - too large
                    websocket: { reconnectInterval: 500 }, // invalid - too small
                    auth: { tokenRefreshInterval: 30000 }, // invalid - too small
                    network: { timeout: 500 }, // invalid - too small
                    services: { level: 'invalid' as any } // invalid
                };

                const errors = validateCoreConfig(config);
                expect(errors.length).toBeGreaterThan(0);
                expect(errors).toContain('Cache maxSize must be between 1 and 10000');
                expect(errors).toContain('WebSocket reconnectInterval must be between 1s and 30s');
                expect(errors).toContain('Auth tokenRefreshInterval must be between 1 minute and 1 hour');
                expect(errors).toContain('Network timeout must be between 1s and 2 minutes');
                expect(errors).toContain('Service level must be one of: debug, info, warn, error');
            });
        });
    });

    describe('Type Safety', () => {
        it('should maintain type safety for configuration objects', () => {
            const config: CoreConfig = createCoreConfig();

            // These should compile without TypeScript errors
            expect(config.cache?.maxSize).toBeDefined();
            expect(config.websocket?.reconnectInterval).toBeDefined();
            expect(config.auth?.tokenRefreshInterval).toBeDefined();
            expect(config.theme?.name).toBeDefined();
            expect(config.network?.timeout).toBeDefined();
            expect(config.services?.level).toBeDefined();
        });

        it('should handle optional configuration properties', () => {
            const config: CoreConfig = {};

            // Should handle missing properties gracefully
            expect(config.cache).toBeUndefined();
            expect(config.websocket).toBeUndefined();
            expect(config.auth).toBeUndefined();
            expect(config.theme).toBeUndefined();
            expect(config.network).toBeUndefined();
            expect(config.services).toBeUndefined();
        });
    });
});
