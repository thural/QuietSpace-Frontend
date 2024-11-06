import { z } from "zod";
import { PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { UserReactionSchema } from "./reactionZod";


export const VoteBodySchema = z.object({
    userId: ResIdSchema,
    postId: ResIdSchema,
    option: z.string()
});

export const PollOptionSchema = z.object({
    id: ResIdSchema,
    label: z.string(),
    voteShare: z.string()
});

export const PollSchema = z.object({
    id: ResIdSchema,
    votedOption: z.string(),
    voteCount: z.number(),
    options: z.array(PollOptionSchema),
    dueDate: z.string().nullable()
});

export const PollBodySchema = z.object({
    dueDate: z.string().nullable(),
    options: z.array(z.string())
});

export const PostBodySchema = z.object({
    title: z.string(),
    text: z.string(),
    userId: ResIdSchema,
    viewAccess: z.enum(['friends', 'all']),
    poll: PollBodySchema.nullable()
});

export const PostSchema = z.object({
    id: ResIdSchema,
    userId: ResIdSchema,
    username: z.string(),
    title: z.string(),
    text: z.string(),
    poll: z.optional(PollSchema),
    likeCount: z.number(),
    dislikeCount: z.number(),
    commentCount: z.number(),
    userReaction: UserReactionSchema,
    createDate: z.date().nullable(),
    updateDate: z.date().nullable()
});

export const PostListSchema = PageContentSchema(PostSchema);
export const PostPageSchema = PageSchema(PostSchema);