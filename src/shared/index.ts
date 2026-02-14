/**
 * Shared Module Index.
 * 
 * Barrel exports for all shared components and logic.
 * Provides centralized access to enterprise services, containers, and presentation.
 */

// Domain
export { User } from './domain/entities/User';

// Enterprise Services (Preferred)
export * from './services';

// Enterprise Containers (Preferred)
export * from './containers';

// Enterprise Components (Preferred)
export {
    BaseClassComponent,
    withTheme,
    EnterpriseWithData,
    EnterpriseWithNavigation,
    compose
} from './components';

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

// UI Components
export * from './ui';

// Hooks (Legacy - being replaced by enterprise services)
export * from './hooks';

// Utils
export * from './utils';
