import * as React from 'react';
import { useAnalyticsDI } from '@/features/analytics/application/services/AnalyticsServiceDI';
import { useNotificationsDI } from '@notification/application/services/NotificationServiceDI';
import { useContentDI } from '@content/application/services';
import { styles } from './CrossFeatureAnalytics.styles.ts';

interface CrossFeatureAnalyticsProps {
  userId: string;
  className?: string;
}

export const CrossFeatureAnalytics: React.FC<CrossFeatureAnalyticsProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { trackEvent, metrics: analyticsMetrics } = useAnalyticsDI(userId);
  const { notifications } = useNotificationsDI(userId);
  const { contents } = useContentDI(userId);

  // Track cross-feature interactions
  const [featureUsage, setFeatureUsage] = React.useState({
    notifications: 0,
    content: 0,
    analytics: 0,
    search: 0,
    profile: 0,
    settings: 0
  });

  const [realTimeStats, setRealTimeStats] = React.useState({
    activeUsers: 0,
    totalEvents: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        totalEvents: prev.totalEvents + Math.floor(Math.random() * 10),
        errorRate: Math.random() * 5,
        avgResponseTime: Math.floor(Math.random() * 200) + 100
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Track feature usage when components are used
  React.useEffect(() => {
    if (notifications.length > 0) {
      trackEvent('feature_usage', {
        featureName: 'notifications',
        actionType: 'view',
        targetElement: 'notification_list'
      });
    }
  }, [notifications, trackEvent]);

  React.useEffect(() => {
    if (contents.length > 0) {
      trackEvent('feature_usage', {
        featureName: 'content',
        actionType: 'view',
        targetElement: 'content_list'
      });
    }
  }, [contents, trackEvent]);

  // Calculate cross-feature metrics
  const crossFeatureMetrics = React.useMemo(() => {
    const totalNotifications = notifications.length;
    const totalContent = contents.length;
    const engagementRate = analyticsMetrics ? analyticsMetrics.userEngagement : 0;
    const activeFeatures = Object.values(featureUsage).filter(count => count > 0).length;

    return {
      totalNotifications,
      totalContent,
      engagementRate,
      activeFeatures,
      crossFeatureScore: (totalNotifications + totalContent) * (engagementRate / 100)
    };
  }, [notifications, contents, analyticsMetrics, featureUsage]);

  const getFeatureIcon = (feature: string): string => {
    const icons: Record<string, string> = {
      notifications: '🔔',
      content: '📝',
      analytics: '📊',
      search: '🔍',
      profile: '👤',
      settings: '⚙️'
    };
    return icons[feature] || '📱';
  };

  const getHealthStatus = (metric: number, thresholds: { good: number; warning: number }): { status: 'good' | 'warning' | 'critical'; color: string } => {
    if (metric <= thresholds.good) return { status: 'good', color: '#28a745' };
    if (metric <= thresholds.warning) return { status: 'warning', color: '#ffc107' };
    return { status: 'critical', color: '#dc3545' };
  };

  const errorHealth = getHealthStatus(realTimeStats.errorRate, { good: 1, warning: 3 });
  const responseHealth = getHealthStatus(realTimeStats.avgResponseTime, { good: 200, warning: 500 });

  return (
    <div className={`cross-feature-analytics ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Cross-Feature Analytics</h2>
        <span style={styles.subtitle}>
          Real-time integration metrics across all features
        </span>
      </div>

      {/* Real-time Stats */}
      <div style={styles.realTimeSection}>
        <h3 style={styles.sectionTitle}>📡 Real-time Status</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Active Users</span>
              <span style={styles.statIcon}>👥</span>
            </div>
            <div style={styles.statValue}>{realTimeStats.activeUsers}</div>
            <div style={styles.statChange}>+12% from last hour</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Total Events</span>
              <span style={styles.statIcon}>📊</span>
            </div>
            <div style={styles.statValue}>{realTimeStats.totalEvents.toLocaleString()}</div>
            <div style={styles.statChange}>+8.3% from last hour</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Error Rate</span>
              <span style={{ ...styles.statIcon, color: errorHealth.color }}>⚠️</span>
            </div>
            <div style={{ ...styles.statValue, color: errorHealth.color }}>
              {realTimeStats.errorRate.toFixed(1)}%
            </div>
            <div style={{ ...styles.statChange, color: errorHealth.color }}>
              Status: {errorHealth.status}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statTitle}>Response Time</span>
              <span style={{ ...styles.statIcon, color: responseHealth.color }}>⚡</span>
            </div>
            <div style={{ ...styles.statValue, color: responseHealth.color }}>
              {realTimeStats.avgResponseTime}ms
            </div>
            <div style={{ ...styles.statChange, color: responseHealth.color }}>
              Status: {responseHealth.status}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Integration Matrix */}
      <div style={styles.integrationSection}>
        <h3 style={styles.sectionTitle}>🔗 Feature Integration Matrix</h3>
        <div style={styles.matrixGrid}>
          {Object.entries(featureUsage).map(([feature, count]) => (
            <div key={feature} style={styles.matrixCard}>
              <div style={styles.matrixHeader}>
                <span style={styles.matrixIcon}>{getFeatureIcon(feature)}</span>
                <span style={styles.matrixTitle}>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
              </div>
              <div style={styles.matrixValue}>{count}</div>
              <div style={styles.matrixDescription}>Interactions this session</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Feature Metrics */}
      <div style={styles.metricsSection}>
        <h3 style={styles.sectionTitle}>📈 Cross-Feature Metrics</h3>
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricTitle}>Total Notifications</div>
            <div style={styles.metricValue}>{crossFeatureMetrics.totalNotifications}</div>
            <div style={styles.metricDescription}>Across all users</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTitle}>Content Items</div>
            <div style={styles.metricValue}>{crossFeatureMetrics.totalContent}</div>
            <div style={styles.metricDescription}>Total content created</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTitle}>Engagement Rate</div>
            <div style={styles.metricValue}>{crossFeatureMetrics.engagementRate.toFixed(1)}%</div>
            <div style={styles.metricDescription}>User interaction level</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTitle}>Active Features</div>
            <div style={styles.metricValue}>{crossFeatureMetrics.activeFeatures}</div>
            <div style={styles.metricDescription}>Features used this session</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTitle}>Cross-Feature Score</div>
            <div style={styles.metricValue}>{crossFeatureMetrics.crossFeatureScore.toFixed(1)}</div>
            <div style={styles.metricDescription}>Integration effectiveness</div>
          </div>
        </div>
      </div>

      {/* Feature Health */}
      <div style={styles.healthSection}>
        <h3 style={styles.sectionTitle}>🏥 Feature Health Status</h3>
        <div style={styles.healthGrid}>
          <div style={{ ...styles.healthCard, borderColor: '#28a745' }}>
            <div style={styles.healthHeader}>
              <span style={styles.healthTitle}>Notifications</span>
              <span style={styles.healthStatus}>✅ Healthy</span>
            </div>
            <div style={styles.healthMetrics}>
              <div>Latency: 45ms</div>
              <div>Success Rate: 99.8%</div>
              <div>Uptime: 99.9%</div>
            </div>
          </div>

          <div style={{ ...styles.healthCard, borderColor: '#28a745' }}>
            <div style={styles.healthHeader}>
              <span style={styles.healthTitle}>Content</span>
              <span style={styles.healthStatus}>✅ Healthy</span>
            </div>
            <div style={styles.healthMetrics}>
              <div>Processing: 120ms</div>
              <div>Storage: 78% available</div>
              <div>Cache Hit: 94%</div>
            </div>
          </div>

          <div style={{ ...styles.healthCard, borderColor: '#ffc107' }}>
            <div style={styles.healthHeader}>
              <span style={styles.healthTitle}>Analytics</span>
              <span style={styles.healthStatus}>⚠️ Warning</span>
            </div>
            <div style={styles.healthMetrics}>
              <div>Processing: 280ms</div>
              <div>Queue: 1,234 items</div>
              <div>Memory: 82%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Insights */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>💡 Integration Insights</h3>
        <div style={styles.insightsList}>
          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightTitle}>High Feature Adoption</span>
              <span style={styles.insightImpact}>📈 Positive</span>
            </div>
            <div style={styles.insightDescription}>
              Users are actively engaging with multiple features, showing strong adoption of the integrated platform.
            </div>
            <div style={styles.insightRecommendation}>
              Consider adding cross-feature workflows to enhance user experience.
            </div>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightTitle}>Analytics Processing Load</span>
              <span style={styles.insightImpact}>⚠️ Monitor</span>
            </div>
            <div style={styles.insightDescription}>
              Analytics service is experiencing increased load during peak hours.
            </div>
            <div style={styles.insightRecommendation}>
              Implement queue management and optimize processing algorithms.
            </div>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightTitle}>Cross-Feature Synergy</span>
              <span style={styles.insightImpact}>🎯 Opportunity</span>
            </div>
            <div style={styles.insightDescription}>
              Strong correlation between content creation and notification engagement detected.
            </div>
            <div style={styles.insightRecommendation}>
              Create automated notifications for content-related events.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossFeatureAnalytics;
