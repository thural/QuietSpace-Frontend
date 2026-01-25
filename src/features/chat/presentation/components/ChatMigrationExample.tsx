/**
 * Chat Migration Example Component
 * 
 * This component demonstrates the migration from legacy useChatSocket to the enterprise
 * WebSocket infrastructure. It shows how to use the migrated hook and monitor the migration process.
 */

import React, { useState, useEffect } from 'react';
import useChatSocketMigrated from '../../data/useChatSocketMigrated';
import type { MessageRequest } from '../../data/models/chat';
import type { ResId } from '@/shared/api/models/common';

interface ChatMessage {
  id: ResId;
  text: string;
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
}

/**
 * Example component demonstrating chat socket migration
 */
const ChatMigrationExample: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMigrationInfo, setShowMigrationInfo] = useState(true);

  // Use the migrated chat socket hook
  const {
    sendChatMessage,
    deleteChatMessage,
    setMessageSeen,
    isClientConnected,
    migration
  } = useChatSocketMigrated();

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !isClientConnected) return;

    const messageRequest: MessageRequest = {
      chatId: 'example-chat-id',
      content: newMessage.trim(),
      type: 'TEXT'
    };

    sendChatMessage(messageRequest);
    
    // Add optimistic message to local state
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text: newMessage.trim(),
      senderId: 'current-user',
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
  };

  // Handle deleting a message
  const handleDeleteMessage = (messageId: ResId) => {
    deleteChatMessage(messageId);
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Handle marking message as seen
  const handleMarkAsSeen = (messageId: ResId) => {
    setMessageSeen(messageId);
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isClientConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isClientConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      {isClientConnected ? 'Connected' : 'Disconnected'}
    </div>
  );

  // Migration information panel
  const MigrationInfo = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-blue-900">Migration Status</h3>
        <button
          onClick={() => setShowMigrationInfo(!showMigrationInfo)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showMigrationInfo ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showMigrationInfo && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Using Enterprise:</span>
            <span className={`font-medium ${
              migration.isUsingEnterprise ? 'text-green-600' : 'text-orange-600'
            }`}>
              {migration.isUsingEnterprise ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Fallback Active:</span>
            <span className={`font-medium ${
              migration.isFallbackActive ? 'text-red-600' : 'text-gray-600'
            }`}>
              {migration.isFallbackActive ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Messages Sent:</span>
            <span className="font-medium">{migration.performanceMetrics.messageCount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Errors:</span>
            <span className={`font-medium ${
              migration.performanceMetrics.errorCount > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {migration.performanceMetrics.errorCount}
            </span>
          </div>
          
          {migration.performanceMetrics.enterpriseLatency && (
            <div className="flex justify-between">
              <span className="text-gray-600">Enterprise Latency:</span>
              <span className="font-medium">
                {migration.performanceMetrics.enterpriseLatency.toFixed(2)}ms
              </span>
            </div>
          )}
          
          {migration.performanceMetrics.legacyLatency && (
            <div className="flex justify-between">
              <span className="text-gray-600">Legacy Latency:</span>
              <span className="font-medium">
                {migration.performanceMetrics.legacyLatency.toFixed(2)}ms
              </span>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-gray-500">
              Last Event: {migration.lastMigrationEvent}
            </div>
          </div>
          
          {migration.migrationErrors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="text-sm font-medium text-red-700 mb-2">Recent Errors:</div>
              <div className="space-y-1">
                {migration.migrationErrors.slice(-3).map((error, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Chat Migration Example
            </h2>
            <ConnectionStatus />
          </div>
        </div>

        {/* Migration Information */}
        <MigrationInfo />

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {!message.isOwn && (
                      <button
                        onClick={() => handleMarkAsSeen(message.id)}
                        className="text-xs underline hover:no-underline"
                      >
                        Mark as seen
                      </button>
                    )}
                    {message.isOwn && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-xs underline hover:no-underline text-red-200"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              disabled={!isClientConnected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!isClientConnected || !newMessage.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMigrationExample;
