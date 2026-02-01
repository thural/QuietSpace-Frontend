/**
 * Enterprise Analytics Example Component
 * 
 * Demonstrates the usage of enterprise analytics hooks with
 * advanced data processing, real-time analytics, and reporting capabilities
 */

import React from 'react';
import { useEnterpriseAnalytics } from '@features/analytics/application/hooks/useEnterpriseAnalytics';
import { useAnalyticsMigration } from '@features/analytics/application/hooks/useAnalyticsMigration';
import type { 
  AnalyticsDashboard, 
  AnalyticsReport,
  AnalyticsMetrics,
  DateRange 
} from '@features/analytics/domain/entities/IAnalyticsRepository';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Enterprise Analytics Example Props
 */
export interface IEnterpriseAnalyticsExampleProps extends IBaseComponentProps {
  className?: string;
  enableMigrationMode?: boolean;
  dataProcessingLevel?: 'basic' | 'enhanced' | 'maximum';
  realTimeLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Enterprise Analytics Example State
 */
export interface IEnterpriseAnalyticsExampleState extends IBaseComponentState {
  currentView: 'dashboard' | 'reports' | 'metrics' | 'settings';
  dateRange: DateRange;
  isRealTimeEnabled: boolean;
  lastUpdate: Date | null;
  autoRefreshInterval: number | null;
}

/**
 * Enterprise Analytics Example Component
 * 
 * Demonstrates enterprise analytics capabilities with:
 * - Advanced data processing and visualization
 * - Real-time analytics with configurable refresh intervals
 * - Migration mode support for legacy to enterprise analytics
 * - Comprehensive reporting and metrics
 * - Performance monitoring and optimization
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseAnalyticsExample extends BaseClassComponent<IEnterpriseAnalyticsExampleProps, IEnterpriseAnalyticsExampleState> {
  
  protected override getInitialState(): Partial<IEnterpriseAnalyticsExampleState> {
    return {
      currentView: 'dashboard',
      dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date()
      },
      isRealTimeEnabled: false,
      lastUpdate: null,
      autoRefreshInterval: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeAnalytics();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupAutoRefresh();
  }

  /**
   * Initialize analytics system
   */
  private initializeAnalytics(): void {
    const { realTimeLevel = 'disabled' } = this.props;
    
    if (realTimeLevel !== 'disabled') {
      this.enableRealTimeUpdates(realTimeLevel);
    }
    
    this.safeSetState({ lastUpdate: new Date() });
  }

  /**
   * Enable real-time updates
   */
  private enableRealTimeUpdates(level: 'basic' | 'enhanced'): void {
    const interval = level === 'enhanced' ? 5000 : 10000; // 5s for enhanced, 10s for basic
    
    this.safeSetState({ 
      isRealTimeEnabled: true,
      autoRefreshInterval: window.setInterval(() => {
        this.refreshData();
      }, interval)
    });
  }

  /**
   * Cleanup auto-refresh interval
   */
  private cleanupAutoRefresh(): void {
    if (this.state.autoRefreshInterval) {
      clearInterval(this.state.autoRefreshInterval);
      this.safeSetState({ autoRefreshInterval: null });
    }
  }

  /**
   * Refresh analytics data
   */
  private refreshData(): void {
    // This would trigger data refresh
    this.safeSetState({ lastUpdate: new Date() });
    console.log('Analytics data refreshed at:', new Date());
  }

  /**
   * Handle view navigation
   */
  private navigateToView = (view: 'dashboard' | 'reports' | 'metrics' | 'settings'): void => {
    this.safeSetState({ currentView: view });
  };

  /**
   * Handle date range change
   */
  private handleDateRangeChange = (dateRange: DateRange): void => {
    this.safeSetState({ dateRange });
    this.refreshData();
  };

  /**
   * Toggle real-time updates
   */
  private toggleRealTime = (): void => {
    if (this.state.isRealTimeEnabled) {
      this.cleanupAutoRefresh();
      this.safeSetState({ isRealTimeEnabled: false });
    } else {
      const { realTimeLevel = 'basic' } = this.props;
      this.enableRealTimeUpdates(realTimeLevel);
    }
  };

  /**
   * Render navigation tabs
   */
  private renderNavigation(): React.ReactNode {
    const { currentView } = this.state;
    
    return (
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['dashboard', 'reports', 'metrics', 'settings'] as const).map(view => (
          <button
            key={view}
            onClick={() => this.navigateToView(view)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === view
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render status bar
   */
  private renderStatusBar(): React.ReactNode {
    const { isRealTimeEnabled, lastUpdate } = this.state;
    
    return (
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </span>
          <button
            onClick={this.toggleRealTime}
            className={`px-3 py-1 rounded text-xs font-medium ${
              isRealTimeEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isRealTimeEnabled ? '🟢 Real-time' : '⚪ Offline'}
          </button>
        </div>
        <button
          onClick={() => this.refreshData()}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>
    );
  }

  /**
   * Render dashboard view
   */
  private renderDashboard(): React.ReactNode {
    const { enableMigrationMode, dataProcessingLevel = 'enhanced' } = this.props;
    const { dateRange } = this.state;
    
    // Use either migration hook or direct enterprise hook
    const analytics = enableMigrationMode 
      ? this.useAnalyticsMigrationClass(dataProcessingLevel)
      : this.useEnterpriseAnalyticsClass();

    return (
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Date Range</h3>
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => this.handleDateRangeChange({
                ...dateRange,
                startDate: new Date(e.target.value)
              })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => this.handleDateRangeChange({
                ...dateRange,
                endDate: new Date(e.target.value)
              })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: analytics.metrics.totalUsers, change: '+12%' },
            { label: 'Active Sessions', value: analytics.metrics.activeSessions, change: '+5%' },
            { label: 'Conversion Rate', value: `${analytics.metrics.conversionRate}%`, change: '+2.1%' },
            { label: 'Revenue', value: `$${analytics.metrics.revenue.toLocaleString()}`, change: '+18%' }
          ].map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-600">{metric.label}</h4>
              <div className="mt-2 text-2xl font-bold">{metric.value}</div>
              <div className="mt-1 text-sm text-green-600">{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Analytics Overview</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-500">Chart visualization would go here</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Class-based version of useEnterpriseAnalytics hook
   */
  private useEnterpriseAnalyticsClass() {
    // Mock implementation that matches the hook interface
    return {
      dashboard: {
        id: 'dashboard-1',
        title: 'Enterprise Analytics Dashboard',
        metrics: {
          totalUsers: 12543,
          activeSessions: 3421,
          conversionRate: 3.4,
          revenue: 125000
        },
        charts: [],
        lastUpdated: new Date()
      } as AnalyticsDashboard,
      reports: [],
      metrics: {
        totalUsers: 12543,
        activeSessions: 3421,
        conversionRate: 3.4,
        revenue: 125000
      } as AnalyticsMetrics,
      isLoading: false,
      error: null,
      refresh: () => {},
      exportReport: () => {}
    };
  }

  /**
   * Class-based version of useAnalyticsMigration hook
   */
  private useAnalyticsMigrationClass(dataProcessingLevel: string) {
    // Mock implementation that matches the hook interface
    return {
      dashboard: this.useEnterpriseAnalyticsClass().dashboard,
      migration: {
        isUsingEnterprise: true,
        config: { dataProcessingLevel },
        errors: [],
        performance: {
          enterpriseProcessingTime: 15.2,
          legacyProcessingTime: 45.8,
          migrationTime: 2.1
        }
      },
      isLoading: false,
      error: null,
      refresh: () => {},
      migrateToEnterprise: () => {}
    };
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', enableMigrationMode = false } = this.props;
    const { currentView } = this.state;
    
    // Get analytics data
    const analytics = enableMigrationMode 
      ? this.useAnalyticsMigrationClass('enhanced')
      : this.useEnterpriseAnalyticsClass();

    return (
      <div className={`enterprise-analytics-example ${className}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Analytics</h1>
            <p className="text-gray-600 mt-1">Advanced analytics and reporting platform</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-white border-b">
          {this.renderNavigation()}
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2">
          {this.renderStatusBar()}
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Loading State */}
          {analytics.isLoading && (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" color="primary" />
            </div>
          )}

          {/* Error State */}
          {analytics.error && (
            <ErrorMessage
              error={analytics.error}
              onRetry={() => analytics.refresh()}
              onClear={() => {/* Clear error logic */}}
              variant="default"
            />
          )}

          {/* Content Based on Current View */}
          {!analytics.isLoading && !analytics.error && (
            <>
              {currentView === 'dashboard' && this.renderDashboard()}
              
              {currentView === 'reports' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Analytics Reports</h2>
                  <div className="space-y-4">
                    {analytics.reports.length === 0 ? (
                      <p className="text-gray-500">No reports available</p>
                    ) : (
                      analytics.reports.map((report, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {currentView === 'metrics' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Detailed Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(analytics.metrics).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                        <p className="text-2xl font-bold mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentView === 'settings' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Analytics Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Processing Level
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="basic">Basic</option>
                        <option value="enhanced">Enhanced</option>
                        <option value="maximum">Maximum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Real-time Updates
                      </label>
                      <button
                        onClick={this.toggleRealTime}
                        className={`px-4 py-2 rounded-md ${
                          this.state.isRealTimeEnabled
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {this.state.isRealTimeEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default EnterpriseAnalyticsExample;
