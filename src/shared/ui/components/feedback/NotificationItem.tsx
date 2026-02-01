/**
 * Notification Item Component
 * 
 * A reusable notification display component with actions and metadata.
 * Provides flexible notification rendering for alerts and messaging features.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Notification Type
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'follow' | 'mention' | 'comment' | 'like';

/**
 * Notification Priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification Item Props
 */
export interface INotificationItemProps extends IBaseComponentProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  priority?: NotificationPriority;
  author?: {
    name: string;
    username?: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  actions?: Array<{
    id: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  className?: string;
}

/**
 * Notification Item State
 */
export interface INotificationItemState extends IBaseComponentState {
  isHovered: boolean;
  isExpanded: boolean;
}

/**
 * Notification Item Component
 * 
 * Provides notification display with:
 * - Multiple notification types and priorities
 * - Action buttons and interactive elements
 * - Read/unread state management
 * - Author information and avatars
 * - Timestamp and metadata display
 * - Multiple variants (default, compact, detailed)
 * - Click interactions and hover effects
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class NotificationItem extends BaseClassComponent<INotificationItemProps, INotificationItemState> {
  
  protected override getInitialState(): Partial<INotificationItemState> {
    return {
      isHovered: false,
      isExpanded: false
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
    const { onClick, onMarkAsRead, id, read } = this.props;

    if (onClick) {
      onClick();
    }

    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  /**
   * Handle mark as read
   */
  private handleMarkAsRead = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const { onMarkAsRead, id } = this.props;

    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  /**
   * Handle delete
   */
  private handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const { onDelete, id } = this.props;

    if (onDelete) {
      onDelete(id);
    }
  };

  /**
   * Handle action click
   */
  private handleActionClick = (action: { id: string; onClick: () => void }, e: React.MouseEvent): void => {
    e.stopPropagation();
    action.onClick();
  };

  /**
   * Toggle expanded state
   */
  private toggleExpanded = (): void => {
    this.safeSetState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  /**
   * Get notification icon
   */
  private getNotificationIcon = (type: NotificationType): string => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      follow: '👤',
      mention: '@',
      comment: '💬',
      like: '❤️'
    };

    return icons[type] || icons.info;
  };

  /**
   * Get priority color
   */
  private getPriorityColor = (priority: NotificationPriority): string => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };

    return colors[priority] || colors.medium;
  };

  /**
   * Get container styles
   */
  private getContainerStyles = (): string => {
    const { read = false, variant = 'default', onClick, className = '' } = this.props;
    const { isHovered } = this.state;

    const baseStyles = 'border rounded-lg transition-all duration-200';
    const readStyles = read ? 'bg-white' : 'bg-blue-50';
    const hoverStyles = isHovered ? 'shadow-md' : 'shadow-sm';
    const interactionStyles = onClick ? 'cursor-pointer' : '';
    const variantStyles = variant === 'compact' ? 'p-3' : 'p-4';

    return `${baseStyles} ${readStyles} ${hoverStyles} ${interactionStyles} ${variantStyles} ${className}`;
  };

  /**
   * Get action button styles
   */
  private getActionButtonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'primary'): string => {
    const styles = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    return `${styles[variant]} px-3 py-1 rounded text-sm font-medium transition-colors`;
  };

  /**
   * Render default variant
   */
  private renderDefault = (): React.ReactNode => {
    const { type, title, message, timestamp, priority = 'medium', author, actions = [], showActions = true } = this.props;
    const { isExpanded } = this.state;

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <span className="text-lg mt-1">{this.getNotificationIcon(type)}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{title}</h4>
              <p className="text-gray-600 text-sm mt-1">{message}</p>
              
              {/* Author */}
              {author && (
                <div className="flex items-center space-x-2 mt-2">
                  {author.avatar && (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-xs text-gray-500">
                    By {author.name}
                    {author.username && ` (@${author.username})`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Timestamp and Priority */}
          <div className="flex flex-col items-end space-y-2">
            <span className="text-xs text-gray-500">
              {this.formatTimestamp(timestamp)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${this.getPriorityColor(priority)}`}>
              {priority}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && actions.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex space-x-2">
              {actions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  onClick={(e) => this.handleActionClick(action, e)}
                  className={this.getActionButtonStyles(action.variant)}
                >
                  {action.label}
                </button>
              ))}
            </div>
            
            {/* Expand/Collapse */}
            {message.length > 100 && (
              <button
                onClick={this.toggleExpanded}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render compact variant
   */
  private renderCompact = (): React.ReactNode => {
    const { type, title, timestamp, priority = 'medium', author } = this.props;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-lg">{this.getNotificationIcon(type)}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{title}</div>
            {author && (
              <div className="text-xs text-gray-500">
                {author.name}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${this.getPriorityColor(priority)}`}>
            {priority}
          </span>
          <span className="text-xs text-gray-500">
            {this.formatTimestamp(timestamp, true)}
          </span>
        </div>
      </div>
    );
  };

  /**
   * Render detailed variant
   */
  private renderDetailed = (): React.ReactNode => {
    const { type, title, message, timestamp, priority = 'medium', author, metadata, actions = [], showActions = true } = this.props;

    return (
      <div className="space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-start space-x-4">
          <div className="text-2xl">{this.getNotificationIcon(type)}</div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            <p className="text-gray-600 mt-1">{message}</p>
          </div>
        </div>

        {/* Author and metadata */}
        {(author || metadata) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            {author && (
              <div className="flex items-center space-x-3 mb-2">
                {author.avatar && (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{author.name}</div>
                  {author.username && (
                    <div className="text-xs text-gray-500">@{author.username}</div>
                  )}
                </div>
              </div>
            )}
            
            {metadata && Object.entries(metadata).length > 0 && (
              <div className="text-xs text-gray-500 space-y-1">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer with timestamp, priority, and actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {this.formatTimestamp(timestamp)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${this.getPriorityColor(priority)}`}>
              {priority}
            </span>
          </div>
          
          {showActions && actions.length > 0 && (
            <div className="flex space-x-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={(e) => this.handleActionClick(action, e)}
                  className={this.getActionButtonStyles(action.variant)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Format timestamp
   */
  private formatTimestamp = (timestamp: Date, compact = false): string => {
    if (compact) {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      
      return timestamp.toLocaleDateString();
    }

    return timestamp.toLocaleString();
  };

  protected override renderContent(): React.ReactNode {
    const { read = false, variant = 'default', onMarkAsRead, onDelete } = this.props;

    return (
      <div
        className={this.getContainerStyles()}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && this.handleClick()}
      >
        {/* Unread indicator */}
        {!read && (
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full" />
        )}

        {/* Content based on variant */}
        {variant === 'default' && this.renderDefault()}
        {variant === 'compact' && this.renderCompact()}
        {variant === 'detailed' && this.renderDetailed()}

        {/* Quick actions */}
        <div className="flex space-x-2 ml-4">
          {!read && onMarkAsRead && (
            <button
              onClick={this.handleMarkAsRead}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Mark Read
            </button>
          )}
          {onDelete && (
            <button
              onClick={this.handleDelete}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default NotificationItem;
