/**
 * Chat Feature Demo - Complete Showcase
 * 
 * This component demonstrates all the advanced features of the transformed chat system:
 * - Multi-chat support with real-time updates
 * - Performance monitoring and analytics
 * - Presence indicators and typing status
 * - Advanced caching strategies
 * - Error handling and recovery
 * - Engagement metrics and trends
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
import { 
    PresenceIndicator, 
    TypingIndicator, 
    ChatPresenceBar,
    MessageInputWithTyping,
    UserListWithPresence
} from '@/features/chat/components/ChatPresenceComponents';

interface ChatDemoProps {
    currentUserId: string;
}

export const ChatFeatureDemo: React.FC<ChatDemoProps> = ({ currentUserId }) => {
    const [selectedChat, setSelectedChat] = useState<string>('chat-1');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const [cacheStrategy, setCacheStrategy] = useState<'aggressive' | 'moderate' | 'conservative'>('moderate');

    // Initialize chat with all features enabled
    const chat = useUnifiedChat(currentUserId, selectedChat, {
        enableRealTime: true,
        enableOptimisticUpdates: true,
        cacheStrategy,
        refetchInterval: {
            chats: 30000,        // 30 seconds
            messages: 10000,     // 10 seconds
            participants: 20000,  // 20 seconds
            unreadCount: 5000     // 5 seconds
        }
    });

    // Demo participants for different chats
    const chatParticipants = {
        'chat-1': ['user-1', 'user-2', 'user-3'],
        'chat-2': ['user-4', 'user-5', 'user-6'],
        'chat-3': ['user-7', 'user-8', 'user-9']
    };

    // Sample chats for demo
    const sampleChats = [
        { id: 'chat-1', name: 'Team Chat', lastMessage: 'Working on the new feature...' },
        { id: 'chat-2', name: 'Project Discussion', lastMessage: 'Great progress today!' },
        { id: 'chat-3', name: 'General', lastMessage: 'Welcome to the team!' }
    ];

    // Track analytics events
    useEffect(() => {
        if (chat.chats?.content) {
            chat.recordAnalyticsEvent?.({
                type: 'chat_loaded',
                userId: currentUserId,
                timestamp: Date.now(),
                metadata: { chatCount: chat.chats.content.length }
            });
        }
    }, [chat.chats?.content]);

    const handleSendMessage = async (message: string) => {
        try {
            await chat.sendMessage({
                chatId: selectedChat,
                messageData: { 
                    content: message,
                    type: 'text',
                    timestamp: Date.now()
                }
            });

            // Track message event
            chat.recordAnalyticsEvent?.({
                type: 'message_sent',
                userId: currentUserId,
                chatId: selectedChat,
                timestamp: Date.now(),
                metadata: { 
                    messageLength: message.length,
                    chatId: selectedChat 
                }
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleCreateChat = async () => {
        try {
            const newChat = await chat.createChat({
                userIds: [currentUserId, 'user-new'],
                text: 'Started a new conversation'
            });

            chat.recordAnalyticsEvent?.({
                type: 'chat_created',
                userId: currentUserId,
                chatId: newChat.id,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const handlePresenceUpdate = async (status: 'online' | 'offline' | 'away' | 'busy') => {
        try {
            await chat.updatePresence?.(status);
        } catch (error) {
            console.error('Failed to update presence:', error);
        }
    };

    const handleRetryFailedQueries = async () => {
        try {
            await chat.retryFailedQueries?.();
        } catch (error) {
            console.error('Failed to retry queries:', error);
        }
    };

    return (
        <div className=\"max-w-7xl mx-auto p-6 space-y-6\">
            {/* Header */}
            <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
                <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">
                    🚀 Advanced Chat Feature Demo
                </h1>
                <p className=\"text-gray-600\">
                    Showcase of enterprise-grade chat with real-time features, analytics, and performance monitoring
                </p>
            </div>

            {/* Control Panel */}
            <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
                <h2 className=\"text-xl font-semibold text-gray-900 mb-4\">Control Panel</h2>
                
                <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
                    {/* Cache Strategy */}
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                            Cache Strategy
                        </label>
                        <select
                            value={cacheStrategy}
                            onChange={(e) => setCacheStrategy(e.target.value as any)}
                            className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                        >
                            <option value=\"aggressive\">Aggressive</option>
                            <option value=\"moderate\">Moderate</option>
                            <option value=\"conservative\">Conservative</option>
                        </select>
                    </div>

                    {/* Presence Status */}
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                            Your Status
                        </label>
                        <div className=\"flex space-x-2\">
                            {(['online', 'away', 'busy', 'offline'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => handlePresenceUpdate(status)}
                                    className=\"px-3 py-1 text-xs font-medium rounded-md bg-gray-100 hover:bg-gray-200\"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                            Actions
                        </label>
                        <div className=\"flex space-x-2\">
                            <button
                                onClick={() => setShowAnalytics(!showAnalytics)}
                                className=\"px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200\"
                            >
                                {showAnalytics ? 'Hide' : 'Show'} Analytics
                            </button>
                            <button
                                onClick={() => setShowMetrics(!showMetrics)}
                                className=\"px-3 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200\"
                            >
                                {showMetrics ? 'Hide' : 'Show'} Metrics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Handling */}
                {chat.error && (
                    <div className=\"mt-4 p-4 bg-red-50 border border-red-200 rounded-md\">
                        <div className=\"flex items-center justify-between\">
                            <div>
                                <h4 className=\"text-sm font-medium text-red-800\">Error Detected</h4>
                                <p className=\"text-sm text-red-600\">{chat.error.message}</p>
                            </div>
                            <button
                                onClick={handleRetryFailedQueries}
                                className=\"px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200\"
                            >
                                Retry
                            </button>
                        </div>
                        {chat.getErrorSummary?.().map((err, index) => (
                            <div key={index} className=\"text-xs text-red-500 mt-1\">
                                {err.type}: {err.error}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
                {/* Chat List */}
                <div className=\"lg:col-span-1 space-y-4\">
                    {/* Chat Selection */}
                    <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-4\">
                        <h3 className=\"text-lg font-semibold text-gray-900 mb-3\">Chats</h3>
                        <div className=\"space-y-2\">
                            {sampleChats.map(chat => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                        selectedChat === chat.id 
                                            ? 'bg-blue-50 border-blue-200 border' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className=\"font-medium text-gray-900\">{chat.name}</div>
                                    <div className=\"text-sm text-gray-500\">{chat.lastMessage}</div>
                                    <div className=\"mt-2\">
                                        <TypingIndicator 
                                            chatId={chat.id} 
                                            participantIds={chatParticipants[chat.id as keyof typeof chatParticipants] || []}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleCreateChat}
                            className=\"mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600\"
                        >
                            Create New Chat
                        </button>
                    </div>

                    {/* User List */}
                    <UserListWithPresence 
                        participantIds={chatParticipants[selectedChat as keyof typeof chatParticipants] || []}
                        currentChatId={selectedChat}
                    />
                </div>

                {/* Main Chat Area */}
                <div className=\"lg:col-span-2 space-y-4\">
                    {/* Chat Window */}
                    <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden\">
                        <div className=\"px-4 py-3 border-b border-gray-200 bg-gray-50\">
                            <div className=\"flex items-center justify-between\">
                                <h3 className=\"text-lg font-semibold text-gray-900\">
                                    {sampleChats.find(c => c.id === selectedChat)?.name}
                                </h3>
                                <PresenceIndicator userId={currentUserId} />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className=\"h-96 p-4 overflow-y-auto bg-gray-50\">
                            {chat.isLoading ? (
                                <div className=\"flex items-center justify-center h-full\">
                                    <div className=\"text-gray-500\">Loading messages...</div>
                                </div>
                            ) : (
                                <div className=\"space-y-3\">
                                    {/* Sample messages */}
                                    <div className=\"flex items-start space-x-3\">
                                        <div className=\"w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium\">
                                            U
                                        </div>
                                        <div className=\"flex-1\">
                                            <div className=\"bg-white p-3 rounded-lg shadow-sm\">
                                                <div className=\"text-sm font-medium text-gray-900\">User</div>
                                                <div className=\"text-gray-700\">Welcome to the advanced chat demo!</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className=\"flex items-start space-x-3\">
                                        <div className=\"w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium\">
                                            Y
                                        </div>
                                        <div className=\"flex-1\">
                                            <div className=\"bg-blue-50 p-3 rounded-lg shadow-sm\">
                                                <div className=\"text-sm font-medium text-gray-900\">You</div>
                                                <div className=\"text-gray-700\">This is amazing! Real-time updates, presence indicators, analytics...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <ChatPresenceBar 
                            chatId={selectedChat}
                            participantIds={chatParticipants[selectedChat as keyof typeof chatParticipants] || []}
                        />
                        
                        <MessageInputWithTyping 
                            chatId={selectedChat}
                            onSendMessage={handleSendMessage}
                        />
                    </div>

                    {/* Performance Metrics */}
                    {showMetrics && (
                        <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
                            <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Performance Metrics</h3>
                            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
                                {chat.getMetrics?.() && (
                                    <>
                                        <div className=\"text-center p-4 bg-blue-50 rounded-lg\">
                                            <div className=\"text-2xl font-bold text-blue-600\">
                                                {chat.getMetrics().queryMetrics.totalQueries}
                                            </div>
                                            <div className=\"text-sm text-gray-600\">Total Queries</div>
                                        </div>
                                        <div className=\"text-center p-4 bg-green-50 rounded-lg\">
                                            <div className=\"text-2xl font-bold text-green-600\">
                                                {(chat.getMetrics().queryMetrics.cacheHitRate * 100).toFixed(1)}%
                                            </div>
                                            <div className=\"text-sm text-gray-600\">Cache Hit Rate</div>
                                        </div>
                                        <div className=\"text-center p-4 bg-purple-50 rounded-lg\">
                                            <div className=\"text-2xl font-bold text-purple-600\">
                                                {chat.getMetrics().queryMetrics.averageQueryTime.toFixed(0)}ms
                                            </div>
                                            <div className=\"text-sm text-gray-600\">Avg Query Time</div>
                                        </div>
                                        <div className=\"text-center p-4 bg-orange-50 rounded-lg\">
                                            <div className=\"text-2xl font-bold text-orange-600\">
                                                {chat.getMetrics().interactionMetrics.messagesPerSession}
                                            </div>
                                            <div className=\"text-sm text-gray-600\">Messages Sent</div>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {chat.getPerformanceSummary?.() && (
                                <div className=\"mt-4 p-4 bg-gray-50 rounded-lg\">
                                    <div className=\"flex items-center justify-between\">
                                        <div>
                                            <span className=\"text-sm font-medium text-gray-700\">Overall Performance: </span>
                                            <span className={`text-sm font-bold ${
                                                chat.getPerformanceSummary().overall === 'excellent' ? 'text-green-600' :
                                                chat.getPerformanceSummary().overall === 'good' ? 'text-blue-600' :
                                                chat.getPerformanceSummary().overall === 'fair' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {chat.getPerformanceSummary().overall.toUpperCase()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => chat.resetMetrics?.()}
                                            className=\"px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50\"
                                        >
                                            Reset Metrics
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Dashboard */}
                    {showAnalytics && (
                        <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
                            <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Analytics Dashboard</h3>
                            <div className=\"space-y-4\">
                                <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                                    <div className=\"p-4 bg-indigo-50 rounded-lg\">
                                        <h4 className=\"font-medium text-indigo-900 mb-2\">User Engagement</h4>
                                        <div className=\"text-sm text-indigo-700\">
                                            <div>Active Users: Loading...</div>
                                            <div>Messages per User: Loading...</div>
                                            <div>Retention Rate: Loading...</div>
                                        </div>
                                    </div>
                                    <div className=\"p-4 bg-pink-50 rounded-lg\">
                                        <h4 className=\"font-medium text-pink-900 mb-2\">Chat Activity</h4>
                                        <div className=\"text-sm text-pink-700\">
                                            <div>Total Chats: Loading...</div>
                                            <div>Active Chats: Loading...</div>
                                            <div>Creation Rate: Loading...</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className=\"p-4 bg-yellow-50 rounded-lg\">
                                    <h4 className=\"font-medium text-yellow-900 mb-2\">Recent Events</h4>
                                    <div className=\"text-sm text-yellow-700 space-y-1\">
                                        <div>• Message sent to {selectedChat}</div>
                                        <div>• Chat loaded successfully</div>
                                        <div>• Presence updated to online</div>
                                        <div>• Metrics collected</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Showcase */}
            <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
                <h2 className=\"text-xl font-semibold text-gray-900 mb-4\">🎯 Features Demonstrated</h2>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
                    {[
                        { title: 'Multi-Chat Support', desc: 'Dynamic chat switching with independent state', icon: '💬' },
                        { title: 'Real-time Updates', desc: 'WebSocket integration with live presence', icon: '⚡' },
                        { title: 'Performance Monitoring', desc: 'Real-time metrics and performance tracking', icon: '📊' },
                        { title: 'Advanced Caching', desc: 'Strategy-based TTL with intelligent invalidation', icon: '🗄️' },
                        { title: 'Presence Indicators', desc: 'Online status and typing indicators', icon: '👥' },
                        { title: 'Analytics Engine', desc: 'User engagement and activity analytics', icon: '📈' },
                        { title: 'Error Recovery', desc: 'Automatic retry with detailed error summaries', icon: '🔧' },
                        { title: 'Optimistic Updates', desc: 'Instant UI updates with rollback support', icon: '⚡' },
                        { title: 'Type Safety', desc: 'Full TypeScript support with comprehensive types', icon: '🛡️' }
                    ].map((feature, index) => (
                        <div key={index} className=\"p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors\">
                            <div className=\"flex items-center space-x-3 mb-2\">
                                <span className=\"text-2xl\">{feature.icon}</span>
                                <h3 className=\"font-medium text-gray-900\">{feature.title}</h3>
                            </div>
                            <p className=\"text-sm text-gray-600\">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatFeatureDemo;
