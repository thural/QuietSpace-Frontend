import 'reflect-metadata';
import { Container } from '@core/di';
import { AnalyticsService } from '@analytics/application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '@analytics/data';
import { initializeAnalyticsContainer } from '@analytics/di';

/**
 * Test utilities for Analytics feature testing
 */

export interface TestAnalyticsData {
  events: any[];
  dashboards: any[];
  reports: any[];
  insights: any[];
  metrics: any;
}

export class AnalyticsTestUtils {
  private container: Container;
  private analyticsService: AnalyticsService;
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.setupTestContainer();
  }

  private setupTestContainer(): void {
    // Initialize test container
    this.container = initializeAnalyticsContainer();
    this.analyticsService = this.container.resolve(AnalyticsService);
    this.analyticsRepository = this.container.resolve(AnalyticsRepository);
  }

  /**
   * Generate mock analytics data for testing
   */
  generateMockData(): TestAnalyticsData {
    const events = Array.from({ length: 100 }, (_, i) => ({
      id: `event-${i}`,
      userId: `user-${Math.floor(Math.random() * 10)}`,
      sessionId: `session-${Math.floor(Math.random() * 5)}`,
      eventType: 'page_view',
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      metadata: {
        page: `/page-${Math.floor(Math.random() * 10)}`,
        userAgent: 'Test Agent',
        referrer: 'test'
      }
    }));

    const dashboards = [
      {
        id: 'dashboard-1',
        name: 'Test Dashboard',
        description: 'Test dashboard for unit testing',
        widgets: [
          {
            id: 'widget-1',
            type: 'metric_card' as const,
            title: 'Test Metric',
            description: 'Test metric widget',
            dataSource: 'analytics',
            metrics: ['page_views'],
            filters: {
              dateRange: {
                start: new Date('2024-01-01'),
                end: new Date('2024-01-31'),
                preset: 'last_30_days' as const
              },
              customFilters: {}
            },
            visualization: {
              chartType: 'metric',
              aggregation: 'sum' as const
            },
            position: { x: 0, y: 0 },
            size: { width: 4, height: 2 },
            refreshInterval: 30000
          }
        ],
        isPublic: false,
        userId: 'test-user',
        layout: {
          columns: 12,
          rowHeight: 100,
          margin: [10, 10] as [number, number],
          containerPadding: [10, 10] as [number, number]
        },
        filters: {
          globalDateRange: {
            start: new Date('2024-01-01'),
            end: new Date('2024-01-31'),
            preset: 'last_30_days' as const
          },
          customFilters: {}
        },
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const reports = [
      {
        id: 'report-1',
        name: 'Test Report',
        description: 'Test report for unit testing',
        type: 'summary',
        template: {
          sections: ['overview', 'metrics']
        },
        filters: {
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date()
          }
        },
        format: 'pdf',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const insights = [
      {
        id: 'insight-1',
        type: 'trend',
        title: 'Test Insight',
        description: 'Test insight for unit testing',
        confidence: 0.85,
        impact: 'medium',
        recommendations: ['Test recommendation 1', 'Test recommendation 2'],
        createdAt: new Date()
      }
    ];

    const metrics = {
      pageViews: 1250,
      uniqueUsers: 340,
      totalSessions: 890,
      avgSessionDuration: 245,
      bounceRate: 32.5,
      userEngagement: 78.2,
      conversionRate: 3.4
    };

    return {
      events,
      dashboards,
      reports,
      insights,
      metrics
    };
  }

  /**
   * Setup test data in repository
   */
  async setupTestData(data?: Partial<TestAnalyticsData>): Promise<void> {
    const testData = { ...this.generateMockData(), ...data };

    // Clear existing data
    await this.clearTestData();

    // Setup events
    for (const event of testData.events) {
      await this.analyticsRepository.createEvent(event);
    }

    // Setup dashboards
    for (const dashboard of testData.dashboards) {
      await this.analyticsRepository.createDashboard(dashboard);
    }

    // Setup reports
    for (const report of testData.reports) {
      await this.analyticsRepository.createReport(report);
    }

    // Setup insights
    for (const insight of testData.insights) {
      await this.analyticsRepository.createInsight(insight);
    }
  }

  /**
   * Clear test data from repository
   */
  async clearTestData(): Promise<void> {
    try {
      // Clear events
      const events = await this.analyticsRepository.getEvents();
      for (const event of events) {
        await this.analyticsRepository.deleteEvent(event.id);
      }

      // Clear dashboards
      const dashboards = await this.analyticsRepository.getDashboards();
      for (const dashboard of dashboards) {
        await this.analyticsRepository.deleteDashboard(dashboard.id);
      }

      // Clear reports
      const reports = await this.analyticsRepository.getReports();
      for (const report of reports) {
        await this.analyticsRepository.deleteReport(report.id);
      }

      // Clear insights
      const insights = await this.analyticsRepository.getInsights();
      for (const insight of insights) {
        await this.analyticsRepository.deleteInsight(insight.id);
      }
    } catch (error) {
      console.error('Failed to clear test data:', error);
    }
  }

  /**
   * Get analytics service instance for testing
   */
  getAnalyticsService(): AnalyticsService {
    return this.analyticsService;
  }

  /**
   * Get analytics repository instance for testing
   */
  getAnalyticsRepository(): AnalyticsRepository {
    return this.analyticsRepository;
  }

  /**
   * Get test container instance
   */
  getContainer(): Container {
    return this.container;
  }

  /**
   * Create mock user context for testing
   */
  createMockUserContext(userId: string = 'test-user') {
    return {
      userId,
      sessionId: `test-session-${Date.now()}`,
      userAgent: 'Test Agent',
      timestamp: new Date()
    };
  }

  /**
   * Assert analytics data integrity
   */
  async assertDataIntegrity(expectedData: Partial<TestAnalyticsData>): Promise<void> {
    if (expectedData.events) {
      const events = await this.analyticsRepository.getEvents();
      expect(events.length).toBeGreaterThanOrEqual(expectedData.events.length);
    }

    if (expectedData.dashboards) {
      const dashboards = await this.analyticsRepository.getDashboards();
      expect(dashboards.length).toBeGreaterThanOrEqual(expectedData.dashboards.length);
    }

    if (expectedData.reports) {
      const reports = await this.analyticsRepository.getReports();
      expect(reports.length).toBeGreaterThanOrEqual(expectedData.reports.length);
    }

    if (expectedData.insights) {
      const insights = await this.analyticsRepository.getInsights();
      expect(insights.length).toBeGreaterThanOrEqual(expectedData.insights.length);
    }
  }

  /**
   * Cleanup test resources
   */
  async cleanup(): Promise<void> {
    await this.clearTestData();
    this.container.dispose();
  }
}

/**
 * Factory function to create analytics test utilities
 */
export function createAnalyticsTestUtils(): AnalyticsTestUtils {
  return new AnalyticsTestUtils();
}

/**
 * Mock analytics service for testing
 */
export class MockAnalyticsService {
  private events: any[] = [];
  private dashboards: any[] = [];
  private reports: any[] = [];
  private insights: any[] = [];

  async trackEvent(event: any): Promise<void> {
    this.events.push({ ...event, id: event.id || `mock-${Date.now()}` });
  }

  async getEvents(filters?: any): Promise<any[]> {
    return this.events;
  }

  async createDashboard(dashboard: any): Promise<any> {
    const created = { ...dashboard, id: dashboard.id || `mock-${Date.now()}` };
    this.dashboards.push(created);
    return created;
  }

  async getDashboards(): Promise<any[]> {
    return this.dashboards;
  }

  async createReport(report: any): Promise<any> {
    const created = { ...report, id: report.id || `mock-${Date.now()}` };
    this.reports.push(created);
    return created;
  }

  async getReports(): Promise<any[]> {
    return this.reports;
  }

  async createInsight(insight: any): Promise<any> {
    const created = { ...insight, id: insight.id || `mock-${Date.now()}` };
    this.insights.push(created);
    return created;
  }

  async getInsights(): Promise<any[]> {
    return this.insights;
  }

  async calculateMetrics(dateRange?: any): Promise<any> {
    return {
      pageViews: this.events.length,
      uniqueUsers: new Set(this.events.map(e => e.userId)).size,
      totalSessions: new Set(this.events.map(e => e.sessionId)).size,
      avgSessionDuration: 180,
      bounceRate: 25.5,
      userEngagement: 75.0,
      conversionRate: 3.2
    };
  }

  async generateReportData(report: any): Promise<any> {
    return {
      id: report.id,
      data: {
        overview: 'Mock overview data',
        metrics: await this.calculateMetrics(),
        insights: this.insights
      },
      generatedAt: new Date()
    };
  }

  // Reset mock data
  reset(): void {
    this.events = [];
    this.dashboards = [];
    this.reports = [];
    this.insights = [];
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Measure execution time of a function
   */
  static async measureExecutionTime<T>(
    fn: () => Promise<T> | T,
    iterations: number = 1
  ): Promise<{ result: T; avgTime: number; totalTime: number }> {
    const start = performance.now();
    let result: T;

    for (let i = 0; i < iterations; i++) {
      result = await fn();
    }

    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    return { result: result!, avgTime, totalTime };
  }

  /**
   * Memory usage measurement
   */
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (typeof window !== 'undefined' && (window as any).performance && (window as any).performance.memory) {
      const memory = (window as any).performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }

    return { used: 0, total: 0, percentage: 0 };
  }

  /**
   * Load testing simulation
   */
  static async simulateLoad(
    fn: () => Promise<void>,
    concurrentUsers: number,
    duration: number
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
  }> {
    const startTime = Date.now();
    const endTime = startTime + duration;
    const promises: Promise<{ success: boolean; responseTime: number }>[] = [];
    let totalRequests = 0;

    while (Date.now() < endTime) {
      for (let i = 0; i < concurrentUsers; i++) {
        const requestStart = performance.now();
        promises.push(
          fn()
            .then(() => ({ success: true, responseTime: performance.now() - requestStart }))
            .catch(() => ({ success: false, responseTime: performance.now() - requestStart }))
        );
        totalRequests++;
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between batches
    }

    const results = await Promise.all(promises);
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.filter(r => !r.success).length;
    const responseTimes = results.map(r => r.responseTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      avgResponseTime,
      maxResponseTime,
      minResponseTime
    };
  }
}
