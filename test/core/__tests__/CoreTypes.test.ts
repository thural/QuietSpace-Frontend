/**
 * Core Types Tests
 * 
 * Tests for core system type definitions and interfaces.
 */

import type {
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
    CoreSystemEvent,
    CoreSystemStatus
} from '../../../src/core/types';

import { WebSocketState, LogLevel } from '../../../src/core/types';

describe('Core Types', () => {
    describe('Cache Service Types', () => {
        it('should have correct ICacheService interface', () => {
            const mockCacheService: ICacheService = {
                get: async () => null,
                set: async () => { },
                delete: async () => { },
                clear: async () => { },
                has: async () => false,
                getStats: () => ({ size: 0, hits: 0, misses: 0, hitRate: 0, memoryUsage: 0 })
            };

            expect(typeof mockCacheService.get).toBe('function');
            expect(typeof mockCacheService.set).toBe('function');
            expect(typeof mockCacheService.delete).toBe('function');
            expect(typeof mockCacheService.clear).toBe('function');
            expect(typeof mockCacheService.has).toBe('function');
            expect(typeof mockCacheService.getStats).toBe('function');
        });

        it('should have correct ICacheServiceManager interface', () => {
            const mockCacheManager: ICacheServiceManager = {
                get: async () => null,
                set: async () => { },
                delete: async () => { },
                clear: async () => { },
                has: async () => false,
                getStats: () => ({ size: 0, hits: 0, misses: 0, hitRate: 0, memoryUsage: 0 }),
                createCache: () => mockCacheManager,
                getCache: () => null,
                removeCache: () => { },
                clearAll: () => { },
                getAllStats: () => ({})
            };

            expect(typeof mockCacheManager.createCache).toBe('function');
            expect(typeof mockCacheManager.getCache).toBe('function');
            expect(typeof mockCacheManager.removeCache).toBe('function');
            expect(typeof mockCacheManager.clearAll).toBe('function');
            expect(typeof mockCacheManager.getAllStats).toBe('function');
        });

        it('should have correct CacheEntry type', () => {
            const cacheEntry: CacheEntry<string> = {
                key: 'test',
                value: 'test-value',
                timestamp: Date.now(),
                ttl: 3600000,
                expiresAt: Date.now() + 3600000
            };

            expect(cacheEntry.key).toBe('test');
            expect(cacheEntry.value).toBe('test-value');
            expect(typeof cacheEntry.timestamp).toBe('number');
            expect(typeof cacheEntry.ttl).toBe('number');
            expect(typeof cacheEntry.expiresAt).toBe('number');
        });

        it('should have correct CacheStats type', () => {
            const cacheStats: CacheStats = {
                size: 100,
                hits: 80,
                misses: 20,
                hitRate: 0.8,
                memoryUsage: 1024
            };

            expect(cacheStats.size).toBe(100);
            expect(cacheStats.hits).toBe(80);
            expect(cacheStats.misses).toBe(20);
            expect(cacheStats.hitRate).toBe(0.8);
            expect(cacheStats.memoryUsage).toBe(1024);
        });

        it('should have correct CacheConfig type', () => {
            const cacheConfig: CacheConfig = {
                maxSize: 1000,
                defaultTtl: 3600000,
                strategy: 'lru',
                enableMetrics: true
            };

            expect(cacheConfig.maxSize).toBe(1000);
            expect(cacheConfig.defaultTtl).toBe(3600000);
            expect(cacheConfig.strategy).toBe('lru');
            expect(cacheConfig.enableMetrics).toBe(true);
        });
    });

    describe('WebSocket Service Types', () => {
        it('should have correct IWebSocketService interface', () => {
            const mockWebSocketService: IWebSocketService = {
                connect: async () => { },
                disconnect: async () => { },
                send: async () => { },
                subscribe: () => () => { },
                isConnected: () => false,
                getState: () => WebSocketState.DISCONNECTED
            };

            expect(typeof mockWebSocketService.connect).toBe('function');
            expect(typeof mockWebSocketService.disconnect).toBe('function');
            expect(typeof mockWebSocketService.send).toBe('function');
            expect(typeof mockWebSocketService.subscribe).toBe('function');
            expect(typeof mockWebSocketService.isConnected).toBe('function');
            expect(typeof mockWebSocketService.getState).toBe('function');
        });

        it('should have correct WebSocketMessage type', () => {
            const webSocketMessage: WebSocketMessage = {
                type: 'test',
                data: { test: 'data' },
                timestamp: Date.now(),
                id: 'message-id'
            };

            expect(webSocketMessage.type).toBe('test');
            expect(webSocketMessage.data).toEqual({ test: 'data' });
            expect(typeof webSocketMessage.timestamp).toBe('number');
            expect(webSocketMessage.id).toBe('message-id');
        });

        it('should have correct WebSocketConfig type', () => {
            const webSocketConfig: WebSocketConfig = {
                url: 'ws://localhost:8080',
                reconnectInterval: 3000,
                maxReconnectAttempts: 5,
                timeout: 10000,
                protocols: ['websocket']
            };

            expect(webSocketConfig.url).toBe('ws://localhost:8080');
            expect(webSocketConfig.reconnectInterval).toBe(3000);
            expect(webSocketConfig.maxReconnectAttempts).toBe(5);
            expect(webSocketConfig.timeout).toBe(10000);
            expect(webSocketConfig.protocols).toEqual(['websocket']);
        });

        it('should have correct WebSocketState enum', () => {
            expect(WebSocketState.DISCONNECTED).toBe('disconnected');
            expect(WebSocketState.CONNECTING).toBe('connecting');
            expect(WebSocketState.CONNECTED).toBe('connected');
            expect(WebSocketState.RECONNECTING).toBe('reconnecting');
            expect(WebSocketState.ERROR).toBe('error');
        });
    });

    describe('Authentication Service Types', () => {
        it('should have correct IAuthService interface', () => {
            const mockAuthService: IAuthService = {
                authenticate: async () => ({ success: false }),
                register: async () => ({ success: false }),
                logout: async () => ({ success: false }),
                refreshToken: async () => ({ success: false }),
                validateToken: async () => ({ success: false }),
                getCurrentUser: async () => ({ success: false })
            };

            expect(typeof mockAuthService.authenticate).toBe('function');
            expect(typeof mockAuthService.register).toBe('function');
            expect(typeof mockAuthService.logout).toBe('function');
            expect(typeof mockAuthService.refreshToken).toBe('function');
            expect(typeof mockAuthService.validateToken).toBe('function');
            expect(typeof mockAuthService.getCurrentUser).toBe('function');
        });

        it('should have correct AuthCredentials type', () => {
            const authCredentials: AuthCredentials = {
                email: 'test@example.com',
                password: 'password123',
                rememberMe: true
            };

            expect(authCredentials.email).toBe('test@example.com');
            expect(authCredentials.password).toBe('password123');
            expect(authCredentials.rememberMe).toBe(true);
        });

        it('should have correct AuthUser type', () => {
            const authUser: AuthUser = {
                id: 'user-id',
                email: 'test@example.com',
                username: 'testuser',
                roles: ['user'],
                permissions: ['read'],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            expect(authUser.id).toBe('user-id');
            expect(authUser.email).toBe('test@example.com');
            expect(authUser.username).toBe('testuser');
            expect(authUser.roles).toEqual(['user']);
            expect(authUser.permissions).toEqual(['read']);
            expect(authUser.createdAt).toBeInstanceOf(Date);
            expect(authUser.updatedAt).toBeInstanceOf(Date);
        });

        it('should have correct AuthToken type', () => {
            const authToken: AuthToken = {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                expiresAt: new Date(),
                tokenType: 'Bearer'
            };

            expect(authToken.accessToken).toBe('access-token');
            expect(authToken.refreshToken).toBe('refresh-token');
            expect(authToken.expiresAt).toBeInstanceOf(Date);
            expect(authToken.tokenType).toBe('Bearer');
        });

        it('should have correct AuthSession type', () => {
            const authSession: AuthSession = {
                user: {
                    id: 'user-id',
                    email: 'test@example.com',
                    username: 'testuser',
                    roles: ['user'],
                    permissions: ['read'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                token: {
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token',
                    expiresAt: new Date(),
                    tokenType: 'Bearer'
                },
                provider: 'jwt',
                createdAt: new Date(),
                expiresAt: new Date(),
                isActive: true
            };

            expect(authSession.provider).toBe('jwt');
            expect(authSession.isActive).toBe(true);
            expect(authSession.createdAt).toBeInstanceOf(Date);
            expect(authSession.expiresAt).toBeInstanceOf(Date);
        });

        it('should have correct AuthResult type', () => {
            const successResult: AuthResult<string> = {
                success: true,
                data: 'success-data'
            };

            const errorResult: AuthResult = {
                success: false,
                error: {
                    type: 'validation',
                    message: 'Invalid credentials',
                    code: 'AUTH_001',
                    details: { field: 'email' }
                }
            };

            expect(successResult.success).toBe(true);
            expect(successResult.data).toBe('success-data');

            expect(errorResult.success).toBe(false);
            expect(errorResult.error?.type).toBe('validation');
            expect(errorResult.error?.message).toBe('Invalid credentials');
            expect(errorResult.error?.code).toBe('AUTH_001');
            expect(errorResult.error?.details).toEqual({ field: 'email' });
        });
    });

    describe('Theme Service Types', () => {
        it('should have correct IThemeService interface', () => {
            const mockThemeService: IThemeService = {
                getTheme: () => ({} as EnhancedTheme),
                setTheme: () => { },
                createTheme: () => ({} as EnhancedTheme),
                getTokens: () => ({} as ThemeTokens),
                switchTheme: () => { }
            };

            expect(typeof mockThemeService.getTheme).toBe('function');
            expect(typeof mockThemeService.setTheme).toBe('function');
            expect(typeof mockThemeService.createTheme).toBe('function');
            expect(typeof mockThemeService.getTokens).toBe('function');
            expect(typeof mockThemeService.switchTheme).toBe('function');
        });

        it('should have correct ThemeConfig type', () => {
            const themeConfig: ThemeConfig = {
                name: 'dark',
                colors: { primary: '#000' },
                typography: { fontSize: '16px' },
                spacing: { sm: '8px' },
                shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' }
            };

            expect(themeConfig.name).toBe('dark');
            expect(themeConfig.colors).toEqual({ primary: '#000' });
            expect(themeConfig.typography).toEqual({ fontSize: '16px' });
            expect(themeConfig.spacing).toEqual({ sm: '8px' });
            expect(themeConfig.shadows).toEqual({ md: '0 4px 6px rgba(0,0,0,0.1)' });
        });

        it('should have correct ThemeTokens type', () => {
            const themeTokens: ThemeTokens = {
                colors: { primary: '#000' },
                typography: { fontSize: '16px' },
                spacing: { sm: '8px' },
                shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' },
                breakpoints: { sm: '640px' },
                radius: { sm: '4px' }
            };

            expect(themeTokens.colors).toEqual({ primary: '#000' });
            expect(themeTokens.typography).toEqual({ fontSize: '16px' });
            expect(themeTokens.spacing).toEqual({ sm: '8px' });
            expect(themeTokens.shadows).toEqual({ md: '0 4px 6px rgba(0,0,0,0.1)' });
            expect(themeTokens.breakpoints).toEqual({ sm: '640px' });
            expect(themeTokens.radius).toEqual({ sm: '4px' });
        });

        it('should have correct EnhancedTheme type', () => {
            const enhancedTheme: EnhancedTheme = {
                colors: { primary: '#000' },
                typography: { fontSize: '16px' },
                spacing: { sm: '8px' },
                shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' },
                breakpoints: { sm: '640px' },
                radius: { sm: '4px' },
                getSpacing: () => '8px',
                getColor: () => '#000',
                getTypography: () => ({ fontSize: '16px' })
            };

            expect(typeof enhancedTheme.getSpacing).toBe('function');
            expect(typeof enhancedTheme.getColor).toBe('function');
            expect(typeof enhancedTheme.getTypography).toBe('function');
        });
    });

    describe('Logger Service Types', () => {
        it('should have correct ILoggerService interface', () => {
            const mockLoggerService: ILoggerService = {
                debug: () => { },
                info: () => { },
                warn: () => { },
                error: () => { },
                setLevel: () => { },
                getLevel: () => LogLevel.INFO
            };

            expect(typeof mockLoggerService.debug).toBe('function');
            expect(typeof mockLoggerService.info).toBe('function');
            expect(typeof mockLoggerService.warn).toBe('function');
            expect(typeof mockLoggerService.error).toBe('function');
            expect(typeof mockLoggerService.setLevel).toBe('function');
            expect(typeof mockLoggerService.getLevel).toBe('function');
        });

        it('should have correct LogLevel enum', () => {
            expect(LogLevel.DEBUG).toBe('debug');
            expect(LogLevel.INFO).toBe('info');
            expect(LogLevel.WARN).toBe('warn');
            expect(LogLevel.ERROR).toBe('error');
        });

        it('should have correct IServiceConfig type', () => {
            const serviceConfig: IServiceConfig = {
                level: LogLevel.INFO,
                enableConsole: true,
                enableFile: false,
                enableRemote: false
            };

            expect(serviceConfig.level).toBe(LogLevel.INFO);
            expect(serviceConfig.enableConsole).toBe(true);
            expect(serviceConfig.enableFile).toBe(false);
            expect(serviceConfig.enableRemote).toBe(false);
        });
    });

    describe('Network Service Types', () => {
        it('should have correct INetworkService interface', () => {
            const mockNetworkService: INetworkService = {
                get: async () => ({ success: false }),
                post: async () => ({ success: false }),
                put: async () => ({ success: false }),
                delete: async () => ({ success: false }),
                setAuth: () => { },
                clearAuth: () => { }
            };

            expect(typeof mockNetworkService.get).toBe('function');
            expect(typeof mockNetworkService.post).toBe('function');
            expect(typeof mockNetworkService.put).toBe('function');
            expect(typeof mockNetworkService.delete).toBe('function');
            expect(typeof mockNetworkService.setAuth).toBe('function');
            expect(typeof mockNetworkService.clearAuth).toBe('function');
        });

        it('should have correct ApiResponse type', () => {
            const successResponse: ApiResponse<string> = {
                data: 'response-data',
                success: true,
                message: 'Success',
                status: 200,
                headers: { 'content-type': 'application/json' }
            };

            const errorResponse: ApiResponse = {
                success: false,
                message: 'Error',
                error: 'Something went wrong',
                status: 500
            };

            expect(successResponse.success).toBe(true);
            expect(successResponse.data).toBe('response-data');
            expect(successResponse.message).toBe('Success');
            expect(successResponse.status).toBe(200);
            expect(successResponse.headers).toEqual({ 'content-type': 'application/json' });

            expect(errorResponse.success).toBe(false);
            expect(errorResponse.message).toBe('Error');
            expect(errorResponse.error).toBe('Something went wrong');
            expect(errorResponse.status).toBe(500);
        });

        it('should have correct ApiError type', () => {
            const apiError: ApiError = {
                message: 'Not found',
                status: 404,
                code: 'NOT_FOUND',
                details: { resource: 'user' }
            };

            expect(apiError.message).toBe('Not found');
            expect(apiError.status).toBe(404);
            expect(apiError.code).toBe('NOT_FOUND');
            expect(apiError.details).toEqual({ resource: 'user' });
        });
    });

    describe('Dependency Injection Types', () => {
        it('should have correct IServiceContainer interface', () => {
            const mockServiceContainer: IServiceContainer = {
                register: () => { },
                get: () => null as any,
                has: () => false,
                clear: () => { }
            };

            expect(typeof mockServiceContainer.register).toBe('function');
            expect(typeof mockServiceContainer.get).toBe('function');
            expect(typeof mockServiceContainer.has).toBe('function');
            expect(typeof mockServiceContainer.clear).toBe('function');
        });

        it('should have correct ServiceIdentifier type', () => {
            const stringIdentifier: ServiceIdentifier = 'test-service';
            const symbolIdentifier: ServiceIdentifier = Symbol('test-service');
            const classIdentifier: ServiceIdentifier = class TestService { };

            expect(stringIdentifier).toBe('test-service');
            expect(typeof symbolIdentifier).toBe('symbol');
            expect(typeof classIdentifier).toBe('function');
        });

        it('should have correct ServiceFactory type', () => {
            const serviceFactory: ServiceFactory<string> = () => 'test-service';
            const serviceFactoryWithDeps: ServiceFactory<string> = (dep1, dep2) => 'test-service';

            expect(typeof serviceFactory).toBe('function');
            expect(typeof serviceFactoryWithDeps).toBe('function');
        });

        it('should have correct ServiceDescriptor type', () => {
            const serviceDescriptor: ServiceDescriptor<string> = {
                identifier: 'test-service',
                factory: () => 'test-service',
                singleton: true,
                dependencies: ['dep1', 'dep2']
            };

            expect(serviceDescriptor.identifier).toBe('test-service');
            expect(typeof serviceDescriptor.factory).toBe('function');
            expect(serviceDescriptor.singleton).toBe(true);
            expect(serviceDescriptor.dependencies).toEqual(['dep1', 'dep2']);
        });
    });

    describe('Core System Types', () => {
        it('should have correct ICoreServices interface', () => {
            const mockCoreServices: ICoreServices = {
                cache: {} as ICacheServiceManager,
                websocket: {} as IWebSocketService,
                auth: {} as IAuthService,
                theme: {} as IThemeService,
                services: {} as ILoggerService,
                network: {} as INetworkService,
                container: {} as IServiceContainer
            };

            expect(mockCoreServices.cache).toBeDefined();
            expect(mockCoreServices.websocket).toBeDefined();
            expect(mockCoreServices.auth).toBeDefined();
            expect(mockCoreServices.theme).toBeDefined();
            expect(mockCoreServices.services).toBeDefined();
            expect(mockCoreServices.network).toBeDefined();
            expect(mockCoreServices.container).toBeDefined();
        });

        it('should have correct CoreSystemEvent type', () => {
            const coreSystemEvent: CoreSystemEvent = {
                type: 'system:initialized',
                payload: { message: 'System initialized' },
                timestamp: new Date()
            };

            expect(coreSystemEvent.type).toBe('system:initialized');
            expect(coreSystemEvent.payload).toEqual({ message: 'System initialized' });
            expect(coreSystemEvent.timestamp).toBeInstanceOf(Date);
        });

        it('should have correct CoreSystemStatus type', () => {
            const coreSystemStatus: CoreSystemStatus = {
                initialized: true,
                services: {
                    cache: true,
                    auth: true,
                    theme: false
                },
                errors: [],
                lastUpdated: new Date()
            };

            expect(coreSystemStatus.initialized).toBe(true);
            expect(coreSystemStatus.services.cache).toBe(true);
            expect(coreSystemStatus.services.auth).toBe(true);
            expect(coreSystemStatus.services.theme).toBe(false);
            expect(coreSystemStatus.errors).toEqual([]);
            expect(coreSystemStatus.lastUpdated).toBeInstanceOf(Date);
        });
    });

    describe('Type Safety and Validation', () => {
        it('should enforce type safety for interfaces', () => {
            // These should compile without TypeScript errors
            const cacheService: ICacheService = {
                get: async (key: string) => null,
                set: async (key: string, value: any, ttl?: number) => { },
                delete: async (key: string) => { },
                clear: async () => { },
                has: async (key: string) => false,
                getStats: () => ({ size: 0, hits: 0, misses: 0, hitRate: 0, memoryUsage: 0 })
            };

            const authService: IAuthService = {
                authenticate: async (credentials: AuthCredentials) => ({ success: false }),
                register: async (userData: AuthCredentials) => ({ success: false }),
                logout: async () => ({ success: false }),
                refreshToken: async (refreshToken: string) => ({ success: false }),
                validateToken: async (token: string) => ({ success: false }),
                getCurrentUser: async () => ({ success: false })
            };

            expect(cacheService).toBeDefined();
            expect(authService).toBeDefined();
        });

        it('should handle optional properties correctly', () => {
            const cacheConfig: CacheConfig = {
                maxSize: 1000
                // defaultTtl, strategy, and enableMetrics are optional
            };

            const webSocketConfig: WebSocketConfig = {
                url: 'ws://localhost:8080'
                // other properties are optional
            };

            expect(cacheConfig.maxSize).toBe(1000);
            expect(webSocketConfig.url).toBe('ws://localhost:8080');
        });

        it('should support generic types', () => {
            const cacheEntry: CacheEntry<{ name: string }> = {
                key: 'user-1',
                value: { name: 'John Doe' },
                timestamp: Date.now()
            };

            const successResponse: ApiResponse<{ id: string }> = {
                success: true,
                data: { id: 'user-1' }
            };

            const authResult: AuthResult<AuthSession> = {
                success: true,
                data: {
                    user: {
                        id: 'user-1',
                        email: 'test@example.com',
                        username: 'testuser',
                        roles: ['user'],
                        permissions: ['read'],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    token: {
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token',
                        expiresAt: new Date(),
                        tokenType: 'Bearer'
                    },
                    provider: 'jwt',
                    createdAt: new Date(),
                    expiresAt: new Date(),
                    isActive: true
                }
            };

            expect(cacheEntry.value.name).toBe('John Doe');
            expect(successResponse.data?.id).toBe('user-1');
            expect(authResult.data?.user.id).toBe('user-1');
        });
    });
});
