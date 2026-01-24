import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { IAnalyticsRepository, AnalyticsEntity, AnalyticsMetrics, AnalyticsDashboard, DashboardWidget, AnalyticsReport, AnalyticsInsight, AnalyticsFunnel, AnalyticsGoal, DateRange, AnalyticsEventType } from '@features/analytics/domain/entities/IAnalyticsRepository';
import { JwtToken } from '@/shared/api/models/common';
import { ANALYTICS_CACHE_KEYS, ANALYTICS_CACHE_TTL, ANALYTICS_CACHE_INVALIDATION } from '../cache/AnalyticsCacheKeys';

/**
 * Analytics Data Service
 * 
 * Provides intelligent caching and orchestration for analytics data
 * Implements enterprise-grade caching with data-intensive processing strategies
 */
@Injectable()
export class AnalyticsDataService {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.ANALYTICS_REPOSITORY) private repository: IAnalyticsRepository
  ) {}

  // Analytics events operations with caching
  async createEvent(event: Omit<AnalyticsEntity, 'id'>, token: JwtToken): Promise<AnalyticsEntity> {
    try {
      const result = await this.repository.createEvent(event);
      
      // Invalidate relevant caches
      this.invalidateEventCaches(event.userId);
      this.invalidateMetricsCaches();
      
      return result;
    } catch (error) {
      console.error('Error creating analytics event:', error);
      throw error;
    }
  }

  async createEventWithId(event: AnalyticsEntity, token: JwtToken): Promise<AnalyticsEntity> {
    try {
      const result = await this.repository.createEventWithId(event);
      
      // Invalidate relevant caches
      this.invalidateEventCaches(event.userId);
      this.invalidateMetricsCaches();
      
      return result;
    } catch (error) {
      console.error('Error creating analytics event with ID:', error);
      throw error;
    }
  }

  async getEventById(eventId: string, token: JwtToken): Promise<AnalyticsEntity | null> {
    const cacheKey = ANALYTICS_CACHE_KEYS.EVENT(eventId);
    
    let data = this.cache.get<AnalyticsEntity>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getEventById(eventId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.USER_EVENTS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics event by ID:', error);
      return null;
    }
  }

  async getEventsByUser(userId: string, options: {
    limit?: number;
    offset?: number;
    eventType?: AnalyticsEventType;
    dateRange?: DateRange;
  } = {}, token: JwtToken): Promise<AnalyticsEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 100;
    const cacheKey = ANALYTICS_CACHE_KEYS.USER_EVENTS(userId, page, size);
    
    let data = this.cache.get<AnalyticsEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getEventsByUser(userId, options);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.USER_EVENTS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics events by user:', error);
      throw error;
    }
  }

  async getEventsByType(eventType: AnalyticsEventType, options: {
    limit?: number;
    offset?: number;
    dateRange?: DateRange;
  } = {}, token: JwtToken): Promise<AnalyticsEntity[]> {
    const page = options.offset || 0;
    const size = options.limit || 100;
    const cacheKey = ANALYTICS_CACHE_KEYS.EVENTS_BY_TYPE(eventType, page, size);
    
    let data = this.cache.get<AnalyticsEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getEventsByType(eventType, options);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.EVENTS_BY_TYPE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics events by type:', error);
      throw error;
    }
  }

  async getEventsByDateRange(dateRange: DateRange, options: {
    eventType?: AnalyticsEventType;
    userId?: string;
  } = {}, token: JwtToken): Promise<AnalyticsEntity[]> {
    const dateHash = this.generateDateRangeHash(dateRange);
    const cacheKey = ANALYTICS_CACHE_KEYS.EVENTS_BY_DATE_RANGE(dateHash, 0, 100);
    
    let data = this.cache.get<AnalyticsEntity[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getEventsByDateRange(dateRange, options);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.EVENTS_BY_DATE_RANGE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics events by date range:', error);
      throw error;
    }
  }

  // Analytics metrics operations with caching
  async calculateMetrics(dateRange: DateRange, filters: {
    userId?: string;
    contentType?: string;
    eventTypes?: AnalyticsEventType[];
  } = {}, token: JwtToken): Promise<AnalyticsMetrics> {
    const dateHash = this.generateDateRangeHash(dateRange);
    const filtersHash = this.generateFiltersHash(filters);
    const cacheKey = ANALYTICS_CACHE_KEYS.METRICS(dateHash, filtersHash);
    
    let data = this.cache.get<AnalyticsMetrics>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.calculateMetrics(dateRange, filters);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error calculating analytics metrics:', error);
      throw error;
    }
  }

  async getRealtimeMetrics(userId?: string, token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.REAL_TIME_METRICS(userId);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getRealtimeMetrics(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.REAL_TIME_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(period: string = '24h', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.PERFORMANCE_METRICS(period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getPerformanceMetrics(period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.PERFORMANCE_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getEngagementMetrics(userId: string, period: string = '7d', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.ENGAGEMENT_METRICS(userId, period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getEngagementMetrics(userId, period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.ENGAGEMENT_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      throw error;
    }
  }

  async getConversionMetrics(funnelId?: string, period: string = '30d', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.CONVERSION_METRICS(funnelId, period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getConversionMetrics(funnelId, period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.CONVERSION_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching conversion metrics:', error);
      throw error;
    }
  }

  async getTrafficMetrics(period: string = '24h', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.TRAFFIC_METRICS(period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getTrafficMetrics(period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.TRAFFIC_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching traffic metrics:', error);
      throw error;
    }
  }

  async getContentMetrics(contentType?: string, period: string = '7d', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.CONTENT_METRICS(contentType, period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getContentMetrics(contentType, period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.CONTENT_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching content metrics:', error);
      throw error;
    }
  }

  async getBehaviorMetrics(userId: string, period: string = '30d', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.USER_BEHAVIOR(userId, period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getBehaviorMetrics(userId, period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.USER_BEHAVIOR);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching behavior metrics:', error);
      throw error;
    }
  }

  async getErrorMetrics(period: string = '24h', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.ERROR_METRICS(period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getErrorMetrics(period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.ERROR_METRICS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching error metrics:', error);
      throw error;
    }
  }

  // Dashboard operations with caching
  async createDashboard(dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>, token: JwtToken): Promise<AnalyticsDashboard> {
    try {
      const result = await this.repository.createDashboard(dashboard);
      
      // Invalidate user dashboards cache
      if (dashboard.userId) {
        this.cache.delete(ANALYTICS_CACHE_KEYS.USER_DASHBOARDS(dashboard.userId));
      }
      
      return result;
    } catch (error) {
      console.error('Error creating analytics dashboard:', error);
      throw error;
    }
  }

  async getDashboardById(dashboardId: string, token: JwtToken): Promise<AnalyticsDashboard | null> {
    const cacheKey = ANALYTICS_CACHE_KEYS.DASHBOARD(dashboardId);
    
    let data = this.cache.get<AnalyticsDashboard>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getDashboardById(dashboardId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.DASHBOARD);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics dashboard by ID:', error);
      return null;
    }
  }

  async getDashboardsByUser(userId: string, token: JwtToken): Promise<AnalyticsDashboard[]> {
    const cacheKey = ANALYTICS_CACHE_KEYS.USER_DASHBOARDS(userId);
    
    let data = this.cache.get<AnalyticsDashboard[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getDashboardsByUser(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.USER_DASHBOARDS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics dashboards by user:', error);
      throw error;
    }
  }

  async updateDashboard(dashboardId: string, updates: Partial<AnalyticsDashboard>, token: JwtToken): Promise<AnalyticsDashboard> {
    try {
      const result = await this.repository.updateDashboard(dashboardId, updates);
      
      // Invalidate caches
      this.cache.delete(ANALYTICS_CACHE_KEYS.DASHBOARD(dashboardId));
      if (result.userId) {
        this.cache.delete(ANALYTICS_CACHE_KEYS.USER_DASHBOARDS(result.userId));
      }
      
      return result;
    } catch (error) {
      console.error('Error updating analytics dashboard:', error);
      throw error;
    }
  }

  async deleteDashboard(dashboardId: string, token: JwtToken): Promise<void> {
    try {
      await this.repository.deleteDashboard(dashboardId);
      
      // Invalidate caches
      this.cache.delete(ANALYTICS_CACHE_KEYS.DASHBOARD(dashboardId));
      
      // Note: We don't know the user ID here, so user dashboards cache will be invalidated
      // when the user fetches their dashboards again
    } catch (error) {
      console.error('Error deleting analytics dashboard:', error);
      throw error;
    }
  }

  // Report operations with caching
  async createReport(report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>, token: JwtToken): Promise<AnalyticsReport> {
    try {
      const result = await this.repository.createReport(report);
      
      // Invalidate user reports cache
      if (report.userId) {
        this.cache.delete(ANALYTICS_CACHE_KEYS.USER_REPORTS(report.userId));
      }
      
      return result;
    } catch (error) {
      console.error('Error creating analytics report:', error);
      throw error;
    }
  }

  async getReportById(reportId: string, token: JwtToken): Promise<AnalyticsReport | null> {
    const cacheKey = ANALYTICS_CACHE_KEYS.REPORT(reportId);
    
    let data = this.cache.get<AnalyticsReport>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getReportById(reportId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.REPORT);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics report by ID:', error);
      return null;
    }
  }

  async getReportsByUser(userId: string, token: JwtToken): Promise<AnalyticsReport[]> {
    const cacheKey = ANALYTICS_CACHE_KEYS.USER_REPORTS(userId);
    
    let data = this.cache.get<AnalyticsReport[]>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getReportsByUser(userId);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.USER_REPORTS);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics reports by user:', error);
      throw error;
    }
  }

  // Aggregated data operations with caching
  async getAggregatedData(aggregationType: string, dateRange: DateRange, filters?: Record<string, any>, token: JwtToken): Promise<any> {
    const dateHash = this.generateDateRangeHash(dateRange);
    const filtersHash = this.generateFiltersHash(filters);
    const cacheKey = ANALYTICS_CACHE_KEYS.AGGREGATED_DATA(aggregationType, dateHash, filtersHash);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getAggregatedData(aggregationType, dateRange, filters);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.AGGREGATED_DATA);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching aggregated analytics data:', error);
      throw error;
    }
  }

  async getTrendData(metric: string, period: string, granularity: string = 'daily', token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.TREND_DATA(metric, period, granularity);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getTrendData(metric, period, granularity);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.TREND_DATA);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching trend analytics data:', error);
      throw error;
    }
  }

  async getComparisonData(metric1: string, metric2: string, period: string, token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.COMPARISON_DATA(metric1, metric2, period);
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getComparisonData(metric1, metric2, period);
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.COMPARISON_DATA);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching comparison analytics data:', error);
      throw error;
    }
  }

  // System health and monitoring
  async getSystemHealth(token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.SYSTEM_HEALTH();
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getSystemHealth();
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.SYSTEM_HEALTH);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  async getProcessingQueueStatus(token: JwtToken): Promise<any> {
    const cacheKey = ANALYTICS_CACHE_KEYS.PROCESSING_QUEUE();
    
    let data = this.cache.get<any>(cacheKey);
    if (data) return data;
    
    try {
      data = await this.repository.getProcessingQueueStatus();
      
      if (data) {
        this.cache.set(cacheKey, data, ANALYTICS_CACHE_TTL.PROCESSING_QUEUE);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching processing queue status:', error);
      throw error;
    }
  }

  // Cache management utilities
  private invalidateEventCaches(userId?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateEvents(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateMetricsCaches(dateRange?: string, filters?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateMetrics(dateRange, filters);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateDashboardCaches(dashboardId?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateDashboard(dashboardId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateReportCaches(userId?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateReports(userId);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateAggregatedData(aggregationType?: string, dateRange?: string, filters?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateAggregatedData(aggregationType, dateRange, filters);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateTrendData(metric?: string, period?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateTrendData(metric, period);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  private invalidateComparisonData(metric1?: string, metric2?: string, period?: string): void {
    const patterns = ANALYTICS_CACHE_INVALIDATION.invalidateComparisonData(metric1, metric2, period);
    patterns.forEach(pattern => this.cache.invalidatePattern(pattern));
  }

  // Cache statistics and monitoring
  getCacheStats() {
    return this.cache.getStats();
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Utility methods
  private generateDateRangeHash(dateRange: DateRange): string {
    const start = dateRange.start.toISOString().split('T')[0];
    const end = dateRange.end.toISOString().split('T')[0];
    return btoa(`${start}_${end}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private generateFiltersHash(filters: Record<string, any>): string {
    const sortedKeys = Object.keys(filters).sort();
    const filterString = sortedKeys.map(key => `${key}:${filters[key]}`).join('|');
    return btoa(filterString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  // Batch operations
  async createBatchEvents(events: Array<Omit<AnalyticsEntity, 'id'>>, token: JwtToken): Promise<AnalyticsEntity[]> {
    try {
      const result = await this.repository.createBatchEvents(events);
      
      // Invalidate relevant caches
      const userIds = [...new Set(events.map(e => e.userId).filter(Boolean))];
      userIds.forEach(userId => this.invalidateEventCaches(userId));
      this.invalidateMetricsCaches();
      
      return result;
    } catch (error) {
      console.error('Error creating batch analytics events:', error);
      throw error;
    }
  }

  // Data cleanup
  async cleanupOldEvents(olderThan: Date, token: JwtToken): Promise<number> {
    try {
      const result = await this.repository.cleanupOldEvents(olderThan);
      
      // Invalidate all event-related caches
      this.invalidateEventCaches();
      
      return result;
    } catch (error) {
      console.error('Error cleaning up old analytics events:', error);
      throw error;
    }
  }
}
