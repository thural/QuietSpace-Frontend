import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import { useCustomInfiniteQuery, useCustomMutation, useCustomQuery } from '@/core/hooks';
import {
  CACHE_TIME_MAPPINGS
} from '@/core/hooks/migrationUtils';
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import type { PostQuery } from '@/features/feed/domain';
import type { ResId } from '@/shared/api/models/common';
import type { FeedDataService } from '../FeedDataService';
import { createInfiniteQueryConfig } from '../utils/paginationUtils';

/**
 * Hook for accessing FeedDataService via DI
 */
export const useFeedDataService = (): FeedDataService => {
  const container = useDIContainer();
  return container.getByToken(TYPES.FEED_DATA_SERVICE);
};

/**
 * Feed posts hook with infinite scroll
 */
export const useFeedPosts = (query: PostQuery = {}) => {
  const feedDataService = useFeedDataService();

  return useCustomInfiniteQuery(
    ['feed', query],
    async ({ pageParam = 0 }) => {
      const feedQuery = { ...query, page: pageParam + 1, limit: 20 };
      return await feedDataService.getFeedPosts(feedQuery);
    },
    {
      ...createInfiniteQueryConfig({ limit: 20 })
    }
  );
};

/**
 * Single post hook
 */
export const usePost = (postId: string) => {
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['post', postId],
    async () => {
      return await feedDataService.getPost(postId);
    },
    {
      enabled: !!postId,
      staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
    }
  );
};

/**
 * Post with comments hook
 */
export const usePostWithComments = (postId: string) => {
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['post-with-comments', postId],
    async () => {
      return await feedDataService.getPostWithComments(postId);
    },
    {
      enabled: !!postId,
      staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
    }
  );
};

/**
 * Post comments hook
 */
export const usePostComments = (postId: string, options: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 50 } = options;
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['comments', postId, { page, limit }],
    async () => {
      return await feedDataService.getPostComments(postId, { page, limit });
    },
    {
      enabled: !!postId,
      staleTime: CACHE_TIME_MAPPINGS.COMMENT_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.COMMENT_CACHE_TIME,
    }
  );
};

/**
 * User posts hook
 */
export const useUserPosts = (userId: ResId, options: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 20 } = options;
  const feedDataService = useFeedDataService();

  return useCustomInfiniteQuery(
    ['user-posts', userId, { page, limit }],
    async ({ pageParam = 0 }) => {
      return await feedDataService.getUserPosts(String(userId), { page: pageParam + 1, limit });
    },
    {
      enabled: !!userId,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === limit ? allPages.length + 1 : undefined;
      },
      staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
    }
  );
};

/**
 * Saved posts hook
 */
export const useSavedPosts = (options: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 20 } = options;
  const { authData, isAuthenticated } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomInfiniteQuery(
    ['saved-posts', { page, limit }],
    async ({ pageParam = 0 }) => {
      return await feedDataService.getSavedPosts({ page: pageParam + 1, limit });
    },
    {
      enabled: isAuthenticated,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === limit ? allPages.length + 1 : undefined;
      },
      staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
    }
  );
};

/**
 * Search posts hook
 */
export const useSearchPosts = (queryText: string, options: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 20 } = options;
  const feedDataService = useFeedDataService();

  return useCustomInfiniteQuery(
    ['search-posts', queryText, { page, limit }],
    async ({ pageParam = 0 }) => {
      return await feedDataService.searchPosts(queryText, { page: pageParam + 1, limit });
    },
    {
      enabled: !!queryText && queryText.length > 2,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === limit ? allPages.length + 1 : undefined;
      },
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

/**
 * Reposts hook
 */
export const useReposts = (postId: string, options: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 20 } = options;
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['reposts', postId, { page, limit }],
    async () => {
      return await feedDataService.getReposts(postId, { page, limit });
    },
    {
      enabled: !!postId,
      staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
      cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
    }
  );
};

/**
 * Poll results hook
 */
export const usePollResults = (postId: string) => {
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['poll-results', postId],
    async () => {
      return await feedDataService.getPollResults(postId);
    },
    {
      enabled: !!postId,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 10 * 1000, // 10 seconds for live poll updates
    }
  );
};

// ========================================
// MUTATION HOOKS
// ========================================

/**
 * Create post mutation
 */
export const useCreatePost = (onSuccess?: () => void) => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postData: any) => {
      return await feedDataService.createPost(postData);
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error creating post:', error);
      }
    }
  );
};

/**
 * Update post mutation
 */
export const useUpdatePost = (onSuccess?: () => void) => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async ({ postId, updateData }: { postId: string; updateData: any }) => {
      return await feedDataService.updatePost(postId, updateData);
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error updating post:', error);
      }
    }
  );
};

/**
 * Delete post mutation
 */
export const useDeletePost = (onSuccess?: () => void) => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.deletePost(postId, authData?.user?.id || '');
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error deleting post:', error);
      }
    }
  );
};

/**
 * Toggle post like mutation
 */
export const useTogglePostLike = () => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      return await feedDataService.togglePostLike(postId, authData?.user?.id || '');
    },
    {
      onError: (error) => {
        console.error('Error toggling post like:', error);
      }
    }
  );
};

/**
 * Add comment mutation
 */
export const useAddComment = (onSuccess?: () => void) => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async ({ postId, commentData }: { postId: string; commentData: any }) => {
      return await feedDataService.addComment(postId, commentData);
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error adding comment:', error);
      }
    }
  );
};

/**
 * Update comment mutation
 */
export const useUpdateComment = (onSuccess?: () => void) => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async ({ commentId, updateData }: { commentId: string; updateData: any }) => {
      return await feedDataService.updateComment(commentId, updateData);
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error updating comment:', error);
      }
    }
  );
};

/**
 * Delete comment mutation
 */
export const useDeleteComment = (onSuccess?: () => void) => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async ({ commentId, postId }: { commentId: string; postId: string }) => {
      await feedDataService.deleteComment(commentId, postId, authData?.user?.id || '');
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error deleting comment:', error);
      }
    }
  );
};

/**
 * Vote on poll mutation
 */
export const useVotePoll = () => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async ({ postId, voteData }: { postId: string; voteData: any }) => {
      return await feedDataService.voteOnPoll(postId, voteData);
    },
    {
      onError: (error) => {
        console.error('Error voting on poll:', error);
      }
    }
  );
};

/**
 * Create repost mutation
 */
export const useCreateRepost = (onSuccess?: () => void) => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (repostData: any) => {
      return await feedDataService.createRepost(repostData);
    },
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error creating repost:', error);
      }
    }
  );
};

/**
 * Share post mutation
 */
export const useSharePost = () => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      return await feedDataService.sharePost(postId, authData?.user?.id || '');
    },
    {
      onError: (error) => {
        console.error('Error sharing post:', error);
      }
    }
  );
};

/**
 * Save post mutation
 */
export const useSavePost = () => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.savePost(postId, authData?.user?.id || '');
    },
    {
      onError: (error) => {
        console.error('Error saving post:', error);
      }
    }
  );
};

/**
 * Unsave post mutation
 */
export const useUnsavePost = () => {
  const { authData } = useFeatureAuth();
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.unsavePost(postId, authData?.user?.id || '');
    },
    {
      onError: (error) => {
        console.error('Error unsaving post:', error);
      }
    }
  );
};

/**
 * Pin post mutation
 */
export const usePinPost = () => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.pinPost(postId);
    },
    {
      onError: (error) => {
        console.error('Error pinning post:', error);
      }
    }
  );
};

/**
 * Unpin post mutation
 */
export const useUnpinPost = () => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.unpinPost(postId);
    },
    {
      onError: (error) => {
        console.error('Error unpinning post:', error);
      }
    }
  );
};

/**
 * Feature post mutation
 */
export const useFeaturePost = () => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.featurePost(postId);
    },
    {
      onError: (error) => {
        console.error('Error featuring post:', error);
      }
    }
  );
};

/**
 * Unfeature post mutation
 */
export const useUnfeaturePost = () => {
  const feedDataService = useFeedDataService();

  return useCustomMutation(
    async (postId: string) => {
      await feedDataService.unfeaturePost(postId);
    },
    {
      onError: (error) => {
        console.error('Error unfeaturing post:', error);
      }
    }
  );
};

/**
 * Post analytics hook
 */
export const usePostAnalytics = (postId: string) => {
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['post-analytics', postId],
    async () => {
      return await feedDataService.getPostAnalytics(postId);
    },
    {
      enabled: !!postId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 2 * 60 * 1000, // 2 minutes
    }
  );
};

/**
 * Feed analytics hook
 */
export const useFeedAnalytics = (userId?: string) => {
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    ['feed-analytics', userId],
    async () => {
      return await feedDataService.getFeedAnalytics(userId);
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchInterval: 5 * 60 * 1000, // 5 minutes
    }
  );
};
