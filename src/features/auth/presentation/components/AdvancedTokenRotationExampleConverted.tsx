import React from 'react';
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh';
import { createAdvancedTokenRotationManager } from '@/core/auth/services/AdvancedTokenRotationManager';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Token Metrics interface
 */
export interface ITokenMetrics {
  lastRefresh?: Date;
  refreshCount: number;
  errorCount: number;
  averageRefreshTime: number;
  successRate: number;
  rotationEvents: number;
}

/**
 * Token Status interface
 */
export interface ITokenStatus {
  isValid: boolean;
  expiresAt?: Date;
  refreshTokenValid: boolean;
  rotationInProgress: boolean;
  lastRotation?: Date;
}

/**
 * Advanced Token Rotation Example Props
 */
export interface IAdvancedTokenRotationExampleProps extends IBaseComponentProps {
  initialStrategy?: 'eager' | 'lazy' | 'adaptive';
  refreshInterval?: number;
  enableAdvancedMode?: boolean;
}

/**
 * Advanced Token Rotation Example State
 */
export interface IAdvancedTokenRotationExampleState extends IBaseComponentState {
  metrics: ITokenMetrics | null;
  status: ITokenStatus | null;
  rotationStrategy: 'eager' | 'lazy' | 'adaptive';
  isAdvancedMode: boolean;
  advancedManager: any;
  lastActivity: Date | null;
  isMonitoring: boolean;
}

/**
 * Advanced Token Rotation Example Component
 * 
 * Demonstrates the usage of advanced token rotation strategies
 * with enterprise-grade monitoring and control.
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class AdvancedTokenRotationExample extends BaseClassComponent<IAdvancedTokenRotationExampleProps, IAdvancedTokenRotationExampleState> {
  private tokenRefresh: any;
  private metricsTimer: number | null = null;

  protected override getInitialState(): Partial<IAdvancedTokenRotationExampleState> {
    const { 
      initialStrategy = 'adaptive',
      refreshInterval = 540000, // 9 minutes
      enableAdvancedMode = true
    } = this.props;

    return {
      metrics: null,
      status: null,
      rotationStrategy: initialStrategy,
      isAdvancedMode: enableAdvancedMode,
      advancedManager: null,
      lastActivity: null,
      isMonitoring: true
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeTokenRefresh();
    this.createAdvancedManager();
    this.startMetricsCollection();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupTokenRefresh();
    this.cleanupAdvancedManager();
    this.stopMetricsCollection();
  }

  /**
   * Initialize token refresh with advanced rotation
   */
  private initializeTokenRefresh(): void {
    const { refreshInterval = 540000 } = this.props;
    const { isAdvancedMode, rotationStrategy } = this.state;

    this.tokenRefresh = useTokenRefresh({
      autoStart: true,
      refreshInterval,
      enableMultiTabSync: true,
      enableSecurityMonitoring: true,
      // Advanced rotation options
      enableAdvancedRotation: isAdvancedMode,
      rotationStrategy,
      rotationBuffer: 5 * 60 * 1000, // 5 minutes
      enableRefreshTokenRotation: true,
      onMetricsUpdate: this.handleMetricsUpdate,
      onSuccess: this.handleTokenRefreshSuccess,
      onError: this.handleTokenRefreshError
    });

    console.log('🔄 Advanced token rotation initialized');
  }

  /**
   * Create standalone advanced rotation manager
   */
  private createAdvancedManager = (): void => {
    const { rotationStrategy } = this.state;

    const manager = createAdvancedTokenRotationManager({
      strategy: rotationStrategy,
      rotationBuffer: 5 * 60 * 1000,
      enableRefreshTokenRotation: true,
      enableTokenValidation: true,
      maxRefreshAttempts: 3,
      enableMetricsCollection: true,
      onRotationEvent: this.handleRotationEvent,
      onStatusChange: this.handleStatusChange
    });

    this.safeSetState({ advancedManager: manager });
    console.log('🔧 Advanced rotation manager created');
  };

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsTimer = window.setInterval(() => {
      this.collectMetrics();
    }, 5000); // Collect every 5 seconds
  }

  /**
   * Stop metrics collection
   */
  private stopMetricsCollection(): void {
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
  }

  /**
   * Cleanup token refresh
   */
  private cleanupTokenRefresh(): void {
    if (this.tokenRefresh && this.tokenRefresh.cleanup) {
      this.tokenRefresh.cleanup();
    }
  }

  /**
   * Cleanup advanced manager
   */
  private cleanupAdvancedManager(): void {
    const { advancedManager } = this.state;
    if (advancedManager && advancedManager.cleanup) {
      advancedManager.cleanup();
    }
  }

  /**
   * Collect current metrics
   */
  private collectMetrics = (): void => {
    if (this.tokenRefresh && this.tokenRefresh.getMetrics) {
      const metrics = this.tokenRefresh.getMetrics();
      this.safeSetState({ metrics });
    }

    if (this.tokenRefresh && this.tokenRefresh.getStatus) {
      const status = this.tokenRefresh.getStatus();
      this.safeSetState({ status });
    }

    this.safeSetState({ lastActivity: new Date() });
  };

  /**
   * Handle metrics update
   */
  private handleMetricsUpdate = (newMetrics: ITokenMetrics): void => {
    this.safeSetState({ metrics: newMetrics });
    console.log('📊 Token refresh metrics updated:', newMetrics);
  };

  /**
   * Handle token refresh success
   */
  private handleTokenRefreshSuccess = (data: any): void => {
    console.log('✅ Token refresh successful:', data);
    this.safeSetState({ lastActivity: new Date() });
  };

  /**
   * Handle token refresh error
   */
  private handleTokenRefreshError = (error: any): void => {
    console.error('❌ Token refresh error:', error);
    this.safeSetState({ lastActivity: new Date() });
  };

  /**
   * Handle rotation event
   */
  private handleRotationEvent = (event: any): void => {
    console.log('🔄 Rotation event:', event);
    this.safeSetState({ lastActivity: new Date() });
  };

  /**
   * Handle status change
   */
  private handleStatusChange = (status: ITokenStatus): void => {
    this.safeSetState({ status });
    console.log('📈 Status change:', status);
  };

  /**
   * Handle strategy change
   */
  private handleStrategyChange = (strategy: 'eager' | 'lazy' | 'adaptive'): void => {
    this.safeSetState({ rotationStrategy: strategy });
    
    // Reinitialize with new strategy
    this.cleanupTokenRefresh();
    this.cleanupAdvancedManager();
    this.initializeTokenRefresh();
    this.createAdvancedManager();
  };

  /**
   * Toggle advanced mode
   */
  private toggleAdvancedMode = (): void => {
    const newMode = !this.state.isAdvancedMode;
    this.safeSetState({ isAdvancedMode: newMode });
    
    // Reinitialize with new mode
    this.cleanupTokenRefresh();
    this.initializeTokenRefresh();
  };

  /**
   * Toggle monitoring
   */
  private toggleMonitoring = (): void => {
    const newMonitoring = !this.state.isMonitoring;
    this.safeSetState({ isMonitoring: newMonitoring });
    
    if (newMonitoring) {
      this.startMetricsCollection();
    } else {
      this.stopMetricsCollection();
    }
  };

  /**
   * Force token refresh
   */
  private forceRefresh = (): void => {
    if (this.tokenRefresh && this.tokenRefresh.forceRefresh) {
      this.tokenRefresh.forceRefresh();
    }
  };

  /**
   * Render metrics display
   */
  private renderMetrics(): React.ReactNode {
    const { metrics } = this.state;

    if (!metrics) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500">No metrics available yet</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Token Rotation Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-medium text-blue-800">Refresh Count</h4>
            <div className="text-2xl font-bold text-blue-600">{metrics.refreshCount}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-medium text-green-800">Success Rate</h4>
            <div className="text-2xl font-bold text-green-600">
              {(metrics.successRate * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-medium text-yellow-800">Error Count</h4>
            <div className="text-2xl font-bold text-yellow-600">{metrics.errorCount}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-medium text-purple-800">Rotation Events</h4>
            <div className="text-2xl font-bold text-purple-600">{metrics.rotationEvents}</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded">
            <h4 className="font-medium text-indigo-800">Avg Refresh Time</h4>
            <div className="text-2xl font-bold text-indigo-600">
              {metrics.averageRefreshTime.toFixed(0)}ms
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-800">Last Refresh</h4>
            <div className="text-sm text-gray-600">
              {metrics.lastRefresh ? metrics.lastRefresh.toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render status display
   */
  private renderStatus(): React.ReactNode {
    const { status } = this.state;

    if (!status) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500">No status available yet</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Token Status</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Token Valid:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              status.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status.isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Refresh Token Valid:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              status.refreshTokenValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status.refreshTokenValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Rotation In Progress:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              status.rotationInProgress ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {status.rotationInProgress ? 'In Progress' : 'Idle'}
            </span>
          </div>
          
          {status.expiresAt && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Expires At:</span>
              <span className="text-sm text-gray-600">
                {status.expiresAt.toLocaleString()}
              </span>
            </div>
          )}
          
          {status.lastRotation && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Last Rotation:</span>
              <span className="text-sm text-gray-600">
                {status.lastRotation.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * Render controls
   */
  private renderControls(): React.ReactNode {
    const { rotationStrategy, isAdvancedMode, isMonitoring } = this.state;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Controls</h3>
        
        <div className="space-y-4">
          {/* Strategy Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation Strategy
            </label>
            <select
              value={rotationStrategy}
              onChange={(e) => this.handleStrategyChange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="eager">Eager - Refresh before expiry</option>
              <option value="lazy">Lazy - Refresh on demand</option>
              <option value="adaptive">Adaptive - Smart rotation</option>
            </select>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={this.toggleAdvancedMode}
              className={`px-4 py-2 rounded-md ${
                isAdvancedMode ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isAdvancedMode ? 'Advanced Mode ON' : 'Advanced Mode OFF'}
            </button>
            
            <button
              onClick={this.toggleMonitoring}
              className={`px-4 py-2 rounded-md ${
                isMonitoring ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isMonitoring ? 'Monitoring ON' : 'Monitoring OFF'}
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={this.forceRefresh}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Force Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { lastActivity, isMonitoring } = this.state;

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Advanced Token Rotation Example
          </h1>
          <p className="text-gray-600">
            Enterprise-grade token rotation with advanced strategies and monitoring
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
              </span>
            </div>
            {lastActivity && (
              <div className="text-sm text-gray-500">
                Last Activity: {lastActivity.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {this.renderMetrics()}
          {this.renderStatus()}
          {this.renderControls()}
        </div>
      </div>
    );
  }
}

export default AdvancedTokenRotationExample;
