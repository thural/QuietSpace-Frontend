/**
 * Enterprise Analytics Example Component
 * 
 * Demonstrates the usage of enterprise analytics hooks with
 * advanced data processing, real-time analytics, and reporting capabilities
 */

import React, { useState } from 'react';
import { useEnterpriseAnalytics } from '@features/analytics/application/hooks/useEnterpriseAnalytics';
import { useAnalyticsMigration } from '@features/analytics/application/hooks/useAnalyticsMigration';
import type { 
  AnalyticsDashboard, 
  AnalyticsReport,
  AnalyticsMetrics,
  DateRange 
} from '@features/analytics/domain/entities/IAnalyticsRepository';

/**
 * Enterprise Analytics Example Props
 */
interface EnterpriseAnalyticsExampleProps {
  className?: string;
  enableMigrationMode?: boolean;
  dataProcessingLevel?: 'basic' | 'enhanced' | 'maximum';
  realTimeLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage: React.FC<{ error: string; onRetry: () => void; onClear: () => void }> = ({ 
  error, 
  onRetry, 
  onClear 
}) => (
  <div className="error-message p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-700">{error}</div>
    <div className="mt-2 flex space-x-2">
      <button 
        onClick={onRetry}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Retry
      </button>
      <button 
        onClick={onClear}
        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
      >
        Clear
      </button>
    </div>
  </div>
);

/**
 * Metrics Overview Component
 */
const MetricsOverview: React.FC<{
  metrics: AnalyticsMetrics | null;
  onRefresh: () => void;
  isLoading: boolean;
}> = ({ metrics, onRefresh, isLoading }) => {
  if (!metrics) return null;

  return (
    <div className="metrics-overview p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Metrics Overview</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Users</div>
          <div className="text-2xl font-bold text-blue-900">{metrics.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-blue-500 mt-1">+{metrics.userGrowth}% from last month</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Page Views</div>
          <div className="text-2xl font-bold text-green-900">{metrics.pageViews.toLocaleString()}</div>
          <div className="text-xs text-green-500 mt-1">+{metrics.pageViewGrowth}% from last month</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Sessions</div>
          <div className="text-2xl font-bold text-purple-900">{metrics.sessions.toLocaleString()}</div>
          <div className="text-xs text-purple-500 mt-1">Avg: {metrics.avgSessionDuration}s</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">Conversion Rate</div>
          <div className="text-2xl font-bold text-orange-900">{metrics.conversionRate}%</div>
          <div className="text-xs text-orange-500 mt-1">+{metrics.conversionGrowth}% from last month</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Dashboard List Component
 */
const DashboardList: React.FC<{
  dashboards: AnalyticsDashboard[] | null;
  selectedDashboard: AnalyticsDashboard | null;
  onSelectDashboard: (dashboard: AnalyticsDashboard) => void;
  onCreateDashboard: () => void;
  onEditDashboard: (dashboard: AnalyticsDashboard) => void;
  onDeleteDashboard: (id: string) => void;
}> = ({ 
  dashboards, 
  selectedDashboard, 
  onSelectDashboard, 
  onCreateDashboard,
  onEditDashboard,
  onDeleteDashboard 
}) => {
  return (
    <div className="dashboard-list p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Dashboards</h3>
        <button
          onClick={onCreateDashboard}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Create Dashboard
        </button>
      </div>
      
      {dashboards && dashboards.length > 0 ? (
        <div className="space-y-2">
          {dashboards.map(dashboard => (
            <div
              key={dashboard.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedDashboard?.id === dashboard.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectDashboard(dashboard)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{dashboard.name}</h4>
                  <p className="text-sm text-gray-600">{dashboard.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {dashboard.widgets?.length || 0} widgets • Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDashboard(dashboard);
                    }}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDashboard(dashboard.id);
                    }}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No dashboards found. Create your first dashboard to get started.
        </div>
      )}
    </div>
  );
};

/**
 * Real-time Status Component
 */
const RealTimeStatus: React.FC<{
  realTimeEnabled: boolean;
  processingStatus: string;
  cacheHitRate: number;
  dataFreshness: string;
  lastUpdateTime: Date | null;
  onEnableRealTime: () => void;
  onDisableRealTime: () => void;
  onInvalidateCache: () => void;
}> = ({ 
  realTimeEnabled, 
  processingStatus,
  cacheHitRate,
  dataFreshness,
  lastUpdateTime,
  onEnableRealTime, 
  onDisableRealTime,
  onInvalidateCache
}) => (
  <div className="real-time-status p-4 bg-green-50 border border-green-200 rounded-lg">
    <div className="font-medium mb-2">Real-time Analytics</div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span>Real-time Updates:</span>
        <span className={`px-2 py-1 rounded text-xs ${
          realTimeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {realTimeEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Processing Status:</span>
        <span className={`px-2 py-1 rounded text-xs ${
          processingStatus === 'completed' ? 'bg-green-100 text-green-800' :
          processingStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
          processingStatus === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {processingStatus}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Cache Hit Rate:</span>
        <span className="text-xs font-medium">{cacheHitRate}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Data Freshness:</span>
        <span className={`px-2 py-1 rounded text-xs ${
          dataFreshness === 'fresh' ? 'bg-green-100 text-green-800' :
          dataFreshness === 'stale' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {dataFreshness}
        </span>
      </div>
      {lastUpdateTime && (
        <div className="text-xs text-gray-500">
          Last Update: {lastUpdateTime.toLocaleString()}
        </div>
      )}
    </div>
    <div className="mt-3 space-y-2">
      {!realTimeEnabled && (
        <button 
          onClick={onEnableRealTime}
          className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Enable Real-time
        </button>
      )}
      {realTimeEnabled && (
        <button 
          onClick={onDisableRealTime}
          className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Disable Real-time
        </button>
      )}
      <button 
        onClick={onInvalidateCache}
        className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Clear Cache
      </button>
    </div>
  </div>
);

/**
 * Enterprise Analytics Example Component
 */
export const EnterpriseAnalyticsExample: React.FC<EnterpriseAnalyticsExampleProps> = ({
  className = '',
  enableMigrationMode = false,
  dataProcessingLevel = 'enhanced',
  realTimeLevel = 'enhanced'
}) => {
  const [showCreateDashboard, setShowCreateDashboard] = useState(false);

  // Use either migration hook or direct enterprise hook
  const analytics = enableMigrationMode 
    ? useAnalyticsMigration({
        useEnterpriseHooks: true,
        enableFallback: true,
        logMigrationEvents: true,
        dataProcessingLevel,
        realTimeLevel
      })
    : useEnterpriseAnalytics();

  // Handle dashboard actions
  const handleSelectDashboard = (dashboard: AnalyticsDashboard) => {
    analytics.setSelectedDashboard(dashboard);
  };

  const handleCreateDashboard = () => {
    setShowCreateDashboard(true);
  };

  const handleEditDashboard = (dashboard: AnalyticsDashboard) => {
    // Implementation for editing dashboard
    console.log('Edit dashboard:', dashboard);
  };

  const handleDeleteDashboard = async (id: string) => {
    await analytics.deleteDashboard(id);
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    analytics.setDateRange(dateRange);
    analytics.fetchMetrics(dateRange);
  };

  return (
    <div className={`enterprise-analytics-example max-w-7xl mx-auto ${className}`}>
      {/* Migration Info */}
      {enableMigrationMode && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Migration Mode</span>
            <div className="text-xs text-purple-600">
              Status: {analytics.migration.isUsingEnterprise ? 'Enterprise' : 'Legacy'}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <div>Data Processing: {analytics.migration.config.dataProcessingLevel}</div>
            <div>Real-time Level: {analytics.migration.config.realTimeLevel}</div>
            <div>Performance: {analytics.migration.performance.enterpriseHookTime.toFixed(2)}ms</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Analytics</h1>
            <div className="flex space-x-2">
              <button
                onClick={analytics.refreshAllData}
                disabled={analytics.isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
              >
                {analytics.isLoading ? 'Refreshing...' : 'Refresh All'}
              </button>
              <button
                onClick={() => handleDateRangeChange({
                  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  endDate: new Date()
                })}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handleDateRangeChange({
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  endDate: new Date()
                })}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Date Range Display */}
          <div className="text-sm text-gray-600">
            Date Range: {analytics.dateRange.startDate.toLocaleDateString()} - {analytics.dateRange.endDate.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Overview */}
          <MetricsOverview
            metrics={analytics.metrics}
            onRefresh={analytics.fetchMetrics}
            isLoading={analytics.isLoading}
          />

          {/* Dashboards */}
          <DashboardList
            dashboards={analytics.dashboards}
            selectedDashboard={analytics.selectedDashboard}
            onSelectDashboard={handleSelectDashboard}
            onCreateDashboard={handleCreateDashboard}
            onEditDashboard={handleEditDashboard}
            onDeleteDashboard={handleDeleteDashboard}
          />

          {/* Selected Dashboard Details */}
          {analytics.selectedDashboard && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {analytics.selectedDashboard.name} - Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-gray-600">{analytics.selectedDashboard.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Widgets</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.selectedDashboard.widgets?.map((widget, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">{widget.title}</div>
                        <div className="text-sm text-gray-600">{widget.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Real-time Status */}
          <RealTimeStatus
            realTimeEnabled={analytics.realTimeEnabled}
            processingStatus={analytics.processingStatus}
            cacheHitRate={analytics.cacheHitRate}
            dataFreshness={analytics.dataFreshness}
            lastUpdateTime={analytics.lastUpdateTime}
            onEnableRealTime={analytics.enableRealTimeAnalytics}
            onDisableRealTime={analytics.disableRealTimeAnalytics}
            onInvalidateCache={analytics.invalidateCache}
          />

          {/* Quick Actions */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => analytics.trackEvent({
                  userId: 'current-user',
                  eventType: 'page_view',
                  properties: { page: 'analytics_dashboard' },
                  sessionId: 'current-session',
                  timestamp: new Date(),
                  metadata: { source: 'enterprise_analytics' }
                })}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Track Page View
              </button>
              <button
                onClick={() => analytics.generateReport({
                  type: 'summary',
                  dateRange: analytics.dateRange,
                  metrics: ['users', 'pageViews', 'sessions']
                })}
                className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Generate Report
              </button>
              <button
                onClick={() => analytics.runAnalysis('trend_analysis', {
                  timeframe: analytics.dateRange,
                  metrics: ['pageViews', 'sessions']
                })}
                className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Run Analysis
              </button>
            </div>
          </div>

          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
              <div className="space-y-2 text-xs">
                <div>Real-time Enabled: {analytics.realTimeEnabled.toString()}</div>
                <div>Processing Status: {analytics.processingStatus}</div>
                <div>Cache Hit Rate: {analytics.cacheHitRate}%</div>
                <div>Data Freshness: {analytics.dataFreshness}</div>
                <div>Loading: {analytics.isLoading.toString()}</div>
                <div>Error: {analytics.error || 'None'}</div>
                <div>Last Update: {analytics.lastUpdateTime?.toLocaleString() || 'Never'}</div>
                <div>Dashboards: {analytics.dashboards?.length || 0}</div>
                <div>Reports: {analytics.reports?.length || 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAnalyticsExample;
