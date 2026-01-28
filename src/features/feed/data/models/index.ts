/**
 * Unified Feed Models Export
 * 
 * Consolidates all feed-related models from schemas and types
 * Provides a single entry point for all model imports
 */

// Export unified types from main model files
export {
    CommentRequest,
    CommentResponse,
    CommentList as CommentListType,
    PagedComment,
    Comment,
    PagedCommentResponseNative,
    CommentUnified
} from './comment';

export {
    VoteBody,
    PollOption,
    PollResponse,
    PollRequest,
    PostRequest,
    PostResponse,
    RepostResponse,
    RepostRequest,
    PostList,
    PostPage,
    ContentPrivacy,
    VoteBodyNative,
    PollOptionNative,
    PollNative,
    PostNative,
    PostUnified,
    PollUnified
} from './post';

export {
    ReactionType,
    ReactionRequest,
    ReactionResponse,
    ReactionTypeNative,
    UserReactionNative,
    ReactionUnified
} from './reaction';

// Export schemas directly for advanced use cases
export {
    CommentRequestSchema,
    CommentResponseSchema,
    CommentList,
    PagedCommentSchema
} from './schemas/commentZod';

export {
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
} from './schemas/postZod';

export {
    ReactionTypeSchema,
    ReactionRequestSchema,
    ReactionResponseSchema
} from './schemas/reactionZod';

// Export native types for compatibility
export {
    CommentBody,
    CommentSchema,
    PagedCommentResponse
} from './types/commentNative';

export {
    VoteBody as VoteBodyNativeType,
    PollOptionSchema as PollOptionNativeType,
    PollSchema as PollNativeType,
    PostSchema as PostNativeType
} from './types/postNative';

export {
    ReactionType as ReactionTypeNativeType,
    UserReaction
} from './types/reactionNative';
