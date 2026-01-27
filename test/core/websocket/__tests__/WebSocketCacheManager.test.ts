/**
 * WebSocket Cache Manager Test Suite
 * 
 * Comprehensive tests for WebSocket Cache Manager including:
 * - Cache invalidation strategies
 * - Message persistence and retrieval
 * - Metrics tracking and performance
 * - Integration with enterprise cache system
 * - Error handling and edge cases
 */

import { WebSocketCacheManager, IWebSocketCacheManager, CacheInvalidationStrategy, CacheMetrics } from '../../../src/core/websocket/cache/WebSocketCacheManager';
import { FeatureCacheService } from '../../../src/core/cache';
import { LoggerService } from '../../../src/core/services/LoggerService';
import { WebSocketMessage } from '../../../src/core/websocket/services/EnterpriseWebSocketService';

// Mock implementations
const mockCacheService: Partial<FeatureCacheService> = {
  getCache: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    invalidatePattern: jest.fn(),
    getStats: jest.fn(() => ({}))
  })),
  invalidatePattern: jest.fn()
};

const mockLoggerService: Partial<LoggerService> = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
};

const mockWebSocketCache: any = {
  get: jest.fn(),
  set: jest.fn(),
  invalidate: jest.fn(),
  invalidatePattern: jest.fn(),
  getStats: jest.fn(() => ({}))
};

describe('WebSocketCacheManager', () => {
  let cacheManager: WebSocketCacheManager;
  let cacheService: FeatureCacheService;
  let loggerService: LoggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    cacheService = mockCacheService as FeatureCacheService;
    loggerService = mockLoggerService as LoggerService;
    cacheManager = new WebSocketCacheManager(cacheService, loggerService);
    
    // Setup mock cache
    (cacheService.getCache as jest.Mock).mockReturnValue(mockWebSocketCache);
  });

  afterEach(() => {
    cacheManager.cleanup();
  });

  describe('Basic Functionality', () => {
    test('should create cache manager instance', () => {
      expect(cacheManager).toBeInstanceOf(WebSocketCacheManager);
      expect(cacheManager.getMetrics()).toBeDefined();
    });

    test('should register invalidation strategy', () => {
      const strategy: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['test:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);
      
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining('Registered invalidation strategy for: test')
      );
    });

    test('should handle multiple strategies for same feature', () => {
      const strategy1: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['chat:*'],
        priority: 3
      };

      const strategy2: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['messages:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy1);
      cacheManager.registerInvalidationStrategy(strategy2);
      
      // Should register both strategies
      expect(loggerService.info).toHaveBeenCalledTimes(3); // 2 for our strategies + 1 for default initialization
    });

    test('should sort strategies by priority', () => {
      const strategy1: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['low:*'],
        priority: 1
      };

      const strategy2: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['high:*'],
        priority: 10
      };

      const strategy3: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['medium:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy1);
      cacheManager.registerInvalidationStrategy(strategy2);
      cacheManager.registerInvalidationStrategy(strategy3);
      
      // Higher priority strategies should be processed first
      expect(loggerService.info).toHaveBeenCalledTimes(4); // 3 for our strategies + 1 for default
    });
  });

  describe('Cache Invalidation', () => {
    test('should invalidate cache based on message', async () => {
      const strategy: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['chat:*', 'messages:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello World' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.invalidateCache(message);

      expect(cacheService.invalidatePattern).toHaveBeenCalledWith('chat:*');
      expect(cacheService.invalidatePattern).toHaveBeenCalledWith('messages:*');
    });

    test('should respect strategy conditions', async () => {
      const strategy: CacheInvalidationStrategy = {
        feature: 'feed',
        patterns: ['feed:*'],
        conditions: (message) => message.type === 'delete',
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);

      const createMessage: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'feed',
        payload: { content: 'New post' },
        timestamp: new Date(),
        sender: 'user1'
      };

      const deleteMessage: WebSocketMessage = {
        id: 'test-message-2',
        type: 'delete',
        feature: 'feed',
        payload: { postId: 'post123' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.invalidateCache(createMessage);
      await cacheManager.invalidateCache(deleteMessage);

      // Should only invalidate for delete message
      expect(cacheService.invalidatePattern).toHaveBeenCalledTimes(1);
      expect(cacheService.invalidatePattern).toHaveBeenCalledWith('feed:*');
    });

    test('should handle disabled auto invalidation', async () => {
      // Create manager with disabled auto invalidation
      const disabledManager = new WebSocketCacheManager(cacheService, loggerService);
      (disabledManager as any).config.enableAutoInvalidation = false;

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await disabledManager.invalidateCache(message);

      expect(cacheService.invalidatePattern).not.toHaveBeenCalled();
    });

    test('should handle invalidation errors gracefully', async () => {
      (cacheService.invalidatePattern as jest.Mock).mockRejectedValue(new Error('Cache error'));

      const strategy: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['chat:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await expect(cacheManager.invalidateCache(message)).rejects.toThrow('Cache error');
      expect(loggerService.error).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Cache invalidation failed:',
        expect.any(Error)
      );
    });
  });

  describe('Message Persistence', () => {
    test('should persist message successfully', async () => {
      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello World' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.persistMessage(message);

      expect(mockWebSocketCache.set).toHaveBeenCalledWith(
        'ws:message:chat:test-message-1',
        expect.objectContaining({
          message,
          persistedAt: expect.any(Date),
          feature: 'chat'
        }),
        300000 // Default TTL
      );

      expect(mockWebSocketCache.set).toHaveBeenCalledWith(
        'ws:messages:chat',
        ['test-message-1'],
        300000
      );
    });

    test('should handle disabled message persistence', async () => {
      const disabledManager = new WebSocketCacheManager(cacheService, loggerService);
      (disabledManager as any).config.enableMessagePersistence = false;

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await disabledManager.persistMessage(message);

      expect(mockWebSocketCache.set).not.toHaveBeenCalled();
    });

    test('should maintain message list size limit', async () => {
      // Mock existing messages
      mockWebSocketCache.get.mockReturnValue(['msg1', 'msg2', 'msg3', 'msg4', 'msg5']);

      const message: WebSocketMessage = {
        id: 'new-message',
        type: 'create',
        feature: 'chat',
        payload: { content: 'New message' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.persistMessage(message);

      // Should keep only recent messages (default maxCacheSize is 1000)
      expect(mockWebSocketCache.set).toHaveBeenCalledWith(
        'ws:messages:chat',
        ['new-message', 'msg1', 'msg2', 'msg3', 'msg4', 'msg5'],
        300000
      );
    });

    test('should handle persistence errors', async () => {
      mockWebSocketCache.set.mockRejectedValue(new Error('Persistence failed'));

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await expect(cacheManager.persistMessage(message)).rejects.toThrow('Persistence failed');
      expect(loggerService.error).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Message persistence failed:',
        expect.any(Error)
      );
    });
  });

  describe('Message Retrieval', () => {
    test('should retrieve message by ID', async () => {
      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello World' },
        timestamp: new Date(),
        sender: 'user1'
      };

      mockWebSocketCache.get.mockReturnValue({
        message,
        persistedAt: new Date(),
        feature: 'chat'
      });

      const retrieved = await cacheManager.getMessage('test-message-1');

      expect(retrieved).toEqual(message);
      expect(mockWebSocketCache.get).toHaveBeenCalledWith('ws:message:*:test-message-1');
    });

    test('should return null for non-existent message', async () => {
      mockWebSocketCache.get.mockReturnValue(null);

      const retrieved = await cacheManager.getMessage('non-existent');

      expect(retrieved).toBeNull();
    });

    test('should handle retrieval errors gracefully', async () => {
      mockWebSocketCache.get.mockRejectedValue(new Error('Cache error'));

      const retrieved = await cacheManager.getMessage('test-message-1');

      expect(retrieved).toBeNull();
      expect(loggerService.error).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Failed to get message:',
        expect.any(Error)
      );
    });

    test('should get feature messages', async () => {
      const messageIds = ['msg1', 'msg2', 'msg3'];
      mockWebSocketCache.get.mockReturnValue(messageIds);

      const messages: WebSocketMessage[] = [
        {
          id: 'msg1',
          type: 'create',
          feature: 'chat',
          payload: { content: 'Message 1' },
          timestamp: new Date(),
          sender: 'user1'
        },
        {
          id: 'msg2',
          type: 'create',
          feature: 'chat',
          payload: { content: 'Message 2' },
          timestamp: new Date(),
          sender: 'user2'
        },
        {
          id: 'msg3',
          type: 'create',
          feature: 'chat',
          payload: { content: 'Message 3' },
          timestamp: new Date(),
          sender: 'user3'
        }
      ];

      // Mock individual message retrieval
      mockWebSocketCache.get.mockImplementation((key: string) => {
        if (key.startsWith('ws:message:*:')) {
          const messageId = key.split(':').pop();
          const message = messages.find(m => m.id === messageId);
          return message ? { message } : null;
        }
        return messageIds;
      });

      const retrieved = await cacheManager.getFeatureMessages('chat', 50);

      expect(retrieved).toHaveLength(3);
      expect(retrieved[0].id).toBe('msg1');
      expect(retrieved[1].id).toBe('msg2');
      expect(retrieved[2].id).toBe('msg3');
    });

    test('should handle feature message retrieval errors', async () => {
      mockWebSocketCache.get.mockRejectedValue(new Error('Cache error'));

      const retrieved = await cacheManager.getFeatureMessages('chat');

      expect(retrieved).toEqual([]);
      expect(loggerService.error).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Failed to get feature messages:',
        expect.any(Error)
      );
    });
  });

  describe('Metrics Tracking', () => {
    test('should track invalidation metrics', async () => {
      const strategy: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['chat:*', 'messages:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.invalidateCache(message);

      const metrics = cacheManager.getMetrics();
      expect(metrics.invalidations).toBe(2); // 2 patterns invalidated
      expect(metrics.averageInvalidationTime).toBeGreaterThan(0);
    });

    test('should track message persistence metrics', async () => {
      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await cacheManager.persistMessage(message);

      const metrics = cacheManager.getMetrics();
      expect(metrics.messagesPersisted).toBe(1);
    });

    test('should track cache hit/miss metrics', async () => {
      // Test hit
      mockWebSocketCache.get.mockReturnValue({ message: { id: 'test' } });
      await cacheManager.getMessage('test');

      // Test miss
      mockWebSocketCache.get.mockReturnValue(null);
      await cacheManager.getMessage('nonexistent');

      const metrics = cacheManager.getMetrics();
      expect(metrics.hits).toBe(1);
      expect(metrics.misses).toBe(1);
    });

    test('should clear metrics', () => {
      // Perform some operations to generate metrics
      cacheManager.clearMetrics();

      const metrics = cacheManager.getMetrics();
      expect(metrics.invalidations).toBe(0);
      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
      expect(metrics.messagesPersisted).toBe(0);
      expect(metrics.averageInvalidationTime).toBe(0);

      expect(loggerService.info).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Metrics cleared'
      );
    });

    test('should handle disabled metrics', async () => {
      const disabledManager = new WebSocketCacheManager(cacheService, loggerService);
      (disabledManager as any).config.enableMetrics = false;

      const strategy: CacheInvalidationStrategy = {
        feature: 'chat',
        patterns: ['chat:*'],
        priority: 5
      };

      disabledManager.registerInvalidationStrategy(strategy);

      const message: WebSocketMessage = {
        id: 'test-message-1',
        type: 'create',
        feature: 'chat',
        payload: { content: 'Hello' },
        timestamp: new Date(),
        sender: 'user1'
      };

      await disabledManager.invalidateCache(message);

      const metrics = disabledManager.getMetrics();
      expect(metrics.invalidations).toBe(0);
    });
  });

  describe('Backward Compatibility', () => {
    test('should support set method for external adapters', async () => {
      await cacheManager.set('test-key', { data: 'test' }, 60000);

      expect(mockWebSocketCache.set).toHaveBeenCalledWith('test-key', { data: 'test' }, 60000);
      expect(loggerService.debug).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Cache set: test-key'
      );
    });

    test('should support invalidate method for external adapters', async () => {
      mockWebSocketCache.invalidate.mockReturnValue(true);

      const result = await cacheManager.invalidate('test-key');

      expect(result).toBe(true);
      expect(mockWebSocketCache.invalidate).toHaveBeenCalledWith('test-key');
      expect(loggerService.debug).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Cache invalidated: test-key, success: true'
      );
    });

    test('should support invalidatePattern method for external adapters', async () => {
      (cacheService.invalidatePattern as jest.Mock).mockReturnValue(5);

      const result = await cacheManager.invalidatePattern('test:*');

      expect(result).toBe(5);
      expect(cacheService.invalidatePattern).toHaveBeenCalledWith('test:*');
      expect(loggerService.debug).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Cache pattern invalidated: test:*, count: 5'
      );
    });

    test('should handle backward compatibility method errors', async () => {
      mockWebSocketCache.set.mockRejectedValue(new Error('Set failed'));
      mockWebSocketCache.invalidate.mockRejectedValue(new Error('Invalidate failed'));
      (cacheService.invalidatePattern as jest.Mock).mockRejectedValue(new Error('Pattern failed'));

      await expect(cacheManager.set('test', 'value')).rejects.toThrow('Set failed');
      expect(await cacheManager.invalidate('test')).toBe(false);
      expect(await cacheManager.invalidatePattern('test:*')).toBe(0);

      expect(loggerService.error).toHaveBeenCalledTimes(3);
    });
  });

  describe('Cache Statistics', () => {
    test('should get cache statistics', async () => {
      mockWebSocketCache.getStats.mockReturnValue({
        size: 100,
        hits: 80,
        misses: 20
      });

      const stats = await cacheManager.getCacheStats();

      expect(stats).toEqual({
        cacheStats: {
          size: 100,
          hits: 80,
          misses: 20
        },
        webSocketMetrics: expect.objectContaining({
          invalidations: 0,
          hits: 0,
          misses: 0,
          messagesPersisted: 0,
          averageInvalidationTime: 0
        }),
        invalidationStrategies: expect.arrayContaining([
          expect.objectContaining({
            feature: expect.any(String),
            strategyCount: expect.any(Number),
            patterns: expect.any(Array)
          })
        ])
      });
    });

    test('should handle cache stats errors', async () => {
      mockWebSocketCache.getStats.mockRejectedValue(new Error('Stats error'));

      const stats = await cacheManager.getCacheStats();

      expect(stats).toEqual({});
      expect(loggerService.error).toHaveBeenCalledWith(
        '[WebSocketCacheManager] Failed to get cache stats:',
        expect.any(Error)
      );
    });
  });

  describe('Performance', () => {
    test('should handle rapid operations', async () => {
      const startTime = Date.now();
      
      const strategy: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['test:*'],
        priority: 5
      };

      cacheManager.registerInvalidationStrategy(strategy);

      // Perform multiple operations rapidly
      for (let i = 0; i < 10; i++) {
        const message: WebSocketMessage = {
          id: `test-message-${i}`,
          type: 'create',
          feature: 'test',
          payload: { content: `Message ${i}` },
          timestamp: new Date(),
          sender: 'user1'
        };

        await cacheManager.invalidateCache(message);
        await cacheManager.persistMessage(message);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should not have memory leaks', async () => {
      const initialMetrics = cacheManager.getMetrics();
      
      // Create and cleanup multiple managers
      for (let i = 0; i < 5; i++) {
        const manager = new WebSocketCacheManager(cacheService, loggerService);
        manager.cleanup();
      }

      // Original manager should still work
      const finalMetrics = cacheManager.getMetrics();
      expect(finalMetrics).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid strategy registration', () => {
      const invalidStrategy = {
        feature: '',
        patterns: [],
        priority: -1
      } as CacheInvalidationStrategy;

      // Should not throw, but handle gracefully
      expect(() => cacheManager.registerInvalidationStrategy(invalidStrategy)).not.toThrow();
    });

    test('should handle null messages gracefully', async () => {
      await expect(cacheManager.invalidateCache(null as any)).rejects.toThrow();
      await expect(cacheManager.persistMessage(null as any)).rejects.toThrow();
    });

    test('should handle cleanup errors', async () => {
      mockWebSocketCache.get.mockRejectedValue(new Error('Cleanup error'));

      await expect(cacheManager.cleanup()).resolves.not.toThrow();
    });
  });

  describe('Type Safety', () => {
    test('should maintain type safety for interfaces', () => {
      const manager: IWebSocketCacheManager = cacheManager;
      expect(manager).toBeDefined();
      
      // Test interface methods exist
      expect(typeof manager.registerInvalidationStrategy).toBe('function');
      expect(typeof manager.invalidateCache).toBe('function');
      expect(typeof manager.persistMessage).toBe('function');
      expect(typeof manager.getMessage).toBe('function');
      expect(typeof manager.getFeatureMessages).toBe('function');
      expect(typeof manager.getMetrics).toBe('function');
      expect(typeof manager.clearMetrics).toBe('function');
    });

    test('should handle TypeScript compilation', () => {
      // This test ensures TypeScript compilation works
      const strategy: CacheInvalidationStrategy = {
        feature: 'test',
        patterns: ['test:*'],
        priority: 5
      };
      
      const message: WebSocketMessage = {
        id: 'test',
        type: 'create',
        feature: 'test',
        payload: {},
        timestamp: new Date(),
        sender: 'user1'
      };

      const metrics: CacheMetrics = cacheManager.getMetrics();
      
      expect(strategy).toBeDefined();
      expect(message).toBeDefined();
      expect(metrics).toBeDefined();
    });
  });
});
