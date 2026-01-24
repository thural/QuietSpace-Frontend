/**
 * Chat Hook
 * 
 * Provides chat functionality using the custom query system.
 * Manages chat data, messages, and user interactions.
 */

import { ResId } from "@/shared/api/models/common";
import { useAuthStore } from "@/core/store/zustand";
import { useCallback, useState } from "react";
import { useChatMessaging } from "@features/chat/application/hooks/useChatMessaging";
import { useCustomQuery } from '@/core/hooks';
import { useCustomInfiniteQuery } from '@/core/hooks';
import { useCustomMutation } from '@/core/hooks';
import { useChatServices } from './useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';
import { CHAT_CACHE_KEYS } from '@chat/data/cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';

/**
 * Chat State interface - represents the data returned by useChat
 */
export interface ChatState {
    text: string;
    chats: any;
    recipientName: string;
    recipientId: string | number | undefined;
    signedUserId: string | number | undefined;
    messages: any[];
    messageList: any[];
    messageCount: number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isError: boolean;
    isLoading: boolean;
    isInputEnabled: boolean;
    currentChat: any;
    participants: any;
}

/**
 * Chat Actions interface - represents the action methods returned by useChat
 */
export interface ChatActions {
    handleSendMessage: () => void;
    handleInputChange: (value: string) => void;
    handleDeleteChat: (event: React.ChangeEvent) => void;
    fetchNextPage: () => void;
}

/**
 * Custom hook to manage chat functionality.
 * 
 * @param {ResId} chatId - The ID of the chat to manage.
 * @returns {ChatState & ChatActions} - An object containing chat-related data and methods.
 */
export const useChat = (chatId: ResId): ChatState & ChatActions => {
    const { data: { userId: senderId }, token } = useAuthStore();
    const { sendMessage, isClientConnected, chats } = useChatMessaging();
    const { chatDataService, chatFeatureService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    // Get current chat details
    const { data: currentChat, isLoading: chatLoading } = useCustomQuery(
        ['chat', 'details', chatId],
        () => chatDataService.getChatDetails(chatId, token || ''),
        {
            enabled: !!chatId,
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            onSuccess: (data) => {
                const chatName = data.members?.length > 1 
                    ? `Group Chat (${data.members.length} members)`
                    : data.members?.[0]?.name || 'Unknown Chat';
                console.log('Chat details loaded:', { chatId: data.id, name: chatName });
            },
            onError: (error) => {
                console.error('Error loading chat details:', { chatId, error: error.message });
            }
        }
    );

    // Define the type for a single message
    interface Message {
        chatId?: string | number;
        senderId?: string | number;
        recipientId?: string | number;
        photoData?: any;
        text?: string;
        id?: string | number;
        version?: number;
        createDate?: string;
        updateDate?: string;
        senderName?: string;
        isSeen?: boolean;
        photo?: {
            id?: string | number;
            url?: string;
            [key: string]: any;
        };
    }

    // Define the type for a single page of messages
    interface MessagePage {
        data: Message[];
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }

    // Get messages with pagination
    const {
        data: messagesData,
        pages: messagesPages,
        isLoading: messagesLoading,
        isError,
        isSuccess,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useCustomInfiniteQuery<Message>(
        ['chat', 'messages', chatId],
        async (pageParam: number) => {
            const pagedMessage = await chatDataService.getMessages(chatId, pageParam, token || '');
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
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            onSuccess: (data, allPages) => {
                console.log('Chat messages loaded:', { 
                    chatId, 
                    totalMessages: data.length, 
                    totalPages: allPages.length 
                });
            },
            onError: (error) => {
                console.error('Error loading chat messages:', { chatId, error: error.message });
            }
        }
    );

    // Get chat participants
    const { data: participants } = useCustomQuery(
        ['chat', 'participants', chatId],
        () => chatDataService.getChatParticipants(chatId, ''),
        {
            enabled: !!chatId,
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME
        }
    );

    const [text, setText] = useState<string>("");

    // Extract recipient information
    const recipientInfo = currentChat?.members?.find(member => member.id !== senderId);
    const recipientName = recipientInfo?.name || 'Unknown';
    const recipientId = recipientInfo?.id;

    /**
     * Handles input changes by updating the message text state.
     * @param {string} value - The new value of the input.
     */
    const handleInputChange = useCallback((value: string) => {
        setText(value);
    }, []);

    /**
     * Sends a message to the recipient.
     * @throws {Error} If recipientId is undefined.
     */
    const handleSendMessage = useCallback(() => {
        if (!recipientId) throw new Error("recipientId is undefined");
        sendMessage({ recipientId, text });
        console.log("message sent: ", { recipientId, text });
        setText('');
    }, [recipientId, text, sendMessage]);

    /**
     * Delete chat mutation with cache invalidation
     */
    const deleteChatMutation = useCustomMutation(
        () => chatDataService.deleteChat(chatId, token || ''),
        {
            onSuccess: () => {
                console.log("Chat deleted successfully:", { chatId });
                
                // Invalidate all chat-related caches
                invalidateCache.invalidateChatData(chatId);
                invalidateCache.invalidateUserChatData(senderId);
            },
            onError: (error: Error) => {
                console.error("Error deleting chat:", { chatId, error: error.message });
            },
            optimisticUpdate: (cache) => {
                // Optimistically remove chat from cache
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(senderId);
                const existingChats = cache.get<any>(cacheKey) || { items: [] };
                const filteredChats = existingChats.items.filter((chat: any) => chat.id !== chatId);
                cache.set(cacheKey, { ...existingChats, items: filteredChats });
                
                return () => {
                    // Rollback on error - restore the chat
                    if (currentChat) {
                        const restoredChats = cache.get<any>(cacheKey) || { items: [] };
                        cache.set(cacheKey, { 
                            ...restoredChats, 
                            items: [currentChat, ...restoredChats.items] 
                        });
                    }
                };
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    /**
     * Handles the deletion of the current chat.
     * @param {React.ChangeEvent} event - The event triggered by the form submission.
     */
    const handleDeleteChat = useCallback((event: React.ChangeEvent) => {
        event.preventDefault();
        deleteChatMutation.mutate(undefined);
    }, [deleteChatMutation]);

    // Combine all messages from pages
    const messages = Array.isArray(messagesData) 
        ? messagesData 
        : messagesPages?.flatMap(page => page.data) || [];
    const messageCount = messages.length;
    
    const isInputEnabled: boolean = isSuccess && !!isClientConnected;

    return {
        text,
        chats,
        recipientName,
        recipientId,
        signedUserId: senderId,
        messages,
        messageList: messages,
        messageCount,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isError,
        isLoading: chatLoading || messagesLoading,
        isInputEnabled,
        handleSendMessage: handleSendMessage,
        handleInputChange,
        handleDeleteChat,
        currentChat,
        participants
    };
};