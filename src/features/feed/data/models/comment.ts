/**
 * Comment Models - Unified Export
 * 
 * Consolidates all comment-related types and schemas
 * Provides clean exports for the index file
 */

// Import z for type inference
import { z } from "zod";
import {
    CommentRequestSchema,
    CommentResponseSchema,
    CommentList,
    PagedCommentSchema
} from './schemas/commentZod';

// Re-export Zod schemas
export {
    CommentRequestSchema,
    CommentResponseSchema,
    CommentList,
    PagedCommentSchema
};

// Infer types from schemas
export type CommentRequest = z.infer<typeof CommentRequestSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentListType = z.infer<typeof CommentList>;
export type PagedComment = z.infer<typeof PagedCommentSchema>;

// Additional types for compatibility
export type Comment = CommentResponse;
export type PagedCommentResponseNative = PagedComment;
export type CommentUnified = CommentResponse;

// Native type aliases for backward compatibility
export type CommentBody = CommentRequest;
export type CommentSchema = CommentResponse;
