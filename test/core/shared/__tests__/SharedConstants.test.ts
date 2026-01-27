/**
 * Shared Constants Test Suite
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
  HEALTH_CHECK_STATUS
} from '../../../src/core/shared/constants';

describe('Shared Constants', () => {
  test('should export CORE_CONSTANTS', () => {
    expect(CORE_CONSTANTS).toBeDefined();
    expect(CORE_CONSTANTS.INITIALIZATION_TIMEOUT).toBe(5000);
    expect(CORE_CONSTANTS.DEFAULT_CACHE_SIZE).toBe(1000);
  });

  test('should export CORE_STATUS enum', () => {
    expect(CORE_STATUS.UNINITIALIZED).toBe('uninitialized');
    expect(CORE_STATUS.INITIALIZED).toBe('initialized');
    expect(CORE_STATUS.ERROR).toBe('error');
  });

  test('should export CORE_EVENTS enum', () => {
    expect(CORE_EVENTS.SYSTEM_INITIALIZED).toBe('system:initialized');
    expect(CORE_EVENTS.SERVICE_CREATED).toBe('service:created');
    expect(CORE_EVENTS.WEBSOCKET_CONNECTED).toBe('websocket:connected');
  });

  test('should export SERVICE_PRIORITY enum', () => {
    expect(SERVICE_PRIORITY.CRITICAL).toBe(0);
    expect(SERVICE_PRIORITY.HIGH).toBe(1);
    expect(SERVICE_PRIORITY.NORMAL).toBe(2);
  });

  test('should export error codes and messages', () => {
    expect(CORE_ERROR_CODES.INITIALIZATION_FAILED).toBe('CORE_001');
    expect(CORE_ERROR_MESSAGES[CORE_ERROR_CODES.INITIALIZATION_FAILED])
      .toBe('Core system initialization failed');
  });

  test('should export service names', () => {
    expect(CORE_SERVICE_NAMES.CACHE).toBe('cache');
    expect(CORE_SERVICE_NAMES.WEBSOCKET).toBe('websocket');
  });

  test('should export default config', () => {
    expect(DEFAULT_CORE_CONFIG.cache.maxSize).toBe(1000);
    expect(DEFAULT_CORE_CONFIG.websocket.reconnectInterval).toBe(3000);
  });

  test('should export validation rules', () => {
    expect(CORE_VALIDATION_RULES.cache.maxSize.min).toBe(1);
    expect(CORE_VALIDATION_RULES.cache.maxSize.max).toBe(10000);
  });

  test('should export performance metrics', () => {
    expect(CORE_PERFORMANCE_METRICS.CACHE_HIT_RATE_TARGET).toBe(0.8);
    expect(CORE_PERFORMANCE_METRICS.WEBSOCKET_CONNECTION_TIME_TARGET).toBe(5000);
  });

  test('should export environment variables', () => {
    expect(CORE_ENVIRONMENT_VARIABLES.NODE_ENV).toBe('NODE_ENV');
    expect(CORE_ENVIRONMENT_VARIABLES.CORE_LOG_LEVEL).toBe('CORE_LOG_LEVEL');
  });

  test('should export health check status', () => {
    expect(HEALTH_CHECK_STATUS.HEALTHY).toBe('healthy');
    expect(HEALTH_CHECK_STATUS.UNHEALTHY).toBe('unhealthy');
  });
});
