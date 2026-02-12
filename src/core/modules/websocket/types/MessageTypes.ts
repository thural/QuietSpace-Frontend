/**
 * WebSocket Message Types.
 *
 * Specific message type definitions for different features.
 */

import type { WebSocketMessage } from '../services/EnterpriseWebSocketService';

// Chat Message Types
export interface ChatMessagePayload {
  content: string;
  chatId: string;
  senderId: string;
  timestamp?: Date;
  messageType?: 'text' | 'image' | 'file';
}

export interface ChatMessage extends WebSocketMessage {
  type: 'message';
  feature: 'chat';
  payload: ChatMessagePayload;
}

// Notification Message Types
export interface NotificationPayload {
  title: string;
  body?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  userId?: string;
  actionUrl?: string;
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'push';
  feature: 'notification';
  payload: NotificationPayload;
}

// Feed Update Message Types
export interface FeedUpdatePayload {
  type: 'new_post' | 'post_updated' | 'post_deleted' | 'comment_added';
  postId?: string;
  userId?: string;
  timestamp?: Date;
}

export interface FeedUpdateMessage extends WebSocketMessage {
  type: 'update';
  feature: 'feed';
  payload: FeedUpdatePayload;
}

// Type Guards
export function isChatMessage(message: WebSocketMessage): message is ChatMessage {
  return (
    message.feature === 'chat' &&
    message.type === 'message' &&
    typeof message.payload === 'object' &&
    message.payload !== null &&
    'content' in message.payload &&
    'chatId' in message.payload &&
    'senderId' in message.payload
  );
}

export function isNotificationMessage(message: WebSocketMessage): message is NotificationMessage {
  return (
    message.feature === 'notification' &&
    message.type === 'push' &&
    typeof message.payload === 'object' &&
    message.payload !== null &&
    'title' in message.payload
  );
}

export function isFeedUpdateMessage(message: WebSocketMessage): message is FeedUpdateMessage {
  return (
    message.feature === 'feed' &&
    message.type === 'update' &&
    typeof message.payload === 'object' &&
    message.payload !== null &&
    'type' in message.payload
  );
}
