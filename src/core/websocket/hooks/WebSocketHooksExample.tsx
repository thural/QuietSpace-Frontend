/**
 * WebSocket Hooks Example Component
 *
 * Comprehensive example demonstrating the usage of standardized WebSocket hooks
 * across all features with migration support and monitoring.
 */

import React, { useState, useEffect } from 'react';

import {
  useChatWebSocket,
  useNotificationWebSocket,
  useFeedWebSocket,
  useWebSocketMigration,
  useMultiFeatureMigration,
  useWebSocketMonitor,
  WebSocketHooks,
  DEFAULT_CHAT_CONFIG,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_FEED_CONFIG,
  DEFAULT_MIGRATION_CONFIG
} from './index';

interface WebSocketHooksExampleProps {
  features?: ('chat' | 'notification' | 'feed')[];
  enableMigration?: boolean;
  enableMonitoring?: boolean;
}

/**
 * Example component demonstrating WebSocket hooks usage
 */
export const WebSocketHooksExample: React.FC<WebSocketHooksExampleProps> = ({
  features = ['chat', 'notification', 'feed'],
  enableMigration = true,
  enableMonitoring = true
}) => {
  const [activeFeature, setActiveFeature] = useState<'chat' | 'notification' | 'feed'>('chat');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [migrationMode, setMigrationMode] = useState<'legacy' | 'hybrid' | 'enterprise'>('enterprise');

  // Feature-specific hooks
  const chatHook = useChatWebSocket(DEFAULT_CHAT_CONFIG);
  const notificationHook = useNotificationWebSocket(DEFAULT_NOTIFICATION_CONFIG);
  const feedHook = useFeedWebSocket(DEFAULT_FEED_CONFIG);

  // Migration hooks
  const chatMigration = useWebSocketMigration({
    feature: 'chat',
    migrationMode: enableMigration ? migrationMode : 'enterprise',
    ...DEFAULT_MIGRATION_CONFIG
  });

  const multiMigration = useMultiFeatureMigration(features);

  // Monitoring hook
  const monitor = enableMonitoring ? useWebSocketMonitor() : null;

  // Get current hook based on active feature
  const getCurrentHook = () => {
    switch (activeFeature) {
      case 'chat':
        return showAdvanced ? chatHook : chatMigration;
      case 'notification':
        return showAdvanced ? notificationHook : notificationHook; // Would need migration hook
      case 'feed':
        return showAdvanced ? feedHook : feedHook; // Would need migration hook
      default:
        return chatHook;
    }
  };

  const currentHook = getCurrentHook();

  // Test functions
  const testChatOperations = async () => {
    try {
      // Send a test message
      await chatHook.sendMessage('test_chat', 'Hello from WebSocket hooks example!');

      // Send typing indicator
      await chatHook.sendTypingIndicator('test_chat', true);

      // Mark messages as read
      await chatHook.markMessagesAsRead('test_chat');

      console.log('Chat operations completed successfully');
    } catch (error) {
      console.error('Chat operations failed:', error);
    }
  };

  const testNotificationOperations = async () => {
    try {
      // Mark all notifications as read
      await notificationHook.markAllAsRead();

      // Update preferences
      await notificationHook.updatePreferences({
        enablePush: true,
        enableEmail: false,
        enableInApp: true
      });

      console.log('Notification operations completed successfully');
    } catch (error) {
      console.error('Notification operations failed:', error);
    }
  };

  const testFeedOperations = async () => {
    try {
      // Create a test post
      await feedHook.createPost('Test post from WebSocket hooks example!');

      // Add a reaction
      await feedHook.addReaction('test_post', 'like');

      // Add a comment
      await feedHook.addComment('test_post', 'Great post!');

      // Refresh feed
      await feedHook.refreshFeed();

      console.log('Feed operations completed successfully');
    } catch (error) {
      console.error('Feed operations failed:', error);
    }
  };

  const testMigration = async () => {
    if (!enableMigration) return;

    try {
      // Test different migration modes
      console.log('Testing legacy mode...');
      chatMigration.switchToLegacy();
      await chatMigration.connect();

      console.log('Testing enterprise mode...');
      chatMigration.switchToEnterprise();
      await chatMigration.connect();

      console.log('Testing hybrid mode...');
      chatMigration.switchToHybrid();
      await chatMigration.connect();

      // Get migration report
      const report = chatMigration.getMigrationReport();
      console.log('Migration report:', report);

    } catch (error) {
      console.error('Migration test failed:', error);
    }
  };

  const testMultiFeature = async () => {
    try {
      // Connect all features
      await multiMigration.connectAll();

      // Send messages to all features
      await Promise.all([
        chatHook.sendMessage('multi_test', 'Multi-feature test message'),
        notificationHook.markAllAsRead(),
        feedHook.createPost('Multi-feature test post!')
      ]);

      // Get all reports
      const reports = multiMigration.getAllReports();
      console.log('Multi-feature reports:', reports);

    } catch (error) {
      console.error('Multi-feature test failed:', error);
    }
  };

  // Render connection status
  const renderConnectionStatus = (hook: any, feature: string) => (
    <div className="connection-status">
      <h4>{feature.charAt(0).toUpperCase() + feature.slice(1)} Status</h4>
      <div className="status-indicators">
        <span className={`indicator ${hook.isConnected ? 'connected' : 'disconnected'}`}>
          {hook.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        {hook.isConnecting && <span className="indicator connecting">🟡 Connecting...</span>}
        {hook.error && <span className="indicator error">❌ {hook.error}</span>}
      </div>
      {hook.metrics && (
        <div className="metrics">
          <p>Messages: {hook.metrics.totalMessages || 0}</p>
          <p>Latency: {hook.metrics.averageUpdateLatency || 0}ms</p>
          <p>Error Rate: {((hook.metrics.errorRate || 0) * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );

  // Render migration status
  const renderMigrationStatus = () => {
    if (!enableMigration) return null;

    return (
      <div className="migration-status">
        <h4>Migration Status</h4>
        <div className="migration-info">
          <p>Mode: {chatMigration.state.mode}</p>
          <p>Using Legacy: {chatMigration.state.isUsingLegacy ? 'Yes' : 'No'}</p>
          <p>Using Enterprise: {chatMigration.state.isUsingEnterprise ? 'Yes' : 'No'}</p>
          <p>Fallback Triggered: {chatMigration.state.fallbackTriggered ? 'Yes' : 'No'}</p>
        </div>
        {chatMigration.state.performance.improvement && (
          <div className="performance-comparison">
            <p>Performance Improvement: {chatMigration.state.performance.improvement.toFixed(2)}%</p>
          </div>
        )}
        <div className="migration-controls">
          <button onClick={() => chatMigration.switchToLegacy()}>Legacy</button>
          <button onClick={() => chatMigration.switchToEnterprise()}>Enterprise</button>
          <button onClick={() => chatMigration.switchToHybrid()}>Hybrid</button>
        </div>
      </div>
    );
  };

  // Render feature-specific content
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'chat':
        return (
          <div className="feature-content">
            <h3>Chat Features</h3>
            <div className="feature-stats">
              <p>Messages: {chatHook.messages.length}</p>
              <p>Unread: {chatHook.unreadCount}</p>
              <p>Active Chats: {chatHook.activeChats.length}</p>
              <p>Typing Users: {Object.keys(chatHook.typingUsers).length}</p>
            </div>
            <div className="feature-actions">
              <button onClick={testChatOperations}>Test Chat Operations</button>
              <button onClick={() => chatHook.clearHistory()}>Clear History</button>
            </div>
            {chatHook.messages.slice(0, 3).map((message, index) => (
              <div key={index} className="message-item">
                <p>{message.content || 'Mock message'}</p>
                <small>{new Date(message.timestamp || Date.now()).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        );

      case 'notification':
        return (
          <div className="feature-content">
            <h3>Notification Features</h3>
            <div className="feature-stats">
              <p>Notifications: {notificationHook.notifications.length}</p>
              <p>Unread: {notificationHook.unreadCount}</p>
              <p>Batches: {notificationHook.batches.length}</p>
            </div>
            <div className="feature-actions">
              <button onClick={testNotificationOperations}>Test Notification Operations</button>
              <button onClick={() => notificationHook.clearNotifications()}>Clear Notifications</button>
            </div>
            {notificationHook.notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="notification-item">
                <p>{notification.title || 'Mock notification'}</p>
                <small>{new Date(notification.timestamp || Date.now()).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        );

      case 'feed':
        return (
          <div className="feature-content">
            <h3>Feed Features</h3>
            <div className="feature-stats">
              <p>Posts: {feedHook.posts.length}</p>
              <p>Trending: {feedHook.trendingPosts.length}</p>
              <p>Updates: {feedHook.updates.length}</p>
              <p>Batches: {feedHook.batches.length}</p>
            </div>
            <div className="feature-actions">
              <button onClick={testFeedOperations}>Test Feed Operations</button>
              <button onClick={() => feedHook.clearPosts()}>Clear Posts</button>
            </div>
            {feedHook.posts.slice(0, 3).map((post, index) => (
              <div key={index} className="post-item">
                <p>{post.text || 'Mock post'}</p>
                <small>Likes: {post.likeCount || 0} | Comments: {post.commentCount || 0}</small>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="websocket-hooks-example">
      <div className="example-header">
        <h2>WebSocket Hooks Example</h2>
        <p>Demonstrating standardized WebSocket functionality across all features</p>
      </div>

      {/* Feature Selector */}
      <div className="feature-selector">
        <h3>Select Feature</h3>
        <div className="feature-tabs">
          {features.map(feature => (
            <button
              key={feature}
              className={`tab ${activeFeature === feature ? 'active' : ''}`}
              onClick={() => setActiveFeature(feature)}
            >
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => setShowAdvanced(e.target.checked)}
          />
          Use Advanced Hooks
        </label>
        {enableMigration && (
          <div className="migration-mode-selector">
            <label>Migration Mode:</label>
            <select
              value={migrationMode}
              onChange={(e) => setMigrationMode(e.target.value as any)}
            >
              <option value="legacy">Legacy</option>
              <option value="hybrid">Hybrid</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="connection-statuses">
        {renderConnectionStatus(chatHook, 'chat')}
        {renderConnectionStatus(notificationHook, 'notification')}
        {renderConnectionStatus(feedHook, 'feed')}
      </div>

      {/* Migration Status */}
      {renderMigrationStatus()}

      {/* Global Monitoring */}
      {monitor && (
        <div className="global-monitoring">
          <h3>Global Monitoring</h3>
          <div className="monitoring-stats">
            <p>Total Connections: {monitor.totalConnections}</p>
            <p>Active Connections: {monitor.activeConnections}</p>
            <p>Total Messages: {monitor.totalMessages}</p>
            <p>Errors: {monitor.errors}</p>
            {monitor.lastActivity && (
              <p>Last Activity: {monitor.lastActivity.toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Feature Content */}
      <div className="feature-content-container">
        {renderFeatureContent()}
      </div>

      {/* Test Controls */}
      <div className="test-controls">
        <h3>Test Controls</h3>
        <div className="test-buttons">
          <button onClick={testChatOperations}>Test Chat</button>
          <button onClick={testNotificationOperations}>Test Notifications</button>
          <button onClick={testFeedOperations}>Test Feed</button>
          {enableMigration && <button onClick={testMigration}>Test Migration</button>}
          <button onClick={testMultiFeature}>Test Multi-Feature</button>
        </div>
      </div>

      {/* Multi-Feature Status */}
      {features.length > 1 && (
        <div className="multi-feature-status">
          <h3>Multi-Feature Status</h3>
          <div className="multi-feature-info">
            <p>Any Using Legacy: {multiMigration.isAnyUsingLegacy ? 'Yes' : 'No'}</p>
            <p>All Enterprise: {multiMigration.isAllEnterprise ? 'Yes' : 'No'}</p>
          </div>
          <div className="multi-feature-reports">
            {multiMigration.getAllReports().map((report, index) => (
              <div key={index} className="report-item">
                <p>Feature: {report.feature}</p>
                <p>Recommended: {report.report.recommendedMode}</p>
                <p>Fallbacks: {report.report.fallbackCount}</p>
                {report.report.issues.length > 0 && (
                  <ul>
                    {report.report.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Utility Functions Demo */}
      <div className="utilities-demo">
        <h3>Utility Functions</h3>
        <div className="utility-buttons">
          <button onClick={() => console.log(WebSocketHooks.createWebSocketConfig(DEFAULT_CHAT_CONFIG, { autoConnect: false }))}>
            Create Config
          </button>
          <button onClick={() => console.log(WebSocketHooks.validateWebSocketConfig({ feature: 'chat' }))}>
            Validate Config
          </button>
          <button onClick={() => console.log(WebSocketHooks.checkConnectionHealth(chatHook))}>
            Check Health
          </button>
          <button onClick={() => console.log(WebSocketHooks.enableWebSocketDebugging())}>
            Enable Debugging
          </button>
        </div>
      </div>

      <style jsx>{`
        .websocket-hooks-example {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .example-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .feature-selector {
          margin-bottom: 20px;
        }

        .feature-tabs {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .tab {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background: #f5f5f5;
          cursor: pointer;
          border-radius: 4px;
        }

        .tab.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .mode-toggle {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .connection-statuses {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .connection-status {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .status-indicators {
          display: flex;
          gap: 10px;
          margin: 10px 0;
        }

        .indicator {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .indicator.connected {
          background: #d4edda;
          color: #155724;
        }

        .indicator.disconnected {
          background: #f8d7da;
          color: #721c24;
        }

        .indicator.connecting {
          background: #fff3cd;
          color: #856404;
        }

        .indicator.error {
          background: #f8d7da;
          color: #721c24;
        }

        .metrics {
          margin-top: 10px;
          font-size: 14px;
        }

        .migration-status {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .migration-controls {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .global-monitoring {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .feature-content-container {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .feature-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin: 15px 0;
        }

        .feature-actions {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }

        .message-item,
        .notification-item,
        .post-item {
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin: 5px 0;
        }

        .test-controls {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .test-buttons,
        .utility-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .multi-feature-status {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .multi-feature-reports {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }

        .report-item {
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        .utilities-demo {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          padding: 8px 16px;
          border: 1px solid #ccc;
          background: #f8f9fa;
          cursor: pointer;
          border-radius: 4px;
        }

        button:hover {
          background: #e9ecef;
        }

        h2, h3, h4 {
          margin: 0 0 10px 0;
        }

        p {
          margin: 5px 0;
        }

        ul {
          margin: 5px 0;
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
};

export default WebSocketHooksExample;
