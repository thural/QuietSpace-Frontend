/**
 * Performance Testing and Validation Module
 * 
 * This module provides comprehensive performance testing and validation
 * for the custom query system, validating the improvements achieved
 * by migrating from React Query to our enterprise-grade implementation.
 */

// Core performance monitoring
export { 
  QueryPerformanceMonitor, 
  performanceMonitor,
  usePerformanceMonitor 
} from './PerformanceMonitor';

export type { 
  PerformanceMetrics, 
  QueryPerformanceData 
} from './PerformanceMonitor';

// Performance testing component
export { PerformanceTest } from './PerformanceTest';

// Benchmark comparisons
export { 
  benchmarkResults,
  generateBenchmarkReport,
  generateImprovementSummary,
  getMetricComparison 
} from './BenchmarkComparison';

export type { BenchmarkResults } from './BenchmarkComparison';

// Performance validation utilities
export class PerformanceValidator {
  /**
   * Validate that performance improvements meet expected thresholds
   */
  static validateImprovements(metrics: PerformanceMetrics): {
    bundleSizeReduction: boolean;
    performanceImprovement: boolean;
    memoryReduction: boolean;
    cacheEfficiency: boolean;
    overall: boolean;
  } {
    const bundleSizeReduction = metrics.bundleSize.reduction >= 40; // At least 40KB reduction
    const performanceImprovement = metrics.queryPerformance.averageQueryTime <= 50; // Under 50ms average
    const memoryReduction = metrics.memoryUsage.heapUsed <= 10; // Under 10MB heap usage
    const cacheEfficiency = metrics.cachePerformance.hitRate >= 70; // At least 70% hit rate
    
    const overall = bundleSizeReduction && performanceImprovement && memoryReduction && cacheEfficiency;
    
    return {
      bundleSizeReduction,
      performanceImprovement,
      memoryReduction,
      cacheEfficiency,
      overall
    };
  }

  /**
   * Generate performance validation report
   */
  static generateValidationReport(metrics: PerformanceMetrics): string {
    const validation = this.validateImprovements(metrics);
    
    return `
🔍 Performance Validation Report
==============================

Bundle Size Reduction:
   Expected: ≥40KB
   Actual: ${metrics.bundleSize.reduction}KB
   Status: ${validation.bundleSizeReduction ? '✅ PASS' : '❌ FAIL'}

Performance Improvement:
   Expected: ≤50ms average query time
   Actual: ${metrics.queryPerformance.averageQueryTime.toFixed(2)}ms
   Status: ${validation.performanceImprovement ? '✅ PASS' : '❌ FAIL'}

Memory Reduction:
   Expected: ≤10MB heap usage
   Actual: ${metrics.memoryUsage.heapUsed}MB
   Status: ${validation.memoryReduction ? '✅ PASS' : '❌ FAIL'}

Cache Efficiency:
   Expected: ≥70% hit rate
   Actual: ${metrics.cachePerformance.hitRate.toFixed(1)}%
   Status: ${validation.cacheEfficiency ? '✅ PASS' : '❌ FAIL'}

Overall Status: ${validation.overall ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}

${validation.overall ? 
  '🎉 Performance validation successful! Migration meets all expected improvements.' :
  '⚠️ Some performance targets not met. Consider optimization.'
}
    `.trim();
  }

  /**
   * Check if performance is within acceptable ranges
   */
  static isPerformanceAcceptable(metrics: PerformanceMetrics): boolean {
    return this.validateImprovements(metrics).overall;
  }

  /**
   * Get performance recommendations
   */
  static getRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.bundleSize.reduction < 40) {
      recommendations.push('Consider further code splitting to reduce bundle size');
    }
    
    if (metrics.queryPerformance.averageQueryTime > 50) {
      recommendations.push('Optimize query execution time and caching strategy');
    }
    
    if (metrics.memoryUsage.heapUsed > 10) {
      recommendations.push('Implement memory optimization techniques');
    }
    
    if (metrics.cachePerformance.hitRate < 70) {
      recommendations.push('Adjust cache TTL and invalidation strategies');
    }
    
    if (metrics.queryPerformance.errorRate > 5) {
      recommendations.push('Improve error handling and retry logic');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance is optimal - no recommendations needed');
    }
    
    return recommendations;
  }
}

// Export performance validation utilities
export { PerformanceValidator };
