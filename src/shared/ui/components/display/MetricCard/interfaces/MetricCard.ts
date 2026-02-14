/**
 * Metric Card Component Interfaces
 * 
 * Type definitions for the Metric Card component with various variants and sizes.
 */

import { IBaseComponentProps, IBaseComponentState } from "../../../../../components/base/BaseClassComponent";

/**
 * Metric Change interface
 */
export interface IMetricChange {
  value: string;
  type: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
}

/**
 * Metric Card Props
 */
export interface IMetricCardProps extends IBaseComponentProps {
  label: string;
  value: string | number;
  change?: IMetricChange;
  icon?: string;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  loading?: boolean;
  error?: string;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  onClick?: () => void;
  className?: string;
}

/**
 * Metric Card State
 */
export interface IMetricCardState extends IBaseComponentState {
  isHovered: boolean;
}
