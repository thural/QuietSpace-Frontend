import { z } from "zod";
import {
    VoteBodySchema,
    PollOptionSchema,
    PollSchema,
    PostBodySchema,
    PostSchema,
    PostListSchema,
    PostPageSchema
} from "../zod/postZod";

export type VoteBody = z.infer<typeof VoteBodySchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type Poll = z.infer<typeof PollSchema>;
export type PostBody = z.infer<typeof PostBodySchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostList = z.infer<typeof PostListSchema>;
export type PostPage = z.infer<typeof PostPageSchema>;
export type ViewAccess = "friends" | "all";