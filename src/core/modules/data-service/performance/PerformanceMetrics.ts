/**
 * Performance Metrics for Data Service
 *
 * Provides comprehensive performance monitoring and metrics collection
 * for all data operations in the data service module.
 */

import { createError } from '../error';

/**
 * Performance metrics interface
 */
export interface IPerformanceMetrics {
  // Request metrics
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  
  // Cache metrics
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  
  // WebSocket metrics
  websocketMessagesReceived: number;
  websocketUpdatesProcessed: number;
  
  // System metrics
  memoryUsage: number;
  activeConnections: number;
  
  // Timing
  startTime: number;
  lastResetTime: number;
}

/**
 * Performance timing wrapper
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;
  
  start(): void {
    this.startTime = performance.now();
  }
  
  end(): number {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  }
  
  getDuration(): number {
    return this.endTime - this.startTime;
  }
}

/**
 * Performance monitoring decorator
 */
export function withPerformanceTiming<T extends any[], R>(
  target: (...args: T) => R,
  context: string
): (...args: T) => R {
  return (...args: T) => {
    const timer = new PerformanceTimer();
    timer.start();
    
    try {
      const result = target(...args);
      
      // Record metrics
      performanceMetrics.recordRequest(context, timer.getDuration(), true);
      
      return result;
    } catch (error) {
      // Record failed request
      performanceMetrics.recordRequest(context, timer.getDuration(), false);
      
      // Re-throw with enhanced error information
      throw createError(
        `Data service operation failed in ${context}`,
        'DATA_SERVICE_ERROR',
        'SYSTEM' as any,
        'MEDIUM' as any,
        {
          originalError: error,
          context: { operation: context, duration: timer.getDuration() }
        }
      );
    }
  };
}

/**
 * Performance metrics collector
 */
export class PerformanceMetricsCollector implements IPerformanceMetrics {
  private metrics: IPerformanceMetrics = {
    // Request metrics
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
    
    // Cache metrics
    cacheHits: 0,
    cacheMisses: 0,
    cacheHitRate: 0,
    
    // WebSocket metrics
    websocketMessagesReceived: 0,
    websocketUpdatesProcessed: 0,
    
    // System metrics
    memoryUsage: 0,
    activeConnections: 0,
    
    // Timing
    startTime: Date.now(),
    lastResetTime: Date.now()
  };
  
  /**
   * Record a successful request
   */
  recordRequest(context: string, duration: number, success: boolean): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Update response time metrics
    this.updateResponseTimeMetrics(duration);
    
    // Update timestamp
    this.metrics.lastResetTime = Date.now();
  }
  
  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.metrics.cacheHits++;
    this.updateCacheHitRate();
  }
  
  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
    this.updateCacheHitRate();
  }
  
  /**
   * Record WebSocket message received
   */
  recordWebSocketMessageReceived(): void {
    this.metrics.websocketMessagesReceived++;
  }
  
  /**
   * Record WebSocket update processed
   */
  recordWebSocketUpdateProcessed(): void {
    this.metrics.websocketUpdatesProcessed++;
  }
  
  /**
   * Update memory usage
   */
  updateMemoryUsage(usage: number): void {
    this.metrics.memoryUsage = usage;
  }
  
  /**
   * Update active connections
   */
  updateActiveConnections(count: number): void {
    this.metrics.activeConnections = count;
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): IPerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheHitRate: 0,
      websocketMessagesReceived: 0,
      websocketUpdatesProcessed: 0,
      memoryUsage: 0,
      activeConnections: 0,
      startTime: Date.now(),
      lastResetTime: Date.now()
    };
  }
  
  /**
   * Update response time metrics
   */
  private updateResponseTimeMetrics(duration: number): void {
    // Update min/max
    this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, duration);
    this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, duration);
    
    // Update average
    const totalRequests = this.metrics.totalRequests;
    if (totalRequests > 0) {
      const totalTime = this.metrics.averageResponseTime * (totalRequests - 1) + duration;
      this.metrics.averageResponseTime = totalTime / totalRequests;
    }
  }
  
  /**
   * Update cache hit rate
   */
  private updateCacheHitRate(): void {
    const totalCacheRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (totalCacheRequests > 0) {
      this.metrics.cacheHitRate = this.metrics.cacheHits / totalCacheRequests;
    }
  }
}

// Global performance metrics instance
export const performanceMetrics = new PerformanceMetricsCollector();

/**
 * Get performance dashboard data
 */
export function getPerformanceDashboard(): {
  metrics: IPerformanceMetrics;
  health: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
  };
  recommendations: string[];
} {
  const metrics = performanceMetrics.getMetrics();
  const healthStatus = determineHealthStatus(metrics);
  
  return {
    metrics,
    health: healthStatus,
    recommendations: generateRecommendations(metrics, healthStatus)
  };
}

/**
 * Determine overall health status
 */
function determineHealthStatus(metrics: IPerformanceMetrics): {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check error rate
  const errorRate = metrics.failedRequests / metrics.totalRequests;
  if (errorRate > 0.1) {
    issues.push('High error rate (>10%)');
  }
  
  // Check response time
  if (metrics.averageResponseTime > 5000) {
    issues.push('Slow average response time (>5s)');
  }
  
  // Check cache hit rate
  if (metrics.cacheHitRate < 0.7) {
    issues.push('Low cache hit rate (<70%)');
  }
  
  // Determine status
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (issues.length > 0) {
    status = issues.some(issue => issue.includes('critical')) ? 'critical' : 'warning';
  }
  
  return { status, issues };
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(
  metrics: IPerformanceMetrics, 
  healthStatus: { status: string; issues: string[] }
): string[] {
  const recommendations: string[] = [];
  
  // Response time recommendations
  if (metrics.averageResponseTime > 2000) {
    recommendations.push('Consider implementing request caching to reduce response times');
  }
  
  // Cache recommendations
  if (metrics.cacheHitRate < 0.8) {
    recommendations.push('Optimize cache keys and TTL settings for better hit rates');
  }
  
  // Error rate recommendations
  const errorRate = metrics.failedRequests / metrics.totalRequests;
  if (errorRate > 0.05) {
    recommendations.push('Review error handling and implement retry strategies');
  }
  
  return recommendations;
}

/**
 * Health check endpoint data
 */
export interface IHealthCheckResult {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: number;
  metrics: IPerformanceMetrics;
  issues: string[];
  recommendations: string[];
}

/**
 * Perform health check
 */
export function performHealthCheck(): IHealthCheckResult {
  const metrics = performanceMetrics.getMetrics();
  const healthStatus = determineHealthStatus(metrics);
  const recommendations = generateRecommendations(metrics, healthStatus);
  
  return {
    status: healthStatus.status,
    timestamp: Date.now(),
    metrics,
    issues: healthStatus.issues,
    recommendations
  };
}
