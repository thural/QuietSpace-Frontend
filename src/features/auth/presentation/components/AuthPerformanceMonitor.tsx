import React, { useState, useEffect } from 'react';
import { useAuthServices } from '@features/auth/application/hooks/useAuthServices';
import { SecurityStatus } from '@features/auth/application/services/AuthFeatureService';

/**
 * Auth Performance Monitor Component
 * 
 * Provides real-time performance monitoring for authentication operations
 * including cache hit rates, query performance, and security metrics.
 */
export const AuthPerformanceMonitor: React.FC<{ userId?: string }> = ({ userId }) => {
  const { authDataService } = useAuthServices();
  const [metrics, setMetrics] = useState<AuthPerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const startMonitoring = () => {
      setIsMonitoring(true);
      
      // Collect performance metrics every 5 seconds
      const interval = setInterval(async () => {
        try {
          const cacheStats = authDataService.getCacheStats?.();
          const securityStatus = await authDataService.getSecurityStatus?.(userId);
          
          const newMetrics: AuthPerformanceMetrics = {
            timestamp: new Date(),
            cacheHitRate: cacheStats?.hitRate || 0,
            cacheSize: cacheStats?.size || 0,
            queryPerformance: {
              avgResponseTime: cacheStats?.avgResponseTime || 0,
              totalQueries: cacheStats?.totalQueries || 0,
              errorRate: cacheStats?.errorRate || 0
            },
            securityMetrics: {
              riskLevel: securityStatus?.riskLevel || 'low',
              recentFailedLogins: securityStatus?.recentFailedLogins || 0,
              securityEvents: securityStatus?.recentSecurityEvents || 0
            },
            memoryUsage: {
              used: cacheStats?.memoryUsed || 0,
              total: cacheStats?.memoryTotal || 0
            }
          };
          
          setMetrics(newMetrics);
        } catch (error) {
          console.error('Error collecting auth performance metrics:', error);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        setIsMonitoring(false);
      };
    };

    const cleanup = startMonitoring();
    return cleanup;
  }, [userId, authDataService]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getCacheHitRateColor = (hitRate: number) => {
    if (hitRate >= 80) return '#10b981';
    if (hitRate >= 60) return '#f59e0b';
    if (hitRate >= 40) return '#ef4444';
    return '#dc2626';
  };

  if (!userId) {
    return (
      <div className="auth-performance-monitor">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">User ID required for performance monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-performance-monitor bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Auth Performance Monitor</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {isMonitoring ? 'Monitoring' : 'Idle'}
          </span>
        </div>
      </div>

      {metrics ? (
        <div className="space-y-6">
          {/* Cache Performance */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Cache Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Hit Rate</p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: getCacheHitRateColor(metrics.cacheHitRate) }}
                >
                  {metrics.cacheHitRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cache Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.cacheSize}
                </p>
              </div>
            </div>
          </div>

          {/* Query Performance */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Query Performance</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.queryPerformance.avgResponseTime.toFixed(0)}ms
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.queryPerformance.totalQueries}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.queryPerformance.errorRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Security Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span 
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: getRiskLevelColor(metrics.securityMetrics.riskLevel) }}
                >
                  {metrics.securityMetrics.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recent Failed Logins</span>
                <span className="text-sm font-medium text-red-600">
                  {metrics.securityMetrics.recentFailedLogins}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Security Events</span>
                <span className="text-sm font-medium text-orange-600">
                  {metrics.securityMetrics.securityEvents}
                </span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Memory Usage</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Used</span>
                <span className="text-sm font-medium text-gray-900">
                  {(metrics.memoryUsage.used / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ 
                    width: `${(metrics.memoryUsage.used / metrics.memoryUsage.total) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-xs text-gray-500">
                  {(metrics.memoryUsage.total / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {metrics.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance metrics...</p>
        </div>
      )}
    </div>
  );
};

// Supporting types
interface AuthPerformanceMetrics {
  timestamp: Date;
  cacheHitRate: number;
  cacheSize: number;
  queryPerformance: {
    avgResponseTime: number;
    totalQueries: number;
    errorRate: number;
  };
  securityMetrics: {
    riskLevel: string;
    recentFailedLogins: number;
    securityEvents: number;
  };
  memoryUsage: {
    used: number;
    total: number;
  };
}

export default AuthPerformanceMonitor;
