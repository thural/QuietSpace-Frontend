import React, { useState, useEffect } from 'react';
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh';
import { createAdvancedTokenRotationManager } from '@/core/auth/services/AdvancedTokenRotationManager';

/**
 * Advanced Token Rotation Example Component
 * 
 * Demonstrates the usage of advanced token rotation strategies
 * with enterprise-grade monitoring and control.
 */
const AdvancedTokenRotationExample: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [rotationStrategy, setRotationStrategy] = useState<'eager' | 'lazy' | 'adaptive'>('adaptive');
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);

  // Basic token refresh with advanced rotation
  const tokenRefresh = useTokenRefresh({
    autoStart: true,
    refreshInterval: 540000, // 9 minutes
    enableMultiTabSync: true,
    enableSecurityMonitoring: true,
    // Advanced rotation options
    enableAdvancedRotation: isAdvancedMode,
    rotationStrategy,
    rotationBuffer: 5 * 60 * 1000, // 5 minutes
    enableRefreshTokenRotation: true,
    onMetricsUpdate: (newMetrics) => {
      setMetrics(newMetrics);
      console.log('Token refresh metrics updated:', newMetrics);
    },
    onSuccess: (data) => {
      console.log('Token refresh successful:', data);
    },
    onError: (error) => {
      console.error('Token refresh error:', error);
    }
  });

  // Standalone advanced rotation manager for demonstration
  const [advancedManager, setAdvancedManager] = useState<any>(null);

  useEffect(() => {
    // Create standalone advanced rotation manager
    const manager = createAdvancedTokenRotationManager({
      strategy: rotationStrategy,
      rotationBuffer: 5 * 60 * 1000,
      enableRefreshTokenRotation: true,
      enableTokenValidation: true,
      maxRefreshAttempts: 3,
      rotationDelay: 1000
    });
    
    setAdvancedManager(manager);

    return () => {
      manager.stopTokenRotation();
    };
  }, [rotationStrategy]);

  const handleStartRotation = async () => {
    try {
      await advancedManager.startTokenRotation();
      console.log('Advanced rotation started');
    } catch (error) {
      console.error('Failed to start advanced rotation:', error);
    }
  };

  const handleStopRotation = () => {
    advancedManager.stopTokenRotation();
    console.log('Advanced rotation stopped');
  };

  const handleForceRotation = async () => {
    const success = await advancedManager.forceRotation();
    console.log('Force rotation result:', success);
  };

  const handleStrategyChange = (newStrategy: 'eager' | 'lazy' | 'adaptive') => {
    setRotationStrategy(newStrategy);
    advancedManager.updateStrategy(newStrategy);
  };

  const refreshMetrics = () => {
    if (advancedManager) {
      const rotationMetrics = advancedManager.getMetrics();
      const rotationStatus = advancedManager.getStatus();
      
      console.log('Advanced Rotation Metrics:', rotationMetrics);
      console.log('Advanced Rotation Status:', rotationStatus);
      
      // Update local state
      setMetrics({
        ...metrics,
        ...rotationMetrics,
        ...rotationStatus
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Advanced Token Rotation Example</h2>
      
      {/* Control Panel */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Control Panel</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={(e) => setIsAdvancedMode(e.target.checked)}
            />
            Enable Advanced Rotation (Hook)
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Rotation Strategy: </label>
          <select
            value={rotationStrategy}
            onChange={(e) => handleStrategyChange(e.target.value as any)}
            style={{ marginLeft: '10px' }}
          >
            <option value="eager">Eager (Rotate Early)</option>
            <option value="lazy">Lazy (Rotate Late)</option>
            <option value="adaptive">Adaptive (Smart)</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleStartRotation} style={{ marginRight: '10px' }}>
            Start Advanced Rotation
          </button>
          <button onClick={handleStopRotation} style={{ marginRight: '10px' }}>
            Stop Advanced Rotation
          </button>
          <button onClick={handleForceRotation} style={{ marginRight: '10px' }}>
            Force Rotation
          </button>
          <button onClick={refreshMetrics}>
            Refresh Metrics
          </button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <button onClick={tokenRefresh.startTokenRefresh} style={{ marginRight: '10px' }}>
            Start Hook Refresh
          </button>
          <button onClick={tokenRefresh.stopTokenRefresh} style={{ marginRight: '10px' }}>
            Stop Hook Refresh
          </button>
          <button onClick={tokenRefresh.forceRotation}>
            Force Hook Rotation
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Status</h3>
        <p><strong>Hook Active:</strong> {tokenRefresh.isActive ? 'Yes' : 'No'}</p>
        <p><strong>Advanced Mode:</strong> {isAdvancedMode ? 'Yes' : 'No'}</p>
        <p><strong>Current Strategy:</strong> {rotationStrategy}</p>
        
        {status && (
          <div>
            <h4>Advanced Manager Status:</h4>
            <p><strong>Active:</strong> {status.isActive ? 'Yes' : 'No'}</p>
            <p><strong>Strategy:</strong> {status.strategy}</p>
            <p><strong>Last Rotation:</strong> {status.lastRotation ? new Date(status.lastRotation).toLocaleString() : 'Never'}</p>
            <p><strong>Next Rotation:</strong> {status.nextRotation ? new Date(status.nextRotation).toLocaleString() : 'Not scheduled'}</p>
          </div>
        )}
      </div>

      {/* Metrics Display */}
      {metrics && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Metrics</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Standard Refresh Metrics */}
            <div>
              <h4>Standard Refresh Metrics</h4>
              <p><strong>Total Refreshes:</strong> {metrics.totalRefreshes || 0}</p>
              <p><strong>Successful Refreshes:</strong> {metrics.successfulRefreshes || 0}</p>
              <p><strong>Failed Refreshes:</strong> {metrics.failedRefreshes || 0}</p>
              <p><strong>Average Refresh Time:</strong> {metrics.averageRefreshTime?.toFixed(2) || 0}ms</p>
              <p><strong>Last Refresh:</strong> {metrics.lastRefreshTime ? new Date(metrics.lastRefreshTime).toLocaleString() : 'Never'}</p>
              <p><strong>Security Events:</strong> {metrics.securityEvents || 0}</p>
            </div>

            {/* Advanced Rotation Metrics */}
            <div>
              <h4>Advanced Rotation Metrics</h4>
              <p><strong>Total Rotations:</strong> {metrics.totalRotations || 0}</p>
              <p><strong>Successful Rotations:</strong> {metrics.successfulRotations || 0}</p>
              <p><strong>Failed Rotations:</strong> {metrics.failedRotations || 0}</p>
              <p><strong>Rotation Strategy:</strong> {metrics.rotationStrategy || 'None'}</p>
              <p><strong>Refresh Tokens Rotated:</strong> {metrics.refreshTokensRotated || 0}</p>
              <p><strong>Fallback Activations:</strong> {metrics.fallbackActivations || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Information */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Strategy Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <h4>Eager Strategy</h4>
            <p>Rotates tokens early (2x buffer time)</p>
            <p><strong>Use Case:</strong> High-security applications</p>
            <p><strong>Pros:</strong> Maximum security</p>
            <p><strong>Cons:</strong> More frequent refreshes</p>
          </div>
          
          <div>
            <h4>Lazy Strategy</h4>
            <p>Rotates tokens late (0.5x buffer time)</p>
            <p><strong>Use Case:</strong> Performance-critical apps</p>
            <p><strong>Pros:</strong> Fewer refreshes</p>
            <p><strong>Cons:</strong> Higher risk of expiration</p>
          </div>
          
          <div>
            <h4>Adaptive Strategy</h4>
            <p>Intelligently adjusts based on failure rate</p>
            <p><strong>Use Case:</strong> Production applications</p>
            <p><strong>Pros:</strong> Balanced approach</p>
            <p><strong>Cons:</strong> More complex logic</p>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Usage Examples</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
{`// Basic usage with advanced rotation
const tokenRefresh = useTokenRefresh({
  enableAdvancedRotation: true,
  rotationStrategy: 'adaptive',
  rotationBuffer: 5 * 60 * 1000, // 5 minutes
  enableRefreshTokenRotation: true,
  onMetricsUpdate: (metrics) => {
    console.log('Metrics:', metrics);
  }
});

// Standalone advanced rotation manager
const manager = createAdvancedTokenRotationManager({
  strategy: 'adaptive',
  enableRefreshTokenRotation: true,
  enableTokenValidation: true
});

await manager.startTokenRotation();
const metrics = manager.getMetrics();
const status = manager.getStatus();`}
        </pre>
      </div>
    </div>
  );
};

export default AdvancedTokenRotationExample;
