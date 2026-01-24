/**
 * Chat Presence Service
 * 
 * Manages real-time presence features including:
 * - Online/offline status
 * - Typing indicators
 * - User presence awareness
 * - Last seen tracking
 */

import { Injectable } from '@/core/di';
import { WebSocketService } from '@/features/chat/data/services/WebSocketService';
import { CacheProvider } from '@/core/cache';
import { ChatMetricsService } from '@/features/chat/application/services/ChatMetricsService';

export interface UserPresence {
    userId: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    lastSeen: number;
    isTyping: boolean;
    typingInChat?: string;
    currentChat?: string;
}

export interface TypingIndicator {
    userId: string;
    chatId: string;
    isTyping: boolean;
    timestamp: number;
}

export interface PresenceUpdate {
    userId: string;
    status: UserPresence['status'];
    timestamp: number;
    currentChat?: string;
}

export interface TypingUpdate {
    userId: string;
    chatId: string;
    isTyping: boolean;
    timestamp: number;
}

@Injectable()
export class ChatPresenceService {
    private presenceCache: Map<string, UserPresence> = new Map();
    private typingIndicators: Map<string, Set<string>> = new Map(); // chatId -> Set of userIds
    private typingTimeouts: Map<string, NodeJS.Timeout> = new Map(); // userId -> timeout
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private currentUserId: string | null = null;

    constructor(
        private webSocketService: WebSocketService,
        private cache: CacheProvider,
        private metricsService: ChatMetricsService
    ) {}

    /**
     * Initialize presence service for a user
     */
    async initialize(userId: string): Promise<void> {
        this.currentUserId = userId;
        
        // Subscribe to presence updates
        this.webSocketService.subscribe('presence:update', this.handlePresenceUpdate.bind(this));
        this.webSocketService.subscribe('typing:update', this.handleTypingUpdate.bind(this));
        this.webSocketService.subscribe('user:connected', this.handleUserConnected.bind(this));
        this.webSocketService.subscribe('user:disconnected', this.handleUserDisconnected.bind(this));

        // Start heartbeat for maintaining own presence
        this.startHeartbeat();

        // Set initial presence
        await this.updatePresence(userId, 'online');
    }

    /**
     * Cleanup presence service
     */
    cleanup(): void {
        this.stopHeartbeat();
        
        if (this.currentUserId) {
            this.updatePresence(this.currentUserId, 'offline');
        }

        // Clear all typing timeouts
        this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
        this.typingTimeouts.clear();
    }

    /**
     * Update user presence status
     */
    async updatePresence(userId: string, status: UserPresence['status'], currentChat?: string): Promise<void> {
        const presence: UserPresence = {
            userId,
            status,
            lastSeen: Date.now(),
            isTyping: false,
            currentChat
        };

        // Update local cache
        this.presenceCache.set(userId, presence);

        // Cache for offline access
        const cacheKey = `presence:${userId}`;
        this.cache.set(cacheKey, presence, { ttl: 300000 }); // 5 minutes

        // Broadcast to others if it's current user
        if (userId === this.currentUserId) {
            const update: PresenceUpdate = {
                userId,
                status,
                timestamp: Date.now(),
                currentChat
            };

            this.webSocketService.send({
                type: 'presence_update',
                data: update
            });

            // Track presence update
            this.metricsService.recordInteraction('presence', { status, currentChat });
        }
    }

    /**
     * Start typing indicator
     */
    startTyping(userId: string, chatId: string): void {
        if (userId !== this.currentUserId) return;

        // Clear existing timeout
        const existingTimeout = this.typingTimeouts.get(userId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Update local state
        const presence = this.presenceCache.get(userId);
        if (presence) {
            presence.isTyping = true;
            presence.typingInChat = chatId;
        }

        // Add to typing indicators for this chat
        if (!this.typingIndicators.has(chatId)) {
            this.typingIndicators.set(chatId, new Set());
        }
        this.typingIndicators.get(chatId)!.add(userId);

        // Broadcast typing start
        const typingUpdate: TypingUpdate = {
            userId,
            chatId,
            isTyping: true,
            timestamp: Date.now()
        };

        this.webSocketService.send({
            type: 'typing_update',
            data: typingUpdate
        });

        // Set timeout to stop typing after 3 seconds of inactivity
        const timeout = setTimeout(() => {
            this.stopTyping(userId, chatId);
        }, 3000);

        this.typingTimeouts.set(userId, timeout);

        // Track typing interaction
        this.metricsService.recordInteraction('typing', { chatId });
    }

    /**
     * Stop typing indicator
     */
    stopTyping(userId: string, chatId: string): void {
        if (userId !== this.currentUserId) return;

        // Clear timeout
        const timeout = this.typingTimeouts.get(userId);
        if (timeout) {
            clearTimeout(timeout);
            this.typingTimeouts.delete(userId);
        }

        // Update local state
        const presence = this.presenceCache.get(userId);
        if (presence) {
            presence.isTyping = false;
            presence.typingInChat = undefined;
        }

        // Remove from typing indicators
        const chatTypingUsers = this.typingIndicators.get(chatId);
        if (chatTypingUsers) {
            chatTypingUsers.delete(userId);
            if (chatTypingUsers.size === 0) {
                this.typingIndicators.delete(chatId);
            }
        }

        // Broadcast typing stop
        const typingUpdate: TypingUpdate = {
            userId,
            chatId,
            isTyping: false,
            timestamp: Date.now()
        };

        this.webSocketService.send({
            type: 'typing_update',
            data: typingUpdate
        });
    }

    /**
     * Get user presence information
     */
    getUserPresence(userId: string): UserPresence | null {
        // Check local cache first
        let presence = this.presenceCache.get(userId);
        
        if (!presence) {
            // Check cache
            const cacheKey = `presence:${userId}`;
            presence = this.cache.get(cacheKey);
            
            if (presence) {
                this.presenceCache.set(userId, presence);
            }
        }

        return presence || null;
    }

    /**
     * Get typing indicators for a chat
     */
    getTypingUsers(chatId: string): string[] {
        const typingUsers = this.typingIndicators.get(chatId);
        return typingUsers ? Array.from(typingUsers) : [];
    }

    /**
     * Get all online users in a chat
     */
    getOnlineUsers(chatId: string, participantIds: string[]): UserPresence[] {
        return participantIds
            .map(userId => this.getUserPresence(userId))
            .filter((presence): presence is UserPresence => 
                presence !== null && presence.status === 'online'
            );
    }

    /**
     * Get presence summary for multiple users
     */
    getPresenceSummary(userIds: string[]): {
        online: number;
        offline: number;
        away: number;
        busy: number;
        typing: number;
    } {
        const summary = {
            online: 0,
            offline: 0,
            away: 0,
            busy: 0,
            typing: 0
        };

        userIds.forEach(userId => {
            const presence = this.getUserPresence(userId);
            if (presence) {
                summary[presence.status]++;
                if (presence.isTyping) {
                    summary.typing++;
                }
            } else {
                summary.offline++;
            }
        });

        return summary;
    }

    /**
     * Handle incoming presence updates
     */
    private handlePresenceUpdate(message: any): void {
        const update: PresenceUpdate = message.data;
        
        const presence: UserPresence = {
            userId: update.userId,
            status: update.status,
            lastSeen: update.timestamp,
            isTyping: false,
            currentChat: update.currentChat
        };

        // Update local cache
        this.presenceCache.set(update.userId, presence);

        // Update cache
        const cacheKey = `presence:${update.userId}`;
        this.cache.set(cacheKey, presence, { ttl: 300000 });

        // Track presence update
        this.metricsService.recordWebSocketEvent('presence_update');
    }

    /**
     * Handle incoming typing updates
     */
    private handleTypingUpdate(message: any): void {
        const update: TypingUpdate = message.data;
        
        // Don't process own updates
        if (update.userId === this.currentUserId) return;

        const presence = this.presenceCache.get(update.userId);
        if (presence) {
            presence.isTyping = update.isTyping;
            presence.typingInChat = update.isTyping ? update.chatId : undefined;
        }

        // Update typing indicators
        if (update.isTyping) {
            if (!this.typingIndicators.has(update.chatId)) {
                this.typingIndicators.set(update.chatId, new Set());
            }
            this.typingIndicators.get(update.chatId)!.add(update.userId);

            // Auto-stop typing after 5 seconds for remote users
            setTimeout(() => {
                const chatTypingUsers = this.typingIndicators.get(update.chatId);
                if (chatTypingUsers) {
                    chatTypingUsers.delete(update.userId);
                    if (chatTypingUsers.size === 0) {
                        this.typingIndicators.delete(update.chatId);
                    }
                }
            }, 5000);
        } else {
            const chatTypingUsers = this.typingIndicators.get(update.chatId);
            if (chatTypingUsers) {
                chatTypingUsers.delete(update.userId);
                if (chatTypingUsers.size === 0) {
                    this.typingIndicators.delete(update.chatId);
                }
            }
        }

        // Track typing update
        this.metricsService.recordWebSocketEvent('typing_update');
    }

    /**
     * Handle user connected event
     */
    private handleUserConnected(message: any): void {
        const { userId } = message.data;
        
        if (userId !== this.currentUserId) {
            this.updatePresence(userId, 'online');
        }
    }

    /**
     * Handle user disconnected event
     */
    private handleUserDisconnected(message: any): void {
        const { userId } = message.data;
        
        if (userId !== this.currentUserId) {
            this.updatePresence(userId, 'offline');
        }
    }

    /**
     * Start heartbeat to maintain presence
     */
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.currentUserId) {
                this.webSocketService.send({
                    type: 'heartbeat',
                    data: {
                        userId: this.currentUserId,
                        timestamp: Date.now()
                    }
                });
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Get presence statistics
     */
    getPresenceStats(): {
        totalUsers: number;
        onlineUsers: number;
        typingUsers: number;
        activeChats: number;
    } {
        const totalUsers = this.presenceCache.size;
        const onlineUsers = Array.from(this.presenceCache.values())
            .filter(p => p.status === 'online').length;
        const typingUsers = Array.from(this.presenceCache.values())
            .filter(p => p.isTyping).length;
        const activeChats = this.typingIndicators.size;

        return {
            totalUsers,
            onlineUsers,
            typingUsers,
            activeChats
        };
    }
}
