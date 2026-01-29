import { z } from "zod";

// Basic schemas for comment functionality
export const CommentRequestSchema = z.object({
  content: z.string(),
  postId: z.string(),
  authorId: z.string(),
});

export const CommentResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  postId: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const CommentListSchema = z.array(CommentResponseSchema);

export const PagedCommentSchema = z.object({
  comments: CommentListSchema,
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});
