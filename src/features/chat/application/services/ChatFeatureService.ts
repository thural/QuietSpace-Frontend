/**
 * Chat Feature Service
 * 
 * Provides business logic and orchestration for chat operations.
 * Handles validation, business rules, and cross-service coordination.
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { ChatDataLayer } from '@/features/chat/data/ChatDataLayer';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/features/chat/data/models/chat";
import type { ResId, JwtToken } from "@/shared/api/models/common";

@Injectable()
export class ChatFeatureService {
  constructor(
    private chatDataLayer: ChatDataLayer
  ) { }

  // Chat management with business logic (enhanced with sanitization)
  async createChatWithValidation(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse> {
    // Business validation
    if (!this.validateChatCreationData(chatData)) {
      throw new Error('Invalid chat creation data');
    }

    // Business rules
    if (!this.checkChatCreationRules(chatData)) {
      throw new Error('Chat creation violates business rules');
    }

    // Sanitize data
    const sanitizedData = this.sanitizeChatData(chatData);

    // Create chat through data service
    return await this.chatDataLayer.createChat(sanitizedData, token);
  }

  async sendMessageWithValidation(
    chatId: ResId,
    messageData: any,
    token: JwtToken
  ): Promise<any> {
    // Business validation
    if (!this.validateMessageData(messageData)) {
      throw new Error('Invalid message data');
    }

    // Business rules
    if (!this.checkMessageRules(chatId, messageData)) {
      throw new Error('Message violates business rules');
    }

    // Sanitize data
    const sanitizedData = this.sanitizeMessageData(messageData);

    // Send message through data service
    const result = await this.chatDataLayer.sendMessage(chatId, sanitizedData, token);

    // Post-send business logic
    await this.handlePostMessageActions(result);

    return result;
  }

  // Advanced chat operations
  async getChatWithMetadata(chatId: ResId, token: JwtToken): Promise<ChatResponse & { metadata: any }> {
    const chat = await this.chatDataLayer.getChatDetails(chatId, token);
    const participants = await this.chatDataLayer.getChatParticipants(chatId, token);
    const typingIndicators = await this.chatDataLayer.getTypingIndicators(chatId);

    return {
      ...chat,
      metadata: {
        participants,
        typingIndicators,
        unreadCount: await this.calculateUnreadCount(chatId, token)
      }
    };
  }

  async getUserChatSummary(userId: string, token: JwtToken): Promise<{
    totalChats: number;
    unreadMessages: number;
    activeChats: number;
    recentChats: ChatResponse[];
  }> {
    const chats = await this.chatDataLayer.getChats(userId, token);

    const unreadMessages = await this.calculateTotalUnreadCount(userId, token);
    const activeChats = chats.content.filter(chat =>
      chat.lastMessage &&
      new Date(chat.lastMessage.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const recentChats = chats.content
      .filter(chat => chat.lastMessage)
      .sort((a, b) => new Date(b.lastMessage!.timestamp).getTime() - new Date(a.lastMessage!.timestamp).getTime())
      .slice(0, 5);

    return {
      totalChats: chats.content.length,
      unreadMessages,
      activeChats,
      recentChats
    };
  }

  // Search with business logic
  async searchChatsWithFilters(
    query: string,
    userId: string,
    filters: {
      type?: 'direct' | 'group';
      hasUnread?: boolean;
      dateRange?: { start: Date; end: Date };
    },
    token: JwtToken
  ): Promise<ChatList> {
    // Basic search
    let results = await this.chatDataLayer.searchChats(query, userId, token);

    // Apply business filters
    if (filters.type) {
      results.content = results.content.filter(chat => chat.type === filters.type);
    }

    if (filters.hasUnread) {
      results.content = results.content.filter(chat => chat.unreadCount > 0);
    }

    if (filters.dateRange) {
      results.content = results.content.filter(chat => {
        if (!chat.lastMessage) return false;
        const messageDate = new Date(chat.lastMessage.timestamp);
        return messageDate >= filters.dateRange!.start && messageDate <= filters.dateRange!.end;
      });
    }

    return results;
  }

  // Real-time operations
  async handleTypingIndicator(chatId: string, userId: string, isTyping: boolean): Promise<void> {
    await this.chatDataLayer.setTypingIndicator(chatId, userId, isTyping);

    // Business logic for typing indicators
    if (isTyping) {
      await this.handleTypingStarted(chatId, userId);
    } else {
      await this.handleTypingStopped(chatId, userId);
    }
  }

  // Validation methods (enhanced from legacy ChatService)
  private validateChatCreationData(chatData: CreateChatRequest): boolean {
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

    if (!chatData.name || typeof chatData.name !== 'string' || chatData.name.trim() === '') {
      return false;
    }

    return true;
  }

  private checkChatCreationRules(chatData: CreateChatRequest): boolean {
    // Business rules for chat creation
    if (chatData.type === 'direct' && chatData.participants.length !== 2) {
      return false;
    }

    if (chatData.type === 'group' && chatData.participants.length < 2) {
      return false;
    }

    return true;
  }

  private validateMessageData(messageData: any): boolean {
    if (!messageData || typeof messageData !== 'object') {
      return false;
    }

    if (!messageData.content || typeof messageData.content !== 'string' || messageData.content.trim() === '') {
      return false;
    }

    if (!messageData.type || typeof messageData.type !== 'string' || messageData.type.trim() === '') {
      return false;
    }

    return messageData.content.trim().length <= 4000; // Max message length
  }

  // Sanitization methods (from legacy ChatService)
  private sanitizeChatData(chatData: CreateChatRequest): CreateChatRequest {
    const sanitized = { ...chatData };

    // Sanitize name
    if (sanitized.name) {
      sanitized.name = sanitized.name.trim().substring(0, 500);
    }

    // Ensure boolean values
    if (sanitized.isGroupChat !== undefined) {
      sanitized.isGroupChat = Boolean(sanitized.isGroupChat);
    }

    return sanitized;
  }

  private sanitizeMessageData(messageData: any): any {
    const sanitized = { ...messageData };

    // Sanitize content
    if (sanitized.content) {
      sanitized.content = sanitized.content.trim().substring(0, 1000);
    }

    return sanitized;
  }

  private checkMessageRules(chatId: ResId, messageData: any): boolean {
    // Business rules for sending messages
    // Could include rate limiting, content moderation, etc.
    return true;
  }

  // Helper methods
  private async calculateUnreadCount(chatId: ResId, token: JwtToken): Promise<number> {
    // This would typically involve checking read receipts
    // For now, return a placeholder
    return 0;
  }

  private async calculateTotalUnreadCount(userId: string, token: JwtToken): Promise<number> {
    const chats = await this.chatDataLayer.getChats(userId, token);
    return chats.content.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }

  private async handlePostMessageActions(message: any): Promise<void> {
    // Business logic after message is sent
    // Could include notifications, analytics, etc.
    console.log('Post-message actions for:', message.id);
  }

  private async handleTypingStarted(chatId: string, userId: string): Promise<void> {
    // Business logic when user starts typing
    console.log(`User ${userId} started typing in chat ${chatId}`);
  }

  private async handleTypingStopped(chatId: string, userId: string): Promise<void> {
    // Business logic when user stops typing
    console.log(`User ${userId} stopped typing in chat ${chatId}`);
  }
}
