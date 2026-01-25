import React, { useEffect, useState } from 'react';
import { useSessionTimeoutUI } from '@features/auth/application/hooks/useSessionTimeout';

/**
 * Session Timeout Warning Modal
 * 
 * Displays a user-friendly warning when session is about to expire
 * with countdown timer and extension options.
 */
export const SessionTimeoutWarning: React.FC = () => {
  const {
    showWarning,
    getTimeRemaining,
    canExtend,
    remainingExtensions,
    handleExtendSession,
    handleDismissWarning
  } = useSessionTimeoutUI();

  const [countdown, setCountdown] = useState(getTimeRemaining());

  // Update countdown every second
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setCountdown(getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, getTimeRemaining]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'slideUp 0.3s ease-in-out'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>⏰</span>
          </div>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#d97706'
          }}>
            Session Timeout Warning
          </h2>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Your session will expire in <strong>{countdown}</strong>. 
            Would you like to extend your session?
          </p>
        </div>

        {/* Extension Info */}
        {remainingExtensions > 0 && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#0369a1'
            }}>
              You have <strong>{remainingExtensions}</strong> extension{remainingExtensions > 1 ? 's' : ''} remaining.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {canExtend ? (
            <button
              onClick={handleExtendSession}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Extend Session
            </button>
          ) : (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              color: '#dc2626',
              textAlign: 'center'
            }}>
              No extensions remaining. Your session will expire.
            </div>
          )}

          <button
            onClick={handleDismissWarning}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            Dismiss
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Session Timeout Final Warning Modal
 * 
 * Displays an urgent warning when session is about to expire
 * with immediate action required.
 */
export const SessionTimeoutFinalWarning: React.FC = () => {
  const {
    showFinalWarning,
    getTimeRemaining,
    canExtend,
    remainingExtensions,
    handleExtendSession,
    handleDismissFinalWarning
  } = useSessionTimeoutUI();

  const [countdown, setCountdown] = useState(getTimeRemaining());
  const [isUrgent, setIsUrgent] = useState(false);

  // Update countdown every second
  useEffect(() => {
    if (!showFinalWarning) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setCountdown(remaining);
      
      // Mark as urgent when less than 30 seconds
      const timeInSeconds = parseInt(remaining.replace(/[^0-9]/g, '')) || 0;
      setIsUrgent(timeInSeconds <= 30);
    }, 1000);

    return () => clearInterval(interval);
  }, [showFinalWarning, getTimeRemaining]);

  if (!showFinalWarning) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'slideUp 0.2s ease-in-out',
        border: isUrgent ? '2px solid #dc2626' : '2px solid #f59e0b'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: isUrgent ? '#fee2e2' : '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: isUrgent ? 'pulse 1s infinite' : 'none'
          }}>
            <span style={{ fontSize: '32px' }}>{isUrgent ? '🚨' : '⚠️'}</span>
          </div>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: isUrgent ? '#dc2626' : '#d97706'
          }}>
            {isUrgent ? 'Session Expiring!' : 'Final Warning'}
          </h2>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Your session will expire in <strong style={{ 
              color: isUrgent ? '#dc2626' : '#d97706',
              fontSize: '18px'
            }}>{countdown}</strong>. 
            {isUrgent ? ' Act now!' : ' Please extend your session.'}
          </p>
        </div>

        {/* Urgent Message */}
        {isUrgent && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#dc2626',
              fontWeight: '500'
            }}>
              ⚠️ Your session is about to expire! Extend immediately to avoid losing your work.
            </p>
          </div>
        )}

        {/* Extension Info */}
        {remainingExtensions > 0 && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#0369a1'
            }}>
              You have <strong>{remainingExtensions}</strong> extension{remainingExtensions > 1 ? 's' : ''} remaining.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {canExtend ? (
            <button
              onClick={handleExtendSession}
              style={{
                backgroundColor: isUrgent ? '#dc2626' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                animation: isUrgent ? 'pulse 1s infinite' : 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isUrgent ? '#b91c1c' : '#d97706';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isUrgent ? '#dc2626' : '#f59e0b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isUrgent ? 'Extend Now!' : 'Extend Session'}
            </button>
          ) : (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              color: '#dc2626',
              textAlign: 'center'
            }}>
              No extensions remaining. Your session will expire.
            </div>
          )}

          {!isUrgent && (
            <button
              onClick={handleDismissFinalWarning}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

/**
 * Session Timeout Expired Modal
 * 
 * Displays when session has expired and requires user to log in again.
 */
export const SessionTimeoutExpired: React.FC = () => {
  const {
    showExpired,
    handleExpired
  } = useSessionTimeoutUI();

  const [countdown, setCountdown] = useState(10);

  // Countdown to automatic redirect
  useEffect(() => {
    if (!showExpired) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showExpired, handleExpired]);

  if (!showExpired) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'slideUp 0.2s ease-in-out',
        border: '2px solid #dc2626'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>🔒</span>
          </div>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#dc2626'
          }}>
            Session Expired
          </h2>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            Your session has expired due to inactivity. 
            You will be redirected to the login page in <strong>{countdown}</strong> seconds.
          </p>
        </div>

        {/* Info Message */}
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151'
          }}>
            What happened?
          </h3>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <li>Your session timed out due to inactivity</li>
            <li>Any unsaved work may be lost</li>
            <li>You'll need to log in again to continue</li>
          </ul>
        </div>

        {/* Action */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleExpired}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Go to Login ({countdown}s)
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Session Timeout Indicator
 * 
 * Small indicator showing session status and time remaining.
 */
export const SessionTimeoutIndicator: React.FC = () => {
  const {
    isActive,
    isWarning,
    isFinalWarning,
    getTimeRemaining,
    canExtend,
    remainingExtensions
  } = useSessionTimeoutUI();

  if (isActive) return null;

  const getStatusColor = () => {
    if (isFinalWarning) return '#dc2626';
    if (isWarning) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = () => {
    if (isFinalWarning) return 'Expiring Soon';
    if (isWarning) return 'Session Warning';
    return 'Session Active';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      padding: '12px 16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: getStatusColor(),
          borderRadius: '50%',
          animation: isFinalWarning ? 'pulse 1s infinite' : 'none'
        }} />
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: getStatusColor()
        }}>
          {getStatusText()}
        </span>
      </div>
      
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '4px'
      }}>
        Time: {getTimeRemaining()}
      </div>

      {remainingExtensions > 0 && (
        <div style={{
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          {remainingExtensions} extension{remainingExtensions > 1 ? 's' : ''} left
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
