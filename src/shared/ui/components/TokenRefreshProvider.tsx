import React, { useEffect, useRef, useCallback, PureComponent, ReactNode } from 'react';
import { createTokenRefreshManager, EnterpriseTokenRefreshManager } from '@/core/auth/services/TokenRefreshManager';

interface ITokenRefreshProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  refreshInterval?: number;
  onTokenRefresh?: (data: unknown) => void;
  onRefreshError?: (error: Error) => void;
  // Enterprise features
  enableMultiTabSync?: boolean;
  enableSecurityMonitoring?: boolean;
  onMetricsUpdate?: (metrics: any) => void;
}

/**
 * Enterprise Token Refresh Provider Component
 * 
 * An enterprise-grade React component that uses the EnterpriseTokenRefreshManager
 * to handle automatic token refresh for child components with advanced features.
 * 
 * This provides enterprise-grade token management with:
 * - Multi-tab synchronization
 * - Security monitoring and analytics
 * - Circuit breaker pattern for reliability
 * - Performance metrics and monitoring
 * - Intelligent retry logic with exponential backoff
 */
class TokenRefreshProvider extends PureComponent<ITokenRefreshProviderProps> {
  private managerRef = useRef<EnterpriseTokenRefreshManager | null>(null);
  private isActiveRef = useRef(false);
  private metricsIntervalRef = useRef<number | null>(null);

  override componentDidMount(): void {
    const { enabled = true } = this.props;

    if (enabled) {
      this.startTokenRefresh();
    }
  }

  override componentDidUpdate(prevProps: ITokenRefreshProviderProps): void {
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

  override componentWillUnmount(): void {
    this.stopTokenRefresh();
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

    if (!enabled || this.isActiveRef.current) return;

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
          onRefreshError?.(error);
          // Enterprise manager handles circuit breaker automatically
        },
        enableMultiTabSync,
        enableSecurityMonitoring
      });

      this.isActiveRef.current = true;

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
    if (this.managerRef.current && this.isActiveRef.current) {
      this.managerRef.current.stopTokenAutoRefresh();
      this.isActiveRef.current = false;
    }

    // Clear metrics interval
    if (this.metricsIntervalRef.current) {
      window.clearInterval(this.metricsIntervalRef.current);
      this.metricsIntervalRef.current = null;
    }
  };

  override render(): ReactNode {
    const { children } = this.props;

    // Provide context for manual control if needed
    const contextValue = {
      startTokenRefresh: this.startTokenRefresh,
      stopTokenRefresh: this.stopTokenRefresh,
      isActive: this.isActiveRef.current,
      getMetrics: () => this.managerRef.current?.getMetrics(),
      getStatus: () => this.managerRef.current?.getStatus()
    };

    return (
      <>
        {children}
      </>
    );
  }
}

export default TokenRefreshProvider;
