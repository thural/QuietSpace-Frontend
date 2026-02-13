/**
 * Integration Tests for Logging System
 * 
 * Tests the complete logging system integration with real components
 */

import { getLogger, configureLogging, shutdownLogging } from '../index';
import { getLoggingConfig } from '../config/config-loader';

describe('Logging System Integration', () => {
  beforeAll(async () => {
    // Configure logging system for tests
    const config = getLoggingConfig();
    configureLogging(config);
  });

  afterAll(async () => {
    // Cleanup
    await shutdownLogging();
  });

  describe('Basic Logging Integration', () => {
    it('should create and use loggers', () => {
      const logger = getLogger('test.integration');
      
      expect(logger).toBeDefined();
      expect(logger.category).toBe('test.integration');
      expect(logger.isEnabled('INFO')).toBe(true);
    });

    it('should log messages without errors', () => {
      const logger = getLogger('test.integration');
      
      expect(() => {
        logger.info('Test message');
        logger.warn('Test warning');
        logger.error('Test error');
      }).not.toThrow();
    });

    it('should handle structured context', () => {
      const logger = getLogger('test.integration');
      
      expect(() => {
        logger.info(
          {
            userId: 'test-user',
            action: 'test-action',
            component: 'test-component'
          },
          'Test message with context'
        );
      }).not.toThrow();
    });
  });

  describe('Performance Integration', () => {
    it('should handle performance monitoring', () => {
      const logger = getLogger('test.performance');
      
      expect(() => {
        const result = logger.withPerformanceMonitoring(
          () => {
            // Simulate some work
            let sum = 0;
            for (let i = 0; i < 1000; i++) {
              sum += i;
            }
            return sum;
          },
          'test-operation'
        );
        
        expect(typeof result).toBe('number');
        expect(result).toBe(499500); // Sum of 0 to 999
      }).not.toThrow();
    });

    it('should handle async performance monitoring', async () => {
      const logger = getLogger('test.performance');
      
      expect(async () => {
        const result = await logger.withPerformanceMonitoringAsync(
          async () => {
            // Simulate async work
            return new Promise(resolve => {
              setTimeout(() => resolve('test-result'), 100);
            });
          },
          'test-async-operation'
        );
        
        expect(result).toBe('test-result');
      }).not.toThrow();
    });
  });

  describe('Configuration Integration', () => {
    it('should load configuration based on environment', () => {
      const config = getLoggingConfig();
      
      expect(config).toBeDefined();
      expect(config.defaultLevel).toBeDefined();
      expect(config.loggers).toBeDefined();
      expect(config.appenders).toBeDefined();
    });

    it('should validate configuration', () => {
      const config = getLoggingConfig();
      
      // This should not throw for valid configuration
      expect(() => {
        configureLogging(config);
      }).not.toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle authentication logging', () => {
      const authLogger = getLogger('app.auth');
      
      expect(() => {
        authLogger.info(
          {
            userId: 'user123',
            action: 'login_attempt',
            component: 'AuthService'
          },
          'User login attempt for user {}',
          'user123'
        );
        
        authLogger.security(
          {
            userId: 'user123',
            action: 'login_success',
            component: 'AuthService'
          },
          'User {} successfully logged in',
          'user123'
        );
      }).not.toThrow();
    });

    it('should handle WebSocket logging', () => {
      const wsLogger = getLogger('app.websocket');
      
      expect(() => {
        wsLogger.info(
          {
            component: 'WebSocketService',
            action: 'connection_established'
          },
          'WebSocket connection established'
        );
        
        wsLogger.warn(
          {
            component: 'WebSocketService',
            action: 'connection_lost'
          },
          'WebSocket connection lost'
        );
      }).not.toThrow();
    });

    it('should handle component logging', () => {
      const componentLogger = getLogger('app.components.PostList');
      
      expect(() => {
        componentLogger.info(
          {
            component: 'PostList',
            action: 'render',
            additionalData: {
              postCount: 10
            }
          },
          'Component rendered with {} posts',
          10
        );
        
        componentLogger.metrics(
          {
            component: 'PostList',
            action: 'post_clicked',
            additionalData: {
              postId: 'post123'
            }
          },
          'Post clicked: {}',
          'post123'
        );
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle logging errors gracefully', () => {
      const logger = getLogger('test.errors');
      
      expect(() => {
        // This should not throw
        logger.error(
          {
            component: 'TestComponent',
            action: 'error_test'
          },
          'Test error message',
          new Error('Test error')
        );
      }).not.toThrow();
    });

    it('should handle invalid context gracefully', () => {
      const logger = getLogger('test.errors');
      
      expect(() => {
        // This should not throw even with invalid context
        logger.info(
          {
            component: 'TestComponent',
            action: 'invalid_test',
            invalidField: 'should not cause error'
          },
          'Test message with invalid context'
        );
      }).not.toThrow();
    });
  });
});
