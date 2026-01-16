/**
 * Chat Domain Barrel Export.
 * 
 * Exports all domain entities and interfaces.
 */

// Repository interfaces
export type { IChatRepository } from './entities/ChatRepository';

// Domain entities
export type {
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
} from './entities/ChatEntities';
