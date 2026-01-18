/**
 * React Query Chat Hook.
 * 
 * Hook that provides React Query-based chat functionality.
 * Can be toggled on/off based on configuration.
 */

import { useState, useCallback, useEffect } from 'react';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import type { ResId } from "@/api/schemas/inferred/common";
import type { JwtToken } from "@/api/schemas/inferred/common";
import { useAuthStore } from '../../../services/store/zustand';
import type { 
    ChatQuery, 
    ChatFilters, 
    ChatResult,
    ChatMessage,
    ChatSettings,
    ChatParticipant,
    ChatStatus,
    ChatTypingIndicator,
    ChatNotification
} from "@chat/domain/entities/ChatEntities";
import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import { useChatDI } from "@chat/di/useChatDI";

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

    // Initialize React Query service if enabled
    const [reactQueryService, setReactQueryService] = useState<any>(null);

    useEffect(() => {
        const authStore = useAuthStore.getState();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);

        if (config.useReactQuery && !reactQueryService) {
            const chatRepository = diContainer.getChatRepository();
            const ReactQueryChatService = require('./ReactQueryChatService').ReactQueryChatService;
            setReactQueryService(new ReactQueryChatService(chatRepository));
        }
    }, [config.useReactQuery, diContainer]);

    // Get React Query results
    const chats = reactQueryService?.getChats(userId, token || '') || 
        { data: null, isLoading: false, error: null } as UseQueryResult<ChatList, Error>;
    
    const messages = reactQueryService?.getMessages('chat-id', 0, token || '') || 
        { data: null, isLoading: false, error: null } as UseQueryResult<PagedMessage, Error>;
    
    const participants = reactQueryService?.getChatParticipants('chat-id', token || '') || 
        { data: null, isLoading: false, error: null } as UseQueryResult<any[], Error>;
    
    const unreadCount = reactQueryService?.getUnreadCount(userId, token || '') || 
        { data: null, isLoading: false, error: null } as UseQueryResult<number, Error>;

    // Combined loading state
    const isLoading = chats.isLoading || messages.isLoading || participants.isLoading || unreadCount.isLoading || false;
    const error = chats.error || messages.error || participants.error || unreadCount.error || null;

    // Actions
    const createChat = reactQueryService?.createChat() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as ChatResponse),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<ChatResponse, Error, CreateChatRequest>;
    
    const deleteChat = reactQueryService?.deleteChat() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as Response),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<Response, Error, { chatId: string }>;
    
    const sendMessage = reactQueryService?.sendMessage() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as any),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<any, Error, { chatId: string, messageData: any }>;
    
    const updateChatSettings = reactQueryService?.updateChatSettings() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as ChatResponse),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<ChatResponse, Error, { chatId: string, settings: any }>;
    
    const searchChats = reactQueryService?.searchChats() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as ChatList),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<ChatList, Error, { query: string }>;
    
    const addParticipant = reactQueryService?.addParticipant() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as ChatResponse),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    
    const removeParticipant = reactQueryService?.removeParticipant() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as ChatResponse),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    
    const markMessagesAsRead = reactQueryService?.markMessagesAsRead() || 
        {
            mutate: () => {},
            mutateAsync: async () => ({} as any),
            isPending: false,
            isError: false,
            isSuccess: false,
            isIdle: true,
            data: undefined,
            error: null,
            failureReason: null,
            errorUpdateCount: 0,
            failureCount: 0,
            submittedAt: 0,
            variables: undefined,
            reset: () => {},
            status: 'idle',
            context: undefined,
            isPaused: false
        } as UseMutationResult<any, Error, { chatId: string, messageIds: string[] }>;

    // Additional React Query methods
    const prefetchChats = useCallback(async (userId: string) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchChats(userId, token);
        }
    }, [reactQueryService, token]);

    const prefetchMessages = useCallback(async (chatId: ResId) => {
        if (reactQueryService && token) {
            await reactQueryService.prefetchMessages(chatId, token);
        }
    }, [reactQueryService, token]);

    const invalidateCache = useCallback(() => {
        if (reactQueryService) {
            reactQueryService.invalidateChatCache();
        }
    }, [reactQueryService]);

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
