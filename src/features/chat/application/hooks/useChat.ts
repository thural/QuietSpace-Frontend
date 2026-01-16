/**
 * Chat Hook.
 * 
 * Hook for managing chat functionality with repository pattern.
 * Provides settings state management and operations.
 */

import { useState, useCallback, useEffect } from 'react';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import type { ResId, JwtToken } from "@/api/schemas/inferred/common";
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
 * Chat State interface.
 */
export interface ChatState {
    chats: ChatList | null;
    messages: PagedMessage | null;
    participants: any[] | null;
    unreadCount: number | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Chat Actions interface.
 */
export interface ChatActions {
    getChats: () => Promise<void>;
    createChat: (chatData: CreateChatRequest) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    getMessages: (chatId: string, page?: number) => Promise<void>;
    sendMessage: (chatId: string, messageData: any) => Promise<void>;
    getChatDetails: (chatId: string) => Promise<void>;
    updateChatSettings: (chatId: string, settings: any) => Promise<void>;
    searchChats: (query: string) => Promise<void>;
    getChatParticipants: (chatId: string) => Promise<void>;
    addParticipant: (chatId: string, participantId: string) => Promise<void>;
    removeParticipant: (chatId: string, participantId: string) => Promise<void>;
    markMessagesAsRead: (chatId: string, messageIds: string[]) => Promise<void>;
    getUnreadCount: (userId: string) => Promise<void>;
    clearError: () => void;
}

/**
 * Chat Hook.
 * 
 * Hook for managing chat functionality with repository pattern.
 * Provides settings state management and operations.
 */
export const useChat = (
    userId: string
): ChatState & ChatActions => {
    const [token, setToken] = useState<JwtToken | null>(null);
    const diContainer = useChatDI();

    // Initialize state
    const [chats, setChats] = useState<ChatList | null>(null);
    const [messages, setMessages] = useState<PagedMessage | null>(null);
    const [participants, setParticipants] = useState<any[]>(null);
    const [unreadCount, setUnreadCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Get repository
    const chatRepository = diContainer.getChatRepository();

    useEffect(() => {
        const authStore = require('../../../services/store/zustand').useAuthStore.getState();
        const currentToken = authStore.data.accessToken || null;
        setToken(currentToken);
    }, [diContainer]);

    // Actions
    const getChats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.getChats(userId, token || '');
            setChats(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const createChat = useCallback(async (chatData: CreateChatRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.createChat(chatData, token || '');
            setChats((prev) => prev ? {...prev, content: [...prev.content, result]} : {content: [result], totalPages: 0, totalElements: 1, size: 10, number: 0, first: true, last: true, numberOfElements: 1, empty: false, pageable: {pageNumber: 0, pageSize: 10, sort: {sorted: false, unsorted: true, empty: false}, offset: 0, paged: true, unpaged: false}, sort: {sorted: false, unsorted: true, empty: false}});
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const deleteChat = useCallback(async (chatId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await chatRepository.deleteChat(chatId, token || '');
            setChats((prev) => prev ? {...prev, content: prev.content.filter(chat => chat.id !== chatId)} : prev);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const getMessages = useCallback(async (chatId: string, page?: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.getMessages(chatId, page || 1, token || '');
            setMessages(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const sendMessage = useCallback(async (chatId: string, messageData: any) => {
        try {
            setIsLoading(true);
            setError(null);
            await chatRepository.sendMessage(chatId, messageData, token || '');
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const getChatDetails = useCallback(async (chatId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await chatRepository.getChatDetails(chatId, token || '');
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const updateChatSettings = useCallback(async (chatId: string, settings: any) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.updateChatSettings(chatId, settings, token || '');
            setChats((prev) => prev ? {...prev, content: prev.content.map(chat => chat.id === chatId ? result : chat)} : prev);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const searchChats = useCallback(async (query: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.searchChats(query, userId, token || '');
            setChats(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const getChatParticipants = useCallback(async (chatId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.getChatParticipants(chatId, token || '');
            setParticipants(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const addParticipant = useCallback(async (chatId: string, participantId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.addParticipant(chatId, participantId, token || '');
            setParticipants((prev) => prev ? [...prev, result] : [result]);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const removeParticipant = useCallback(async (chatId: string, participantId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await chatRepository.removeParticipant(chatId, participantId, token || '');
            setParticipants((prev) => prev ? prev.filter(p => p.id !== participantId) : prev);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const markMessagesAsRead = useCallback(async (chatId: string, messageIds: string[]) => {
        try {
            setIsLoading(true);
            setError(null);
            await chatRepository.markMessagesAsRead(chatId, messageIds, token || '');
            setMessages((prev) => prev ? { ...prev, content: prev.content.map(msg => messageIds.includes(String(msg.id)) ? { ...msg, isRead: true } : msg) } : prev);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const getUnreadCount = useCallback(async (userId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chatRepository.getUnreadCount(userId, token || '');
            setUnreadCount(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [chatRepository, token]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        chats,
        messages,
        participants,
        unreadCount,
        isLoading,
        error,
        
        // Actions
        getChats,
        createChat,
        deleteChat,
        getMessages,
        sendMessage,
        getChatDetails,
        updateChatSettings,
        searchChats,
        getChatParticipants,
        addParticipant,
        removeParticipant,
        markMessagesAsRead,
        getUnreadCount,
        clearError
    };
};
