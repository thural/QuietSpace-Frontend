/**
 * TokenRefreshProvider Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';
import { EnterpriseTokenRefreshManager } from '@/core/auth/services/TokenRefreshManager';

/**
 * TokenRefreshProvider Props
 */
export interface ITokenRefreshProviderProps extends IBaseComponentProps {
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
 * TokenRefreshProvider State
 */
export interface ITokenRefreshProviderState extends IBaseComponentState {
  isActive: boolean;
  manager: EnterpriseTokenRefreshManager | null;
}
