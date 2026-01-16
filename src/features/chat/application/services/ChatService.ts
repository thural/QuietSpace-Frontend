/**
 * Chat Service.
 * 
 * Service for managing chat operations and business logic.
 * Provides high-level operations for chat management.
 */

import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
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
import type { JwtToken } from "@/api/schemas/inferred/common";

/**
 * Chat Service interface.
 */
export interface IChatService {
    // Chat operations
    getChats(userId: string): Promise<any>;
    createChat(chatData: any): Promise<any>;
    deleteChat(chatId: string): Promise<Response>;
    getMessages(chatId: string, page: number): Promise<any>;
    sendMessage(chatId: string, messageData: any): Promise<any>;
    getChatDetails(chatId: string): Promise<any>;
    updateChatSettings(chatId: string, settings: any): Promise<any>;
    searchChats(query: string, userId: string): Promise<any>;
    getChatParticipants(chatId: string): Promise<any[]>;
    addParticipant(chatId: string, participantId: string): Promise<any>;
    removeParticipant(chatId: string, participantId: string): Promise<any>;
    markMessagesAsRead(chatId: string, messageIds: string[]): Promise<any>;
    getUnreadCount(userId: string): Promise<number>;
    
    // Business logic methods
    validateChatData(chatData: any): boolean;
    sanitizeChatData(chatData: any): any;
    validateMessageData(messageData: any): boolean;
    sanitizeMessageData(messageData: any): any;
    validateParticipantData(participantData: any): boolean;
    sanitizeParticipantData(participantData: any): any;
}

/**
 * Chat Service implementation.
 */
export class ChatService implements IChatService {
    constructor(private chatRepository: IChatRepository) {}

    /**
     * Get all chats for a user.
     */
    async getChats(userId: string): Promise<any> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.getChats(userId, token);
        } catch (error) {
            console.error('ChatService: Error getting chats:', error);
            throw error;
        }
    }

    /**
     * Create a new chat.
     */
    async createChat(chatData: any): Promise<any> {
        try {
            if (!this.validateChatData(chatData)) {
                throw new Error('Invalid chat data provided');
            }

            const sanitizedData = this.sanitizeChatData(chatData);
            const token = this.getAuthToken();
            return await this.chatRepository.createChat(sanitizedData, token);
        } catch (error) {
            console.error('ChatService: Error creating chat:', error);
            throw error;
        }
    }

    /**
     * Delete a chat.
     */
    async deleteChat(chatId: string): Promise<Response> {
        try {
            if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
                throw new Error('Invalid chat ID provided');
            }
            const token = this.getAuthToken();
            return await this.chatRepository.deleteChat(chatId, token);
        } catch (error) {
            console.error('ChatService: Error deleting chat:', error);
            throw error;
        }
    }

    /**
     * Get messages for a specific chat.
     */
    async getMessages(chatId: string, page: number): Promise<any> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.getMessages(chatId, page, token);
        } catch (error) {
            console.error('ChatService: Error getting messages:', error);
            throw error;
        }
    }

    /**
     * Send a message in a chat.
     */
    async sendMessage(chatId: string, messageData: any): Promise<any> {
        try {
            if (!this.validateMessageData(messageData)) {
                throw new Error('Invalid message data provided');
            }

            const sanitizedData = this.sanitizeMessageData(messageData);
            const token = this.getAuthToken();
            return await this.chatRepository.sendMessage(chatId, sanitizedData, token);
        } catch (error) {
            console.error('ChatService: Error sending message:', error);
            throw error;
        }
    }

    /**
     * Get chat details.
     */
    async getChatDetails(chatId: string): Promise<any> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.getChatDetails(chatId, token);
        } catch (error) {
            console.error('ChatService: Error getting chat details:', error);
            throw error;
        }
    }

    /**
     * Update chat settings.
     */
    async updateChatSettings(chatId: string, settings: any): Promise<any> {
        try {
            if (!settings || typeof settings !== 'object') {
                throw new Error('Invalid settings object provided');
            }
            const token = this.getAuthToken();
            return await this.chatRepository.updateChatSettings(chatId, settings, token);
        } catch (error) {
            console.error('ChatService: Error updating chat settings:', error);
            throw error;
        }
    }

    /**
     * Search chats.
     */
    async searchChats(query: string, userId: string): Promise<any> {
        try {
            if (!query || typeof query !== 'string' || query.trim() === '') {
                throw new Error('Invalid search query provided');
            }
            const token = this.getAuthToken();
            return await this.chatRepository.searchChats(query, userId, token);
        } catch (error) {
            console.error('ChatService: Error searching chats:', error);
            throw error;
        }
    }

    /**
     * Get chat participants.
     */
    async getChatParticipants(chatId: string): Promise<any[]> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.getChatParticipants(chatId, token);
        } catch (error) {
            console.error('ChatService: Error getting participants:', error);
            throw error;
        }
    }

    /**
     * Add participant to chat.
     */
    async addParticipant(chatId: string, participantId: string): Promise<any> {
        try {
            if (!this.validateParticipantData({ participantId })) {
                throw new Error('Invalid participant data provided');
            }

            const sanitizedData = this.sanitizeParticipantData({ participantId });
            const token = this.getAuthToken();
            return await this.chatRepository.addParticipant(chatId, sanitizedData, token);
        } catch (error) {
            console.error('ChatService: Error adding participant:', error);
            throw error;
        }
    }

    /**
     * Remove participant from chat.
     */
    async removeParticipant(chatId: string, participantId: string): Promise<any> {
        try {
            if (!this.validateParticipantData({ participantId })) {
                throw new Error('Invalid participant data provided');
            }

            const sanitizedData = this.sanitizeParticipantData({ participantId });
            const token = this.getAuthToken();
            return await this.chatRepository.removeParticipant(chatId, sanitizedData, token);
        } catch (error) {
            console.error('ChatService: Error removing participant:', error);
            throw error;
        }
    }

    /**
     * Mark messages as read.
     */
    async markMessagesAsRead(chatId: string, messageIds: string[]): Promise<any> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.markMessagesAsRead(chatId, messageIds, token);
        } catch (error) {
            console.error('ChatService: Error marking messages as read:', error);
            throw error;
        }
    }

    /**
     * Get unread message count.
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const token = this.getAuthToken();
            return await this.chatRepository.getUnreadCount(userId, token);
        } catch (error) {
            console.error('ChatService: Error getting unread count:', error);
            throw error;
        }
    }

    /**
     * Validate chat data.
     */
    validateChatData(chatData: any): boolean {
        if (!chatData || typeof chatData !== 'object') {
            return false;
        }

        // Basic validation
        if (!chatData.userIds || !Array.isArray(chatData.userIds) || chatData.userIds.length === 0) {
            return false;
        }

        if (!chatData.recipientId || typeof chatData.recipientId !== 'string' || chatData.recipientId.trim() === '') {
            return false;
        }

        if (!chatData.text || typeof chatData.text !== 'string' || chatData.text.trim() === '') {
            return false;
        }

        return true;
    }

    /**
     * Sanitize chat data.
     */
    sanitizeChatData(chatData: any): any {
        const sanitized = { ...chatData };

        // Sanitize text
        if (sanitized.text) {
            sanitized.text = sanitized.text.trim().substring(0, 500);
        }

        // Ensure boolean values
        if (sanitized.isGroupChat !== undefined) {
            sanitized.isGroupChat = Boolean(sanitized.isGroupChat);
        }

        return sanitized;
    }

    /**
     * Validate message data.
     */
    validateMessageData(messageData: any): boolean {
        if (!messageData || typeof messageData !== 'object') {
            return false;
        }

        if (!messageData.content || typeof messageData.content !== 'string' || messageData.content.trim() === '') {
            return false;
        }

        if (!messageData.type || typeof messageData.type !== 'string' || messageData.type.trim() === '') {
            return false;
        }

        return true;
    }

    /**
     * Sanitize message data.
     */
    sanitizeMessageData(messageData: any): any {
        const sanitized = { ...messageData };

        // Sanitize content
        if (sanitized.content) {
            sanitized.content = sanitized.content.trim().substring(0, 1000);
        }

        return sanitized;
    }

    /**
     * Validate participant data.
     */
    validateParticipantData(participantData: any): boolean {
        if (!participantData || typeof participantData !== 'object') {
            return false;
        }

        if (!participantData.participantId || typeof participantData.participantId !== 'string' || participantData.participantId.trim() === '') {
            return false;
        }

        return true;
    }

    /**
     * Sanitize participant data.
     */
    sanitizeParticipantData(participantData: any): any {
        const sanitized = { ...participantData };

        // Ensure participant ID is string
        if (sanitized.participantId) {
            sanitized.participantId = String(sanitized.participantId);
        }

        return sanitized;
    }

    /**
     * Get authentication token from store.
     */
    private getAuthToken(): string {
        try {
            // Try require first (for CommonJS environments)
            if (typeof require !== 'undefined') {
                const authStore = require('@services/store/zustand').useAuthStore.getState();
                return authStore.data.accessToken || '';
            } else {
                // Fallback for test environments
                return 'test-token';
            }
        } catch (error) {
            console.error('ChatService: Error getting auth token', error);
            return '';
        }
    }
}
