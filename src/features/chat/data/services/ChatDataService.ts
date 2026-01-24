/**
 * Chat Data Service
 * 
 * Provides intelligent caching and orchestration for chat operations.
 * Wraps the chat repository with enterprise-grade caching strategies.
 * Integrates with WebSocket for real-time updates.
 */

import { Injectable } from '@/core/di';
import { CacheProvider } from '@/core/cache';
import type { IChatRepository } from '@/features/chat/domain/entities/IChatRepository';
import { CHAT_CACHE_KEYS, CHAT_INVALIDATION_PATTERNS } from '../cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/features/chat/data/models/chat";
import type { ResId, JwtToken } from "@/shared/api/models/common";
import { WebSocketService } from './WebSocketService';

@Injectable()
export class ChatDataService {
  constructor(
    private cache: CacheProvider,
    private repository: IChatRepository,
    private webSocketService: WebSocketService
  ) {}
  
  // Chat operations
  async getChats(userId: string, token: JwtToken): Promise<ChatList> {
    const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(userId);
    
    // Cache-first lookup
    let chats = this.cache.get<ChatList>(cacheKey);
    if (chats) return chats;
    
    // Fetch from repository
    chats = await this.repository.getChats(userId, token);
    
    // Cache with medium TTL for chat lists
    this.cache.set(cacheKey, chats, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    return chats;
  }
  
  async createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse> {
    const result = await this.repository.createChat(chatData, token);
    
    // Invalidate user chat caches
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.USER_CHAT_DATA(String(chatData.userIds[0])));
    
    // Cache the new chat
    const chatCacheKey = CHAT_CACHE_KEYS.CHAT_INFO(String(result.id));
    this.cache.set(chatCacheKey, result, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    // Send real-time notification
    this.webSocketService.send('chat_created', result, String(result.id), String(chatData.userIds[0]));
    
    return result;
  }
  
  async deleteChat(chatId: ResId, token: JwtToken): Promise<Response> {
    const result = await this.repository.deleteChat(chatId, token);
    
    // Invalidate all chat-related caches
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(String(chatId)));
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_INFO(String(chatId)));
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(String(chatId)));
    
    // Send real-time notification
    this.webSocketService.send('chat_deleted', { chatId }, chatId);
    
    return result;
  }
  
  async getChatDetails(chatId: ResId, token: JwtToken): Promise<ChatResponse> {
    const cacheKey = CHAT_CACHE_KEYS.CHAT_INFO(String(chatId));
    
    // Cache-first lookup
    let chat = this.cache.get<ChatResponse>(cacheKey);
    if (chat) return chat;
    
    // Fetch from repository
    chat = await this.repository.getChatDetails(chatId, token);
    
    // Cache with longer TTL for chat info
    this.cache.set(cacheKey, chat, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    return chat;
  }
  
  async updateChatSettings(chatId: ResId, settings: any, token: JwtToken): Promise<ChatResponse> {
    const result = await this.repository.updateChatSettings(chatId, settings, token);
    
    // Update cache
    const cacheKey = CHAT_CACHE_KEYS.CHAT_INFO(String(chatId));
    this.cache.set(cacheKey, result, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    // Invalidate settings cache
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_SETTINGS(String(chatId)));
    
    // Send real-time notification
    this.webSocketService.send('chat_settings_updated', { chatId, settings }, chatId);
    
    return result;
  }
  
  // Message operations
  async getMessages(chatId: ResId, page: number, token: JwtToken): Promise<PagedMessage> {
    const cacheKey = CHAT_CACHE_KEYS.MESSAGES(String(chatId), page);
    
    // Cache-first lookup
    let messages = this.cache.get<PagedMessage>(cacheKey);
    if (messages) return messages;
    
    // Fetch from repository
    messages = await this.repository.getMessages(chatId, page, token);
    
    // Cache with medium TTL for messages
    this.cache.set(cacheKey, messages, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    return messages;
  }
  
  async sendMessage(chatId: ResId, messageData: any, token: JwtToken): Promise<any> {
    const result = await this.repository.sendMessage(chatId, messageData, token);
    
    // Invalidate message caches for this chat
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(String(chatId)));
    
    // Invalidate user chat data for all participants
    if (messageData.participants) {
      messageData.participants.forEach((userId: string) => {
        this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.USER_CHAT_DATA(userId));
      });
    }
    
    // Send real-time message
    this.webSocketService.sendMessage(chatId, result);
    
    return result;
  }
  
  async deleteMessage(messageId: string, token: JwtToken): Promise<void> {
    await this.repository.deleteMessage(messageId, token);
    
    // Invalidate message cache
    this.cache.invalidate(CHAT_CACHE_KEYS.MESSAGE(messageId));
    
    // Send real-time notification
    this.webSocketService.send('message_deleted', { messageId }, undefined, undefined);
  }
  
  async markMessagesAsRead(chatId: ResId, messageIds: string[], token: JwtToken): Promise<any> {
    const result = await this.repository.markMessagesAsRead(chatId, messageIds, token);
    
    // Invalidate message caches for this chat
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(String(chatId)));
    
    // Invalidate user chat data for all participants
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.USER_CHAT_DATA('*'));
    
    // Send real-time notification
    this.webSocketService.send('messages_read', { chatId, messageIds }, chatId);
    
    return result;
  }
  
  async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
    const cacheKey = CHAT_CACHE_KEYS.UNREAD_COUNT(userId);
    
    // Very short TTL for unread count (real-time data)
    let count = this.cache.get<number>(cacheKey);
    if (count !== undefined) return count;
    
    // Fetch from repository
    count = await this.repository.getUnreadCount(userId, token);
    
    // Cache with very short TTL (30 seconds)
    this.cache.set(cacheKey, count, 30000);
    
    return count;
  }

  // Search operations
  async searchChats(query: string, userId: string, token: JwtToken): Promise<ChatList> {
    const cacheKey = CHAT_CACHE_KEYS.SEARCH_RESULTS(query, 0);
    
    // Cache-first lookup with short TTL for search results
    let results = this.cache.get<ChatList>(cacheKey);
    if (results) return results;
    
    // Fetch from repository
    results = await this.repository.searchChats(query, userId, token);
    
    // Cache with short TTL for search results
    this.cache.set(cacheKey, results, CACHE_TIME_MAPPINGS.SEARCH_CACHE_TIME);
    
    return results;
  }
  
  // Participant operations (enhanced with validation)
  async getChatParticipants(chatId: ResId, token: JwtToken): Promise<any[]> {
    const cacheKey = CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(String(chatId));
    
    // Cache-first lookup
    let participants = this.cache.get<any[]>(cacheKey);
    if (participants) return participants;
    
    // Fetch from repository
    participants = await this.repository.getChatParticipants(chatId, token);
    
    // Cache with medium TTL for participants
    this.cache.set(cacheKey, participants, CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME);
    
    return participants;
  }

  async addParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
    // Validate participant data
    if (!this.validateParticipantData({ participantId })) {
      throw new Error('Invalid participant data provided');
    }

    const sanitizedData = this.sanitizeParticipantData({ participantId });
    const result = await this.repository.addParticipant(chatId, sanitizedData.participantId, token);
    
    // Invalidate participants cache
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(String(chatId)));
    
    // Send real-time notification
    this.webSocketService.send('participant_added', { chatId, participantId }, chatId);
    
    return result;
  }

  async removeParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
    // Validate participant data
    if (!this.validateParticipantData({ participantId })) {
      throw new Error('Invalid participant data provided');
    }

    const sanitizedData = this.sanitizeParticipantData({ participantId });
    const result = await this.repository.removeParticipant(chatId, sanitizedData.participantId, token);
    
    // Invalidate participants cache
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(String(chatId)));
    
    // Send real-time notification
    this.webSocketService.send('participant_removed', { chatId, participantId }, chatId);
    
    return result;
  }

  // Validation and sanitization methods (from legacy ChatService)
  private validateParticipantData(participantData: any): boolean {
    if (!participantData || typeof participantData !== 'object') {
      return false;
    }

    if (!participantData.participantId || typeof participantData.participantId !== 'string' || participantData.participantId.trim() === '') {
      return false;
    }

    return true;
  }

  private sanitizeParticipantData(participantData: any): any {
    const sanitized = { ...participantData };

    // Ensure participant ID is string
    if (sanitized.participantId) {
      sanitized.participantId = String(sanitized.participantId);
    }

    return sanitized;
  }
  
  // Real-time state operations
  async getTypingIndicators(chatId: string): Promise<string[]> {
    const cacheKey = CHAT_CACHE_KEYS.TYPING_INDICATORS(chatId);
    
    // Very short TTL for real-time data
    let indicators = this.cache.get<string[]>(cacheKey);
    if (indicators) return indicators;
    
    // Return empty array for now (would be populated by WebSocket)
    indicators = [];
    
    // Cache with very short TTL (30 seconds)
    this.cache.set(cacheKey, indicators, 30000);
    
    return indicators;
  }
  
  async setTypingIndicator(chatId: string, userId: string, isTyping: boolean): Promise<void> {
    // Invalidate typing indicators cache
    this.cache.invalidate(CHAT_CACHE_KEYS.TYPING_INDICATORS(chatId));
    
    // Send via WebSocket
    this.webSocketService.sendTypingIndicator(chatId, userId, isTyping);
  }
  
  async getOnlineStatus(userId: string): Promise<boolean> {
    const cacheKey = CHAT_CACHE_KEYS.ONLINE_STATUS(userId);
    
    // Very short TTL for online status
    let status = this.cache.get<boolean>(cacheKey);
    if (status !== undefined) return status;
    
    // Return false for now (would be populated by WebSocket)
    status = false;
    
    // Cache with very short TTL (30 seconds)
    this.cache.set(cacheKey, status, 30000);
    
    return status;
  }
  
  async setOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    // Update cache
    const cacheKey = CHAT_CACHE_KEYS.ONLINE_STATUS(userId);
    this.cache.set(cacheKey, isOnline, 60000); // 1 minute TTL
    
    // Send via WebSocket
    this.webSocketService.sendOnlineStatus(userId, isOnline);
  }
  
  // Real-time subscription methods
  subscribeToChatMessages(chatId: string, callback: (message: any) => void): () => void {
    return this.webSocketService.subscribeToChatMessages(chatId, callback);
  }
  
  subscribeToTypingIndicators(chatId: string, callback: (userIds: string[]) => void): () => void {
    return this.webSocketService.subscribeToTypingIndicators(chatId, callback);
  }
  
  subscribeToOnlineStatus(callback: (userId: string, isOnline: boolean) => void): () => void {
    return this.webSocketService.subscribeToOnlineStatus(callback);
  }
  
  // WebSocket connection management
  async connectWebSocket(url: string): Promise<void> {
    return await this.webSocketService.connect(url);
  }
  
  disconnectWebSocket(): void {
    this.webSocketService.disconnect();
  }
  
  getWebSocketStatus(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    return this.webSocketService.connectionState;
  }
  
  // WebSocket event subscription methods
  onConnect(callback: () => void): () => void {
    return this.webSocketService.onConnect(callback);
  }
  
  onDisconnect(callback: () => void): () => void {
    return this.webSocketService.onDisconnect(callback);
  }
  
  // Utility methods
  async invalidateChatData(chatId: ResId): Promise<void> {
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.CHAT_MESSAGES(String(chatId)));
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_INFO(String(chatId)));
    this.cache.invalidate(CHAT_CACHE_KEYS.CHAT_PARTICIPANTS(String(chatId)));
    this.cache.invalidate(CHAT_CACHE_KEYS.TYPING_INDICATORS(String(chatId)));
  }
  
  async invalidateUserData(userId: string): Promise<void> {
    this.cache.invalidatePattern(CHAT_INVALIDATION_PATTERNS.USER_CHAT_DATA(userId));
  }
  
  // Cache statistics
  getChatCacheStats(): any {
    const stats = this.cache.getStats();
    // Since we can't access keys directly, we'll return basic stats
    // In a real implementation, you might want to add a getKeys() method to CacheProvider
    return {
      totalCacheSize: stats.size,
      hitRate: stats.hitRate,
      totalHits: stats.hits,
      totalMisses: stats.misses,
      // Note: Detailed breakdown would require CacheProvider to expose keys() method
    };
  }
  
  // WebSocket subscription statistics
  getWebSocketStats(): any {
    return this.webSocketService.getSubscriptionStats();
  }
  
  // Public cache access methods for testing
  setCacheData<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, data, ttl);
  }
  
  getCacheData<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }
  
  invalidateCacheData(key: string): void {
    this.cache.invalidate(key);
  }
  
  getCacheProvider(): CacheProvider {
    return this.cache;
  }
}
