import 'reflect-metadata';
import { Injectable } from '../../../core/di';
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
  AnalyticsEventType
} from '../domain';

@Injectable({ lifetime: 'singleton' })
export class AnalyticsRepository {
  private events = new Map<string, AnalyticsEntity>();
  private dashboards = new Map<string, AnalyticsDashboard>();
  private reports = new Map<string, AnalyticsReport>();
  private insights = new Map<string, AnalyticsInsight>();
  private funnels = new Map<string, AnalyticsFunnel>();
  private goals = new Map<string, AnalyticsGoal>();

  // Analytics events operations
  async createEvent(event: Omit<AnalyticsEntity, 'id'>): Promise<AnalyticsEntity> {
    const newEvent: AnalyticsEntity = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }

  async createEventWithId(event: AnalyticsEntity): Promise<AnalyticsEntity> {
    this.events.set(event.id, event);
    return event;
  }

  async getEventById(id: string): Promise<AnalyticsEntity | null> {
    return this.events.get(id) || null;
  }

  async getEventsByUser(userId: string, options: {
    limit?: number;
    offset?: number;
    eventType?: AnalyticsEventType;
    dateRange?: DateRange;
  } = {}): Promise<AnalyticsEntity[]> {
    const userEvents = Array.from(this.events.values())
      .filter(event => event.userId === userId)
      .filter(event => !options.eventType || event.eventType === options.eventType)
      .filter(event => {
        if (!options.dateRange) return true;
        return event.timestamp >= options.dateRange.start && event.timestamp <= options.dateRange.end;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const offset = options.offset || 0;
    const limit = options.limit || 100;
    
    return userEvents.slice(offset, offset + limit);
  }

  async getEventsByType(eventType: AnalyticsEventType, options: {
    limit?: number;
    offset?: number;
    dateRange?: DateRange;
  } = {}): Promise<AnalyticsEntity[]> {
    const typeEvents = Array.from(this.events.values())
      .filter(event => event.eventType === eventType)
      .filter(event => {
        if (!options.dateRange) return true;
        return event.timestamp >= options.dateRange.start && event.timestamp <= options.dateRange.end;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const offset = options.offset || 0;
    const limit = options.limit || 100;
    
    return typeEvents.slice(offset, offset + limit);
  }

  async getEventsByDateRange(dateRange: DateRange, options: {
    eventType?: AnalyticsEventType;
    userId?: string;
  } = {}): Promise<AnalyticsEntity[]> {
    return Array.from(this.events.values())
      .filter(event => event.timestamp >= dateRange.start && event.timestamp <= dateRange.end)
      .filter(event => !options.eventType || event.eventType === options.eventType)
      .filter(event => !options.userId || event.userId === options.userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Analytics metrics
  async calculateMetrics(dateRange: DateRange, filters: {
    userId?: string;
    contentType?: string;
    eventTypes?: AnalyticsEventType[];
  } = {}): Promise<AnalyticsMetrics> {
    const events = await this.getEventsByDateRange(dateRange, {
      eventType: filters.eventTypes?.[0]
    });

    const filteredEvents = events.filter(event => 
      !filters.userId || event.userId === filters.userId
    );

    const totalEvents = filteredEvents.length;
    const uniqueUsers = new Set(filteredEvents.map(e => e.userId).filter(Boolean)).size;
    const sessions = new Set(filteredEvents.map(e => e.sessionId)).size;
    
    // Calculate session duration (simplified)
    const sessionDurations = new Map<string, number>();
    filteredEvents.forEach(event => {
      if (!sessionDurations.has(event.sessionId)) {
        sessionDurations.set(event.sessionId, 0);
      }
    });
    
    const averageSessionDuration = sessions > 0 
      ? Array.from(sessionDurations.values()).reduce((sum, duration) => sum + duration, 0) / sessions
      : 0;

    const pageViews = filteredEvents.filter(e => e.eventType === 'page_view').length;
    const contentViews = filteredEvents.filter(e => e.eventType === 'content_view').length;
    const errors = filteredEvents.filter(e => e.eventType === 'error_occurred').length;
    
    const errorRate = totalEvents > 0 ? (errors / totalEvents) * 100 : 0;
    const bounceRate = sessions > 0 ? (sessions - uniqueUsers) / sessions * 100 : 0;
    
    // Simplified engagement calculation
    const engagementEvents = filteredEvents.filter(e => 
      ['content_like', 'content_share', 'content_comment'].includes(e.eventType)
    ).length;
    const userEngagement = uniqueUsers > 0 ? (engagementEvents / uniqueUsers) * 100 : 0;

    return {
      totalEvents,
      uniqueUsers,
      totalSessions: sessions,
      averageSessionDuration,
      bounceRate,
      pageViews,
      contentViews,
      userEngagement,
      conversionRate: 0, // Would need more complex calculation
      errorRate,
      performanceScore: 100 - errorRate // Simplified performance score
    };
  }

  // Dashboard operations
  async createDashboard(dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsDashboard> {
    const newDashboard: AnalyticsDashboard = {
      ...dashboard,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboards.set(newDashboard.id, newDashboard);
    return newDashboard;
  }

  async getDashboardById(id: string): Promise<AnalyticsDashboard | null> {
    return this.dashboards.get(id) || null;
  }

  async getDashboardsByUser(userId: string): Promise<AnalyticsDashboard[]> {
    return Array.from(this.dashboards.values())
      .filter(dashboard => dashboard.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateDashboard(id: string, updates: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard> {
    const existing = this.dashboards.get(id);
    if (!existing) {
      throw new Error(`Dashboard ${id} not found`);
    }

    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };

    this.dashboards.set(id, updated);
    return updated;
  }

  async deleteDashboard(id: string): Promise<void> {
    this.dashboards.delete(id);
  }

  // Widget operations
  async addWidgetToDashboard(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): Promise<DashboardWidget> {
    const dashboard = await this.getDashboardById(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const newWidget: DashboardWidget = {
      ...widget,
      id: Date.now().toString()
    };

    const updatedWidgets = [...dashboard.widgets, newWidget];
    await this.updateDashboard(dashboardId, { widgets: updatedWidgets });
    
    return newWidget;
  }

  async updateWidgetInDashboard(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): Promise<DashboardWidget> {
    const dashboard = await this.getDashboardById(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) {
      throw new Error(`Widget ${widgetId} not found in dashboard ${dashboardId}`);
    }

    const updatedWidget = { ...dashboard.widgets[widgetIndex], ...updates };
    const updatedWidgets = [...dashboard.widgets];
    updatedWidgets[widgetIndex] = updatedWidget;

    await this.updateDashboard(dashboardId, { widgets: updatedWidgets });
    
    return updatedWidget;
  }

  async removeWidgetFromDashboard(dashboardId: string, widgetId: string): Promise<void> {
    const dashboard = await this.getDashboardById(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const updatedWidgets = dashboard.widgets.filter(w => w.id !== widgetId);
    await this.updateDashboard(dashboardId, { widgets: updatedWidgets });
  }

  // Report operations
  async createReport(report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsReport> {
    const newReport: AnalyticsReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reports.set(newReport.id, newReport);
    return newReport;
  }

  async getReportById(id: string): Promise<AnalyticsReport | null> {
    return this.reports.get(id) || null;
  }

  async getReportsByUser(userId: string): Promise<AnalyticsReport[]> {
    return Array.from(this.reports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateReport(id: string, updates: Partial<AnalyticsReport>): Promise<AnalyticsReport> {
    const existing = this.reports.get(id);
    if (!existing) {
      throw new Error(`Report ${id} not found`);
    }

    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };

    this.reports.set(id, updated);
    return updated;
  }

  async deleteReport(id: string): Promise<void> {
    this.reports.delete(id);
  }

  // Insight operations
  async createInsight(insight: Omit<AnalyticsInsight, 'id' | 'detectedAt'>): Promise<AnalyticsInsight> {
    const newInsight: AnalyticsInsight = {
      ...insight,
      id: Date.now().toString(),
      detectedAt: new Date()
    };

    this.insights.set(newInsight.id, newInsight);
    return newInsight;
  }

  async getInsightsByUser(userId: string, options: {
    limit?: number;
    offset?: number;
    type?: string;
  } = {}): Promise<AnalyticsInsight[]> {
    // In a real implementation, insights would be associated with users through dashboards
    return Array.from(this.insights.values())
      .filter(insight => !options.type || insight.type === options.type)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(options.offset || 0, options.limit || 50);
  }

  async deleteInsight(id: string): Promise<void> {
    this.insights.delete(id);
  }

  // Funnel operations
  async createFunnel(funnel: Omit<AnalyticsFunnel, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsFunnel> {
    const newFunnel: AnalyticsFunnel = {
      ...funnel,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.funnels.set(newFunnel.id, newFunnel);
    return newFunnel;
  }

  async getFunnelById(id: string): Promise<AnalyticsFunnel | null> {
    return this.funnels.get(id) || null;
  }

  async getFunnelsByUser(userId: string): Promise<AnalyticsFunnel[]> {
    return Array.from(this.funnels.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Goal operations
  async createGoal(goal: Omit<AnalyticsGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsGoal> {
    const newGoal: AnalyticsGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(newGoal.id, newGoal);
    return newGoal;
  }

  async getGoalById(id: string): Promise<AnalyticsGoal | null> {
    return this.goals.get(id) || null;
  }

  async getGoalsByUser(userId: string): Promise<AnalyticsGoal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.isActive)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateGoalProgress(id: string, progress: Partial<AnalyticsGoal['progress']>): Promise<AnalyticsGoal> {
    const goal = await this.getGoalById(id);
    if (!goal) {
      throw new Error(`Goal ${id} not found`);
    }

    const updatedProgress = { ...goal.progress, ...progress };
    return await this.updateGoal(id, { progress: updatedProgress });
  }

  private async updateGoal(id: string, updates: Partial<AnalyticsGoal>): Promise<AnalyticsGoal> {
    const existing = this.goals.get(id);
    if (!existing) {
      throw new Error(`Goal ${id} not found`);
    }

    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };

    this.goals.set(id, updated);
    return updated;
  }

  // Batch operations
  async createBatchEvents(events: Array<Omit<AnalyticsEntity, 'id'>>): Promise<AnalyticsEntity[]> {
    const createdEvents = await Promise.all(
      events.map(event => this.createEvent(event))
    );
    return createdEvents;
  }

  // Data cleanup
  async cleanupOldEvents(olderThan: Date): Promise<number> {
    let deletedCount = 0;
    for (const [id, event] of this.events.entries()) {
      if (event.timestamp < olderThan) {
        this.events.delete(id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  // Additional methods for test utilities
  async getEvents(): Promise<AnalyticsEntity[]> {
    return Array.from(this.events.values());
  }

  async deleteEvent(id: string): Promise<void> {
    this.events.delete(id);
  }

  async getDashboards(): Promise<AnalyticsDashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async getReports(): Promise<AnalyticsReport[]> {
    return Array.from(this.reports.values());
  }

  async getInsights(): Promise<AnalyticsInsight[]> {
    return Array.from(this.insights.values());
  }
}
