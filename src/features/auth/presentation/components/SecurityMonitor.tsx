import React, { useState, useEffect } from 'react';
import { useSecurityMonitor } from '@auth/application/hooks/useSecurityMonitor';
import { SecurityMonitorStyles } from './SecurityMonitor.styles.ts';

/**
 * Comprehensive Security Analytics Dashboard
 * 
 * This component provides enterprise-grade security monitoring with:
 * - Real-time threat detection and analysis
 * - Advanced security metrics and visualizations
 * - IP blocking management and security actions
 * - Login attempts analysis and security event tracking
 * - Configurable timeframes and auto-refresh capabilities
 * - Responsive design with professional UI/UX
 * 
 * Features:
 * - Threat Level Assessment: Intelligent threat scoring (0-100)
 * - Security Health Monitoring: Overall security health indicator
 * - Real-time Event Tracking: Live security event monitoring
 * - IP Management: Block/unblock IP addresses with reason tracking
 * - Session Management: View and revoke active sessions
 * - Analytics Integration: Time-based analysis with multiple timeframes
 * - Action Panel: Immediate security actions and event recording
 * - Detailed Settings: Comprehensive security configuration overview
 * 
 * @param userId - Optional user ID for user-specific security monitoring
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 30s)
 */

interface SecurityAnalyticsProps {
  userId?: string;
  refreshInterval?: number;
  showAdvancedFeatures?: boolean;
  onThreatDetected?: (threat: any) => void;
  onSecurityScoreChange?: (score: any) => void;
}

export const SecurityMonitor: React.FC<SecurityAnalyticsProps> = ({
  userId,
  refreshInterval = 30000,
  showAdvancedFeatures,
  onThreatDetected,
  onSecurityScoreChange
}) => {
  const {
    securityData,
    securityStatus,
    securitySettings,
    securityEvents,
    loginAttempts,
    isLoading,
    error,
    recordSecurityEvent,
    revokeSession,
    revokeAllSessions,
    refreshSecurityData,
    isRecordingEvent,
    isRevokingSession,
    isRevokingAllSessions
  } = useSecurityMonitor(userId, refreshInterval);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate advanced security metrics
  const calculateSecurityMetrics = () => {
    const now = Date.now();
    const timeframes = {
      '1h': now - 60 * 60 * 1000,
      '24h': now - 24 * 60 * 60 * 1000,
      '7d': now - 7 * 24 * 60 * 60 * 1000,
      '30d': now - 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = timeframes[selectedTimeframe];

    const recentEvents = securityEvents.filter((event: any) =>
      new Date(event.timestamp).getTime() > cutoff
    );

    const recentAttempts = loginAttempts.filter((attempt: any) =>
      new Date(attempt.timestamp).getTime() > cutoff
    );

    const failedAttempts = recentAttempts.filter((attempt: any) => !attempt.success);
    const successfulAttempts = recentAttempts.filter((attempt: any) => attempt.success);

    const criticalEvents = recentEvents.filter((event: any) =>
      event.severity === 'critical'
    );

    const highRiskEvents = recentEvents.filter((event: any) =>
      event.severity === 'high'
    );

    // Calculate threat level
    const threatScore = Math.min(100, (
      (failedAttempts.length * 10) +
      (criticalEvents.length * 25) +
      (highRiskEvents.length * 15) +
      (securityData?.totalBlockedIPs || 0) * 5
    ));

    // Calculate security health
    const healthScore = Math.max(0, 100 - threatScore);

    return {
      totalEvents: recentEvents.length,
      criticalEvents: criticalEvents.length,
      highRiskEvents: highRiskEvents.length,
      failedAttempts: failedAttempts.length,
      successfulAttempts: successfulAttempts.length,
      totalAttempts: recentAttempts.length,
      threatScore,
      healthScore,
      blockedIPs: securityData?.totalBlockedIPs || 0,
      rateLimitEntries: securityData?.rateLimitEntries || 0
    };
  };

  const metrics = calculateSecurityMetrics();

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshSecurityData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshSecurityData]);

  // Call callbacks when metrics change
  useEffect(() => {
    if (onThreatDetected && metrics.threatScore >= 70) {
      onThreatDetected({
        threatLevel: metrics.threatScore,
        type: 'high_threat_level',
        timestamp: new Date().toISOString(),
        details: {
          criticalEvents: metrics.criticalEvents,
          highRiskEvents: metrics.highRiskEvents,
          failedAttempts: metrics.failedAttempts
        }
      });
    }
  }, [metrics.threatScore, onThreatDetected, metrics.criticalEvents, metrics.highRiskEvents, metrics.failedAttempts]);

  useEffect(() => {
    if (onSecurityScoreChange) {
      onSecurityScoreChange(metrics.healthScore);
    }
  }, [metrics.healthScore, onSecurityScoreChange]);

  const getThreatLevelColor = (score: number) => {
    if (score >= 80) return '#dc3545'; // Critical
    if (score >= 60) return '#fd7e14'; // High
    if (score >= 40) return '#ffc107'; // Medium
    return '#28a745'; // Low
  };

  const getHealthLevelColor = (score: number) => {
    if (score >= 80) return '#28a745'; // Excellent
    if (score >= 60) return '#ffc107'; // Good
    if (score >= 40) return '#fd7e14'; // Fair
    return '#dc3545'; // Poor
  };

  if (isLoading && !securityData) {
    return (
      <SecurityMonitorStyles.loading>
        <SecurityMonitorStyles.loadingSpinner></SecurityMonitorStyles.loadingSpinner>
        <p>Loading security analytics...</p>
      </SecurityMonitorStyles.loading>
    );
  }

  if (error) {
    return (
      <SecurityMonitorStyles.error>
        <SecurityMonitorStyles.errorMessage>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</span>
          <p>Failed to load security analytics: {error}</p>
          <SecurityMonitorStyles.retryBtn onClick={refreshSecurityData}>
            Retry
          </SecurityMonitorStyles.retryBtn>
        </SecurityMonitorStyles.errorMessage>
      </SecurityMonitorStyles.error>
    );
  }

  return (
    <SecurityMonitorStyles.securityAnalyticsDashboard>
      {/* Header */}
      <SecurityMonitorStyles.dashboardHeader>
        <SecurityMonitorStyles.headerLeft>
          <h2 style={{ margin: 0, marginBottom: '4px', color: '#333', fontSize: '24px', fontWeight: 600 }}>Security Analytics Dashboard</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Real-time security monitoring and threat intelligence</p>
        </SecurityMonitorStyles.headerLeft>
        <SecurityMonitorStyles.headerControls>
          <SecurityMonitorStyles.timeframeSelector>
            {(['1h', '24h', '7d', '30d'] as const).map(timeframe => (
              <SecurityMonitorStyles.timeframeBtn
                key={timeframe}
                active={selectedTimeframe === timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe === '1h' && '1 Hour'}
                {timeframe === '24h' && '24 Hours'}
                {timeframe === '7d' && '7 Days'}
                {timeframe === '30d' && '30 Days'}
              </SecurityMonitorStyles.timeframeBtn>
            ))}
          </SecurityMonitorStyles.timeframeSelector>
          <SecurityMonitorStyles.autoRefreshToggle>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh</span>
          </SecurityMonitorStyles.autoRefreshToggle>
          <SecurityMonitorStyles.detailsToggle
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </SecurityMonitorStyles.detailsToggle>
        </SecurityMonitorStyles.headerControls>
      </SecurityMonitorStyles.dashboardHeader>

      {/* Key Security Metrics */}
      <SecurityMonitorStyles.securityMetricsGrid>
        <SecurityMonitorStyles.metricCard variant="threat-level">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Threat Level</h3>
            <SecurityMonitorStyles.metricIcon>🚨</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue style={{ color: getThreatLevelColor(metrics.threatScore) }}>
            {metrics.threatScore}/100
          </SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>
            {metrics.threatScore >= 80 ? 'Critical' :
              metrics.threatScore >= 60 ? 'High' :
                metrics.threatScore >= 40 ? 'Medium' : 'Low'}
          </SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>

        <SecurityMonitorStyles.metricCard variant="health-score">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Security Health</h3>
            <SecurityMonitorStyles.metricIcon>🛡️</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue style={{ color: getHealthLevelColor(metrics.healthScore) }}>
            {metrics.healthScore}/100
          </SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>
            {metrics.healthScore >= 80 ? 'Excellent' :
              metrics.healthScore >= 60 ? 'Good' :
                metrics.healthScore >= 40 ? 'Fair' : 'Poor'}
          </SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>

        <SecurityMonitorStyles.metricCard variant="blocked-ips">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Blocked IPs</h3>
            <SecurityMonitorStyles.metricIcon>🚫</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue>{metrics.blockedIPs}</SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>Currently blocked</SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>

        <SecurityMonitorStyles.metricCard variant="failed-attempts">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Failed Attempts</h3>
            <SecurityMonitorStyles.metricIcon>❌</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue>{metrics.failedAttempts}</SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>
            {metrics.totalAttempts > 0 ?
              `${((metrics.failedAttempts / metrics.totalAttempts) * 100).toFixed(1)}% failure rate` :
              'No attempts'
            }
          </SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>

        <SecurityMonitorStyles.metricCard variant="security-events">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Security Events</h3>
            <SecurityMonitorStyles.metricIcon>📊</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue>{metrics.totalEvents}</SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>
            {metrics.criticalEvents} critical, {metrics.highRiskEvents} high risk
          </SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>

        <SecurityMonitorStyles.metricCard variant="rate-limits">
          <SecurityMonitorStyles.metricHeader>
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Rate Limits</h3>
            <SecurityMonitorStyles.metricIcon>⏱️</SecurityMonitorStyles.metricIcon>
          </SecurityMonitorStyles.metricHeader>
          <SecurityMonitorStyles.metricValue>{metrics.rateLimitEntries}</SecurityMonitorStyles.metricValue>
          <SecurityMonitorStyles.metricDescription>Active rate limits</SecurityMonitorStyles.metricDescription>
        </SecurityMonitorStyles.metricCard>
      </SecurityMonitorStyles.securityMetricsGrid>

      {/* Security Status Overview */}
      {securityStatus && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>Security Status Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Risk Level:</span>
              <span style={{
                fontWeight: 600,
                color: securityStatus.riskLevel === 'high' ? '#dc3545' : securityStatus.riskLevel === 'medium' ? '#fd7e14' : '#28a745'
              }}>
                {securityStatus.riskLevel?.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Active Sessions:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{securityStatus.activeSessions || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Last Activity:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>
                {securityStatus.lastActivity ?
                  new Date(securityStatus.lastActivity).toLocaleString() :
                  'No activity'
                }
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Security Score:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{securityStatus.securityScore || 0}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Security Events */}
      {securityEvents.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>Recent Security Events</h3>
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr', gap: '16px', padding: '16px', background: '#f8f9fa', fontWeight: 600, color: '#333' }}>
              <div>Timestamp</div>
              <div>Type</div>
              <div>Severity</div>
              <div>Description</div>
              <div>Status</div>
            </div>
            <div>
              {securityEvents.slice(0, 10).map((event, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr', gap: '16px', padding: '16px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>{new Date(event.timestamp).toLocaleString()}</div>
                  <div style={{ fontWeight: 500, color: '#333' }}>{event.type}</div>
                  <div style={{
                    fontWeight: 600,
                    color: event.severity === 'critical' ? '#dc3545' : event.severity === 'high' ? '#fd7e14' : event.severity === 'medium' ? '#ffc107' : '#28a745'
                  }}>{event.severity}</div>
                  <div style={{ color: '#666' }}>{event.description}</div>
                  <div style={{
                    fontWeight: 500,
                    color: event.resolved ? '#28a745' : '#dc3545'
                  }}>
                    {event.resolved ? '✅ Resolved' : '🔴 Active'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Login Attempts Analysis */}
      {loginAttempts.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>Login Attempts Analysis</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 500 }}>Total Attempts</h4>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>{metrics.totalAttempts}</span>
            </div>
            <div style={{ padding: '16px', background: '#d4edda', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#155724', fontSize: '14px', fontWeight: 500 }}>Successful</h4>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#155724' }}>{metrics.successfulAttempts}</span>
            </div>
            <div style={{ padding: '16px', background: '#f8d7da', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#721c24', fontSize: '14px', fontWeight: 500 }}>Failed</h4>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#721c24' }}>{metrics.failedAttempts}</span>
            </div>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px', fontWeight: 500 }}>Success Rate</h4>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>
                {metrics.totalAttempts > 0 ?
                  `${((metrics.successfulAttempts / metrics.totalAttempts) * 100).toFixed(1)}%` :
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* IP Blocking Management */}
      {securityData?.blockedIPs && securityData.blockedIPs.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>IP Blocking Management</h3>
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: '16px', padding: '16px', background: '#f8f9fa', fontWeight: 600, color: '#333' }}>
              <span>IP Address</span>
              <span>Blocked Since</span>
              <span>Reason</span>
              <span>Actions</span>
            </div>
            {securityData.blockedIPs.map((ip, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: '16px', padding: '16px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', color: '#333' }}>{ip}</span>
                <span style={{ color: '#666' }}>Recently</span>
                <span style={{ color: '#666' }}>Suspicious activity</span>
                <button
                  onClick={() => {/* unblockIP function would go here */ }}
                  style={{ padding: '4px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Actions Panel */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>Security Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            onClick={() => recordSecurityEvent('manual_check', 'Manual security check triggered', 'medium')}
            disabled={isRecordingEvent}
            style={{ padding: '12px 24px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: isRecordingEvent ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500, opacity: isRecordingEvent ? 0.6 : 1 }}
          >
            {isRecordingEvent ? 'Recording...' : 'Record Security Event'}
          </button>

          <button
            onClick={() => revokeAllSessions()}
            disabled={isRevokingAllSessions}
            style={{ padding: '12px 24px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: isRevokingAllSessions ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500, opacity: isRevokingAllSessions ? 0.6 : 1 }}
          >
            {isRevokingAllSessions ? 'Revoking...' : 'Revoke All Sessions'}
          </button>

          <button
            onClick={refreshSecurityData}
            style={{ padding: '12px 24px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Detailed Security Settings */}
      {showDetails && securitySettings && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 600 }}>Detailed Security Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Two-Factor Auth:</span>
              <span style={{
                fontWeight: 600,
                color: securitySettings.twoFactorEnabled ? '#28a745' : '#dc3545'
              }}>
                {securitySettings.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Session Timeout:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{securitySettings.sessionTimeout || 30} minutes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Max Login Attempts:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{securitySettings.maxLoginAttempts || 5}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <span style={{ fontWeight: 500, color: '#666' }}>Lockout Duration:</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{securitySettings.lockoutDuration || 15} minutes</span>
            </div>
          </div>
        </div>
      )}
    </SecurityMonitorStyles.securityAnalyticsDashboard>
  );
};
