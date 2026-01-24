/**
 * Chat Presence Hook
 * 
 * Provides easy access to presence features including:
 * - User online/offline status
 * - Typing indicators
 * - Presence management
 * - Real-time presence updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatServices } from './useChatServices';
import type { UserPresence } from '@/features/chat/application/services/ChatPresenceService';

export interface UseChatPresenceOptions {
    autoInitialize?: boolean;
    enableTypingIndicators?: boolean;
    heartbeatInterval?: number;
}

export interface ChatPresenceState {
    // Current user presence
    isOnline: boolean;
    currentStatus: UserPresence['status'];
    currentChat?: string;
    
    // Other users presence
    userPresences: Map<string, UserPresence>;
    typingUsers: Map<string, Set<string>>; // chatId -> Set of userIds
    
    // Presence statistics
    presenceStats: {
        totalUsers: number;
        onlineUsers: number;
        typingUsers: number;
        activeChats: number;
    };
    
    // Loading state
    isLoading: boolean;
    error: Error | null;
}

export interface ChatPresenceActions {
    // Presence management
    updateStatus: (status: UserPresence['status']) => Promise<void>;
    setCurrentChat: (chatId: string) => Promise<void>;
    
    // Typing indicators
    startTyping: (chatId: string) => void;
    stopTyping: (chatId: string) => void;
    
    // Presence queries
    getUserPresence: (userId: string) => UserPresence | null;
    getTypingUsers: (chatId: string) => string[];
    getOnlineUsers: (chatId: string, participantIds: string[]) => UserPresence[];
    getPresenceSummary: (userIds: string[]) => {
        online: number;
        offline: number;
        away: number;
        busy: number;
        typing: number;
    };
    
    // Lifecycle
    initialize: (userId: string) => Promise<void>;
    cleanup: () => void;
}

/**
 * Hook for managing chat presence and typing indicators
 */
export const useChatPresence = (
    userId: string,
    options: UseChatPresenceOptions = {}
): ChatPresenceState & ChatPresenceActions => {
    const {
        autoInitialize = true,
        enableTypingIndicators = true,
        heartbeatInterval = 30000
    } = options;

    const { chatPresenceService } = useChatServices();
    const isInitialized = useRef(false);

    // State
    const [isOnline, setIsOnline] = useState(false);
    const [currentStatus, setCurrentStatusState] = useState<UserPresence['status']>('offline');
    const [currentChat, setCurrentChatState] = useState<string | undefined>();
    const [userPresences, setUserPresences] = useState<Map<string, UserPresence>>(new Map());
    const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Initialize presence service
    const initialize = useCallback(async (userId: string) => {
        if (isInitialized.current) return;

        setIsLoading(true);
        setError(null);

        try {
            await chatPresenceService.initialize(userId);
            isInitialized.current = true;
            setIsOnline(true);
            setCurrentStatusState('online');
        } catch (err) {
            setError(err as Error);
            console.error('Failed to initialize presence service:', err);
        } finally {
            setIsLoading(false);
        }
    }, [chatPresenceService]);

    // Cleanup presence service
    const cleanup = useCallback(() => {
        if (isInitialized.current) {
            chatPresenceService.cleanup();
            isInitialized.current = false;
            setIsOnline(false);
            setCurrentStatusState('offline');
            setCurrentChatState(undefined);
        }
    }, [chatPresenceService]);

    // Update user status
    const updateStatus = useCallback(async (status: UserPresence['status']) => {
        if (!isInitialized.current) return;

        try {
            await chatPresenceService.updatePresence(userId, status, currentChat);
            setCurrentStatusState(status);
            
            if (status === 'offline') {
                setIsOnline(false);
            } else {
                setIsOnline(true);
            }
        } catch (err) {
            setError(err as Error);
            console.error('Failed to update status:', err);
        }
    }, [chatPresenceService, userId, currentChat]);

    // Set current chat
    const setCurrentChat = useCallback(async (chatId: string) => {
        if (!isInitialized.current) return;

        try {
            await chatPresenceService.updatePresence(userId, currentStatus, chatId);
            setCurrentChatState(chatId);
        } catch (err) {
            setError(err as Error);
            console.error('Failed to set current chat:', err);
        }
    }, [chatPresenceService, userId, currentStatus]);

    // Start typing indicator
    const startTyping = useCallback((chatId: string) => {
        if (!enableTypingIndicators || !isInitialized.current) return;

        chatPresenceService.startTyping(userId, chatId);
        
        // Update local state for immediate UI feedback
        setTypingUsers(prev => {
            const newMap = new Map(prev);
            if (!newMap.has(chatId)) {
                newMap.set(chatId, new Set());
            }
            newMap.get(chatId)!.add(userId);
            return newMap;
        });
    }, [chatPresenceService, userId, enableTypingIndicators]);

    // Stop typing indicator
    const stopTyping = useCallback((chatId: string) => {
        if (!enableTypingIndicators || !isInitialized.current) return;

        chatPresenceService.stopTyping(userId, chatId);
        
        // Update local state for immediate UI feedback
        setTypingUsers(prev => {
            const newMap = new Map(prev);
            const chatTypingUsers = newMap.get(chatId);
            if (chatTypingUsers) {
                chatTypingUsers.delete(userId);
                if (chatTypingUsers.size === 0) {
                    newMap.delete(chatId);
                }
            }
            return newMap;
        });
    }, [chatPresenceService, userId, enableTypingIndicators]);

    // Get user presence
    const getUserPresence = useCallback((userId: string): UserPresence | null => {
        return chatPresenceService.getUserPresence(userId);
    }, [chatPresenceService]);

    // Get typing users for a chat
    const getTypingUsers = useCallback((chatId: string): string[] => {
        return chatPresenceService.getTypingUsers(chatId);
    }, [chatPresenceService]);

    // Get online users in a chat
    const getOnlineUsers = useCallback((chatId: string, participantIds: string[]): UserPresence[] => {
        return chatPresenceService.getOnlineUsers(chatId, participantIds);
    }, [chatPresenceService]);

    // Get presence summary
    const getPresenceSummary = useCallback((userIds: string[]) => {
        return chatPresenceService.getPresenceSummary(userIds);
    }, [chatPresenceService]);

    // Calculate presence statistics
    const presenceStats = chatPresenceService.getPresenceStats();

    // Auto-initialize
    useEffect(() => {
        if (autoInitialize && userId) {
            initialize(userId);
        }

        return () => {
            if (autoInitialize) {
                cleanup();
            }
        };
    }, [userId, autoInitialize, initialize, cleanup]);

    // Handle page visibility changes for presence management
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!isInitialized.current) return;

            if (document.hidden) {
                // User switched tabs - set to away
                updateStatus('away');
            } else {
                // User returned to tab - set to online
                updateStatus('online');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [updateStatus]);

    // Handle window focus/blur for typing indicators
    useEffect(() => {
        const handleWindowBlur = () => {
            // Stop typing when window loses focus
            if (currentChat) {
                stopTyping(currentChat);
            }
        };

        window.addEventListener('blur', handleWindowBlur);
        return () => {
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [currentChat, stopTyping]);

    return {
        // State
        isOnline,
        currentStatus,
        currentChat,
        userPresences,
        typingUsers,
        presenceStats,
        isLoading,
        error,

        // Actions
        updateStatus,
        setCurrentChat,
        startTyping,
        stopTyping,
        getUserPresence,
        getTypingUsers,
        getOnlineUsers,
        getPresenceSummary,
        initialize,
        cleanup
    };
};

/**
 * Hook for typing indicator with debouncing
 */
export const useTypingIndicator = (
    userId: string,
    chatId: string,
    debounceMs: number = 1000
) => {
    const { startTyping, stopTyping } = useChatPresence(userId, {
        enableTypingIndicators: true
    });

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false);

    const startTypingDebounced = useCallback(() => {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            startTyping(chatId);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            stopTyping(chatId);
        }, debounceMs);
    }, [startTyping, stopTyping, chatId, debounceMs]);

    const stopTypingImmediate = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTypingRef.current) {
            isTypingRef.current = false;
            stopTyping(chatId);
        }
    }, [stopTyping, chatId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTypingImmediate();
        };
    }, [stopTypingImmediate]);

    return {
        startTyping: startTypingDebounced,
        stopTyping: stopTypingImmediate
    };
};

/**
 * Hook for user presence in a specific chat
 */
export const useChatPresence = (
    userId: string,
    chatId: string,
    participantIds: string[] = []
) => {
    const presence = useChatPresence(userId);
    
    const onlineUsers = presence.getOnlineUsers(chatId, participantIds);
    const typingUsers = presence.getTypingUsers(chatId);
    const presenceSummary = presence.getPresenceSummary(participantIds);

    return {
        ...presence,
        // Chat-specific data
        onlineUsers,
        typingUsers,
        presenceSummary,
        
        // Convenience methods
        isUserOnline: (userId: string) => {
            const userPresence = presence.getUserPresence(userId);
            return userPresence?.status === 'online';
        },
        isUserTyping: (userId: string) => {
            return typingUsers.includes(userId);
        }
    };
};
