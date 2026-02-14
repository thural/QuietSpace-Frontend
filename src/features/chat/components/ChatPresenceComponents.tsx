/**
 * Chat Presence Components
 * 
 * React components for displaying presence information and typing indicators
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
import { useTypingIndicator } from '@/features/chat/application/hooks/useChatPresence';

interface PresenceIndicatorProps {
    userId: string;
    showStatus?: boolean;
    showTyping?: boolean;
    className?: string;
}

/**
 * Component to display user presence status
 */
export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
    userId,
    showStatus = true,
    showTyping = true,
    className = ''
}) => {
    const chat = useUnifiedChat('current-user'); // This would be the current user ID
    
    const userPresence = chat.getUserPresence?.(userId);
    const isTyping = userPresence?.isTyping && userPresence?.typingInChat;
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'busy': return 'bg-red-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'online': return 'Online';
            case 'away': return 'Away';
            case 'busy': return 'Busy';
            case 'offline': return 'Offline';
            default: return 'Unknown';
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className=\"relative\">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(userPresence?.status || 'offline')}`} />
                {isTyping && showTyping && (
                    <div className=\"absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse\" />
                )}
            </div>
            
            {showStatus && (
                <span className=\"text-sm text-gray-600\">
                    {getStatusText(userPresence?.status || 'offline')}
                </span>
            )}
            
            {isTyping && showTyping && (
                <span className=\"text-sm text-blue-600 italic\">
                    typing...
                </span>
            )}
        </div>
    );
};

interface TypingIndicatorProps {
    chatId: string;
    participantIds: string[];
    className?: string;
}

/**
 * Component to display typing indicators for a chat
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
    chatId,
    participantIds,
    className = ''
}) => {
    const chat = useUnifiedChat('current-user');
    const typingUsers = chat.getTypingUsers?.(chatId) || [];
    
    // Filter out current user from typing list
    const otherTypingUsers = typingUsers.filter(userId => userId !== 'current-user');
    
    if (otherTypingUsers.length === 0) {
        return null;
    }

    const getTypingText = () => {
        if (otherTypingUsers.length === 1) {
            return 'Someone is typing...';
        } else if (otherTypingUsers.length === 2) {
            return 'Two people are typing...';
        } else {
            return 'Several people are typing...';
        }
    };

    return (
        <div className={`flex items-center space-x-2 text-sm text-gray-500 italic ${className}`}>
            <div className=\"flex space-x-1\">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className=\"w-1 h-1 bg-gray-400 rounded-full animate-bounce\"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    />
                ))}
            </div>
            <span>{getTypingText()}</span>
        </div>
    );
};

interface ChatPresenceBarProps {
    chatId: string;
    participantIds: string[];
    className?: string;
}

/**
 * Component to display presence information for all chat participants
 */
export const ChatPresenceBar: React.FC<ChatPresenceBarProps> = ({
    chatId,
    participantIds,
    className = ''
}) => {
    const chat = useUnifiedChat('current-user');
    const onlineUsers = chat.getOnlineUsers?.(chatId, participantIds) || [];
    const typingUsers = chat.getTypingUsers?.(chatId) || [];
    
    const presenceSummary = chat.getOnlineUsers ? 
        chat.getOnlineUsers(chatId, participantIds) : [];

    return (
        <div className={`border-t border-gray-200 px-4 py-2 bg-gray-50 ${className}`}>
            <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center space-x-4\">
                    <div className=\"text-sm text-gray-600\">
                        {onlineUsers.length} of {participantIds.length} online
                    </div>
                    
                    <div className=\"flex -space-x-2\">
                        {onlineUsers.slice(0, 5).map((user, index) => (
                            <div
                                key={user.userId}
                                className=\"w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium\"
                                title={user.userId}
                            >
                                {user.userId.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {onlineUsers.length > 5 && (
                            <div className=\"w-6 h-6 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white text-xs font-medium\">
                                +{onlineUsers.length - 5}
                            </div>
                        )}
                    </div>
                </div>
                
                {typingUsers.length > 0 && (
                    <TypingIndicator 
                        chatId={chatId} 
                        participantIds={participantIds}
                        className=\"text-xs\"
                    />
                )}
            </div>
        </div>
    );
};

interface MessageInputProps {
    chatId: string;
    onSendMessage: (message: string) => void;
    className?: string;
}

/**
 * Message input with typing indicator integration
 */
export const MessageInputWithTyping: React.FC<MessageInputProps> = ({
    chatId,
    onSendMessage,
    className = ''
}) => {
    const [message, setMessage] = useState('');
    const chat = useUnifiedChat('current-user');
    const { startTyping, stopTyping } = useTypingIndicator('current-user', chatId);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);
        
        if (value.trim()) {
            startTyping();
        } else {
            stopTyping();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
            stopTyping();
        }
    };

    const handleBlur = () => {
        stopTyping();
    };

    return (
        <div className={`border-t border-gray-200 px-4 py-3 ${className}`}>
            <div className=\"flex items-center space-x-2\">
                <input
                    type=\"text\"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    placeholder=\"Type a message...\"
                    className=\"flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
                />
                <button
                    onClick={() => {
                        if (message.trim()) {
                            onSendMessage(message.trim());
                            setMessage('');
                            stopTyping();
                        }
                    }}
                    disabled={!message.trim()}
                    className=\"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed\"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

interface UserListProps {
    participantIds: string[];
    currentChatId?: string;
    className?: string;
}

/**
 * User list with presence indicators
 */
export const UserListWithPresence: React.FC<UserListProps> = ({
    participantIds,
    currentChatId,
    className = ''
}) => {
    const chat = useUnifiedChat('current-user');

    return (
        <div className={`border border-gray-200 rounded-lg ${className}`}>
            <div className=\"px-4 py-2 border-b border-gray-200 bg-gray-50\">
                <h3 className=\"text-sm font-medium text-gray-900\">Participants</h3>
            </div>
            
            <div className=\"divide-y divide-gray-200\">
                {participantIds.map((userId) => {
                    const userPresence = chat.getUserPresence?.(userId);
                    const isTyping = userPresence?.isTyping && userPresence?.typingInChat === currentChatId;
                    
                    return (
                        <div key={userId} className=\"px-4 py-3 flex items-center justify-between hover:bg-gray-50\">
                            <div className=\"flex items-center space-x-3\">
                                <div className=\"w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium\">
                                    {userId.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className=\"text-sm font-medium text-gray-900\">
                                        {userId}
                                    </div>
                                    {isTyping && (
                                        <div className=\"text-xs text-blue-600 italic\">
                                            typing...
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <PresenceIndicator 
                                userId={userId} 
                                showStatus={true}
                                showTyping={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

