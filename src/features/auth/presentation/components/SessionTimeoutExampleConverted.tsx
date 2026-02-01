import React from 'react';
import SessionTimeoutProvider, { 
  useSessionTimeoutContext, 
  useSessionTimeoutSimple,
  useSessionTimeoutAnalyticsData,
  SessionTimeoutGuard,
  SessionTimeoutStatus,
  SessionTimeoutDebugPanel
} from '@features/auth/presentation/components/SessionTimeoutProvider';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Session Timeout Configuration
 */
export interface ISessionTimeoutConfig {
  sessionDuration: number;
  warningTime: number;
  finalWarningTime: number;
  maxExtensions: number;
  enableCrossTabSync: boolean;
  enableActivityTracking: boolean;
  enableMonitoring: boolean;
}

/**
 * Session Timeout Example Props
 */
export interface ISessionTimeoutExampleProps extends IBaseComponentProps {
  initialConfig?: Partial<ISessionTimeoutConfig>;
  showDebugPanel?: boolean;
  enableAnalytics?: boolean;
  showIndicator?: boolean;
}

/**
 * Session Timeout Example State
 */
export interface ISessionTimeoutExampleState extends IBaseComponentState {
  config: ISessionTimeoutConfig;
  showDebugPanel: boolean;
  enableAnalytics: boolean;
  showIndicator: boolean;
  lastEvent: string | null;
  eventTimestamp: Date | null;
}

/**
 * Comprehensive Session Timeout Example Component
 * 
 * This example demonstrates all features of the session timeout management system:
 * - Basic session timeout with warnings
 * - Custom configuration and event handlers
 * - Analytics and monitoring
 * - Route protection with guards
 * - Status indicators and debug panels
 * - Advanced usage patterns
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class SessionTimeoutExample extends BaseClassComponent<ISessionTimeoutExampleProps, ISessionTimeoutExampleState> {
  
  protected override getInitialState(): Partial<ISessionTimeoutExampleState> {
    const { 
      initialConfig = {},
      showDebugPanel = true,
      enableAnalytics = true,
      showIndicator = true
    } = this.props;

    return {
      config: {
        sessionDuration: 2 * 60 * 1000, // 2 minutes for demo
        warningTime: 30 * 1000, // 30 seconds
        finalWarningTime: 10 * 1000, // 10 seconds
        maxExtensions: 2,
        enableCrossTabSync: true,
        enableActivityTracking: true,
        enableMonitoring: true,
        ...initialConfig
      },
      showDebugPanel,
      enableAnalytics,
      showIndicator,
      lastEvent: null,
      eventTimestamp: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeSessionTimeout();
  }

  /**
   * Initialize session timeout system
   */
  private initializeSessionTimeout(): void {
    this.logEvent('Session timeout example initialized');
  }

  /**
   * Log an event with timestamp
   */
  private logEvent = (event: string): void => {
    this.safeSetState({
      lastEvent: event,
      eventTimestamp: new Date()
    });
    console.log(`🕐 ${new Date().toLocaleTimeString()}: ${event}`);
  };

  /**
   * Custom event handlers
   */
  private handleWarning = (timeRemaining: number): void => {
    this.logEvent(`⚠️ Session warning: ${timeRemaining}ms remaining`);
  };

  private handleFinalWarning = (timeRemaining: number): void => {
    this.logEvent(`🚨 Final warning: ${timeRemaining}ms remaining`);
  };

  private handleTimeout = (): void => {
    this.logEvent('❌ Session expired!');
    // Could redirect to login, show logout message, etc.
  };

  private handleExtension = (): void => {
    this.logEvent('✅ Session extended');
  };

  private handleActivity = (activity: string): void => {
    this.logEvent(`👆 User activity: ${activity}`);
  };

  /**
   * Update configuration
   */
  private updateConfig = (updates: Partial<ISessionTimeoutConfig>): void => {
    this.safeSetState(prev => ({
      config: { ...prev.config, ...updates }
    }));
    this.logEvent('Configuration updated');
  };

  /**
   * Toggle debug panel
   */
  private toggleDebugPanel = (): void => {
    this.safeSetState(prev => ({ 
      showDebugPanel: !prev.showDebugPanel 
    }));
  };

  /**
   * Toggle analytics
   */
  private toggleAnalytics = (): void => {
    this.safeSetState(prev => ({ 
      enableAnalytics: !prev.enableAnalytics 
    }));
    this.logEvent(`Analytics ${this.state.enableAnalytics ? 'disabled' : 'enabled'}`);
  };

  /**
   * Toggle indicator
   */
  private toggleIndicator = (): void => {
    this.safeSetState(prev => ({ 
      showIndicator: !prev.showIndicator 
    }));
  };

  /**
   * Render configuration panel
   */
  private renderConfigurationPanel(): React.ReactNode {
    const { config } = this.state;

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Session Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Duration (seconds)
            </label>
            <input
              type="number"
              value={config.sessionDuration / 1000}
              onChange={(e) => this.updateConfig({ 
                sessionDuration: parseInt(e.target.value) * 1000 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="30"
              max="3600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warning Time (seconds)
            </label>
            <input
              type="number"
              value={config.warningTime / 1000}
              onChange={(e) => this.updateConfig({ 
                warningTime: parseInt(e.target.value) * 1000 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="10"
              max="300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Warning Time (seconds)
            </label>
            <input
              type="number"
              value={config.finalWarningTime / 1000}
              onChange={(e) => this.updateConfig({ 
                finalWarningTime: parseInt(e.target.value) * 1000 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="5"
              max="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Extensions
            </label>
            <input
              type="number"
              value={config.maxExtensions}
              onChange={(e) => this.updateConfig({ 
                maxExtensions: parseInt(e.target.value) 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.enableCrossTabSync}
              onChange={(e) => this.updateConfig({ 
                enableCrossTabSync: e.target.checked 
              })}
              className="mr-2"
            />
            <span className="text-sm">Enable Cross-Tab Sync</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.enableActivityTracking}
              onChange={(e) => this.updateConfig({ 
                enableActivityTracking: e.target.checked 
              })}
              className="mr-2"
            />
            <span className="text-sm">Enable Activity Tracking</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.enableMonitoring}
              onChange={(e) => this.updateConfig({ 
                enableMonitoring: e.target.checked 
              })}
              className="mr-2"
            />
            <span className="text-sm">Enable Monitoring</span>
          </label>
        </div>
      </div>
    );
  }

  /**
   * Render control panel
   */
  private renderControlPanel(): React.ReactNode {
    const { showDebugPanel, enableAnalytics, showIndicator, lastEvent, eventTimestamp } = this.state;

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Controls</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={this.toggleDebugPanel}
              className={`px-4 py-2 rounded-md ${
                showDebugPanel 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {showDebugPanel ? 'Hide' : 'Show'} Debug Panel
            </button>
            
            <button
              onClick={this.toggleAnalytics}
              className={`px-4 py-2 rounded-md ${
                enableAnalytics 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {enableAnalytics ? 'Disable' : 'Enable'} Analytics
            </button>
            
            <button
              onClick={this.toggleIndicator}
              className={`px-4 py-2 rounded-md ${
                showIndicator 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {showIndicator ? 'Hide' : 'Show'} Indicator
            </button>
          </div>

          {/* Event Log */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Event Log</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {lastEvent ? (
                <div>
                  <div className="font-medium">{lastEvent}</div>
                  {eventTimestamp && (
                    <div className="text-xs text-gray-500">
                      {eventTimestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">No events yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render demo content
   */
  private renderDemoContent(): React.ReactNode {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Demo Content</h3>
        
        <p className="text-gray-600 mb-4">
          This is a demo page to test session timeout functionality. 
          The session will automatically expire based on the configuration above.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-800">Instructions:</h4>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Configure the session timeout settings above</li>
              <li>• Wait for the session to expire or interact with the page</li>
              <li>• Monitor the debug panel for real-time status</li>
              <li>• Test different configurations and scenarios</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800">Current Status:</h4>
            <div className="mt-2 text-sm text-yellow-700">
              <div>• Session is active</div>
              <div>• Activity tracking is {this.state.config.enableActivityTracking ? 'enabled' : 'disabled'}</div>
              <div>• Cross-tab sync is {this.state.config.enableCrossTabSync ? 'enabled' : 'disabled'}</div>
            </div>
          </div>

          {/* Interactive elements to trigger activity tracking */}
          <div className="space-y-2">
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => this.handleActivity('button click')}
            >
              Click Me (Activity)
            </button>
            <input 
              type="text" 
              placeholder="Type here (Activity)"
              className="px-3 py-2 border border-gray-300 rounded-md"
              onChange={() => this.handleActivity('typing')}
            />
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { config, showDebugPanel, enableAnalytics, showIndicator } = this.state;

    return (
      <div className="session-timeout-example p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Session Timeout Management Example
          </h1>
          <p className="text-gray-600">
            Comprehensive demonstration of session timeout features with real-time monitoring
          </p>
        </div>

        {/* Session Timeout Provider */}
        <SessionTimeoutProvider
          config={config}
          onWarning={this.handleWarning}
          onFinalWarning={this.handleFinalWarning}
          onTimeout={this.handleTimeout}
          onExtension={this.handleExtension}
          onActivity={this.handleActivity}
        >
          {/* Session Status Indicator */}
          {showIndicator && (
            <div className="mb-6">
              <SessionTimeoutStatus />
            </div>
          )}

          {/* Configuration Panel */}
          {this.renderConfigurationPanel()}

          {/* Control Panel */}
          {this.renderControlPanel()}

          {/* Demo Content */}
          <SessionTimeoutGuard>
            {this.renderDemoContent()}
          </SessionTimeoutGuard>

          {/* Debug Panel */}
          {showDebugPanel && (
            <div className="mb-6">
              <SessionTimeoutDebugPanel />
            </div>
          )}

          {/* Analytics Panel */}
          {enableAnalytics && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Session Analytics</h3>
              <SessionAnalyticsDisplay />
            </div>
          )}
        </SessionTimeoutProvider>
      </div>
    );
  }
}

/**
 * Session Analytics Display Component
 */
const SessionAnalyticsDisplay: React.FC = () => {
  const analytics = useSessionTimeoutAnalyticsData();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700">Total Sessions</h4>
          <div className="text-2xl font-bold">{analytics.totalSessions}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700">Active Sessions</h4>
          <div className="text-2xl font-bold">{analytics.activeSessions}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700">Expired Sessions</h4>
          <div className="text-2xl font-bold">{analytics.expiredSessions}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
        <div className="text-sm space-y-1">
          {analytics.recentActivity.length === 0 ? (
            <div className="text-gray-500">No recent activity</div>
          ) : (
            analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between">
                <span>{activity.type}</span>
                <span className="text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutExample;
