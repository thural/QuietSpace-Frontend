/**
 * System Status Indicator Component
 * 
 * A reusable system health display component with color-coded indicators
 * and flexible status visualization for monitoring systems.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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

/**
 * System Status Indicator Component
 * 
 * Provides system status display with:
 * - Multiple visualization variants (dots, cards, list)
 * - Color-coded status indicators
 * - Real-time refresh capabilities
 * - Detailed status information
 * - Click interactions and accessibility
 * - Responsive design and animations
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class SystemStatusIndicator extends BaseClassComponent<ISystemStatusIndicatorProps, ISystemStatusIndicatorState> {
  private refreshTimer: number | null = null;

  protected override getInitialState(): Partial<ISystemStatusIndicatorState> {
    return {
      lastRefresh: new Date(),
      isRefreshing: false
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.startRefreshTimer();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopRefreshTimer();
  }

  /**
   * Start refresh timer
   */
  private startRefreshTimer = (): void => {
    const { refreshInterval } = this.props;

    if (refreshInterval && refreshInterval > 0) {
      this.refreshTimer = window.setInterval(() => {
        this.handleRefresh();
      }, refreshInterval);
    }
  };

  /**
   * Stop refresh timer
   */
  private stopRefreshTimer = (): void => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  };

  /**
   * Handle refresh
   */
  private handleRefresh = (): void => {
    const { onRefresh } = this.props;

    this.safeSetState({ isRefreshing: true });

    if (onRefresh) {
      onRefresh();
    }

    setTimeout(() => {
      this.safeSetState({ 
        isRefreshing: false,
        lastRefresh: new Date()
      });
    }, 1000);
  };

  /**
   * Handle item click
   */
  private handleItemClick = (item: ISystemStatusItem): void => {
    const { onItemClick } = this.props;

    if (onItemClick) {
      onItemClick(item);
    }
  };

  /**
   * Get status color
   */
  private getStatusColor = (status: SystemStatusType): string => {
    const colors = {
      healthy: 'bg-green-500',
      degraded: 'bg-yellow-500',
      down: 'bg-red-500',
      unknown: 'bg-gray-500'
    };

    return colors[status] || colors.unknown;
  };

  /**
   * Get status text color
   */
  private getStatusTextColor = (status: SystemStatusType): string => {
    const colors = {
      healthy: 'text-green-600',
      degraded: 'text-yellow-600',
      down: 'text-red-600',
      unknown: 'text-gray-600'
    };

    return colors[status] || colors.unknown;
  };

  /**
   * Get status icon
   */
  private getStatusIcon = (status: SystemStatusType): string => {
    const icons = {
      healthy: '✅',
      degraded: '⚠️',
      down: '❌',
      unknown: '❓'
    };

    return icons[status] || icons.unknown;
  };

  /**
   * Get container styles
   */
  private getContainerStyles = (): string => {
    const { variant = 'dots', orientation = 'horizontal', compact = false, className = '' } = this.props;

    const baseStyles = 'flex items-center';
    const orientationStyles = orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-4';
    const variantStyles = variant === 'cards' ? 'space-y-2' : '';
    const compactStyles = compact ? 'space-x-2' : '';

    return `${baseStyles} ${orientationStyles} ${variantStyles} ${compactStyles} ${className}`;
  };

  /**
   * Render dots variant
   */
  private renderDots = (): React.ReactNode => {
    const { items, size = 'md', showLabels = true } = this.props;

    const sizeStyles = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };

    return (
      <div className={this.getContainerStyles()}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2"
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && this.handleItemClick(item)}
          >
            <div
              className={`${sizeStyles[size]} rounded-full ${this.getStatusColor(item.status)} animate-pulse`}
              title={`${item.label}: ${item.status}`}
            />
            {showLabels && (
              <span className="text-xs text-gray-600">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render cards variant
   */
  private renderCards = (): React.ReactNode => {
    const { items, showDetails = false, showLastChecked = false } = this.props;

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && this.handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${this.getStatusColor(item.status)}`} />
                <span className="font-medium text-gray-900">{item.label}</span>
                <span className={`text-sm ${this.getStatusTextColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{this.getStatusIcon(item.status)}</span>
              </div>
            </div>
            
            {showDetails && item.details && (
              <div className="mt-2 text-xs text-gray-500">
                {item.details}
              </div>
            )}
            
            {showLastChecked && item.lastChecked && (
              <div className="mt-2 text-xs text-gray-400">
                Last checked: {item.lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render list variant
   */
  private renderList = (): React.ReactNode => {
    const { items, showLabels = true, showDetails = false, showLastChecked = false } = this.props;

    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && this.handleItemClick(item)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${this.getStatusColor(item.status)}`} />
                {showLabels && (
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                )}
              </div>
              <span className={`text-xs ${this.getStatusTextColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {showDetails && item.details && (
                <span className="text-xs text-gray-500">{item.details}</span>
              )}
              {showLastChecked && item.lastChecked && (
                <span className="text-xs text-gray-400">
                  {item.lastChecked.toLocaleTimeString()}
                </span>
              )}
              <span className="text-sm">{this.getStatusIcon(item.status)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render refresh indicator
   */
  private renderRefreshIndicator = (): React.ReactNode => {
    const { refreshInterval, onRefresh } = this.props;
    const { isRefreshing, lastRefresh } = this.state;

    if (!refreshInterval || !onRefresh) {
      return null;
    }

    return (
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
        <span>
          {isRefreshing ? 'Refreshing...' : `Last: ${lastRefresh?.toLocaleTimeString()}`}
        </span>
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { variant = 'dots', items } = this.props;

    if (items.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <div className="text-sm">No system status items</div>
        </div>
      );
    }

    return (
      <div className="system-status-indicator">
        {/* Status Display */}
        {variant === 'dots' && this.renderDots()}
        {variant === 'cards' && this.renderCards()}
        {variant === 'list' && this.renderList()}

        {/* Refresh Indicator */}
        {this.renderRefreshIndicator()}
      </div>
    );
  }
}

export default SystemStatusIndicator;
