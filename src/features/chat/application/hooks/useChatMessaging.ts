/**
 * Chat Messaging Hook
 * 
 * Provides chat messaging functionality using the custom query system.
 * Handles chat creation, message sending, and real-time communication.
 */

import { useState, useCallback } from 'react';
import { ChatResponse, CreateChatRequest } from "@/features/chat/data/models/chat";
import { ResId } from "@/shared/api/models/commonNative";
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { useNavigate } from "react-router-dom";
import { useCustomQuery } from '@/core/hooks';
import { useCustomMutation } from '@/core/hooks';
import { useChatServices } from './useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';
import { CHAT_CACHE_KEYS } from '@chat/data/cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';

export const useChatMessaging = () => {
    const { userId: senderId } = useFeatureAuth();
    // TODO: Fix chat store integration - useChatStore doesn't exist
    // const { clientMethods } = useChatStore();
    // const { sendChatMessage, isClientConnected } = clientMethods;

    // Mock values for now
    const sendChatMessage = () => console.log('Chat message sending not implemented');
    const isClientConnected = false;
    const navigate = useNavigate();
    const { chatDataService, chatFeatureService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    // Get user chats with custom query
    const { data: chatsData, isLoading: chatsLoading } = useCustomQuery(
        ['chats', senderId],
        () => chatDataService.getChats(senderId || '', ''),
        {
            enabled: !!senderId,
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            onSuccess: (data) => {
                console.log('User chats loaded:', { userId: senderId, count: data.content.length });
            },
            onError: (error) => {
                console.error('Error loading user chats:', { userId: senderId, error: error.message });
            }
        }
    );

    // Create chat mutation with optimistic updates
    const createChatMutation = useCustomMutation(
        (chatData: CreateChatRequest) => chatFeatureService.createChatWithValidation(chatData, ''),
        {
            onSuccess: (data: ChatResponse) => {
                console.log("Chat created successfully:", data);

                // Invalidate user chats cache
                invalidateCache.invalidateUserChatData(senderId);

                // Navigate to the new chat
                navigate(`/chat/${data.id}`);
            },
            onError: (error: Error) => {
                console.error("Error creating chat:", error.message);
            },
            optimisticUpdate: (cache, variables) => {
                // Create optimistic chat matching ChatResponse schema
                const optimisticChat: ChatResponse = {
                    id: `temp-${Date.now()}`,
                    userIds: [senderId, variables.recipientId],
                    members: [
                        { id: senderId, name: 'You' },
                        { id: variables.recipientId, name: 'User' }
                    ],
                    recentMessage: variables.text ? {
                        id: `temp-msg-${Date.now()}`,
                        chatId: `temp-${Date.now()}`,
                        senderId: senderId,
                        recipientId: variables.recipientId,
                        text: variables.text,
                        senderName: 'You',
                        isSeen: false,
                        createDate: new Date().toISOString(),
                        updateDate: new Date().toISOString()
                    } : undefined,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString()
                };

                // Add to cache optimistically
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(senderId);
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                cache.set(cacheKey, {
                    ...existingChats,
                    content: [optimisticChat, ...existingChats.content]
                });

                return () => {
                    // Rollback on error
                    const updatedChats = cache.get<any>(cacheKey) || { content: [] };
                    const filtered = updatedChats.content.filter((chat: any) => chat.id !== optimisticChat.id);
                    cache.set(cacheKey, { ...updatedChats, content: filtered });
                };
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    // Find or create chat with enhanced logic
    const findOrCreateChat = useCallback((recipientId: ResId, text?: string) => {
        if (!chatsData?.content) return undefined;

        const existingChat = chatsData.content.find(chat =>
            chat.members.some(member => member.id === recipientId)
        );

        if (existingChat) return existingChat.id;

        const createChatRequestBody: CreateChatRequest = {
            isGroupChat: false,
            recipientId,
            text: text || '',
            userIds: [senderId, recipientId]
        };

        createChatMutation.mutate(createChatRequestBody);
        return undefined;
    }, [chatsData, senderId, createChatMutation]);

    // Send message with enhanced functionality
    const sendMessage = useCallback((params: {
        recipientId: ResId,
        text: string,
        postId?: ResId
    }) => {
        const { recipientId, text, postId } = params;
        const chatId = findOrCreateChat(recipientId, text);

        if (chatId) {
            // Send message through existing WebSocket
            sendChatMessage({ chatId, senderId, recipientId, text });

            // Send post reference if provided
            if (postId) {
                sendChatMessage({ chatId, senderId, recipientId, text: `##MP## ${postId}` });
            }
        }
    }, [findOrCreateChat, sendChatMessage, senderId]);

    return {
        sendMessage,
        isClientConnected,
        findOrCreateChat,
        chatsLoading,
        createChatLoading: createChatMutation.isLoading,
        chats: chatsData?.content || []
    };
};