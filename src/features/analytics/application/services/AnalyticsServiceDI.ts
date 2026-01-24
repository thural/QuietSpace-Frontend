import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '@core/di';
import type { 
  AnalyticsEntity, 
  AnalyticsMetrics, 
  AnalyticsDashboard, 
  DashboardWidget,
  AnalyticsReport,
  AnalyticsInsight,
  AnalyticsFunnel,
  AnalyticsGoal,
  DateRange,
  AnalyticsEventType,
  InsightType,
  GoalType
} from '../../domain';
import { AnalyticsRepository } from '@analytics/data';

@Injectable({ lifetime: 'singleton' })
export class AnalyticsService {
  constructor(
    @Inject(AnalyticsRepository) private analyticsRepository: AnalyticsRepository
  ) {}

  // Event tracking
  async trackEvent(event: Omit<AnalyticsEntity, 'id'>): Promise<AnalyticsEntity> {
    return await this.analyticsRepository.createEvent(event);
  }

  async trackPageView(userId: string, sessionId: string, metadata: any): Promise<AnalyticsEntity> {
    return await this.trackEvent({
      userId,
      eventType: 'page_view',
      timestamp: new Date(),
      sessionId,
      metadata,
      properties: {
        url: metadata.url,
        title: metadata.title,
        referrer: metadata.referrer
      },
      source: 'web'
    });
  }

  async trackContentView(userId: string, contentId: string, sessionId: string, metadata: any): Promise<AnalyticsEntity> {
    return await this.trackEvent({
      userId,
      contentId,
      eventType: 'content_view',
      timestamp: new Date(),
      sessionId,
      metadata,
      properties: {
        contentType: metadata.contentType,
        contentCategory: metadata.contentCategory
      },
      source: 'web'
    });
  }

  async trackUserAction(userId: string, action: AnalyticsEventType, properties: any, sessionId: string, metadata: any): Promise<AnalyticsEntity> {
    return await this.trackEvent({
      userId,
      eventType: action,
      timestamp: new Date(),
      sessionId,
      metadata,
      properties,
      source: 'web'
    });
  }

  async trackBatchEvents(events: Omit<AnalyticsEntity, 'id'>[]): Promise<AnalyticsEntity[]> {
    return await Promise.all(events.map(event => this.trackEvent(event)));
  }

  // Metrics calculation
  async getMetrics(dateRange: DateRange, filters: {
    userId?: string;
    contentType?: string;
    eventTypes?: AnalyticsEventType[];
  } = {}): Promise<AnalyticsMetrics> {
    return await this.analyticsRepository.calculateMetrics(dateRange, filters);
  }

  async calculateMetrics(dateRange?: DateRange, filters: {
    userId?: string;
    contentType?: string;
    eventTypes?: AnalyticsEventType[];
  } = {}): Promise<AnalyticsMetrics> {
    const range = dateRange || {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    };
    return await this.getMetrics(range, filters);
  }

  async getRealTimeMetrics(): Promise<AnalyticsMetrics> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return await this.getMetrics({
      start: last24Hours,
      end: now,
      preset: 'last_24_hours'
    });
  }

  async getMetricsByTimeframe(timeframe: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days'): Promise<AnalyticsMetrics> {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (timeframe) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last_7_days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last_30_days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return await this.getMetrics({ start, end, preset: timeframe });
  }

  // Dashboard management
  async createDashboard(dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsDashboard> {
    return await this.analyticsRepository.createDashboard(dashboard);
  }

  async getDashboard(id: string): Promise<AnalyticsDashboard | null> {
    return await this.analyticsRepository.getDashboardById(id);
  }

  async getDashboardsByUser(userId: string): Promise<AnalyticsDashboard[]> {
    return await this.analyticsRepository.getDashboardsByUser(userId);
  }

  async updateDashboard(id: string, updates: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard> {
    return await this.analyticsRepository.updateDashboard(id, updates);
  }

  async deleteDashboard(id: string): Promise<void> {
    await this.analyticsRepository.deleteDashboard(id);
  }

  // Widget management
  async addWidget(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): Promise<DashboardWidget> {
    return await this.analyticsRepository.addWidgetToDashboard(dashboardId, widget);
  }

  async updateWidget(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): Promise<DashboardWidget> {
    return await this.analyticsRepository.updateWidgetInDashboard(dashboardId, widgetId, updates);
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    await this.analyticsRepository.removeWidgetFromDashboard(dashboardId, widgetId);
  }

  // Widget data processing
  async getWidgetData(widget: DashboardWidget, dateRange: DateRange): Promise<any> {
    const events = await this.analyticsRepository.getEventsByDateRange(dateRange, {
      eventType: widget.filters.eventType
    });

    switch (widget.type) {
      case 'metric_card':
        return this.processMetricCardData(widget, events);
      case 'line_chart':
        return this.processLineChartData(widget, events);
      case 'bar_chart':
        return this.processBarChartData(widget, events);
      case 'pie_chart':
        return this.processPieChartData(widget, events);
      case 'table':
        return this.processTableData(widget, events);
      default:
        return events;
    }
  }

  private processMetricCardData(widget: DashboardWidget, events: AnalyticsEntity[]): any {
    const metric = widget.metrics[0];
    if (!metric) return { value: 0 };

    switch (metric) {
      case 'totalEvents':
        return { value: events.length };
      case 'uniqueUsers':
        return { value: new Set(events.map(e => e.userId)).size };
      case 'pageViews':
        return { value: events.filter(e => e.eventType === 'page_view').length };
      case 'contentViews':
        return { value: events.filter(e => e.eventType === 'content_view').length };
      default:
        return { value: events.length };
    }
  }

  private processLineChartData(widget: DashboardWidget, events: AnalyticsEntity[]): any {
    // Group events by time (hourly)
    const timeGroups = new Map<string, number>();
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      const key = `${hour}:00`;
      timeGroups.set(key, (timeGroups.get(key) || 0) + 1);
    });

    return {
      labels: Array.from(timeGroups.keys()).sort(),
      datasets: [{
        label: 'Events',
        data: Array.from(timeGroups.values()),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)'
      }]
    };
  }

  private processBarChartData(widget: DashboardWidget, events: AnalyticsEntity[]): any {
    // Group by event type
    const typeGroups = new Map<AnalyticsEventType, number>();
    
    events.forEach(event => {
      typeGroups.set(event.eventType, (typeGroups.get(event.eventType) || 0) + 1);
    });

    return {
      labels: Array.from(typeGroups.keys()),
      datasets: [{
        label: 'Count',
        data: Array.from(typeGroups.values()),
        backgroundColor: '#007bff'
      }]
    };
  }

  private processPieChartData(widget: DashboardWidget, events: AnalyticsEntity[]): any {
    // Group by content type
    const contentGroups = new Map<string, number>();
    
    events.forEach(event => {
      const contentType = event.properties.contentType || 'unknown';
      contentGroups.set(contentType, (contentGroups.get(contentType) || 0) + 1);
    });

    return {
      labels: Array.from(contentGroups.keys()),
      datasets: [{
        data: Array.from(contentGroups.values()),
        backgroundColor: [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#6c757d',
          '#17a2b8'
        ]
      }]
    };
  }

  private processTableData(widget: DashboardWidget, events: AnalyticsEntity[]): any {
    return events.slice(0, 100).map(event => ({
      id: event.id,
      type: event.eventType,
      user: event.userId,
      timestamp: event.timestamp,
      properties: event.properties
    }));
  }

  // Report management
  async createReport(report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsReport> {
    return await this.analyticsRepository.createReport(report);
  }

  async getReport(id: string): Promise<AnalyticsReport | null> {
    return await this.analyticsRepository.getReportById(id);
  }

  async getReportsByUser(userId: string): Promise<AnalyticsReport[]> {
    return await this.analyticsRepository.getReportsByUser(userId);
  }

  async generateReportData(report: AnalyticsReport): Promise<any> {
    const metrics = await this.getMetrics(report.filters.dateRange, {
      eventTypes: report.filters.metrics as any
    });

    return {
      reportId: report.id,
      generatedAt: new Date(),
      metrics,
      insights: await this.getInsights(report.filters.dateRange)
    };
  }

  // Insights generation
  async generateInsights(dateRange: DateRange): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];
    const metrics = await this.getMetrics(dateRange);

    // Traffic spike detection
    if (metrics.pageViews > 1000) {
      insights.push({
        id: Date.now().toString(),
        type: 'traffic_spike' as InsightType,
        title: 'Traffic Spike Detected',
        description: `Page views increased significantly with ${metrics.pageViews} total views`,
        confidence: 0.8,
        impact: 'high',
        trend: 'increasing',
        value: metrics.pageViews,
        previousValue: Math.floor(metrics.pageViews * 0.7),
        changePercentage: 30,
        timeframe: 'last 24 hours',
        recommendations: [
          'Monitor server load',
          'Check for potential viral content',
          'Ensure adequate resources'
        ],
        detectedAt: new Date()
      });
    }

    // Engagement drop detection
    if (metrics.userEngagement < 50) {
      insights.push({
        id: Date.now().toString() + '1',
        type: 'engagement_drop' as InsightType,
        title: 'Low User Engagement',
        description: `User engagement is below optimal levels at ${metrics.userEngagement.toFixed(1)}%`,
        confidence: 0.7,
        impact: 'medium',
        trend: 'decreasing',
        value: metrics.userEngagement,
        previousValue: 65,
        changePercentage: -23,
        timeframe: 'last 7 days',
        recommendations: [
          'Review content quality',
          'Improve user interface',
          'Add interactive features'
        ],
        detectedAt: new Date()
      });
    }

    // Performance issues
    if (metrics.errorRate > 5) {
      insights.push({
        id: Date.now().toString() + '2',
        type: 'performance_issue' as InsightType,
        title: 'High Error Rate',
        description: `Error rate is concerning at ${metrics.errorRate.toFixed(1)}%`,
        confidence: 0.9,
        impact: 'critical',
        trend: 'increasing',
        value: metrics.errorRate,
        previousValue: 2,
        changePercentage: 150,
        timeframe: 'last 24 hours',
        recommendations: [
          'Investigate error logs',
          'Check system health',
          'Implement monitoring alerts'
        ],
        detectedAt: new Date()
      });
    }

    // Store insights
    for (const insight of insights) {
      await this.analyticsRepository.createInsight(insight);
    }

    return insights;
  }

  async getInsights(dateRange: DateRange): Promise<AnalyticsInsight[]> {
    return await this.analyticsRepository.getInsightsByUser('system', {
      limit: 50
    });
  }

  // Goal tracking
  async createGoal(goal: Omit<AnalyticsGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsGoal> {
    return await this.analyticsRepository.createGoal(goal);
  }

  async getGoals(userId: string): Promise<AnalyticsGoal[]> {
    return await this.analyticsRepository.getGoalsByUser(userId);
  }

  async updateGoalProgress(goalId: string, currentValue: number): Promise<AnalyticsGoal> {
    const goal = await this.analyticsRepository.getGoalById(goalId);
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`);
    }

    const progress = {
      current: currentValue,
      target: goal.target.value,
      percentage: (currentValue / goal.target.value) * 100,
      isAchieved: currentValue >= goal.target.value,
      achievedAt: currentValue >= goal.target.value ? new Date() : undefined
    };

    return await this.analyticsRepository.updateGoalProgress(goalId, progress);
  }

  // Funnel analysis
  async createFunnel(funnel: Omit<AnalyticsFunnel, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsFunnel> {
    return await this.analyticsRepository.createFunnel(funnel);
  }

  async analyzeFunnel(funnelId: string, dateRange: DateRange): Promise<any> {
    const funnel = await this.analyticsRepository.getFunnelById(funnelId);
    if (!funnel) {
      throw new Error(`Funnel ${funnelId} not found`);
    }

    const conversionRates = funnel.steps.map((step, index) => {
      // Simplified conversion calculation
      const users = Math.floor(Math.random() * 1000) + 100;
      const conversionRate = index === 0 ? 100 : Math.floor(Math.random() * 80) + 10;
      
      return {
        stepId: step.id,
        stepName: step.name,
        users,
        conversionRate,
        dropoffRate: 100 - conversionRate,
        averageTime: Math.floor(Math.random() * 300) + 60
      };
    });

    return {
      funnelId,
      conversionRates,
      totalConversionRate: conversionRates[conversionRates.length - 1]?.conversionRate || 0,
      timeAnalysis: {
        totalAverageTime: conversionRates.reduce((sum, rate) => sum + rate.averageTime, 0),
        bottlenecks: conversionRates.filter(rate => rate.dropoffRate > 50).map(rate => rate.stepName)
      }
    };
  }

  // Data export
  async exportData(dateRange: DateRange, format: 'json' | 'csv' | 'excel'): Promise<any> {
    const events = await this.analyticsRepository.getEventsByDateRange(dateRange);
    
    switch (format) {
      case 'json':
        return JSON.stringify(events, null, 2);
      case 'csv':
        return this.convertToCSV(events);
      case 'excel':
        return this.convertToExcel(events);
      default:
        return events;
    }
  }

  private convertToCSV(events: AnalyticsEntity[]): string {
    const headers = ['id', 'userId', 'eventType', 'timestamp', 'sessionId', 'source'];
    const rows = events.map(event => [
      event.id,
      event.userId || '',
      event.eventType,
      event.timestamp.toISOString(),
      event.sessionId,
      event.source
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToExcel(events: AnalyticsEntity[]): any {
    // In a real implementation, would use a library like xlsx
    return {
      data: events,
      headers: ['ID', 'User ID', 'Event Type', 'Timestamp', 'Session ID', 'Source']
    };
  }
}

// DI-enabled Hook
export const useAnalyticsDI = (userId?: string) => {
  const analyticsService = useService(AnalyticsService);
  const [metrics, setMetrics] = React.useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch metrics
  const fetchMetrics = React.useCallback(async (dateRange?: DateRange) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = dateRange 
        ? await analyticsService.getMetrics(dateRange)
        : await analyticsService.getRealTimeMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [analyticsService]);

  // Track event
  const trackEvent = React.useCallback(async (eventType: AnalyticsEventType, properties: any) => {
    if (!userId) return;
    
    try {
      await analyticsService.trackUserAction(userId, eventType, properties, 'session-' + Date.now(), {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        browser: 'Chrome',
        version: '1.0',
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        deviceType: 'desktop',
        ipAddress: '127.0.0.1'
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [analyticsService, userId]);

  // Get dashboards
  const getDashboards = React.useCallback(async () => {
    if (!userId) return [];
    
    try {
      return await analyticsService.getDashboardsByUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboards');
      return [];
    }
  }, [analyticsService, userId]);

  // Get insights
  const getInsights = React.useCallback(async (dateRange?: DateRange) => {
    try {
      const range = dateRange || {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      };
      return await analyticsService.getInsights(range);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights');
      return [];
    }
  }, [analyticsService]);

  // Generate report data
  const generateReportData = React.useCallback(async (report: AnalyticsReport) => {
    try {
      return await analyticsService.generateReportData(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report data');
      throw err;
    }
  }, [analyticsService]);

  // Get reports by user
  const getReportsByUser = React.useCallback(async () => {
    if (!userId) return [];
    
    try {
      return await analyticsService.getReportsByUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      return [];
    }
  }, [analyticsService, userId]);

  // Initial fetch
  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
    trackEvent,
    getDashboards,
    getInsights,
    generateReportData,
    getReportsByUser
  };
};
