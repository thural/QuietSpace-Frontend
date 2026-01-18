/**
 * React Query Chat Service.
 * 
 * Service that wraps React Query for chat operations.
 * Provides caching, prefetching, and background updates.
 */

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import type { ResId } from "@/api/schemas/inferred/common";
import type { JwtToken } from "@/api/schemas/inferred/common";
import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import { useAuthStore } from '@services/store/zustand';
import type { 
    ChatQuery, 
    ChatFilters, 
    ChatResult,
    ChatMessage,
    ChatAttachment,
    ChatReaction,
    ChatSettings,
    ChatParticipant,
    ChatStatus,
    ChatTypingIndicator,
    ChatNotification
} from "@chat/domain/entities/ChatEntities";

/**
 * React Query Chat Service interface.
 */
export interface IReactQueryChatService {
    // Chat operations
    getChats(userId: string, token: JwtToken): UseQueryResult<ChatList, Error>;
    createChat(chatData: CreateChatRequest): UseMutationResult<ChatResponse, Error, CreateChatRequest>;
    deleteChat(chatId: string): UseMutationResult<Response, Error, { chatId: string }>;
    getMessages(chatId: ResId, page: number, token: JwtToken): UseQueryResult<PagedMessage, Error>;
    sendMessage(chatId: string, messageData: any): UseMutationResult<any, Error, { chatId: string, messageData: any }>;
    getChatDetails(chatId: ResId, token: JwtToken): UseQueryResult<ChatResponse, Error>;
    updateChatSettings(chatId: string, settings: any): UseMutationResult<ChatResponse, Error, { chatId: string, settings: any }>;
    searchChats(query: string, userId: string, token: JwtToken): UseQueryResult<ChatList, Error>;
    getChatParticipants(chatId: ResId, token: JwtToken): UseQueryResult<any[], Error>;
    addParticipant(chatId: string, participantId: string): UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    removeParticipant(chatId: string, participantId: string): UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }>;
    markMessagesAsRead(chatId: string, messageIds: string[]): UseMutationResult<any, Error, { chatId: string, messageIds: string[] }>;
    getUnreadCount(userId: string, token: JwtToken): UseQueryResult<number, Error>;
    
    // Cache management
    prefetchChats(userId: string, token: JwtToken): Promise<void>;
    prefetchMessages(chatId: ResId, token: JwtToken): Promise<void>;
    invalidateChatCache(): void;
}

/**
 * React Query Chat Service implementation.
 */
export class ReactQueryChatService implements IReactQueryChatService {
    private queryClient = useQueryClient();

    constructor(private chatRepository: IChatRepository) {}

    /**
     * Get all chats for a user.
     */
    getChats(userId: string, token: JwtToken): UseQueryResult<ChatList, Error> {
        return useQuery({
            queryKey: ['chats', userId],
            queryFn: async () => await this.chatRepository.getChats(userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Create a new chat.
     */
    createChat(chatData: CreateChatRequest): UseMutationResult<ChatResponse, Error, CreateChatRequest> {
        return useMutation({
            mutationFn: async (chatData) => {
                const token = this.getAuthToken();
                return await this.chatRepository.createChat(chatData, token);
            },
            onSuccess: (data, variables) => {
                // Update cache with new chat
                this.queryClient.setQueryData(['chats', variables.userIds?.[0] || variables.recipientId], data);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error creating chat:', error);
            }
        });
    }

    /**
     * Delete a chat.
     */
    deleteChat(chatId: string): UseMutationResult<Response, Error, { chatId: string }> {
        return useMutation({
            mutationFn: async () => {
                const token = this.getAuthToken();
                return await this.chatRepository.deleteChat(chatId, token);
            },
            onSuccess: (data, variables) => {
                // Remove from cache
                this.queryClient.invalidateQueries({ queryKey: ['chats'] });
                this.queryClient.removeQueries({ queryKey: ['chats', chatId] });
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error deleting chat:', error);
            }
        });
    }

    /**
     * Get messages for a specific chat.
     */
    getMessages(chatId: ResId, page: number, token: JwtToken): UseQueryResult<PagedMessage, Error> {
        return useQuery({
            queryKey: ['chats', chatId, 'messages'],
            queryFn: async ({ pageParam }) => {
                const pageParams = `?page=${pageParam}&size=9`;
                return await this.chatRepository.getMessages(chatId, Number(pageParam), token);
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!chatId && !!token
        });
    }

    /**
     * Send a message in a chat.
     */
    sendMessage(chatId: string, messageData: any): UseMutationResult<any, Error, { chatId: string, messageData: any }> {
        return useMutation({
            mutationFn: async ({ chatId, messageData }) => {
                const token = this.getAuthToken();
                return await this.chatRepository.sendMessage(chatId, messageData, token);
            },
            onSuccess: (data, variables) => {
                // Optimistic update - add message to cache immediately
                this.queryClient.setQueryData(['chats', variables.chatId, 'messages'], (old: any) => [...(old || []), data]);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error sending message:', error);
            }
        });
    }

    /**
     * Get chat details.
     */
    getChatDetails(chatId: ResId, token: JwtToken): UseQueryResult<ChatResponse, Error> {
        return useQuery({
            queryKey: ['chat', chatId],
            queryFn: async () => await this.chatRepository.getChatDetails(chatId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!chatId && !!token
        });
    }

    /**
     * Update chat settings.
     */
    updateChatSettings(chatId: string, settings: any): UseMutationResult<ChatResponse, Error, { chatId: string, settings: any }> {
        return useMutation({
            mutationFn: async ({ chatId, settings }) => {
                const token = this.getAuthToken();
                return await this.chatRepository.updateChatSettings(chatId, settings, token);
            },
            onSuccess: (data, variables) => {
                // Update cache with new settings
                this.queryClient.setQueryData(['chats', variables.chatId], data);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error updating chat settings:', error);
            }
        });
    }

    /**
     * Search chats.
     */
    searchChats(query: string, userId: string, token: JwtToken): UseQueryResult<ChatList, Error> {
        return useQuery({
            queryKey: ['chats', 'search', query],
            queryFn: async () => await this.chatRepository.searchChats(query, userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Get chat participants.
     */
    getChatParticipants(chatId: ResId, token: JwtToken): UseQueryResult<any[], Error> {
        return useQuery({
            queryKey: ['chats', chatId, 'participants'],
            queryFn: async () => await this.chatRepository.getChatParticipants(chatId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!chatId && !!token
        });
    }

    /**
     * Add participant to chat.
     */
    addParticipant(chatId: string, participantId: string): UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }> {
        return useMutation({
            mutationFn: async ({ chatId, participantId }) => {
                const token = this.getAuthToken();
                return await this.chatRepository.addParticipant(chatId, participantId, token);
            },
            onSuccess: (data, variables) => {
                // Update cache with new participant
                this.queryClient.setQueryData(['chats', variables.chatId, 'participants'], (old: any) => [...(old || []), data]);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error adding participant:', error);
            }
        });
    }

    /**
     * Remove participant from chat.
     */
    removeParticipant(chatId: string, participantId: string): UseMutationResult<ChatResponse, Error, { chatId: string, participantId: string }> {
        return useMutation({
            mutationFn: async ({ chatId, participantId }) => {
                const token = this.getAuthToken();
                return await this.chatRepository.removeParticipant(chatId, participantId, token);
            },
            onSuccess: (data, variables) => {
                // Update cache without removed participant
                this.queryClient.setQueryData(['chats', variables.chatId, 'participants'], (old: any) => [...(old || []), data]);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error removing participant:', error);
            }
        });
    }

    /**
     * Mark messages as read.
     */
    markMessagesAsRead(chatId: string, messageIds: string[]): UseMutationResult<any, Error, { chatId: string, messageIds: string[] }> {
        return useMutation({
            mutationFn: async ({ chatId, messageIds }) => {
                const token = this.getAuthToken();
                return await this.chatRepository.markMessagesAsRead(chatId, messageIds, token);
            },
            onSuccess: (data, variables) => {
                // Update cache with read status
                this.queryClient.setQueryData(['chats', variables.chatId, 'messages'], (old: any) => [...(old || []), data]);
            },
            onError: (error) => {
                console.error('ReactQueryChatService: Error marking messages as read:', error);
            }
        });
    }

    /**
     * Get unread message count.
     */
    getUnreadCount(userId: string, token: JwtToken): UseQueryResult<number, Error> {
        return useQuery({
            queryKey: ['chats', 'unreadCount', userId],
            queryFn: async () => await this.chatRepository.getUnreadCount(userId, token),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            enabled: !!userId && !!token
        });
    }

    /**
     * Prefetch chats.
     */
    async prefetchChats(userId: string, token: JwtToken): Promise<void> {
        await this.queryClient.prefetchQuery({
            queryKey: ['chats', userId],
            staleTime: 5 * 60 * 1000
        });
    }

    /**
     * Prefetch messages.
     */
    async prefetchMessages(chatId: ResId, token: JwtToken): Promise<void> {
        await this.queryClient.prefetchQuery({
            queryKey: ['chats', chatId, 'messages'],
            staleTime: 5 * 60 * 1000
        });
    }

    /**
     * Invalidate all chat cache.
     */
    invalidateChatCache(): void {
        this.queryClient.invalidateQueries({ queryKey: ['chats'] });
        this.queryClient.invalidateQueries({ queryKey: ['chats', 'messages'] });
        this.queryClient.invalidateQueries({ queryKey: ['chats', 'participants'] });
        this.queryClient.invalidateQueries({ queryKey: ['chats', 'unreadCount'] });
    }

    /**
     * Get authentication token from store.
     */
    private getAuthToken(): string {
        try {
            const authStore = useAuthStore.getState();
            return authStore.data.accessToken || '';
        } catch (error) {
            console.error('ReactQueryChatService: Error getting auth token', error);
            return '';
        }
    }
}
