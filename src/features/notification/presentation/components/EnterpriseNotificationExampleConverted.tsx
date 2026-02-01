/**
 * Enterprise Notification Example Component
 * 
 * Demonstrates the usage of enterprise notification hooks with
 * real-time capabilities, push notifications, and advanced features
 */

import React from 'react';
import { useEnterpriseNotifications } from '@features/notification/application/hooks/useEnterpriseNotifications';
import { useNotificationMigration } from '@features/notification/application/hooks/useNotificationMigration';
import type { NotificationResponse, NotificationType } from '@/features/notification/data/models/notification';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Notification Item interface
 */
export interface INotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: any;
}

/**
 * Notification Metrics interface
 */
export interface INotificationMetrics {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  averageResponseTime: number;
  deliveryRate: number;
  errorRate: number;
}

/**
 * Enterprise Notification Example Props
 */
export interface IEnterpriseNotificationExampleProps extends IBaseComponentProps {
  className?: string;
  enableMigrationMode?: boolean;
  realTimeLevel?: 'basic' | 'enhanced' | 'maximum';
  pushNotificationLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Enterprise Notification Example State
 */
export interface IEnterpriseNotificationExampleState extends IBaseComponentState {
  notifications: INotificationItem[];
  isLoading: boolean;
  errorMessage: string | null;
  realTimeLevel: 'basic' | 'enhanced' | 'maximum';
  pushNotificationLevel: 'disabled' | 'basic' | 'enhanced';
  selectedFilter: 'all' | 'unread' | 'read' | 'high-priority';
  metrics: INotificationMetrics | null;
  isRealTimeEnabled: boolean;
  lastUpdate: Date | null;
}

/**
 * Enterprise Notification Example Component
 * 
 * Demonstrates enterprise notification capabilities with:
 * - Real-time notifications with configurable levels
 * - Push notifications and desktop integration
 * - Advanced filtering and categorization
 * - Migration support for legacy systems
 * - Comprehensive metrics and analytics
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseNotificationExample extends BaseClassComponent<IEnterpriseNotificationExampleProps, IEnterpriseNotificationExampleState> {
  private notificationTimer: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseNotificationExampleState> {
    const { 
      realTimeLevel = 'enhanced',
      pushNotificationLevel = 'basic'
    } = this.props;

    return {
      notifications: [],
      isLoading: false,
      errorMessage: null,
      realTimeLevel,
      pushNotificationLevel,
      selectedFilter: 'all',
      metrics: null,
      isRealTimeEnabled: true,
      lastUpdate: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeNotifications();
    this.startRealTimeUpdates();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupNotifications();
  }

  /**
   * Initialize notification system
   */
  private initializeNotifications(): void {
    console.log('🔔 Enterprise notification example initialized');
    this.safeSetState({ lastUpdate: new Date() });
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    if (!this.state.isRealTimeEnabled) return;

    const intervals = {
      basic: 30000,    // 30 seconds
      enhanced: 15000, // 15 seconds
      maximum: 5000    // 5 seconds
    };

    this.notificationTimer = window.setInterval(() => {
      this.refreshNotifications();
    }, intervals[this.state.realTimeLevel]);
  }

  /**
   * Cleanup notifications
   */
  private cleanupNotifications(): void {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
      this.notificationTimer = null;
    }
  }

  /**
   * Get enterprise notification data
   */
  private getEnterpriseNotificationData() {
    const { enableMigrationMode = false } = this.props;

    // Use either migration hook or direct enterprise hook
    const notificationData = enableMigrationMode 
      ? this.useNotificationMigrationClass()
      : this.useEnterpriseNotificationsClass();

    return notificationData;
  }

  /**
   * Class-based version of useEnterpriseNotifications hook
   */
  private useEnterpriseNotificationsClass() {
    // Mock implementation that matches the hook interface
    return {
      notifications: this.state.notifications,
      metrics: this.state.metrics || {
        totalNotifications: 0,
        unreadCount: 0,
        readCount: 0,
        averageResponseTime: 0,
        deliveryRate: 0.95,
        errorRate: 0.02
      },
      isLoading: this.state.isLoading,
      error: this.state.errorMessage,
      sendNotification: this.sendNotification,
      markAsRead: this.markAsRead,
      markAllAsRead: this.markAllAsRead,
      deleteNotification: this.deleteNotification,
      clearAllNotifications: this.clearAllNotifications,
      refresh: this.refreshNotifications
    };
  }

  /**
   * Class-based version of useNotificationMigration hook
   */
  private useNotificationMigrationClass() {
    // Mock implementation that matches the hook interface
    return {
      notifications: this.state.notifications,
      migration: {
        isUsingEnterprise: true,
        config: { realTimeLevel: this.state.realTimeLevel },
        errors: [],
        performance: {
          enterpriseHookTime: 12.3,
          legacyHookTime: 28.7,
          migrationTime: 1.5
        }
      },
      isLoading: this.state.isLoading,
      error: this.state.errorMessage,
      sendNotification: this.sendNotification,
      markAsRead: this.markAsRead,
      migrateToEnterprise: () => console.log('Migrating to enterprise notifications')
    };
  }

  /**
   * Generate mock notifications
   */
  private generateMockNotifications(): INotificationItem[] {
    const mockNotifications: INotificationItem[] = [
      {
        id: '1',
        type: 'info',
        title: 'System Update',
        message: 'A new system update is available for installation',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'success',
        title: 'Upload Complete',
        message: 'Your file has been successfully uploaded',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: true,
        priority: 'low'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Storage Warning',
        message: 'Your storage is almost full. Please consider upgrading',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        priority: 'high'
      },
      {
        id: '4',
        type: 'error',
        title: 'Authentication Failed',
        message: 'Failed to authenticate with the server',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: false,
        priority: 'urgent'
      }
    ];

    return mockNotifications;
  }

  /**
   * Refresh notifications
   */
  private refreshNotifications = (): void => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    // Simulate API call
    setTimeout(() => {
      const notifications = this.generateMockNotifications();
      const metrics = {
        totalNotifications: notifications.length,
        unreadCount: notifications.filter(n => !n.read).length,
        readCount: notifications.filter(n => n.read).length,
        averageResponseTime: Math.random() * 1000 + 500, // 500-1500ms
        deliveryRate: 0.95 + Math.random() * 0.04, // 95-99%
        errorRate: Math.random() * 0.05 // 0-5%
      };

      this.safeSetState({ 
        notifications, 
        isLoading: false,
        metrics,
        lastUpdate: new Date()
      });
    }, 500);
  };

  /**
   * Send notification
   */
  private sendNotification = (notification: Partial<INotificationItem>): void => {
    const newNotification: INotificationItem = {
      id: Date.now().toString(),
      type: notification.type || 'info',
      title: notification.title || 'New Notification',
      message: notification.message || '',
      timestamp: new Date(),
      read: false,
      priority: notification.priority || 'medium',
      metadata: notification.metadata
    };

    this.safeSetState(prev => ({
      notifications: [newNotification, ...prev.notifications],
      metrics: prev.metrics ? {
        ...prev.metrics,
        totalNotifications: prev.metrics.totalNotifications + 1,
        unreadCount: prev.metrics.unreadCount + 1
      } : null
    }));

    console.log('📤 Notification sent:', newNotification);
  };

  /**
   * Mark notification as read
   */
  private markAsRead = (id: string): void => {
    this.safeSetState(prev => {
      const updatedNotifications = prev.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      
      return {
        notifications: updatedNotifications,
        metrics: prev.metrics ? {
          ...prev.metrics,
          readCount: prev.metrics.readCount + 1,
          unreadCount
        } : null
      };
    });
  };

  /**
   * Mark all notifications as read
   */
  private markAllAsRead = (): void => {
    this.safeSetState(prev => ({
      notifications: prev.notifications.map(notification => ({ ...notification, read: true })),
      metrics: prev.metrics ? {
        ...prev.metrics,
        readCount: prev.metrics.totalNotifications,
        unreadCount: 0
      } : null
    }));
  };

  /**
   * Delete notification
   */
  private deleteNotification = (id: string): void => {
    this.safeSetState(prev => {
      const updatedNotifications = prev.notifications.filter(n => n.id !== id);
      const deletedNotification = prev.notifications.find(n => n.id === id);
      
      return {
        notifications: updatedNotifications,
        metrics: prev.metrics ? {
          ...prev.metrics,
          totalNotifications: updatedNotifications.length,
          unreadCount: deletedNotification && !deletedNotification.read 
            ? prev.metrics.unreadCount - 1 
            : prev.metrics.unreadCount,
          readCount: deletedNotification && deletedNotification.read 
            ? prev.metrics.readCount - 1 
            : prev.metrics.readCount
        } : null
      };
    });
  };

  /**
   * Clear all notifications
   */
  private clearAllNotifications = (): void => {
    this.safeSetState({
      notifications: [],
      metrics: {
        totalNotifications: 0,
        unreadCount: 0,
        readCount: 0,
        averageResponseTime: 0,
        deliveryRate: 0,
        errorRate: 0
      }
    });
  };

  /**
   * Handle filter change
   */
  private handleFilterChange = (filter: 'all' | 'unread' | 'read' | 'high-priority'): void => {
    this.safeSetState({ selectedFilter: filter });
  };

  /**
   * Handle real-time level change
   */
  private handleRealTimeLevelChange = (level: 'basic' | 'enhanced' | 'maximum'): void => {
    this.safeSetState({ realTimeLevel: level });
    
    // Restart timer with new interval
    this.cleanupNotifications();
    this.startRealTimeUpdates();
  };

  /**
   * Handle push notification level change
   */
  private handlePushNotificationLevelChange = (level: 'disabled' | 'basic' | 'enhanced'): void => {
    this.safeSetState({ pushNotificationLevel: level });
  };

  /**
   * Toggle real-time updates
   */
  private toggleRealTimeUpdates = (): void => {
    const newEnabled = !this.state.isRealTimeEnabled;
    this.safeSetState({ isRealTimeEnabled: newEnabled });
    
    if (newEnabled) {
      this.startRealTimeUpdates();
    } else {
      this.cleanupNotifications();
    }
  };

  /**
   * Get filtered notifications
   */
  private getFilteredNotifications(): INotificationItem[] {
    const { notifications, selectedFilter } = this.state;

    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      case 'high-priority':
        return notifications.filter(n => n.priority === 'high' || n.priority === 'urgent');
      default:
        return notifications;
    }
  }

  /**
   * Render notification item
   */
  private renderNotificationItem = (notification: INotificationItem): React.ReactNode => {
    const priorityColors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };

    const typeIcons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    return (
      <div
        key={notification.id}
        className={`p-4 border rounded-lg mb-2 ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:shadow-md transition-shadow`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{typeIcons[notification.type]}</span>
              <h4 className="font-medium">{notification.title}</h4>
              {!notification.read && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">New</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{notification.message}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${priorityColors[notification.priority]}`}>
                {notification.priority}
              </span>
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            {!notification.read && (
              <button
                onClick={() => this.markAsRead(notification.id)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={() => this.deleteNotification(notification.id)}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render controls
   */
  private renderControls(): React.ReactNode {
    const { realTimeLevel, pushNotificationLevel, isRealTimeEnabled } = this.state;

    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Notification Controls</h3>
        
        <div className="space-y-4">
          {/* Real-time Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Real-time Updates
            </label>
            <select
              value={realTimeLevel}
              onChange={(e) => this.handleRealTimeLevelChange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="basic">Basic - 30 seconds</option>
              <option value="enhanced">Enhanced - 15 seconds</option>
              <option value="maximum">Maximum - 5 seconds</option>
            </select>
          </div>
          
          {/* Push Notifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Push Notifications
            </label>
            <select
              value={pushNotificationLevel}
              onChange={(e) => this.handlePushNotificationLevelChange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="disabled">Disabled</option>
              <option value="basic">Basic - Browser notifications</option>
              <option value="enhanced">Enhanced - Desktop + Mobile</option>
            </select>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={this.toggleRealTimeUpdates}
              className={`px-4 py-2 rounded-md ${
                isRealTimeEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isRealTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}
            </button>
            
            <button
              onClick={this.refreshNotifications}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Refresh
            </button>
            
            <button
              onClick={this.markAllAsRead}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Mark All Read
            </button>
            
            <button
              onClick={this.clearAllNotifications}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render metrics
   */
  private renderMetrics(): React.ReactNode {
    const { metrics } = this.state;

    if (!metrics) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Total</div>
            <div className="font-medium">{metrics.totalNotifications}</div>
          </div>
          <div>
            <div className="text-gray-500">Unread</div>
            <div className="font-medium text-blue-600">{metrics.unreadCount}</div>
          </div>
          <div>
            <div className="text-gray-500">Read</div>
            <div className="font-medium text-green-600">{metrics.readCount}</div>
          </div>
          <div>
            <div className="text-gray-500">Delivery Rate</div>
            <div className="font-medium">{(metrics.deliveryRate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-500">Error Rate</div>
            <div className="font-medium text-red-600">{(metrics.errorRate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-500">Avg Response</div>
            <div className="font-medium">{metrics.averageResponseTime.toFixed(0)}ms</div>
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', enableMigrationMode = false } = this.props;
    const { selectedFilter, lastUpdate } = this.state;
    const notificationData = this.getEnterpriseNotificationData();
    const filteredNotifications = this.getFilteredNotifications();

    return (
      <div className={`enterprise-notification-example p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise Notification System
          </h1>
          <p className="text-gray-600">
            Real-time notifications with push support and advanced filtering
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${this.state.isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {this.state.isRealTimeEnabled ? 'Real-time Active' : 'Real-time Paused'}
              </span>
              <span className="text-sm text-gray-600">
                Filter: {selectedFilter}
              </span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {this.renderControls()}

        {/* Metrics */}
        {this.renderMetrics()}

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Notifications</h2>
            <div className="flex space-x-2">
              {(['all', 'unread', 'read', 'high-priority'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => this.handleFilterChange(filter)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {notificationData.isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" color="primary" />
            </div>
          )}

          {/* Error State */}
          {notificationData.error && (
            <ErrorMessage
              error={notificationData.error}
              onRetry={() => this.refreshNotifications()}
              onClear={() => this.safeSetState({ errorMessage: null })}
              variant="default"
            />
          )}

          {/* Notifications List */}
          {!notificationData.isLoading && !notificationData.error && (
            <>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">No notifications</div>
                  <div className="text-sm">You're all caught up!</div>
                </div>
              ) : (
                <div>
                  {filteredNotifications.map(this.renderNotificationItem)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default EnterpriseNotificationExample;
