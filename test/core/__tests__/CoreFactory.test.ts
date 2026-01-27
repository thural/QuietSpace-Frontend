/**
 * Core Factory Functions Tests
 * 
 * Tests for core system factory functions and service creation.
 */

import {
    createCoreServices,
    createCacheService,
    createWebSocketService,
    createAuthService,
    createThemeService,
    createNetworkService,
    createServiceContainer,
    createLoggerService,
    createMockCoreServices
} from '../../../src/core/factory';

import type {
    ICoreServices,
    ICacheServiceManager,
    IWebSocketService,
    IAuthService,
    IThemeService,
    INetworkService,
    IServiceContainer,
    ILoggerService,
    CoreConfig,
    CacheConfig,
    WebSocketConfig,
    ThemeConfig,
    IServiceConfig
} from '../../../src/core/types';

import { LogLevel } from '../../../src/core/types';

import type { AuthConfig, NetworkConfig } from '../../../src/core/config';

// Mock the dependencies
jest.mock('../../../src/core/cache', () => ({
    createCacheServiceManager: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn(),
        has: jest.fn(),
        getStats: jest.fn(),
        createCache: jest.fn(),
        getCache: jest.fn(),
        removeCache: jest.fn(),
        clearAll: jest.fn(),
        getAllStats: jest.fn()
    }))
}));

jest.mock('../../../src/core/auth', () => ({
    createDefaultAuthService: jest.fn(() => ({
        authenticate: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        validateToken: jest.fn(),
        getCurrentUser: jest.fn()
    }))
}));

jest.mock('../../../src/core/theme', () => ({
    createTheme: jest.fn(() => ({
        name: 'default',
        variant: 'light',
        tokens: {
            colors: {},
            typography: {},
            spacing: {},
            shadows: {},
            breakpoints: {},
            radius: {}
        }
    }))
}));

jest.mock('../../../src/core/services', () => ({
    createLogger: jest.fn(() => ({
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        setLevel: jest.fn(),
        getLevel: jest.fn()
    }))
}));

jest.mock('../../../src/core/network', () => ({
    createApiClient: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        setAuth: jest.fn(),
        clearAuth: jest.fn()
    }))
}));

jest.mock('../../../src/core/di', () => ({
    Container: jest.fn(() => ({
        register: jest.fn(),
        get: jest.fn(),
        has: jest.fn(),
        clear: jest.fn()
    }))
}));

describe('Core Factory Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCoreServices', () => {
        it('should create complete core services with default config', () => {
            const services = createCoreServices();

            expect(services).toBeDefined();
            expect(services.cache).toBeDefined();
            expect(services.websocket).toBeDefined();
            expect(services.auth).toBeDefined();
            expect(services.theme).toBeDefined();
            expect(services.services).toBeDefined();
            expect(services.network).toBeDefined();
            expect(services.container).toBeDefined();
        });

        it('should create core services with custom config', () => {
            const config: CoreConfig = {
                cache: { maxSize: 2000 },
                theme: { name: 'dark' }
            };

            const services = createCoreServices(config);

            expect(services).toBeDefined();
            // Verify that the config was passed through (mocks would be called with config)
        });

        it('should return services that implement correct interfaces', () => {
            const services = createCoreServices();

            // Check that all services have required methods
            expect(typeof services.cache.get).toBe('function');
            expect(typeof services.cache.set).toBe('function');
            expect(typeof services.cache.delete).toBe('function');
            expect(typeof services.cache.clear).toBe('function');

            expect(typeof services.websocket.connect).toBe('function');
            expect(typeof services.websocket.disconnect).toBe('function');
            expect(typeof services.websocket.send).toBe('function');

            expect(typeof services.auth.authenticate).toBe('function');
            expect(typeof services.auth.register).toBe('function');
            expect(typeof services.auth.logout).toBe('function');

            expect(typeof services.theme.getTheme).toBe('function');
            expect(typeof services.theme.setTheme).toBe('function');

            expect(typeof services.services.debug).toBe('function');
            expect(typeof services.services.info).toBe('function');

            expect(typeof services.network.get).toBe('function');
            expect(typeof services.network.post).toBe('function');

            expect(typeof services.container.register).toBe('function');
            expect(typeof services.container.get).toBe('function');
        });
    });

    describe('createCacheService', () => {
        it('should create cache service with default config', () => {
            const cacheService = createCacheService();

            expect(cacheService).toBeDefined();
            expect(typeof cacheService.get).toBe('function');
            expect(typeof cacheService.set).toBe('function');
            expect(typeof cacheService.delete).toBe('function');
            expect(typeof cacheService.clear).toBe('function');
        });

        it('should create cache service with custom config', () => {
            const config: CacheConfig = {
                maxSize: 500,
                strategy: 'fifo'
            };

            const cacheService = createCacheService(config);

            expect(cacheService).toBeDefined();
        });
    });

    describe('createWebSocketService', () => {
        it('should create WebSocket service with default config', () => {
            const wsService = createWebSocketService();

            expect(wsService).toBeDefined();
            expect(typeof wsService.connect).toBe('function');
            expect(typeof wsService.disconnect).toBe('function');
            expect(typeof wsService.send).toBe('function');
            expect(typeof wsService.subscribe).toBe('function');
            expect(typeof wsService.isConnected).toBe('function');
            expect(typeof wsService.getState).toBe('function');
        });

        it('should create WebSocket service with custom config', () => {
            const config: WebSocketConfig = {
                url: 'ws://localhost:8080',
                reconnectInterval: 5000
            };

            const wsService = createWebSocketService(config);

            expect(wsService).toBeDefined();
        });

        it('should return mock WebSocket service', async () => {
            const wsService = createWebSocketService();

            // Test that mock methods work
            await expect(wsService.connect()).resolves.toBeUndefined();
            await expect(wsService.disconnect()).resolves.toBeUndefined();
            await expect(wsService.send({ type: 'test', data: {}, timestamp: Date.now() })).resolves.toBeUndefined();
            expect(typeof wsService.subscribe('test', () => { })).toBe('function');
            expect(wsService.isConnected()).toBe(false);
            expect(wsService.getState()).toBe('disconnected');
        });
    });

    describe('createAuthService', () => {
        it('should create auth service with default config', () => {
            const authService = createAuthService();

            expect(authService).toBeDefined();
            expect(typeof authService.authenticate).toBe('function');
            expect(typeof authService.register).toBe('function');
            expect(typeof authService.logout).toBe('function');
            expect(typeof authService.refreshToken).toBe('function');
            expect(typeof authService.validateToken).toBe('function');
            expect(typeof authService.getCurrentUser).toBe('function');
        });

        it('should create auth service with custom config', () => {
            const config: AuthConfig = {
                enableTwoFactorAuth: true,
                passwordMinLength: 12
            };

            const authService = createAuthService(config);

            expect(authService).toBeDefined();
        });
    });

    describe('createThemeService', () => {
        it('should create theme service with default config', () => {
            const themeService = createThemeService();

            expect(themeService).toBeDefined();
            expect(typeof themeService.getTheme).toBe('function');
            expect(typeof themeService.setTheme).toBe('function');
            expect(typeof themeService.createTheme).toBe('function');
            expect(typeof themeService.getTokens).toBe('function');
            expect(typeof themeService.switchTheme).toBe('function');
        });

        it('should create theme service with custom config', () => {
            const config: ThemeConfig = {
                name: 'dark',
                colors: { primary: '#000' }
            };

            const themeService = createThemeService(config);

            expect(themeService).toBeDefined();
        });

        it('should return theme with correct structure', () => {
            const themeService = createThemeService();
            const theme = themeService.getTheme();

            expect(theme).toBeDefined();
            // Test that theme has the expected methods from EnhancedTheme interface
            expect(typeof theme.getSpacing).toBe('function');
            expect(typeof theme.getColor).toBe('function');
            expect(typeof theme.getTypography).toBe('function');
        });
    });

    describe('createNetworkService', () => {
        it('should create network service with default config', () => {
            const networkService = createNetworkService();

            expect(networkService).toBeDefined();
            expect(typeof networkService.get).toBe('function');
            expect(typeof networkService.post).toBe('function');
            expect(typeof networkService.put).toBe('function');
            expect(typeof networkService.delete).toBe('function');
            expect(typeof networkService.setAuth).toBe('function');
            expect(typeof networkService.clearAuth).toBe('function');
        });

        it('should create network service with custom config', () => {
            const config: NetworkConfig = {
                baseURL: 'https://api.example.com',
                timeout: 60000
            };

            const networkService = createNetworkService(config);

            expect(networkService).toBeDefined();
        });
    });

    describe('createServiceContainer', () => {
        it('should create service container', () => {
            const container = createServiceContainer();

            expect(container).toBeDefined();
            expect(typeof container.register).toBe('function');
            expect(typeof container.get).toBe('function');
            expect(typeof container.has).toBe('function');
            expect(typeof container.clear).toBe('function');
        });
    });

    describe('createLoggerService', () => {
        it('should create logger service with default config', () => {
            const loggerService = createLoggerService();

            expect(loggerService).toBeDefined();
            expect(typeof loggerService.debug).toBe('function');
            expect(typeof loggerService.info).toBe('function');
            expect(typeof loggerService.warn).toBe('function');
            expect(typeof loggerService.error).toBe('function');
            expect(typeof loggerService.setLevel).toBe('function');
            expect(typeof loggerService.getLevel).toBe('function');
        });

        it('should create logger service with custom config', () => {
            const config: IServiceConfig = {
                level: LogLevel.DEBUG,
                enableFile: true
            };

            const loggerService = createLoggerService(config);

            expect(loggerService).toBeDefined();
        });
    });

    describe('createMockCoreServices', () => {
        it('should create complete mock core services', () => {
            const mockServices = createMockCoreServices();

            expect(mockServices).toBeDefined();
            expect(mockServices.cache).toBeDefined();
            expect(mockServices.websocket).toBeDefined();
            expect(mockServices.auth).toBeDefined();
            expect(mockServices.theme).toBeDefined();
            expect(mockServices.services).toBeDefined();
            expect(mockServices.network).toBeDefined();
            expect(mockServices.container).toBeDefined();
        });

        it('should create mock services with all required methods', () => {
            const mockServices = createMockCoreServices();

            // Cache service methods
            expect(typeof mockServices.cache.get).toBe('function');
            expect(typeof mockServices.cache.set).toBe('function');
            expect(typeof mockServices.cache.delete).toBe('function');
            expect(typeof mockServices.cache.clear).toBe('function');
            expect(typeof mockServices.cache.has).toBe('function');
            expect(typeof mockServices.cache.getStats).toBe('function');
            expect(typeof mockServices.cache.createCache).toBe('function');
            expect(typeof mockServices.cache.getCache).toBe('function');
            expect(typeof mockServices.cache.removeCache).toBe('function');
            expect(typeof mockServices.cache.clearAll).toBe('function');
            expect(typeof mockServices.cache.getAllStats).toBe('function');

            // WebSocket service methods
            expect(typeof mockServices.websocket.connect).toBe('function');
            expect(typeof mockServices.websocket.disconnect).toBe('function');
            expect(typeof mockServices.websocket.send).toBe('function');
            expect(typeof mockServices.websocket.subscribe).toBe('function');
            expect(typeof mockServices.websocket.isConnected).toBe('function');
            expect(typeof mockServices.websocket.getState).toBe('function');

            // Auth service methods
            expect(typeof mockServices.auth.authenticate).toBe('function');
            expect(typeof mockServices.auth.register).toBe('function');
            expect(typeof mockServices.auth.logout).toBe('function');
            expect(typeof mockServices.auth.refreshToken).toBe('function');
            expect(typeof mockServices.auth.validateToken).toBe('function');
            expect(typeof mockServices.auth.getCurrentUser).toBe('function');

            // Theme service methods
            expect(typeof mockServices.theme.getTheme).toBe('function');
            expect(typeof mockServices.theme.setTheme).toBe('function');
            expect(typeof mockServices.theme.createTheme).toBe('function');
            expect(typeof mockServices.theme.getTokens).toBe('function');
            expect(typeof mockServices.theme.switchTheme).toBe('function');

            // Logger service methods
            expect(typeof mockServices.services.debug).toBe('function');
            expect(typeof mockServices.services.info).toBe('function');
            expect(typeof mockServices.services.warn).toBe('function');
            expect(typeof mockServices.services.error).toBe('function');
            expect(typeof mockServices.services.setLevel).toBe('function');
            expect(typeof mockServices.services.getLevel).toBe('function');

            // Network service methods
            expect(typeof mockServices.network.get).toBe('function');
            expect(typeof mockServices.network.post).toBe('function');
            expect(typeof mockServices.network.put).toBe('function');
            expect(typeof mockServices.network.delete).toBe('function');
            expect(typeof mockServices.network.setAuth).toBe('function');
            expect(typeof mockServices.network.clearAuth).toBe('function');

            // Container methods
            expect(typeof mockServices.container.register).toBe('function');
            expect(typeof mockServices.container.get).toBe('function');
            expect(typeof mockServices.container.has).toBe('function');
            expect(typeof mockServices.container.clear).toBe('function');
        });

        it('should create mock services with correct return types', async () => {
            const mockServices = createMockCoreServices();

            // Test cache service
            await expect(mockServices.cache.get('test')).resolves.toBeNull();
            await expect(mockServices.cache.set('test', 'value')).resolves.toBeUndefined();
            await expect(mockServices.cache.delete('test')).resolves.toBeUndefined();
            await expect(mockServices.cache.clear()).resolves.toBeUndefined();
            await expect(mockServices.cache.has('test')).resolves.toBe(false);
            expect(mockServices.cache.getStats()).toEqual({
                size: 0,
                hits: 0,
                misses: 0,
                hitRate: 0,
                memoryUsage: 0
            });

            // Test WebSocket service
            await expect(mockServices.websocket.connect()).resolves.toBeUndefined();
            await expect(mockServices.websocket.disconnect()).resolves.toBeUndefined();
            await expect(mockServices.websocket.send({ type: 'test', data: {}, timestamp: Date.now() })).resolves.toBeUndefined();
            expect(mockServices.websocket.isConnected()).toBe(false);
            expect(mockServices.websocket.getState()).toBe('disconnected');

            // Test auth service
            await expect(mockServices.auth.authenticate({ email: 'test@example.com', password: 'password' })).resolves.toEqual({
                success: false
            });
            await expect(mockServices.auth.register({ email: 'test@example.com', password: 'password' })).resolves.toEqual({
                success: false
            });
            await expect(mockServices.auth.logout()).resolves.toEqual({ success: false });
            await expect(mockServices.auth.refreshToken('token')).resolves.toEqual({ success: false });
            await expect(mockServices.auth.validateToken('token')).resolves.toEqual({ success: false });
            await expect(mockServices.auth.getCurrentUser()).resolves.toEqual({ success: false });

            // Test theme service
            expect(mockServices.theme.getTheme()).toBeDefined();
            expect(mockServices.theme.getTokens()).toBeDefined();

            // Test logger service
            expect(mockServices.services.debug('test')).toBeUndefined();
            expect(mockServices.services.info('test')).toBeUndefined();
            expect(mockServices.services.warn('test')).toBeUndefined();
            expect(mockServices.services.error('test')).toBeUndefined();
            expect(mockServices.services.setLevel(LogLevel.DEBUG)).toBeUndefined();
            expect(mockServices.services.getLevel()).toBe('INFO');

            // Test network service
            await expect(mockServices.network.get('/test')).resolves.toEqual({ success: false });
            await expect(mockServices.network.post('/test', {})).resolves.toEqual({ success: false });
            await expect(mockServices.network.put('/test', {})).resolves.toEqual({ success: false });
            await expect(mockServices.network.delete('/test')).resolves.toEqual({ success: false });
            expect(mockServices.network.setAuth('token')).toBeUndefined();
            expect(mockServices.network.clearAuth()).toBeUndefined();

            // Test container
            expect(mockServices.container.register('test', () => ({}))).toBeUndefined();
            expect(mockServices.container.get('test')).toBeNull();
            expect(mockServices.container.has('test')).toBe(false);
            expect(mockServices.container.clear()).toBeUndefined();
        });

        it('should create mock services with custom config', () => {
            const config: CoreConfig = {
                cache: { maxSize: 2000 },
                theme: { name: 'dark' }
            };

            const mockServices = createMockCoreServices(config);

            expect(mockServices).toBeDefined();
            // Mock services should ignore config and return consistent mocks
        });
    });

    describe('Factory Integration', () => {
        it('should create services that work together', () => {
            const services = createCoreServices();

            // Test that services can be used together
            expect(services.container).toBeDefined();
            expect(services.cache).toBeDefined();
            expect(services.auth).toBeDefined();
            expect(services.theme).toBeDefined();
        });

        it('should handle error cases gracefully', () => {
            // Test with invalid config
            const invalidConfig = {
                cache: { maxSize: -1 }, // invalid but should not crash
                auth: { tokenRefreshInterval: -1 } // invalid but should not crash
            };

            expect(() => {
                const services = createCoreServices(invalidConfig);
                expect(services).toBeDefined();
            }).not.toThrow();
        });
    });
});
