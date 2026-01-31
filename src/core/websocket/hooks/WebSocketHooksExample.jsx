/**
 * WebSocket Hooks Example Component
 * 
 * Comprehensive example demonstrating the usage of standardized WebSocket hooks
 * across all features with migration support and monitoring.
 */

import React, { useState, useEffect } from 'react';
import {
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketMigration
} from './index.js';

// Import types via JSDoc typedefs
/**
 * WebSocket hooks example component props
 * @typedef {Object} WebSocketHooksExampleProps
 * @property {Array<string>} [features] - Array of features to enable
 * @property {boolean} [enableMigration] - Enable migration mode
 * @property {boolean} [enableMonitoring] - Enable monitoring
 */

/**
 * Example component demonstrating WebSocket hooks usage
 * 
 * @param {WebSocketHooksExampleProps} props - Component props
 * @returns {React.ReactElement} Example component
 * @description Demonstrates WebSocket hooks usage with migration support
 */
export function WebSocketHooksExample({
  features = ['chat', 'notification', 'feed'],
  enableMigration = true,
  enableMonitoring = true
}) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [migrationStatus, setMigrationStatus] = useState('not-started');

  // Initialize WebSocket hooks for different features
  const chatWebSocket = useFeatureWebSocket({
    feature: 'chat',
    autoConnect: true,
    reconnect: true,
    enableMigration: enableMigration
  });

  const notificationWebSocket = useFeatureWebSocket({
    feature: 'notification',
    autoConnect: true,
    reconnect: true,
    enableMigration: enableMigration
  });

  const feedWebSocket = useFeatureWebSocket({
    feature: 'feed',
    autoConnect: true,
    reconnect: true,
    enableMigration: enableMigration
  });

  // Migration hook
  const migration = useWebSocketMigration({
    feature: 'chat',
    migrationMode: 'hybrid',
    enableFallback: true,
    logMigrationEvents: true
  });

  useEffect(() => {
    // Update connection status based on hook states
    const allConnected = chatWebSocket.isConnected &&
      notificationWebSocket.isConnected &&
      feedWebSocket.isConnected;

    setConnectionStatus(allConnected ? 'connected' : 'disconnected');
  }, [
    chatWebSocket.isConnected,
    notificationWebSocket.isConnected,
    feedWebSocket.isConnected
  ]);

  useEffect(() => {
    // Update migration status
    setMigrationStatus(migration.isUsingEnterprise ? 'enterprise' : 'legacy');
  }, [migration.isUsingEnterprise]);

  return (
    <div className="websocket-hooks-example">
      <h2>WebSocket Hooks Example</h2>

      <div className="status-section">
        <h3>Connection Status</h3>
        <p>Status: {connectionStatus}</p>
        <p>Migration: {migrationStatus}</p>
      </div>

      <div className="hooks-section">
        <h3>Active Hooks</h3>
        <ul>
          <li>Chat WebSocket: {chatWebSocket.isConnected ? 'Connected' : 'Disconnected'}</li>
          <li>Notification WebSocket: {notificationWebSocket.isConnected ? 'Connected' : 'Disconnected'}</li>
          <li>Feed WebSocket: {feedWebSocket.isConnected ? 'Connected' : 'Disconnected'}</li>
        </ul>
      </div>

      <div className="actions-section">
        <h3>Actions</h3>
        <button onClick={() => chatWebSocket.connect()}>
          Connect Chat
        </button>
        <button onClick={() => chatWebSocket.disconnect()}>
          Disconnect Chat
        </button>
        <button onClick={() => migration.switchToEnterprise && migration.switchToEnterprise()}>
          Switch to Enterprise
        </button>
      </div>
    </div>
  );
}

export default WebSocketHooksExample;
