import React, { useState } from 'react';
import MFAEnrollment from '@features/auth/presentation/components/MFAEnrollment';
import MFAVerification, { MFAManagement } from '@features/auth/presentation/components/MFAVerification';
import { useMFAAnalytics } from '@features/auth/application/hooks/useMFA';

/**
 * Comprehensive MFA Example Component
 * 
 * This example demonstrates all MFA features including:
 * - Enrollment flow for all MFA methods
 * - Verification process with multiple methods
 * - Management of existing MFA methods
 * - Analytics and security scoring
 * - Real-time status updates
 */
const MFAExample: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'enrollment' | 'verification' | 'management'>('overview');
  const [demoUserId] = useState('demo-user-123');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const {
    analytics,
    availableMethods,
    enrollments,
    getEnrollmentProgress,
    getMethodStatus
  } = useMFAAnalytics(demoUserId);

  const handleVerificationComplete = (success: boolean) => {
    setVerificationResult(success);
    setTimeout(() => {
      setVerificationResult(null);
      setCurrentView('overview');
    }, 3000);
  };

  const enrollmentProgress = getEnrollmentProgress();
  const securityScore = analytics.securityScore;

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
          🔐 Multi-Factor Authentication (MFA) - Example
        </h1>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#7f8c8d', 
          fontSize: '16px' 
        }}>
          Enterprise-grade multi-factor authentication with TOTP, SMS, biometrics, backup codes, and security keys.
        </p>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'enrollment', label: 'Enrollment', icon: '🔧' },
            { id: 'verification', label: 'Verification', icon: '✅' },
            { id: 'management', label: 'Management', icon: '⚙️' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as any)}
              style={{
                backgroundColor: currentView === view.id ? '#3b82f6' : '#f3f4f6',
                color: currentView === view.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                if (currentView !== view.id) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (currentView !== view.id) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              <span>{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Modal */}
      {verificationResult !== null && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: verificationResult ? '#10b981' : '#dc2626',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>
            {verificationResult ? '✅' : '❌'}
          </span>
          <div>
            <div style={{ fontWeight: '600' }}>
              {verificationResult ? 'Verification Successful' : 'Verification Failed'}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {verificationResult ? 'Identity verified successfully' : 'Please try again'}
            </div>
          </div>
        </div>
      )}

      {/* Overview View */}
      {currentView === 'overview' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            color: '#2c3e50', 
            fontSize: '24px',
            fontWeight: '600'
          }}>
            📊 MFA Overview & Analytics
          </h2>

          {/* Security Score Card */}
          <div style={{
            background: `linear-gradient(135deg, ${getSecurityScoreColor(securityScore)} 0%, ${getSecurityScoreColor(securityScore)}dd 100%)`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              Security Score
            </h3>
            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
              {securityScore}/100
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {getSecurityScoreLabel(securityScore)}
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '4px' }}>
                Enrollment Progress
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#0369a1' }}>
                {enrollmentProgress.toFixed(0)}%
              </div>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#166534', marginBottom: '4px' }}>
                Active Methods
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#166534' }}>
                {enrollments.filter(e => e.status === 'active').length}
              </div>
            </div>

            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '4px' }}>
                Verification Success Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#92400e' }}>
                {analytics.verificationSuccessRate.toFixed(1)}%
              </div>
            </div>

            <div style={{
              backgroundColor: '#f3e5f5',
              border: '1px solid #e1bee7',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#6a1b9a', marginBottom: '4px' }}>
                Total Methods Available
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#6a1b9a' }}>
                {availableMethods.length}
              </div>
            </div>
          </div>

          {/* Method Status */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Method Status
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {availableMethods.map((method) => {
                const status = getMethodStatus(method.type);
                return (
                  <div
                    key={method.type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: `1px solid ${getStatusColor(status)}`
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{method.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {method.description}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: getStatusColor(status),
                      color: 'white'
                    }}>
                      {getStatusLabel(status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enrollment View */}
      {currentView === 'enrollment' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <MFAEnrollment userId={demoUserId} />
        </div>
      )}

      {/* Verification View */}
      {currentView === 'verification' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <MFAVerification
            userId={demoUserId}
            onVerificationComplete={handleVerificationComplete}
          />
        </div>
      )}

      {/* Management View */}
      {currentView === 'management' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <MFAManagement userId={demoUserId} />
        </div>
      )}

      {/* Features Overview */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 16px 0', 
          color: '#2c3e50', 
          fontSize: '24px',
          fontWeight: '600'
        }}>
          🚀 MFA Features
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #bbdefb',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1565c0' }}>
              📱 TOTP Authentication
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '14px' }}>
              <li>QR code setup for easy enrollment</li>
              <li>Support for Google Authenticator, Authy, etc.</li>
              <li>Manual entry key as backup option</li>
              <li>30-second rotating codes</li>
            </ul>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#e8f5e8',
            border: '1px solid '#c3e6c3',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#155724' }}>
              💬 SMS Verification
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#155724', fontSize: '14px' }}>
              <li>International phone number support</li>
              <li>6-digit verification codes</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Resend code functionality</li>
            </ul>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fff3e0',
            border: '1px solid '#ffe0b2',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>
              🔑 Backup Codes
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#e65100', fontSize: '14px' }}>
              <li>10 one-time use backup codes</li>
              <li>Secure download and copy options</li>
              <li>Account recovery when other methods fail</li>
              <li>1-year expiration with renewal</li>
            </ul>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f3e5f5',
            border: '1px solid '#e1bee7',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#6a1b9a' }}>
              👆 Biometric Authentication
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#6a1b9a', fontSize: '14px' }}>
              <li>Fingerprint and face recognition</li>
              <li>WebAuthn API integration</li>
              <li>Device-specific enrollment</li>
              <li>Quick and secure verification</li>
            </ul>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fce4ec',
            border: '1px solid '#f8bbd9',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#880e4f' }}>
              🔐 Security Keys
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#880e4f', fontSize: '14px' }}>
              <li>FIDO2/WebAuthn support</li>
              <li>YubiKey and other hardware keys</li>
              <li>Phishing-resistant authentication</li>
              <li>Maximum security level</li>
            </ul>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#e0f2f1',
            border: '1px solid '#b2dfdb',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#00695c' }}>
              📧 Email Verification
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#00695c', fontSize: '14px' }}>
              <li>Email-based verification codes</li>
              <li>Fallback authentication method</li>
              <li>Secure code delivery</li>
              <li>Easy setup process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          margin: '0 0 16px 0', 
          color: '#2c3e50', 
          fontSize: '24px',
          fontWeight: '600'
        }}>
          💻 Usage Examples
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '16px' }}>
              Basic MFA Enrollment
            </h3>
            <pre style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px',
              overflow: 'auto',
              margin: 0
            }}>
{`import { MFAEnrollment } from '@features/auth/presentation/components';

function SecuritySettings() {
  return (
    <MFAEnrollment userId="user-123" />
  );
}`}
            </pre>
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '16px' }}>
              MFA Verification Flow
            </h3>
            <pre style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px',
              overflow: 'auto',
              margin: 0
            }}>
{`import { MFAVerification } from '@features/auth/presentation/components';

function LoginWithMFA() {
  const handleVerification = (success) => {
    if (success) {
      // Proceed with login
    }
  };

  return (
    <MFAVerification
      userId="user-123"
      onVerificationComplete={handleVerification}
    />
  );
}`}
            </pre>
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '16px' }}>
              MFA Hook Usage
            </h3>
            <pre style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px',
              overflow: 'auto',
              margin: 0
            }}>
{`import { useMFA } from '@features/auth/application/hooks';

function MyComponent() {
  const mfa = useMFA({ userId: 'user-123' });

  const handleTOTPEnroll = async () => {
    const enrollment = await mfa.enrollTOTP();
    console.log('QR Code:', enrollment.qrCode);
  };

  return (
    <button onClick={handleTOTPEnroll}>
      Set Up TOTP
    </button>
  );
}`}
            </pre>
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '16px' }}>
              MFA Analytics
            </h3>
            <pre style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px',
              overflow: 'auto',
              margin: 0
            }}>
{`import { useMFAAnalytics } from '@features/auth/application/hooks';

function SecurityDashboard() {
  const { analytics, getEnrollmentProgress } = 
    useMFAAnalytics('user-123');

  return (
    <div>
      <div>Security Score: {analytics.securityScore}</div>
      <div>Enrollment: {getEnrollmentProgress()}%</div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getSecurityScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#dc2626';
}

function getSecurityScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Security';
  if (score >= 60) return 'Good Security';
  if (score >= 40) return 'Fair Security';
  return 'Poor Security - Add More MFA Methods';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#10b981';
    case 'pending': return '#f59e0b';
    case 'disabled': return '#6b7280';
    default: return '#e5e7eb';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Active';
    case 'pending': return 'Pending';
    case 'disabled': return 'Disabled';
    case 'not-enrolled': return 'Not Enrolled';
    default: return 'Unknown';
  }
}

export default MFAExample;
