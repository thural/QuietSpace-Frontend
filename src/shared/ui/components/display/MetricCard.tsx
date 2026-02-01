/**
 * Metric Card Component
 * 
 * A reusable metric display component with labels, values, and change indicators.
 * Provides flexible metric visualization with various styling options.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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

/**
 * Metric Card Component
 * 
 * Provides metric display with:
 * - Flexible value and change indicators
 * - Multiple variants (default, compact, detailed)
 * - Color-coded change indicators
 * - Loading and error states
 * - Click interactions and hover effects
 * - Responsive design and accessibility
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class MetricCard extends BaseClassComponent<IMetricCardProps, IMetricCardState> {
  
  protected override getInitialState(): Partial<IMetricCardState> {
    return {
      isHovered: false
    };
  }

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (): void => {
    this.safeSetState({ isHovered: true });
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (): void => {
    this.safeSetState({ isHovered: false });
  };

  /**
   * Handle click
   */
  private handleClick = (): void => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  /**
   * Get change color based on type
   */
  private getChangeColor = (type: IMetricChange['type']): string => {
    const colors = {
      increase: 'text-green-600',
      decrease: 'text-red-600',
      neutral: 'text-gray-600'
    };

    return colors[type];
  };

  /**
   * Get trend icon
   */
  private getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };

    return icons[trend];
  };

  /**
   * Get card styles based on variant and size
   */
  private getCardStyles = (): string => {
    const { variant = 'default', size = 'md', color = 'blue', onClick, className = '' } = this.props;
    const { isHovered } = this.state;

    const baseStyles = 'bg-white rounded-lg shadow transition-all duration-200';
    
    const sizeStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    const colorStyles = {
      blue: 'border-l-4 border-blue-500',
      green: 'border-l-4 border-green-500',
      red: 'border-l-4 border-red-500',
      yellow: 'border-l-4 border-yellow-500',
      purple: 'border-l-4 border-purple-500',
      gray: 'border-l-4 border-gray-500'
    };

    const interactionStyles = onClick
      ? isHovered ? 'shadow-lg cursor-pointer transform scale-105' : 'cursor-pointer'
      : '';

    const variantStyles = variant === 'compact' ? 'border-l-0' : '';

    return `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]} ${interactionStyles} ${variantStyles} ${className}`;
  };

  /**
   * Get value styles based on size
   */
  private getValueStyles = (): string => {
    const { size = 'md' } = this.props;

    const styles = {
      sm: 'text-lg font-bold',
      md: 'text-2xl font-bold',
      lg: 'text-3xl font-bold'
    };

    return styles[size];
  };

  /**
   * Get label styles based on size
   */
  private getLabelStyles = (): string => {
    const { size = 'md' } = this.props;

    const styles = {
      sm: 'text-xs font-medium',
      md: 'text-sm font-medium',
      lg: 'text-base font-medium'
    };

    return styles[size];
  };

  /**
   * Render loading state
   */
  private renderLoading = (): React.ReactNode => {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  /**
   * Render error state
   */
  private renderError = (): React.ReactNode => {
    const { error } = this.props;

    return (
      <div className="text-center py-4">
        <div className="text-red-500 text-sm">Error</div>
        {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
      </div>
    );
  };

  /**
   * Render change indicator
   */
  private renderChange = (): React.ReactNode => {
    const { change, trend } = this.props;

    if (!change && !trend) {
      return null;
    }

    if (change) {
      return (
        <div className={`flex items-center space-x-1 ${this.getChangeColor(change.type)}`}>
          {trend && <span className="text-xs">{this.getTrendIcon(trend)}</span>}
          <span className="text-sm font-medium">{change.value}</span>
        </div>
      );
    }

    if (trend) {
      return (
        <div className="text-gray-500">
          <span className="text-sm">{this.getTrendIcon(trend)}</span>
        </div>
      );
    }

    return null;
  };

  /**
   * Render default variant
   */
  private renderDefault = (): React.ReactNode => {
    const { label, value, icon, description } = this.props;

    return (
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className={`text-gray-600 ${this.getLabelStyles()}`}>
            {label}
          </div>
          {icon && <span className="text-lg">{icon}</span>}
        </div>

        {/* Value */}
        <div className={this.getValueStyles()}>
          {value}
        </div>

        {/* Change */}
        {this.renderChange()}

        {/* Description */}
        {description && (
          <div className="text-xs text-gray-500 mt-2">
            {description}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render compact variant
   */
  private renderCompact = (): React.ReactNode => {
    const { label, value, change, icon } = this.props;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-lg">{icon}</span>}
          <div>
            <div className={`text-gray-600 text-xs font-medium`}>
              {label}
            </div>
            <div className="text-lg font-bold">
              {value}
            </div>
          </div>
        </div>
        {change && (
          <div className={`text-sm font-medium ${this.getChangeColor(change.type)}`}>
            {change.value}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render detailed variant
   */
  private renderDetailed = (): React.ReactNode => {
    const { label, value, change, icon, description } = this.props;

    return (
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              <div className={`text-gray-600 ${this.getLabelStyles()}`}>
                {label}
              </div>
              {description && (
                <div className="text-xs text-gray-500 mt-1">
                  {description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Value */}
        <div className={`${this.getValueStyles()} text-gray-900`}>
          {value}
        </div>

        {/* Change with trend */}
        {this.renderChange()}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { loading = false, error, variant = 'default', onClick } = this.props;

    const cardContent = (
      <div
        className={this.getCardStyles()}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        {/* Loading State */}
        {loading && this.renderLoading()}

        {/* Error State */}
        {error && !loading && this.renderError()}

        {/* Normal State */}
        {!loading && !error && (
          <>
            {variant === 'default' && this.renderDefault()}
            {variant === 'compact' && this.renderCompact()}
            {variant === 'detailed' && this.renderDetailed()}
          </>
        )}
      </div>
    );

    return cardContent;
  }
}

export default MetricCard;
