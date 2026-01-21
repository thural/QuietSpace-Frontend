import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { ReactionRequestSchema } from "./reactionZod";

export const CommentRequestSchema = z.object({
    parentId: ResIdSchema.nullable().optional(),
    postId: ResIdSchema,
    userId: ResIdSchema,
    text: z.string()
});

export const CommentResponseSchema = CommentRequestSchema.extend({
    ...BaseSchema.shape,
    username: z.string(),
    likeCount: z.number(),
    replyCount: z.number(),
    userReaction: ReactionRequestSchema
});

export const CommentList = PageContentSchema(CommentResponseSchema);

export const PagedCommentSchema = PageSchema(CommentResponseSchema);