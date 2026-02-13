/**
 * Log Analytics
 * 
 * Advanced analytics and monitoring capabilities for the logging system.
 * Provides metrics collection, trend analysis, and alerting features.
 */

import { ILogEntry, ILoggingContext, LogLevel } from '../types';
import { PerformanceUtils } from '../utils';

/**
 * Analytics metrics interface
 */
export interface IAnalyticsMetrics {
  /** Total log entries processed */
  totalEntries: number;
  
  /** Entries by level */
  entriesByLevel: Record<string, number>;
  
  /** Entries by category */
  entriesByCategory: Record<string, number>;
  
  /** Average message length */
  averageMessageLength: number;
  
  /** Error rate percentage */
  errorRate: number;
  
  /** Security event count */
  securityEventCount: number;
  
  /** Performance metrics */
  performanceMetrics: {
    averageProcessingTime: number;
    slowestProcessingTime: number;
    fastestProcessingTime: number;
  };
  
  /** Time window for metrics */
  timeWindow: {
    start: Date;
    end: Date;
    duration: number;
  };
  
  /** Top error messages */
  topErrorMessages: Array<{
    message: string;
    count: number;
    percentage: number;
  }>;
  
  /** Top categories */
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  
  /** Hourly distribution */
  hourlyDistribution: Record<number, number>;
}

/**
 * Alert configuration
 */
export interface IAlertConfig {
  /** Alert name */
  name: string;
  
  /** Alert description */
  description: string;
  
  /** Alert condition */
  condition: (metrics: IAnalyticsMetrics) => boolean;
  
  /** Alert severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Whether alert is enabled */
  enabled: boolean;
  
  /** Alert cooldown period in milliseconds */
  cooldown: number;
  
  /** Alert callback */
  callback: (alert: IAlert, metrics: IAnalyticsMetrics) => void;
}

/**
 * Alert interface
 */
export interface IAlert {
  /** Alert name */
  name: string;
  
  /** Alert description */
  description: string;
  
  /** Alert severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Alert timestamp */
  timestamp: Date;
  
  /** Metrics that triggered the alert */
  metrics: IAnalyticsMetrics;
  
  /** Alert message */
  message: string;
}

/**
 * Trend analysis result
 */
export interface ITrendAnalysis {
  /** Trend direction */
  direction: 'increasing' | 'decreasing' | 'stable';
  
  /** Trend percentage */
  percentage: number;
  
  /** Confidence level */
  confidence: number;
  
  /** Time period analyzed */
  period: {
    start: Date;
    end: Date;
    duration: number;
  };
  
  /** Data points analyzed */
  dataPoints: number;
  
  /** Trend line data */
  trendLine: Array<{
    timestamp: Date;
    value: number;
  }>;
}

/**
 * Log analytics implementation
 */
export class LogAnalytics {
  private _entries: ILogEntry[] = [];
  private _maxEntries: number = 10000;
  private _alerts: Map<string, IAlertConfig> = new Map();
  private _activeAlerts: Map<string, Date> = new Map();
  private _metricsCache: IAnalyticsMetrics | null = null;
  private _cacheExpiry: number = 60000; // 1 minute
  private _lastCacheUpdate: number = 0;

  constructor(maxEntries?: number) {
    this._maxEntries = maxEntries || 10000;
    this.initializeDefaultAlerts();
  }

  /**
   * Add log entry to analytics
   */
  addEntry(entry: ILogEntry): void {
    // Add entry to collection
    this._entries.push(entry);
    
    // Maintain max entries limit
    if (this._entries.length > this._maxEntries) {
      this._entries = this._entries.slice(-this._maxEntries);
    }
    
    // Invalidate cache
    this._metricsCache = null;
    
    // Check alerts
    this.checkAlerts();
  }

  /**
   * Add multiple log entries
   */
  addEntries(entries: ILogEntry[]): void {
    for (const entry of entries) {
      this.addEntry(entry);
    }
  }

  /**
   * Get analytics metrics
   */
  getMetrics(timeWindow?: { start: Date; end: Date }): IAnalyticsMetrics {
    const now = Date.now();
    
    // Check cache
    if (this._metricsCache && (now - this._lastCacheUpdate) < this._cacheExpiry && !timeWindow) {
      return this._metricsCache;
    }
    
    // Filter entries by time window
    let entries = this._entries;
    if (timeWindow) {
      entries = this._entries.filter(entry => 
        entry.timestamp >= timeWindow.start && entry.timestamp <= timeWindow.end
      );
    }
    
    if (entries.length === 0) {
      return this.createEmptyMetrics(timeWindow);
    }
    
    // Calculate metrics
    const metrics = this.calculateMetrics(entries, timeWindow);
    
    // Cache metrics if no time window specified
    if (!timeWindow) {
      this._metricsCache = metrics;
      this._lastCacheUpdate = now;
    }
    
    return metrics;
  }

  /**
   * Get trend analysis
   */
  getTrendAnalysis(
    metric: keyof IAnalyticsMetrics,
    period: { start: Date; end: Date },
    interval: number = 3600000 // 1 hour
  ): ITrendAnalysis {
    const entries = this._entries.filter(entry => 
      entry.timestamp >= period.start && entry.timestamp <= period.end
    );
    
    if (entries.length === 0) {
      return this.createEmptyTrendAnalysis(period);
    }
    
    // Group entries by interval
    const timeGroups = this.groupEntriesByTime(entries, interval);
    
    // Calculate trend
    const values = Object.values(timeGroups);
    const trend = this.calculateTrend(values);
    
    return {
      ...trend,
      period,
      dataPoints: values.length,
      trendLine: this.createTrendLine(timeGroups, period.start, interval)
    };
  }

  /**
   * Add alert configuration
   */
  addAlert(config: IAlertConfig): void {
    this._alerts.set(config.name, config);
  }

  /**
   * Remove alert configuration
   */
  removeAlert(name: string): void {
    this._alerts.delete(name);
    this._activeAlerts.delete(name);
  }

  /**
   * Get all alert configurations
   */
  getAlerts(): IAlertConfig[] {
    return Array.from(this._alerts.values());
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): IAlert[] {
    const alerts: IAlert[] = [];
    
    for (const [name, timestamp] of this._activeAlerts) {
      const config = this._alerts.get(name);
      if (config) {
        const metrics = this.getMetrics();
        alerts.push({
          name: config.name,
          description: config.description,
          severity: config.severity,
          timestamp,
          metrics,
          message: this.generateAlertMessage(config, metrics)
        });
      }
    }
    
    return alerts;
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this._entries = [];
    this._metricsCache = null;
    this._activeAlerts.clear();
  }

  /**
   * Get entry statistics
   */
  getStatistics(): {
    totalEntries: number;
    maxEntries: number;
    alertCount: number;
    activeAlertCount: number;
    cacheHitRate: number;
    memoryUsage: {
      entries: number;
      alerts: number;
      total: number;
    };
  } {
    return {
      totalEntries: this._entries.length,
      maxEntries: this._maxEntries,
      alertCount: this._alerts.size,
      activeAlertCount: this._activeAlerts.size,
      cacheHitRate: this._metricsCache ? 1 : 0,
      memoryUsage: {
        entries: this._entries.length * 200, // Approximate size per entry
        alerts: this._alerts.size * 100,
        total: this._entries.length * 200 + this._alerts.size * 100
      }
    };
  }

  /**
   * Export analytics data
   */
  exportData(): {
    entries: ILogEntry[];
    alerts: IAlertConfig[];
    metrics: IAnalyticsMetrics;
    exportTimestamp: string;
  } {
    return {
      entries: [...this._entries],
      alerts: this.getAlerts(),
      metrics: this.getMetrics(),
      exportTimestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate metrics from entries
   */
  private calculateMetrics(entries: ILogEntry[], timeWindow?: { start: Date; end: Date }): IAnalyticsMetrics {
    const totalEntries = entries.length;
    const entriesByLevel: Record<string, number> = {};
    const entriesByCategory: Record<string, number> = {};
    const hourlyDistribution: Record<number, number> = {};
    const messageLengths: number[] = [];
    const errorMessages: Map<string, number> = new Map();
    let securityEventCount = 0;
    const processingTimes: number[] = [];

    // Process entries
    for (const entry of entries) {
      // Count by level
      entriesByLevel[entry.level] = (entriesByLevel[entry.level] || 0) + 1;
      
      // Count by category
      entriesByCategory[entry.category] = (entriesByCategory[entry.category] || 0) + 1;
      
      // Hourly distribution
      const hour = entry.timestamp.getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      
      // Message length
      messageLengths.push(entry.message.length);
      
      // Error messages
      if (entry.level === 'ERROR' || entry.level === 'FATAL') {
        const key = entry.message.substring(0, 100); // First 100 chars
        errorMessages.set(key, (errorMessages.get(key) || 0) + 1);
      }
      
      // Security events
      if (entry.level === 'SECURITY') {
        securityEventCount++;
      }
      
      // Processing time (if available)
      if (entry.metadata?.processingTime) {
        processingTimes.push(entry.metadata.processingTime);
      }
    }

    // Calculate averages
    const averageMessageLength = messageLengths.length > 0 
      ? messageLengths.reduce((sum, len) => sum + len, 0) / messageLengths.length 
      : 0;

    const errorCount = (entriesByLevel['ERROR'] || 0) + (entriesByLevel['FATAL'] || 0);
    const errorRate = totalEntries > 0 ? (errorCount / totalEntries) * 100 : 0;

    // Performance metrics
    const performanceMetrics = {
      averageProcessingTime: processingTimes.length > 0 
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
        : 0,
      slowestProcessingTime: processingTimes.length > 0 ? Math.max(...processingTimes) : 0,
      fastestProcessingTime: processingTimes.length > 0 ? Math.min(...processingTimes) : 0
    };

    // Top error messages
    const topErrorMessages = Array.from(errorMessages.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([message, count]) => ({
        message,
        count,
        percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0
      }));

    // Top categories
    const topCategories = Object.entries(entriesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0
      }));

    // Time window
    const timestamps = entries.map(e => e.timestamp.getTime());
    const timeWindowData = {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps)),
      duration: Math.max(...timestamps) - Math.min(...timestamps)
    };

    return {
      totalEntries,
      entriesByLevel,
      entriesByCategory,
      averageMessageLength,
      errorRate,
      securityEventCount,
      performanceMetrics,
      timeWindow: timeWindowData,
      topErrorMessages,
      topCategories,
      hourlyDistribution
    };
  }

  /**
   * Create empty metrics
   */
  private createEmptyMetrics(timeWindow?: { start: Date; end: Date }): IAnalyticsMetrics {
    const now = new Date();
    return {
      totalEntries: 0,
      entriesByLevel: {},
      entriesByCategory: {},
      averageMessageLength: 0,
      errorRate: 0,
      securityEventCount: 0,
      performanceMetrics: {
        averageProcessingTime: 0,
        slowestProcessingTime: 0,
        fastestProcessingTime: 0
      },
      timeWindow: timeWindow || {
        start: now,
        end: now,
        duration: 0
      },
      topErrorMessages: [],
      topCategories: [],
      hourlyDistribution: {}
    };
  }

  /**
   * Group entries by time intervals
   */
  private groupEntriesByTime(entries: ILogEntry[], interval: number): Record<number, number> {
    const groups: Record<number, number> = {};
    
    for (const entry of entries) {
      const timeSlot = Math.floor(entry.timestamp.getTime() / interval) * interval;
      groups[timeSlot] = (groups[timeSlot] || 0) + 1;
    }
    
    return groups;
  }

  /**
   * Calculate trend from values
   */
  private calculateTrend(values: number[]): {
    direction: 'increasing' | 'decreasing' | 'stable';
    percentage: number;
    confidence: number;
  } {
    if (values.length < 2) {
      return { direction: 'stable', percentage: 0, confidence: 0 };
    }

    // Simple linear regression
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared for confidence
    const meanY = sumY / n;
    const totalSumSquares = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
    const residualSumSquares = y.reduce((sum, val, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(val - predicted, 2);
    }, 0);
    
    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    const confidence = Math.max(0, rSquared);
    
    // Determine direction and percentage
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const percentage = firstValue !== 0 ? (change / firstValue) * 100 : 0;
    
    let direction: 'increasing' | 'decreasing' | 'stable';
    if (Math.abs(percentage) < 5) {
      direction = 'stable';
    } else if (percentage > 0) {
      direction = 'increasing';
    } else {
      direction = 'decreasing';
    }
    
    return { direction, percentage, confidence };
  }

  /**
   * Create trend line data
   */
  private createTrendLine(
    timeGroups: Record<number, number>,
    startTime: Date,
    interval: number
  ): Array<{ timestamp: Date; value: number }> {
    return Object.entries(timeGroups)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([timeSlot, value]) => ({
        timestamp: new Date(parseInt(timeSlot)),
        value
      }));
  }

  /**
   * Create empty trend analysis
   */
  private createEmptyTrendAnalysis(period: { start: Date; end: Date }): ITrendAnalysis {
    return {
      direction: 'stable',
      percentage: 0,
      confidence: 0,
      period,
      dataPoints: 0,
      trendLine: []
    };
  }

  /**
   * Initialize default alerts
   */
  private initializeDefaultAlerts(): void {
    // High error rate alert
    this.addAlert({
      name: 'high-error-rate',
      description: 'Error rate exceeds threshold',
      condition: (metrics) => metrics.errorRate > 10,
      severity: 'high',
      enabled: true,
      cooldown: 300000, // 5 minutes
      callback: (alert, metrics) => {
        console.warn(`ALERT: High error rate detected: ${metrics.errorRate.toFixed(2)}%`);
      }
    });

    // Security events alert
    this.addAlert({
      name: 'security-events',
      description: 'Security events detected',
      condition: (metrics) => metrics.securityEventCount > 0,
      severity: 'critical',
      enabled: true,
      cooldown: 60000, // 1 minute
      callback: (alert, metrics) => {
        console.error(`ALERT: Security events detected: ${metrics.securityEventCount}`);
      }
    });

    // High message volume alert
    this.addAlert({
      name: 'high-message-volume',
      description: 'Message volume exceeds threshold',
      condition: (metrics) => metrics.totalEntries > 1000,
      severity: 'medium',
      enabled: true,
      cooldown: 600000, // 10 minutes
      callback: (alert, metrics) => {
        console.info(`ALERT: High message volume: ${metrics.totalEntries} entries`);
      }
    });
  }

  /**
   * Check alerts against current metrics
   */
  private checkAlerts(): void {
    const metrics = this.getMetrics();
    const now = new Date();
    
    for (const [name, config] of this._alerts) {
      if (!config.enabled) continue;
      
      // Check cooldown
      const lastTriggered = this._activeAlerts.get(name);
      if (lastTriggered && (now.getTime() - lastTriggered.getTime()) < config.cooldown) {
        continue;
      }
      
      // Check condition
      if (config.condition(metrics)) {
        // Trigger alert
        const alert: IAlert = {
          name: config.name,
          description: config.description,
          severity: config.severity,
          timestamp: now,
          metrics,
          message: this.generateAlertMessage(config, metrics)
        };
        
        // Update active alerts
        this._activeAlerts.set(name, now);
        
        // Call callback
        config.callback(alert, metrics);
      }
    }
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(config: IAlertConfig, metrics: IAnalyticsMetrics): string {
    return `${config.description}: ${JSON.stringify({
      errorRate: metrics.errorRate.toFixed(2),
      totalEntries: metrics.totalEntries,
      securityEvents: metrics.securityEventCount
    })}`;
  }
}
