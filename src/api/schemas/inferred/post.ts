import { z } from "zod";
import {
    VoteBodySchema,
    PollOptionSchema,
    PollSchema,
    PostBodySchema,
    PostSchema,
    PostListResponseSchema,
    PagedPostResponseSchema
} from "../zod/postZod";

export type VoteBody = z.infer<typeof VoteBodySchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type Poll = z.infer<typeof PollSchema>;
export type PostBody = z.infer<typeof PostBodySchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type PagedPostResponse = z.infer<typeof PagedPostResponseSchema>;
export type ViewAccess = "friends" | "all";