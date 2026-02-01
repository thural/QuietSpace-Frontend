import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { styles } from './PerformanceMonitor.styles.ts';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from "@/shared/components/base/BaseClassComponent";
import { ReactNode } from "react";

export interface IPerformanceMonitorProps extends IBaseComponentProps {
  userId: string;
  className?: string;
}

interface IPerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: Array<{ timestamp: Date; value: number }>;
}

interface IFeaturePerformance {
  feature: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  cacheHitRate: number;
  memoryUsage: number;
}

interface IPerformanceMonitorState extends IBaseComponentState {
  selectedTimeframe: '1h' | '6h' | '24h' | '7d';
  isMonitoring: boolean;
  alerts: any[];
  performanceMetrics: IPerformanceMetric[];
  featurePerformance: IFeaturePerformance[];
  analyticsData: any;
  monitoringInterval: NodeJS.Timeout | null;
}

/**
 * PerformanceMonitor component.
 * 
 * This component provides comprehensive performance monitoring capabilities with real-time metrics,
 * alerting system, and feature-specific performance tracking. It monitors response times,
 * throughput, error rates, availability, cache hit rates, and memory usage across different features.
 * 
 * Converted to class-based component following enterprise patterns.
 */
class PerformanceMonitor extends BaseClassComponent<IPerformanceMonitorProps, IPerformanceMonitorState> {

  private analyticsService: any;

  protected override getInitialState(): Partial<IPerformanceMonitorState> {
    return {
      selectedTimeframe: '6h',
      isMonitoring: true,
      alerts: [],
      performanceMetrics: [
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
            value: 140 + Math.random() * 20
          }))
        },
        {
          id: 'throughput',
          name: 'Requests per Second',
          value: 1250,
          unit: 'req/s',
          threshold: 1000,
          status: 'good',
          trend: 'up',
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: new Date(Date.now() - (19 - i) * 60000),
            value: 1200 + Math.random() * 100
          }))
        },
        {
          id: 'error-rate',
          name: 'Error Rate',
          value: 0.02,
          unit: '%',
          threshold: 0.05,
          status: 'good',
          trend: 'down',
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: new Date(Date.now() - (19 - i) * 60000),
            value: 0.01 + Math.random() * 0.03
          }))
        },
        {
          id: 'availability',
          name: 'System Availability',
          value: 99.8,
          unit: '%',
          threshold: 99.5,
          status: 'good',
          trend: 'stable',
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: new Date(Date.now() - (19 - i) * 60000),
            value: 99.5 + Math.random() * 0.5
          }))
        },
        {
          id: 'cache-hit-rate',
          name: 'Cache Hit Rate',
          value: 85.2,
          unit: '%',
          threshold: 80,
          status: 'good',
          trend: 'up',
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: new Date(Date.now() - (19 - i) * 60000),
            value: 80 + Math.random() * 10
          }))
        },
        {
          id: 'memory-usage',
          name: 'Memory Usage',
          value: 68.5,
          unit: '%',
          threshold: 80,
          status: 'good',
          trend: 'stable',
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: new Date(Date.now() - (19 - i) * 60000),
            value: 65 + Math.random() * 10
          }))
        }
      ],
      featurePerformance: [
        {
          feature: 'API Gateway',
          responseTime: 120,
          throughput: 1500,
          errorRate: 0.01,
          availability: 99.9,
          cacheHitRate: 88.5,
          memoryUsage: 45.2
        },
        {
          feature: 'Database',
          responseTime: 85,
          throughput: 800,
          errorRate: 0.005,
          availability: 99.95,
          cacheHitRate: 92.1,
          memoryUsage: 62.8
        },
        {
          feature: 'Cache Service',
          responseTime: 25,
          throughput: 3000,
          errorRate: 0.001,
          availability: 99.99,
          cacheHitRate: 95.8,
          memoryUsage: 28.5
        },
        {
          feature: 'Authentication',
          responseTime: 200,
          throughput: 500,
          errorRate: 0.02,
          availability: 99.8,
          cacheHitRate: 82.3,
          memoryUsage: 35.7
        }
      ],
      analyticsData: null,
      monitoringInterval: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    // Initialize analytics service
    this.analyticsService = useAnalyticsDI(this.props.userId);
    this.updateAnalyticsData();
    this.startMonitoring();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    // Clean up monitoring interval
    if (this.state.monitoringInterval) {
      clearInterval(this.state.monitoringInterval);
    }
  }

  protected override onUpdate(): void {
    this.updateAnalyticsData();
  }

  /**
   * Update analytics data from service
   */
  private updateAnalyticsData = (): void => {
    if (this.analyticsService) {
      const { metrics, trackEvent } = this.analyticsService;
      this.safeSetState({
        analyticsData: { metrics, trackEvent }
      });
    }
  };

  /**
   * Start performance monitoring
   */
  private startMonitoring = (): void => {
    if (this.state.monitoringInterval) {
      clearInterval(this.state.monitoringInterval);
    }

    const interval = setInterval(() => {
      this.updateMetrics();
      this.checkAlerts();
    }, 5000);

    this.safeSetState({ monitoringInterval: interval });
  };

  /**
   * Stop performance monitoring
   */
  private stopMonitoring = (): void => {
    if (this.state.monitoringInterval) {
      clearInterval(this.state.monitoringInterval);
      this.safeSetState({ monitoringInterval: null });
    }
  };

  /**
   * Toggle monitoring
   */
  private toggleMonitoring = (): void => {
    const newIsMonitoring = !this.state.isMonitoring;
    this.safeSetState({ isMonitoring: newIsMonitoring });

    if (newIsMonitoring) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  };

  /**
   * Handle timeframe change
   */
  private handleTimeframeChange = (timeframe: typeof this.state.selectedTimeframe): void => {
    this.safeSetState({ selectedTimeframe: timeframe });
  };

  /**
   * Update metrics with simulated data
   */
  private updateMetrics = (): void => {
    this.safeSetState(prev => ({
      performanceMetrics: prev.performanceMetrics.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 10,
        history: [
          ...metric.history.slice(-19),
          {
            timestamp: new Date(),
            value: metric.value + (Math.random() - 0.5) * 10
          }
        ],
        status: this.calculateStatus(metric.value, metric.threshold),
        trend: this.calculateTrend(metric.history)
      }))
    }));
  };

  /**
   * Calculate metric status
   */
  private calculateStatus = (value: number, threshold: number): 'good' | 'warning' | 'critical' => {
    if (value < threshold * 0.8) return 'good';
    if (value < threshold) return 'warning';
    return 'critical';
  };

  /**
   * Calculate metric trend
   */
  private calculateTrend = (history: Array<{ timestamp: Date; value: number }>): 'up' | 'down' | 'stable' => {
    if (history.length < 2) return 'stable';

    const recent = history.slice(-5);
    const older = history.slice(-10, -5);

    const recentAvg = recent.reduce((sum, point) => sum + point.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + point.value, 0) / older.length;

    if (recentAvg > olderAvg * 1.05) return 'up';
    if (recentAvg < olderAvg * 0.95) return 'down';
    return 'stable';
  };

  /**
   * Check for performance alerts
   */
  private checkAlerts = (): void => {
    const newAlerts = this.state.performanceMetrics
      .filter(metric => metric.status === 'critical')
      .map(metric => ({
        id: `${metric.id}-${Date.now()}`,
        metric: metric.name,
        message: `${metric.name} is ${metric.status}: ${metric.value}${metric.unit}`,
        severity: metric.status,
        timestamp: new Date()
      }));

    if (newAlerts.length > 0) {
      this.safeSetState(prev => ({
        alerts: [...prev.alerts.slice(-9), ...newAlerts]
      }));
    }
  };

  /**
   * Get status color
   */
  private getStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  /**
   * Get trend icon
   */
  private getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  protected override renderContent(): ReactNode {
    const { className } = this.props;
    const { selectedTimeframe, isMonitoring, alerts, performanceMetrics, featurePerformance } = this.state;

    return (
      <div className={`performance-monitor ${className}`} style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Performance Monitor</h2>
          <div style={styles.controls}>
            <div style={styles.controlGroup}>
              <label style={styles.label}>Timeframe:</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => this.handleTimeframeChange(e.target.value as any)}
                style={styles.select}
              >
                <option value="1h">1 Hour</option>
                <option value="6h">6 Hours</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>

            <div style={styles.controlGroup}>
              <button
                onClick={this.toggleMonitoring}
                style={{
                  ...styles.button,
                  backgroundColor: isMonitoring ? '#10b981' : '#6b7280'
                }}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={styles.alerts}>
            <h3 style={styles.alertsTitle}>Performance Alerts</h3>
            <div style={styles.alertsList}>
              {alerts.map(alert => (
                <div key={alert.id} style={{
                  ...styles.alert,
                  borderLeftColor: this.getStatusColor(alert.severity)
                }}>
                  <div style={styles.alertHeader}>
                    <span style={styles.alertSeverity}>{alert.severity.toUpperCase()}</span>
                    <span style={styles.alertTime}>{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div style={styles.alertMessage}>{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div style={styles.metricsSection}>
          <h3 style={styles.sectionTitle}>Key Performance Metrics</h3>
          <div style={styles.metricsGrid}>
            {performanceMetrics.map(metric => (
              <div key={metric.id} style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <span style={styles.metricName}>{metric.name}</span>
                  <span style={{
                    ...styles.metricTrend,
                    color: this.getStatusColor(metric.status)
                  }}>
                    {this.getTrendIcon(metric.trend)}
                  </span>
                </div>
                <div style={styles.metricValue}>
                  <span style={{
                    ...styles.metricNumber,
                    color: this.getStatusColor(metric.status)
                  }}>
                    {metric.value.toFixed(2)}
                  </span>
                  <span style={styles.metricUnit}>{metric.unit}</span>
                </div>
                <div style={styles.metricThreshold}>
                  Threshold: {metric.threshold}{metric.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Performance */}
        <div style={styles.featuresSection}>
          <h3 style={styles.sectionTitle}>Feature Performance</h3>
          <div style={styles.featuresGrid}>
            {featurePerformance.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <h4 style={styles.featureName}>{feature.feature}</h4>
                <div style={styles.featureMetrics}>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Response Time</span>
                    <span style={styles.metricValue}>{feature.responseTime}ms</span>
                  </div>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Throughput</span>
                    <span style={styles.metricValue}>{feature.throughput} req/s</span>
                  </div>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Error Rate</span>
                    <span style={styles.metricValue}>{(feature.errorRate * 100).toFixed(2)}%</span>
                  </div>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Availability</span>
                    <span style={styles.metricValue}>{feature.availability}%</span>
                  </div>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Cache Hit Rate</span>
                    <span style={styles.metricValue}>{feature.cacheHitRate}%</span>
                  </div>
                  <div style={styles.featureMetric}>
                    <span style={styles.metricLabel}>Memory Usage</span>
                    <span style={styles.metricValue}>{feature.memoryUsage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={styles.statusSection}>
          <h3 style={styles.sectionTitle}>System Status</h3>
          <div style={styles.statusGrid}>
            <div style={styles.statusCard}>
              <div style={styles.statusIndicator} style={{ backgroundColor: '#10b981' }}></div>
              <div style={styles.statusText}>All Systems Operational</div>
            </div>
            <div style={styles.statusCard}>
              <div style={styles.statusIndicator} style={{ backgroundColor: '#f59e0b' }}></div>
              <div style={styles.statusText}>Minor Performance Issues</div>
            </div>
            <div style={styles.statusCard}>
              <div style={styles.statusIndicator} style={{ backgroundColor: '#ef4444' }}></div>
              <div style={styles.statusText}>Critical Issues Detected</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PerformanceMonitor;
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
