import * as React from 'react';
import { useNotificationsDI } from '../../application/services/NotificationServiceDI';
import { styles } from './NotificationCenter.styles.ts';

interface NotificationCenterProps {
  userId: string;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId, className = '' }) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    simulateNotification
  } = useNotificationsDI(userId);

  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [showDropdown, setShowDropdown] = React.useState(false);

  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }
    
    return filtered;
  }, [notifications, filter, typeFilter]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const handleSimulateNotification = async (type: any) => {
    await simulateNotification(type);
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      message: '💬',
      follow: '👥',
      like: '❤️',
      comment: '💭',
      mention: '@',
      system: '🔔'
    };
    return icons[type as keyof typeof icons] || '📢';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#6c757d',
      medium: '#007bff',
      high: '#fd7e14',
      urgent: '#dc3545'
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`notification-center ${className}`} style={styles.container}>
      {/* Notification Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h3 style={styles.title}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={styles.badge}>{unreadCount}</span>
          )}
        </div>
        <div style={styles.headerRight}>
          <button
            style={styles.button}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⚡
          </button>
          {unreadCount > 0 && (
            <button
              style={styles.button}
              onClick={handleMarkAllAsRead}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Simulation Dropdown */}
      {showDropdown && (
        <div style={styles.dropdown}>
          <h4 style={styles.dropdownTitle}>Simulate Notifications</h4>
          {['message', 'follow', 'like', 'comment', 'mention', 'system'].map(type => (
            <button
              key={type}
              style={styles.dropdownButton}
              onClick={() => handleSimulateNotification(type as any)}
            >
              {getNotificationIcon(type)} {type}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            style={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Type:</label>
          <select
            style={styles.select}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="message">Messages</option>
            <option value="follow">Follows</option>
            <option value="like">Likes</option>
            <option value="comment">Comments</option>
            <option value="mention">Mentions</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          Loading notifications...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={styles.error}>
          ❌ {error}
          <button style={styles.retryButton} onClick={() => fetchNotifications()}>
            Retry
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div style={styles.notificationsList}>
          {filteredNotifications.length === 0 ? (
            <div style={styles.emptyState}>
              📭 No notifications found
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationItem,
                  backgroundColor: notification.read ? '#f8f9fa' : '#ffffff',
                  borderLeft: `4px solid ${getPriorityColor(notification.priority)}`
                }}
              >
                <div style={styles.notificationContent}>
                  <div style={styles.notificationHeader}>
                    <span style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div style={styles.notificationTitle}>
                      {notification.title}
                    </div>
                    <div style={styles.notificationTime}>
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                  <div style={styles.notificationMessage}>
                    {notification.message}
                  </div>
                  {notification.actionUrl && (
                    <button
                      style={styles.actionButton}
                      onClick={() => {
                        // In real app, navigate to actionUrl
                        console.log('Navigate to:', notification.actionUrl);
                      }}
                    >
                      {notification.actionText || 'View'}
                    </button>
                  )}
                </div>
                <div style={styles.notificationActions}>
                  {!notification.read && (
                    <button
                      style={styles.actionButton}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(notification.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
