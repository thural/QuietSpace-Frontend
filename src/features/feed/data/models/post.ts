/**
 * Post Models - Unified Export
 * 
 * Consolidates all post-related types and schemas
 * Provides clean exports for the index file
 */

// Import z for type inference
import { z } from "zod";
import {
    VoteBodySchema,
    PollOptionSchema,
    PollResponseSchema,
    PollRequestSchema,
    PostRequestSchema,
    PostResponseSchema,
    RepostResponseSchema,
    RepostBodySchema,
    PostListSchema,
    PostPageSchema
} from './schemas/postZod';

// Re-export Zod schemas
export {
    VoteBodySchema,
    PollOptionSchema,
    PollResponseSchema,
    PollRequestSchema,
    PostRequestSchema,
    PostResponseSchema,
    RepostResponseSchema,
    RepostBodySchema,
    PostListSchema,
    PostPageSchema
};

// Infer types from schemas
export type VoteBody = z.infer<typeof VoteBodySchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type PollResponse = z.infer<typeof PollResponseSchema>;
export type PollRequest = z.infer<typeof PollRequestSchema>;
export type PostRequest = z.infer<typeof PostRequestSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type RepostResponse = z.infer<typeof RepostResponseSchema>;
export type RepostRequest = z.infer<typeof RepostBodySchema>;
export type PostList = z.infer<typeof PostListSchema>;
export type PostPage = z.infer<typeof PostPageSchema>;

// Unified types for compatibility
export type PostUnified = PostResponse;
export type PollUnified = PollResponse;

// Native type aliases for backward compatibility
export type VoteBodyNative = VoteBody;
export type PollOptionNative = PollOption;
export type PollNative = PollResponse;
export type PostNative = PostResponse;
export type PostRequestNative = PostRequest;

// Content privacy enum for post visibility
export enum ContentPrivacy {
    ANYONE = 'anyone',
    FRIENDS = 'friends'
}
