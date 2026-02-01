import React from 'react';
import MFAEnrollment from '@features/auth/presentation/components/MFAEnrollment';
import MFAVerification, { MFAManagement } from '@features/auth/presentation/components/MFAVerification';
import { useMFAAnalytics } from '@features/auth/application/hooks/useMFA';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * MFA Example Props
 */
export interface IMFAExampleProps extends IBaseComponentProps {
  demoUserId?: string;
  initialView?: 'overview' | 'enrollment' | 'verification' | 'management';
}

/**
 * MFA Example State
 */
export interface IMFAExampleState extends IBaseComponentState {
  currentView: 'overview' | 'enrollment' | 'verification' | 'management';
  verificationResult: boolean | null;
  demoUserId: string;
}

/**
 * Comprehensive MFA Example Component
 * 
 * This example demonstrates all MFA features including:
 * - Enrollment flow for all MFA methods
 * - Verification process with multiple methods
 * - Management of existing MFA methods
 * - Analytics and security scoring
 * - Real-time status updates
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class MFAExample extends BaseClassComponent<IMFAExampleProps, IMFAExampleState> {
  private verificationTimer: number | null = null;

  protected override getInitialState(): Partial<IMFAExampleState> {
    const { demoUserId = 'demo-user-123', initialView = 'overview' } = this.props;
    
    return {
      currentView: initialView,
      verificationResult: null,
      demoUserId
    };
  }

  protected override onMount(): void {
    super.onMount();
    // Initialize any MFA-related setup
    this.initializeMFA();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    // Clear any timers
    this.clearVerificationTimer();
  }

  /**
   * Initialize MFA system
   */
  private initializeMFA(): void {
    // Any initialization logic for MFA system
    console.log('MFA Example initialized for user:', this.state.demoUserId);
  }

  /**
   * Clear verification timer
   */
  private clearVerificationTimer(): void {
    if (this.verificationTimer) {
      clearTimeout(this.verificationTimer);
      this.verificationTimer = null;
    }
  }

  /**
   * Handle verification complete
   */
  private handleVerificationComplete = (success: boolean): void => {
    this.safeSetState({ verificationResult: success });

    // Auto-reset after 3 seconds
    this.verificationTimer = window.setTimeout(() => {
      this.safeSetState({ 
        verificationResult: null,
        currentView: 'overview'
      });
    }, 3000);
  };

  /**
   * Navigate to different views
   */
  private navigateToView = (view: 'overview' | 'enrollment' | 'verification' | 'management'): void => {
    this.safeSetState({ currentView: view });
  };

  /**
   * Render overview section
   */
  private renderOverview(): React.ReactNode {
    const { demoUserId } = this.state;
    
    // Use the MFA analytics hook (converted to class pattern)
    const mfaAnalytics = this.useMFAAnalyticsClass(demoUserId);
    const { analytics, availableMethods, enrollments, getEnrollmentProgress, getMethodStatus } = mfaAnalytics;
    
    const enrollmentProgress = getEnrollmentProgress();
    const securityScore = analytics.securityScore;

    return (
      <div style={{ padding: '20px' }}>
        <h2>MFA Overview</h2>
        
        {/* Security Score */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `2px solid ${securityScore >= 80 ? '#4CAF50' : securityScore >= 60 ? '#FF9800' : '#F44336'}`
        }}>
          <h3>Security Score: {securityScore}/100</h3>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: `${securityScore}%`,
              height: '100%',
              backgroundColor: securityScore >= 80 ? '#4CAF50' : securityScore >= 60 ? '#FF9800' : '#F44336',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Enrollment Progress */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Enrollment Progress: {enrollmentProgress}%</h3>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: `${enrollmentProgress}%`,
              height: '100%',
              backgroundColor: '#2196F3',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Available Methods */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Available Methods</h3>
          {availableMethods.map(method => (
            <div key={method.type} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <span>{method.name}</span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: getMethodStatus(method.type) === 'enabled' ? '#4CAF50' : '#ccc',
                color: 'white'
              }}>
                {getMethodStatus(method.type)}
              </span>
            </div>
          ))}
        </div>

        {/* Active Enrollments */}
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Active Enrollments</h3>
          {enrollments.length === 0 ? (
            <p>No MFA methods enrolled yet</p>
          ) : (
            enrollments.map(enrollment => (
              <div key={enrollment.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #eee'
              }}>
                <span>{enrollment.method}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white'
                }}>
                  Active
                </span>
              </div>
            ))
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => this.navigateToView('enrollment')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Start Enrollment
          </button>
          <button
            onClick={() => this.navigateToView('verification')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Verification
          </button>
          <button
            onClick={() => this.navigateToView('management')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Manage MFA
          </button>
        </div>
      </div>
    );
  }

  /**
   * Class-based version of useMFAAnalytics hook
   */
  private useMFAAnalyticsClass(userId: string) {
    // This would typically integrate with the actual hook
    // For now, providing mock data that matches the hook interface
    return {
      analytics: {
        securityScore: 75,
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        lastUsed: null,
        averageVerificationTime: 0
      },
      availableMethods: [
        { type: 'totp', name: 'Authenticator App', enabled: true },
        { type: 'sms', name: 'SMS', enabled: true },
        { type: 'email', name: 'Email', enabled: true },
        { type: 'backup', name: 'Backup Codes', enabled: false }
      ],
      enrollments: [
        { id: '1', method: 'TOTP', createdAt: new Date(), lastUsed: null }
      ],
      getEnrollmentProgress: () => 25,
      getMethodStatus: (method: string) => 'enabled' as const,
      refresh: () => {}
    };
  }

  protected override renderContent(): React.ReactNode {
    const { currentView, verificationResult } = this.state;

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
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>Multi-Factor Authentication Example</h1>
          <p style={{ margin: '10px 0 0 0', color: '#666' }}>
            Comprehensive MFA demonstration with enrollment, verification, and management
          </p>
        </div>

        {/* Verification Result Notification */}
        {verificationResult !== null && (
          <div style={{
            background: verificationResult ? '#4CAF50' : '#F44336',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {verificationResult ? '✅ Verification Successful!' : '❌ Verification Failed!'}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          padding: '0',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {(['overview', 'enrollment', 'verification', 'management'] as const).map(view => (
            <button
              key={view}
              onClick={() => this.navigateToView(view)}
              style={{
                flex: 1,
                padding: '15px',
                border: 'none',
                background: currentView === view ? '#2196F3' : 'transparent',
                color: currentView === view ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: currentView === view ? '8px 8px 0 0' : '0',
                textTransform: 'capitalize',
                fontWeight: currentView === view ? 'bold' : 'normal'
              }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {currentView === 'overview' && this.renderOverview()}
          
          {currentView === 'enrollment' && (
            <div>
              <h2>MFA Enrollment</h2>
              <MFAEnrollment userId={this.state.demoUserId} />
            </div>
          )}
          
          {currentView === 'verification' && (
            <div>
              <h2>MFA Verification</h2>
              <MFAVerification 
                userId={this.state.demoUserId}
                onVerificationComplete={this.handleVerificationComplete}
              />
            </div>
          )}
          
          {currentView === 'management' && (
            <div>
              <h2>MFA Management</h2>
              <MFAManagement userId={this.state.demoUserId} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MFAExample;
