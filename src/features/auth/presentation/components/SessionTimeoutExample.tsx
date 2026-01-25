import React, { useState } from 'react';
import SessionTimeoutProvider, { 
  useSessionTimeoutContext, 
  useSessionTimeoutSimple,
  useSessionTimeoutAnalyticsData,
  SessionTimeoutGuard,
  SessionTimeoutStatus,
  SessionTimeoutDebugPanel
} from '@features/auth/presentation/components/SessionTimeoutProvider';

/**
 * Comprehensive Session Timeout Example
 * 
 * This example demonstrates all features of the session timeout management system:
 * - Basic session timeout with warnings
 * - Custom configuration and event handlers
 * - Analytics and monitoring
 * - Route protection with guards
 * - Status indicators and debug panels
 * - Advanced usage patterns
 */

const SessionTimeoutExample: React.FC = () => {
  const [config, setConfig] = useState({
    sessionDuration: 2 * 60 * 1000, // 2 minutes for demo
    warningTime: 30 * 1000, // 30 seconds
    finalWarningTime: 10 * 1000, // 10 seconds
    maxExtensions: 2,
    enableCrossTabSync: true,
    enableActivityTracking: true,
    enableMonitoring: true
  });

  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);

  // Custom event handlers
  const handleWarning = (timeRemaining: number) => {
    console.log('⚠️ Session warning:', timeRemaining, 'ms remaining');
  };

  const handleFinalWarning = (timeRemaining: number) => {
    console.log('🚨 Final warning:', timeRemaining, 'ms remaining');
  };

  const handleTimeout = () => {
    console.log('❌ Session expired!');
    // Could redirect to login, show logout message, etc.
  };

  const handleExtended = (newExpiryTime: number) => {
    console.log('✅ Session extended to:', new Date(newExpiryTime).toLocaleTimeString());
  };

  const handleStateChange = (state: any) => {
    console.log('📊 State changed:', state.status, state.timeRemaining, 'ms remaining');
  };

  const handleActivity = (activityType: string) => {
    console.log('👆 Activity detected:', activityType);
  };

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
          ⏰ Session Timeout Management - Example
        </h1>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#7f8c8d', 
          fontSize: '16px' 
        }}>
          Enterprise-grade session timeout management with intelligent warnings, cross-tab synchronization, and analytics.
        </p>

        {/* Configuration Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057' 
            }}>
              Session Duration:
            </label>
            <select
              value={config.sessionDuration}
              onChange={(e) => setConfig(prev => ({ ...prev, sessionDuration: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value={60000}>1 minute (Demo)</option>
              <option value={120000}>2 minutes (Demo)</option>
              <option value={300000}>5 minutes</option>
              <option value={600000}>10 minutes</option>
              <option value={1800000}>30 minutes (Default)</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057' 
            }}>
              Warning Time:
            </label>
            <select
              value={config.warningTime}
              onChange={(e) => setConfig(prev => ({ ...prev, warningTime: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value={10000}>10 seconds</option>
              <option value={30000}>30 seconds</option>
              <option value={60000}>1 minute</option>
              <option value={300000}>5 minutes</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057' 
            }}>
              Max Extensions:
            </label>
            <select
              value={config.maxExtensions}
              onChange={(e) => setConfig(prev => ({ ...prev, maxExtensions: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value={0}>No extensions</option>
              <option value={1}>1 extension</option>
              <option value={2}>2 extensions</option>
              <option value={3}>3 extensions</option>
              <option value={5}>5 extensions</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057' 
            }}>
              Features:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showIndicator}
                  onChange={(e) => setShowIndicator(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Show Indicator
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableAnalytics}
                  onChange={(e) => setEnableAnalytics(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Enable Analytics
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showDebugPanel}
                  onChange={(e) => setShowDebugPanel(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Debug Panel (Dev Only)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Session Timeout Provider with Configuration */}
      <SessionTimeoutProvider
        config={config}
        debug={true}
        showIndicator={showIndicator}
        enableAnalytics={enableAnalytics}
        onWarning={handleWarning}
        onFinalWarning={handleFinalWarning}
        onTimeout={handleTimeout}
        onExtended={handleExtended}
        onStateChange={handleStateChange}
        onActivity={handleActivity}
      >
        {/* Main Application Content */}
        <SessionTimeoutGuard>
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
              fontSize: '24px',
              fontWeight: '600'
            }}>
              🛡️ Protected Content
            </h2>
            <p style={{ 
              margin: '0 0 15px 0', 
              color: '#7f8c8d', 
              fontSize: '16px' 
            }}>
              This content is protected by session timeout management. Try to interact with the page
              and wait for the session warnings to appear.
            </p>

            {/* Session Status Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <SessionTimeoutStatus detailed={true} />
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Move your mouse, type, or click to keep the session active.
              </div>
            </div>

            {/* Interactive Content */}
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                Interactive Demo
              </h3>
              <p style={{ margin: '0 0 15px 0', color: '#6b7280' }}>
                Interact with these elements to keep your session active:
              </p>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => console.log('Button clicked')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Click Me
                </button>
                
                <input
                  type="text"
                  placeholder="Type something..."
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                
                <textarea
                  placeholder="Or type here..."
                  rows={3}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical',
                    minWidth: '200px'
                  }}
                />
              </div>
            </div>
          </div>
        </SessionTimeoutGuard>

        {/* Session Controls */}
        <SessionControls />
        
        {/* Analytics Dashboard */}
        {enableAnalytics && <AnalyticsDashboard />}
        
        {/* Debug Panel */}
        {showDebugPanel && <SessionTimeoutDebugPanel />}
      </SessionTimeoutProvider>
    </div>
  );
};

/**
 * Session Controls Component
 */
const SessionControls: React.FC = () => {
  const {
    getTimeRemaining,
    canExtend,
    remainingExtensions,
    extendSession,
    resetSession,
    isActive,
    isWarning,
    isFinalWarning,
    isExpired,
    isExtended
  } = useSessionTimeoutContext();

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
        fontSize: '24px',
        fontWeight: '600'
      }}>
        🎛️ Session Controls
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
            Time Remaining
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
            {getTimeRemaining()}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
            Status
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            {isActive && '✅ Active'}
            {isWarning && '⚠️ Warning'}
            {isFinalWarning && '🚨 Final Warning'}
            {isExpired && '❌ Expired'}
            {isExtended && '🔄 Extended'}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
            Extensions
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            {remainingExtensions} left
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
            Can Extend
          </div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            {canExtend ? '✅ Yes' : '❌ No'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => extendSession()}
          disabled={!canExtend}
          style={{
            padding: '10px 20px',
            backgroundColor: canExtend ? '#10b981' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: canExtend ? 'pointer' : 'not-allowed'
          }}
        >
          Extend Session
        </button>
        
        <button
          onClick={resetSession}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Reset Session
        </button>
      </div>
    </div>
  );
};

/**
 * Analytics Dashboard Component
 */
const AnalyticsDashboard: React.FC = () => {
  const analytics = useSessionTimeoutAnalyticsData();

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
        fontSize: '24px',
        fontWeight: '600'
      }}>
        📊 Session Analytics
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid '#bbdefb'
        }}>
          <div style={{ fontSize: '14px', color: '#1565c0', marginBottom: '5px' }}>
            Average Session Length
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1565c0' }}>
            {Math.round(analytics.averageSessionLength / 1000)}s
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid '#c3e6c3'
        }}>
          <div style={{ fontSize: '14px', color: '#155724', marginBottom: '5px' }}>
            Extension Rate
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#155724' }}>
            {analytics.extensionRate.toFixed(1)}%
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          border: '1px solid '#ffe0b2'
        }}>
          <div style={{ fontSize: '14px', color: '#e65100', marginBottom: '5px' }}>
            Abandonment Rate
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#e65100' }}>
            {analytics.abandonmentRate.toFixed(1)}%
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#f3e5f5',
          borderRadius: '8px',
          border: '1px solid '#e1bee7'
        }}>
          <div style={{ fontSize: '14px', color: '#6a1b9a', marginBottom: '5px' }}>
            Warning Effectiveness
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#6a1b9a' }}>
            {analytics.warningEffectiveness.toFixed(1)}%
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#fce4ec',
          borderRadius: '8px',
          border: '1px solid '#f8bbd9'
        }}>
          <div style={{ fontSize: '14px', color: '#880e4f', marginBottom: '5px' }}>
            Total Sessions
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#880e4f' }}>
            {analytics.totalSessions}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#e0f2f1',
          borderRadius: '8px',
          border: '1px solid '#b2dfdb'
        }}>
          <div style={{ fontSize: '14px', color: '#00695c', marginBottom: '5px' }}>
            Successful Extensions
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#00695c' }}>
            {analytics.successfulExtensions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutExample;
