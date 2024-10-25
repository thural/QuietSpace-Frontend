import { z } from "zod";
import { PageContentSchema, PageSchema, ResIdSchema } from "./commonZod";
import { ReactionTypeSchema } from "./reactionZod";


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

export const PostBodySchema = z.object({
    text: z.string(),
    userId: ResIdSchema,
    viewAccess: z.enum(['friends', 'all']),
    poll: PollSchema.nullable()
});

export const PostSchema = z.object({
    id: ResIdSchema,
    userId: ResIdSchema,
    username: z.string(),
    title: z.string(),
    text: z.string(),
    poll: PollSchema,
    likeCount: z.number(),
    dislikeCount: z.number(),
    commentCount: z.number(),
    userReaction: ReactionTypeSchema,
    createDate: z.date().nullable(),
    updateDate: z.date().nullable()
});

export const PostListSchema = PageContentSchema(PostSchema);
export const PostPageSchema = PageSchema(PostSchema);