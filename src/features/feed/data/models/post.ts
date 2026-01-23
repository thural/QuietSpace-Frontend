import {z} from "zod";

import {
    PollOptionSchema,
    PollRequestSchema,
    PollResponseSchema,
    PostListSchema,
    PostPageSchema,
    PostRequestSchema,
    PostResponseSchema,
    RepostBodySchema,
    RepostResponseSchema,
    VoteBodySchema
} from "../models/postZod";

export type VoteBody = z.infer<typeof VoteBodySchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type PollResponse = z.infer<typeof PollResponseSchema>;
export type PollRequest = z.infer<typeof PollRequestSchema>
export type PostRequest = z.infer<typeof PostRequestSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type RepostResponse = z.infer<typeof RepostResponseSchema>;
export type RepostRequest = z.infer<typeof RepostBodySchema>;
export type PostList = z.infer<typeof PostListSchema>;
export type PostPage = z.infer<typeof PostPageSchema>;
export type ContentPrivacy = "friends" | "anyone";