/**
 * Enterprise Content Hook.
 * 
 * Provides comprehensive content functionality using custom query system
 * Replaces legacy hooks with enterprise-grade caching and performance optimization
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/hooks/useCustomQuery';
import { useContentServices } from '../di/useContentDI';
import { useCacheInvalidation } from '@/core/hooks/useCacheInvalidation';
import { useAuthStore } from '@services/store/zustand';
import type { 
  ContentEntity, 
  ContentMetadata, 
  MediaFile, 
  ContentVersion, 
  ContentTemplate, 
  ContentAnalytics, 
  ModerationData 
} from '@features/content/domain/entities/ContentEntity';
import { JwtToken } from '@/shared/api/models/common';

/**
 * Enterprise Content State interface.
 */
export interface EnterpriseContentState {
  // Content data
  content: {
    data: ContentEntity | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Content lists
  contentList: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Author content
  authorContent: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Search results
  searchResults: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Trending and featured content
  trending: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  featured: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Media data
  media: {
    data: MediaFile[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Analytics
  analytics: {
    data: ContentAnalytics | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Moderation data
  moderation: {
    data: ModerationData | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Templates
  templates: {
    data: ContentTemplate[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Drafts
  drafts: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Scheduled content
  scheduled: {
    data: ContentEntity[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Combined state
  isLoading: boolean;
  error: Error | null;
  hasUnsavedChanges: boolean;
}

/**
 * Enterprise Content Actions interface.
 */
export interface EnterpriseContentActions {
  // Content CRUD actions
  createContent: (contentData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<{ success: boolean; data?: ContentEntity; errors?: string[] }>;
  updateContent: (contentId: string, updates: Partial<ContentEntity>) => Promise<{ success: boolean; data?: ContentEntity; errors?: string[] }>;
  deleteContent: (contentId: string) => Promise<{ success: boolean; message?: string }>;
  
  // Publishing actions
  publishContent: (contentId: string) => Promise<{ success: boolean; message?: string }>;
  scheduleContent: (contentId: string, publishDate: Date) => Promise<{ success: boolean; message?: string }>;
  
  // Media actions
  uploadMedia: (contentId: string, file: File) => Promise<{ success: boolean; data?: MediaFile; errors?: string[] }>;
  
  // Moderation actions
  moderateContent: (contentId: string, action: 'approve' | 'reject' | 'flag', reason: string) => Promise<{ success: boolean; data?: ModerationData; message?: string }>;
  
  // Search and discovery
  searchContent: (query: string) => Promise<ContentEntity[]>;
  getTrendingContent: () => Promise<ContentEntity[]>;
  getFeaturedContent: () => Promise<ContentEntity[]>;
  
  // Batch operations
  loadCompleteContent: (contentId: string) => Promise<void>;
  refreshContent: () => Promise<void>;
  
  // Cache management
  invalidateContentCache: (contentId?: string) => void;
  invalidateAuthorCache: (authorId?: string) => void;
  invalidateSearchCache: () => void;
  
  // State management
  resetChanges: () => void;
  markAsChanged: () => void;
}

/**
 * Enterprise Content Hook.
 * 
 * Provides comprehensive content functionality with enterprise-grade features:
 * - Custom query system integration
 * - Intelligent caching strategies
 * - Business logic validation
 * - Performance optimization
 * - Error handling and recovery
 */
export const useEnterpriseContent = (
  contentId?: string
): EnterpriseContentState & EnterpriseContentActions => {
  const [token, setToken] = useState<JwtToken | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Get services
  const { contentDataService, contentFeatureService } = useContentServices();
  const invalidateCache = useCacheInvalidation();
  
  // Initialize token
  useEffect(() => {
    const authStore = useAuthStore.getState();
    const currentToken = authStore.data.accessToken || null;
    setToken(currentToken);
  }, []);

  // Content query
  const contentQuery = useCustomQuery(
    ['content', 'item', contentId].filter(Boolean),
    () => contentId ? contentDataService.getContent(contentId, token || '') : Promise.resolve(null),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      enabled: !!contentId && !!token,
      onSuccess: (data) => {
        if (data) {
          console.log('Enterprise Content: Content loaded', { 
            contentId: data.id, 
            title: data.title, 
            status: data.status 
          });
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading content', error);
      }
    }
  );

  // Content list query
  const contentListQuery = useCustomQuery(
    ['content', 'list'],
    () => contentDataService.getContentList(0, 20, undefined, token || ''),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Content list loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading content list', error);
      }
    }
  );

  // Author content query
  const authorContentQuery = useCustomQuery(
    ['content', 'author', contentId].filter(Boolean)],
    () => contentId ? contentDataService.getContentByAuthor(contentId, 0, 20, token || '') : Promise.resolve([]),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!contentId && !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Author content loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading author content', error);
      }
    }
  );

  // Search query
  const searchQuery = useCustomQuery(
    ['content', 'search'],
    () => contentDataService.searchContent('', 0, 20, token || ''),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Search results loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error searching content', error);
      }
    }
  );

  // Trending content query
  const trendingQuery = useCustomQuery(
    ['content', 'trending'],
    () => contentDataService.getTrendingContent(token || ''),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Trending content loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading trending content', error);
      }
    }
  );

  // Featured content query
  const featuredQuery = useCustomQuery(
    ['content', 'featured'],
    () => contentDataService.getFeaturedContent(token || ''),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Featured content loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading featured content', error);
      }
    }
  );

  // Media query
  const mediaQuery = useCustomQuery(
    ['content', 'media', contentId].filter(Boolean)],
    () => contentId ? contentDataService.getContentMedia(contentId, token || '') : Promise.resolve([]),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
      cacheTime: 2 * 60 * 60 * 1000, // 2 hours
      enabled: !!contentId && !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Media loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading media', error);
      }
    }
  );

  // Analytics query
  const analyticsQuery = useCustomQuery(
    ['content', 'analytics', contentId].filter(Boolean),
    () => contentId ? contentDataService.getContentAnalytics(contentId, token || '') : Promise.resolve(null),
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!contentId && !!token,
      onSuccess: (data) => {
        if (data) {
          console.log('Enterprise Content: Analytics loaded', { 
            views: data.views, 
            engagementRate: data.engagementRate 
          });
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading analytics', error);
      }
    }
  );

  // Moderation query
  const moderationQuery = useCustomQuery(
    ['content', 'moderation', contentId].filter(Boolean),
    () => contentId ? contentDataService.getContentModeration(contentId, token || '') : Promise.resolve(null),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
      enabled: !!contentId && !!token,
      onSuccess: (data) => {
        if (data) {
          console.log('Enterprise Content: Moderation data loaded', { 
            status: data.status 
          });
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading moderation data', error);
      }
    }
  );

  // Templates query
  const templatesQuery = useCustomQuery(
    ['content', 'templates'],
    () => contentDataService.getContentTemplates(token || ''),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
      cacheTime: 2 * 60 * 60 * 1000, // 2 hours
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Templates loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading templates', error);
      }
    }
  );

  // Drafts query
  const draftsQuery = useCustomQuery(
    ['content', 'drafts', 'current'],
    () => contentDataService.getContentDrafts('current', token || ''),
    {
      staleTime: 20 * 60 * 1000, // 20 minutes
      cacheTime: 40 * 60 * 1000, // 40 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Drafts loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading drafts', error);
      }
    }
  );

  // Scheduled content query
  const scheduledQuery = useCustomQuery(
    ['content', 'scheduled'],
    () => contentDataService.getScheduledContent(token || ''),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      enabled: !!token,
      onSuccess: (data) => {
        console.log('Enterprise Content: Scheduled content loaded', { count: data?.length || 0 });
      },
      onError: (error) => {
        console.error('Enterprise Content: Error loading scheduled content', error);
      }
    }
  );

  // Combined loading state
  const isLoading = contentQuery.isLoading || 
                   contentListQuery.isLoading ||
                   authorContentQuery.isLoading ||
                   searchQuery.isLoading ||
                   trendingQuery.isLoading ||
                   featuredQuery.isLoading ||
                   mediaQuery.isLoading ||
                   analyticsQuery.isLoading ||
                   moderationQuery.isLoading ||
                   templatesQuery.isLoading ||
                   draftsQuery.isLoading ||
                   scheduledQuery.isLoading;
  
  const error = contentQuery.error || 
                contentListQuery.error ||
                authorContentQuery.error ||
                searchQuery.error ||
                trendingQuery.error ||
                featuredQuery.error ||
                mediaQuery.error ||
                analyticsQuery.error ||
                moderationQuery.error ||
                templatesQuery.error ||
                draftsQuery.error ||
                scheduledQuery.error;

  // Mutations with optimistic updates
  const createContentMutation = useCustomMutation(
    ({ contentData }: { contentData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'> }) =>
      contentFeatureService.createContentWithValidation(contentData, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache(result.data?.id);
          setHasUnsavedChanges(false);
          console.log('Enterprise Content: Content created successfully');
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error creating content', error);
      }
    }
  );

  const updateContentMutation = useCustomMutation(
    ({ contentId, updates }: { contentId: string; updates: Partial<ContentEntity> }) =>
      contentFeatureService.updateContentWithValidation(contentId, updates, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache(contentId);
          setHasUnsavedChanges(false);
          console.log('Enterprise Content: Content updated successfully');
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error updating content', error);
      }
    }
  );

  const deleteContentMutation = useCustomMutation(
    ({ contentId }: { contentId: string }) =>
      contentDataService.deleteContent(contentId, token || ''),
    {
      onSuccess: () => {
        invalidateCache.invalidateContentCache(contentId);
        console.log('Enterprise Content: Content deleted successfully');
      },
      onError: (error) => {
        console.error('Enterprise Content: Error deleting content', error);
      }
    }
  );

  const publishContentMutation = useCustomMutation(
    ({ contentId }: { contentId: string }) =>
      contentFeatureService.publishContent(contentId, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache(contentId);
          console.log('Enterprise Content: Content published successfully');
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error publishing content', error);
      }
    }
  );

  const scheduleContentMutation = useCustomMutation(
    ({ contentId, publishDate }: { contentId: string; publishDate: Date }) =>
      contentFeatureService.scheduleContent(contentId, publishDate, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache();
          console.log('Enterprise Content: Content scheduled successfully');
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error scheduling content', error);
      }
    }
  );

  const uploadMediaMutation = useCustomMutation(
    ({ contentId, file }: { contentId: string; file: File }) =>
      contentFeatureService.uploadMediaWithValidation(contentId, file, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache(contentId);
          console.log('Enterprise Content: Media uploaded successfully');
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error uploading media', error);
      }
    }
  );

  const moderateContentMutation = useCustomMutation(
    ({ contentId, action, reason }: { contentId: string; action: 'approve' | 'reject' | 'flag'; reason: string }) =>
      contentFeatureService.moderateContentWithValidation(contentId, action, reason, token || ''),
    {
      onSuccess: (result) => {
        if (result.success) {
          invalidateCache.invalidateContentCache(contentId);
          console.log(`Enterprise Content: Content ${action} successfully`);
        }
      },
      onError: (error) => {
        console.error('Enterprise Content: Error moderating content', error);
      }
    }
  );

  // Search action
  const searchContent = useCallback(async (query: string) => {
    try {
      const results = await searchQuery.refetch({
        query: ['content', 'search'],
        queryFn: () => contentDataService.searchContent(query, 0, 20, token || '')
      });
      return results || [];
    } catch (error) {
      console.error('Enterprise Content: Error searching content', error);
      return [];
    }
  }, [searchQuery, contentDataService, token]);

  const getTrendingContent = useCallback(async () => {
    try {
      const results = await trendingQuery.refetch();
      return results || [];
    } catch (error) {
      console.error('Enterprise Content: Error getting trending content', error);
      return [];
    }
  }, [trendingQuery, contentDataService]);

  const getFeaturedContent = useCallback(async () => {
    try {
      const results = await featuredQuery.refetch();
      return results || [];
    } catch (error) {
      console.error('Enterprise Content: Error getting featured content', error);
      return [];
    }
  }, [featuredQuery, contentDataService]);

  // Batch operations
  const loadCompleteContent = useCallback(async () => {
    if (!contentId) return;
    
    try {
      await contentDataService.getCompleteContent(contentId, token);
      console.log('Enterprise Content: Complete content loaded');
    } catch (error) {
      console.error('Enterprise Content: Error loading complete content', error);
    }
  }, [contentDataService, contentId, token]);

  const refreshContent = useCallback(async () => {
    await Promise.all([
      contentQuery.refetch(),
      contentListQuery.refetch(),
      trendingQuery.refetch(),
      featuredQuery.refetch(),
      templatesQuery.refetch(),
      draftsQuery.refetch(),
      scheduledQuery.refetch()
    ]);
    console.log('Enterprise Content: Content data refreshed');
  }, [
    contentQuery, contentListQuery, trendingQuery, featuredQuery, 
    templatesQuery, draftsQuery, scheduledQuery
  ]);

  // Cache management
  const invalidateContentCache = useCallback((contentId?: string) => {
    if (contentId) {
      invalidateCache.invalidateContentCache(contentId);
    } else {
      invalidateCache.invalidateSearchCache();
    }
  }, [invalidateCache, contentId]);

  const invalidateAuthorCache = useCallback((authorId?: string) => {
    if (authorId) {
      invalidateCache.invalidateAuthorCache(authorId);
    }
  }, [invalidateCache, authorId]);

  // State management
  const resetChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    // State
    content: {
      data: contentQuery.data || null,
      isLoading: contentQuery.isLoading,
      error: contentQuery.error
    },
    contentList: {
      data: contentListQuery.data || null,
      isLoading: contentListQuery.isLoading,
      error: contentListQuery.error
    },
    authorContent: {
      data: authorContentQuery.data || null,
      isLoading: authorContentQuery.isLoading,
      error: authorContentQuery.error
    },
    searchResults: {
      data: searchQuery.data || null,
      isLoading: searchQuery.isLoading,
      error: searchQuery.error
    },
    trending: {
      data: trendingQuery.data || null,
      isLoading: trendingQuery.isLoading,
      error: trendingQuery.error
    },
    featured: {
      data: featuredQuery.data || null,
      isLoading: featuredQuery.isLoading,
      error: featuredQuery.error
    },
    media: {
      data: mediaQuery.data || null,
      isLoading: mediaQuery.isLoading,
      error: mediaQuery.error
    },
    analytics: {
      data: analyticsQuery.data || null,
      isLoading: analyticsQuery.isLoading,
      error: analyticsQuery.error
    },
    moderation: {
      data: moderationQuery.data || null,
      isLoading: moderationQuery.isLoading,
      error: moderationQuery.error
    },
    templates: {
      data: templatesQuery.data || null,
      isLoading: templatesQuery.isLoading,
      error: templatesQuery.error
    },
    drafts: {
      data: draftsQuery.data || null,
      isLoading: draftsQuery.isLoading,
      error: draftsQuery.error
    },
    scheduled: {
      data: scheduledQuery.data || null,
      isLoading: scheduledQuery.isLoading,
      error: scheduledQuery.error
    },
    isLoading,
    error,
    hasUnsavedChanges,

    // Actions
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    uploadMedia,
    moderateContent,
    searchContent,
    getTrendingContent,
    getFeaturedContent,
    loadCompleteContent,
    refreshContent,
    invalidateContentCache,
    invalidateAuthorCache,
    resetChanges,
    markAsChanged
  };
};
