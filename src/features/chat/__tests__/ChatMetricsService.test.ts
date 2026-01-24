/**
 * Chat Metrics Service Tests
 * 
 * Comprehensive test suite for ChatMetricsService
 * covering metrics collection, performance tracking, and analysis
 */

import { ChatMetricsService } from '@/features/chat/application/services/ChatMetricsService';
import { CacheProvider } from '@/core/cache';

describe('ChatMetricsService', () => {
  let metricsService: ChatMetricsService;
  let mockCache: jest.Mocked<CacheProvider>;

  beforeEach(() => {
    // Mock cache provider
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn().mockReturnValue({
        size: 100,
        hits: 80,
        misses: 20
      })
    } as any;

    metricsService = new ChatMetricsService(mockCache);
  });

  afterEach(() => {
    metricsService.resetMetrics();
  });

  describe('Query Metrics', () => {
    it('should record successful query metrics', () => {
      metricsService.recordQuery('getChats', 500, true, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.totalQueries).toBe(1);
      expect(metrics.queryMetrics.averageQueryTime).toBe(500);
      expect(metrics.queryMetrics.errorRate).toBe(0);
      expect(metrics.queryMetrics.cacheHitRate).toBe(0);
    });

    it('should record failed query metrics', () => {
      metricsService.recordQuery('getChats', 500, false, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.totalQueries).toBe(1);
      expect(metrics.queryMetrics.errorRate).toBe(1);
    });

    it('should record slow query metrics', () => {
      metricsService.recordQuery('getChats', 3000, true, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.slowQueries).toBe(1);
    });

    it('should calculate cache hit rate correctly', () => {
      metricsService.recordQuery('getChats', 100, true, true);  // cache hit
      metricsService.recordQuery('getMessages', 200, true, false); // cache miss
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.cacheHitRate).toBe(0.5);
    });

    it('should calculate average query time correctly', () => {
      metricsService.recordQuery('getChats', 100, true, false);
      metricsService.recordQuery('getMessages', 300, true, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.averageQueryTime).toBe(200);
    });
  });

  describe('Mutation Metrics', () => {
    it('should record successful mutation metrics', () => {
      metricsService.recordMutation('createChat', 800, true, true, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.mutationMetrics.totalMutations).toBe(1);
      expect(metrics.mutationMetrics.averageMutationTime).toBe(800);
      expect(metrics.mutationMetrics.optimisticUpdateRate).toBe(1);
      expect(metrics.mutationMetrics.rollbackRate).toBe(0);
      expect(metrics.mutationMetrics.errorRate).toBe(0);
    });

    it('should record failed mutation metrics', () => {
      metricsService.recordMutation('createChat', 800, false, true, false);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.mutationMetrics.errorRate).toBe(1);
    });

    it('should record rollback metrics', () => {
      metricsService.recordMutation('createChat', 800, true, true, true);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.mutationMetrics.rollbackRate).toBe(1);
    });
  });

  describe('Cache Metrics', () => {
    it('should record cache hits and misses', () => {
      metricsService.recordCacheEvent('hit', 10);
      metricsService.recordCacheEvent('miss', 15);
      metricsService.recordCacheEvent('hit', 12);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.cacheMetrics.totalCacheHits).toBe(2);
      expect(metrics.cacheMetrics.totalCacheMisses).toBe(1);
      expect(metrics.cacheMetrics.averageCacheAccessTime).toBe(12.33); // (10+15+12)/3
    });

    it('should record cache evictions', () => {
      metricsService.recordCacheEvent('eviction', 5);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.cacheMetrics.evictionRate).toBe(1);
    });
  });

  describe('WebSocket Metrics', () => {
    it('should record message metrics with latency', () => {
      metricsService.recordWebSocketEvent('message', 150);
      metricsService.recordWebSocketEvent('message', 200);
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.websocketMetrics.messagesReceived).toBe(2);
      expect(metrics.websocketMetrics.averageLatency).toBe(175);
    });

    it('should record reconnection attempts', () => {
      metricsService.recordWebSocketEvent('reconnect');
      metricsService.recordWebSocketEvent('reconnect');
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.websocketMetrics.reconnectionAttempts).toBe(2);
    });
  });

  describe('User Interaction Metrics', () => {
    it('should record message interactions', () => {
      metricsService.recordInteraction('message', { chatId: 'chat-123' });
      metricsService.recordInteraction('message', { chatId: 'chat-456' });
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.interactionMetrics.messagesPerSession).toBe(2);
    });

    it('should record typing indicator usage', () => {
      metricsService.recordInteraction('typing', { chatId: 'chat-123' });
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.interactionMetrics.typingIndicatorUsage).toBe(1);
    });

    it('should record search queries', () => {
      metricsService.recordInteraction('search', { query: 'john' });
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.interactionMetrics.searchQueries).toBe(1);
    });
  });

  describe('Performance Summary', () => {
    it('should return excellent performance for good metrics', () => {
      // Record good performance metrics
      metricsService.recordQuery('getChats', 500, true, true);
      metricsService.recordMutation('createChat', 800, true, true, false);
      
      const summary = metricsService.getPerformanceSummary();
      
      expect(summary.overall).toBe('excellent');
      expect(summary.issues).toHaveLength(0);
    });

    it('should return poor performance for bad metrics', () => {
      // Record bad performance metrics
      metricsService.recordQuery('getChats', 3000, false, false); // slow query
      metricsService.recordQuery('getMessages', 2500, false, false); // slow query
      metricsService.recordQuery('getParticipants', 2100, false, false); // slow query
      
      const summary = metricsService.getPerformanceSummary();
      
      expect(summary.overall).toBe('poor');
      expect(summary.issues.length).toBeGreaterThan(2);
      expect(summary.recommendations.length).toBeGreaterThan(0);
    });

    it('should provide specific recommendations for cache issues', () => {
      // Record low cache hit rate
      for (let i = 0; i < 10; i++) {
        metricsService.recordQuery('getChats', 500, true, false); // all cache misses
      }
      
      const summary = metricsService.getPerformanceSummary();
      
      expect(summary.issues).toContain('Cache hit rate is low (<70%)');
      expect(summary.recommendations.some(r => r.includes('cache'))).toBe(true);
    });
  });

  describe('Event Tracking', () => {
    it('should track events and maintain history', () => {
      metricsService.recordQuery('getChats', 500, true, false);
      metricsService.recordMutation('createChat', 800, true, true, false);
      metricsService.recordInteraction('message', { chatId: 'chat-123' });
      
      const events = metricsService.getRecentEvents(10);
      
      expect(events).toHaveLength(3);
      expect(events[0].type).toBe('query');
      expect(events[1].type).toBe('mutation');
      expect(events[2].type).toBe('interaction');
    });

    it('should limit event history to 1000 events', () => {
      // Simulate more than 1000 events
      for (let i = 0; i < 1005; i++) {
        metricsService.recordQuery('getChats', 100, true, false);
      }
      
      const events = metricsService.getRecentEvents();
      
      expect(events).toHaveLength(1000);
    });
  });

  describe('Metrics Reset', () => {
    it('should reset all metrics to initial values', () => {
      // Record some metrics
      metricsService.recordQuery('getChats', 500, true, false);
      metricsService.recordMutation('createChat', 800, true, true, false);
      metricsService.recordInteraction('message', { chatId: 'chat-123' });
      
      // Reset metrics
      metricsService.resetMetrics();
      
      const metrics = metricsService.getMetrics();
      
      expect(metrics.queryMetrics.totalQueries).toBe(0);
      expect(metrics.mutationMetrics.totalMutations).toBe(0);
      expect(metrics.interactionMetrics.messagesPerSession).toBe(0);
    });
  });
});
