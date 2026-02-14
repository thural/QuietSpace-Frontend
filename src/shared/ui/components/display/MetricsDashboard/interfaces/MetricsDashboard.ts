/**
 * Metrics Dashboard Component Interfaces
 * 
 * Type definitions for the Metrics Dashboard component with sections and metrics.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { IMetricCardProps } from "../../MetricCard/interfaces";

/**
 * Dashboard Metric interface
 */
export interface IDashboardMetric extends Omit<IMetricCardProps, 'onClick'> {
  id: string;
  onClick?: (metric: IDashboardMetric) => void;
}

/**
 * Dashboard Section interface
 */
export interface IDashboardSection {
  id: string;
  title: string;
  description?: string;
  metrics: IDashboardMetric[];
  columns?: number;
}

/**
 * Metrics Dashboard Props
 */
export interface IMetricsDashboardProps extends IBaseComponentProps {
  sections: IDashboardSection[];
  loading?: boolean;
  error?: string;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  gridColumns?: number;
  showSectionHeaders?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
  onMetricClick?: (metric: IDashboardMetric) => void;
  className?: string;
}

/**
 * Metrics Dashboard State
 */
export interface IMetricsDashboardState extends IBaseComponentState {
  isRefreshing: boolean;
  lastRefreshTime?: Date;
}
