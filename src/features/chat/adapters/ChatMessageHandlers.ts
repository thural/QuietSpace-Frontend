/**
 * Chat Message Handlers
 * 
 * Provides specialized message handling for chat WebSocket messages.
 * Handles message validation, transformation, and business logic for chat operations.
 */

import { Injectable } from '@/core/di';
import { WebSocketMessage } from '@/core/websocket/types';
import { MessageResponse, ChatEvent } from '../models/chat';
import { ResId } from '@/shared/api/models/common';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { MessageResponseSchema, ChatEventSchema } from '../models/chatZod';

// Message validation result
export interface MessageValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedMessage?: MessageResponse;
}

// Typing indicator data
export interface TypingIndicatorData {
  userId: string;
  isTyping: boolean;
  chatId: string;
  timestamp: number;
}

// Online status data
export interface OnlineStatusData {
  userId: string;
  isOnline: boolean;
  lastSeen?: number;
  timestamp: number;
}

// Message delivery confirmation
export interface MessageDeliveryConfirmation {
  messageId: ResId;
  chatId: string;
  delivered: boolean;
  timestamp: number;
  error?: string;
}

/**
 * Chat Message Handlers
 * 
 * Handles validation, transformation, and business logic for chat WebSocket messages.
 */
@Injectable()
export class ChatMessageHandlers {
  
  /**
   * Handle incoming chat message
   */
  async handleChatMessage(message: WebSocketMessage): Promise<MessageValidationResult> {
    try {
      // Validate message structure
      const validationResult = this.validateMessage(message.data);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      const chatMessage = validationResult.sanitizedMessage!;
      
      // Apply business rules
      await this.applyMessageBusinessRules(chatMessage);
      
      // Transform message if needed
      const transformedMessage = await this.transformMessage(chatMessage);
      
      return {
        isValid: true,
        errors: [],
        sanitizedMessage: transformedMessage
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        sanitizedMessage: undefined
      };
    }
  }

  /**
   * Handle typing indicator
   */
  async handleTypingIndicator(message: WebSocketMessage): Promise<TypingIndicatorData> {
    const { userId, isTyping, chatId } = message.data;
    
    // Validate typing indicator data
    if (!userId || typeof isTyping !== 'boolean' || !chatId) {
      throw new Error('Invalid typing indicator data');
    }

    return {
      userId,
      isTyping,
      chatId,
      timestamp: Date.now()
    };
  }

  /**
   * Handle online status update
   */
  async handleOnlineStatus(message: WebSocketMessage): Promise<OnlineStatusData> {
    const { userId, isOnline, lastSeen } = message.data;
    
    // Validate online status data
    if (!userId || typeof isOnline !== 'boolean') {
      throw new Error('Invalid online status data');
    }

    return {
      userId,
      isOnline,
      lastSeen: lastSeen || Date.now(),
      timestamp: Date.now()
    };
  }

  /**
   * Handle chat event
   */
  async handleChatEvent(message: WebSocketMessage): Promise<ChatEvent> {
    try {
      // Validate chat event structure
      const validationResult = ChatEventSchema.safeParse(message.data);
      
      if (!validationResult.success) {
        throw new Error(`Invalid chat event: ${fromZodError(validationResult.error).message}`);
      }

      const chatEvent = validationResult.data;
      
      // Apply event business rules
      await this.applyEventBusinessRules(chatEvent);
      
      return chatEvent;

    } catch (error) {
      throw new Error(`Failed to handle chat event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle message delivery confirmation
   */
  async handleDeliveryConfirmation(message: WebSocketMessage): Promise<MessageDeliveryConfirmation> {
    const { messageId, chatId, delivered, error } = message.data;
    
    // Validate delivery confirmation data
    if (!messageId || !chatId || typeof delivered !== 'boolean') {
      throw new Error('Invalid delivery confirmation data');
    }

    return {
      messageId,
      chatId,
      delivered,
      timestamp: Date.now(),
      error
    };
  }

  /**
   * Validate message structure and content
   */
  private validateMessage(messageData: any): MessageValidationResult {
    const errors: string[] = [];

    try {
      // Use Zod schema for validation
      const validationResult = MessageResponseSchema.safeParse(messageData);
      
      if (!validationResult.success) {
        return {
          isValid: false,
          errors: [fromZodError(validationResult.error).message],
          sanitizedMessage: undefined
        };
      }

      const message = validationResult.data;

      // Additional business validation
      if (!message.content || message.content.trim().length === 0) {
        errors.push('Message content cannot be empty');
      }

      if (message.content && message.content.length > 4000) {
        errors.push('Message content too long (max 4000 characters)');
      }

      if (!message.senderId) {
        errors.push('Message must have a sender');
      }

      if (!message.chatId) {
        errors.push('Message must belong to a chat');
      }

      // Check for forbidden content
      if (this.containsForbiddenContent(message.content)) {
        errors.push('Message contains forbidden content');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
          sanitizedMessage: undefined
        };
      }

      // Sanitize message content
      const sanitizedMessage = this.sanitizeMessage(message);

      return {
        isValid: true,
        errors: [],
        sanitizedMessage
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
        sanitizedMessage: undefined
      };
    }
  }

  /**
   * Apply business rules to message
   */
  private async applyMessageBusinessRules(message: MessageResponse): Promise<void> {
    // Rate limiting check would go here
    // Permission check would go here
    // Spam detection would go here
    
    // Add timestamp if not present
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    // Add message ID if not present
    if (!message.id) {
      message.id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * Apply business rules to chat events
   */
  private async applyEventBusinessRules(event: ChatEvent): Promise<void> {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Validate event-specific business rules
    switch (event.type) {
      case 'DELETE_MESSAGE':
        if (!event.data?.messageId) {
          throw new Error('Delete message event must include messageId');
        }
        break;
        
      case 'SEEN_MESSAGE':
        if (!event.data?.messageId) {
          throw new Error('Seen message event must include messageId');
        }
        break;
        
      case 'LEFT_CHAT':
        if (!event.data?.chatId) {
          throw new Error('Left chat event must include chatId');
        }
        break;
        
      case 'EXCEPTION':
        if (!event.data?.error) {
          throw new Error('Exception event must include error message');
        }
        break;
    }
  }

  /**
   * Transform message if needed
   */
  private async transformMessage(message: MessageResponse): Promise<MessageResponse> {
    // Add any necessary transformations
    const transformed = { ...message };

    // Process mentions
    if (transformed.content) {
      transformed.content = this.processMentions(transformed.content);
    }

    // Process emojis
    if (transformed.content) {
      transformed.content = this.processEmojis(transformed.content);
    }

    // Add metadata
    transformed.metadata = {
      ...transformed.metadata,
      processedAt: Date.now(),
      version: '1.0'
    };

    return transformed;
  }

  /**
   * Sanitize message content
   */
  private sanitizeMessage(message: MessageResponse): MessageResponse {
    const sanitized = { ...message };

    if (sanitized.content) {
      // Remove HTML tags
      sanitized.content = sanitized.content.replace(/<[^>]*>/g, '');
      
      // Normalize whitespace
      sanitized.content = sanitized.content.replace(/\s+/g, ' ').trim();
      
      // Escape special characters if needed
      sanitized.content = this.escapeSpecialCharacters(sanitized.content);
    }

    return sanitized;
  }

  /**
   * Check for forbidden content
   */
  private containsForbiddenContent(content: string): boolean {
    const forbiddenWords = ['spam', 'abuse', 'inappropriate']; // This would come from a config
    
    const lowerContent = content.toLowerCase();
    return forbiddenWords.some(word => lowerContent.includes(word));
  }

  /**
   * Process mentions in message content
   */
  private processMentions(content: string): string {
    // Convert @username to mention format
    return content.replace(/@(\w+)/g, '<mention>$1</mention>');
  }

  /**
   * Process emojis in message content
   */
  private processEmojis(content: string): string {
    // Convert emoji shortcodes to actual emojis
    const emojiMap: { [key: string]: string } = {
      ':smile:': '😊',
      ':heart:': '❤️',
      ':thumbsup:': '👍',
      ':thumbsdown:': '👎'
    };

    let processed = content;
    Object.entries(emojiMap).forEach(([shortcode, emoji]) => {
      processed = processed.replace(new RegExp(shortcode, 'g'), emoji);
    });

    return processed;
  }

  /**
   * Escape special characters
   */
  private escapeSpecialCharacters(content: string): string {
    // Escape HTML special characters
    const escapeMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };

    return content.replace(/[&<>"']/g, (match) => escapeMap[match]);
  }

  /**
   * Get message statistics
   */
  getMessageStats(message: MessageResponse): {
    wordCount: number;
    characterCount: number;
    mentionCount: number;
    emojiCount: number;
  } {
    const content = message.content || '';
    
    return {
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      characterCount: content.length,
      mentionCount: (content.match(/@(\w+)/g) || []).length,
      emojiCount: (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length
    };
  }

  /**
   * Check if message is spam
   */
  isSpam(message: MessageResponse): boolean {
    // Simple spam detection logic
    const content = message.content || '';
    
    // Check for excessive capitalization
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.7 && content.length > 10) {
      return true;
    }

    // Check for repetitive characters
    const repetitivePattern = /(.)\1{4,}/;
    if (repetitivePattern.test(content)) {
      return true;
    }

    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (linkCount > 3) {
      return true;
    }

    return false;
  }

  /**
   * Get message priority
   */
  getMessagePriority(message: MessageResponse): 'low' | 'normal' | 'high' | 'urgent' {
    // Determine message priority based on content and metadata
    if (message.metadata?.urgent) {
      return 'urgent';
    }

    if (message.metadata?.important) {
      return 'high';
    }

    if (message.senderId === 'system' || message.senderId === 'admin') {
      return 'high';
    }

    const content = message.content || '';
    
    // Check for urgent keywords
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately'];
    if (urgentKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
      return 'high';
    }

    return 'normal';
  }
}
