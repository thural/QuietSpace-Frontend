/**
 * Enterprise Notification Example Component
 * 
 * Demonstrates the usage of enterprise notification hooks with
 * real-time capabilities, push notifications, and advanced features
 */

import React, { useState } from 'react';
import { useEnterpriseNotifications } from '@features/notification/application/hooks/useEnterpriseNotifications';
import { useNotificationMigration } from '@features/notification/application/hooks/useNotificationMigration';
import type { NotificationResponse, NotificationType } from '@/features/notification/data/models/notification';

/**
 * Enterprise Notification Example Props
 */
interface EnterpriseNotificationExampleProps {
  className?: string;
  enableMigrationMode?: boolean;
  realTimeLevel?: 'basic' | 'enhanced' | 'maximum';
  pushNotificationLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage: React.FC<{ error: string; onRetry: () => void; onClear: () => void }> = ({
  error,
  onRetry,
  onClear
}) => (
  <div className="error-message p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-700">{error}</div>
    <div className="mt-2 flex space-x-2">
      <button
        onClick={onRetry}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Retry
      </button>
      <button
        onClick={onClear}
        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
      >
        Clear
      </button>
    </div>
  </div>
);

/**
 * Notification Item Component
 */
const NotificationItem: React.FC<{
  notification: NotificationResponse;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`notification-item p-4 border rounded-lg mb-2 ${notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{notification.title}</h4>
            <span className={`px-2 py-1 text-xs rounded ${notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
              notification.type === 'success' ? 'bg-green-100 text-green-800' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
              }`}>
              {notification.type}
            </span>
            {!notification.isRead && (
              <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">New</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </div>
          {isExpanded && notification.metadata && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <pre>{JSON.stringify(notification.metadata, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
          <button
            onClick={() => onDelete(notification.id)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Real-time Status Component
 */
const RealTimeStatus: React.FC<{
  realTimeEnabled: boolean;
  pushNotificationStatus: import('../../domain/entities/INotificationRepository').PushNotificationStatus;
  onEnableRealTime: () => void;
  onDisableRealTime: () => void;
  onSubscribePush: () => void;
  onUnsubscribePush: () => void;
}> = ({
  realTimeEnabled,
  pushNotificationStatus,
  onEnableRealTime,
  onDisableRealTime,
  onSubscribePush,
  onUnsubscribePush
}) => (
    <div className="real-time-status p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="font-medium mb-2">Real-time Features</div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Real-time Notifications:</span>
          <span className={`px-2 py-1 rounded text-xs ${realTimeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {realTimeEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Push Notifications:</span>
          <span className={`px-2 py-1 rounded text-xs ${pushNotificationStatus.enabled && pushNotificationStatus.subscribed ? 'bg-green-100 text-green-800' :
            pushNotificationStatus.enabled && !pushNotificationStatus.subscribed ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
            {pushNotificationStatus.enabled && pushNotificationStatus.subscribed ? 'enabled' :
              pushNotificationStatus.enabled && !pushNotificationStatus.subscribed ? 'pending' :
                'disabled'}
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {!realTimeEnabled && (
          <button
            onClick={onEnableRealTime}
            className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Enable Real-time
          </button>
        )}
        {realTimeEnabled && (
          <button
            onClick={onDisableRealTime}
            className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Disable Real-time
          </button>
        )}
        {!pushNotificationStatus.enabled && (
          <button
            onClick={onSubscribePush}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Enable Push Notifications
          </button>
        )}
        {pushNotificationStatus.enabled && pushNotificationStatus.subscribed && (
          <button
            onClick={onUnsubscribePush}
            className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Disable Push Notifications
          </button>
        )}
      </div>
    </div>
  );

/**
 * Notification Filters Component
 */
const NotificationFilters: React.FC<{
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  onSearch: (query: string) => void;
}> = ({ activeFilter, onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="notification-filters p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="font-medium mb-3">Filters</div>

      {/* Type filters */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">By Type</div>
        <div className="flex flex-wrap gap-2">
          {['all', 'info', 'success', 'warning', 'error'].map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter === 'all' ? null : filter)}
              className={`px-3 py-1 text-xs rounded ${(filter === 'all' && !activeFilter) || activeFilter === filter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="text-sm font-medium mb-2">Search</div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick actions */}
      <div className="text-sm font-medium mb-2">Quick Actions</div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('unread')}
          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
        >
          Unread Only
        </button>
        <button
          onClick={() => onFilterChange('today')}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
        >
          Today
        </button>
        <button
          onClick={() => onFilterChange('week')}
          className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
        >
          This Week
        </button>
      </div>
    </div>
  );
};

/**
 * Enterprise Notification Example Component
 */
export const EnterpriseNotificationExample: React.FC<EnterpriseNotificationExampleProps> = ({
  className = '',
  enableMigrationMode = false,
  realTimeLevel = 'enhanced',
  pushNotificationLevel = 'enhanced'
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Use either migration hook or direct enterprise hook
  const notifications = enableMigrationMode
    ? useNotificationMigration({
      useEnterpriseHooks: true,
      enableFallback: true,
      logMigrationEvents: true,
      realTimeLevel,
      pushNotificationLevel
    })
    : useEnterpriseNotifications();

  // Handle notification actions
  const handleMarkAsRead = async (notificationId: string) => {
    await notifications.markAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await notifications.deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await notifications.markAllAsRead();
  };

  const handleFilterChange = (filter: string | null) => {
    notifications.setFilters({ type: filter as NotificationType });
    // Handle different hook signatures for migration vs enterprise mode
    if (enableMigrationMode) {
      // Migration mode: fetchNotifications(userId, query)
      (notifications as any).fetchNotifications('current-user-id', {});
    } else {
      // Enterprise mode: fetchNotifications(query)
      (notifications as any).fetchNotifications({ userId: 'current-user-id' });
    }
  };

  const handleSearch = (query: string) => {
    // Handle different hook signatures for migration vs enterprise mode
    if (enableMigrationMode) {
      // Migration mode: searchNotifications(query, userId)
      (notifications as any).searchNotifications(query, 'current-user-id');
    } else {
      // Enterprise mode: searchNotifications(query)
      (notifications as any).searchNotifications(query);
    }
  };

  return (
    <div className={`enterprise-notification-example max-w-4xl mx-auto ${className}`}>
      {/* Migration Info */}
      {enableMigrationMode && 'migration' in notifications && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Migration Mode</span>
            <div className="text-xs text-purple-600">
              Status: {notifications.migration.isUsingEnterprise ? 'Enterprise' : 'Legacy'}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <div>Real-time Level: {notifications.migration.config.realTimeLevel}</div>
            <div>Push Level: {notifications.migration.config.pushNotificationLevel}</div>
            <div>Performance: {notifications.migration.performance.enterpriseHookTime.toFixed(2)}ms</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">Unread:</span>
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full">
                  {notifications.unreadCount}
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={notifications.refreshNotifications}
              disabled={notifications.isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
            >
              {notifications.isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={notifications.unreadCount === 0}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300"
            >
              Mark All as Read
            </button>
            <button
              onClick={notifications.syncNotifications}
              disabled={notifications.syncInProgress}
              className="px-4 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:bg-gray-300"
            >
              {notifications.syncInProgress ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Filters */}
          {showFilters && (
            <NotificationFilters
              activeFilter={notifications.activeFilter}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          )}

          {/* Real-time Status */}
          <RealTimeStatus
            realTimeEnabled={notifications.realTimeEnabled}
            pushNotificationStatus={notifications.pushNotificationStatus}
            onEnableRealTime={notifications.enableRealTimeNotifications}
            onDisableRealTime={notifications.disableRealTimeNotifications}
            onSubscribePush={notifications.subscribeToPushNotifications}
            onUnsubscribePush={notifications.unsubscribeFromPushNotifications}
          />

          {/* Notifications List */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {notifications.activeFilter ? `${notifications.activeFilter.charAt(0).toUpperCase() + notifications.activeFilter.slice(1)} Notifications` : 'All Notifications'}
              </h2>

              {/* Loading State */}
              {notifications.isLoading && <LoadingSpinner />}

              {/* Error State */}
              {notifications.error && (
                <ErrorMessage
                  error={typeof notifications.error === 'string'
                    ? notifications.error
                    : notifications.error?.message || 'An error occurred'}
                  onRetry={notifications.retry}
                  onClear={notifications.clearError}
                />
              )}

              {/* Notifications */}
              {!notifications.isLoading && !notifications.error && (
                <div>
                  {notifications.notifications?.content && notifications.notifications.content.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.notifications.content.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No notifications found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Notifications:</span>
                <span className="font-medium">{notifications.notifications?.totalElements || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Unread:</span>
                <span className="font-medium text-blue-600">{notifications.unreadCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="text-xs text-gray-500">
                  {notifications.lastSyncTime?.toLocaleString() || 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
              <div className="space-y-2 text-xs">
                <div>Real-time Enabled: {notifications.realTimeEnabled.toString()}</div>
                <div>Push Status: {JSON.stringify(notifications.pushNotificationStatus)}</div>
                <div>Loading: {notifications.isLoading.toString()}</div>
                <div>Error: {typeof notifications.error === 'string' ? notifications.error : notifications.error?.message || 'Unknown error'}</div>
                <div>Sync In Progress: {notifications.syncInProgress.toString()}</div>
                <div>Active Filter: {notifications.activeFilter || 'None'}</div>
                {notifications.quietHours && (
                  <div>Quiet Hours: {JSON.stringify(notifications.quietHours)}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseNotificationExample;
