// Export all new feature service hooks
export * from './useFeedService';
export * from './useCommentService';

// Re-export legacy hooks for backward compatibility
export { 
    useGetPagedPosts,
    useGetPostById,
    useGetSavedPostsByUserId,
    useGetRepliedPostsByUserId,
    useGetPostsByUserId,
    useCreatePost,
    useCreateRepost,
    useSavePost,
    useEditPost,
    useQueryPosts,
    useDeletePost,
    useVotePoll
} from '../../data/usePostData';

export {
    useGetComments,
    useGetLatestComment,
    usePostComment,
    useDeleteComment
} from '../../data/useCommentData';
