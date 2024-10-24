import { z } from "zod";
import { BaseSchemaZod, PagedResponseSchema, ResIdSchema } from "./commonZod";
import { UserReactionSchema } from "./reactionZod";

export const CommentBodySchema = z.object({
    parentId: ResIdSchema.nullable().optional(),
    postId: ResIdSchema,
    userId: ResIdSchema,
    text: z.string()
});

export const CommentSchema = CommentBodySchema.extend({
    ...BaseSchemaZod.shape,
    username: z.string(),
    likeCount: z.number(),
    replyCount: z.number(),
    userReaction: UserReactionSchema
});

export const PagedCommentResponseSchema = PagedResponseSchema(CommentSchema);