import { z } from "zod";
import {
    ReactionTypeSchema,
    ReactionRequestSchema,
    ReactionResponseSchema
} from "./schemas/reactionZod";
import { ReactionType as ReactionTypeNativeType, UserReaction } from "./types/reactionNative";

// Export the native enum as the main ReactionType
export { ReactionType } from "./types/reactionNative";

// Export Zod-based types
export type ReactionRequest = z.infer<typeof ReactionRequestSchema>;
export type ReactionResponse = z.infer<typeof ReactionResponseSchema>;

// Export Native types for compatibility
export type ReactionTypeNative = ReactionTypeNativeType;
export type UserReactionNative = UserReaction;

// Unified exports
export type ReactionUnified = ReactionResponse;