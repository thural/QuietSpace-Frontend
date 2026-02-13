/**
 * Metrics Collector
 * 
 * Collects and aggregates metrics from the logging system.
 * Provides real-time monitoring and historical data analysis.
 */

import { ILogEntry, LogLevel } from '../types';

/**
 * Metric point interface
 */
export interface IMetricPoint {
  /** Timestamp */
  timestamp: Date;
  
  /** Metric value */
  value: number;
  
  /** Metric labels */
  labels?: Record<string, string>;
}

/**
 * Metric series interface
 */
export interface IMetricSeries {
  /** Metric name */
  name: string;
  
  /** Metric description */
  description: string;
  
  /** Metric type */
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  
  /** Metric points */
  points: IMetricPoint[];
  
  /** Aggregated value */
  aggregatedValue?: number;
  
  /** Unit */
  unit?: string;
  
  /** Labels */
  labels?: Record<string, string>;
}

/**
 * Aggregation functions
 */
export type AggregationFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'rate';

/**
 * Metrics collector implementation
 */
export class MetricsCollector {
  private _series: Map<string, IMetricSeries> = new Map();
  private _maxPoints: number = 1000;
  private _aggregationInterval: number = 60000; // 1 minute
  private _lastAggregation: number = 0;

  constructor(maxPoints?: number, aggregationInterval?: number) {
    this._maxPoints = maxPoints || 1000;
    this._aggregationInterval = aggregationInterval || 60000;
  }

  /**
   * Record a metric value
   */
  recordMetric(
    name: string,
    value: number,
    type: 'counter' | 'gauge' | 'histogram' | 'summary',
    labels?: Record<string, string>,
    unit?: string
  ): void {
    let series = this._series.get(name);
    
    if (!series) {
      series = {
        name,
        description: '',
        type,
        points: [],
        unit,
        labels
      };
      this._series.set(name, series);
    }
    
    // Add point
    const point: IMetricPoint = {
      timestamp: new Date(),
      value,
      labels
    };
    
    series.points.push(point);
    
    // Maintain max points limit
    if (series.points.length > this._maxPoints) {
      series.points = series.points.slice(-this._maxPoints);
    }
    
    // Update aggregated value
    this.updateAggregatedValue(series);
    
    // Trigger aggregation if needed
    this.checkAggregation();
  }

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    this.recordMetric(name, value, 'counter', labels);
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric(name, value, 'gauge', labels);
  }

  /**
   * Record a histogram observation
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    this.recordMetric(name, value, 'histogram', labels);
  }

  /**
   * Get metric series
   */
  getMetricSeries(name: string): IMetricSeries | undefined {
    return this._series.get(name);
  }

  /**
   * Get all metric series
   */
  getAllMetricSeries(): IMetricSeries[] {
    return Array.from(this._series.values());
  }

  /**
   * Get aggregated metric value
   */
  getAggregatedValue(
    name: string,
    aggregation: AggregationFunction = 'sum',
    timeWindow?: { start: Date; end: Date }
  ): number | undefined {
    const series = this._series.get(name);
    if (!series) return undefined;
    
    let points = series.points;
    
    // Filter by time window
    if (timeWindow) {
      points = points.filter(point => 
        point.timestamp >= timeWindow.start && point.timestamp <= timeWindow.end
      );
    }
    
    if (points.length === 0) return undefined;
    
    // Apply aggregation
    switch (aggregation) {
      case 'sum':
        return points.reduce((sum, point) => sum + point.value, 0);
      case 'avg':
        return points.reduce((sum, point) => sum + point.value, 0) / points.length;
      case 'min':
        return Math.min(...points.map(point => point.value));
      case 'max':
        return Math.max(...points.map(point => point.value));
      case 'count':
        return points.length;
      case 'rate':
        if (points.length < 2) return 0;
        const timeSpan = points[points.length - 1].timestamp.getTime() - points[0].timestamp.getTime();
        return timeSpan > 0 ? (points.length / timeSpan) * 1000 : 0; // per second
      default:
        return points[points.length - 1].value;
    }
  }

  /**
   * Get metric statistics
   */
  getMetricStatistics(
    name: string,
    timeWindow?: { start: Date; end: Date }
  ): {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    rate: number;
  } | undefined {
    const series = this._series.get(name);
    if (!series) return undefined;
    
    let points = series.points;
    
    // Filter by time window
    if (timeWindow) {
      points = points.filter(point => 
        point.timestamp >= timeWindow.start && point.timestamp <= timeWindow.end
      );
    }
    
    if (points.length === 0) return undefined;
    
    const values = points.map(point => point.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const timeSpan = points.length > 1 
      ? points[points.length - 1].timestamp.getTime() - points[0].timestamp.getTime()
      : 0;
    
    return {
      count: points.length,
      sum,
      avg: sum / points.length,
      min: Math.min(...values),
      max: Math.max(...values),
      rate: timeSpan > 0 ? (points.length / timeSpan) * 1000 : 0
    };
  }

  /**
   * Process log entries and extract metrics
   */
  processLogEntries(entries: ILogEntry[]): void {
    // Log level counts
    const levelCounts: Record<string, number> = {};
    
    // Category counts
    const categoryCounts: Record<string, number> = {};
    
    // Error rate
    let errorCount = 0;
    
    // Security events
    let securityCount = 0;
    
    // Processing times
    const processingTimes: number[] = [];
    
    for (const entry of entries) {
      // Count by level
      levelCounts[entry.level] = (levelCounts[entry.level] || 0) + 1;
      
      // Count by category
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
      
      // Count errors
      if (entry.level === 'ERROR' || entry.level === 'FATAL') {
        errorCount++;
      }
      
      // Count security events
      if (entry.level === 'SECURITY') {
        securityCount++;
      }
      
      // Extract processing time
      if (entry.metadata?.processingTime) {
        processingTimes.push(entry.metadata.processingTime);
      }
    }
    
    // Record metrics
    for (const [level, count] of Object.entries(levelCounts)) {
      this.incrementCounter(`logs_by_level_${level.toLowerCase()}`, count, { level });
    }
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      this.incrementCounter('logs_by_category', count, { category });
    }
    
    this.incrementCounter('error_logs', errorCount);
    this.incrementCounter('security_logs', securityCount);
    
    // Processing time metrics
    if (processingTimes.length > 0) {
      const avgProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
      this.setGauge('avg_processing_time', avgProcessingTime);
      this.setGauge('max_processing_time', Math.max(...processingTimes));
      this.setGauge('min_processing_time', Math.min(...processingTimes));
    }
    
    // Total logs
    this.incrementCounter('total_logs', entries.length);
    
    // Error rate
    const errorRate = entries.length > 0 ? (errorCount / entries.length) * 100 : 0;
    this.setGauge('error_rate', errorRate);
  }

  /**
   * Get dashboard data
   */
  getDashboardData(): {
    summary: {
      totalLogs: number;
      errorRate: number;
      securityEvents: number;
      avgProcessingTime: number;
    };
    metrics: Array<{
      name: string;
      value: number;
      unit?: string;
      type: string;
      trend?: 'up' | 'down' | 'stable';
    }>;
    alerts: Array<{
      metric: string;
      condition: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
    }>;
  } {
    const totalLogs = this.getAggregatedValue('total_logs', 'sum') || 0;
    const errorRate = this.getAggregatedValue('error_rate', 'avg') || 0;
    const securityEvents = this.getAggregatedValue('security_logs', 'sum') || 0;
    const avgProcessingTime = this.getAggregatedValue('avg_processing_time', 'avg') || 0;
    
    // Generate metrics list
    const metrics = [
      { name: 'Total Logs', value: totalLogs, type: 'counter' },
      { name: 'Error Rate', value: errorRate, unit: '%', type: 'gauge' },
      { name: 'Security Events', value: securityEvents, type: 'counter' },
      { name: 'Avg Processing Time', value: avgProcessingTime, unit: 'ms', type: 'gauge' }
    ];
    
    // Generate alerts
    const alerts = [];
    
    if (errorRate > 10) {
      alerts.push({
        metric: 'error_rate',
        condition: 'error_rate > 10',
        severity: 'high' as const,
        message: `High error rate: ${errorRate.toFixed(2)}%`
      });
    }
    
    if (securityEvents > 0) {
      alerts.push({
        metric: 'security_logs',
        condition: 'security_logs > 0',
        severity: 'critical' as const,
        message: `Security events detected: ${securityEvents}`
      });
    }
    
    return {
      summary: {
        totalLogs,
        errorRate,
        securityEvents,
        avgProcessingTime
      },
      metrics,
      alerts
    };
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheusMetrics(): string {
    const lines: string[] = [];
    
    for (const series of this._series.values()) {
      const helpLine = `# HELP ${series.name} ${series.description}`;
      const typeLine = `# TYPE ${series.name} ${series.type}`;
      
      lines.push(helpLine);
      lines.push(typeLine);
      
      if (series.points.length > 0) {
        const latestPoint = series.points[series.points.length - 1];
        const labels = series.labels ? 
          Object.entries(series.labels).map(([k, v]) => `${k}="${v}"`).join(',') : '';
        const labelStr = labels ? `{${labels}}` : '';
        
        lines.push(`${series.name}${labelStr} ${latestPoint.value}`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this._series.clear();
  }

  /**
   * Get collector statistics
   */
  getStatistics(): {
    totalSeries: number;
    totalPoints: number;
    memoryUsage: number;
    lastAggregation: Date;
  } {
    const totalSeries = this._series.size;
    const totalPoints = Array.from(this._series.values())
      .reduce((sum, series) => sum + series.points.length, 0);
    
    return {
      totalSeries,
      totalPoints,
      memoryUsage: totalSeries * 100 + totalPoints * 50, // Approximate
      lastAggregation: new Date(this._lastAggregation)
    };
  }

  /**
   * Update aggregated value for a series
   */
  private updateAggregatedValue(series: IMetricSeries): void {
    if (series.points.length === 0) return;
    
    switch (series.type) {
      case 'counter':
        series.aggregatedValue = series.points.reduce((sum, point) => sum + point.value, 0);
        break;
      case 'gauge':
        series.aggregatedValue = series.points[series.points.length - 1].value;
        break;
      case 'histogram':
        series.aggregatedValue = series.points.reduce((sum, point) => sum + point.value, 0) / series.points.length;
        break;
      case 'summary':
        series.aggregatedValue = series.points.reduce((sum, point) => sum + point.value, 0) / series.points.length;
        break;
    }
  }

  /**
   * Check if aggregation should be performed
   */
  private checkAggregation(): void {
    const now = Date.now();
    
    if (now - this._lastAggregation >= this._aggregationInterval) {
      this.performAggregation();
      this._lastAggregation = now;
    }
  }

  /**
   * Perform aggregation of metrics
   */
  private performAggregation(): void {
    for (const series of this._series.values()) {
      this.updateAggregatedValue(series);
    }
  }
}
