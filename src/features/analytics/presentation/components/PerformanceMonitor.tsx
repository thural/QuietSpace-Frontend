import * as React from 'react';
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { styles } from './PerformanceMonitor.styles.ts';

interface PerformanceMonitorProps {
  userId: string;
  className?: string;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: Array<{ timestamp: Date; value: number }>;
}

interface FeaturePerformance {
  feature: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, trackEvent } = useAnalyticsDI(userId);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'1h' | '6h' | '24h' | '7d'>('6h');
  const [isMonitoring, setIsMonitoring] = React.useState(true);
  const [alerts, setAlerts] = React.useState<any[]>([]);

  // Sample performance metrics data
  const [performanceMetrics, setPerformanceMetrics] = React.useState<PerformanceMetric[]>([
    {
      id: 'response-time',
      name: 'Average Response Time',
      value: 145,
      unit: 'ms',
      threshold: 500,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 60000),
        value: 120 + Math.random() * 60
      }))
    },
    {
      id: 'throughput',
      name: 'Request Throughput',
      value: 1250,
      unit: 'req/s',
      threshold: 500,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 60000),
        value: 1000 + Math.random() * 500
      }))
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      threshold: 5,
      status: 'good',
      trend: 'down',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 60000),
        value: 0.5 + Math.random() * 2
      }))
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      threshold: 85,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 60000),
        value: 60 + Math.random() * 15
      }))
    },
    {
      id: 'cpu-usage',
      name: 'CPU Usage',
      value: 42,
      unit: '%',
      threshold: 80,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 60000),
        value: 35 + Math.random() * 20
      }))
    }
  ]);

  // Feature performance data
  const [featurePerformance, setFeaturePerformance] = React.useState<FeaturePerformance[]>([
    {
      feature: 'Analytics',
      responseTime: 120,
      throughput: 850,
      errorRate: 0.5,
      availability: 99.8,
      cacheHitRate: 94,
      memoryUsage: 45
    },
    {
      feature: 'Notifications',
      responseTime: 95,
      throughput: 1200,
      errorRate: 0.2,
      availability: 99.9,
      cacheHitRate: 88,
      memoryUsage: 32
    },
    {
      feature: 'Content Management',
      responseTime: 180,
      throughput: 450,
      errorRate: 1.2,
      availability: 99.5,
      cacheHitRate: 76,
      memoryUsage: 58
    },
    {
      feature: 'Search',
      responseTime: 85,
      throughput: 2100,
      errorRate: 0.3,
      availability: 99.7,
      cacheHitRate: 92,
      memoryUsage: 38
    },
    {
      feature: 'Profile',
      responseTime: 110,
      throughput: 680,
      errorRate: 0.4,
      availability: 99.9,
      cacheHitRate: 85,
      memoryUsage: 41
    }
  ]);

  // Sample alerts
  const sampleAlerts = [
    {
      id: 'alert-001',
      type: 'warning',
      title: 'High Memory Usage',
      description: 'Memory usage exceeded 80% threshold',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      feature: 'Content Management',
      severity: 'medium'
    },
    {
      id: 'alert-002',
      type: 'critical',
      title: 'Service Degradation',
      description: 'Analytics service response time exceeded 1s threshold',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      feature: 'Analytics',
      severity: 'high'
    },
    {
      id: 'alert-003',
      type: 'info',
      title: 'Performance Improvement',
      description: 'Search service performance improved by 15%',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      feature: 'Search',
      severity: 'low'
    }
  ];

  React.useEffect(() => {
    setAlerts(sampleAlerts);
  }, []);

  // Simulate real-time updates
  React.useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setPerformanceMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * metric.value * 0.1,
        history: [...metric.history.slice(-19), {
          timestamp: new Date(),
          value: metric.value + (Math.random() - 0.5) * metric.value * 0.1
        }]
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 'req/s') return `${Math.round(value)} req/s`;
    return value.toString();
  };

  return (
    <div className={`performance-monitor ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Performance Monitoring</h2>
          <span style={styles.subtitle}>
            Real-time system performance and health metrics
          </span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isMonitoring ? styles.toggleButtonActive : {})
            }}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? '🔴 Monitoring' : '⚫ Paused'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Timeframe:</label>
          <div style={styles.buttonGroup}>
            {(['1h', '6h', '24h', '7d'] as const).map(timeframe => (
              <button
                key={timeframe}
                style={{
                  ...styles.timeframeButton,
                  ...(selectedTimeframe === timeframe ? styles.timeframeButtonActive : {})
                }}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe === '1h' && '1 Hour'}
                {timeframe === '6h' && '6 Hours'}
                {timeframe === '24h' && '24 Hours'}
                {timeframe === '7d' && '7 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsSection}>
        <h3 style={styles.sectionTitle}>Key Performance Metrics</h3>
        <div style={styles.metricsGrid}>
          {performanceMetrics.map(metric => (
            <div key={metric.id} style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <div style={styles.metricName}>{metric.name}</div>
                <div style={styles.metricTrend}>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
              <div style={styles.metricValue}>
                <span style={{ 
                  ...styles.metricNumber,
                  color: getStatusColor(metric.status)
                }}>
                  {formatValue(metric.value, metric.unit)}
                </span>
                <span style={styles.metricUnit}>{metric.unit}</span>
              </div>
              <div style={styles.metricStatus}>
                <div style={{ 
                  ...styles.statusIndicator,
                  backgroundColor: getStatusColor(metric.status)
                }}></div>
                <span style={styles.statusText}>{metric.status}</span>
              </div>
              <div style={styles.metricChart}>
                <svg width="100%" height="40" viewBox="0 0 100 40">
                  <polyline
                    fill="none"
                    stroke={getStatusColor(metric.status)}
                    strokeWidth="2"
                    points={metric.history.slice(-10).map((point, index) => 
                      `${(index * 10)},${40 - (point.value / 200) * 40}`
                    ).join(' ')}
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Performance */}
      <div style={styles.featureSection}>
        <h3 style={styles.sectionTitle}>Feature Performance</h3>
        <div style={styles.featureGrid}>
          {featurePerformance.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureHeader}>
                <div style={styles.featureName}>{feature.feature}</div>
                <div style={styles.featureStatus}>
                  <div style={{ 
                    ...styles.statusIndicator,
                    backgroundColor: getStatusColor(feature.availability > 99 ? 'good' : 'warning')
                  }}></div>
                </div>
              </div>
              <div style={styles.featureMetrics}>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Response Time</div>
                  <div style={styles.metricValue}>{feature.responseTime}ms</div>
                </div>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Throughput</div>
                  <div style={styles.metricValue}>{feature.throughput} req/s</div>
                </div>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Error Rate</div>
                  <div style={styles.metricValue}>{feature.errorRate}%</div>
                </div>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Availability</div>
                  <div style={styles.metricValue}>{feature.availability}%</div>
                </div>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Cache Hit Rate</div>
                  <div style={styles.metricValue}>{feature.cacheHitRate}%</div>
                </div>
                <div style={styles.featureMetric}>
                  <div style={styles.metricLabel}>Memory Usage</div>
                  <div style={styles.metricValue}>{feature.memoryUsage}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Alerts */}
      <div style={styles.alertsSection}>
        <h3 style={styles.sectionTitle}>Performance Alerts</h3>
        <div style={styles.alertsList}>
          {alerts.map(alert => (
            <div key={alert.id} style={styles.alertCard}>
              <div style={styles.alertHeader}>
                <div style={styles.alertIcon}>
                  {getAlertIcon(alert.type)}
                </div>
                <div style={styles.alertInfo}>
                  <div style={styles.alertTitle}>{alert.title}</div>
                  <div style={styles.alertDescription}>{alert.description}</div>
                </div>
                <div style={styles.alertMeta}>
                  <div style={styles.alertFeature}>{alert.feature}</div>
                  <div style={styles.alertTime}>
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div style={styles.alertActions}>
                <button style={styles.alertAction}>🔍 Investigate</button>
                <button style={styles.alertAction}>✅ Acknowledge</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Recommendations */}
      <div style={styles.recommendationsSection}>
        <h3 style={styles.sectionTitle}>Performance Recommendations</h3>
        <div style={styles.recommendationsGrid}>
          <div style={styles.recommendationCard}>
            <div style={styles.recommendationHeader}>
              <div style={styles.recommendationIcon}>⚡</div>
              <div style={styles.recommendationTitle}>Optimize Database Queries</div>
            </div>
            <div style={styles.recommendationDescription}>
              Content Management feature shows slow response times. Consider adding indexes and optimizing queries.
            </div>
            <div style={styles.recommendationImpact}>
              <span style={styles.impactLabel}>Impact:</span>
              <span style={styles.impactValue}>High</span>
            </div>
          </div>

          <div style={styles.recommendationCard}>
            <div style={styles.recommendationHeader}>
              <div style={styles.recommendationIcon}>💾</div>
              <div style={styles.recommendationTitle}>Increase Cache Size</div>
            </div>
            <div style={styles.recommendationDescription}>
              Analytics service has low cache hit rate. Consider increasing cache allocation.
            </div>
            <div style={styles.recommendationImpact}>
              <span style={styles.impactLabel}>Impact:</span>
              <span style={styles.impactValue}>Medium</span>
            </div>
          </div>

          <div style={styles.recommendationCard}>
            <div style={styles.recommendationHeader}>
              <div style={styles.recommendationIcon}>🔄</div>
              <div style={styles.recommendationTitle}>Load Balancing</div>
            </div>
            <div style={styles.recommendationDescription}>
              Search service experiencing high load. Consider implementing load balancing.
            </div>
            <div style={styles.recommendationImpact}>
              <span style={styles.impactLabel}>Impact:</span>
              <span style={styles.impactValue}>Medium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
