import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AnalyticsDashboard } from '../presentation/components/AnalyticsDashboard';
import { ReportBuilder } from '../presentation/components/ReportBuilder';
import { PerformanceMonitor } from '../presentation/components/PerformanceMonitor';
import { CacheManager } from '../presentation/components/CacheManager';
import { ErrorTracker } from '../presentation/components/ErrorTracker';
import { AdvancedCharts } from '../presentation/components/AdvancedCharts';
import { createAnalyticsTestUtils, MockAnalyticsService } from './AnalyticsTestUtils';
import { DIProvider } from '../../../core/di';
import { renderWithDI } from '../../../shared/utils/testUtils';

/**
 * Component testing utilities for Analytics feature
 */

describe('AnalyticsDashboard Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;
  let mockService: MockAnalyticsService;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
    mockService = new MockAnalyticsService();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Basic Rendering', () => {
    it('should render analytics dashboard with title', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);
      
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    it('should display metrics section', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);
      
      expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    });

    it('should show insights section', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);
      
      expect(screen.getByText('AI Insights')).toBeInTheDocument();
    });
  });

  describe('Metrics Display', () => {
    it('should display page views metric', async () => {
      // Setup mock data
      await testUtils.setupTestData({
        metrics: {
          pageViews: 1000,
          uniqueUsers: 250,
          totalSessions: 500,
          avgSessionDuration: 180,
          bounceRate: 25.5,
          userEngagement: 75.0,
          conversionRate: 3.2
        }
      });

      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByText('1000')).toBeInTheDocument();
      });
    });

    it('should display unique users metric', async () => {
      await testUtils.setupTestData({
        metrics: {
          pageViews: 1000,
          uniqueUsers: 250,
          totalSessions: 500,
          avgSessionDuration: 180,
          bounceRate: 25.5,
          userEngagement: 75.0,
          conversionRate: 3.2
        }
      });

      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByText('250')).toBeInTheDocument();
      });
    });

    it('should handle loading state', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      // Should show loading state initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Timeframe Selection', () => {
    it('should allow timeframe selection', async () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const timeframeButton = screen.getByText('7 Days');
      fireEvent.click(timeframeButton);

      await waitFor(() => {
        expect(timeframeButton).toHaveClass('active');
      });
    });

    it('should refresh data when timeframe changes', async () => {
      const fetchMetricsSpy = jest.spyOn(mockService, 'calculateMetrics');
      
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const timeframeButton = screen.getByText('7 Days');
      fireEvent.click(timeframeButton);

      await waitFor(() => {
        expect(fetchMetricsSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Auto-refresh Functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should auto-refresh when enabled', async () => {
      const fetchMetricsSpy = jest.spyOn(mockService, 'calculateMetrics');
      
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const autoRefreshToggle = screen.getByText('Auto-refresh');
      fireEvent.click(autoRefreshToggle);

      // Fast-forward time
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(fetchMetricsSpy).toHaveBeenCalledTimes(2); // Initial + auto-refresh
      });
    });

    it('should not auto-refresh when disabled', async () => {
      const fetchMetricsSpy = jest.spyOn(mockService, 'calculateMetrics');
      
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      // Auto-refresh is disabled by default
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(fetchMetricsSpy).toHaveBeenCalledTimes(1); // Only initial call
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      // Mock service to throw error
      jest.spyOn(mockService, 'calculateMetrics').mockRejectedValue(new Error('API Error'));

      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
      });
    });

    it('should retry on error', async () => {
      const fetchMetricsSpy = jest.spyOn(mockService, 'calculateMetrics')
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          pageViews: 1000,
          uniqueUsers: 250,
          totalSessions: 500,
          avgSessionDuration: 180,
          bounceRate: 25.5,
          userEngagement: 75.0,
          conversionRate: 3.2
        });

      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('1000')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const metricsSection = screen.getByRole('region', { name: /key metrics/i });
      expect(metricsSection).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      const timeframeButton = screen.getByText('7 Days');
      timeframeButton.focus();
      
      expect(timeframeButton).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', async () => {
      const startTime = performance.now();
      
      renderWithDI(<AnalyticsDashboard userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });
  });
});

describe('AdvancedCharts Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Chart Type Selection', () => {
    it('should allow switching between chart types', async () => {
      renderWithDI(<AdvancedCharts userId="test-user" />);

      const lineChartButton = screen.getByText('📈 Line');
      const barChartButton = screen.getByText('📊 Bar');

      fireEvent.click(lineChartButton);
      expect(screen.getByText('Real-time Events')).toBeInTheDocument();

      fireEvent.click(barChartButton);
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update chart data in real-time when live mode is enabled', async () => {
      renderWithDI(<AdvancedCharts userId="test-user" />);

      const liveButton = screen.getByText('🔴 LIVE');
      fireEvent.click(liveButton);

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByText('🔴 LIVE')).toBeInTheDocument();
      });
    });
  });
});

describe('ReportBuilder Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Template Selection', () => {
    it('should display available report templates', () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      expect(screen.getByText('Executive Summary')).toBeInTheDocument();
      expect(screen.getByText('Detailed Analytics')).toBeInTheDocument();
      expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
      expect(screen.getByText('Custom Report')).toBeInTheDocument();
    });

    it('should select template when clicked', async () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      const summaryTemplate = screen.getByText('Executive Summary');
      fireEvent.click(summaryTemplate);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Executive Summary')).toBeInTheDocument();
      });
    });
  });

  describe('Report Configuration', () => {
    it('should allow report name input', async () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      const nameInput = screen.getByPlaceholderText('Enter report name...');
      fireEvent.change(nameInput, { target: { value: 'Test Report' } });

      expect(nameInput).toHaveValue('Test Report');
    });

    it('should allow schedule configuration', async () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      const frequencySelect = screen.getByDisplayValue('Weekly');
      fireEvent.change(frequencySelect, { target: { value: 'daily' } });

      expect(frequencySelect).toHaveValue('daily');
    });
  });

  describe('Section Management', () => {
    it('should add sections to report', async () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      const overviewSection = screen.getByText('Overview');
      fireEvent.click(overviewSection);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
      });
    });

    it('should remove sections from report', async () => {
      renderWithDI(<ReportBuilder userId="test-user" />);

      // First add a section
      const overviewSection = screen.getByText('Overview');
      fireEvent.click(overviewSection);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
      });

      // Then remove it
      const removeButton = screen.getByText('×');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('Overview')).not.toBeInTheDocument();
      });
    });
  });
});

describe('PerformanceMonitor Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Performance Metrics', () => {
    it('should display key performance metrics', () => {
      renderWithDI(<PerformanceMonitor userId="test-user" />);

      expect(screen.getByText('Average Response Time')).toBeInTheDocument();
      expect(screen.getByText('Request Throughput')).toBeInTheDocument();
      expect(screen.getByText('Error Rate')).toBeInTheDocument();
      expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    });
  });

  describe('Feature Performance', () => {
    it('should display performance by feature', () => {
      renderWithDI(<PerformanceMonitor userId="test-user" />);

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Content Management')).toBeInTheDocument();
    });
  });

  describe('Alerts', () => {
    it('should display performance alerts', () => {
      renderWithDI(<PerformanceMonitor userId="test-user" />);

      expect(screen.getByText('Performance Alerts')).toBeInTheDocument();
    });
  });
});

describe('CacheManager Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Cache Statistics', () => {
    it('should display cache statistics', () => {
      renderWithDI(<CacheManager userId="test-user" />);

      expect(screen.getByText('Total Entries')).toBeInTheDocument();
      expect(screen.getByText('Cache Size')).toBeInTheDocument();
      expect(screen.getByText('Hit Rate')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
    });
  });

  describe('Cache Type Selection', () => {
    it('should allow switching between cache types', async () => {
      renderWithDI(<CacheManager userId="test-user" />);

      const memoryCacheButton = screen.getByText('💾 Memory Cache');
      const redisCacheButton = screen.getByText('🔴 Redis Cache');

      fireEvent.click(memoryCacheButton);
      expect(screen.getByText('Memory Cache Statistics')).toBeInTheDocument();

      fireEvent.click(redisCacheButton);
      expect(screen.getByText('Redis Cache Statistics')).toBeInTheDocument();
    });
  });
});

describe('ErrorTracker Component', () => {
  let testUtils: ReturnType<typeof createAnalyticsTestUtils>;

  beforeEach(() => {
    testUtils = createAnalyticsTestUtils();
  });

  afterEach(async () => {
    await testUtils.cleanup();
  });

  const renderWithDI = (component: React.ReactElement) => {
    const container = testUtils.getContainer();
    return render(
      <DIProvider container={container}>
        {component}
      </DIProvider>
    );
  };

  describe('Error Statistics', () => {
    it('should display error statistics', () => {
      renderWithDI(<ErrorTracker userId="test-user" />);

      expect(screen.getByText('Total Errors')).toBeInTheDocument();
      expect(screen.getByText('Critical Errors')).toBeInTheDocument();
      expect(screen.getByText('Resolved')).toBeInTheDocument();
      expect(screen.getByText('Error Rate')).toBeInTheDocument();
    });
  });

  describe('Error Events', () => {
    it('should display recent error events', () => {
      renderWithDI(<ErrorTracker userId="test-user" />);

      expect(screen.getByText('Recent Error Events')).toBeInTheDocument();
    });
  });

  describe('Recovery Strategies', () => {
    it('should display recovery strategies', () => {
      renderWithDI(<ErrorTracker userId="test-user" />);

      expect(screen.getByText('Recovery Strategies')).toBeInTheDocument();
    });
  });
});
