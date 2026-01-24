/**
 * Content Cache Keys.
 * 
 * Centralized cache key management for content feature
 * following enterprise caching patterns.
 */

export const CONTENT_CACHE_KEYS = {
  // Content data
  CONTENT_ITEM: (contentId: string) => `content:item:${contentId}`,
  CONTENT_LIST: (page: number = 0, size: number = 20, filters?: string) => `content:list:${page}:${size}:${filters || 'all'}`,
  CONTENT_BY_AUTHOR: (authorId: string, page: number = 0, size: number = 20) => `content:author:${authorId}:${page}:${size}`,
  CONTENT_BY_TYPE: (contentType: string, page: number = 0, size: number = 20) => `content:type:${contentType}:${page}:${size}`,
  CONTENT_BY_CATEGORY: (category: string, page: number = 0, size: number = 20) => `content:category:${category}:${page}:${size}`,
  CONTENT_BY_TAG: (tag: string, page: number = 0, size: number = 20) => `content:tag:${tag}:${page}:${size}`,
  
  // Content search
  CONTENT_SEARCH: (query: string, page: number = 0, size: number = 20) => `content:search:${encodeURIComponent(query)}:${page}:${size}`,
  CONTENT_SUGGESTIONS: (query: string) => `content:suggestions:${encodeURIComponent(query)}`,
  TRENDING_CONTENT: () => `content:trending`,
  FEATURED_CONTENT: () => `content:featured`,
  
  // Content media
  CONTENT_MEDIA: (contentId: string) => `content:media:${contentId}`,
  MEDIA_LIBRARY: (page: number = 0, size: number = 50) => `content:media:${page}:${size}`,
  
  // Content versions
  CONTENT_VERSIONS: (contentId: string) => `content:versions:${contentId}`,
  CONTENT_VERSION: (contentId: string, version: number) => `content:version:${contentId}:${version}`,
  
  // Content analytics
  CONTENT_ANALYTICS: (contentId: string) => `content:analytics:${contentId}`,
  CONTENT_STATS: (authorId: string, period: string = '30d') => `content:stats:${authorId}:${period}`,
  CONTENT_ENGAGEMENT: (contentId: string) => `content:engagement:${contentId}`,
  
  // Content moderation
  CONTENT_MODERATION: (contentId: string) => `content:moderation:${contentId}`,
  MODERATION_QUEUE: () => `content:moderation:queue`,
  FLAGGED_CONTENT: () => `content:moderation:flagged`,
  
  // Content templates
  CONTENT_TEMPLATES: () => `content:templates`,
  CONTENT_TEMPLATE: (templateId: string) => `content:template:${templateId}`,
  
  // Content drafts
  CONTENT_DRAFTS: (authorId: string) => `content:drafts:${authorId}`,
  CONTENT_DRAFT: (draftId: string) => `content:draft:${draftId}`,
  
  // Content scheduling
  SCHEDULED_CONTENT: () => `content:scheduled`,
  SCHEDULED_BY_AUTHOR: (authorId: string) => `content:scheduled:${authorId}`,
  
  // Content relationships
  RELATED_CONTENT: (contentId: string) => `content:related:${contentId}`,
  CONTENT_LINKS: (contentId: string) => `content:links:${contentId}`,
  
  // Combined data
  COMPLETE_CONTENT: (contentId: string) => `content:complete:${contentId}`,
  AUTHOR_CONTENT_SUMMARY: (authorId: string) => `content:author:summary:${authorId}`,
  
  // Pattern invalidation keys
  CONTENT_PATTERN: (contentId: string) => `content:*:${contentId}`,
  AUTHOR_PATTERN: (authorId: string) => `content:*:${authorId}`,
  ALL_CONTENT_PATTERN: 'content:*'
};

export const CONTENT_CACHE_TTL = {
  CONTENT_ITEM: 30 * 60 * 1000,           // 30 minutes
  CONTENT_LIST: 5 * 60 * 1000,            // 5 minutes
  CONTENT_BY_AUTHOR: 10 * 60 * 1000,      // 10 minutes
  CONTENT_BY_TYPE: 15 * 60 * 1000,        // 15 minutes
  CONTENT_BY_CATEGORY: 20 * 60 * 1000,     // 20 minutes
  CONTENT_BY_TAG: 10 * 60 * 1000,          // 10 minutes
  
  CONTENT_SEARCH: 2 * 60 * 1000,          // 2 minutes
  CONTENT_SUGGESTIONS: 5 * 60 * 1000,      // 5 minutes
  TRENDING_CONTENT: 5 * 60 * 1000,        // 5 minutes
  FEATURED_CONTENT: 10 * 60 * 1000,       // 10 minutes
  
  CONTENT_MEDIA: 60 * 60 * 1000,          // 1 hour
  MEDIA_LIBRARY: 30 * 60 * 1000,          // 30 minutes
  
  CONTENT_VERSIONS: 60 * 60 * 1000,       // 1 hour
  CONTENT_VERSION: 60 * 60 * 1000,        // 1 hour
  
  CONTENT_ANALYTICS: 15 * 60 * 1000,       // 15 minutes
  CONTENT_STATS: 30 * 60 * 1000,          // 30 minutes
  CONTENT_ENGAGEMENT: 5 * 60 * 1000,       // 5 minutes
  
  CONTENT_MODERATION: 10 * 60 * 1000,      // 10 minutes
  MODERATION_QUEUE: 2 * 60 * 1000,        // 2 minutes
  FLAGGED_CONTENT: 5 * 60 * 1000,        // 5 minutes
  
  CONTENT_TEMPLATES: 60 * 60 * 1000,       // 1 hour
  CONTENT_TEMPLATE: 60 * 60 * 1000,        // 1 hour
  
  CONTENT_DRAFTS: 20 * 60 * 1000,          // 20 minutes
  CONTENT_DRAFT: 20 * 60 * 1000,           // 20 minutes
  
  SCHEDULED_CONTENT: 5 * 60 * 1000,        // 5 minutes
  SCHEDULED_BY_AUTHOR: 10 * 60 * 1000,     // 10 minutes
  
  RELATED_CONTENT: 30 * 60 * 1000,        // 30 minutes
  CONTENT_LINKS: 30 * 60 * 1000,           // 30 minutes
  
  COMPLETE_CONTENT: 10 * 60 * 1000,        // 10 minutes
  AUTHOR_CONTENT_SUMMARY: 15 * 60 * 1000,   // 15 minutes
  
  DEFAULT: 10 * 60 * 1000                 // 10 minutes default
};

export const CONTENT_CACHE_INVALIDATION = {
  // Invalidate all content data when content changes
  CONTENT_UPDATE: (contentId: string) => [
    CONTENT_CACHE_KEYS.CONTENT_ITEM(contentId),
    CONTENT_CACHE_KEYS.CONTENT_ANALYTICS(contentId),
    CONTENT_CACHE_KEYS.CONTENT_ENGAGEMENT(contentId),
    CONTENT_CACHE_KEYS.CONTENT_VERSIONS(contentId),
    CONTENT_CACHE_KEYS.RELATED_CONTENT(contentId),
    CONTENT_CACHE_KEYS.CONTENT_LINKS(contentId),
    CONTENT_CACHE_KEYS.COMPLETE_CONTENT(contentId)
  ],
  
  // Invalidate author-related content when author content changes
  AUTHOR_UPDATE: (authorId: string) => [
    CONTENT_CACHE_KEYS.CONTENT_BY_AUTHOR(authorId),
    CONTENT_CACHE_KEYS.AUTHOR_CONTENT_SUMMARY(authorId),
    CONTENT_CACHE_KEYS.CONTENT_DRAFTS(authorId),
    CONTENT_CACHE_KEYS.SCHEDULED_BY_AUTHOR(authorId),
    CONTENT_CACHE_KEYS.CONTENT_STATS(authorId, '*')
  ],
  
  // Invalidate content lists when new content is added
  CONTENT_LIST_UPDATE: () => [
    CONTENT_CACHE_KEYS.CONTENT_LIST('*', '*', '*'),
    CONTENT_CACHE_KEYS.TRENDING_CONTENT(),
    CONTENT_CACHE_KEYS.FEATURED_CONTENT()
  ],
  
  // Invalidate search results when content changes
  SEARCH_UPDATE: () => [
    CONTENT_CACHE_KEYS.CONTENT_SEARCH('*', '*', '*'),
    CONTENT_CACHE_KEYS.CONTENT_SUGGESTIONS('*')
  ],
  
  // Invalidate moderation data when content is moderated
  MODERATION_UPDATE: (contentId: string) => [
    CONTENT_CACHE_KEYS.CONTENT_MODERATION(contentId),
    CONTENT_CACHE_KEYS.MODERATION_QUEUE(),
    CONTENT_CACHE_KEYS.FLAGGED_CONTENT()
  ],
  
  // Invalidate all content
  ALL_CONTENT: () => [
    CONTENT_CACHE_KEYS.ALL_CONTENT_PATTERN
  ]
};
