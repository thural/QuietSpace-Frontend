/**
 * Logging Dashboard Component
 * 
 * React component for displaying real-time logging metrics and analytics.
 */

import React, { useState, useEffect } from 'react';
import { LoggingDashboard, IDashboardData } from '../../../core/modules/logging/monitoring';

interface Props {
  dashboard: LoggingDashboard;
  className?: string;
}

export const LoggingDashboardComponent: React.FC<Props> = ({ dashboard, className }) => {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Start dashboard
    dashboard.start();

    // Update data periodically
    const updateData = () => {
      setData(dashboard.getDashboardData());
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => {
      clearInterval(interval);
      dashboard.stop();
    };
  }, [dashboard]);

  if (!data) {
    return <div>Loading dashboard...</div>;
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Logging Dashboard</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Health Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">System Health</h3>
          <div className="flex items-center">
            <span className={`font-bold ${getHealthColor(data.health.status)}`}>
              {data.health.status.toUpperCase()}
            </span>
            <span className="ml-4 text-sm text-gray-600">
              Score: {data.health.score}/100
            </span>
          </div>
        </div>
        {data.health.issues.length > 0 && (
          <div className="mt-2">
            {data.health.issues.map((issue, index) => (
              <div key={index} className="text-sm text-red-600">
                • {issue}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800">Total Logs</h4>
          <p className="text-2xl font-bold text-blue-600">
            {data.overview.totalLogs.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-red-800">Error Rate</h4>
          <p className="text-2xl font-bold text-red-600">
            {data.overview.errorRate.toFixed(2)}%
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-800">Security Events</h4>
          <p className="text-2xl font-bold text-purple-600">
            {data.overview.securityEvents}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800">Avg Processing Time</h4>
          <p className="text-2xl font-bold text-green-600">
            {data.overview.avgProcessingTime.toFixed(2)}ms
          </p>
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Active Alerts</h3>
          <div className="space-y-2">
            {data.alerts.map((alert, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <span className={`font-semibold ${getSeverityColor(alert.severity)}`}>
                    {alert.name}
                  </span>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Level Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Log Level Distribution</h3>
            <div className="space-y-2">
              {Object.entries(data.levelDistribution).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="font-medium">{level}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(count / data.overview.totalLogs) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Errors */}
          {data.topErrors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Top Errors</h3>
              <div className="space-y-2">
                {data.topErrors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-red-800">{error.message}</p>
                        <p className="text-sm text-gray-600">
                          {error.count} occurrences ({error.percentage.toFixed(2)}%)
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {error.lastOccurrence.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-800">Average Processing Time</h4>
                <p className="text-xl font-bold text-gray-600">
                  {data.performance.avgProcessingTime.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-800">Max Processing Time</h4>
                <p className="text-xl font-bold text-gray-600">
                  {data.performance.maxProcessingTime.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-800">Throughput</h4>
                <p className="text-xl font-bold text-gray-600">
                  {data.performance.throughput.toFixed(2)} logs/sec
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
