import * as React from 'react';
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { styles } from './ErrorTracker.styles.ts';

interface ErrorTrackerProps {
  userId: string;
  className?: string;
}

interface ErrorEvent {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  feature: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  recoveryAction?: string;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  warnings: number;
  resolvedErrors: number;
  avgResolutionTime: number;
  errorRate: number;
  topFeatures: Array<{ feature: string; count: number }>;
  errorTrend: Array<{ date: Date; count: number }>;
}

export const ErrorTracker: React.FC<ErrorTrackerProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { metrics, trackEvent } = useAnalyticsDI(userId);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedLevel, setSelectedLevel] = React.useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [isTracking, setIsTracking] = React.useState(true);

  // Sample error data
  const [errorEvents, setErrorEvents] = React.useState<ErrorEvent[]>([
    {
      id: 'error-001',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      level: 'error',
      message: 'Failed to load analytics dashboard data',
      stack: 'TypeError: Cannot read property "data" of undefined',
      feature: 'Analytics',
      userId: 'user-123',
      sessionId: 'session-456',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      url: '/analytics/dashboard',
      resolved: false
    },
    {
      id: 'error-002',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      level: 'warning',
      message: 'High memory usage detected in content editor',
      feature: 'Content Management',
      userId: 'user-789',
      sessionId: 'session-123',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      url: '/content/editor',
      resolved: true,
      resolvedAt: new Date(Date.now() - 10 * 60 * 1000),
      resolvedBy: 'system',
      recoveryAction: 'Automatic memory cleanup'
    },
    {
      id: 'error-003',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      level: 'error',
      message: 'Database connection timeout',
      feature: 'Search',
      userId: 'user-456',
      sessionId: 'session-789',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      url: '/search/results',
      resolved: true,
      resolvedAt: new Date(Date.now() - 25 * 60 * 1000),
      resolvedBy: 'auto-recovery',
      recoveryAction: 'Connection retry with exponential backoff'
    },
    {
      id: 'error-004',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      level: 'info',
      message: 'User session expired, redirecting to login',
      feature: 'Authentication',
      userId: 'user-234',
      sessionId: 'session-567',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      url: '/profile/settings',
      resolved: true,
      resolvedAt: new Date(Date.now() - 44 * 60 * 1000),
      resolvedBy: 'system',
      recoveryAction: 'Automatic session refresh'
    }
  ]);

  const [errorStats, setErrorStats] = React.useState<ErrorStats>({
    totalErrors: 127,
    criticalErrors: 23,
    warnings: 89,
    resolvedErrors: 98,
    avgResolutionTime: 12.5,
    errorRate: 0.8,
    topFeatures: [
      { feature: 'Analytics', count: 34 },
      { feature: 'Content Management', count: 28 },
      { feature: 'Search', count: 22 },
      { feature: 'Notifications', count: 18 },
      { feature: 'Profile', count: 15 }
    ],
    errorTrend: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      count: Math.floor(15 + Math.random() * 10)
    }))
  });

  const [recoveryStrategies, setRecoveryStrategies] = React.useState([
    {
      name: 'Auto-Retry',
      description: 'Automatically retry failed requests with exponential backoff',
      enabled: true,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    {
      name: 'Fallback Service',
      description: 'Switch to backup service when primary fails',
      enabled: true,
      timeoutThreshold: 5000,
      fallbackUrl: 'https://backup-api.example.com'
    },
    {
      name: 'Cache Recovery',
      description: 'Serve cached data when service is unavailable',
      enabled: true,
      maxCacheAge: 3600,
      staleWhileRevalidate: true
    },
    {
      name: 'Graceful Degradation',
      description: 'Reduce functionality to maintain core operations',
      enabled: true,
      criticalFeatures: ['authentication', 'core-data'],
      disabledFeatures: ['analytics', 'reports']
    }
  ]);

  // Simulate real-time updates
  React.useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simulate new error occasionally
      if (Math.random() < 0.1) {
        const newError: ErrorEvent = {
          id: `error-${Date.now()}`,
          timestamp: new Date(),
          level: Math.random() < 0.7 ? 'error' : Math.random() < 0.5 ? 'warning' : 'info',
          message: 'Simulated error for testing',
          feature: ['Analytics', 'Content Management', 'Search', 'Notifications'][Math.floor(Math.random() * 4)],
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          sessionId: `session-${Date.now()}`,
          userAgent: navigator.userAgent,
          url: window.location.pathname,
          resolved: false
        };
        
        setErrorEvents(prev => [newError, ...prev.slice(0, 49)]);
        setErrorStats(prev => ({
          ...prev,
          totalErrors: prev.totalErrors + 1,
          errorRate: prev.errorRate + 0.01
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const handleResolveError = (errorId: string, recoveryAction: string) => {
    setErrorEvents(prev => prev.map(error => 
      error.id === errorId 
        ? { 
            ...error, 
            resolved: true, 
            resolvedAt: new Date(),
            resolvedBy: 'manual',
            recoveryAction 
          }
        : error
    ));
  };

  const handleUpdateStrategy = (index: number, updates: any) => {
    setRecoveryStrategies(prev => prev.map((strategy, i) => 
      i === index ? { ...strategy, ...updates } : strategy
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const filteredErrors = errorEvents.filter(error => 
    selectedLevel === 'all' || error.level === selectedLevel
  );

  return (
    <div className={`error-tracker ${className}`} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Error Tracking & Recovery</h2>
          <span style={styles.subtitle}>
            Comprehensive error monitoring and automatic recovery
          </span>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isTracking ? styles.toggleButtonActive : {})
            }}
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? '🔴 Tracking' : '⚫ Paused'}
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

        <div style={styles.controlGroup}>
          <label style={styles.label}>Error Level:</label>
          <div style={styles.buttonGroup}>
            {(['all', 'error', 'warning', 'info'] as const).map(level => (
              <button
                key={level}
                style={{
                  ...styles.levelButton,
                  ...(selectedLevel === level ? styles.levelButtonActive : {})
                }}
                onClick={() => setSelectedLevel(level)}
              >
                {level === 'all' && '📊 All'}
                {level === 'error' && '🚨 Errors'}
                {level === 'warning' && '⚠️ Warnings'}
                {level === 'info' && 'ℹ️ Info'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Statistics */}
      <div style={styles.statsSection}>
        <h3 style={styles.sectionTitle}>Error Statistics</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Total Errors</span>
              <span style={styles.statIcon}>📊</span>
            </div>
            <div style={styles.statValue}>{errorStats.totalErrors}</div>
            <div style={styles.statDescription}>All error events</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Critical Errors</span>
              <span style={styles.statIcon}>🚨</span>
            </div>
            <div style={styles.statValue}>{errorStats.criticalErrors}</div>
            <div style={styles.statDescription}>High severity issues</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Resolved</span>
              <span style={styles.statIcon}>✅</span>
            </div>
            <div style={styles.statValue}>{errorStats.resolvedErrors}</div>
            <div style={styles.statDescription}>Fixed issues</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Error Rate</span>
              <span style={styles.statIcon}>📈</span>
            </div>
            <div style={styles.statValue}>{errorStats.errorRate.toFixed(2)}%</div>
            <div style={styles.statDescription}>Errors per session</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Avg Resolution</span>
              <span style={styles.statIcon}>⏱️</span>
            </div>
            <div style={styles.statValue}>{errorStats.avgResolutionTime.toFixed(1)}m</div>
            <div style={styles.statDescription}>Time to resolve</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Resolution Rate</span>
              <span style={styles.statIcon}>🎯</span>
            </div>
            <div style={styles.statValue}>
              {((errorStats.resolvedErrors / errorStats.totalErrors) * 100).toFixed(1)}%
            </div>
            <div style={styles.statDescription}>Successfully resolved</div>
          </div>
        </div>
      </div>

      {/* Error Trend Chart */}
      <div style={styles.trendSection}>
        <h3 style={styles.sectionTitle}>Error Trend</h3>
        <div style={styles.trendChart}>
          <div style={styles.trendBars}>
            {errorStats.errorTrend.map((point, index) => (
              <div key={index} style={styles.trendBar}>
                <div style={{
                  ...styles.trendBarFill,
                  height: `${(point.count / 25) * 100}%`,
                  backgroundColor: getLevelColor(point.count > 20 ? 'error' : point.count > 15 ? 'warning' : 'info')
                }}></div>
                <div style={styles.trendLabel}>
                  {point.date.toLocaleDateString().slice(0, 5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Events List */}
      <div style={styles.eventsSection}>
        <h3 style={styles.sectionTitle}>Recent Error Events</h3>
        <div style={styles.eventsList}>
          {filteredErrors.slice(0, 10).map(error => (
            <div key={error.id} style={styles.eventCard}>
              <div style={styles.eventHeader}>
                <div style={styles.eventLevel}>
                  <span style={{ 
                    ...styles.levelBadge,
                    backgroundColor: getLevelColor(error.level)
                  }}>
                    {getLevelIcon(error.level)} {error.level.toUpperCase()}
                  </span>
                </div>
                <div style={styles.eventMeta}>
                  <div style={styles.eventTime}>
                    {error.timestamp.toLocaleString()}
                  </div>
                  <div style={styles.eventFeature}>
                    📦 {error.feature}
                  </div>
                </div>
              </div>
              
              <div style={styles.eventMessage}>
                {error.message}
              </div>
              
              <div style={styles.eventDetails}>
                <div style={styles.eventDetail}>
                  <span style={styles.detailLabel}>User:</span>
                  <span style={styles.detailValue}>{error.userId}</span>
                </div>
                <div style={styles.eventDetail}>
                  <span style={styles.detailLabel}>Session:</span>
                  <span style={styles.detailValue}>{error.sessionId}</span>
                </div>
                <div style={styles.eventDetail}>
                  <span style={styles.detailLabel}>URL:</span>
                  <span style={styles.detailValue}>{error.url}</span>
                </div>
              </div>
              
              {error.resolved ? (
                <div style={styles.eventResolution}>
                  <div style={styles.resolutionHeader}>
                    <span style={styles.resolutionIcon}>✅</span>
                    <span style={styles.resolutionText}>
                      Resolved by {error.resolvedBy}
                    </span>
                  </div>
                  {error.recoveryAction && (
                    <div style={styles.recoveryAction}>
                      Action: {error.recoveryAction}
                    </div>
                  )}
                  <div style={styles.resolutionTime}>
                    {error.resolvedAt?.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div style={styles.eventActions}>
                  <button
                    style={styles.resolveButton}
                    onClick={() => handleResolveError(error.id, 'Manual resolution')}
                  >
                    🔧 Resolve
                  </button>
                  <button
                    style={styles.investigateButton}
                    onClick={() => console.log(`Investigating error ${error.id}`)}
                  >
                    🔍 Investigate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Strategies */}
      <div style={styles.recoverySection}>
        <h3 style={styles.sectionTitle}>Recovery Strategies</h3>
        <div style={styles.strategiesGrid}>
          {recoveryStrategies.map((strategy, index) => (
            <div key={index} style={styles.strategyCard}>
              <div style={styles.strategyHeader}>
                <div style={styles.strategyName}>{strategy.name}</div>
                <div style={styles.strategyToggle}>
                  <input
                    type="checkbox"
                    checked={strategy.enabled}
                    onChange={(e) => handleUpdateStrategy(index, { enabled: e.target.checked })}
                    style={styles.toggleCheckbox}
                  />
                </div>
              </div>
              <div style={styles.strategyDescription}>
                {strategy.description}
              </div>
              <div style={styles.strategyConfig}>
                {/* Strategy-specific configuration */}
                {strategy.name === 'Auto-Retry' && (
                  <>
                    <div style={styles.configItem}>
                      <label>Max Retries:</label>
                      <input
                        type="number"
                        value={strategy.maxRetries}
                        onChange={(e) => handleUpdateStrategy(index, { maxRetries: parseInt(e.target.value) })}
                        style={styles.configInput}
                      />
                    </div>
                    <div style={styles.configItem}>
                      <label>Backoff Multiplier:</label>
                      <input
                        type="number"
                        value={strategy.backoffMultiplier}
                        onChange={(e) => handleUpdateStrategy(index, { backoffMultiplier: parseFloat(e.target.value) })}
                        style={styles.configInput}
                      />
                    </div>
                  </>
                )}
                {strategy.name === 'Fallback Service' && (
                  <>
                    <div style={styles.configItem}>
                      <label>Timeout (ms):</label>
                      <input
                        type="number"
                        value={strategy.timeoutThreshold}
                        onChange={(e) => handleUpdateStrategy(index, { timeoutThreshold: parseInt(e.target.value) })}
                        style={styles.configInput}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorTracker;
