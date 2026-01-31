/**
 * Chat Domain Barrel Export.
 * 
 * Exports all domain entities and interfaces.
 */

// Repository interfaces
export type { IChatRepository } from './entities/IChatRepository';

// Domain entities
export type {
    ChatParticipant,
    ChatStatus,
    ChatTypingIndicator,
    ChatMessage,
    ChatReaction,
    ChatSettings
} from './entities/ChatEntities';
