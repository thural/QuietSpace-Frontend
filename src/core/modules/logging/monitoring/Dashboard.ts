/**
 * Logging Dashboard
 * 
 * Real-time dashboard for monitoring logging system health and metrics.
 * Provides visualization components and data aggregation.
 */

import { ILogEntry, LogLevel } from '../types';
import { LogAnalytics, IAnalyticsMetrics } from './LogAnalytics';
import { MetricsCollector } from './MetricsCollector';

/**
 * Dashboard data interface
 */
export interface IDashboardData {
  /** Overview metrics */
  overview: {
    totalLogs: number;
    errorRate: number;
    securityEvents: number;
    avgProcessingTime: number;
    activeLoggers: number;
    uptime: number;
  };
  
  /** Recent activity */
  recentActivity: Array<{
    timestamp: Date;
    level: string;
    category: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  
  /** Top errors */
  topErrors: Array<{
    message: string;
    count: number;
    percentage: number;
    lastOccurrence: Date;
  }>;
  
  /** Performance metrics */
  performance: {
    avgProcessingTime: number;
    maxProcessingTime: number;
    minProcessingTime: number;
    throughput: number;
  };
  
  /** Level distribution */
  levelDistribution: Record<string, number>;
  
  /** Category distribution */
  categoryDistribution: Record<string, number>;
  
  /** Hourly activity */
  hourlyActivity: Record<number, number>;
  
  /** Alerts */
  alerts: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
  
  /** Health status */
  health: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    score: number;
  };
}

/**
 * Dashboard configuration
 */
export interface IDashboardConfig {
  /** Update interval in milliseconds */
  updateInterval: number;
  
  /** Maximum recent activity items */
  maxRecentActivity: number;
  
  /** Maximum top errors to display */
  maxTopErrors: number;
  
  /** Time window for metrics */
  timeWindow: {
    recent: number; // minutes
    hourly: number; // hours
    daily: number; // days
  };
  
  /** Alert thresholds */
  thresholds: {
    errorRate: number;
    securityEvents: number;
    processingTime: number;
    throughput: number;
  };
}

/**
 * Logging dashboard implementation
 */
export class LoggingDashboard {
  private _analytics: LogAnalytics;
  private _metricsCollector: MetricsCollector;
  private _config: IDashboardConfig;
  private _updateTimer: NodeJS.Timeout | null = null;
  private _startTime: Date;
  private _lastUpdate: Date | null = null;

  constructor(config?: Partial<IDashboardConfig>) {
    this._analytics = new LogAnalytics();
    this._metricsCollector = new MetricsCollector();
    this._startTime = new Date();
    
    this._config = {
      updateInterval: 30000, // 30 seconds
      maxRecentActivity: 50,
      maxTopErrors: 10,
      timeWindow: {
        recent: 15, // 15 minutes
        hourly: 24, // 24 hours
        daily: 7   // 7 days
      },
      thresholds: {
        errorRate: 5, // 5%
        securityEvents: 0,
        processingTime: 100, // 100ms
        throughput: 1000 // logs per second
      },
      ...config
    };
  }

  /**
   * Start the dashboard
   */
  start(): void {
    if (this._updateTimer) return;
    
    this._updateTimer = setInterval(() => {
      this.update();
    }, this._config.updateInterval);
    
    // Initial update
    this.update();
  }

  /**
   * Stop the dashboard
   */
  stop(): void {
    if (this._updateTimer) {
      clearInterval(this._updateTimer);
      this._updateTimer = null;
    }
  }

  /**
   * Add log entry to dashboard
   */
  addLogEntry(entry: ILogEntry): void {
    this._analytics.addEntry(entry);
    this._metricsCollector.processLogEntries([entry]);
  }

  /**
   * Add multiple log entries
   */
  addLogEntries(entries: ILogEntry[]): void {
    this._analytics.addEntries(entries);
    this._metricsCollector.processLogEntries(entries);
  }

  /**
   * Get current dashboard data
   */
  getDashboardData(): IDashboardData {
    const now = new Date();
    const recentWindow = {
      start: new Date(now.getTime() - this._config.timeWindow.recent * 60000),
      end: now
    };
    
    const metrics = this._analytics.getMetrics(recentWindow);
    const dashboardMetrics = this._metricsCollector.getDashboardData();
    
    return {
      overview: this.calculateOverview(metrics, dashboardMetrics),
      recentActivity: this.getRecentActivity(recentWindow),
      topErrors: this.getTopErrors(metrics),
      performance: this.getPerformanceMetrics(metrics),
      levelDistribution: metrics.entriesByLevel,
      categoryDistribution: metrics.entriesByCategory,
      hourlyActivity: metrics.hourlyActivity,
      alerts: this.getActiveAlerts(),
      health: this.calculateHealth(metrics, dashboardMetrics)
    };
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics(): {
    logsPerSecond: number;
    errorRate: number;
    securityEventsPerMinute: number;
    avgProcessingTime: number;
    activeLoggers: number;
  } {
    const now = Date.now();
    const recentWindow = {
      start: new Date(now - 60000), // Last minute
      end: new Date(now)
    };
    
    const metrics = this._analytics.getMetrics(recentWindow);
    
    return {
      logsPerSecond: metrics.totalEntries / 60,
      errorRate: metrics.errorRate,
      securityEventsPerMinute: metrics.securityEventCount,
      avgProcessingTime: metrics.performanceMetrics.averageProcessingTime,
      activeLoggers: Object.keys(metrics.entriesByCategory).length
    };
  }

  /**
   * Export dashboard data
   */
  exportData(): {
    dashboard: IDashboardData;
    analytics: IAnalyticsMetrics;
    metrics: any;
    exportTimestamp: string;
  } {
    return {
      dashboard: this.getDashboardData(),
      analytics: this._analytics.getMetrics(),
      metrics: this._metricsCollector.getAllMetricSeries(),
      exportTimestamp: new Date().toISOString()
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<IDashboardConfig>): void {
    this._config = { ...this._config, ...config };
    
    // Restart timer if interval changed
    if (config.updateInterval && this._updateTimer) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get dashboard statistics
   */
  getStatistics(): {
    uptime: number;
    lastUpdate: Date | null;
    updateInterval: number;
    totalEntries: number;
    activeAlerts: number;
    healthScore: number;
  } {
    const dashboardData = this.getDashboardData();
    
    return {
      uptime: Date.now() - this._startTime.getTime(),
      lastUpdate: this._lastUpdate,
      updateInterval: this._config.updateInterval,
      totalEntries: this._analytics.getStatistics().totalEntries,
      activeAlerts: dashboardData.alerts.length,
      healthScore: dashboardData.health.score
    };
  }

  /**
   * Update dashboard data
   */
  private update(): void {
    this._lastUpdate = new Date();
    
    // Trigger any additional updates
    this.checkHealthAlerts();
  }

  /**
   * Calculate overview metrics
   */
  private calculateOverview(
    analytics: IAnalyticsMetrics,
    dashboardMetrics: any
  ): IDashboardData['overview'] {
    return {
      totalLogs: analytics.totalEntries,
      errorRate: analytics.errorRate,
      securityEvents: analytics.securityEventCount,
      avgProcessingTime: analytics.performanceMetrics.averageProcessingTime,
      activeLoggers: Object.keys(analytics.entriesByCategory).length,
      uptime: Date.now() - this._startTime.getTime()
    };
  }

  /**
   * Get recent activity
   */
  private getRecentActivity(timeWindow: { start: Date; end: Date }): IDashboardData['recentActivity'] {
    // This would need access to recent log entries
    // For now, return empty array
    return [];
  }

  /**
   * Get top errors
   */
  private getTopErrors(metrics: IAnalyticsMetrics): IDashboardData['topErrors'] {
    return metrics.topErrorMessages.slice(0, this._config.maxTopErrors).map(error => ({
      ...error,
      lastOccurrence: new Date() // Would need actual timestamp
    }));
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(metrics: IAnalyticsMetrics): IDashboardData['performance'] {
    return {
      avgProcessingTime: metrics.performanceMetrics.averageProcessingTime,
      maxProcessingTime: metrics.performanceMetrics.slowestProcessingTime,
      minProcessingTime: metrics.performanceMetrics.fastestProcessingTime,
      throughput: metrics.totalEntries / (metrics.timeWindow.duration / 1000) // per second
    };
  }

  /**
   * Get active alerts
   */
  private getActiveAlerts(): IDashboardData['alerts'] {
    const analyticsAlerts = this._analytics.getActiveAlerts();
    
    return analyticsAlerts.map(alert => ({
      name: alert.name,
      severity: alert.severity,
      message: alert.message,
      timestamp: alert.timestamp
    }));
  }

  /**
   * Calculate health status
   */
  private calculateHealth(
    analytics: IAnalyticsMetrics,
    dashboardMetrics: any
  ): IDashboardData['health'] {
    const issues: string[] = [];
    let score = 100;

    // Check error rate
    if (analytics.errorRate > this._config.thresholds.errorRate) {
      issues.push(`High error rate: ${analytics.errorRate.toFixed(2)}%`);
      score -= 30;
    }

    // Check security events
    if (analytics.securityEventCount > this._config.thresholds.securityEvents) {
      issues.push(`Security events detected: ${analytics.securityEventCount}`);
      score -= 40;
    }

    // Check processing time
    if (analytics.performanceMetrics.averageProcessingTime > this._config.thresholds.processingTime) {
      issues.push(`High processing time: ${analytics.performanceMetrics.averageProcessingTime.toFixed(2)}ms`);
      score -= 20;
    }

    // Check throughput
    const throughput = analytics.totalEntries / (analytics.timeWindow.duration / 1000);
    if (throughput > this._config.thresholds.throughput) {
      issues.push(`High throughput: ${throughput.toFixed(2)} logs/sec`);
      score -= 10;
    }

    // Determine status
    let status: 'healthy' | 'warning' | 'critical';
    if (score >= 80) {
      status = 'healthy';
    } else if (score >= 60) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      status,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Check for health alerts
   */
  private checkHealthAlerts(): void {
    const dashboardData = this.getDashboardData();
    
    // Emit health alerts if needed
    if (dashboardData.health.status === 'critical') {
      console.error('CRITICAL: Logging system health issues detected:', dashboardData.health.issues);
    } else if (dashboardData.health.status === 'warning') {
      console.warn('WARNING: Logging system health issues detected:', dashboardData.health.issues);
    }
  }
}

/**
 * Dashboard manager for multiple instances
 */
export class DashboardManager {
  private _dashboards: Map<string, LoggingDashboard> = new Map();
  private _globalConfig: IDashboardConfig;

  constructor(globalConfig?: Partial<IDashboardConfig>) {
    this._globalConfig = {
      updateInterval: 30000,
      maxRecentActivity: 50,
      maxTopErrors: 10,
      timeWindow: {
        recent: 15,
        hourly: 24,
        daily: 7
      },
      thresholds: {
        errorRate: 5,
        securityEvents: 0,
        processingTime: 100,
        throughput: 1000
      },
      ...globalConfig
    };
  }

  /**
   * Create a new dashboard
   */
  createDashboard(name: string, config?: Partial<IDashboardConfig>): LoggingDashboard {
    const dashboard = new LoggingDashboard({ ...this._globalConfig, ...config });
    this._dashboards.set(name, dashboard);
    return dashboard;
  }

  /**
   * Get a dashboard by name
   */
  getDashboard(name: string): LoggingDashboard | undefined {
    return this._dashboards.get(name);
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): Map<string, LoggingDashboard> {
    return new Map(this._dashboards);
  }

  /**
   * Remove a dashboard
   */
  removeDashboard(name: string): boolean {
    const dashboard = this._dashboards.get(name);
    if (dashboard) {
      dashboard.stop();
      this._dashboards.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Start all dashboards
   */
  startAll(): void {
    for (const dashboard of this._dashboards.values()) {
      dashboard.start();
    }
  }

  /**
   * Stop all dashboards
   */
  stopAll(): void {
    for (const dashboard of this._dashboards.values()) {
      dashboard.stop();
    }
  }

  /**
   * Get aggregated dashboard data
   */
  getAggregatedData(): {
    dashboards: Record<string, IDashboardData>;
    summary: {
      totalLogs: number;
      totalErrors: number;
      totalSecurityEvents: number;
      overallHealth: 'healthy' | 'warning' | 'critical';
    };
  } {
    const dashboards: Record<string, IDashboardData> = {};
    let totalLogs = 0;
    let totalErrors = 0;
    let totalSecurityEvents = 0;
    const healthScores: number[] = [];

    for (const [name, dashboard] of this._dashboards) {
      const data = dashboard.getDashboardData();
      dashboards[name] = data;
      
      totalLogs += data.overview.totalLogs;
      totalErrors += Math.floor(data.overview.totalLogs * data.overview.errorRate / 100);
      totalSecurityEvents += data.overview.securityEvents;
      healthScores.push(data.health.score);
    }

    // Calculate overall health
    const avgHealthScore = healthScores.length > 0 
      ? healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length 
      : 100;
    
    let overallHealth: 'healthy' | 'warning' | 'critical';
    if (avgHealthScore >= 80) {
      overallHealth = 'healthy';
    } else if (avgHealthScore >= 60) {
      overallHealth = 'warning';
    } else {
      overallHealth = 'critical';
    }

    return {
      dashboards,
      summary: {
        totalLogs,
        totalErrors,
        totalSecurityEvents,
        overallHealth
      }
    };
  }

  /**
   * Export all dashboard data
   */
  exportAllData(): {
    dashboards: Record<string, any>;
    summary: any;
    exportTimestamp: string;
  } {
    const dashboards: Record<string, any> = {};
    
    for (const [name, dashboard] of this._dashboards) {
      dashboards[name] = dashboard.exportData();
    }

    return {
      dashboards,
      summary: this.getAggregatedData().summary,
      exportTimestamp: new Date().toISOString()
    };
  }
}
