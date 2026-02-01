import React, { PureComponent, ReactNode } from 'react';
import { BaseClassComponent, IBaseComponentProps } from '../../components/base/BaseClassComponent';

/**
 * Props for TokenRefreshExample component
 */
interface ITokenRefreshExampleProps extends IBaseComponentProps {
  // No additional props needed for this example
}

/**
 * State for TokenRefreshExample component
 */
interface ITokenRefreshExampleState {
  isActive: boolean;
  lastRefreshTime: number | null;
  error: string | null;
}

/**
 * Example component demonstrating the use of createTokenRefreshManager
 * 
 * This component shows how to use the factory-based token refresh manager
 * for scenarios where you need more control over token refresh lifecycle
 * or want to avoid the static class approach.
 */
export class TokenRefreshExample extends BaseClassComponent<ITokenRefreshExampleProps, ITokenRefreshExampleState> {
  private refreshInterval: number | null = null;
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<ITokenRefreshExampleState> {
    return {
      isActive: false,
      lastRefreshTime: null,
      error: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    // Auto-start if configured
    this.startTokenRefresh();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopTokenRefresh();
  }

  private startTokenRefresh = async (): Promise<void> => {
    try {
      this.safeSetState({
        isActive: true,
        error: null
      } as unknown as Partial<ITokenRefreshExampleState>);

      // Simulate token refresh logic
      this.refreshInterval = 300000; // 5 minutes for demo purposes

      // Set up periodic refresh
      this.refreshTimer = window.setInterval(() => {
        this.performTokenRefresh();
      }, this.refreshInterval);

      // Perform initial refresh
      await this.performTokenRefresh();

    } catch (error) {
      this.safeSetState({
        isActive: false,
        error: error instanceof Error ? error.message : 'Failed to start token refresh'
      } as unknown as Partial<ITokenRefreshExampleState>);
    }
  };

  private stopTokenRefresh = (): void => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.safeSetState({
      isActive: false
    } as unknown as Partial<ITokenRefreshExampleState>);
  };

  private async performTokenRefresh(): Promise<void> {
    try {
      // Simulate API call for token refresh
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      this.safeSetState({
        lastRefreshTime: Date.now(),
        error: null
      } as unknown as Partial<ITokenRefreshExampleState>);

      console.log('Token refreshed successfully:', data);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';

      this.safeSetState({
        error: errorMessage
      } as unknown as Partial<ITokenRefreshExampleState>);

      console.error('Token refresh failed:', error);
    }
  }

  private handleManualStart = async (): Promise<void> => {
    await this.startTokenRefresh();
  };

  private handleManualStop = (): void => {
    this.stopTokenRefresh();
  };

  private formatLastRefreshTime = (): string => {
    if (!this.state.lastRefreshTime) return 'Never';

    const date = new Date(this.state.lastRefreshTime);
    return date.toLocaleTimeString();
  };

  protected override renderContent(): ReactNode {
    const { isActive, error } = this.state;

    return (
      <div className="token-refresh-example" data-testid="token-refresh-example">
        <h3>Token Refresh Manager Example</h3>

        <div className="status" data-testid="refresh-status">
          <p>Refresh Status: {isActive ? 'Active' : 'Inactive'}</p>
          <p>Last Refresh: {this.formatLastRefreshTime()}</p>
          {error && (
            <p className="error" style={{ color: 'red' }}>
              Error: {error}
            </p>
          )}
        </div>

        <div className="controls">
          <button
            onClick={this.handleManualStart}
            disabled={isActive}
            data-testid="start-button"
          >
            Start Token Refresh
          </button>

          <button
            onClick={this.handleManualStop}
            disabled={!isActive}
            data-testid="stop-button"
          >
            Stop Token Refresh
          </button>
        </div>

        <div className="info">
          <p>This example uses the class-based component pattern.</p>
          <p>Refresh interval: 5 minutes (for demo purposes).</p>
          <p>Check the console for refresh activity logs.</p>
        </div>
      </div>
    );
  }
}

export default TokenRefreshExample;
