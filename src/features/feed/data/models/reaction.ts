/**
 * Reaction Models - Unified Export
 * 
 * Consolidates all reaction-related types and schemas
 * Provides clean exports for the index file
 */

// Import z for type inference
import { z } from "zod";
import {
    ReactionTypeSchema,
    ReactionRequestSchema,
    ReactionResponseSchema
} from './schemas/reactionZod';
import { ReactionType, UserReaction, UserReactionNative } from './schemas/reactionNative';

// Re-export Zod schemas
export {
    ReactionTypeSchema,
    ReactionRequestSchema,
    ReactionResponseSchema
};

// Re-export native types
export {
    ReactionType,
    UserReaction,
    UserReactionNative
};

// Infer types from schemas
export type ReactionRequest = z.infer<typeof ReactionRequestSchema>;
export type ReactionResponse = z.infer<typeof ReactionResponseSchema>;

// Additional types for compatibility
export type ReactionTypeNative = ReactionType;
export type UserReactionNativeType = UserReaction;
export type ReactionUnified = ReactionResponse;
