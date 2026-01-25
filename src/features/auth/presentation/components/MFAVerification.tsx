import React, { useState } from 'react';
import { useMFA, useMFAVerification, MFAMethod } from '@features/auth/application/hooks/useMFA';

/**
 * MFA Verification Component
 * 
 * Provides a complete MFA verification flow with:
 * - Method selection for verification
 * - TOTP code verification
 * - SMS code verification
 * - Backup code verification
 * - Biometric authentication
 * - Security key verification
 */
export const MFAVerification: React.FC<{
  userId: string;
  onVerificationComplete: (success: boolean) => void;
  requiredMethods?: string[];
}> = ({ userId, onVerificationComplete, requiredMethods }) => {
  const {
    availableMethods,
    currentChallenge,
    createChallenge,
    verifyChallenge,
    isLoading,
    error
  } = useMFAVerification(userId);

  const {
    currentMethod,
    isVerifying,
    verificationAttempts,
    startVerification,
    completeVerification,
    attemptVerification
  } = useMFAVerification(userId);

  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');

  // Initialize challenge on mount
  React.useEffect(() => {
    const initChallenge = async () => {
      try {
        await createChallenge(requiredMethods);
      } catch (err) {
        console.error('Failed to create challenge:', err);
      }
    };

    if (userId) {
      initChallenge();
    }
  }, [userId, requiredMethods, createChallenge]);

  // Handle verification attempt
  const handleVerification = async (code: string) => {
    if (!currentChallenge || !currentMethod) return;

    try {
      const success = await attemptVerification(code);
      
      if (success) {
        onVerificationComplete(true);
      } else if (verificationAttempts >= 2) {
        onVerificationComplete(false);
      }
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
        <p>Preparing verification...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#dc2626', margin: 0 }}>❌ {error}</p>
      </div>
    );
  }

  // Method Selection
  if (!currentMethod && availableMethods.length > 0) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          🔐 Verify Your Identity
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Choose a method to verify your identity:
        </p>

        <div style={{ display: 'grid', gap: '12px' }}>
          {availableMethods.map((method) => (
            <button
              key={method.type}
              onClick={() => startVerification(method)}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: 'white',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '32px' }}>{method.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                    {method.name}
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    {method.description}
                  </p>
                </div>
                <div style={{ fontSize: '20px', color: '#6b7280' }}>
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Verification Interface
  if (currentMethod) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={completeVerification}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            Verify with {currentMethod.name}
          </h2>
        </div>

        {currentMethod.type === 'totp' && (
          <TOTPVerification
            code={verificationCode}
            onCodeChange={setVerificationCode}
            onVerify={() => handleVerification(verificationCode)}
            attempts={verificationAttempts}
          />
        )}

        {currentMethod.type === 'sms' && (
          <SMSVerification
            code={verificationCode}
            onCodeChange={setVerificationCode}
            onVerify={() => handleVerification(verificationCode)}
            attempts={verificationAttempts}
          />
        )}

        {currentMethod.type === 'backup-codes' && (
          <BackupCodeVerification
            code={backupCode}
            onCodeChange={setBackupCode}
            onVerify={() => handleVerification(backupCode)}
            attempts={verificationAttempts}
          />
        )}

        {currentMethod.type === 'biometric' && (
          <BiometricVerification
            onVerify={() => handleVerification('biometric')}
            attempts={verificationAttempts}
          />
        )}

        {currentMethod.type === 'security-key' && (
          <SecurityKeyVerification
            onVerify={() => handleVerification('security-key')}
            attempts={verificationAttempts}
          />
        )}

        {currentMethod.type === 'email' && (
          <EmailVerification
            code={verificationCode}
            onCodeChange={setVerificationCode}
            onVerify={() => handleVerification(verificationCode)}
            attempts={verificationAttempts}
          />
        )}
      </div>
    );
  }

  return null;
};

/**
 * TOTP Verification Component
 */
const TOTPVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  attempts: number;
}> = ({ code, onCodeChange, onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter the 6-digit code from your authenticator app:
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          maxLength={6}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '24px',
            textAlign: 'center',
            letterSpacing: '8px',
            fontFamily: 'monospace',
            fontWeight: '600'
          }}
        />
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isVerifying || code.length !== 6}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (isVerifying || code.length !== 6) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );
};

/**
 * SMS Verification Component
 */
const SMSVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  attempts: number;
}> = ({ code, onCodeChange, onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setResendTimer(60);
    
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter the 6-digit code sent to your phone:
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          maxLength={6}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '24px',
            textAlign: 'center',
            letterSpacing: '8px',
            fontFamily: 'monospace',
            fontWeight: '600'
          }}
        />
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isVerifying || code.length !== 6}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: (isVerifying || code.length !== 6) ? 'not-allowed' : 'pointer',
            flex: 1
          }}
        >
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          style={{
            backgroundColor: canResend ? '#6b7280' : '#e5e7eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: canResend ? 'pointer' : 'not-allowed'
          }}
        >
          {canResend ? 'Resend' : `${resendTimer}s`}
        </button>
      </div>
    </form>
  );
};

/**
 * Backup Code Verification Component
 */
const BackupCodeVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  attempts: number;
}> = ({ code, onCodeChange, onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) return;

    setIsVerifying(true);
    try {
      await onVerify();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
            ⚠️ Use Backup Code
          </h4>
          <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
            Backup codes can only be used once. Each code is 8 characters long.
          </p>
        </div>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
          placeholder="XXXXXXXX"
          maxLength={8}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '20px',
            textAlign: 'center',
            letterSpacing: '4px',
            fontFamily: 'monospace',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}
        />
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isVerifying || code.length !== 8}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (isVerifying || code.length !== 8) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Use Backup Code'}
      </button>
    </form>
  );
};

/**
 * Biometric Verification Component
 */
const BiometricVerification: React.FC<{
  onVerify: () => void;
  attempts: number;
}> = ({ onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // In a real implementation, this would use WebAuthn API
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onVerify();
    } catch (err) {
      console.error('Biometric verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#0369a1' }}>
            Biometric Authentication
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#0369a1', fontSize: '14px' }}>
            Place your finger on the sensor or look at your camera
          </p>
          
          {isVerifying && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#0369a1',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ color: '#0369a1', fontSize: '14px' }}>
                Verifying biometric...
              </span>
            </div>
          )}
        </div>
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: isVerifying ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Start Biometric Scan'}
      </button>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

/**
 * Security Key Verification Component
 */
const SecurityKeyVerification: React.FC<{
  onVerify: () => void;
  attempts: number;
}> = ({ onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // In a real implementation, this would use WebAuthn API
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onVerify();
    } catch (err) {
      console.error('Security key verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#166534' }}>
            Security Key Authentication
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#166534', fontSize: '14px' }}>
            Insert your security key and touch it when prompted
          </p>
          
          {isVerifying && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#166534',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ color: '#166534', fontSize: '14px' }}>
                Waiting for security key...
              </span>
            </div>
          )}
        </div>
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: isVerifying ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Waiting for Key...' : 'Use Security Key'}
      </button>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

/**
 * Email Verification Component
 */
const EmailVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  attempts: number;
}> = ({ code, onCodeChange, onVerify, attempts }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter the 6-digit code sent to your email:
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          maxLength={6}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '24px',
            textAlign: 'center',
            letterSpacing: '8px',
            fontFamily: 'monospace',
            fontWeight: '600'
          }}
        />
        
        {attempts > 0 && (
          <p style={{ color: '#f59e0b', fontSize: '14px', marginTop: '8px' }}>
            ⚠️ Attempts remaining: {3 - attempts}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isVerifying || code.length !== 6}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (isVerifying || code.length !== 6) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );
};

/**
 * MFA Management Component
 * 
 * Displays and manages existing MFA enrollments
 */
export const MFAManagement: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    enrollments,
    availableMethods,
    disableMFA,
    refreshMethods,
    isLoading,
    error,
    getMethodStatus
  } = useMFA({ userId });

  const [showDisableConfirm, setShowDisableConfirm] = useState<string | null>(null);

  const handleDisableMFA = async (enrollmentId: string) => {
    try {
      await disableMFA(enrollmentId);
      setShowDisableConfirm(null);
      await refreshMethods();
    } catch (err) {
      console.error('Failed to disable MFA:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
        <p>Loading MFA settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
        🔐 Multi-Factor Authentication
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Manage your multi-factor authentication methods.
      </p>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#dc2626', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Active Methods */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Active Methods
        </h3>
        
        {enrollments.filter(e => e.status === 'active').length === 0 ? (
          <div style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              No MFA methods are currently enabled
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {enrollments
              .filter(e => e.status === 'active')
              .map((enrollment) => (
                <div
                  key={enrollment.id}
                  style={{
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: '#f0fdf4'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{enrollment.method.icon}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                        {enrollment.method.name}
                      </h4>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                        {enrollment.method.description}
                      </p>
                      <div style={{ fontSize: '12px', color: '#059669' }}>
                        Added: {new Date(enrollment.metadata.enrolledAt).toLocaleDateString()}
                        {enrollment.metadata.lastUsed && (
                          <span> • Last used: {new Date(enrollment.metadata.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDisableConfirm(enrollment.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Disable
                    </button>
                  </div>

                  {showDisableConfirm === enrollment.id && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0 0 12px 0', color: '#991b1b', fontSize: '14px' }}>
                        Are you sure you want to disable {enrollment.method.name}? This will reduce your account security.
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleDisableMFA(enrollment.id)}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Yes, Disable
                        </button>
                        <button
                          onClick={() => setShowDisableConfirm(null)}
                          style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Available Methods */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Available Methods
        </h3>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {availableMethods
            .filter(method => getMethodStatus(method.type) === 'not-enrolled')
            .map((method) => (
              <div
                key={method.type}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{method.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                      {method.name}
                    </h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                      {method.description}
                    </p>
                  </div>
                  <button
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Set Up
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MFAVerification;
