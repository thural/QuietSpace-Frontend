/**
 * Advanced Caching Features
 *
 * Implements cache warming, predictive caching, dependency management,
 * and analytics dashboard for enhanced cache performance.
 */

import type { CacheEntry, CacheStats } from '../types/interfaces';

/**
 * Cache warming strategy configuration
 */
export interface CacheWarmingConfig {
  /** Enable automatic cache warming */
  enabled: boolean;
  /** Warming schedule (cron-like) */
  schedule?: string;
  /** Patterns to warm */
  patterns: Array<{
    pattern: string;
    priority: number;
    ttl?: number;
  }>;
  /** Maximum concurrent warming operations */
  maxConcurrent?: number;
  /** Warm on application start */
  warmOnStart?: boolean;
}

/**
 * Predictive caching configuration
 */
export interface PredictiveCacheConfig {
  /** Enable predictive caching */
  enabled: boolean;
  /** ML model type */
  modelType: 'frequency' | 'recency' | 'hybrid';
  /** Training data size limit */
  trainingDataLimit: number;
  /** Prediction confidence threshold */
  confidenceThreshold: number;
  /** Maximum predictive entries */
  maxPredictiveEntries: number;
}

/**
 * Cache dependency configuration
 */
export interface CacheDependencyConfig {
  /** Enable dependency management */
  enabled: boolean;
  /** Dependency graph */
  dependencies: Array<{
    key: string;
    dependsOn: string[];
    cascade: boolean;
  }>;
  /** Auto-invalidation on dependency change */
  autoInvalidate: boolean;
}

/**
 * Cache analytics configuration
 */
export interface CacheAnalyticsConfig {
  /** Enable analytics collection */
  enabled: boolean;
  /** Metrics retention period (ms) */
  retentionPeriod: number;
  /** Analytics update interval (ms) */
  updateInterval: number;
  /** Export formats */
  exportFormats: Array<'json' | 'csv' | 'prometheus'>;
}

/**
 * Usage pattern data
 */
export interface UsagePattern {
  key: string;
  frequency: number;
  lastAccess: Date;
  averageAccessInterval: number;
  seasonalPattern?: {
    hourly: number[];
    daily: number[];
    weekly: number[];
  };
}

/**
 * Prediction result
 */
export interface CachePrediction {
  key: string;
  confidence: number;
  reason: string;
  suggestedTTL: number;
  priority: number;
}

/**
 * Extended cache stats for advanced features
 */
export interface ExtendedCacheStats extends CacheStats {
  /** Memory usage in bytes */
  memoryUsage: number;
  /** Average response time in milliseconds */
  averageResponseTime: number;
  /** Total entries count */
  totalEntries: number;
}

/**
 * Cache dependency graph
 */
export class CacheDependencyGraph {
  private dependencies = new Map<string, Set<string>>();
  private reverseDependencies = new Map<string, Set<string>>();

  /**
   * Add dependency relationship
   */
  addDependency(key: string, dependsOn: string): void {
    if (!this.dependencies.has(key)) {
      this.dependencies.set(key, new Set());
    }
    this.dependencies.get(key)!.add(dependsOn);

    if (!this.reverseDependencies.has(dependsOn)) {
      this.reverseDependencies.set(dependsOn, new Set());
    }
    this.reverseDependencies.get(dependsOn)!.add(key);
  }

  /**
   * Get all dependencies for a key
   */
  getDependencies(key: string): string[] {
    return Array.from(this.dependencies.get(key) || []);
  }

  /**
   * Get all dependents for a key
   */
  getDependents(key: string): string[] {
    return Array.from(this.reverseDependencies.get(key) || []);
  }

  /**
   * Check for circular dependencies
   */
  hasCircularDependency(key: string, visited = new Set<string>()): boolean {
    if (visited.has(key)) return true;

    visited.add(key);
    const deps = this.dependencies.get(key) || new Set();

    for (const dep of deps) {
      if (this.hasCircularDependency(dep, visited)) {
        return true;
      }
    }

    visited.delete(key);
    return false;
  }

  /**
   * Get invalidation order (topological sort)
   */
  getInvalidationOrder(keys: string[]): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (key: string) => {
      if (visited.has(key)) return;
      visited.add(key);

      const deps = this.dependencies.get(key) || new Set();
      for (const dep of deps) {
        visit(dep);
      }

      result.push(key);
    };

    for (const key of keys) {
      visit(key);
    }

    return result;
  }
}

/**
 * Cache warming manager
 */
export class CacheWarmingManager {
  private warmingQueue: Array<{ pattern: string; priority: number; ttl?: number }> = [];
  private isWarming = false;

  constructor(
    private readonly cacheProvider: any,
    private readonly config: CacheWarmingConfig
  ) { }

  /**
   * Start cache warming process
   */
  async startWarming(): Promise<void> {
    if (this.isWarming || !this.config.enabled) return;

    this.isWarming = true;
    this.warmingQueue = [...this.config.patterns].sort((a, b) => b.priority - a.priority);

    const maxConcurrent = this.config.maxConcurrent || 3;
    const batches = this.createBatches(this.warmingQueue, maxConcurrent);

    for (const batch of batches) {
      await Promise.all(batch.map(item => this.warmEntry(item)));
    }

    this.isWarming = false;
  }

  /**
   * Warm a single cache entry
   */
  private async warmEntry(item: { pattern: string; priority: number; ttl?: number }): Promise<void> {
    try {
      // Simulate warming - in real implementation, would fetch data
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

      // Cache the warmed entry
      const key = `warmed:${item.pattern}`;
      const entry: CacheEntry<any> = {
        data: { warmed: true, timestamp: Date.now() },
        timestamp: Date.now(),
        ttl: item.ttl || 3600000, // 1 hour default
        accessCount: 0,
        lastAccessed: Date.now()
      };

      await this.cacheProvider.set(key, entry.data, entry.ttl);
    } catch (error) {
      console.error(`Failed to warm cache entry: ${item.pattern}`, error);
    }
  }

  /**
   * Create batches for concurrent processing
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Add warming pattern
   */
  addPattern(pattern: string, priority: number, ttl?: number): void {
    if (ttl !== undefined) {
      this.config.patterns.push({ pattern, priority, ttl });
    } else {
      this.config.patterns.push({ pattern, priority });
    }
  }
}

/**
 * Predictive caching engine
 */
export class PredictiveCacheEngine {
  private usagePatterns = new Map<string, UsagePattern>();
  private predictions: CachePrediction[] = [];

  constructor(private readonly config: PredictiveCacheConfig) { }

  /**
   * Record cache access for pattern learning
   */
  recordAccess(key: string): void {
    const now = Date.now();
    const pattern = this.usagePatterns.get(key) || {
      key,
      frequency: 0,
      lastAccess: new Date(now),
      averageAccessInterval: 0
    };

    pattern.frequency++;
    const interval = now - pattern.lastAccess.getTime();
    pattern.averageAccessInterval = (pattern.averageAccessInterval + interval) / 2;
    pattern.lastAccess = new Date(now);

    this.usagePatterns.set(key, pattern);
  }

  /**
   * Generate cache predictions
   */
  generatePredictions(): CachePrediction[] {
    this.predictions = [];
    const patterns = Array.from(this.usagePatterns.values());

    for (const pattern of patterns) {
      const prediction = this.predictAccess(pattern);
      if (prediction.confidence >= this.config.confidenceThreshold) {
        this.predictions.push(prediction);
      }
    }

    // Sort by confidence and priority
    this.predictions.sort((a, b) => b.confidence - a.confidence);

    // Limit to max predictive entries
    return this.predictions.slice(0, this.config.maxPredictiveEntries);
  }

  /**
   * Predict next access for a pattern
   */
  private predictAccess(pattern: UsagePattern): CachePrediction {
    let confidence = 0;
    let reason = '';
    let suggestedTTL = 3600000; // 1 hour default

    const hoursSinceLastAccess = (Date.now() - pattern.lastAccess.getTime()) / (1000 * 60 * 60);

    switch (this.config.modelType) {
      case 'frequency':
        confidence = Math.min(pattern.frequency / 100, 1);
        reason = `High frequency: ${pattern.frequency} accesses`;
        break;

      case 'recency':
        confidence = Math.max(0, 1 - hoursSinceLastAccess / 24);
        reason = `Recent access: ${hoursSinceLastAccess.toFixed(1)} hours ago`;
        break;

      case 'hybrid':
        const freqScore = Math.min(pattern.frequency / 100, 1);
        const recScore = Math.max(0, 1 - hoursSinceLastAccess / 24);
        confidence = (freqScore + recScore) / 2;
        reason = `Hybrid: freq=${freqScore.toFixed(2)}, rec=${recScore.toFixed(2)}`;
        break;
    }

    // Adjust TTL based on access patterns
    if (pattern.averageAccessInterval > 0) {
      suggestedTTL = pattern.averageAccessInterval * 2; // 2x average interval
    }

    return {
      key: pattern.key,
      confidence,
      reason,
      suggestedTTL,
      priority: Math.ceil(confidence * 10)
    };
  }

  /**
   * Get current predictions
   */
  getPredictions(): CachePrediction[] {
    return this.predictions;
  }
}

/**
 * Cache analytics dashboard
 */
export class CacheAnalyticsDashboard {
  private metricsHistory: Array<{
    timestamp: Date;
    stats: ExtendedCacheStats;
  }> = [];

  constructor(private readonly config: CacheAnalyticsConfig) { }

  /**
   * Record cache metrics
   */
  recordMetrics(stats: CacheStats): void {
    if (!this.config.enabled) return;

    // Convert to extended stats with default values
    const extendedStats: ExtendedCacheStats = {
      ...stats,
      memoryUsage: (stats as any).memoryUsage || 0,
      averageResponseTime: (stats as any).averageResponseTime || 0,
      totalEntries: stats.size
    };

    this.metricsHistory.push({
      timestamp: new Date(),
      stats: extendedStats
    });

    // Trim old data based on retention period
    const cutoff = new Date(Date.now() - this.config.retentionPeriod);
    this.metricsHistory = this.metricsHistory.filter(m => m.timestamp >= cutoff);
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEntries: number;
    hitRate: number;
    averageResponseTime: number;
    memoryUsage: number;
    trends: {
      hitRateTrend: 'increasing' | 'decreasing' | 'stable';
      memoryTrend: 'increasing' | 'decreasing' | 'stable';
      performanceTrend: 'improving' | 'degrading' | 'stable';
    };
  } {
    if (this.metricsHistory.length === 0) {
      return {
        totalEntries: 0,
        hitRate: 0,
        averageResponseTime: 0,
        memoryUsage: 0,
        trends: {
          hitRateTrend: 'stable',
          memoryTrend: 'stable',
          performanceTrend: 'stable'
        }
      };
    }

    const latest = this.metricsHistory[this.metricsHistory.length - 1]!;
    const previous = this.metricsHistory.length > 1 ? this.metricsHistory[this.metricsHistory.length - 2]! : latest;

    const hitRateTrend = this.calculateTrend(latest.stats.hitRate, previous.stats.hitRate);
    const memoryTrend = this.calculateTrend(latest.stats.memoryUsage, previous.stats.memoryUsage);
    const performanceTrend = this.calculateTrend(latest.stats.averageResponseTime, previous.stats.averageResponseTime);

    return {
      totalEntries: latest.stats.totalEntries,
      hitRate: latest.stats.hitRate,
      averageResponseTime: latest.stats.averageResponseTime,
      memoryUsage: latest.stats.memoryUsage,
      trends: {
        hitRateTrend,
        memoryTrend,
        performanceTrend: performanceTrend === 'decreasing' ? 'improving' : performanceTrend === 'increasing' ? 'degrading' : 'stable'
      }
    };
  }

  /**
   * Export analytics data
   */
  exportData(format: 'json' | 'csv' | 'prometheus'): string {
    if (!this.config.exportFormats.includes(format)) {
      throw new Error(`Export format ${format} not supported`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(this.metricsHistory, null, 2);

      case 'csv':
        return this.exportToCSV();

      case 'prometheus':
        return this.exportToPrometheus();

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Calculate trend direction
   */
  private calculateTrend(current: number, previous: number): 'increasing' | 'decreasing' | 'stable' {
    const threshold = 0.05; // 5% threshold
    const change = (current - previous) / previous;

    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(): string {
    const headers = ['timestamp', 'totalEntries', 'hitRate', 'memoryUsage', 'averageResponseTime'];
    const rows = this.metricsHistory.map(m => [
      m.timestamp.toISOString(),
      m.stats.totalEntries.toString(),
      m.stats.hitRate.toString(),
      m.stats.memoryUsage.toString(),
      m.stats.averageResponseTime.toString()
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Export to Prometheus format
   */
  private exportToPrometheus(): string {
    const latest = this.metricsHistory[this.metricsHistory.length - 1];
    if (!latest) return '';

    return `
# HELP cache_total_entries Total number of cache entries
# TYPE cache_total_entries gauge
cache_total_entries ${latest.stats.totalEntries}

# HELP cache_hit_rate Cache hit rate percentage
# TYPE cache_hit_rate gauge
cache_hit_rate ${latest.stats.hitRate}

# HELP cache_memory_usage Cache memory usage in bytes
# TYPE cache_memory_usage gauge
cache_memory_usage ${latest.stats.memoryUsage}

# HELP cache_average_response_time Cache average response time in milliseconds
# TYPE cache_average_response_time gauge
cache_average_response_time ${latest.stats.averageResponseTime}
    `.trim();
  }
}
