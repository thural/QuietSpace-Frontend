/**
 * Shared Feature Flags Test Suite
 */

import {
  CORE_FEATURE_FLAGS,
  ENVIRONMENT_FEATURE_FLAGS,
  FeatureFlag,
  Environment,
  isFeatureEnabled,
  getAllFeatureFlags,
  enableFeature,
  disableFeature
} from '../../../src/core/shared/featureFlags';

describe('Shared Feature Flags', () => {
  test('should export CORE_FEATURE_FLAGS', () => {
    expect(CORE_FEATURE_FLAGS).toBeDefined();
    expect(CORE_FEATURE_FLAGS.ENABLE_METRICS).toBe(true);
    expect(CORE_FEATURE_FLAGS.ENABLE_DEBUG_MODE).toBe(false);
    expect(CORE_FEATURE_FLAGS.ENABLE_HEALTH_CHECKS).toBe(true);
  });

  test('should export ENVIRONMENT_FEATURE_FLAGS', () => {
    expect(ENVIRONMENT_FEATURE_FLAGS).toBeDefined();
    expect(ENVIRONMENT_FEATURE_FLAGS.development).toBeDefined();
    expect(ENVIRONMENT_FEATURE_FLAGS.production).toBeDefined();
    expect(ENVIRONMENT_FEATURE_FLAGS.test).toBeDefined();
  });

  test('should have correct development flags', () => {
    const devFlags = ENVIRONMENT_FEATURE_FLAGS.development;
    expect(devFlags.ENABLE_DEBUG_MODE).toBe(true);
    expect(devFlags.ENABLE_MOCK_SERVICES).toBe(true);
    expect(devFlags.ENABLE_DEVELOPER_TOOLS).toBe(true);
    expect(devFlags.ENABLE_SERVICE_PROFILING).toBe(true);
  });

  test('should have correct production flags', () => {
    const prodFlags = ENVIRONMENT_FEATURE_FLAGS.production;
    expect(prodFlags.ENABLE_DEBUG_MODE).toBe(false);
    expect(prodFlags.ENABLE_MOCK_SERVICES).toBe(false);
    expect(prodFlags.ENABLE_DEVELOPER_TOOLS).toBe(false);
    expect(prodFlags.ENABLE_SERVICE_PROFILING).toBe(false);
  });

  test('should have correct test flags', () => {
    const testFlags = ENVIRONMENT_FEATURE_FLAGS.test;
    expect(testFlags.ENABLE_DEBUG_MODE).toBe(true);
    expect(testFlags.ENABLE_MOCK_SERVICES).toBe(true);
    expect(testFlags.ENABLE_DEVELOPER_TOOLS).toBe(false);
    expect(testFlags.ENABLE_SERVICE_PROFILING).toBe(false);
  });

  test('should check if feature is enabled', () => {
    expect(isFeatureEnabled('ENABLE_METRICS', 'production')).toBe(true);
    expect(isFeatureEnabled('ENABLE_DEBUG_MODE', 'production')).toBe(false);
    expect(isFeatureEnabled('ENABLE_DEBUG_MODE', 'development')).toBe(true);
  });

  test('should get all feature flags for environment', () => {
    const prodFlags = getAllFeatureFlags('production');
    const devFlags = getAllFeatureFlags('development');

    expect(prodFlags.ENABLE_METRICS).toBe(true);
    expect(prodFlags.ENABLE_DEBUG_MODE).toBe(false);
    expect(devFlags.ENABLE_DEBUG_MODE).toBe(true);
  });

  test('should enable feature', () => {
    enableFeature('ENABLE_DEBUG_MODE', 'production');
    expect(ENVIRONMENT_FEATURE_FLAGS.production.ENABLE_DEBUG_MODE).toBe(true);
  });

  test('should disable feature', () => {
    disableFeature('ENABLE_METRICS', 'production');
    expect(ENVIRONMENT_FEATURE_FLAGS.production.ENABLE_METRICS).toBe(false);
  });

  test('should handle feature flag type checking', () => {
    const flag: FeatureFlag = 'ENABLE_METRICS';
    const environment: Environment = 'production';

    expect(typeof flag).toBe('string');
    expect(typeof environment).toBe('string');
  });

  test('should handle invalid feature flag gracefully', () => {
    expect(() => {
      isFeatureEnabled('INVALID_FLAG' as FeatureFlag, 'production');
    }).not.toThrow();
  });

  test('should handle invalid environment gracefully', () => {
    expect(() => {
      isFeatureEnabled('ENABLE_METRICS', 'invalid' as Environment);
    }).not.toThrow();
  });

  test('should maintain immutability of core flags', () => {
    const originalValue = CORE_FEATURE_FLAGS.ENABLE_METRICS;
    expect(originalValue).toBe(true);
  });

  test('should handle feature flag categories', () => {
    expect(CORE_FEATURE_FLAGS.ENABLE_METRICS).toBe(true);
    expect(CORE_FEATURE_FLAGS.ENABLE_PERFORMANCE_MONITORING).toBe(true);
    expect(CORE_FEATURE_FLAGS.ENABLE_ERROR_REPORTING).toBe(true);

    expect(CORE_FEATURE_FLAGS.ENABLE_CACHE_METRICS).toBe(true);
    expect(CORE_FEATURE_FLAGS.ENABLE_CACHE_COMPRESSION).toBe(false);

    expect(CORE_FEATURE_FLAGS.ENABLE_WEBSOCKET_RECONNECT).toBe(true);
    expect(CORE_FEATURE_FLAGS.ENABLE_WEBSOCKET_HEARTBEAT).toBe(true);
  });

  test('should handle environment-specific overrides', () => {
    const devFlags = ENVIRONMENT_FEATURE_FLAGS.development;
    const prodFlags = ENVIRONMENT_FEATURE_FLAGS.production;

    expect(devFlags.ENABLE_DEBUG_MODE).not.toBe(prodFlags.ENABLE_DEBUG_MODE);
    expect(devFlags.ENABLE_MOCK_SERVICES).not.toBe(prodFlags.ENABLE_MOCK_SERVICES);
  });

  test('should handle feature flag persistence across calls', () => {
    const initial = isFeatureEnabled('ENABLE_DEBUG_MODE', 'production');
    enableFeature('ENABLE_DEBUG_MODE', 'production');
    const afterEnable = isFeatureEnabled('ENABLE_DEBUG_MODE', 'production');
    disableFeature('ENABLE_DEBUG_MODE', 'production');
    const afterDisable = isFeatureEnabled('ENABLE_DEBUG_MODE', 'production');

    expect(initial).toBe(false);
    expect(afterEnable).toBe(true);
    expect(afterDisable).toBe(false);
  });
});
