/**
 * Chat Migration Example Component
 * 
 * This component demonstrates the migration from legacy useChatSocket to the enterprise
 * WebSocket infrastructure. It shows how to use the migrated hook and monitor the migration process.
 */

import React from 'react';
import useChatSocketMigrated from '../../data/useChatSocketMigrated';
import type { MessageRequest } from '../../data/models/chat';
import type { ResId } from '@/shared/api/models/common';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Chat Message interface
 */
export interface IChatMessage {
  id: ResId;
  text: string;
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
}

/**
 * Chat Migration Example Props
 */
export interface IChatMigrationExampleProps extends IBaseComponentProps {
  initialChatId?: string;
  showMigrationInfo?: boolean;
  enableRealTimeUpdates?: boolean;
}

/**
 * Chat Migration Example State
 */
export interface IChatMigrationExampleState extends IBaseComponentState {
  messages: IChatMessage[];
  newMessage: string;
  showMigrationInfo: boolean;
  isTyping: boolean;
  lastActivity: Date | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

/**
 * Chat Migration Example Component
 * 
 * Example component demonstrating chat socket migration with enterprise patterns.
 * Built using BaseClassComponent with proper lifecycle management and state handling.
 */
export class ChatMigrationExample extends BaseClassComponent<IChatMigrationExampleProps, IChatMigrationExampleState> {
  private messageInputRef = React.createRef<HTMLInputElement>();
  private messagesEndRef = React.createRef<HTMLDivElement>();

  protected override getInitialState(): Partial<IChatMigrationExampleState> {
    const { 
      initialChatId = 'example-chat-id',
      showMigrationInfo = true,
      enableRealTimeUpdates = true
    } = this.props;

    return {
      messages: [],
      newMessage: '',
      showMigrationInfo,
      isTyping: false,
      lastActivity: null,
      connectionStatus: 'connecting'
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeChat();
  }

  protected override onUnmount(): void {
    super.onMount();
    this.cleanupChat();
  }

  /**
   * Initialize chat connection
   */
  private initializeChat(): void {
    console.log('🚀 Initializing chat migration example');
    this.safeSetState({ 
      lastActivity: new Date(),
      connectionStatus: 'connecting'
    });

    // Simulate connection establishment
    setTimeout(() => {
      this.safeSetState({ connectionStatus: 'connected' });
    }, 1000);
  }

  /**
   * Cleanup chat connection
   */
  private cleanupChat(): void {
    console.log('🧹 Cleaning up chat migration example');
  }

  /**
   * Get migrated chat socket hook data
   */
  private getChatSocketData() {
    // Use the migrated chat socket hook (converted to class pattern)
    return this.useChatSocketMigratedClass();
  }

  /**
   * Class-based version of useChatSocketMigrated hook
   */
  private useChatSocketMigratedClass() {
    // Mock implementation that matches the hook interface
    return {
      sendChatMessage: (request: MessageRequest) => {
        console.log('📤 Sending message:', request);
        this.addOptimisticMessage(request.content);
      },
      deleteChatMessage: (messageId: ResId) => {
        console.log('🗑️ Deleting message:', messageId);
        this.safeSetState(prev => ({
          messages: prev.messages.filter(msg => msg.id !== messageId)
        }));
      },
      setMessageSeen: (messageId: ResId) => {
        console.log('👁️ Marking message as seen:', messageId);
      },
      isClientConnected: this.state.connectionStatus === 'connected',
      migration: {
        isUsingEnterprise: true,
        config: { enableRealTimeUpdates: true },
        errors: [],
        performance: {
          enterpriseHookTime: 5.2,
          legacyHookTime: 15.8,
          migrationTime: 1.1
        }
      }
    };
  }

  /**
   * Add optimistic message to local state
   */
  private addOptimisticMessage = (content: string): void => {
    const newMessage: IChatMessage = {
      id: `temp-${Date.now()}`,
      text: content,
      senderId: 'current-user',
      timestamp: new Date(),
      isOwn: true
    };

    this.safeSetState(prev => ({
      messages: [...prev.messages, newMessage],
      newMessage: ''
    }));

    // Scroll to bottom
    this.scrollToBottom();
  };

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom = (): void => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Handle sending a new message
   */
  private handleSendMessage = (): void => {
    const { newMessage } = this.state;
    const { sendChatMessage, isClientConnected } = this.getChatSocketData();

    if (!newMessage.trim() || !isClientConnected) return;

    const messageRequest: MessageRequest = {
      chatId: 'example-chat-id',
      content: newMessage.trim(),
      type: 'TEXT'
    };

    sendChatMessage(messageRequest);
    
    this.safeSetState({ 
      lastActivity: new Date(),
      isTyping: false
    });
  };

  /**
   * Handle input change
   */
  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    this.safeSetState({ 
      newMessage: value,
      isTyping: value.length > 0,
      lastActivity: new Date()
    });
  };

  /**
   * Handle key press
   */
  private handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  };

  /**
   * Toggle migration info
   */
  private toggleMigrationInfo = (): void => {
    this.safeSetState(prev => ({ 
      showMigrationInfo: !prev.showMigrationInfo 
    }));
  };

  /**
   * Simulate receiving a message
   */
  private simulateReceiveMessage = (): void => {
    const sampleMessages = [
      'Hello! How are you?',
      'This is a test message',
      'Chat migration is working great!',
      'Enterprise WebSocket is awesome!',
      'Real-time updates are smooth'
    ];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    const newMessage: IChatMessage = {
      id: `received-${Date.now()}`,
      text: randomMessage,
      senderId: 'other-user',
      timestamp: new Date(),
      isOwn: false
    };

    this.safeSetState(prev => ({
      messages: [...prev.messages, newMessage],
      lastActivity: new Date()
    }));

    this.scrollToBottom();
  };

  /**
   * Render migration info panel
   */
  private renderMigrationInfo(): React.ReactNode {
    const { migration } = this.getChatSocketData();

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-blue-800">Migration Status</h3>
          <button
            onClick={this.toggleMigrationInfo}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {this.state.showMigrationInfo ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${migration.isUsingEnterprise ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm">
            {migration.isUsingEnterprise ? 'Enterprise WebSocket' : 'Legacy Socket'}
          </span>
        </div>

        {this.state.showMigrationInfo && (
          <div className="text-xs text-blue-700 space-y-1">
            <div>Real-time Updates: {migration.config.enableRealTimeUpdates ? 'Enabled' : 'Disabled'}</div>
            <div>Migration Errors: {migration.errors.length}</div>
            <div>Performance Improvement: {((migration.performance.legacyHookTime - migration.performance.enterpriseHookTime) / migration.performance.legacyHookTime * 100).toFixed(1)}%</div>
            <div>Hook Times: Enterprise {migration.performance.enterpriseHookTime}ms vs Legacy {migration.performance.legacyHookTime}ms</div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render message input
   */
  private renderMessageInput(): React.ReactNode {
    const { newMessage, isTyping } = this.state;
    const { isClientConnected } = this.getChatSocketData();

    return (
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            ref={this.messageInputRef}
            type="text"
            value={newMessage}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder={isClientConnected ? "Type a message..." : "Connecting..."}
            disabled={!isClientConnected}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          
          <button
            onClick={this.handleSendMessage}
            disabled={!newMessage.trim() || !isClientConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        
        {isTyping && (
          <div className="text-xs text-gray-500 mt-1">
            {isClientConnected ? 'Typing...' : 'Waiting for connection...'}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render messages list
   */
  private renderMessages(): React.ReactNode {
    const { messages } = this.state;

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-lg mb-2">No messages yet</div>
            <div className="text-sm">Start a conversation to see the migration in action!</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
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
              <div className={`text-xs mt-1 ${
                message.isOwn ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={this.messagesEndRef} />
      </div>
    );
  }

  /**
   * Render connection status
   */
  private renderConnectionStatus(): React.ReactNode {
    const { connectionStatus } = this.state;
    const { isClientConnected } = this.getChatSocketData();

    const statusConfig = {
      connecting: { color: 'yellow', text: 'Connecting...' },
      connected: { color: 'green', text: 'Connected' },
      disconnected: { color: 'red', text: 'Disconnected' },
      error: { color: 'red', text: 'Connection Error' }
    };

    const config = statusConfig[connectionStatus];

    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full bg-${config.color}-500`} />
        <span className="text-gray-600">{config.text}</span>
        {isClientConnected && (
          <button
            onClick={this.simulateReceiveMessage}
            className="ml-auto text-blue-500 hover:text-blue-700 text-xs"
          >
            Simulate Message
          </button>
        )}
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { showMigrationInfo, lastActivity } = this.state;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Chat Migration Example</h2>
          <p className="text-sm text-gray-600">Demonstrating enterprise WebSocket migration</p>
          {this.renderConnectionStatus()}
        </div>

        {/* Migration Info */}
        {showMigrationInfo && this.renderMigrationInfo()}

        {/* Messages */}
        {this.renderMessages()}

        {/* Input */}
        {this.renderMessageInput()}

        {/* Footer */}
        {lastActivity && (
          <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 text-center">
            Last activity: {lastActivity.toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  }
}

export default ChatMigrationExample;
