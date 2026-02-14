/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { useEffect, useRef, useCallback } from 'react';
import { tokenRefreshProviderStyles } from './styles';
import { ITokenRefreshProviderProps, ITokenRefreshProviderState } from './interfaces';
import { createTokenRefreshManager, EnterpriseTokenRefreshManager } from '@/core/auth/services/TokenRefreshManager';

/**
 * Enterprise Token Refresh Provider Component
 * 
 * An enterprise-grade React component that uses EnterpriseTokenRefreshManager
 * to handle automatic token refresh for child components with advanced features.
 * 
 * This provides enterprise-grade token management with:
 * - Multi-tab synchronization
 * - Security monitoring and analytics
 * - Circuit breaker pattern for reliability
 * - Performance metrics and monitoring
 * - Intelligent retry logic with exponential backoff
 * 
 * @example
 * ```tsx
 * <TokenRefreshProvider 
 *   enabled={true}
 *   refreshInterval={300000}
 *   onTokenRefresh={handleRefresh}
 * >
 *   <App />
 * </TokenRefreshProvider>
 * ```
 */
export class TokenRefreshProvider extends BaseClassComponent<ITokenRefreshProviderProps, ITokenRefreshProviderState> {
  private managerRef = useRef<EnterpriseTokenRefreshManager | null>(null);
  private metricsIntervalRef = useRef<number | null>(null);

  protected override getInitialState(): Partial<ITokenRefreshProviderState> {
    return {
      isActive: false,
      manager: null
    };
  }

  /**
   * Start token refresh process
   */
  private startTokenRefresh = (): void => {
    const {
      enabled = true,
      refreshInterval = 540000, // 9 minutes default
      onTokenRefresh,
      onRefreshError,
      enableMultiTabSync = true,
      enableSecurityMonitoring = true,
      onMetricsUpdate
    } = this.props;

    if (!enabled || this.state.isActive) return;

    try {
      // Create enterprise manager instance
      this.managerRef.current = createTokenRefreshManager();

      // Start automatic refresh with enterprise features
      this.managerRef.current.startTokenAutoRefresh({
        refreshInterval,
        onSuccessFn: (data) => {
          onTokenRefresh?.(data);
        },
        onErrorFn: (error) => {
          onRefreshError?.(error instanceof Error ? error : new Error(String(error)));
          // Enterprise manager handles circuit breaker automatically
        },
        enableMultiTabSync,
        enableSecurityMonitoring
      });

      this.setState({ isActive: true });

      // Start metrics monitoring if callback provided
      if (onMetricsUpdate) {
        this.metricsIntervalRef.current = window.setInterval(() => {
          if (this.managerRef.current) {
            const metrics = this.managerRef.current.getMetrics();
            const status = this.managerRef.current.getStatus();
            onMetricsUpdate({ ...metrics, ...status });
          }
        }, 30000); // Update metrics every 30 seconds
      }

    } catch (error) {
      onRefreshError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Stop token refresh process
   */
  private stopTokenRefresh = (): void => {
    if (this.managerRef.current && this.state.isActive) {
      this.managerRef.current.stopTokenAutoRefresh();
      this.setState({ isActive: false });
    }

    // Clear metrics interval
    if (this.metricsIntervalRef.current) {
      window.clearInterval(this.metricsIntervalRef.current);
      this.metricsIntervalRef.current = null;
    }
  };

  /**
   * Handle component mount
   */
  protected override componentDidMount(): void {
    const { enabled = true } = this.props;

    if (enabled) {
      this.startTokenRefresh();
    }
  }

  /**
   * Handle component updates
   */
  protected override componentDidUpdate(prevProps: ITokenRefreshProviderProps): void {
    const { enabled = true } = this.props;
    const { enabled: prevEnabled = true } = prevProps;

    if (enabled !== prevEnabled) {
      if (enabled) {
        this.startTokenRefresh();
      } else {
        this.stopTokenRefresh();
      }
    }
  }

  /**
   * Handle component unmount
   */
  protected override componentWillUnmount(): void {
    this.stopTokenRefresh();
  }

  protected override renderContent(): React.ReactNode {
    const { children } = this.props;

    // Provide context for manual control if needed
    const contextValue = {
      startTokenRefresh: this.startTokenRefresh,
      stopTokenRefresh: this.stopTokenRefresh,
      isActive: this.state.isActive,
      getMetrics: () => this.managerRef.current?.getMetrics(),
      getStatus: () => this.managerRef.current?.getStatus()
    };

    return (
      <div css={tokenRefreshProviderStyles}>
        {children}
      </div>
    );
  }
}
