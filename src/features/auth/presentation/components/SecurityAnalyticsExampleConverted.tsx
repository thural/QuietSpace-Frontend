import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import React from 'react';
import { SecurityMonitor } from './SecurityMonitor';

// Import reusable components from shared UI

/**
 * Demo User interface
 */
export interface IDemoUser {
  id: string;
  name: string;
  role: string;
}

/**
 * Refresh Interval Option interface
 */
export interface IRefreshIntervalOption {
  label: string;
  value: number;
}

/**
 * Security Analytics Example Props
 */
export interface ISecurityAnalyticsExampleProps extends IBaseComponentProps {
  initialUserId?: string;
  initialRefreshInterval?: number;
  showAdvancedFeatures?: boolean;
}

/**
 * Security Analytics Example State
 */
export interface ISecurityAnalyticsExampleState extends IBaseComponentState {
  selectedUserId: string;
  refreshInterval: number;
  showAdvancedFeatures: boolean;
  isMonitoring: boolean;
  lastRefresh: Date | null;
  securityScore: number;
  threatCount: number;
}

/**
 * Comprehensive Security Analytics Dashboard Example Component
 * 
 * This example demonstrates all the features of the enhanced SecurityMonitor component,
 * including real-time monitoring, threat detection, IP management, and security actions.
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class SecurityAnalyticsExample extends BaseClassComponent<ISecurityAnalyticsExampleProps, ISecurityAnalyticsExampleState> {
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<ISecurityAnalyticsExampleState> {
    const {
      initialUserId = 'demo-user-123',
      initialRefreshInterval = 30000,
      showAdvancedFeatures = true
    } = this.props;

    return {
      selectedUserId: initialUserId,
      refreshInterval: initialRefreshInterval,
      showAdvancedFeatures,
      isMonitoring: false,
      lastRefresh: null,
      securityScore: 85,
      threatCount: 0
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.startMonitoring();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopMonitoring();
  }

  /**
   * Start security monitoring
   */
  private startMonitoring(): void {
    this.safeSetState({ isMonitoring: true });
    this.startRefreshTimer();
    console.log('🔒 Security monitoring started');
  }

  /**
   * Stop security monitoring
   */
  private stopMonitoring(): void {
    this.safeSetState({ isMonitoring: false });
    this.stopRefreshTimer();
    console.log('🔒 Security monitoring stopped');
  }

  /**
   * Start refresh timer
   */
  private startRefreshTimer(): void {
    this.refreshTimer = window.setInterval(() => {
      this.refreshSecurityData();
    }, this.state.refreshInterval);
  }

  /**
   * Stop refresh timer
   */
  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Refresh security data
   */
  private refreshSecurityData(): void {
    // Simulate data refresh
    this.safeSetState({
      lastRefresh: new Date(),
      securityScore: Math.max(60, Math.min(100, this.state.securityScore + (Math.random() - 0.5) * 10)),
      threatCount: Math.max(0, this.state.threatCount + Math.floor((Math.random() - 0.8) * 3))
    });
  }

  /**
   * Handle user selection change
   */
  private handleUserChange = (userId: string): void => {
    this.safeSetState({ selectedUserId: userId });
    this.refreshSecurityData();
  };

  /**
   * Handle refresh interval change
   */
  private handleRefreshIntervalChange = (interval: number): void => {
    this.safeSetState({ refreshInterval: interval });

    // Restart timer with new interval
    this.stopRefreshTimer();
    if (this.state.isMonitoring) {
      this.startRefreshTimer();
    }
  };

  /**
   * Toggle advanced features
   */
  private toggleAdvancedFeatures = (): void => {
    this.safeSetState(prev => ({
      showAdvancedFeatures: !prev.showAdvancedFeatures
    }));
  };

  /**
   * Toggle monitoring
   */
  private toggleMonitoring = (): void => {
    if (this.state.isMonitoring) {
      this.stopMonitoring();
    } else {
      this.startMonitoring();
    }
  };

  /**
   * Get demo users
   */
  private getDemoUsers(): IDemoUser[] {
    return [
      { id: 'demo-user-123', name: 'John Doe', role: 'Admin' },
      { id: 'demo-user-456', name: 'Jane Smith', role: 'User' },
      { id: 'demo-user-789', name: 'Bob Johnson', role: 'Moderator' },
      { id: 'system-admin', name: 'System Admin', role: 'Super Admin' }
    ];
  }

  /**
   * Get refresh interval options
   */
  private getRefreshIntervalOptions(): IRefreshIntervalOption[] {
    return [
      { label: '10 seconds', value: 10000 },
      { label: '30 seconds', value: 30000 },
      { label: '1 minute', value: 60000 },
      { label: '5 minutes', value: 300000 }
    ];
  }

  /**
   * Render control panel
   */
  private renderControlPanel(): React.ReactNode {
    const { selectedUserId, refreshInterval, showAdvancedFeatures, isMonitoring, lastRefresh, securityScore, threatCount } = this.state;

    const demoUsers = this.getDemoUsers();
    const intervalOptions = this.getRefreshIntervalOptions();

    return (
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: '0 0 15px 0',
          color: '#2c3e50',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Security Analytics Controls
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* User Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>
              Monitor User:
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => this.handleUserChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {demoUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Interval */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>
              Refresh Interval:
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => this.handleRefreshIntervalChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {intervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <button
              onClick={this.toggleMonitoring}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: isMonitoring ? '#e74c3c' : '#27ae60',
                color: 'white'
              }}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>

            <button
              onClick={this.toggleAdvancedFeatures}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: showAdvancedFeatures ? '#3498db' : '#ecf0f1',
                color: showAdvancedFeatures ? 'white' : '#333'
              }}
            >
              {showAdvancedFeatures ? 'Hide' : 'Show'} Advanced
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Status</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isMonitoring ? '#27ae60' : '#e74c3c'
              }} />
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Security Score</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
              {securityScore}/100
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Threats Detected</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: threatCount > 0 ? '#e74c3c' : '#27ae60' }}>
              {threatCount}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Last Refresh</div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { selectedUserId, showAdvancedFeatures } = this.state;

    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        padding: '20px',
        background: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            color: '#2c3e50',
            fontSize: '32px',
            fontWeight: '600'
          }}>
            🔒 Security Analytics Dashboard
          </h1>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '16px'
          }}>
            Real-time security monitoring, threat detection, and analytics for enterprise applications
          </p>
        </div>

        {/* Control Panel */}
        {this.renderControlPanel()}

        {/* Security Monitor Component */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <SecurityMonitor
            userId={selectedUserId}
            refreshInterval={this.state.refreshInterval}
            showAdvancedFeatures={showAdvancedFeatures}
            onThreatDetected={(threat) => {
              console.log('🚨 Threat detected:', threat);
              this.safeSetState(prev => ({
                threatCount: prev.threatCount + 1,
                securityScore: Math.max(0, prev.securityScore - 5)
              }));
            }}
            onSecurityScoreChange={(score) => {
              this.safeSetState({ securityScore: score });
            }}
          />
        </div>

        {/* Footer Information */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'center'
        }}>
          <div>
            <strong>Security Analytics Example</strong> - Monitoring user: <strong>{selectedUserId}</strong>
          </div>
          <div style={{ marginTop: '5px', fontSize: '12px' }}>
            This dashboard demonstrates real-time security monitoring capabilities including threat detection,
            IP tracking, and security analytics.
          </div>
        </div>
      </div>
    );
  }
}

export default SecurityAnalyticsExample;
