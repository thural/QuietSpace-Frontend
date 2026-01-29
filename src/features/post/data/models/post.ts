import { z } from "zod";
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
} from "./schemas/postZod";
import {
    VoteBody as VoteBodyNativeType,
    PollOption as PollOptionNativeType,
    Poll as PollNativeType,
    Post as PostNativeType
} from "./types/postNative";

// Export Zod-based types
export type VoteBody = z.infer<typeof VoteBodySchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type PollResponse = z.infer<typeof PollResponseSchema>;
export type PollRequest = z.infer<typeof PollRequestSchema>;
export type PostRequest = z.infer<typeof PostRequestSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
export type RepostResponse = z.infer<typeof RepostResponseSchema>;
export type RepostRequest = z.infer<typeof RepostBodySchema>;
export type PostList = z.infer<typeof PostListSchema>;
export type PostPage = z.infer<typeof PostPageSchema>;
export type ContentPrivacy = "friends" | "anyone";

// Export Native types for compatibility
export type VoteBodyNative = VoteBodyNativeType;
export type PollOptionNative = PollOptionNativeType;
export type PollNative = PollNativeType;
export type PostNative = PostNativeType;

// Unified exports
export type PostUnified = PostResponse;
export type PollUnified = PollResponse;