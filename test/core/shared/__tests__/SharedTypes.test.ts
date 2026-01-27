/**
 * Shared Types Test Suite
 */

import {
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
  CoreSystemStatus
} from '../../../src/core/shared/types';

describe('Shared Types', () => {
  test('should define cache service interfaces', () => {
    const cacheService: ICacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
      getStats: jest.fn()
    };

    expect(cacheService.get).toBeDefined();
    expect(cacheService.set).toBeDefined();
  });

  test('should define WebSocket service interface', () => {
    const webSocketService: IWebSocketService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      send: jest.fn(),
      subscribe: jest.fn(),
      isConnected: jest.fn(),
      getState: jest.fn()
    };

    expect(webSocketService.connect).toBeDefined();
    expect(webSocketService.send).toBeDefined();
  });

  test('should define auth service interface', () => {
    const authService: IAuthService = {
      authenticate: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      validateToken: jest.fn(),
      getCurrentUser: jest.fn()
    };

    expect(authService.authenticate).toBeDefined();
    expect(authService.register).toBeDefined();
  });

  test('should define theme service interface', () => {
    const themeService: IThemeService = {
      getTheme: jest.fn(),
      setTheme: jest.fn(),
      createTheme: jest.fn(),
      getTokens: jest.fn(),
      switchTheme: jest.fn()
    };

    expect(themeService.getTheme).toBeDefined();
    expect(themeService.setTheme).toBeDefined();
  });

  test('should define logger service interface', () => {
    const loggerService: ILoggerService = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
      getLevel: jest.fn()
    };

    expect(loggerService.debug).toBeDefined();
    expect(loggerService.error).toBeDefined();
  });

  test('should define network service interface', () => {
    const networkService: INetworkService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setAuth: jest.fn(),
      clearAuth: jest.fn()
    };

    expect(networkService.get).toBeDefined();
    expect(networkService.post).toBeDefined();
  });

  test('should define service container interface', () => {
    const serviceContainer: IServiceContainer = {
      register: jest.fn(),
      get: jest.fn(),
      has: jest.fn(),
      clear: jest.fn()
    };

    expect(serviceContainer.register).toBeDefined();
    expect(serviceContainer.get).toBeDefined();
  });

  test('should define core services interface', () => {
    const coreServices: ICoreServices = {
      cache: {} as ICacheServiceManager,
      websocket: {} as IWebSocketService,
      auth: {} as IAuthService,
      theme: {} as IThemeService,
      services: {} as ILoggerService,
      network: {} as INetworkService,
      container: {} as IServiceContainer
    };

    expect(coreServices.cache).toBeDefined();
    expect(coreServices.websocket).toBeDefined();
  });

  test('should define data types', () => {
    const cacheEntry: CacheEntry<string> = {
      key: 'test',
      value: 'test-value',
      timestamp: Date.now(),
      size: 10
    };

    const cacheStats: CacheStats = {
      size: 100,
      hits: 80,
      misses: 20,
      hitRate: 0.8,
      memoryUsage: 1024,
      evictions: 5,
      sets: 50,
      gets: 100,
      deletes: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const cacheConfig: CacheConfig = {
      maxSize: 1000,
      defaultTtl: 3600000,
      strategy: 'lru',
      enableMetrics: true
    };

    expect(cacheEntry.key).toBe('test');
    expect(cacheStats.hitRate).toBe(0.8);
    expect(cacheConfig.strategy).toBe('lru');
  });

  test('should define WebSocket types', () => {
    const webSocketMessage: WebSocketMessage = {
      type: 'test',
      data: { content: 'test' },
      timestamp: Date.now(),
      id: 'test-id'
    };

    const webSocketConfig: WebSocketConfig = {
      url: 'ws://localhost:3001',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      timeout: 10000,
      protocols: ['json']
    };

    expect(webSocketMessage.type).toBe('test');
    expect(webSocketConfig.url).toBe('ws://localhost:3001');
  });

  test('should define auth types', () => {
    const authCredentials: AuthCredentials = {
      email: 'test@example.com',
      password: 'password',
      rememberMe: true
    };

    const authUser: AuthUser = {
      id: 'user-1',
      email: 'test@example.com',
      username: 'testuser',
      roles: ['user'],
      permissions: ['read'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const authToken: AuthToken = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: new Date(),
      tokenType: 'Bearer'
    };

    const authSession: AuthSession = {
      user: authUser,
      token: authToken,
      provider: 'local',
      createdAt: new Date(),
      expiresAt: new Date(),
      isActive: true
    };

    const authResult: AuthResult<AuthSession> = {
      success: true,
      data: authSession
    };

    expect(authCredentials.email).toBe('test@example.com');
    expect(authUser.roles).toContain('user');
    expect(authResult.success).toBe(true);
  });

  test('should define theme types', () => {
    const themeConfig: ThemeConfig = {
      name: 'default',
      colors: { primary: '#blue' },
      typography: { fontFamily: 'Arial' },
      spacing: { sm: '4px' },
      shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' }
    };

    const themeTokens: ThemeTokens = {
      colors: { primary: '#blue' },
      typography: { fontFamily: 'Arial' },
      spacing: { sm: '4px' },
      shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' },
      breakpoints: { sm: '640px' },
      radius: { sm: '4px' }
    };

    const enhancedTheme: EnhancedTheme = {
      ...themeTokens,
      getSpacing: jest.fn(),
      getColor: jest.fn(),
      getTypography: jest.fn()
    };

    expect(themeConfig.name).toBe('default');
    expect(enhancedTheme.getSpacing).toBeDefined();
  });

  test('should define API types', () => {
    const apiResponse: ApiResponse<string> = {
      data: 'success',
      success: true,
      message: 'Operation completed',
      status: 200,
      headers: { 'content-type': 'application/json' }
    };

    const apiError: ApiError = {
      message: 'Request failed',
      status: 400,
      code: 'BAD_REQUEST',
      details: { field: 'email' }
    };

    expect(apiResponse.success).toBe(true);
    expect(apiError.status).toBe(400);
  });

  test('should define service config types', () => {
    const serviceConfig: IServiceConfig = {
      level: 'info' as any,
      enableConsole: true,
      enableFile: false,
      enableRemote: false
    };

    expect(serviceConfig.enableConsole).toBe(true);
  });

  test('should define DI types', () => {
    const serviceIdentifier: ServiceIdentifier = 'test-service';
    const serviceFactory: ServiceFactory<string> = () => 'test';
    const serviceDescriptor: ServiceDescriptor<string> = {
      identifier: serviceIdentifier,
      factory: serviceFactory,
      singleton: true,
      dependencies: ['dep1', 'dep2']
    };

    expect(serviceIdentifier).toBe('test-service');
    expect(serviceFactory()).toBe('test');
    expect(serviceDescriptor.singleton).toBe(true);
  });

  test('should define core config types', () => {
    const coreConfig: CoreConfig = {
      cache: { maxSize: 1000 },
      websocket: { url: 'ws://localhost:3001' },
      theme: { name: 'default' },
      network: { timeout: 5000 },
      services: { enableConsole: true }
    };

    expect(coreConfig.cache?.maxSize).toBe(1000);
    expect(coreConfig.websocket?.url).toBe('ws://localhost:3001');
  });

  test('should define event and status types', () => {
    const coreSystemEvent: CoreSystemEvent = {
      type: 'test-event',
      payload: { data: 'test' },
      timestamp: new Date()
    };

    const coreSystemStatus: CoreSystemStatus = {
      initialized: true,
      services: { cache: true, websocket: false },
      errors: [],
      lastUpdated: new Date()
    };

    expect(coreSystemEvent.type).toBe('test-event');
    expect(coreSystemStatus.initialized).toBe(true);
  });
});
