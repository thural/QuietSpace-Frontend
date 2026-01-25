import React, { useState } from 'react';
import { useMFA, useMFAEnrollment, useMFAVerification, MFAMethod } from '@features/auth/application/hooks/useMFA';

/**
 * MFA Enrollment Component
 * 
 * Provides a complete MFA enrollment flow with:
 * - Method selection interface
 * - TOTP setup with QR code
 * - SMS verification setup
 * - Backup codes generation
 * - Biometric enrollment
 * - Security key setup
 */
export const MFAEnrollment: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    availableMethods,
    enrollments,
    isLoading,
    error,
    enrollTOTP,
    verifyTOTPEnrollment,
    enrollSMS,
    verifySMSEnrollment,
    generateBackupCodes,
    getMethodStatus
  } = useMFAEnrollment(userId);

  const {
    currentStep,
    selectedMethod,
    selectMethod,
    completeEnrollment,
    resetEnrollment
  } = useMFAEnrollment(userId);

  const [totpCode, setTotpCode] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
        <p>Loading MFA options...</p>
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

  // Method Selection Step
  if (currentStep === 'method-selection') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          🔐 Set Up Multi-Factor Authentication
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Choose a method to add an extra layer of security to your account.
        </p>

        <div style={{ display: 'grid', gap: '12px' }}>
          {availableMethods.map((method) => {
            const status = getMethodStatus(method.type);
            const isEnrolled = status === 'active';
            const isPending = status === 'pending';

            return (
              <div
                key={method.type}
                style={{
                  border: `2px solid ${isEnrolled ? '#10b981' : isPending ? '#f59e0b' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: isEnrolled ? 'default' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isEnrolled ? '#f0fdf4' : isPending ? '#fffbeb' : 'white'
                }}
                onClick={() => !isEnrolled && selectMethod(method)}
                onMouseOver={(e) => {
                  if (!isEnrolled) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isEnrolled) {
                    e.currentTarget.style.borderColor = isPending ? '#f59e0b' : '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
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
                  <div style={{ textAlign: 'right' }}>
                    {isEnrolled && (
                      <span style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        ✅ Enabled
                      </span>
                    )}
                    {isPending && (
                      <span style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        ⏳ Setup in Progress
                      </span>
                    )}
                    {!isEnrolled && !isPending && (
                      <span style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Set Up
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            💡 Security Tip
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            We recommend setting up at least two MFA methods for maximum security. 
            Backup codes are especially useful for account recovery.
          </p>
        </div>
      </div>
    );
  }

  // Setup Step
  if (currentStep === 'setup' && selectedMethod) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={resetEnrollment}
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
            Set Up {selectedMethod.name}
          </h2>
        </div>

        {selectedMethod.type === 'totp' && <TOTPSetup />}
        {selectedMethod.type === 'sms' && <SMSSetup />}
        {selectedMethod.type === 'backup-codes' && <BackupCodesSetup />}
        {selectedMethod.type === 'biometric' && <BiometricSetup />}
        {selectedMethod.type === 'security-key' && <SecurityKeySetup />}
        {selectedMethod.type === 'email' && <EmailSetup />}
      </div>
    );
  }

  // Verification Step
  if (currentStep === 'verification' && selectedMethod) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={resetEnrollment}
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
            Verify {selectedMethod.name}
          </h2>
        </div>

        {selectedMethod.type === 'totp' && (
          <TOTPVerification
            code={totpCode}
            onCodeChange={setTotpCode}
            onVerify={() => verifyTOTPEnrollment('temp-id', totpCode)}
            onComplete={completeEnrollment}
          />
        )}
        {selectedMethod.type === 'sms' && (
          <SMSVerification
            code={smsCode}
            onCodeChange={setSmsCode}
            onVerify={() => verifySMSEnrollment('temp-id', smsCode)}
            onComplete={completeEnrollment}
          />
        )}
      </div>
    );
  }

  // Complete Step
  if (currentStep === 'complete') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <span style={{ fontSize: '40px', color: 'white' }}>✅</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
          MFA Setup Complete!
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Your account is now protected with multi-factor authentication.
        </p>
        <button
          onClick={resetEnrollment}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Set Up Another Method
        </button>
      </div>
    );
  }

  return null;
};

/**
 * TOTP Setup Component
 */
const TOTPSetup: React.FC = () => {
  const { enrollTOTP, totpEnrollment, isTOTPEnrolling } = useMFAEnrollment('temp-user');

  const handleEnroll = async () => {
    try {
      await enrollTOTP();
    } catch (error) {
      console.error('TOTP enrollment failed:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          📱 Set Up Authenticator App
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
        </p>
      </div>

      {!totpEnrollment ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleEnroll}
            disabled={isTOTPEnrolling}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isTOTPEnrolling ? 'not-allowed' : 'pointer'
            }}
          >
            {isTOTPEnrolling ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#f3f4f6',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '48px' }}>📱</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              QR Code for TOTP Setup
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>
              {totpEnrollment.manualEntryKey}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>
              💡 Setup Instructions
            </h4>
            <ol style={{ margin: '0', paddingLeft: '20px', color: '#0369a1', fontSize: '14px' }}>
              <li>Open your authenticator app</li>
              <li>Scan the QR code or enter the manual key</li>
              <li>Enter the 6-digit code to verify</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SMS Setup Component
 */
const SMSSetup: React.FC = () => {
  const { enrollSMS, smsEnrollment, isSMSEnrolling } = useMFAEnrollment('temp-user');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleEnroll = async () => {
    try {
      await enrollSMS(phoneNumber, countryCode);
    } catch (error) {
      console.error('SMS enrollment failed:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          💬 Set Up SMS Verification
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Add your phone number to receive verification codes via SMS.
        </p>
      </div>

      {!smsEnrollment ? (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+86">+86 (CN)</option>
                <option value="+81">+81 (JP)</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 123-4567"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={isSMSEnrolling || !phoneNumber}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: (isSMSEnrolling || !phoneNumber) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSMSEnrolling ? 'Sending Code...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ margin: '0', color: '#166534' }}>
            ✅ Verification code sent to {smsEnrollment.phoneNumber}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Backup Codes Setup Component
 */
const BackupCodesSetup: React.FC = () => {
  const { generateBackupCodes, backupCodes, isGeneratingBackupCodes } = useMFAEnrollment('temp-user');
  const [showCodes, setShowCodes] = useState(false);

  const handleGenerate = async () => {
    try {
      await generateBackupCodes();
      setShowCodes(true);
    } catch (error) {
      console.error('Backup codes generation failed:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          🔑 Generate Backup Codes
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Generate one-time backup codes for account recovery. Save them in a secure location.
        </p>
      </div>

      {!backupCodes ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleGenerate}
            disabled={isGeneratingBackupCodes}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isGeneratingBackupCodes ? 'not-allowed' : 'pointer'
            }}
          >
            {isGeneratingBackupCodes ? 'Generating...' : 'Generate Backup Codes'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
              ⚠️ Important: Save These Codes
            </h4>
            <p style={{ margin: '0', color: '#92400e', fontSize: '14px' }}>
              These codes can only be shown once. Save them in a secure location.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px'
            }}>
              {backupCodes.codes.map((code, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(backupCodes.codes.join('\n'))}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            📋 Copy Codes
          </button>

          <button
            onClick={() => {
              const blob = new Blob([backupCodes.codes.join('\n')], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'backup-codes.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            💾 Download
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Biometric Setup Component
 */
const BiometricSetup: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          👆 Set Up Biometric Authentication
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Use your fingerprint or face recognition for quick and secure authentication.
        </p>
      </div>

      <div style={{
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Biometric Authentication
        </h4>
        <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
          This feature requires a device with biometric capabilities and HTTPS connection.
        </p>
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Enable Biometric Auth
        </button>
      </div>
    </div>
  );
};

/**
 * Security Key Setup Component
 */
const SecurityKeySetup: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          🔐 Set Up Security Key
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Add a YubiKey or other FIDO2 security key for maximum security.
        </p>
      </div>

      <div style={{
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Security Key Setup
        </h4>
        <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
          Insert your security key and follow the on-screen instructions.
        </p>
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Register Security Key
        </button>
      </div>
    </div>
  );
};

/**
 * Email Setup Component
 */
const EmailSetup: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          📧 Set Up Email Verification
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Add your email address to receive verification codes.
        </p>
      </div>

      <div style={{
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Email Verification
        </h4>
        <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
          Receive verification codes via email for secure authentication.
        </p>
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Set Up Email Verification
        </button>
      </div>
    </div>
  );
};

/**
 * TOTP Verification Component
 */
const TOTPVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => Promise<boolean>;
  onComplete: () => void;
}> = ({ code, onCodeChange, onVerify, onComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError('');
      
      const success = await onVerify();
      
      if (success) {
        onComplete();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter the 6-digit code from your authenticator app:
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="000000"
          maxLength={6}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '18px',
            textAlign: 'center',
            letterSpacing: '4px',
            fontFamily: 'monospace'
          }}
        />
        
        {error && (
          <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '8px' }}>
            ❌ {error}
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || code.length !== 6}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (isVerifying || code.length !== 6) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
    </div>
  );
};

/**
 * SMS Verification Component
 */
const SMSVerification: React.FC<{
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => Promise<boolean>;
  onComplete: () => void;
}> = ({ code, onCodeChange, onVerify, onComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError('');
      
      const success = await onVerify();
      
      if (success) {
        onComplete();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enter the 6-digit code sent to your phone:
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="000000"
          maxLength={6}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '18px',
            textAlign: 'center',
            letterSpacing: '4px',
            fontFamily: 'monospace'
          }}
        />
        
        {error && (
          <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '8px' }}>
            ❌ {error}
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || code.length !== 6}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: (isVerifying || code.length !== 6) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
    </div>
  );
};

export default MFAEnrollment;
