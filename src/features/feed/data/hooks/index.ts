/**
 * Feed Data Hooks
 * 
 * Simplified hooks that use FeedDataService directly.
 * These replace the legacy usePostData and useCommentData hooks.
 */

export {
  // Service access
  useFeedDataService,
  
  // Query hooks
  useFeedPosts,
  usePost,
  usePostWithComments,
  usePostComments,
  useUserPosts,
  useSavedPosts,
  useSearchPosts,
  useReposts,
  usePollResults,
  usePostAnalytics,
  useFeedAnalytics,
  
  // Mutation hooks
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useTogglePostLike,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useVotePoll,
  useCreateRepost,
  useSharePost,
  useSavePost,
  useUnsavePost,
  usePinPost,
  useUnpinPost,
  useFeaturePost,
  useUnfeaturePost,
} from './useFeedData';
