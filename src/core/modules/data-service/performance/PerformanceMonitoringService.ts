/**
 * Performance Monitoring Service
 *
 * Service for monitoring data service performance and providing metrics.
 */

import { PerformanceMetricsCollector, performanceMetrics, getPerformanceDashboard, performHealthCheck, type IHealthCheckResult } from './PerformanceMetrics';

/**
 * Performance monitoring service interface
 */
export interface IPerformanceMonitoringService {
  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetricsCollector;
  
  /**
   * Get performance dashboard data
   */
  getDashboard(): ReturnType<typeof getPerformanceDashboard>;
  
  /**
   * Perform health check
   */
  performHealthCheck(): IHealthCheckResult;
  
  /**
   * Reset metrics
   */
  resetMetrics(): void;
}

/**
 * Performance monitoring service implementation
 */
export class PerformanceMonitoringService implements IPerformanceMonitoringService {
  private metrics: PerformanceMetricsCollector;
  
  constructor() {
    this.metrics = performanceMetrics;
  }
  
  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetricsCollector {
    return this.metrics;
  }
  
  /**
   * Get performance dashboard data
   */
  getDashboard(): ReturnType<typeof getPerformanceDashboard> {
    return getPerformanceDashboard();
  }
  
  /**
   * Perform health check
   */
  performHealthCheck(): IHealthCheckResult {
    return performHealthCheck();
  }
  
  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics.reset();
  }
}

/**
 * Create performance monitoring service
 */
export function createPerformanceMonitoringService(): IPerformanceMonitoringService {
  return new PerformanceMonitoringService();
}
