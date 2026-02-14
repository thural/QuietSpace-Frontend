/**
 * Enterprise Token Refresh Hook Service
 * 
 * Class-based service that replaces the useTokenRefresh hook with enterprise patterns.
 * Provides the same API as useTokenRefresh but follows ContainerClassComponent inheritance for DI integration.
 */

import { useCallback, useEffect } from 'react';
import { ContainerClassComponent, IBaseComponentProps, IBaseComponentState } from '../components/base/BaseClassComponent';
import { createTokenRefreshManager, EnterpriseTokenRefreshManager } from '../services/TokenRefreshManager';
import { Container } from '@/core/modules/dependency-injection';

/**
 * Props interface for TokenRefreshHookService
 */
export interface ITokenRefreshHookServiceProps extends IBaseComponentProps {
  options?: {
    autoStart?: boolean;
    refreshInterval?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    enableMultiTabSync?: boolean;
    enableSecurityMonitoring?: boolean;
    onMetricsUpdate?: (metrics: any) => void;
    enableAdvancedRotation?: boolean;
    rotationStrategy?: 'eager' | 'lazy' | 'adaptive' | 'custom';
    rotationBuffer?: number;
    enableRefreshTokenRotation?: boolean;
  };
}

/**
 * State interface for TokenRefreshHookService
 */
export interface ITokenRefreshHookServiceState extends IBaseComponentState {
  isActive: boolean;
  isRefreshing: boolean;
  metrics: any;
  subscribers: Set<(state: ITokenRefreshHookServiceState>) => void>;
}

/**
 * Token Refresh Hook Service - Class-based service that provides useTokenRefresh functionality
 * 
 * This service maintains the same API as the original useTokenRefresh hook but follows
 * enterprise class-based patterns with proper lifecycle management and DI integration.
 */
export class TokenRefreshHookService extends ContainerClassComponent<ITokenRefreshHookServiceProps, ITokenRefreshHookServiceState> {
  protected container: Container;
  private tokenRefreshManager: EnterpriseTokenRefreshManager;
  private metricsInterval: number | null = null;
  private isActiveRef = { current: false };

  constructor(props: ITokenRefreshHookServiceProps) {
    // Create DI container for token refresh services
    const container = new Container();
    container.registerInstance('TokenRefreshManager', () => {
      const manager = createTokenRefreshManager();
      return manager;
    });
    
    super(props);
    this.container = container;
  }

  protected override getInitialState(): Partial<ITokenRefreshHookServiceState> {
    return {
      isActive: false,
      isRefreshing: false,
      metrics: null,
      subscribers: new Set()
    };
  }

  protected override onMount(): void {
    // Get enterprise token refresh manager
    this.tokenRefreshManager = this.getService('TokenRefreshManager');
    
    // Start automatic refresh if requested
    if (this.props.options?.autoStart) {
      this.startTokenRefresh();
    }
    
    // Start metrics monitoring if requested
    if (this.props.options?.onMetricsUpdate) {
      this.startMetricsMonitoring();
    }
  }

  protected override onUnmount(): void {
    // Cleanup all intervals and stop refresh
    this.stopTokenRefresh();
    this.stopMetricsMonitoring();
  }

  /**
   * Get current refresh state
   */
  public getRefreshState(): ITokenRefreshHookServiceState {
    return this.state;
  }

  /**
   * Subscribe to refresh state changes
   */
  public subscribe(callback: (state: ITokenRefreshHookServiceState) => void): () => void {
    this.state.subscribers.add(callback);
    return () => this.state.subscribers.delete(callback);
  }

  /**
   * Start automatic token refresh
   */
  public startTokenRefresh(): void {
    if (!this.tokenRefreshManager) {
      console.warn('Token refresh manager not initialized');
      return;
    }

    this.safeSetState({
      isActive: true,
      isRefreshing: true
    });
    this.notifySubscribers();

    try {
      this.tokenRefreshManager.startTokenAutoRefresh({
        refreshInterval: this.props.options?.refreshInterval || 30000,
        onSuccessFn: this.props.options?.onSuccess,
        onErrorFn: this.props.options?.onError,
        enableMultiTabSync: this.props.options?.enableMultiTabSync || false,
        enableSecurityMonitoring: this.props.options?.enableSecurityMonitoring || false,
        onMetricsUpdate: this.props.options?.onMetricsUpdate,
        enableAdvancedRotation: this.props.options?.enableAdvancedRotation || false,
        rotationStrategy: this.props.options?.rotationStrategy || 'adaptive',
        rotationBuffer: this.props.options?.rotationBuffer || 5 * 60 * 1000,
        enableRefreshTokenRotation: this.props.options?.enableRefreshTokenRotation || false
      });
      
      this.isActiveRef.current = true;
    } catch (error) {
      console.error('Failed to start token refresh:', error);
      this.safeSetState({
        isActive: false,
        isRefreshing: false
      });
      this.notifySubscribers();
      if (this.props.options?.onError) {
        this.props.options.onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  /**
   * Stop automatic token refresh
   */
  public stopTokenRefresh(): void {
    if (!this.tokenRefreshManager) {
      console.warn('Token refresh manager not initialized');
      return;
    }

    if (this.state.isActive) {
      this.tokenRefreshManager.stopTokenAutoRefresh();
      this.safeSetState({
        isActive: false,
        isRefreshing: false
      });
      this.isActiveRef.current = false;
      this.notifySubscribers();
    } else {
      console.warn('Token refresh not active');
    }
  }

  /**
   * Force immediate token rotation
   */
  public forceRotation = async (): Promise<boolean> => {
    if (!this.tokenRefreshManager) {
      console.warn('Token refresh manager not initialized');
      return false;
    }

    try {
      // This would need to be added to the EnterpriseTokenRefreshManager
      console.warn('Force rotation not implemented in base manager. Use advanced rotation.');
      return false;
    } catch (error) {
      console.error('Failed to force rotation:', error);
      if (this.props.options?.onError) {
        this.props.options.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }

  /**
   * Start metrics monitoring
   */
  public startMetricsMonitoring(): void {
    if (!this.tokenRefreshManager) {
      console.warn('Token refresh manager not initialized');
      return;
    }

    this.metricsIntervalRef.current = window.setInterval(() => {
      if (this.tokenRefreshManager) {
        const metrics = this.tokenRefreshManager.getMetrics();
        const status = this.tokenRefreshManager.getStatus();
        
        this.safeSetState({
          metrics: { ...metrics, ...status }
        });
        this.notifySubscribers();
      }
    }, this.props.options?.onMetricsUpdate || 30000);
  }

  /**
   * Stop metrics monitoring
   */
  public stopMetricsMonitoring(): void {
    if (this.metricsIntervalRef.current) {
      window.clearInterval(this.metricsIntervalRef.current);
      this.metricsIntervalRef.current = null;
    }
  }

  /**
   * Get current metrics
   */
  public getMetrics(): any {
    return this.state.metrics;
  }

  /**
   * Get current status
   */
  public getStatus(): any {
    if (!this.tokenRefreshManager) {
      return null;
    }
    return this.tokenRefreshManager.getStatus();
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(): void {
    const currentState = this.getRefreshState();
    this.state.subscribers.forEach(callback => {
      try {
        callback(currentState);
      } catch (error) {
        console.error('Error in token refresh hook service subscriber:', error);
      }
    });
  }

  protected override renderContent(): React.ReactNode {
    // Services don't render content
    return null;
  }
}

/**
 * Factory function to create a new TokenRefreshHookService instance
 */
export const createTokenRefreshHookService = (props: ITokenRefreshHookServiceProps = {}): TokenRefreshHookService => {
  return new TokenRefreshHookService(props);
};

export default TokenRefreshHookService;
