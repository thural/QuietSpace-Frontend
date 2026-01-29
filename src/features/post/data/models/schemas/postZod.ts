import { z } from "zod";

// Basic schemas for post functionality
export const VoteBodySchema = z.object({
  voteType: z.enum(["UP", "DOWN"]),
});

export const PollOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  votes: z.number().default(0),
});

export const PollRequestSchema = z.object({
  question: z.string(),
  options: z.array(PollOptionSchema),
  multipleChoice: z.boolean().default(false),
});

export const PollResponseSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(PollOptionSchema),
  multipleChoice: z.boolean(),
  totalVotes: z.number(),
});

export const PostListSchema = z.array(z.any());

export const PostPageSchema = z.object({
  posts: PostListSchema,
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const PostRequestSchema = z.object({
  content: z.string(),
  authorId: z.string(),
});

export const PostResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
});

export const RepostBodySchema = z.object({
  originalPostId: z.string(),
  comment: z.string().optional(),
});

export const RepostResponseSchema = z.object({
  id: z.string(),
  originalPostId: z.string(),
  comment: z.string().optional(),
  repostedBy: z.string(),
  createdAt: z.string(),
});
