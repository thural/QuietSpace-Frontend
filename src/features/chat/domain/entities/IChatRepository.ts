/**
 * Chat Repository Interface.
 * 
 * Defines the contract for chat data access operations.
 * Provides abstraction for chat CRUD operations.
 */

import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/features/chat/data/models/chat";
import type { ResId } from "@/shared/api/models/common";
import type { JwtToken } from "@/shared/api/models/common";

/**
 * Chat Repository interface.
 */
export interface IChatRepository {
    /**
     * Get all chats for a user.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to chat list
     */
    getChats(userId: string, token: JwtToken): Promise<ChatList>;

    /**
     * Create a new chat.
     * 
     * @param chatData - The chat creation data
     * @param token - Authentication token
     * @returns Promise resolving to created chat response
     */
    createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse>;

    /**
     * Delete a chat.
     * 
     * @param chatId - The chat ID
     * @param token - Authentication token
     * @returns Promise resolving to delete response
     */
    deleteChat(chatId: ResId, token: JwtToken): Promise<Response>;

    /**
     * Get messages for a specific chat.
     * 
     * @param chatId - The chat ID
     * @param page - The page number
     * @param token - Authentication token
     * @returns Promise resolving to paged messages
     */
    getMessages(chatId: ResId, page: number, token: JwtToken): Promise<PagedMessage>;

    /**
     * Send a message in a chat.
     * 
     * @param chatId - The chat ID
     * @param messageData - The message data
     * @param token - Authentication token
     * @returns Promise resolving to sent message
     */
    sendMessage(chatId: ResId, messageData: any, token: JwtToken): Promise<any>;

    /**
     * Get chat details.
     * 
     * @param chatId - The chat ID
     * @param token - Authentication token
     * @returns Promise resolving to chat details
     */
    getChatDetails(chatId: ResId, token: JwtToken): Promise<ChatResponse>;

    /**
     * Update chat settings.
     * 
     * @param chatId - The chat ID
     * @param settings - The chat settings
     * @param token - Authentication token
     * @returns Promise resolving to updated chat
     */
    updateChatSettings(chatId: ResId, settings: any, token: JwtToken): Promise<ChatResponse>;

    /**
     * Search chats.
     * 
     * @param query - The search query
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to search results
     */
    searchChats(query: string, userId: string, token: JwtToken): Promise<ChatList>;

    /**
     * Get chat participants.
     * 
     * @param chatId - The chat ID
     * @param token - Authentication token
     * @returns Promise resolving to participants list
     */
    getChatParticipants(chatId: ResId, token: JwtToken): Promise<any[]>;

    /**
     * Add participant to chat.
     * 
     * @param chatId - The chat ID
     * @param participantId - The participant ID
     * @param token - Authentication token
     * @returns Promise resolving to updated chat
     */
    addParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse>;

    /**
     * Remove participant from chat.
     * 
     * @param chatId - The chat ID
     * @param participantId - The participant ID
     * @param token - Authentication token
     * @returns Promise resolving to updated chat
     */
    removeParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse>;

    /**
     * Mark messages as read.
     * 
     * @param chatId - The chat ID
     * @param messageIds - The message IDs to mark as read
     * @param token - Authentication token
     * @returns Promise resolving to update response
     */
    markMessagesAsRead(chatId: ResId, messageIds: string[], token: JwtToken): Promise<any>;

    /**
     * Get unread message count.
     * 
     * @param userId - The user ID
     * @param token - Authentication token
     * @returns Promise resolving to unread count
     */
    getUnreadCount(userId: string, token: JwtToken): Promise<number>;

    /**
     * Delete a message.
     * 
     * @param messageId - The message ID
     * @param token - Authentication token
     * @returns Promise resolving to delete response
     */
    deleteMessage(messageId: string, token: JwtToken): Promise<Response>;
}
