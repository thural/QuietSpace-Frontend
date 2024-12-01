import { z } from "zod";
import { BaseSchema, PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { ReactionResponseSchema } from "./reactionZod";
import { PhotoResponseSchema } from "./photoZod";


export const VoteBodySchema = z.object({
    userId: ResIdSchema,
    postId: ResIdSchema,
    option: z.string()
});

export const PollOptionSchema = z.object({
    label: z.string(),
    voteShare: z.string()
});

export const PollResponseSchema = BaseSchema.extend({
    votedOption: z.string(),
    voteCount: z.number(),
    options: z.array(PollOptionSchema),
    dueDate: z.string().nullable()
});

export const PollRequestSchema = z.object({
    dueDate: z.string().nullable(),
    options: z.array(z.string())
});

export const PostRequestSchema = z.object({
    title: z.string().optional(),
    text: z.string(),
    userId: ResIdSchema,
    viewAccess: z.enum(['friends', 'anyone']),
    poll: PollRequestSchema.nullable(),
    photoData: z.any().optional()
});

export const PostResponseSchema = BaseSchema.extend({
    userId: ResIdSchema,
    repostId: ResIdSchema.nullable(),
    repostText: ResIdSchema.nullable(),
    photo: PhotoResponseSchema.optional(),
    username: z.string(),
    title: z.string(),
    text: z.string(),
    poll: z.nullable(PollResponseSchema),
    likeCount: z.number(),
    dislikeCount: z.number(),
    commentCount: z.number(),
    userReaction: ReactionResponseSchema,
});

export const RepostBodySchema = z.object({
    text: z.string(),
    postId: ResIdSchema
})

export const PostListSchema = PageContentSchema(PostResponseSchema);
export const PostPageSchema = PageSchema(PostResponseSchema);