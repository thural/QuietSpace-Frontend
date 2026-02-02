/**
 * Shared Module Index.
 * 
 * Barrel exports for all shared components and logic.
 * Provides centralized access to global entities, data, application, and presentation.
 */

// Domain
export { User } from './domain/entities/User';

// Types - Reaction types (from features/shared consolidation)
export { ReactionType } from './types/reaction';

export type {
    ReactionRequest,
    ReactionResponse,
    ReactionUnified
} from './types/reaction';

export type {
    ReactionType as ReactionTypeNative,
    UserReaction,
    UserReactionResponse
} from './types/types/reactionNative';
