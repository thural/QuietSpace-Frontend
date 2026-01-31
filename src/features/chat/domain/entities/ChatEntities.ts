/**
 * Chat Domain Entities.
 * 
 * Defines the core domain entities for chat functionality.
 */

import type { ResId } from "@/shared/api/models/common";

/**
 * Chat Query entity.
 */
export interface ChatQuery {
    userId: string;
    chatId?: ResId;
    category: 'all' | 'unread' | 'archived' | 'search';
    filters?: ChatFilters;
}

/**
 * Chat Filters entity.
 */
export interface ChatFilters {
    isActive?: boolean;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    participants?: string[];
    hasUnreadMessages?: boolean;
    searchQuery?: string;
}

/**
 * Chat Result entity.
 */
export interface ChatResult {
    data: any;
    metadata: {
        timestamp: string;
        userId: string;
        chatId?: string;
        messageCount: number;
        unreadCount: number;
        isUpdated: boolean;
    };
}

/**
 * Chat Message entity.
 */
export interface ChatMessage {
    id: string;
    chatId: ResId;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    messageType: 'text' | 'image' | 'file' | 'system';
    attachments?: ChatAttachment[];
    replyTo?: string;
    reactions?: ChatReaction[];
}

/**
 * Chat Attachment entity.
 */
export interface ChatAttachment {
    id: string;
    filename: string;
    url: string;
    size: number;
    type: string;
    thumbnailUrl?: string;
}

/**
 * Chat Reaction entity.
 */
export interface ChatReaction {
    messageId: string;
    userId: string;
    reaction: string;
    timestamp: string;
}

/**
 * Chat Settings entity.
 */
export interface ChatSettings {
    sound: boolean;
    vibration: boolean;
    doNotDisturb: boolean;
    autoMarkAsRead: boolean;
    messagePreview: boolean;
    typingIndicators: boolean;
    onlineStatus: boolean;
    readReceipts: boolean;
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
}

/**
 * Chat Participant entity.
 */
export interface ChatParticipant {
    id: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'moderator' | 'member';
    isOnline: boolean;
    lastSeen?: string;
    typingStatus?: boolean;
    permissions: {
        canSendMessages: boolean;
        canAddParticipants: boolean;
        canRemoveParticipants: boolean;
        canDeleteMessages: boolean;
        canPinMessages: boolean;
    };
}

/**
 * Chat Status entity.
 */
export interface ChatStatus {
    chatId: ResId;
    isOnline: boolean;
    isTyping: string[];
    lastActivity: string;
    participantCount: number;
    unreadCount: number;
}

/**
 * Chat Typing Indicator entity.
 */
export interface ChatTypingIndicator {
    chatId: ResId;
    userId: string;
    userName: string;
    isTyping: boolean;
    timestamp: string;
}
