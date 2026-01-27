/**
 * Shared Index Test Suite
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
  CoreSystemStatus,

  // Enums
  WebSocketState,
  LogLevel,
  CacheStrategy,
  AuthProvider,
  ThemeVariant,
  ServiceStatus,
  NetworkStatus,
  CoreSystemStatus as CoreStatus,

  // Constants
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

  // Feature Flags
  CORE_FEATURE_FLAGS,
  ENVIRONMENT_FEATURE_FLAGS,
  FeatureFlag,
  Environment,
  isFeatureEnabled,
  getAllFeatureFlags,
  enableFeature,
  disableFeature
} from '../../../src/core/shared/index';

describe('Shared Index', () => {
  test('should export all types', () => {
    expect(ICacheService).toBeDefined();
    expect(IWebSocketService).toBeDefined();
    expect(IAuthService).toBeDefined();
    expect(IThemeService).toBeDefined();
    expect(ILoggerService).toBeDefined();
    expect(INetworkService).toBeDefined();
    expect(IServiceContainer).toBeDefined();
    expect(ICoreServices).toBeDefined();
  });

  test('should export all enums', () => {
    expect(WebSocketState).toBeDefined();
    expect(LogLevel).toBeDefined();
    expect(CacheStrategy).toBeDefined();
    expect(AuthProvider).toBeDefined();
    expect(ThemeVariant).toBeDefined();
    expect(ServiceStatus).toBeDefined();
    expect(NetworkStatus).toBeDefined();
    expect(CoreStatus).toBeDefined();
  });

  test('should export all constants', () => {
    expect(CORE_CONSTANTS).toBeDefined();
    expect(CORE_STATUS).toBeDefined();
    expect(CORE_EVENTS).toBeDefined();
    expect(SERVICE_PRIORITY).toBeDefined();
    expect(CORE_ERROR_CODES).toBeDefined();
    expect(CORE_ERROR_MESSAGES).toBeDefined();
    expect(CORE_SERVICE_NAMES).toBeDefined();
    expect(DEFAULT_CORE_CONFIG).toBeDefined();
    expect(CORE_VALIDATION_RULES).toBeDefined();
    expect(CORE_PERFORMANCE_METRICS).toBeDefined();
    expect(CORE_ENVIRONMENT_VARIABLES).toBeDefined();
    expect(HEALTH_CHECK_STATUS).toBeDefined();
  });

  test('should export all feature flags', () => {
    expect(CORE_FEATURE_FLAGS).toBeDefined();
    expect(ENVIRONMENT_FEATURE_FLAGS).toBeDefined();
    expect(isFeatureEnabled).toBeDefined();
    expect(getAllFeatureFlags).toBeDefined();
    expect(enableFeature).toBeDefined();
    expect(disableFeature).toBeDefined();
  });

  test('should export data types', () => {
    expect(CacheEntry).toBeDefined();
    expect(CacheStats).toBeDefined();
    expect(CacheConfig).toBeDefined();
    expect(WebSocketMessage).toBeDefined();
    expect(WebSocketConfig).toBeDefined();
    expect(AuthCredentials).toBeDefined();
    expect(AuthUser).toBeDefined();
    expect(AuthToken).toBeDefined();
    expect(AuthSession).toBeDefined();
    expect(AuthResult).toBeDefined();
    expect(ThemeConfig).toBeDefined();
    expect(ThemeTokens).toBeDefined();
    expect(EnhancedTheme).toBeDefined();
    expect(ApiResponse).toBeDefined();
    expect(ApiError).toBeDefined();
    expect(IServiceConfig).toBeDefined();
  });

  test('should export DI types', () => {
    expect(ServiceIdentifier).toBeDefined();
    expect(ServiceFactory).toBeDefined();
    expect(ServiceDescriptor).toBeDefined();
  });

  test('should export configuration types', () => {
    expect(CoreConfig).toBeDefined();
    expect(CoreSystemEvent).toBeDefined();
    expect(CoreSystemStatus).toBeDefined();
  });

  test('should handle type checking', () => {
    const serviceIdentifier: ServiceIdentifier = 'test-service';
    const featureFlag: FeatureFlag = 'ENABLE_METRICS';
    const environment: Environment = 'production';

    expect(typeof serviceIdentifier).toBe('string');
    expect(typeof featureFlag).toBe('string');
    expect(typeof environment).toBe('string');
  });

  test('should handle enum values', () => {
    expect(WebSocketState.CONNECTED).toBe('connected');
    expect(LogLevel.INFO).toBe('info');
    expect(CacheStrategy.LRU).toBe('lru');
    expect(AuthProvider.LOCAL).toBe('local');
    expect(ThemeVariant.LIGHT).toBe('light');
  });

  test('should handle constant values', () => {
    expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
    expect(CORE_CONSTANTS.DEFAULT_CACHE_SIZE).toBe(1000);
    expect(CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL).toBe(3000);
  });

  test('should handle feature flag operations', () => {
    expect(isFeatureEnabled('ENABLE_METRICS', 'production')).toBe(true);
    expect(getAllFeatureFlags('production')).toBeDefined();
    expect(typeof enableFeature).toBe('function');
    expect(typeof disableFeature).toBe('function');
  });

  test('should handle complex type combinations', () => {
    const cacheService: ICacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
      getStats: jest.fn()
    };

    const webSocketMessage: WebSocketMessage = {
      type: 'test',
      data: { content: 'test' },
      timestamp: Date.now(),
      id: 'test-id'
    };

    const authResult: AuthResult<AuthSession> = {
      success: true,
      data: {} as AuthSession
    };

    expect(cacheService.get).toBeDefined();
    expect(webSocketMessage.type).toBe('test');
    expect(authResult.success).toBe(true);
  });

  test('should handle configuration objects', () => {
    const cacheConfig: CacheConfig = {
      maxSize: 1000,
      defaultTtl: 3600000,
      strategy: 'lru',
      enableMetrics: true
    };

    const webSocketConfig: WebSocketConfig = {
      url: 'ws://localhost:3001',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5
    };

    const coreConfig: CoreConfig = {
      cache: cacheConfig,
      websocket: webSocketConfig
    };

    expect(cacheConfig.strategy).toBe('lru');
    expect(webSocketConfig.url).toBe('ws://localhost:3001');
    expect(coreConfig.cache).toBe(cacheConfig);
  });

  test('should handle error types', () => {
    const apiError: ApiError = {
      message: 'Test error',
      status: 400,
      code: 'TEST_ERROR',
      details: { field: 'test' }
    };

    const authError: AuthResult<void> = {
      success: false,
      error: {
        type: 'authentication',
        message: 'Auth failed',
        code: 'AUTH_FAILED'
      }
    };

    expect(apiError.status).toBe(400);
    expect(authError.success).toBe(false);
  });

  test('should handle service descriptor types', () => {
    const serviceDescriptor: ServiceDescriptor<string> = {
      identifier: 'test-service',
      factory: () => 'test-result',
      singleton: true,
      dependencies: ['dep1', 'dep2']
    };

    expect(serviceDescriptor.identifier).toBe('test-service');
    expect(serviceDescriptor.singleton).toBe(true);
    expect(serviceDescriptor.dependencies).toEqual(['dep1', 'dep2']);
  });

  test('should handle theme types', () => {
    const themeConfig: ThemeConfig = {
      name: 'default',
      colors: { primary: '#blue' },
      typography: { fontFamily: 'Arial' }
    };

    const themeTokens: ThemeTokens = {
      colors: { primary: '#blue' },
      typography: { fontFamily: 'Arial' },
      spacing: { sm: '4px' },
      shadows: { md: '0 4px 6px rgba(0,0,0,0.1)' },
      breakpoints: { sm: '640px' },
      radius: { sm: '4px' }
    };

    expect(themeConfig.name).toBe('default');
    expect(themeTokens.colors.primary).toBe('#blue');
  });

  test('should handle API response types', () => {
    const successResponse: ApiResponse<string> = {
      data: 'success',
      success: true,
      message: 'Operation completed',
      status: 200
    };

    const errorResponse: ApiResponse<void> = {
      success: false,
      error: 'Request failed',
      status: 400
    };

    expect(successResponse.success).toBe(true);
    expect(successResponse.data).toBe('success');
    expect(errorResponse.success).toBe(false);
  });

  test('should handle core system event types', () => {
    const coreEvent: CoreSystemEvent = {
      type: 'test-event',
      payload: { data: 'test' },
      timestamp: new Date()
    };

    const coreStatus: CoreSystemStatus = {
      initialized: true,
      services: { cache: true, websocket: false },
      errors: [],
      lastUpdated: new Date()
    };

    expect(coreEvent.type).toBe('test-event');
    expect(coreStatus.initialized).toBe(true);
  });
});
