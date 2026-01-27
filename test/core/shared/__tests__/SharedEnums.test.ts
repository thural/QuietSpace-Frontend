/**
 * Shared Enums Test Suite
 */

import {
  WebSocketState,
  LogLevel,
  CacheStrategy,
  AuthProvider,
  ThemeVariant,
  ServiceStatus,
  NetworkStatus,
  CoreSystemStatus
} from '../../../src/core/shared/enums';

describe('Shared Enums', () => {
  test('should export WebSocketState enum', () => {
    expect(WebSocketState.DISCONNECTED).toBe('disconnected');
    expect(WebSocketState.CONNECTING).toBe('connecting');
    expect(WebSocketState.CONNECTED).toBe('connected');
    expect(WebSocketState.RECONNECTING).toBe('reconnecting');
    expect(WebSocketState.ERROR).toBe('error');
  });

  test('should export LogLevel enum', () => {
    expect(LogLevel.DEBUG).toBe('debug');
    expect(LogLevel.INFO).toBe('info');
    expect(LogLevel.WARN).toBe('warn');
    expect(LogLevel.ERROR).toBe('error');
  });

  test('should export CacheStrategy enum', () => {
    expect(CacheStrategy.LRU).toBe('lru');
    expect(CacheStrategy.FIFO).toBe('fifo');
    expect(CacheStrategy.LFU).toBe('lfu');
  });

  test('should export AuthProvider enum', () => {
    expect(AuthProvider.LOCAL).toBe('local');
    expect(AuthProvider.GOOGLE).toBe('google');
    expect(AuthProvider.GITHUB).toBe('github');
    expect(AuthProvider.MICROSOFT).toBe('microsoft');
  });

  test('should export ThemeVariant enum', () => {
    expect(ThemeVariant.LIGHT).toBe('light');
    expect(ThemeVariant.DARK).toBe('dark');
    expect(ThemeVariant.AUTO).toBe('auto');
  });

  test('should export ServiceStatus enum', () => {
    expect(ServiceStatus.INITIALIZING).toBe('initializing');
    expect(ServiceStatus.READY).toBe('ready');
    expect(ServiceStatus.ERROR).toBe('error');
    expect(ServiceStatus.STOPPING).toBe('stopping');
    expect(ServiceStatus.STOPPED).toBe('stopped');
  });

  test('should export NetworkStatus enum', () => {
    expect(NetworkStatus.ONLINE).toBe('online');
    expect(NetworkStatus.OFFLINE).toBe('offline');
    expect(NetworkStatus.CONNECTING).toBe('connecting');
    expect(NetworkStatus.ERROR).toBe('error');
  });

  test('should export CoreSystemStatus enum', () => {
    expect(CoreSystemStatus.INITIALIZING).toBe('initializing');
    expect(CoreSystemStatus.READY).toBe('ready');
    expect(CoreSystemStatus.ERROR).toBe('error');
    expect(CoreSystemStatus.SHUTTING_DOWN).toBe('shutting_down');
    expect(CoreSystemStatus.SHUTDOWN).toBe('shutdown');
  });

  test('should handle enum comparisons', () => {
    expect(WebSocketState.CONNECTED).not.toBe(WebSocketState.DISCONNECTED);
    expect(LogLevel.ERROR).not.toBe(LogLevel.DEBUG);
    expect(CacheStrategy.LRU).not.toBe(CacheStrategy.FIFO);
  });

  test('should handle enum type checking', () => {
    const validWebSocketState: WebSocketState = WebSocketState.CONNECTED;
    const validLogLevel: LogLevel = LogLevel.INFO;
    const validCacheStrategy: CacheStrategy = CacheStrategy.LRU;

    expect(validWebSocketState).toBeDefined();
    expect(validLogLevel).toBeDefined();
    expect(validCacheStrategy).toBeDefined();
  });

  test('should handle enum iteration', () => {
    const webSocketStates = Object.values(WebSocketState);
    const logLevels = Object.values(LogLevel);
    const cacheStrategies = Object.values(CacheStrategy);

    expect(webSocketStates).toContain('connected');
    expect(logLevels).toContain('info');
    expect(cacheStrategies).toContain('lru');
  });

  test('should handle enum reverse mapping', () => {
    expect(WebSocketState['connected']).toBe('CONNECTED');
    expect(LogLevel['info']).toBe('INFO');
    expect(CacheStrategy['lru']).toBe('LRU');
  });
});
