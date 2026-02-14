/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { notificationItemContainerStyles } from './styles';
import { 
  INotificationItemProps, 
  INotificationItemState,
  NotificationType,
  NotificationPriority
} from './interfaces';

/**
 * Enterprise NotificationItem Component
 * 
 * A comprehensive notification display component with actions and metadata.
 * Provides flexible notification rendering for alerts and messaging features.
 * 
 * @example
 * ```tsx
 * <NotificationItem 
 *   id="notif-1"
 *   type="info"
 *   title="New Message"
 *   message="You have a new message from John"
 *   timestamp={new Date()}
 *   read={false}
 * />
 * ```
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
   * Format timestamp
   */
  private formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  protected override renderContent(): React.ReactNode {
    const { 
      id,
      type,
      title,
      message,
      timestamp,
      read = false,
      priority = 'medium',
      author,
      metadata,
      actions,
      variant = 'default',
      showActions = true,
      className = ''
    } = this.props;
    const { isHovered, isExpanded } = this.state;

    return (
      <div 
        css={notificationItemContainerStyles}
        className={`notification-item ${variant} ${!read ? 'unread' : ''} ${className}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Notification: ${title}`}
      >
        {/* Notification Icon */}
        <div className={`notification-icon ${type}`}>
          {this.getNotificationIcon(type)}
        </div>

        {/* Notification Content */}
        <div className="notification-content">
          {/* Header */}
          <div className="notification-header">
            <h4 className="notification-title">{title}</h4>
            <span className="notification-timestamp">
              {this.formatTimestamp(timestamp)}
            </span>
          </div>

          {/* Author */}
          {author && (
            <div className="notification-author">
              {author.avatar && (
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="author-avatar"
                />
              )}
              <span className="author-name">{author.name}</span>
            </div>
          )}

          {/* Message */}
          <div className="notification-message">
            {message}
          </div>

          {/* Actions */}
          {showActions && actions && actions.length > 0 && (
            <div className="notification-actions">
              {actions.map(action => (
                <button
                  key={action.id}
                  className={`action-button ${action.variant || 'secondary'}`}
                  onClick={(e) => this.handleActionClick(action, e)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Metadata */}
          {isExpanded && metadata && Object.keys(metadata).length > 0 && (
            <div className="notification-metadata">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {isHovered && (
          <div className="notification-actions">
            {!read && (
              <button
                className="action-button primary"
                onClick={this.handleMarkAsRead}
                aria-label="Mark as read"
              >
                ✓
              </button>
            )}
            <button
              className="action-button danger"
              onClick={this.handleDelete}
              aria-label="Delete notification"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }
}
