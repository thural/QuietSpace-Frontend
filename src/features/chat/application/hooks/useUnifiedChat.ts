/**
 * Unified Custom Chat Hook
 * 
 * Merges functionality from legacy chat hooks
 * Provides enterprise-grade custom query-based chat functionality with advanced features.
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation, useCustomInfiniteQuery } from '@/core/hooks';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/features/chat/data/models/chat";
import { useAuthStore } from "@core/store/zustand";
import type { ResId, JwtToken } from "@/shared/api/models/common";
import { useChatServices } from './useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';
import type { ChatMetrics } from '@/features/chat/application/services/ChatMetricsService';
import { CHAT_CACHE_KEYS } from '@chat/data/cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';

/**
 * Configuration options for the unified chat hook
 */
export interface UseChatOptions {
    enableRealTime?: boolean;
    enableOptimisticUpdates?: boolean;
    cacheStrategy?: 'aggressive' | 'moderate' | 'conservative';
    refetchInterval?: {
        chats?: number;
        messages?: number;
        participants?: number;
        unreadCount?: number;
    };
}

/**
 * Unified Chat State interface
 */
export interface UnifiedChatState {
    chats: any;
    messages: any;
    participants: any;
    unreadCount: any;
    isLoading: boolean;
    error: Error | null;

    // Additional query methods
    prefetchChats?: (userId: string) => Promise<void>;
    prefetchMessages?: (chatId: ResId) => Promise<void>;
    invalidateCache?: () => void;
    
    // Error handling methods
    retryFailedQueries?: () => Promise<void>;
    getErrorSummary?: () => Array<{ type: string; error: string }>;
    
    // Performance monitoring methods
    getMetrics?: () => ChatMetrics;
    getPerformanceSummary?: () => { overall: 'excellent' | 'good' | 'fair' | 'poor'; issues: string[]; recommendations: string[] };
    resetMetrics?: () => void;
    
    // Presence methods
    getUserPresence?: (userId: string) => any;
    getTypingUsers?: (chatId: string) => string[];
    getOnlineUsers?: (chatId: string, participantIds: string[]) => any[];
    startTyping?: (chatId: string) => void;
    stopTyping?: (chatId: string) => void;
    updatePresence?: (status: 'online' | 'offline' | 'away' | 'busy') => Promise<void>;
    
    // Analytics methods
    getAnalytics?: (filter?: any) => Promise<any>;
    getUserAnalytics?: (userId: string, filter?: any) => Promise<any>;
    getChatAnalytics?: (chatId: string, filter?: any) => Promise<any>;
    getEngagementTrends?: (days?: number) => Promise<any>;
    recordAnalyticsEvent?: (event: any) => void;
}

/**
 * Unified Chat Actions interface
 */
export interface UnifiedChatActions {
    createChat: any;
    deleteChat: any;
    sendMessage: any;
    updateChatSettings: any;
    searchChats: any;
    addParticipant: any;
    removeParticipant: any;
    markMessagesAsRead: any;
}

/**
 * Default configuration
 */
const DEFAULT_OPTIONS: Required<UseChatOptions> = {
    enableRealTime: true,
    enableOptimisticUpdates: true,
    cacheStrategy: 'moderate',
    refetchInterval: {
        chats: 30000,      // 30 seconds
        messages: 15000,   // 15 seconds
        participants: 20000, // 20 seconds
        unreadCount: 10000  // 10 seconds
    }
};

/**
 * Unified Custom Chat Hook
 * 
 * Combines enterprise-grade features with custom query system
 * with enterprise-grade caching, optimistic updates, and real-time capabilities.
 * 
 * @param userId - The user ID for user-specific operations
 * @param chatId - Optional chat ID for chat-specific operations (messages, participants)
 * @param options - Configuration options for the hook
 */
export const useUnifiedChat = (
    userId: string,
    chatId?: string,
    options: UseChatOptions = {}
): UnifiedChatState & UnifiedChatActions => {
    const [token, setToken] = useState<JwtToken | null>(null);
    const { chatDataService, chatFeatureService, webSocketService, chatMetricsService, chatPresenceService, chatAnalyticsService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    // Merge options with defaults
    const config = { ...DEFAULT_OPTIONS, ...options };
    
    // Override refetch intervals if not using real-time
    if (!config.enableRealTime) {
        config.refetchInterval = {
            chats: undefined,
            messages: undefined,
            participants: undefined,
            unreadCount: undefined
        };
    }

    useEffect(() => {
        const authStore = useAuthStore.getState();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);
    }, []);

    // Initialize presence service
    useEffect(() => {
        if (config.enableRealTime && userId) {
            chatPresenceService.initialize(userId);
            
            return () => {
                chatPresenceService.cleanup();
            };
        }
    }, [config.enableRealTime, userId, chatPresenceService]);

    // WebSocket connection and real-time updates
    useEffect(() => {
        if (!config.enableRealTime || !chatId) return;

        const connectWebSocket = async () => {
            try {
                // Connect to WebSocket (URL would come from environment/config)
                await webSocketService.connect('ws://localhost:8080/ws');
                
                // Subscribe to chat messages
                const unsubscribe = webSocketService.subscribe(`chat:${chatId}`, (message) => {
                    console.log('UnifiedChat: Received real-time message:', message);
                    
                    // Invalidate cache to trigger refetch
                    if (message.type === 'new_message') {
                        invalidateCache.invalidateChatData(chatId);
                    }
                });

                return () => {
                    unsubscribe();
                    webSocketService.disconnect();
                };
            } catch (error) {
                console.error('UnifiedChat: WebSocket connection failed:', error);
            }
        };

        connectWebSocket();
    }, [config.enableRealTime, chatId, webSocketService, invalidateCache]);

    // Get cache TTL based on strategy and data type
    const getCacheTime = (dataType: 'chats' | 'messages' | 'participants' | 'unread') => {
        const baseTime = CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME;
        const multipliers = {
            aggressive: {
                chats: 3,        // 15 minutes for chat list
                messages: 2.5,    // 12.5 minutes for messages
                participants: 2,  // 10 minutes for participants
                unread: 1.5       // 7.5 minutes for unread count
            },
            moderate: {
                chats: 1,        // 5 minutes for chat list
                messages: 1,      // 5 minutes for messages
                participants: 1,  // 5 minutes for participants
                unread: 1         // 5 minutes for unread count
            },
            conservative: {
                chats: 0.5,      // 2.5 minutes for chat list
                messages: 0.3,   // 1.5 minutes for messages
                participants: 0.4, // 2 minutes for participants
                unread: 0.2       // 1 minute for unread count
            }
        };
        
        const strategy = config.cacheStrategy === 'aggressive' ? 'aggressive' : 
                        config.cacheStrategy === 'conservative' ? 'conservative' : 'moderate';
        
        return baseTime * multipliers[strategy][dataType];
    };

    // Get stale time based on real-time setting and data type
    const getStaleTime = (dataType: 'chats' | 'messages' | 'participants' | 'unread') => {
        if (config.enableRealTime) {
            // For real-time, use shorter stale times
            const realtimeMultipliers = {
                chats: 2,        // 1 minute for chat list
                messages: 0.5,    // 15 seconds for messages
                participants: 1,  // 30 seconds for participants
                unread: 0.3       // 9 seconds for unread count
            };
            return CACHE_TIME_MAPPINGS.REALTIME_STALE_TIME * realtimeMultipliers[dataType];
        }
        
        // For non-real-time, use standard stale times
        return CACHE_TIME_MAPPINGS.CHAT_STALE_TIME;
    };

    // Get chats query with advanced features and performance tracking
    const chats = useCustomQuery(
        ['chats', userId, `strategy:${config.cacheStrategy}`, `realtime:${config.enableRealTime}`],
        async () => {
            const startTime = performance.now();
            try {
                if (!token) return { content: [] };
                const result = await chatDataService.getChats(userId, token);
                const duration = performance.now() - startTime;
                chatMetricsService.recordQuery('getChats', duration, true, false);
                return Array.isArray(result) ? { content: result } : result;
            } catch (error) {
                const duration = performance.now() - startTime;
                chatMetricsService.recordQuery('getChats', duration, false, false);
                throw error;
            }
        },
        {
            staleTime: getStaleTime('chats'),
            cacheTime: getCacheTime('chats'),
            enabled: !!userId && !!token,
            refetchInterval: config.refetchInterval.chats,
            onSuccess: (data) => {
                console.log('UnifiedChat: Chats loaded:', { 
                    userId, 
                    count: data.content?.length || 0,
                    strategy: config.cacheStrategy,
                    realTime: config.enableRealTime
                });
            },
            onError: (error) => {
                console.error('UnifiedChat: Error loading chats:', error);
            }
        }
    );

    // Get messages with pagination (only if chatId is provided)
    const messages = useCustomInfiniteQuery(
        chatId ? ['chats', 'messages', chatId, `strategy:${config.cacheStrategy}`, `realtime:${config.enableRealTime}`] : ['chats', 'messages', 'none'],
        async (pageParam = 0) => {
            if (!chatId || !token) return { data: [], hasNextPage: false, hasPreviousPage: false };
            const pagedMessage = await chatDataService.getMessages(chatId, pageParam, token);
            return {
                data: pagedMessage.content || [],
                hasNextPage: !pagedMessage.last,
                hasPreviousPage: !pagedMessage.first
            };
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.hasNextPage ? allPages.length : undefined;
            },
            staleTime: getStaleTime('messages'),
            cacheTime: getCacheTime('messages'),
            enabled: !!token && !!chatId,
            refetchInterval: config.refetchInterval.messages,
            onSuccess: (data, allPages) => {
                if (chatId) {
                    console.log('UnifiedChat: Messages loaded:', { 
                        chatId,
                        totalPages: allPages.length,
                        strategy: config.cacheStrategy,
                        realTime: config.enableRealTime
                    });
                }
            },
            onError: (error) => {
                if (chatId) {
                    console.error('UnifiedChat: Error loading messages:', { chatId, error });
                }
            }
        }
    );

    // Get participants (only if chatId is provided)
    const participants = useCustomQuery(
        chatId ? ['chats', 'participants', chatId, `strategy:${config.cacheStrategy}`, `realtime:${config.enableRealTime}`] : ['chats', 'participants', 'none'],
        async () => {
            if (!chatId || !token) return [];
            return await chatDataService.getChatParticipants(chatId, token);
        },
        {
            staleTime: getStaleTime('participants'),
            cacheTime: getCacheTime('participants'),
            enabled: !!token && !!chatId,
            refetchInterval: config.refetchInterval.participants,
            onSuccess: (data) => {
                if (chatId) {
                    console.log('UnifiedChat: Participants loaded:', { 
                        chatId,
                        count: data.length,
                        strategy: config.cacheStrategy,
                        realTime: config.enableRealTime
                    });
                }
            },
            onError: (error) => {
                if (chatId) {
                    console.error('UnifiedChat: Error loading participants:', { chatId, error });
                }
            }
        }
    );

    // Get unread count (now implemented)
    const unreadCount = useCustomQuery(
        ['chats', 'unreadCount', userId, `strategy:${config.cacheStrategy}`, `realtime:${config.enableRealTime}`],
        async () => {
            if (!token) return 0;
            return await chatDataService.getUnreadCount(userId, token);
        },
        {
            staleTime: getStaleTime('unread'),
            cacheTime: getCacheTime('unread'),
            enabled: !!userId && !!token,
            refetchInterval: config.refetchInterval.unreadCount,
            onSuccess: (data) => {
                console.log('UnifiedChat: Unread count loaded:', { 
                    userId, 
                    count: data,
                    strategy: config.cacheStrategy,
                    realTime: config.enableRealTime
                });
            },
            onError: (error) => {
                console.error('UnifiedChat: Error loading unread count:', error);
            }
        }
    );

    // Combined loading state
    const isLoading = chats.isLoading || messages.isLoading || participants.isLoading || unreadCount.isLoading || false;
    const error = chats.error || messages.error || participants.error || unreadCount.error || null;

    // Enhanced error recovery
    const retryFailedQueries = useCallback(async () => {
        const promises = [];
        
        if (chats.error && chats.refetch) {
            promises.push(chats.refetch());
        }
        if (messages.error && messages.refetch) {
            promises.push(messages.refetch());
        }
        if (participants.error && participants.refetch) {
            promises.push(participants.refetch());
        }
        if (unreadCount.error && unreadCount.refetch) {
            promises.push(unreadCount.refetch());
        }
        
        try {
            await Promise.all(promises);
            console.log('UnifiedChat: All failed queries retried successfully');
        } catch (retryError) {
            console.error('UnifiedChat: Error retrying queries:', retryError);
        }
    }, [chats, messages, participants, unreadCount]);

    // Get error summary for debugging
    const getErrorSummary = useCallback(() => {
        const errors = [];
        
        if (chats.error) errors.push({ type: 'chats', error: chats.error.message });
        if (messages.error) errors.push({ type: 'messages', error: messages.error.message });
        if (participants.error) errors.push({ type: 'participants', error: participants.error.message });
        if (unreadCount.error) errors.push({ type: 'unreadCount', error: unreadCount.error.message });
        
        return errors;
    }, [chats.error, messages.error, participants.error, unreadCount.error]);

    // Create chat mutation with enhanced optimistic updates and performance tracking
    const createChat = useCustomMutation(
        async (chatData: CreateChatRequest) => {
            const startTime = performance.now();
            try {
                const result = await chatFeatureService.createChatWithValidation(chatData, token);
                const duration = performance.now() - startTime;
                chatMetricsService.recordMutation('createChat', duration, true, config.enableOptimisticUpdates, false);
                return result;
            } catch (error) {
                const duration = performance.now() - startTime;
                chatMetricsService.recordMutation('createChat', duration, false, config.enableOptimisticUpdates, false);
                throw error;
            }
        },
        {
            onSuccess: (data) => {
                console.log('UnifiedChat: Chat created successfully:', data.id);
                invalidateCache.invalidateUserChatData(userId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error creating chat:', error);
                // Enhanced error handling
                if (error.status === 401) {
                    console.warn('UnifiedChat: Authentication error - user may need to re-login');
                } else if (error.status === 403) {
                    console.warn('UnifiedChat: Authorization error - insufficient permissions');
                } else if (error.status >= 500) {
                    console.error('UnifiedChat: Server error - retry may be appropriate');
                }
            },
            optimisticUpdate: config.enableOptimisticUpdates ? (cache, variables) => {
                const optimisticChat: ChatResponse = {
                    id: `temp-${Date.now()}`,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    userIds: variables.userIds || [],
                    members: [], // Will be populated with actual user data from user service
                    recentMessage: variables.text ? {
                        id: `temp-msg-${Date.now()}`,
                        createDate: new Date().toISOString(),
                        updateDate: new Date().toISOString(),
                        chatId: `temp-${Date.now()}`,
                        senderId: userId,
                        recipientId: variables.userIds?.find(id => id !== userId) || '',
                        text: variables.text,
                        senderName: 'You', // Will be updated with actual user data
                        isSeen: false
                    } : undefined
                };
                
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(userId);
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                cache.set(cacheKey, {
                    ...existingChats,
                    content: [optimisticChat, ...existingChats.content]
                });
                
                return () => {
                    const updatedChats = cache.get<any>(cacheKey) || { content: [] };
                    const filtered = updatedChats.content.filter((chat: any) => chat.id !== optimisticChat.id);
                    cache.set(cacheKey, { ...updatedChats, content: filtered });
                };
            } : undefined,
            retry: 3,
            retryDelay: 1000
        }
    );

    // Delete chat mutation with proper rollback
    const deleteChat = useCustomMutation(
        async ({ chatId }: { chatId: string }) => {
            return await chatDataService.deleteChat(chatId, token);
        },
        {
            onSuccess: (_, variables) => {
                console.log('UnifiedChat: Chat deleted successfully:', variables.chatId);
                invalidateCache.invalidateChatData(variables.chatId);
                invalidateCache.invalidateUserChatData(userId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error deleting chat:', error);
                // Enhanced error handling
                if (error.status === 404) {
                    console.warn('UnifiedChat: Chat not found - may have been already deleted');
                } else if (error.status === 403) {
                    console.warn('UnifiedChat: Cannot delete chat - insufficient permissions');
                }
            },
            optimisticUpdate: config.enableOptimisticUpdates ? (cache, variables) => {
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(userId);
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                const deletedChat = existingChats.content.find((chat: any) => chat.id === variables.chatId);
                const filteredChats = existingChats.content.filter((chat: any) => chat.id !== variables.chatId);
                cache.set(cacheKey, { ...existingChats, content: filteredChats });
                
                return () => {
                    if (deletedChat) {
                        const restoredChats = cache.get<any>(cacheKey) || { content: [] };
                        cache.set(cacheKey, { 
                            ...restoredChats, 
                            content: [deletedChat, ...restoredChats.content] 
                        });
                    }
                };
            } : undefined,
            retry: 2,
            retryDelay: 1000
        }
    );

    // Send message mutation with enhanced optimistic updates
    const sendMessage = useCustomMutation(
        async ({ chatId: messageChatId, messageData }: { chatId: string, messageData: any }) => {
            return await chatFeatureService.sendMessageWithValidation(messageChatId, messageData, token);
        },
        {
            onSuccess: (data) => {
                console.log('UnifiedChat: Message sent successfully:', data.id);
                // Track user interaction
                chatMetricsService.recordInteraction('message', { chatId, messageId: data.id });
                
                if (chatId) {
                    invalidateCache.invalidateChatData(chatId);
                }
            },
            onError: (error) => {
                console.error('UnifiedChat: Error sending message:', error);
                // Enhanced error handling
                if (error.status === 404) {
                    console.warn('UnifiedChat: Chat not found - cannot send message');
                } else if (error.status === 403) {
                    console.warn('UnifiedChat: Cannot send message - not a participant');
                } else if (error.status === 413) {
                    console.warn('UnifiedChat: Message too large - consider size limits');
                }
            },
            optimisticUpdate: config.enableOptimisticUpdates ? (cache, variables) => {
                const optimisticMessage = {
                    id: `temp-${Date.now()}`,
                    content: variables.messageData.content,
                    senderId: userId,
                    timestamp: new Date().toISOString(),
                    type: variables.messageData.type || 'text',
                    status: 'sending',
                    chatId: variables.chatId,
                    recipientId: variables.messageData.recipientId,
                    isSeen: false,
                    version: 1
                };
                
                // Add to first page of messages
                if (variables.chatId) {
                    const cacheKey = CHAT_CACHE_KEYS.MESSAGES(variables.chatId, 0);
                    const existingMessages = cache.get<any>(cacheKey);
                    if (existingMessages) {
                        cache.set(cacheKey, {
                            ...existingMessages,
                            content: [optimisticMessage, ...existingMessages.content]
                        });
                    }
                }
                
                return () => {
                    if (variables.chatId) {
                        const updatedMessages = cache.get<any>(CHAT_CACHE_KEYS.MESSAGES(variables.chatId, 0));
                        if (updatedMessages) {
                            const filtered = updatedMessages.content.filter((msg: any) => msg.id !== optimisticMessage.id);
                            cache.set(CHAT_CACHE_KEYS.MESSAGES(variables.chatId, 0), {
                                ...updatedMessages,
                                content: filtered
                            });
                        }
                    }
                };
            } : undefined,
            retry: 3,
            retryDelay: 1000
        }
    );

    // Update chat settings
    const updateChatSettings = useCustomMutation(
        async ({ chatId, settings }: { chatId: string, settings: any }) => {
            return await chatDataService.updateChatSettings(chatId, settings, token);
        },
        {
            onSuccess: (data, variables) => {
                console.log('UnifiedChat: Chat settings updated:', variables.chatId);
                invalidateCache.invalidateChatData(variables.chatId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error updating chat settings:', error);
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    // Search chats
    const searchChats = useCustomMutation(
        async ({ query }: { query: string }) => {
            return await chatDataService.searchChats(query, userId, token);
        },
        {
            onSuccess: (data, variables) => {
                console.log('UnifiedChat: Search completed:', { 
                    query: variables.query, 
                    results: data.content?.length || 0 
                });
            },
            onError: (error) => {
                console.error('UnifiedChat: Error searching chats:', error);
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    // Add participant with optimistic updates (now implemented)
    const addParticipant = useCustomMutation(
        async ({ chatId, participantId }: { chatId: string, participantId: string }) => {
            return await chatDataService.addParticipant(chatId, participantId, token);
        },
        {
            onSuccess: (data) => {
                console.log('UnifiedChat: Participant added:', data.id);
                invalidateCache.invalidateChatData(chatId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error adding participant:', error);
            },
            optimisticUpdate: config.enableOptimisticUpdates ? (cache, variables) => {
                const cacheKey = CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(variables.chatId);
                const existingParticipants = cache.get<any>(cacheKey) || [];
                const optimisticParticipant = { id: variables.participantId, name: 'New User' };
                cache.set(cacheKey, [...existingParticipants, optimisticParticipant]);
                
                return () => {
                    const updatedParticipants = cache.get<any>(cacheKey) || [];
                    const filtered = updatedParticipants.filter((p: any) => p.id !== variables.participantId);
                    cache.set(cacheKey, filtered);
                };
            } : undefined,
            retry: 2,
            retryDelay: 1000
        }
    );

    // Remove participant with optimistic updates (now implemented)
    const removeParticipant = useCustomMutation(
        async ({ chatId, participantId }: { chatId: string, participantId: string }) => {
            return await chatDataService.removeParticipant(chatId, participantId, token);
        },
        {
            onSuccess: (data, variables) => {
                console.log('UnifiedChat: Participant removed:', variables.participantId);
                invalidateCache.invalidateChatData(variables.chatId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error removing participant:', error);
            },
            optimisticUpdate: config.enableOptimisticUpdates ? (cache, variables) => {
                const cacheKey = CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(variables.chatId);
                const existingParticipants = cache.get<any>(cacheKey) || [];
                const removedParticipant = existingParticipants.find((p: any) => p.id === variables.participantId);
                const filtered = existingParticipants.filter((p: any) => p.id !== variables.participantId);
                cache.set(cacheKey, filtered);
                
                return () => {
                    if (removedParticipant) {
                        const restoredParticipants = cache.get<any>(cacheKey) || [];
                        cache.set(cacheKey, [...restoredParticipants, removedParticipant]);
                    }
                };
            } : undefined,
            retry: 2,
            retryDelay: 1000
        }
    );

    // Mark messages as read (now implemented)
    const markMessagesAsRead = useCustomMutation(
        async ({ chatId, messageIds }: { chatId: string, messageIds: string[] }) => {
            return await chatDataService.markMessagesAsRead(chatId, messageIds, token);
        },
        {
            onSuccess: (data, variables) => {
                console.log('UnifiedChat: Messages marked as read:', data.marked || variables.messageIds?.length);
                invalidateCache.invalidateChatData(variables.chatId);
                invalidateCache.invalidateUserChatData(userId);
            },
            onError: (error) => {
                console.error('UnifiedChat: Error marking messages as read:', error);
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    // Additional utility methods
    const prefetchChats = useCallback(async (userId: string) => {
        if (token) {
            console.log('UnifiedChat: Prefetching chats for user:', userId);
            // Prefetching would be implemented in the cache service
        }
    }, [token]);

    const prefetchMessages = useCallback(async (chatId: ResId) => {
        if (token) {
            console.log('UnifiedChat: Prefetching messages for chat:', chatId);
            // Prefetching would be implemented in the cache service
        }
    }, [token]);

    const invalidateAllCache = useCallback(() => {
        invalidateCache.invalidateUserChatData(userId);
        if (chatId) {
            invalidateCache.invalidateChatData(chatId);
        }
    }, [invalidateCache, userId, chatId]);

    return {
        // State
        chats,
        messages,
        participants,
        unreadCount,
        isLoading,
        error,

        // Additional query methods
        prefetchChats,
        prefetchMessages,
        invalidateCache: invalidateAllCache,

        // Error handling
        retryFailedQueries,
        getErrorSummary,
        
        // Performance monitoring
        getMetrics: chatMetricsService.getMetrics.bind(chatMetricsService),
        getPerformanceSummary: chatMetricsService.getPerformanceSummary.bind(chatMetricsService),
        resetMetrics: chatMetricsService.resetMetrics.bind(chatMetricsService),
        
        // Presence features
        getUserPresence: chatPresenceService.getUserPresence.bind(chatPresenceService),
        getTypingUsers: chatPresenceService.getTypingUsers.bind(chatPresenceService),
        getOnlineUsers: chatPresenceService.getOnlineUsers.bind(chatPresenceService),
        startTyping: (chatId: string) => chatPresenceService.startTyping(userId, chatId),
        stopTyping: (chatId: string) => chatPresenceService.stopTyping(userId, chatId),
        updatePresence: (status: 'online' | 'offline' | 'away' | 'busy') => chatPresenceService.updatePresence(userId, status),
        
        // Analytics features
        getAnalytics: chatAnalyticsService.getAnalytics.bind(chatAnalyticsService),
        getUserAnalytics: chatAnalyticsService.getUserAnalytics.bind(chatAnalyticsService),
        getChatAnalytics: chatAnalyticsService.getChatAnalytics.bind(chatAnalyticsService),
        getEngagementTrends: chatAnalyticsService.getEngagementTrends.bind(chatAnalyticsService),
        recordAnalyticsEvent: chatAnalyticsService.recordEvent.bind(chatAnalyticsService),

        // Actions
        createChat,
        deleteChat,
        sendMessage,
        updateChatSettings,
        searchChats,
        addParticipant,
        removeParticipant,
        markMessagesAsRead
    };
};

// Export for backward compatibility
export const useCustomChat = useUnifiedChat;
