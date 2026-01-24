/**
 * Chat Performance Metrics Service
 * 
 * Provides comprehensive performance monitoring and metrics collection
 * for chat operations including queries, mutations, cache performance,
 * WebSocket operations, and user interactions.
 */

import { Injectable } from '@/core/di';
import { CacheProvider } from '@/core/cache';

export interface ChatMetrics {
  // Query performance metrics
  queryMetrics: {
    totalQueries: number;
    averageQueryTime: number;
    slowQueries: number;
    cacheHitRate: number;
    errorRate: number;
  };
  
  // Mutation performance metrics
  mutationMetrics: {
    totalMutations: number;
    averageMutationTime: number;
    optimisticUpdateRate: number;
    rollbackRate: number;
    errorRate: number;
  };
  
  // Cache performance metrics
  cacheMetrics: {
    totalCacheHits: number;
    totalCacheMisses: number;
    averageCacheAccessTime: number;
    cacheSize: number;
    evictionRate: number;
  };
  
  // WebSocket performance metrics
  websocketMetrics: {
    connectionUptime: number;
    messagesReceived: number;
    messagesSent: number;
    reconnectionAttempts: number;
    averageLatency: number;
  };
  
  // User interaction metrics
  interactionMetrics: {
    messagesPerSession: number;
    averageSessionDuration: number;
    typingIndicatorUsage: number;
    searchQueries: number;
  };
}

export interface MetricEvent {
  type: 'query' | 'mutation' | 'cache' | 'websocket' | 'interaction';
  action: string;
  duration?: number;
  success: boolean;
  timestamp: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class ChatMetricsService {
  private metrics: ChatMetrics;
  private events: MetricEvent[] = [];
  private startTime: number = Date.now();
  private sessionStartTime: number = Date.now();
  
  constructor(private cache: CacheProvider) {
    this.metrics = this.initializeMetrics();
    this.startMetricsCollection();
  }
  
  /**
   * Initialize default metrics
   */
  private initializeMetrics(): ChatMetrics {
    return {
      queryMetrics: {
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueries: 0,
        cacheHitRate: 0,
        errorRate: 0
      },
      mutationMetrics: {
        totalMutations: 0,
        averageMutationTime: 0,
        optimisticUpdateRate: 0,
        rollbackRate: 0,
        errorRate: 0
      },
      cacheMetrics: {
        totalCacheHits: 0,
        totalCacheMisses: 0,
        averageCacheAccessTime: 0,
        cacheSize: 0,
        evictionRate: 0
      },
      websocketMetrics: {
        connectionUptime: 0,
        messagesReceived: 0,
        messagesSent: 0,
        reconnectionAttempts: 0,
        averageLatency: 0
      },
      interactionMetrics: {
        messagesPerSession: 0,
        averageSessionDuration: 0,
        typingIndicatorUsage: 0,
        searchQueries: 0
      }
    };
  }
  
  /**
   * Start metrics collection interval
   */
  private startMetricsCollection(): void {
    // Update cache metrics every 30 seconds
    setInterval(() => {
      this.updateCacheMetrics();
    }, 30000);
    
    // Update WebSocket uptime every 10 seconds
    setInterval(() => {
      this.updateWebSocketMetrics();
    }, 10000);
  }
  
  /**
   * Record a query metric
   */
  recordQuery(action: string, duration: number, success: boolean, fromCache: boolean = false): void {
    this.metrics.queryMetrics.totalQueries++;
    
    if (duration > 2000) { // Queries over 2 seconds are considered slow
      this.metrics.queryMetrics.slowQueries++;
    }
    
    if (!success) {
      this.metrics.queryMetrics.errorRate = 
        (this.metrics.queryMetrics.errorRate * (this.metrics.queryMetrics.totalQueries - 1) + 1) / 
        this.metrics.queryMetrics.totalQueries;
    }
    
    // Update average query time
    this.metrics.queryMetrics.averageQueryTime = 
      (this.metrics.queryMetrics.averageQueryTime * (this.metrics.queryMetrics.totalQueries - 1) + duration) / 
      this.metrics.queryMetrics.totalQueries;
    
    // Update cache hit rate
    if (fromCache) {
      this.metrics.queryMetrics.cacheHitRate = 
        (this.metrics.queryMetrics.cacheHitRate * (this.metrics.queryMetrics.totalQueries - 1) + 1) / 
        this.metrics.queryMetrics.totalQueries;
    } else {
      this.metrics.queryMetrics.cacheHitRate = 
        (this.metrics.queryMetrics.cacheHitRate * (this.metrics.queryMetrics.totalQueries - 1)) / 
        this.metrics.queryMetrics.totalQueries;
    }
    
    this.addEvent({
      type: 'query',
      action,
      duration,
      success,
      timestamp: Date.now(),
      metadata: { fromCache }
    });
  }
  
  /**
   * Record a mutation metric
   */
  recordMutation(action: string, duration: number, success: boolean, optimistic: boolean = false, rollback: boolean = false): void {
    this.metrics.mutationMetrics.totalMutations++;
    
    if (!success) {
      this.metrics.mutationMetrics.errorRate = 
        (this.metrics.mutationMetrics.errorRate * (this.metrics.mutationMetrics.totalMutations - 1) + 1) / 
        this.metrics.mutationMetrics.totalMutations;
    }
    
    if (optimistic) {
      this.metrics.mutationMetrics.optimisticUpdateRate = 
        (this.metrics.mutationMetrics.optimisticUpdateRate * (this.metrics.mutationMetrics.totalMutations - 1) + 1) / 
        this.metrics.mutationMetrics.totalMutations;
    }
    
    if (rollback) {
      this.metrics.mutationMetrics.rollbackRate = 
        (this.metrics.mutationMetrics.rollbackRate * (this.metrics.mutationMetrics.totalMutations - 1) + 1) / 
        this.metrics.mutationMetrics.totalMutations;
    }
    
    // Update average mutation time
    this.metrics.mutationMetrics.averageMutationTime = 
      (this.metrics.mutationMetrics.averageMutationTime * (this.metrics.mutationMetrics.totalMutations - 1) + duration) / 
      this.metrics.mutationMetrics.totalMutations;
    
    this.addEvent({
      type: 'mutation',
      action,
      duration,
      success,
      timestamp: Date.now(),
      metadata: { optimistic, rollback }
    });
  }
  
  /**
   * Record a cache metric
   */
  recordCacheEvent(action: 'hit' | 'miss' | 'eviction', duration: number): void {
    if (action === 'hit') {
      this.metrics.cacheMetrics.totalCacheHits++;
    } else if (action === 'miss') {
      this.metrics.cacheMetrics.totalCacheMisses++;
    } else if (action === 'eviction') {
      this.metrics.cacheMetrics.evictionRate++;
    }
    
    // Update average cache access time
    const totalAccesses = this.metrics.cacheMetrics.totalCacheHits + this.metrics.cacheMetrics.totalCacheMisses;
    if (totalAccesses > 0) {
      this.metrics.cacheMetrics.averageCacheAccessTime = 
        (this.metrics.cacheMetrics.averageCacheAccessTime * (totalAccesses - 1) + duration) / totalAccesses;
    }
    
    this.addEvent({
      type: 'cache',
      action,
      duration,
      success: true,
      timestamp: Date.now()
    });
  }
  
  /**
   * Record WebSocket metric
   */
  recordWebSocketEvent(action: 'connect' | 'disconnect' | 'message' | 'reconnect', latency?: number): void {
    if (action === 'message') {
      this.metrics.websocketMetrics.messagesReceived++;
      if (latency) {
        this.metrics.websocketMetrics.averageLatency = 
          (this.metrics.websocketMetrics.averageLatency * (this.metrics.websocketMetrics.messagesReceived - 1) + latency) / 
          this.metrics.websocketMetrics.messagesReceived;
      }
    } else if (action === 'reconnect') {
      this.metrics.websocketMetrics.reconnectionAttempts++;
    }
    
    this.addEvent({
      type: 'websocket',
      action,
      success: true,
      timestamp: Date.now(),
      metadata: { latency }
    });
  }
  
  /**
   * Record user interaction metric
   */
  recordInteraction(action: 'message' | 'typing' | 'search', metadata?: Record<string, any>): void {
    if (action === 'message') {
      this.metrics.interactionMetrics.messagesPerSession++;
    } else if (action === 'typing') {
      this.metrics.interactionMetrics.typingIndicatorUsage++;
    } else if (action === 'search') {
      this.metrics.interactionMetrics.searchQueries++;
    }
    
    this.addEvent({
      type: 'interaction',
      action,
      success: true,
      timestamp: Date.now(),
      metadata
    });
  }
  
  /**
   * Update cache metrics from cache provider
   */
  private updateCacheMetrics(): void {
    const stats = this.cache.getStats();
    this.metrics.cacheMetrics.cacheSize = stats.size;
  }
  
  /**
   * Update WebSocket metrics
   */
  private updateWebSocketMetrics(): void {
    this.metrics.websocketMetrics.connectionUptime = Date.now() - this.startTime;
  }
  
  /**
   * Add event to events array (keep last 1000 events)
   */
  private addEvent(event: MetricEvent): void {
    this.events.push(event);
    if (this.events.length > 1000) {
      this.events.shift();
    }
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): ChatMetrics {
    // Update session duration
    this.metrics.interactionMetrics.averageSessionDuration = 
      (Date.now() - this.sessionStartTime) / 1000; // in seconds
    
    return { ...this.metrics };
  }
  
  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): MetricEvent[] {
    return this.events.slice(-limit);
  }
  
  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check query performance
    if (this.metrics.queryMetrics.averageQueryTime > 2000) {
      issues.push('Average query time is high (>2s)');
      recommendations.push('Consider optimizing queries or increasing cache TTL');
    }
    
    if (this.metrics.queryMetrics.cacheHitRate < 0.7) {
      issues.push('Cache hit rate is low (<70%)');
      recommendations.push('Review cache key strategies and TTL settings');
    }
    
    if (this.metrics.queryMetrics.errorRate > 0.1) {
      issues.push('Query error rate is high (>10%)');
      recommendations.push('Investigate network issues or API problems');
    }
    
    // Check mutation performance
    if (this.metrics.mutationMetrics.errorRate > 0.05) {
      issues.push('Mutation error rate is high (>5%)');
      recommendations.push('Review mutation logic and error handling');
    }
    
    // Check WebSocket performance
    if (this.metrics.websocketMetrics.reconnectionAttempts > 5) {
      issues.push('Multiple WebSocket reconnections');
      recommendations.push('Check WebSocket server stability');
    }
    
    // Determine overall performance
    let overall: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    if (issues.length >= 3) overall = 'poor';
    else if (issues.length >= 2) overall = 'fair';
    else if (issues.length >= 1) overall = 'good';
    
    return { overall, issues, recommendations };
  }
  
  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    this.events = [];
    this.startTime = Date.now();
    this.sessionStartTime = Date.now();
  }
}
