/**
 * Chat Data Layer - Intelligent Data Coordination
 * 
 * Implements the revised architectural pattern where the Data Layer
 * intelligently coordinates between Cache, Repository, and WebSocket layers.
 * Services should only access data through this layer, never directly.
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import type { IChatRepository } from '@/features/chat/domain/entities/IChatRepository';
import { CHAT_CACHE_KEYS, CHAT_INVALIDATION_PATTERNS } from '../cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/features/chat/data/models/chat";
import type { ResId, JwtToken } from "@/shared/api/models/common";
import { WebSocketService } from './WebSocketService';

export interface IChatDataLayer {
  // Chat operations
  getChats(userId: string, token: JwtToken): Promise<ChatList>;
  createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse>;
  getChat(chatId: string, token: JwtToken): Promise<ChatResponse>;
  
  // Message operations
  getMessages(chatId: string, page: number, token: JwtToken): Promise<PagedMessage>;
  sendMessage(chatId: string, message: any, token: JwtToken): Promise<any>;
  
  // Real-time operations
  subscribeToChatUpdates(chatId: string, callback: (update: any) => void): () => void;
  unsubscribeFromChatUpdates(chatId: string): void;
}

@Injectable()
export class ChatDataLayer implements IChatDataLayer {
  constructor(
    private cache: ICacheProvider,
    private repository: IChatRepository,
    private webSocketService: WebSocketService
  ) {}

  // Chat operations with intelligent caching
  async getChats(userId: string, token: JwtToken): Promise<ChatList> {
    const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(userId);

    // Cache-first lookup with freshness validation
    let chats = this.cache.get<ChatList>(cacheKey);
    if (chats && this.isDataFresh(chats, 'user_chats')) {
      return chats;
    }

    // Fetch from repository with optimization
    chats = await this.repository.getChats(userId, token);

    // Cache with intelligent TTL based on data type
    const ttl = this.calculateOptimalTTL(chats, 'user_chats');
    this.cache.set(cacheKey, chats, { ttl });

    // Set up real-time updates for this user's chats
    this.setupRealTimeChatUpdates(userId);

    return chats;
  }

  async createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse> {
    const result = await this.repository.createChat(chatData, token);

    // Intelligent cache invalidation
    this.invalidateRelatedChatCaches(String(chatData.userIds[0]));

    // Cache the new chat with optimal TTL
    const chatCacheKey = CHAT_CACHE_KEYS.CHAT_INFO(String(result.id));
    const ttl = this.calculateOptimalTTL(result, 'chat_info');
    this.cache.set(chatCacheKey, result, { ttl });

    // Set up real-time updates for the new chat
    this.setupRealTimeChatUpdates(String(result.id));

    return result;
  }

  async getChat(chatId: string, token: JwtToken): Promise<ChatResponse> {
    const cacheKey = CHAT_CACHE_KEYS.CHAT_INFO(chatId);

    // Cache-first lookup with freshness validation
    let chat = this.cache.get<ChatResponse>(cacheKey);
    if (chat && this.isDataFresh(chat, 'chat_info')) {
      return chat;
    }

    // Fetch from repository
    chat = await this.repository.getChat(chatId, token);

    if (chat) {
      // Cache with intelligent TTL
      const ttl = this.calculateOptimalTTL(chat, 'chat_info');
      this.cache.set(cacheKey, chat, { ttl });

      // Set up real-time updates
      this.setupRealTimeChatUpdates(chatId);
    }

    return chat;
  }

  // Message operations with intelligent caching
  async getMessages(chatId: string, page: number, token: JwtToken): Promise<PagedMessage> {
    const cacheKey = CHAT_CACHE_KEYS.CHAT_MESSAGES(chatId, page);

    // Cache-first lookup with freshness validation
    let messages = this.cache.get<PagedMessage>(cacheKey);
    if (messages && this.isDataFresh(messages, 'chat_messages')) {
      return messages;
    }

    // Fetch from repository
    messages = await this.repository.getMessages(chatId, page, token);

    // Cache with intelligent TTL (messages change frequently)
    const ttl = this.calculateOptimalTTL(messages, 'chat_messages');
    this.cache.set(cacheKey, messages, { ttl });

    return messages;
  }

  async sendMessage(chatId: string, message: any, token: JwtToken): Promise<any> {
    const result = await this.repository.sendMessage(chatId, message, token);

    // Intelligent cache invalidation for messages
    this.invalidateMessageCaches(chatId);

    // Broadcast real-time update via WebSocket
    this.webSocketService.broadcastMessage(chatId, result);

    return result;
  }

  // Real-time operations
  subscribeToChatUpdates(chatId: string, callback: (update: any) => void): () => void {
    return this.webSocketService.subscribeToChat(chatId, callback);
  }

  unsubscribeFromChatUpdates(chatId: string): void {
    this.webSocketService.unsubscribeFromChat(chatId);
  }

  // Private helper methods for intelligent data coordination

  private isDataFresh(data: any, dataType: string): boolean {
    // Implement intelligent freshness validation based on data type
    const now = Date.now();
    const cacheTime = data.cacheTime || 0;
    
    switch (dataType) {
      case 'user_chats':
        // User chats can be cached longer (5 minutes)
        return (now - cacheTime) < 5 * 60 * 1000;
      case 'chat_info':
        // Chat info can be cached medium duration (2 minutes)
        return (now - cacheTime) < 2 * 60 * 1000;
      case 'chat_messages':
        // Messages need to be very fresh (30 seconds)
        return (now - cacheTime) < 30 * 1000;
      default:
        return (now - cacheTime) < 60 * 1000; // Default 1 minute
    }
  }

  private calculateOptimalTTL(data: any, dataType: string): number {
    // Calculate optimal TTL based on data type and usage patterns
    switch (dataType) {
      case 'user_chats':
        return CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME || 300000; // 5 minutes
      case 'chat_info':
        return 120000; // 2 minutes
      case 'chat_messages':
        return 30000; // 30 seconds
      default:
        return 60000; // 1 minute
    }
  }

  private invalidateRelatedChatCaches(userId: string): void {
    // Intelligent cache invalidation for related chat data
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.USER_CHAT_DATA(userId));
  }

  private invalidateMessageCaches(chatId: string): void {
    // Invalidate message caches for a specific chat
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(chatId));
  }

  private setupRealTimeChatUpdates(identifier: string): void {
    // Set up WebSocket listeners for real-time updates
    this.webSocketService.subscribeToChat(identifier, (update) => {
      // Handle real-time updates and update cache intelligently
      this.handleRealTimeUpdate(identifier, update);
    });
  }

  private handleRealTimeUpdate(identifier: string, update: any): void {
    // Intelligent cache updates based on real-time events
    switch (update.type) {
      case 'new_message':
        // Invalidate message cache for the chat
        this.invalidateMessageCaches(update.chatId);
        break;
      case 'chat_updated':
        // Update chat info cache
        const chatCacheKey = CHAT_CACHE_KEYS.CHAT_INFO(update.chatId);
        this.cache.set(chatCacheKey, update.data, { 
          ttl: this.calculateOptimalTTL(update.data, 'chat_info') 
        });
        break;
      case 'user_chats_updated':
        // Invalidate user chats cache
        this.invalidateRelatedChatCaches(identifier);
        break;
    }
  }
}
