/**
 * React Query Chat Hook.
 * 
 * Hook that provides React Query-based chat functionality.
 * Can be toggled on/off based on configuration.
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import type { ResId } from "@/api/schemas/inferred/common";
import type { JwtToken } from "@/api/schemas/inferred/common";
import type { IChatRepository } from "../../../domain/entities/IChatRepository";
import { useChatDI } from "../../di/useChatDI";

/**
 * React Query Chat State interface.
 */
export interface ReactQueryChatState {
    chats: UseQueryResult<ChatList, Error>;
    messages: UseQueryResult<PagedMessage, Error>;
    participants: UseQueryResult<any[], Error>;
    unreadCount: UseQueryResult<number, Error>;
    isLoading: boolean;
    error: Error | null;
    
    // Additional React Query specific methods
    prefetchChats?: (userId: string) => Promise<void>;
    prefetchMessages?: (chatId: ResId) => Promise<void>;
    invalidateCache?: () => void;
}

/**
 * React Query Chat Actions interface.
 */
export interface ReactQueryChatActions {
    createChat: UseMutationResult<ChatResponse, Error, CreateChatRequest>;
    deleteChat: UseMutationResult<Response, Error, { chatId: string }>;
    sendMessage: UseMutationResult<any, Error, { chatId: string, messageData: any }>;
    updateChatSettings: UseMutationResult<ChatResponse, Error, { chatId: string, settings: any }>;
    searchChats: UseMutationResult<ChatList, Error, { query: string }>;
    addParticipant: UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    removeParticipant: UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    markMessagesAsRead: UseMutationResult<any, Error, { chatId: string, messageIds: string[] }>;
}

/**
 * React Query Chat Hook.
 * 
 * Provides React Query-based chat functionality with toggle support.
 */
export const useReactQueryChat = (
    userId: string
): ReactQueryChatState & ReactQueryChatActions => {
    const [token, setToken] = useState<JwtToken | null>(null);
    const diContainer = useChatDI();
    const config = diContainer.getConfig();
    const queryClient = useQueryClient();

    useEffect(() => {
        const authStore = require('../../../services/store/zustand').useAuthStore.getState();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);
    }, [diContainer]);

    // Get repository
    const chatRepository = diContainer.getChatRepository();

    // Get React Query results
    const chats = useQuery({
        queryKey: ['chats', userId],
        queryFn: async () => {
            if (!token || !chatRepository) return { content: [], totalPages: 0, totalElements: 0, size: 0, number: 0, first: true, last: true, numberOfElements: 0, empty: true, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: false, unpaged: false }, sort: { sorted: false, unsorted: true, empty: false } };
            return await chatRepository.getChats(userId, token);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!userId && !!token
    });

    const messages = useQuery({
        queryKey: ['chats', 'chat-id', 'messages'],
        queryFn: async ({ pageParam }) => {
            const pageParams = `?page=${pageParam}&size=9`;
            return await chatRepository.getMessages('chat-id', pageParams, token);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!token
    });

    const participants = useQuery({
        queryKey: ['chats', 'chat-id', 'participants'],
        queryFn: async () => await chatRepository.getChatParticipants('chat-id', token),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!token
    });

    const unreadCount = useQuery({
        queryKey: ['chats', 'unreadCount', userId],
        queryFn: async () => await chatRepository.getUnreadCount(userId, token),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!userId && !!token
    });

    // Combined loading state
    const isLoading = chats.isLoading || messages.isLoading || participants.isLoading || unreadCount.isLoading || false;
    const error = chats.error || messages.error || participants.error || unreadCount.error || null;

    // Actions
    const createChat = useMutation({
        mutationFn: async ({ chatData }) => {
            return await chatRepository.createChat(chatData, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', variables.userId], (old) => [...(old || []), data: [data] });
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error creating chat:', error);
        }
    });

    const deleteChat = useMutation({
        mutationFn: async ({ chatId }) => {
            return await chatRepository.deleteChat(chatId, token);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats', variables.userId] });
            queryClient.removeQueries(['chats', chatId]);
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error deleting chat:', error);
        }
    });

    const sendMessage = useMutation({
        mutationFn: async ({ chatId, messageData }) => {
            return await chatRepository.sendMessage(chatId, messageData, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', variables.userId], (old) => [...(old || []), data: [data] });
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error sending message:', error);
        }
    });

    const updateChatSettings = useMutation({
        mutationFn: async ({ chatId, settings }) => {
            return await chatRepository.updateChatSettings(chatId, settings, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', chatId], data);
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error updating chat settings:', error);
        }
    });

    const searchChats = useMutation({
        mutationFn: async ({ query }) => {
            return await chatRepository.searchChats(query, userId, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', 'search'], data);
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error searching chats:', error);
        }
    });

    const addParticipant = useMutation({
        mutationFn: async ({ chatId, participantId }) => {
            return await chatRepository.addParticipant(chatId, participantId, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', chatId, 'participants'], (old) => [...(old || []), data: [data] });
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error adding participant:', error);
        }
    });

    const removeParticipant = useMutation({
        mutationFn: async ({ chatId, participantId }) => {
            return await chatRepository.removeParticipant(chatId, participantId, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', chatId, 'participants'], (old) => [...(old || []), data: [data] });
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error removing participant:', error);
        }
    });

    const markMessagesAsRead = useMutation({
        mutationFn: async ({ messageIds }) => {
            return await chatRepository.markMessagesAsRead('chat-id', messageIds, token);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['chats', 'chat-id', 'messages'], (old) => [...(old || []), data: [data] });
        },
        onError: (error) => {
            console.error('ReactQueryChat: Error marking messages as read:', error);
        }
    });

    // Additional React Query methods
    const prefetchChats = useCallback(async (userId: string) => {
        if (token && chatRepository) {
            await queryClient.prefetchQuery({
                queryKey: ['chats', userId],
                staleTime: 5 * 60 * 1000
            });
        }
    }, [token, chatRepository]);

    const prefetchMessages = useCallback(async (chatId: ResId) => {
        if (token && chatRepository) {
            await queryClient.prefetchQuery({
                queryKey: ['chats', chatId, 'messages'],
                staleTime: 5 * 60 * 1000
            });
        }
    }, [token, chatRepository]);

    const invalidateCache = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        queryClient.invalidateQueries({ queryKey: ['chats', 'messages'] });
        queryClient.invalidateQueries({ queryKey: ['chats', 'participants'] });
        queryClient.invalidateQueries({ queryKey: ['chats', 'unreadCount'] });
    }, [queryClient]);

    return {
        // State
        chats,
        messages,
        participants,
        unreadCount,
        isLoading,
        error,
        
        // Additional React Query methods
        prefetchChats,
        prefetchMessages,
        invalidateCache,
        
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
