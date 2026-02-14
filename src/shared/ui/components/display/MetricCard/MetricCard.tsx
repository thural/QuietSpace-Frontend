/**
 * Metric Card Component
 * 
 * A reusable metric display component with labels, values, and change indicators.
 * Provides flexible metric visualization with various styling options.
 */

import React from 'react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { IMetricCardProps, IMetricCardState } from './interfaces';
import {
  getChangeColor,
  getTrendIcon,
  getCardStyles,
  getValueStyles,
  getLabelStyles,
  createLoadingStyles,
  createErrorStyles
} from './styles';

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
   * Render loading state
   */
  private renderLoading = (): React.ReactNode => {
    return (
      <div css={createLoadingStyles()}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  /**
   * Render error state
   */
  protected override renderError = (): React.ReactNode => {
    const { error } = this.props;

    return (
      <div css={createErrorStyles()}>
        <div>Error</div>
        {error && <div className="error-message">{error}</div>}
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
        <div className={`flex items-center space-x-1 ${getChangeColor(change.type)}`}>
          {trend && <span className="text-xs">{getTrendIcon(trend)}</span>}
          <span className="text-sm font-medium">{change.value}</span>
        </div>
      );
    }

    if (trend) {
      return (
        <div className="text-gray-500">
          <span className="text-sm">{getTrendIcon(trend)}</span>
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
          <div className={`text-gray-600 ${getLabelStyles(this.props.size || 'md')}`}>
            {label}
          </div>
          {icon && <span className="text-lg">{icon}</span>}
        </div>

        {/* Value */}
        <div className={getValueStyles(this.props.size || 'md')}>
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
          <div className={`text-sm font-medium ${getChangeColor(change.type)}`}>
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
    const { label, value, icon, description } = this.props;

    return (
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              <div className={`text-gray-600 ${getLabelStyles(this.props.size || 'md')}`}>
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
        <div className={`${getValueStyles(this.props.size || 'md')} text-gray-900`}>
          {value}
        </div>

        {/* Change with trend */}
        {this.renderChange()}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { loading = false, error, variant = 'default', onClick } = this.props;
    const { isHovered } = this.state;

    const cardContent = (
      <div
        className={getCardStyles(
          variant,
          this.props.size || 'md',
          this.props.color || 'blue',
          onClick,
          isHovered,
          this.props.className || ''
        )}
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
