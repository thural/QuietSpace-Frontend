import { z } from "zod";
import { CommentList, CommentRequestSchema, CommentResponseSchema, PagedCommentSchema } from "./schemas/commentZod";
import { CommentSchema, PagedCommentResponse } from "./types/commentNative";

// Export Zod-based types
export type CommentRequest = z.infer<typeof CommentRequestSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentList = z.infer<typeof CommentList>;
export type PagedComment = z.infer<typeof PagedCommentSchema>;

// Export Native types for compatibility
export type Comment = CommentSchema;
export type PagedCommentResponseNative = PagedCommentResponse;

// Unified exports
export type CommentUnified = CommentResponse;