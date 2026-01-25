import React, { useState } from 'react';
import { SecurityMonitor } from './SecurityMonitor';

/**
 * Comprehensive Security Analytics Dashboard Example
 * 
 * This example demonstrates all the features of the enhanced SecurityMonitor component,
 * including real-time monitoring, threat detection, IP management, and security actions.
 */
const SecurityAnalyticsExample: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('demo-user-123');
  const [refreshInterval, setRefreshInterval] = useState<number>(30000);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState<boolean>(true);

  // Demo user options for testing
  const demoUsers = [
    { id: 'demo-user-123', name: 'John Doe', role: 'Admin' },
    { id: 'demo-user-456', name: 'Jane Smith', role: 'User' },
    { id: 'demo-user-789', name: 'Bob Johnson', role: 'Moderator' },
    { id: 'system-admin', name: 'System Admin', role: 'Super Admin' }
  ];

  const refreshIntervalOptions = [
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '5 minutes', value: 300000 }
  ];

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
          🛡️ Security Analytics Dashboard - Example
        </h1>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#7f8c8d', 
          fontSize: '16px' 
        }}>
          Comprehensive security monitoring with real-time threat detection, IP management, and advanced analytics.
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
              Select User:
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              {demoUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057' 
            }}>
              Refresh Interval:
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              {refreshIntervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#495057',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={showAdvancedFeatures}
                onChange={(e) => setShowAdvancedFeatures(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show Advanced Features
            </label>
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Enable all security monitoring features
            </small>
          </div>
        </div>
      </div>

      {/* Main Security Dashboard */}
      <SecurityMonitor 
        userId={selectedUserId}
        refreshInterval={refreshInterval}
      />

      {/* Feature Information */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          color: '#2c3e50', 
          fontSize: '24px',
          fontWeight: '600'
        }}>
          📊 Dashboard Features
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '15px',
            background: '#e8f5e8',
            border: '1px solid #c3e6c3',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              🚨 Threat Detection
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#155724' }}>
              <li>Real-time threat level assessment</li>
              <li>Intelligent threat scoring (0-100)</li>
              <li>Security health monitoring</li>
              <li>Automatic risk level calculation</li>
            </ul>
          </div>

          <div style={{
            padding: '15px',
            background: '#e3f2fd',
            border: '1px solid #bbdefb',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
              📈 Analytics & Monitoring
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
              <li>Multiple timeframe analysis</li>
              <li>Auto-refresh capabilities</li>
              <li>Security event tracking</li>
              <li>Login attempts analysis</li>
            </ul>
          </div>

          <div style={{
            padding: '15px',
            background: '#fff3e0',
            border: '1px solid #ffe0b2',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#e65100' }}>
              🛡️ Security Management
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#e65100' }}>
              <li>IP blocking and unblocking</li>
              <li>Session management</li>
              <li>Security event recording</li>
              <li>Emergency security actions</li>
            </ul>
          </div>

          <div style={{
            padding: '15px',
            background: '#f3e5f5',
            border: '1px solid #e1bee7',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#6a1b9a' }}>
              ⚙️ Configuration
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#6a1b9a' }}>
              <li>User-specific monitoring</li>
              <li>Customizable refresh intervals</li>
              <li>Detailed security settings</li>
              <li>Two-factor authentication status</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          color: '#2c3e50', 
          fontSize: '24px',
          fontWeight: '600'
        }}>
          💻 Usage Examples
        </h2>
        
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
            Basic Usage:
          </h3>
          <pre style={{
            margin: '0',
            padding: '10px',
            background: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto'
          }}>
{`import { SecurityMonitor } from '@features/auth/presentation/components/SecurityMonitor';

// Basic security monitoring
<SecurityMonitor />

// With custom user and refresh interval
<SecurityMonitor 
  userId="user-123" 
  refreshInterval={60000} 
/>`}
          </pre>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>
            Advanced Integration:
          </h3>
          <pre style={{
            margin: '0',
            padding: '10px',
            background: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto'
          }}>
{`// In your admin dashboard
const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  return (
    <div>
      <SecurityMonitor 
        userId={selectedUser?.id}
        refreshInterval={30000}
      />
    </div>
  );
};

// In security monitoring page
const SecurityPage = () => {
  return (
    <div>
      <h1>Security Operations Center</h1>
      <SecurityMonitor 
        refreshInterval={10000} // Fast refresh for SOC
      />
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          color: '#2c3e50', 
          fontSize: '24px',
          fontWeight: '600'
        }}>
          ⚡ Performance Features
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '15px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🚀</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>
              Real-time Updates
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#155724' }}>
              Auto-refresh with configurable intervals
            </p>
          </div>

          <div style={{
            padding: '15px',
            background: '#cce5ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>📊</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#004085' }}>
              Intelligent Metrics
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#004085' }}>
              Advanced threat scoring and health monitoring
            </p>
          </div>

          <div style={{
            padding: '15px',
            background: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🎯</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#856404' }}>
              Responsive Design
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#856404' }}>
              Mobile-friendly with touch optimization
            </p>
          </div>

          <div style={{
            padding: '15px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔒</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>
              Enterprise Security
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#721c24' }}>
              Production-ready with comprehensive monitoring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalyticsExample;
