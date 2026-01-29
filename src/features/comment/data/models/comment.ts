import { z } from "zod";
import { CommentRequestSchema, CommentResponseSchema, PagedCommentSchema } from "./schemas/commentZod";
import { Comment, PagedCommentResponse } from "./types/commentNative";

// Export Zod-based types
export type CommentRequest = z.infer<typeof CommentRequestSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type PagedComment = z.infer<typeof PagedCommentSchema>;

// Export native types
export type { Comment, PagedCommentResponse };

// Unified exports
export type CommentUnified = CommentResponse;