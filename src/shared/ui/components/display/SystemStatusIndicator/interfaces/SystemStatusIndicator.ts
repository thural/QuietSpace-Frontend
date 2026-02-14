/**
 * System Status Indicator Component Interfaces
 * 
 * Type definitions for the System Status Indicator component with various status types.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * System Status type
 */
export type SystemStatusType = 'healthy' | 'degraded' | 'down' | 'unknown';

/**
 * System Status Item interface
 */
export interface ISystemStatusItem {
  id: string;
  label: string;
  status: SystemStatusType;
  lastChecked?: Date;
  details?: string;
}

/**
 * System Status Indicator Props
 */
export interface ISystemStatusIndicatorProps extends IBaseComponentProps {
  items: ISystemStatusItem[];
  variant?: 'dots' | 'cards' | 'list';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showDetails?: boolean;
  showLastChecked?: boolean;
  compact?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onItemClick?: (item: ISystemStatusItem) => void;
  refreshInterval?: number;
  onRefresh?: () => void;
}

/**
 * System Status Indicator State
 */
export interface ISystemStatusIndicatorState extends IBaseComponentState {
  lastRefresh: Date | null;
  isRefreshing: boolean;
}
