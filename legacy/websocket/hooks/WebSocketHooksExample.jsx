/**
 * WebSocket Hooks Example Component
 * 
 * Comprehensive example demonstrating the usage of standardized WebSocket hooks
 * across all features with migration support and monitoring.
 */

import React, { useState, useEffect } from 'react';
import {
  useEnterpriseWebSocket,
  useChatWebSocket,
  useNotificationWebSocket,
  useFeedWebSocket,
  useWebSocketMigration
} from '../index';

/**
 * WebSocket Hooks Example Component
 */
const WebSocketHooksExample = () => {
  const [logs, setLogs] = useState([]);
  const [migrationMode, setMigrationMode] = useState('hybrid');

  // Add log message
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Example 1: Basic Enterprise WebSocket Hook
  const BasicExample = () => {
    const {
      isConnected,
      isConnecting,
      error,
      sendMessage,
      subscribe,
      disconnect
    } = useEnterpriseWebSocket({
      autoConnect: true,
      reconnectAttempts: 3,
      enableLogging: true
    });

    useEffect(() => {
      if (isConnected) {
        addLog('✅ Enterprise WebSocket connected');
      }
    }, [isConnected]);

    const handleSendMessage = () => {
      sendMessage({
        type: 'test',
        data: 'Hello from Enterprise WebSocket!'
      });
      addLog('📤 Message sent via Enterprise WebSocket');
    };

    return (
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Basic Enterprise WebSocket</h3>
        <p>Status: {isConnected ? '🟢 Connected' : isConnecting ? '🟡 Connecting' : '🔴 Disconnected'}</p>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send Message
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
    );
  };

  // Example 2: Feature-specific WebSocket Hook
  const ChatExample = () => {
    const {
      isConnected,
      messages,
      sendMessage,
      typingUsers
    } = useChatWebSocket({
      autoConnect: true,
      chatId: 'example-chat-123'
    });

    const handleSendMessage = () => {
      sendMessage({
        type: 'chat',
        content: 'Hello from Chat WebSocket!',
        chatId: 'example-chat-123'
      });
      addLog('💬 Chat message sent');
    };

    return (
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Chat WebSocket</h3>
        <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p>Messages: {messages?.length || 0}</p>
        <p>Typing users: {typingUsers?.join(', ') || 'None'}</p>
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send Chat Message
        </button>
      </div>
    );
  };

  // Example 3: Migration Hook
  const MigrationExample = () => {
    const {
      isConnected,
      isUsingLegacy,
      isUsingEnterprise,
      switchToLegacy,
      switchToEnterprise,
      switchToHybrid,
      connect,
      disconnect,
      sendMessage
    } = useWebSocketMigration({
      feature: 'chat',
      migrationMode: migrationMode,
      enableFallback: true,
      logMigrationEvents: true
    });

    const handleConnect = () => {
      connect();
      addLog(`🔌 Connecting in ${migrationMode} mode`);
    };

    const handleSendMessage = () => {
      sendMessage({
        type: 'migration-test',
        data: 'Hello from Migration Hook!'
      });
      addLog('📤 Message sent via Migration Hook');
    };

    return (
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>WebSocket Migration</h3>
        <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        <p>Mode: {migrationMode}</p>
        <p>Using Legacy: {isUsingLegacy ? '✅' : '❌'}</p>
        <p>Using Enterprise: {isUsingEnterprise ? '✅' : '❌'}</p>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Migration Mode:
            <select 
              value={migrationMode} 
              onChange={(e) => setMigrationMode(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="legacy">Legacy</option>
              <option value="hybrid">Hybrid</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
        </div>

        <button onClick={handleConnect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={() => switchToLegacy()}>
          Switch to Legacy
        </button>
        <button onClick={() => switchToEnterprise()}>
          Switch to Enterprise
        </button>
        <button onClick={() => switchToHybrid()}>
          Switch to Hybrid
        </button>
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send Message
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>WebSocket Hooks Examples</h2>
      
      <BasicExample />
      <ChatExample />
      <MigrationExample />

      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Activity Log</h3>
        <div style={{ 
          height: '200px', 
          overflowY: 'auto', 
          backgroundColor: '#f5f5f5', 
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
        <button onClick={() => setLogs([])} style={{ marginTop: '10px' }}>
          Clear Logs
        </button>
      </div>
    </div>
  );
};

export default WebSocketHooksExample;
