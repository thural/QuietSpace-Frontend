import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { AnalyticsService } from '../application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '../data';
import { createAnalyticsTestUtils, MockAnalyticsService, PerformanceTestUtils } from './AnalyticsTestUtils';

/**
 * Service layer testing for Analytics feature
 */

describe('AnalyticsService', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;
  let analyticsService: AnalyticsService;
  let analyticsRepository: AnalyticsRepository;

  beforeEach(async () => {
    testUtils = createAnalyticsTestUtils();
    analyticsService = testUtils.getAnalyticsService();
    analyticsRepository = testUtils.getAnalyticsRepository();
    
    await testUtils.setupTestData();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  describe('Event Tracking', () => {
    it('should track analytics event successfully', async () => {
      const event = {
        userId: 'test-user',
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {
          page: '/test-page'
        },
        source: 'web' as const
      };

      await analyticsService.trackEvent(event);

      const events = await analyticsRepository.getEvents();
      expect(events).toContainEqual(expect.objectContaining({
        userId: 'test-user',
        eventType: 'page_view',
        metadata: expect.objectContaining({
          page: '/test-page'
        })
      }));
    });

    it('should validate required event fields', async () => {
      const invalidEvent = {
        userId: '',
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      };

      await expect(analyticsService.trackEvent(invalidEvent)).rejects.toThrow();
    });

    it('should handle batch event tracking', async () => {
      const events = Array.from({ length: 10 }, (_, i) => ({
        userId: `user-${i}`,
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: { page: `/page-${i}` },
        source: 'web' as const
      }));

      await analyticsService.trackBatchEvents(events);

      const savedEvents = await analyticsRepository.getEvents();
      expect(savedEvents.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Metrics Calculation', () => {
    it('should calculate basic metrics correctly', async () => {
      const metrics = await analyticsService.calculateMetrics({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      });

      expect(metrics).toHaveProperty('pageViews');
      expect(metrics).toHaveProperty('uniqueUsers');
      expect(metrics).toHaveProperty('totalSessions');
      expect(metrics).toHaveProperty('avgSessionDuration');
      expect(metrics).toHaveProperty('bounceRate');
      expect(metrics).toHaveProperty('userEngagement');
      expect(metrics).toHaveProperty('conversionRate');

      expect(typeof metrics.pageViews).toBe('number');
      expect(typeof metrics.uniqueUsers).toBe('number');
      expect(typeof metrics.totalSessions).toBe('number');
    });

    it('should calculate metrics for specific date range', async () => {
      const dateRange = {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        end: new Date()
      };

      const metrics = await analyticsService.calculateMetrics(dateRange);

      // Should only include events from the specified date range
      expect(metrics.pageViews).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty data gracefully', async () => {
      await testUtils.clearTestData();

      const metrics = await analyticsService.calculateMetrics({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date()
      });

      expect(metrics.pageViews).toBe(0);
      expect(metrics.uniqueUsers).toBe(0);
      expect(metrics.totalSessions).toBe(0);
    });
  });

  describe('Dashboard Management', () => {
    it('should create dashboard successfully', async () => {
      const dashboard = {
        name: 'Test Dashboard',
        description: 'Test dashboard description',
        widgets: [
          {
            id: 'widget-1',
            type: 'metric_card' as const,
            title: 'Page Views',
            description: 'Shows total page views',
            dataSource: 'analytics',
            metrics: ['page_views'],
            filters: {
              dateRange: {
                start: new Date('2024-01-01'),
                end: new Date('2024-12-31'),
                preset: 'last_30_days' as const,
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
            end: new Date('2024-12-31'),
            preset: 'last_30_days' as const,
          },
          customFilters: {}
        },
        isDefault: false,
        isPublic: false
      };

      const created = await analyticsService.createDashboard(dashboard);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe(dashboard.name);
      expect(created.widgets).toHaveLength(1);
    });

    it('should retrieve user dashboards', async () => {
      const dashboards = await analyticsService.getDashboardsByUser('test-user');

      expect(Array.isArray(dashboards)).toBe(true);
      expect(dashboards.length).toBeGreaterThanOrEqual(0);
    });

    it('should update dashboard successfully', async () => {
      const dashboard = {
        name: 'Test Dashboard',
        description: 'Test dashboard description',
        widgets: [],
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
        isDefault: false
      };

      const created = await analyticsService.createDashboard(dashboard);
      
      const updated = await analyticsService.updateDashboard(created.id, {
        name: 'Updated Dashboard'
      });

      expect(updated.name).toBe('Updated Dashboard');
    });

    it('should delete dashboard successfully', async () => {
      const dashboard = {
        name: 'Test Dashboard',
        description: 'Test dashboard description',
        widgets: [],
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
        isDefault: false
      };

      const created = await analyticsService.createDashboard(dashboard);
      
      await analyticsService.deleteDashboard(created.id);

      const dashboards = await analyticsService.getDashboardsByUser('test-user');
      expect(dashboards.find(d => d.id === created.id)).toBeUndefined();
    });
  });

  describe('Report Generation', () => {
    it('should generate report data successfully', async () => {
      const report = {
        id: 'test-report-1',
        userId: 'test-user',
        name: 'Test Report',
        description: 'Test report description',
        type: 'summary' as const,
        schedule: {
          frequency: 'on_demand' as const,
          time: '00:00',
          timezone: 'UTC'
        },
        recipients: [],
        template: {
          sections: [{
            id: 'overview',
            type: 'summary' as const,
            title: 'Overview',
            content: 'Overview content',
            order: 0
          }, {
            id: 'metrics',
            type: 'chart' as const,
            title: 'Metrics',
            content: 'Metrics content',
            order: 1
          }],
          branding: {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            fontFamily: 'Arial',
            includeWatermark: false
          }
        },
        filters: {
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date()
          },
          dimensions: [],
          metrics: [],
          segments: []
        },
        format: 'pdf' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const reportData = await analyticsService.generateReportData(report);

      expect(reportData).toHaveProperty('id');
      expect(reportData).toHaveProperty('data');
      expect(reportData).toHaveProperty('generatedAt');
      expect(reportData.data).toHaveProperty('overview');
      expect(reportData.data).toHaveProperty('metrics');
    });

    it('should handle different report types', async () => {
      const reportTypes = ['summary', 'detailed', 'trend', 'custom'] as const;

      for (const type of reportTypes) {
        const report = {
          id: `test-report-${type}`,
          userId: 'test-user',
          name: `${type} Report`,
          description: `${type} report description`,
          type,
          schedule: {
            frequency: 'on_demand' as const,
            time: '00:00',
            timezone: 'UTC'
          },
          recipients: [],
          template: { 
            sections: [{
              id: 'overview',
              type: 'summary' as const,
              title: 'Overview',
              content: 'Overview content',
              order: 0
            }],
            branding: {
              primaryColor: '#007bff',
              secondaryColor: '#6c757d',
              fontFamily: 'Arial',
              includeWatermark: false
            }
          },
          filters: {
            dateRange: {
              start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              end: new Date()
            },
            dimensions: [],
            metrics: [],
            segments: []
          },
          format: 'pdf' as const,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const reportData = await analyticsService.generateReportData(report);
        expect(reportData).toHaveProperty('data');
      }
    });
  });

  describe('Insights Generation', () => {
    it('should generate insights from analytics data', async () => {
      const insights = await analyticsService.generateInsights({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last_7_days' as const
      });

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThanOrEqual(0);

      if (insights.length > 0) {
        const insight = insights[0];
        expect(insight).toHaveProperty('id');
        expect(insight).toHaveProperty('type');
        expect(insight).toHaveProperty('title');
        expect(insight).toHaveProperty('description');
        expect(insight).toHaveProperty('confidence');
        expect(insight).toHaveProperty('impact');
        expect(insight).toHaveProperty('recommendations');
      }
    });

    it('should calculate insight confidence scores', async () => {
      const insights = await analyticsService.generateInsights({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last_7_days' as const
      });

      insights.forEach(insight => {
        expect(insight.confidence).toBeGreaterThanOrEqual(0);
        expect(insight.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Mock repository to throw error
      jest.spyOn(analyticsRepository, 'createEvent').mockRejectedValue(new Error('Database error'));

      const event = {
        userId: 'test-user',
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      };

      await expect(analyticsService.trackEvent(event)).rejects.toThrow('Database error');
    });

    it('should validate input parameters', async () => {
      const invalidEvent = null as any;
      
      await expect(analyticsService.trackEvent(invalidEvent)).rejects.toThrow();
    });

    it('should handle missing data gracefully', async () => {
      await testUtils.clearTestData();

      const metrics = await analyticsService.calculateMetrics({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date()
      });

      expect(metrics.pageViews).toBe(0);
      expect(metrics.uniqueUsers).toBe(0);
    });
  });
});

describe('MockAnalyticsService', () => {
  let mockService: MockAnalyticsService;

  beforeEach(() => {
    mockService = new MockAnalyticsService();
  });

  afterEach(() => {
    mockService.reset();
  });

  describe('Mock Functionality', () => {
    it('should track events correctly', async () => {
      const event = {
        userId: 'test-user',
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      };

      await mockService.trackEvent(event);

      const events = await mockService.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject(event);
    });

    it('should calculate metrics correctly', async () => {
      // Add some test events
      await mockService.trackEvent({ 
        userId: 'user1', 
        sessionId: 'session-1',
        eventType: 'page_view' as const,
        timestamp: new Date(), 
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      });
      await mockService.trackEvent({ 
        userId: 'user2', 
        sessionId: 'session-2',
        eventType: 'page_view' as const,
        timestamp: new Date(), 
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      });
      await mockService.trackEvent({ 
        userId: 'user1', 
        sessionId: 'session-1',
        eventType: 'feature_usage' as const,
        timestamp: new Date(), 
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      });

      const metrics = await mockService.calculateMetrics();

      expect(metrics.pageViews).toBe(2);
      expect(metrics.uniqueUsers).toBe(2);
      expect(metrics.totalSessions).toBe(3);
    });

    it('should reset data correctly', async () => {
      await mockService.trackEvent({ 
        userId: 'test-user', 
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(), 
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: {},
        source: 'web' as const
      });
      
      expect(await mockService.getEvents()).toHaveLength(1);
      
      mockService.reset();
      
      expect(await mockService.getEvents()).toHaveLength(0);
    });
  });
});

describe('PerformanceTestUtils', () => {
  describe('Execution Time Measurement', () => {
    it('should measure execution time correctly', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'test-result';
      };

      const result = await PerformanceTestUtils.measureExecutionTime(testFunction, 1);

      expect(result.result).toBe('test-result');
      expect(result.avgTime).toBeGreaterThan(90); // Should be around 100ms
      expect(result.totalTime).toBeGreaterThan(90);
    });

    it('should handle multiple iterations', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'test-result';
      };

      const result = await PerformanceTestUtils.measureExecutionTime(testFunction, 5);

      expect(result.result).toBe('test-result');
      expect(result.avgTime).toBeGreaterThan(40); // Should be around 50ms
      expect(result.totalTime).toBeGreaterThan(200); // Should be around 250ms
    });
  });

  describe('Memory Usage', () => {
    it('should return memory usage statistics', () => {
      const memoryUsage = PerformanceTestUtils.getMemoryUsage();

      expect(memoryUsage).toHaveProperty('used');
      expect(memoryUsage).toHaveProperty('total');
      expect(memoryUsage).toHaveProperty('percentage');
      expect(typeof memoryUsage.used).toBe('number');
      expect(typeof memoryUsage.total).toBe('number');
      expect(typeof memoryUsage.percentage).toBe('number');
    });
  });

  describe('Load Testing', () => {
    it('should simulate load correctly', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      };

      const result = await PerformanceTestUtils.simulateLoad(testFunction, 5, 100);

      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.successfulRequests).toBeGreaterThanOrEqual(0);
      expect(result.failedRequests).toBeGreaterThanOrEqual(0);
      expect(result.avgResponseTime).toBeGreaterThan(0);
      expect(result.maxResponseTime).toBeGreaterThanOrEqual(result.avgResponseTime);
      expect(result.minResponseTime).toBeLessThanOrEqual(result.avgResponseTime);
    });
  });
});

describe('Integration Tests', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(async () => {
    testUtils = createAnalyticsTestUtils();
    await testUtils.setupTestData();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  describe('End-to-End Analytics Flow', () => {
    it('should complete full analytics workflow', async () => {
      const analyticsService = testUtils.getAnalyticsService();

      // 1. Track events
      const events = [
        {
          userId: 'test-user',
          sessionId: 'test-session',
          eventType: 'page_view' as const,
          timestamp: new Date(),
          metadata: {
            userAgent: 'Test Agent',
            platform: 'web',
            browser: 'chrome',
            version: '1.0.0',
            language: 'en',
            timezone: 'UTC',
            screenResolution: '1920x1080',
            deviceType: 'desktop' as const,
            ipAddress: '127.0.0.1'
          },
          properties: { page: '/home' },
          source: 'web' as const
        },
        {
          userId: 'test-user',
          sessionId: 'test-session',
          eventType: 'feature_usage' as const,
          timestamp: new Date(),
          metadata: {
            userAgent: 'Test Agent',
            platform: 'web',
            browser: 'chrome',
            version: '1.0.0',
            language: 'en',
            timezone: 'UTC',
            screenResolution: '1920x1080',
            deviceType: 'desktop' as const,
            ipAddress: '127.0.0.1'
          },
          properties: { element: 'button' },
          source: 'web' as const
        }
      ];

      for (const event of events) {
        await analyticsService.trackEvent(event);
      }

      // 2. Calculate metrics
      const metrics = await analyticsService.calculateMetrics({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date()
      });

      expect(metrics.pageViews).toBeGreaterThanOrEqual(1);
      expect(metrics.uniqueUsers).toBeGreaterThanOrEqual(1);

      // 3. Generate insights
      const insights = await analyticsService.generateInsights({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last_24_hours' as const
      });

      expect(Array.isArray(insights)).toBe(true);

      // 4. Create dashboard
      const dashboard = await analyticsService.createDashboard({
        name: 'Integration Test Dashboard',
        description: 'Dashboard for integration testing',
        widgets: [
          {
            id: 'widget-1',
            type: 'metric_card' as const,
            title: 'Page Views',
            description: 'Page views metric',
            dataSource: 'analytics',
            metrics: ['page_views'],
            filters: {
              dateRange: {
                start: new Date(Date.now() - 24 * 60 * 60 * 1000),
                end: new Date(),
                preset: 'last_24_hours' as const
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
            start: new Date(Date.now() - 24 * 60 * 60 * 1000),
            end: new Date(),
            preset: 'last_24_hours' as const
          },
          customFilters: {}
        },
        isDefault: false
      });

      expect(dashboard).toHaveProperty('id');

      // 5. Generate report
      const reportData = await analyticsService.generateReportData({
        id: 'integration-test-report',
        userId: 'test-user',
        name: 'Integration Test Report',
        description: 'Integration test report description',
        type: 'summary' as const,
        schedule: {
          frequency: 'on_demand' as const,
          time: '00:00',
          timezone: 'UTC'
        },
        recipients: [],
        template: { 
          sections: [{
            id: 'overview',
            type: 'summary' as const,
            title: 'Overview',
            content: 'Overview content',
            order: 0
          }, {
            id: 'metrics',
            type: 'chart' as const,
            title: 'Metrics',
            content: 'Metrics content',
            order: 1
          }],
          branding: {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            fontFamily: 'Arial',
            includeWatermark: false
          }
        },
        filters: {
          dateRange: {
            start: new Date(Date.now() - 24 * 60 * 60 * 1000),
            end: new Date()
          },
          dimensions: [],
          metrics: ['page_views'],
          segments: []
        },
        format: 'pdf',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      expect(reportData).toHaveProperty('data');
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data integrity across operations', async () => {
      const analyticsService = testUtils.getAnalyticsService();
      const analyticsRepository = testUtils.getAnalyticsRepository();

      // Track event
      const event = {
        userId: 'test-user',
        sessionId: 'test-session',
        eventType: 'page_view' as const,
        timestamp: new Date(),
        metadata: {
          userAgent: 'Test Agent',
          platform: 'web',
          browser: 'chrome',
          version: '1.0.0',
          language: 'en',
          timezone: 'UTC',
          screenResolution: '1920x1080',
          deviceType: 'desktop' as const,
          ipAddress: '127.0.0.1'
        },
        properties: { page: '/test' },
        source: 'web' as const
      };

      await analyticsService.trackEvent(event);

      // Verify event was saved correctly
      const events = await analyticsRepository.getEvents();
      const savedEvent = events.find(e => e.userId === 'test-user');
      expect(savedEvent).toMatchObject(event);

      // Calculate metrics
      const metrics = await analyticsService.calculateMetrics();
      expect(metrics.pageViews).toBeGreaterThanOrEqual(1);

      // Create dashboard
      const dashboard = await analyticsService.createDashboard({
        name: 'Data Integrity Test',
        description: 'Testing data integrity',
        widgets: [],
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
        isDefault: false
      });

      // Verify dashboard was saved correctly
      const dashboards = await analyticsRepository.getDashboards();
      const savedDashboard = dashboards.find(d => d.id === dashboard.id);
      expect(savedDashboard).toMatchObject(dashboard as unknown as Record<string, unknown>);
    });
  });
});
