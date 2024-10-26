import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { UserReactionBody } from "./reactionZod";

export const CommentBodySchema = z.object({
    parentId: ResIdSchema.nullable().optional(),
    postId: ResIdSchema,
    userId: ResIdSchema,
    text: z.string()
});

export const CommentSchema = CommentBodySchema.extend({
    ...BaseSchema.shape,
    username: z.string(),
    likeCount: z.number(),
    replyCount: z.number(),
    userReaction: UserReactionBody
});

export const CommentList = PageContentSchema(CommentSchema);

export const PagedCommentSchema = PageSchema(CommentSchema);