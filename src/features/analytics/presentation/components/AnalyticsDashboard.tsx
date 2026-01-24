import * as React from 'react';
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { styles } from './AnalyticsDashboard.styles.ts';

interface AnalyticsDashboardProps {
  userId: string;
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, loading, error, fetchMetrics, getInsights } = useAnalyticsDI(userId);
  const [insights, setInsights] = React.useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'today' | 'yesterday' | 'last_7_days' | 'last_30_days'>('last_7_days');
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  // Fetch insights
  React.useEffect(() => {
    const loadInsights = async () => {
      try {
        const insightsData = await getInsights();
        setInsights(insightsData);
      } catch (err) {
        console.error('Failed to load insights:', err);
      }
    };

    loadInsights();
  }, [getInsights]);

  // Auto refresh
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics]);

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: typeof selectedTimeframe) => {
    setSelectedTimeframe(timeframe);
    fetchMetrics();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading && !metrics) {
    return (
      <div className={`analytics-dashboard ${className}`} style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`analytics-dashboard ${className}`} style={styles.container}>
        <div style={styles.error}>
          ❌ {error}
          <button style={styles.retryButton} onClick={() => fetchMetrics()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Analytics Dashboard</h2>
          <span style={styles.subtitle}>
            Real-time analytics and insights
          </span>
        </div>
        <div style={styles.headerRight}>
          <label style={styles.switch}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div style={styles.timeframeSelector}>
        <div style={styles.timeframeButtons}>
          {(['today', 'yesterday', 'last_7_days', 'last_30_days'] as const).map(timeframe => (
            <button
              key={timeframe}
              style={{
                ...styles.timeframeButton,
                ...(selectedTimeframe === timeframe ? styles.timeframeButtonActive : {})
              }}
              onClick={() => handleTimeframeChange(timeframe)}
            >
              {timeframe === 'today' && 'Today'}
              {timeframe === 'yesterday' && 'Yesterday'}
              {timeframe === 'last_7_days' && 'Last 7 Days'}
              {timeframe === 'last_30_days' && 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Total Events</span>
              <span style={styles.metricIcon}>📊</span>
            </div>
            <div style={styles.metricValue}>{formatNumber(metrics.totalEvents)}</div>
            <div style={styles.metricChange}>+12.5% from last period</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Unique Users</span>
              <span style={styles.metricIcon}>👥</span>
            </div>
            <div style={styles.metricValue}>{formatNumber(metrics.uniqueUsers)}</div>
            <div style={styles.metricChange}>+8.3% from last period</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Page Views</span>
              <span style={styles.metricIcon}>👁️</span>
            </div>
            <div style={styles.metricValue}>{formatNumber(metrics.pageViews)}</div>
            <div style={styles.metricChange}>+15.7% from last period</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Engagement</span>
              <span style={styles.metricIcon}>💡</span>
            </div>
            <div style={styles.metricValue}>{formatPercentage(metrics.userEngagement)}</div>
            <div style={styles.metricChange}>+2.1% from last period</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Bounce Rate</span>
              <span style={styles.metricIcon}>🏃</span>
            </div>
            <div style={styles.metricValue}>{formatPercentage(metrics.bounceRate)}</div>
            <div style={styles.metricChange}>-3.2% from last period</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>Error Rate</span>
              <span style={styles.metricIcon}>⚠️</span>
            </div>
            <div style={styles.metricValue}>{formatPercentage(metrics.errorRate)}</div>
            <div style={styles.metricChange}>-1.8% from last period</div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div style={styles.chartsSection}>
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Traffic Overview</h3>
          <div style={styles.chartPlaceholder}>
            📈 Line chart showing traffic trends over time
          </div>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Event Types</h3>
          <div style={styles.chartPlaceholder}>
            📊 Bar chart showing event distribution
          </div>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Content Performance</h3>
          <div style={styles.chartPlaceholder}>
            🥧 Pie chart showing content type distribution
          </div>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Recent Events</h3>
          <div style={styles.chartPlaceholder}>
            📋 Table showing recent analytics events
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div style={styles.insightsSection}>
          <h3 style={styles.sectionTitle}>AI Insights</h3>
          <div style={styles.insightsGrid}>
            {insights.map(insight => (
              <div key={insight.id} style={styles.insightCard}>
                <div style={styles.insightHeader}>
                  <div style={styles.insightTitleRow}>
                    <span style={styles.insightTitle}>{insight.title}</span>
                    <span style={{ ...styles.insightImpact, color: getImpactColor(insight.impact) }}>
                      {insight.impact}
                    </span>
                  </div>
                  <div style={styles.insightMeta}>
                    <span>{getTrendIcon(insight.trend)}</span>
                    <span>{formatPercentage(insight.changePercentage)}</span>
                    <span>{insight.timeframe}</span>
                  </div>
                </div>
                <div style={styles.insightDescription}>
                  {insight.description}
                </div>
                {insight.recommendations.length > 0 && (
                  <div style={styles.insightRecommendations}>
                    <div style={styles.recommendationsTitle}>Recommendations:</div>
                    <ul style={styles.recommendationsList}>
                      {insight.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <div style={styles.performanceSection}>
          <h3 style={styles.sectionTitle}>Performance Metrics</h3>
          <div style={styles.performanceGrid}>
            <div style={styles.performanceCard}>
              <div style={styles.performanceTitle}>Session Duration</div>
              <div style={styles.performanceValue}>
                {Math.floor(metrics.averageSessionDuration / 60)}m {metrics.averageSessionDuration % 60}s
              </div>
            </div>
            <div style={styles.performanceCard}>
              <div style={styles.performanceTitle}>Performance Score</div>
              <div style={styles.performanceValue}>{formatPercentage(metrics.performanceScore)}</div>
            </div>
            <div style={styles.performanceCard}>
              <div style={styles.performanceTitle}>Conversion Rate</div>
              <div style={styles.performanceValue}>{formatPercentage(metrics.conversionRate)}</div>
            </div>
            <div style={styles.performanceCard}>
              <div style={styles.performanceTitle}>Total Sessions</div>
              <div style={styles.performanceValue}>{formatNumber(metrics.totalSessions)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
