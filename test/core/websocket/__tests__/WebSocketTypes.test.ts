/**
 * WebSocket Types Test Suite
 * 
 * Comprehensive tests for WebSocket type definitions including:
 * - Type definitions and interfaces
 * - Type guards and validation
 * - Default configurations
 * - Type safety and compilation
 * - Edge cases and error scenarios
 */

import {
  WebSocketFeatureConfig,
  WebSocketServiceConfig,
  WebSocketConnectionConfig,
  WebSocketMessageConfig,
  WebSocketCacheConfig,
  WebSocketEvent,
  WebSocketConnectionEvent,
  WebSocketMessageEvent,
  WebSocketFeatureEvent,
  WebSocketHealthEvent,
  WebSocketState,
  WebSocketMetrics,
  FeatureMetrics,
  UseEnterpriseWebSocketOptions,
  UseFeatureWebSocketOptions,
  WebSocketConnectionState,
  WebSocketError,
  WebSocketConnectionError,
  WebSocketMessageError,
  WebSocketAuthenticationError,
  WebSocketRateLimitError,
  MessageValidationRule,
  MessageValidationResult,
  WebSocketHealthCheck,
  WebSocketMonitoringConfig,
  WebSocketIntegrationConfig,
  WebSocketEventListener,
  WebSocketEventHandler,
  WebSocketFeatureHandler,
  WebSocketConnectionInfo,
  isWebSocketError,
  isConnectionError,
  isMessageError,
  isAuthenticationError,
  isRateLimitError,
  DEFAULT_WEBSOCKET_CONFIG,
  DEFAULT_CONNECTION_CONFIG,
  DEFAULT_MESSAGE_CONFIG,
  DEFAULT_CACHE_CONFIG
} from '../../../src/core/websocket/types/WebSocketTypes';

describe('WebSocket Types', () => {
  describe('Configuration Types', () => {
    test('should define WebSocketFeatureConfig', () => {
      const config: WebSocketFeatureConfig = {
        name: 'chat',
        enabled: true,
        priority: 1,
        maxConnections: 5,
        heartbeatInterval: 30000,
        reconnectAttempts: 3,
        messageValidation: true,
        cacheInvalidation: true
      };

      expect(config.name).toBe('chat');
      expect(config.enabled).toBe(true);
      expect(config.priority).toBe(1);
    });

    test('should define WebSocketServiceConfig', () => {
      const config: WebSocketServiceConfig = {
        url: 'ws://localhost:3001',
        features: [
          {
            name: 'chat',
            enabled: true,
            priority: 1,
            maxConnections: 5,
            heartbeatInterval: 30000,
            reconnectAttempts: 3,
            messageValidation: true,
            cacheInvalidation: true
          }
        ],
        globalSettings: {
          enableMetrics: true,
          enableHealthChecks: true,
          enableCacheIntegration: true,
          logLevel: 'info'
        }
      };

      expect(config.url).toBe('ws://localhost:3001');
      expect(config.features).toHaveLength(1);
      expect(config.globalSettings.enableMetrics).toBe(true);
    });

    test('should define WebSocketConnectionConfig', () => {
      const config: WebSocketConnectionConfig = {
        token: 'test-token',
        autoConnect: true,
        autoReconnect: true,
        connectionTimeout: 10000,
        maxReconnectAttempts: 5,
        reconnectDelay: 1000,
        heartbeatInterval: 30000,
        enableMetrics: true
      };

      expect(config.token).toBe('test-token');
      expect(config.autoConnect).toBe(true);
      expect(config.connectionTimeout).toBe(10000);
    });

    test('should define WebSocketMessageConfig', () => {
      const config: WebSocketMessageConfig = {
        enableValidation: true,
        enableTransformation: false,
        maxMessageSize: 1024 * 1024,
        messageTimeout: 5000,
        retryAttempts: 3,
        deadLetterQueue: true
      };

      expect(config.enableValidation).toBe(true);
      expect(config.maxMessageSize).toBe(1024 * 1024);
      expect(config.retryAttempts).toBe(3);
    });

    test('should define WebSocketCacheConfig', () => {
      const config: WebSocketCacheConfig = {
        enableAutoInvalidation: true,
        enableMessagePersistence: true,
        defaultTTL: 300000,
        maxCacheSize: 1000,
        invalidationStrategies: []
      };

      expect(config.enableAutoInvalidation).toBe(true);
      expect(config.defaultTTL).toBe(300000);
      expect(config.invalidationStrategies).toEqual([]);
    });
  });

  describe('Event Types', () => {
    test('should define WebSocketEvent', () => {
      const event: WebSocketEvent<string> = {
        type: 'test-event',
        timestamp: new Date(),
        data: 'test-data',
        source: 'test-source',
        metadata: { key: 'value' }
      };

      expect(event.type).toBe('test-event');
      expect(event.data).toBe('test-data');
      expect(event.source).toBe('test-source');
      expect(event.metadata?.key).toBe('value');
    });

    test('should define WebSocketConnectionEvent', () => {
      const event: WebSocketConnectionEvent = {
        type: 'connection:opened',
        timestamp: new Date(),
        data: {
          connectionId: 'conn-123',
          feature: 'chat'
        },
        source: 'connection-manager'
      };

      expect(event.type).toBe('connection:opened');
      expect(event.data.connectionId).toBe('conn-123');
      expect(event.data.feature).toBe('chat');
    });

    test('should define WebSocketMessageEvent', () => {
      const event: WebSocketMessageEvent = {
        type: 'message:received',
        timestamp: new Date(),
        data: {
          message: {
            id: 'msg-123',
            type: 'chat',
            feature: 'chat',
            payload: { content: 'Hello' },
            timestamp: new Date(),
            sender: 'user1'
          }
        },
        source: 'message-router'
      };

      expect(event.type).toBe('message:received');
      expect(event.data.message.id).toBe('msg-123');
      expect(event.data.message.payload.content).toBe('Hello');
    });

    test('should define WebSocketFeatureEvent', () => {
      const event: WebSocketFeatureEvent = {
        type: 'feature:subscribed',
        timestamp: new Date(),
        data: {
          feature: 'chat',
          connectionId: 'conn-123'
        },
        source: 'feature-manager'
      };

      expect(event.type).toBe('feature:subscribed');
      expect(event.data.feature).toBe('chat');
      expect(event.data.connectionId).toBe('conn-123');
    });

    test('should define WebSocketHealthEvent', () => {
      const event: WebSocketHealthEvent = {
        type: 'health:passed',
        timestamp: new Date(),
        data: {
          connectionId: 'conn-123',
          health: {
            connectionId: 'conn-123',
            status: 'healthy',
            latency: 50,
            uptime: 10000,
            errorCount: 0,
            lastError: null,
            lastHealthCheck: new Date()
          }
        },
        source: 'health-monitor'
      };

      expect(event.type).toBe('health:passed');
      expect(event.data.connectionId).toBe('conn-123');
      expect(event.data.health.status).toBe('healthy');
    });
  });

  describe('State and Metrics Types', () => {
    test('should define WebSocketState', () => {
      const state: WebSocketState = {
        connections: new Map(),
        activeFeatures: new Set(['chat', 'notification']),
        metrics: {
          connections: {
            total: 5,
            active: 3,
            healthy: 2,
            unhealthy: 1
          },
          messages: {
            sent: 100,
            received: 95,
            failed: 5,
            queued: 2
          },
          performance: {
            averageLatency: 150,
            messageProcessingTime: 25,
            connectionUptime: 3600000
          },
          features: new Map()
        },
        config: DEFAULT_WEBSOCKET_CONFIG
      };

      expect(state.activeFeatures.has('chat')).toBe(true);
      expect(state.metrics.connections.total).toBe(5);
      expect(state.metrics.messages.sent).toBe(100);
    });

    test('should define FeatureMetrics', () => {
      const metrics: FeatureMetrics = {
        name: 'chat',
        messages: {
          sent: 50,
          received: 48,
          failed: 2
        },
        connections: {
          active: 2,
          total: 3
        },
        cache: {
          invalidations: 10,
          hits: 100,
          misses: 20
        }
      };

      expect(metrics.name).toBe('chat');
      expect(metrics.messages.sent).toBe(50);
      expect(metrics.connections.active).toBe(2);
      expect(metrics.cache.hits).toBe(100);
    });

    test('should define WebSocketConnectionState', () => {
      const state: WebSocketConnectionState = {
        isConnected: true,
        isConnecting: false,
        error: null,
        lastError: null,
        connectionState: 'connected'
      };

      expect(state.isConnected).toBe(true);
      expect(state.connectionState).toBe('connected');
      expect(state.error).toBeNull();
    });
  });

  describe('Hook Types', () => {
    test('should define UseEnterpriseWebSocketOptions', () => {
      const options: UseEnterpriseWebSocketOptions = {
        autoConnect: true,
        reconnectOnMount: false,
        enableMetrics: true,
        connectionTimeout: 15000
      };

      expect(options.autoConnect).toBe(true);
      expect(options.enableMetrics).toBe(true);
      expect(options.connectionTimeout).toBe(15000);
    });

    test('should define UseFeatureWebSocketOptions', () => {
      const options: UseFeatureWebSocketOptions = {
        feature: 'chat',
        autoConnect: true,
        priority: 2
      };

      expect(options.feature).toBe('chat');
      expect(options.priority).toBe(2);
    });
  });

  describe('Error Types', () => {
    test('should define WebSocketError', () => {
      const error: WebSocketError = {
        name: 'WebSocketError',
        message: 'Test error',
        code: 'TEST_ERROR',
        feature: 'chat',
        connectionId: 'conn-123',
        timestamp: new Date(),
        retryable: true
      };

      expect(error.code).toBe('TEST_ERROR');
      expect(error.feature).toBe('chat');
      expect(error.retryable).toBe(true);
    });

    test('should define WebSocketConnectionError', () => {
      const error: WebSocketConnectionError = {
        name: 'WebSocketConnectionError',
        message: 'Connection failed',
        code: 'CONNECTION_FAILED',
        timestamp: new Date(),
        retryable: true
      };

      expect(error.code).toBe('CONNECTION_FAILED');
      expect(error.retryable).toBe(true);
    });

    test('should define WebSocketMessageError', () => {
      const error: WebSocketMessageError = {
        name: 'WebSocketMessageError',
        message: 'Message too large',
        code: 'MESSAGE_TOO_LARGE',
        messageId: 'msg-123',
        timestamp: new Date(),
        retryable: false
      };

      expect(error.code).toBe('MESSAGE_TOO_LARGE');
      expect(error.messageId).toBe('msg-123');
      expect(error.retryable).toBe(false);
    });

    test('should define WebSocketAuthenticationError', () => {
      const error: WebSocketAuthenticationError = {
        name: 'WebSocketAuthenticationError',
        message: 'Authentication failed',
        code: 'AUTHENTICATION_FAILED',
        timestamp: new Date(),
        retryable: false
      };

      expect(error.code).toBe('AUTHENTICATION_FAILED');
      expect(error.retryable).toBe(false);
    });

    test('should define WebSocketRateLimitError', () => {
      const error: WebSocketRateLimitError = {
        name: 'WebSocketRateLimitError',
        message: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date(),
        retryable: true,
        retryAfter: 60
      };

      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.retryAfter).toBe(60);
      expect(error.retryable).toBe(true);
    });
  });

  describe('Validation Types', () => {
    test('should define MessageValidationRule', () => {
      const rule: MessageValidationRule = {
        field: 'content',
        required: true,
        type: 'string',
        minLength: 1,
        maxLength: 1000,
        pattern: /^[a-zA-Z0-9\s]+$/,
        custom: (value: any) => {
          return typeof value === 'string' && value.trim().length > 0;
        }
      };

      expect(rule.field).toBe('content');
      expect(rule.required).toBe(true);
      expect(rule.type).toBe('string');
      expect(rule.minLength).toBe(1);
      expect(rule.maxLength).toBe(1000);
    });

    test('should define MessageValidationResult', () => {
      const result: MessageValidationResult = {
        isValid: true,
        errors: [],
        warnings: ['Field is optional but recommended']
      };

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toContain('Field is optional but recommended');
    });
  });

  describe('Monitoring Types', () => {
    test('should define WebSocketHealthCheck', () => {
      const healthCheck: WebSocketHealthCheck = {
        connectionId: 'conn-123',
        timestamp: new Date(),
        status: 'healthy',
        metrics: {
          latency: 50,
          uptime: 3600000,
          messageRate: 10,
          errorRate: 0.01
        },
        issues: []
      };

      expect(healthCheck.connectionId).toBe('conn-123');
      expect(healthCheck.status).toBe('healthy');
      expect(healthCheck.metrics.latency).toBe(50);
      expect(healthCheck.issues).toEqual([]);
    });

    test('should define WebSocketMonitoringConfig', () => {
      const config: WebSocketMonitoringConfig = {
        enableHealthChecks: true,
        healthCheckInterval: 30000,
        enableMetrics: true,
        metricsInterval: 10000,
        enableAlerts: true,
        alertThresholds: {
          latency: 1000,
          errorRate: 0.05,
          connectionCount: 100
        }
      };

      expect(config.enableHealthChecks).toBe(true);
      expect(config.healthCheckInterval).toBe(30000);
      expect(config.alertThresholds.latency).toBe(1000);
    });
  });

  describe('Integration Types', () => {
    test('should define WebSocketIntegrationConfig', () => {
      const config: WebSocketIntegrationConfig = {
        features: ['chat', 'notification', 'feed'],
        services: {
          cache: true,
          logging: true,
          monitoring: true,
          analytics: false
        },
        hooks: {
          beforeConnect: async () => {},
          afterConnect: async () => {},
          beforeMessage: async (message) => message,
          afterMessage: async () => {}
        }
      };

      expect(config.features).toContain('chat');
      expect(config.services.cache).toBe(true);
      expect(config.hooks.beforeConnect).toBeDefined();
    });
  });

  describe('Utility Types', () => {
    test('should define WebSocketEventListener', () => {
      const listener: WebSocketEventListener = {
        onConnect: () => {},
        onDisconnect: (event: CloseEvent) => {},
        onMessage: (message) => {},
        onError: (error: Event) => {},
        onReconnect: (attempt: number) => {}
      };

      expect(listener.onConnect).toBeDefined();
      expect(listener.onMessage).toBeDefined();
      expect(listener.onError).toBeDefined();
    });

    test('should define WebSocketEventHandler', () => {
      const handler: WebSocketEventHandler<string> = (event: WebSocketEvent<string>) => {
        console.log(event.data);
      };

      expect(typeof handler).toBe('function');
    });

    test('should define WebSocketFeatureHandler', () => {
      const handler: WebSocketFeatureHandler = {
        feature: 'chat',
        handler: async (message) => {
          console.log('Processing message:', message);
        },
        validator: (message) => !!message.payload,
        transformer: (message) => ({ ...message, processed: true })
      };

      expect(handler.feature).toBe('chat');
      expect(handler.handler).toBeDefined();
      expect(handler.validator).toBeDefined();
      expect(handler.transformer).toBeDefined();
    });

    test('should define WebSocketConnectionInfo', () => {
      const info: WebSocketConnectionInfo = {
        id: 'conn-123',
        feature: 'chat',
        state: {
          isConnected: true,
          isConnecting: false,
          error: null,
          lastError: null,
          connectionState: 'connected'
        },
        metrics: {
          connectionUptime: 3600000,
          messagesSent: 50,
          messagesReceived: 48,
          lastError: null,
          averageLatency: 100
        },
        health: {
          connectionId: 'conn-123',
          status: 'healthy',
          latency: 50,
          uptime: 3600000,
          errorCount: 0,
          lastError: null,
          lastHealthCheck: new Date()
        },
        createdAt: new Date(),
        lastActivity: new Date()
      };

      expect(info.id).toBe('conn-123');
      expect(info.feature).toBe('chat');
      expect(info.state.isConnected).toBe(true);
      expect(info.health?.status).toBe('healthy');
    });
  });

  describe('Type Guards', () => {
    test('should identify WebSocketError', () => {
      const webSocketError: WebSocketError = {
        name: 'WebSocketError',
        message: 'Test error',
        code: 'TEST_ERROR',
        timestamp: new Date(),
        retryable: true
      };

      const regularError = new Error('Regular error');

      expect(isWebSocketError(webSocketError)).toBe(true);
      expect(isWebSocketError(regularError)).toBe(false);
      expect(isWebSocketError(null)).toBe(false);
      expect(isWebSocketError(undefined)).toBe(false);
    });

    test('should identify ConnectionError', () => {
      const connectionError: WebSocketConnectionError = {
        name: 'WebSocketConnectionError',
        message: 'Connection failed',
        code: 'CONNECTION_FAILED',
        timestamp: new Date(),
        retryable: true
      };

      const messageError: WebSocketMessageError = {
        name: 'WebSocketMessageError',
        message: 'Message failed',
        code: 'MESSAGE_TOO_LARGE',
        timestamp: new Date(),
        retryable: false
      };

      expect(isConnectionError(connectionError)).toBe(true);
      expect(isConnectionError(messageError)).toBe(false);
    });

    test('should identify MessageError', () => {
      const messageError: WebSocketMessageError = {
        name: 'WebSocketMessageError',
        message: 'Message too large',
        code: 'MESSAGE_TOO_LARGE',
        timestamp: new Date(),
        retryable: false
      };

      const connectionError: WebSocketConnectionError = {
        name: 'WebSocketConnectionError',
        message: 'Connection failed',
        code: 'CONNECTION_FAILED',
        timestamp: new Date(),
        retryable: true
      };

      expect(isMessageError(messageError)).toBe(true);
      expect(isMessageError(connectionError)).toBe(false);
    });

    test('should identify AuthenticationError', () => {
      const authError: WebSocketAuthenticationError = {
        name: 'WebSocketAuthenticationError',
        message: 'Auth failed',
        code: 'AUTHENTICATION_FAILED',
        timestamp: new Date(),
        retryable: false
      };

      const connectionError: WebSocketConnectionError = {
        name: 'WebSocketConnectionError',
        message: 'Connection failed',
        code: 'CONNECTION_FAILED',
        timestamp: new Date(),
        retryable: true
      };

      expect(isAuthenticationError(authError)).toBe(true);
      expect(isAuthenticationError(connectionError)).toBe(false);
    });

    test('should identify RateLimitError', () => {
      const rateLimitError: WebSocketRateLimitError = {
        name: 'WebSocketRateLimitError',
        message: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date(),
        retryable: true,
        retryAfter: 60
      };

      const connectionError: WebSocketConnectionError = {
        name: 'WebSocketConnectionError',
        message: 'Connection failed',
        code: 'CONNECTION_FAILED',
        timestamp: new Date(),
        retryable: true
      };

      expect(isRateLimitError(rateLimitError)).toBe(true);
      expect(isRateLimitError(connectionError)).toBe(false);
    });
  });

  describe('Default Configurations', () => {
    test('should provide default WebSocket config', () => {
      expect(DEFAULT_WEBSOCKET_CONFIG.url).toBe('ws://localhost:3001/ws');
      expect(DEFAULT_WEBSOCKET_CONFIG.features).toEqual([]);
      expect(DEFAULT_WEBSOCKET_CONFIG.globalSettings.enableMetrics).toBe(true);
      expect(DEFAULT_WEBSOCKET_CONFIG.globalSettings.logLevel).toBe('info');
    });

    test('should provide default connection config', () => {
      expect(DEFAULT_CONNECTION_CONFIG.token).toBe('');
      expect(DEFAULT_CONNECTION_CONFIG.autoConnect).toBe(false);
      expect(DEFAULT_CONNECTION_CONFIG.autoReconnect).toBe(true);
      expect(DEFAULT_CONNECTION_CONFIG.connectionTimeout).toBe(10000);
      expect(DEFAULT_CONNECTION_CONFIG.maxReconnectAttempts).toBe(5);
    });

    test('should provide default message config', () => {
      expect(DEFAULT_MESSAGE_CONFIG.enableValidation).toBe(true);
      expect(DEFAULT_MESSAGE_CONFIG.maxMessageSize).toBe(1024 * 1024);
      expect(DEFAULT_MESSAGE_CONFIG.messageTimeout).toBe(5000);
      expect(DEFAULT_MESSAGE_CONFIG.retryAttempts).toBe(3);
      expect(DEFAULT_MESSAGE_CONFIG.deadLetterQueue).toBe(true);
    });

    test('should provide default cache config', () => {
      expect(DEFAULT_CACHE_CONFIG.enableAutoInvalidation).toBe(true);
      expect(DEFAULT_CACHE_CONFIG.enableMessagePersistence).toBe(true);
      expect(DEFAULT_CACHE_CONFIG.defaultTTL).toBe(300000);
      expect(DEFAULT_CACHE_CONFIG.maxCacheSize).toBe(1000);
      expect(DEFAULT_CACHE_CONFIG.invalidationStrategies).toEqual([]);
    });
  });

  describe('Type Safety', () => {
    test('should handle TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const config: WebSocketFeatureConfig = {
        name: 'test',
        enabled: true,
        priority: 1,
        maxConnections: 5,
        heartbeatInterval: 30000,
        reconnectAttempts: 3,
        messageValidation: true,
        cacheInvalidation: true
      };

      const event: WebSocketEvent = {
        type: 'test',
        timestamp: new Date(),
        data: 'test',
        source: 'test'
      };

      const error: WebSocketError = {
        name: 'Test',
        message: 'Test',
        code: 'TEST',
        timestamp: new Date(),
        retryable: false
      };

      expect(config).toBeDefined();
      expect(event).toBeDefined();
      expect(error).toBeDefined();
    });

    test('should handle complex nested types', () => {
      const state: WebSocketState = {
        connections: new Map([
          ['conn1', {
            id: 'conn1',
            feature: 'chat',
            service: null as any,
            priority: 1,
            isActive: true,
            lastUsed: new Date(),
            healthScore: 100
          }]
        ]),
        activeFeatures: new Set(['chat']),
        metrics: {
          connections: { total: 1, active: 1, healthy: 1, unhealthy: 0 },
          messages: { sent: 10, received: 8, failed: 2, queued: 0 },
          performance: { averageLatency: 100, messageProcessingTime: 20, connectionUptime: 1000 },
          features: new Map([
            ['chat', {
              name: 'chat',
              messages: { sent: 10, received: 8, failed: 2 },
              connections: { active: 1, total: 1 },
              cache: { invalidations: 5, hits: 50, misses: 10 }
            }]
          ])
        },
        config: DEFAULT_WEBSOCKET_CONFIG
      };

      expect(state.connections.size).toBe(1);
      expect(state.activeFeatures.has('chat')).toBe(true);
      expect(state.metrics.connections.total).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty configurations', () => {
      const emptyConfig: WebSocketFeatureConfig = {
        name: '',
        enabled: false,
        priority: 0,
        maxConnections: 0,
        heartbeatInterval: 0,
        reconnectAttempts: 0,
        messageValidation: false,
        cacheInvalidation: false
      };

      expect(emptyConfig.name).toBe('');
      expect(emptyConfig.enabled).toBe(false);
    });

    test('should handle null and undefined values', () => {
      const event: WebSocketEvent = {
        type: 'test',
        timestamp: new Date(),
        data: null,
        source: 'test'
      };

      const eventWithUndefined: WebSocketEvent = {
        type: 'test',
        timestamp: new Date(),
        data: undefined,
        source: 'test'
      };

      expect(event.data).toBeNull();
      expect(eventWithUndefined.data).toBeUndefined();
    });

    test('should handle extreme values', () => {
      const config: WebSocketConnectionConfig = {
        token: '',
        autoConnect: true,
        autoReconnect: true,
        connectionTimeout: 0,
        maxReconnectAttempts: 999999,
        reconnectDelay: 0,
        heartbeatInterval: 0,
        enableMetrics: true
      };

      expect(config.maxReconnectAttempts).toBe(999999);
      expect(config.connectionTimeout).toBe(0);
    });
  });
});
