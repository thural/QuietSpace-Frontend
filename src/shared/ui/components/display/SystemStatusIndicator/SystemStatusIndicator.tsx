/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { ISystemStatusIndicatorProps, ISystemStatusIndicatorState, ISystemStatusItem } from './interfaces';
import {
  getStatusColor,
  getStatusText,
  createContainerStyles,
  createStatusDotStyles,
  createStatusCardStyles,
  createStatusListStyles,
  createLabelStyles,
  createDetailsStyles,
  createLastCheckedStyles
} from './styles';

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
   * Format date
   */
  private formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  /**
   * Render dots variant
   */
  private renderDots = (): React.ReactNode => {
    const { items, size = 'md', showLabels = true } = this.props;

    return (
      <div css={createContainerStyles('dots', 'horizontal', size)}>
        {items.map((item) => (
          <div
            key={item.id}
            css={css`
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                
                &:hover {
                    opacity: 0.8;
                }
            `}
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleItemClick(item);
              }
            }}
          >
            <div css={createStatusDotStyles(item.status, size)} />
            {showLabels && (
              <span css={createLabelStyles(size, showLabels)}>
                {item.label}
              </span>
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
    const { items, size = 'md', showLabels = true, showDetails = true, showLastChecked = true } = this.props;

    return (
      <div css={createContainerStyles('cards', 'horizontal', size)}>
        {items.map((item) => (
          <div
            key={item.id}
            css={createStatusCardStyles(item.status, size)}
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleItemClick(item);
              }
            }}
          >
            <div className="status-dot" />
            <div>
              {showLabels && (
                <div className="status-label">{item.label}</div>
              )}
              <div className="status-text">{getStatusText(item.status)}</div>
              {showDetails && item.details && (
                <div css={createDetailsStyles(size, showDetails)}>
                  {item.details}
                </div>
              )}
              {showLastChecked && item.lastChecked && (
                <div css={createLastCheckedStyles(size, showLastChecked)}>
                  Last checked: {this.formatDate(item.lastChecked)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render list variant
   */
  private renderList = (): React.ReactNode => {
    const { items, size = 'md', showDetails = true, showLastChecked = true } = this.props;

    return (
      <div css={css`
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        `}>
        {items.map((item) => (
          <div
            key={item.id}
            css={createStatusListStyles(size)}
            onClick={() => this.handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleItemClick(item);
              }
            }}
          >
            <div className="status-left">
              <div className="status-indicator">
                <div
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                />
                <span className="status-label">{item.label}</span>
              </div>
              {showDetails && item.details && (
                <div className="status-details">{item.details}</div>
              )}
            </div>
            <div className="status-right">
              <span>{getStatusText(item.status)}</span>
              {showLastChecked && item.lastChecked && (
                <span>{this.formatDate(item.lastChecked)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render refresh button
   */
  private renderRefreshButton = (): React.ReactNode => {
    const { onRefresh } = this.props;
    const { isRefreshing } = this.state;

    if (!onRefresh) return null;

    return (
      <button
        css={css`
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            color: #374151;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            
            &:hover {
                background-color: #e5e7eb;
                border-color: #9ca3af;
            }
            
            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `}
        onClick={this.handleRefresh}
        disabled={isRefreshing}
      >
        <span css={css`
            transition: transform 0.5s;
            
            ${isRefreshing && css`
                animation: spin 1s linear infinite;
            `}
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}>
          🔄
        </span>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    );
  };

  protected override renderContent(): React.ReactNode {
    const {
      variant = 'dots',
      orientation = 'horizontal',
      size = 'md',
      compact = false,
      className = '',
      testId
    } = this.props;
    const { isRefreshing } = this.state;

    const containerStyles = createContainerStyles(variant, orientation, size, compact, className);

    return (
      <div css={containerStyles} data-testid={testId}>
        {/* Status indicators */}
        {variant === 'dots' && this.renderDots()}
        {variant === 'cards' && this.renderCards()}
        {variant === 'list' && this.renderList()}

        {/* Refresh button */}
        {this.renderRefreshButton()}

        {/* Refreshing overlay */}
        {isRefreshing && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div css={css`
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background-color: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            `}>
              <div css={css`
                  width: 1.5rem;
                  height: 1.5rem;
                  border: 2px solid #e5e7eb;
                  border-top: 2px solid #3b82f6;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
              `} />
              <span>Refreshing status...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SystemStatusIndicator;
