import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { IContentRepository, ContentEntity, ContentMetadata, MediaFile, ContentVersion, ContentTemplate, ContentAnalytics, ModerationData } from '@features/content/domain/entities/ContentEntity';
import { JwtToken } from '@/shared/api/models/common';
import { CONTENT_CACHE_KEYS, CONTENT_CACHE_TTL, CONTENT_CACHE_INVALIDATION } from '../cache/ContentCacheKeys';

/**
 * Content Data Service
 * 
 * Provides intelligent caching and orchestration for content data
 * Implements enterprise-grade caching with content management optimization
 */
@Injectable()
export class ContentDataService {
  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.CONTENT_REPOSITORY) private repository: IContentRepository
  ) {}

  // Core Content Operations
  async getContent(contentId: string, token: JwtToken): Promise<ContentEntity | null> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_ITEM(contentId);
    
    let data = this.cache.get<ContentEntity>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentById(contentId);
    
    if (data && data.status === 'published') {
      // Increment view count asynchronously
      this.repository.incrementViews(contentId).catch(error => {
        console.error('Error incrementing views:', error);
      });
    }
    
    if (data) {
      this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_ITEM);
    }
    
    return data;
  }

  async createContent(contentData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>, token: JwtToken): Promise<ContentEntity> {
    const result = await this.repository.createContent(contentData);
    
    // Invalidate content lists and search results
    CONTENT_CACHE_INVALIDATION.CONTENT_LIST_UPDATE().forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Invalidate author-specific caches
    if (contentData.authorId) {
      CONTENT_CACHE_INVALIDATION.AUTHOR_UPDATE(contentData.authorId).forEach(key => {
        this.cache.invalidatePattern(key);
      });
    }
    
    // Cache the new content
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_ITEM(result.id);
    this.cache.set(cacheKey, result, CONTENT_CACHE_TTL.CONTENT_ITEM);
    
    return result;
  }

  async updateContent(contentId: string, updates: Partial<ContentEntity>, token: JwtToken): Promise<ContentEntity> {
    const result = await this.repository.updateContent(contentId, updates);
    
    // Invalidate content-related caches
    CONTENT_CACHE_INVALIDATION.CONTENT_UPDATE(contentId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Cache the updated content
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_ITEM(contentId);
    this.cache.set(cacheKey, result, CONTENT_CACHE_TTL.CONTENT_ITEM);
    
    return result;
  }

  async deleteContent(contentId: string, token: JwtToken): Promise<void> {
    await this.repository.deleteContent(contentId);
    
    // Invalidate all content-related caches
    CONTENT_CACHE_INVALIDATION.CONTENT_UPDATE(contentId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    // Remove from cache
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_ITEM(contentId);
    this.cache.delete(cacheKey);
  }

  // Content List Operations
  async getContentList(page: number = 0, size: number = 20, filters?: string, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_LIST(page, size, filters);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentList(page, size, filters);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_LIST);
    
    return data;
  }

  async getContentByAuthor(authorId: string, page: number = 0, size: number = 20, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_BY_AUTHOR(authorId, page, size);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentByAuthor(authorId, page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_BY_AUTHOR);
    
    return data;
  }

  async getContentByType(contentType: string, page: number = 0, size: number = 20, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_BY_TYPE(contentType, page, size);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentByType(contentType, page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_BY_TYPE);
    
    return data;
  }

  async getContentByCategory(category: string, page: number = 0, size: number = 20, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_BY_CATEGORY(category, page, size);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentByCategory(category, page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_BY_CATEGORY);
    
    return data;
  }

  async getContentByTag(tag: string, page: number = 0, size: number = 20, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_BY_TAG(tag, page, size);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentByTag(tag, page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_BY_TAG);
    
    return data;
  }

  // Content Search Operations
  async searchContent(query: string, page: number = 0, size: number = 20, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_SEARCH(query, page, size);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.searchContent(query, page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_SEARCH);
    
    return data;
  }

  async getContentSuggestions(query: string, token: JwtToken): Promise<string[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_SUGGESTIONS(query);
    
    let data = this.cache.get<string[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentSuggestions(query);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_SUGGESTIONS);
    
    return data;
  }

  async getTrendingContent(token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.TRENDING_CONTENT();
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getTrendingContent();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.TRENDING_CONTENT);
    
    return data;
  }

  async getFeaturedContent(token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.FEATURED_CONTENT();
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getFeaturedContent();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.FEATURED_CONTENT);
    
    return data;
  }

  // Media Operations
  async getContentMedia(contentId: string, token: JwtToken): Promise<MediaFile[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_MEDIA(contentId);
    
    let data = this.cache.get<MediaFile[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentMedia(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_MEDIA);
    
    return data;
  }

  async getMediaLibrary(page: number = 0, size: number = 50, token: JwtToken): Promise<MediaFile[]> {
    const cacheKey = CONTENT_CACHE_KEYS.MEDIA_LIBRARY(page, size);
    
    let data = this.cache.get<MediaFile[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getMediaLibrary(page, size);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.MEDIA_LIBRARY);
    
    return data;
  }

  async uploadMedia(contentId: string, file: File, token: JwtToken): Promise<MediaFile> {
    const result = await this.repository.uploadMedia(contentId, file, token);
    
    // Invalidate media caches
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.CONTENT_MEDIA(contentId));
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.MEDIA_LIBRARY('*'));
    
    return result;
  }

  // Version Control Operations
  async getContentVersions(contentId: string, token: JwtToken): Promise<ContentVersion[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_VERSIONS(contentId);
    
    let data = this.cache.get<ContentVersion[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentVersions(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_VERSIONS);
    
    return data;
  }

  async createContentVersion(contentId: string, content: ContentEntity, changeType: 'create' | 'update' | 'publish', token: JwtToken): Promise<ContentVersion> {
    const result = await this.repository.createContentVersion(contentId, content, changeType);
    
    // Invalidate version caches
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.CONTENT_VERSIONS(contentId));
    
    return result;
  }

  // Analytics Operations
  async getContentAnalytics(contentId: string, token: JwtToken): Promise<ContentAnalytics> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_ANALYTICS(contentId);
    
    let data = this.cache.get<ContentAnalytics>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentAnalytics(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_ANALYTICS);
    
    return data;
  }

  async getContentStats(authorId: string, period: string = '30d', token: JwtToken): Promise<any> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_STATS(authorId, period);
    
    let data = this.cache.get(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentStats(authorId, period);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_STATS);
    
    return data;
  }

  async updateContentAnalytics(contentId: string, analytics: Partial<ContentAnalytics>, token: JwtToken): Promise<ContentAnalytics> {
    const result = await this.repository.updateContentAnalytics(contentId, analytics);
    
    // Invalidate analytics cache
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.CONTENT_ANALYTICS(contentId));
    
    return result;
  }

  // Moderation Operations
  async getContentModeration(contentId: string, token: JwtToken): Promise<ModerationData> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_MODERATION(contentId);
    
    let data = this.cache.get<ModerationData>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentModeration(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_MODERATION);
    
    return data;
  }

  async getModerationQueue(token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.MODERATION_QUEUE();
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await repository.getModerationQueue();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.MODERATION_QUEUE);
    
    return data;
  }

  async getFlaggedContent(token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.FLAGGED_CONTENT();
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await repository.getFlaggedContent();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.FLAGGED_CONTENT);
    
    return data;
  }

  async moderateContent(contentId: string, moderationData: Partial<ModerationData>, token: JwtToken): Promise<ModerationData> {
    const result = await this.repository.moderateContent(contentId, moderationData);
    
    // Invalidate moderation caches
    CONTENT_CACHE_INVALIDATION.MODERATION_UPDATE(contentId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
    
    return result;
  }

  // Template Operations
  async getContentTemplates(token: JwtToken): Promise<ContentTemplate[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_TEMPLATES();
    
    let data = this.cache.get<ContentTemplate[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentTemplates();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_TEMPLATES);
    
    return data;
  }

  async getContentTemplate(templateId: string, token: JwtToken): Promise<ContentTemplate> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_TEMPLATE(templateId);
    
    let data = this.cache.get<ContentTemplate>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentTemplate(templateId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_TEMPLATE);
    
    return data;
  }

  async createContentTemplate(templateData: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt'>, token: JwtToken): Promise<ContentTemplate> {
    const result = await this.repository.createContentTemplate(templateData);
    
    // Invalidate template cache
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.CONTENT_TEMPLATES());
    
    return result;
  }

  // Draft Operations
  async getContentDrafts(authorId: string, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_DRAFTS(authorId);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentDrafts(authorId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_DRAFTS);
    
    return data;
  }

  async saveContentDraft(draftData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>, token: JwtToken): Promise<ContentEntity> {
    const result = await this.repository.saveContentDraft(draftData);
    
    // Invalidate drafts cache
    if (result.authorId) {
      this.cache.invalidatePattern(CONTENT_CACHE_KEYS.CONTENT_DRAFTS(result.authorId));
    }
    
    return result;
  }

  async deleteContentDraft(draftId: string, token: JwtToken): Promise<void> {
    await this.repository.deleteContentDraft(draftId);
    
    // Remove from cache
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_DRAFT(draftId);
    this.cache.delete(cacheKey);
  }

  // Scheduling Operations
  async getScheduledContent(token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.SCHEDULED_CONTENT();
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getScheduledContent();
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.SCHEDULED_CONTENT);
    
    return data;
  }

  async getScheduledContentByAuthor(authorId: string, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.SCHEDULED_BY_AUTHOR(authorId);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getScheduledContentByAuthor(authorId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.SCHEDULED_BY_AUTHOR);
    
    return data;
  }

  async scheduleContent(contentId: string, publishDate: Date, token: JwtToken): Promise<ContentEntity> {
    const result = await this.repository.scheduleContent(contentId, publishDate);
    
    // Invalidate scheduling caches
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.SCHEDULED_CONTENT());
    if (result.authorId) {
      this.cache.invalidatePattern(CONTENT_CACHE_KEYS.SCHEDULED_BY_AUTHOR(result.authorId));
    }
    
    return result;
  }

  // Relationship Operations
  async getRelatedContent(contentId: string, token: JwtToken): Promise<ContentEntity[]> {
    const cacheKey = CONTENT_CACHE_KEYS.RELATED_CONTENT(contentId);
    
    let data = this.cache.get<ContentEntity[]>(cacheKey);
    if (data) return data;
    
    data = await this.repository.getRelatedContent(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.RELATED_CONTENT);
    
    return data;
  }

  async getContentLinks(contentId: string, token: JwtToken): Promise<any[]> {
    const cacheKey = CONTENT_CACHE_KEYS.CONTENT_LINKS(contentId);
    
    let data = this.cache.get(cacheKey);
    if (data) return data;
    
    data = await this.repository.getContentLinks(contentId);
    this.cache.set(cacheKey, data, CONTENT_CACHE_TTL.CONTENT_LINKS);
    
    return data;
  }

  // Batch operations for performance
  async getCompleteContent(contentId: string, token: JwtToken): Promise<{
    content: ContentEntity;
    media: MediaFile[];
    versions: ContentVersion[];
    analytics: ContentAnalytics;
    moderation: ModerationData;
    related: ContentEntity[];
    links: any[];
  }> {
    const cacheKey = CONTENT_CACHE_KEYS.COMPLETE_CONTENT(contentId);
    
    let data = this.cache.get(cacheKey);
    if (data) return data;
    
    // Fetch all content data in parallel for better performance
    const [
      content,
      media,
      versions,
      analytics,
      moderation,
      related,
      links
    ] = await Promise.all([
      this.getContent(contentId, token),
      this.getContentMedia(contentId, token),
      this.getContentVersions(contentId, token),
      this.getContentAnalytics(contentId, token),
      this.getContentModeration(contentId, token),
      this.getRelatedContent(contentId, token),
      this.getContentLinks(contentId, token)
    ]);
    
    const completeContent = {
      content,
      media,
      versions,
      analytics,
      moderation,
      related,
      links
    };
    
    this.cache.set(cacheKey, completeContent, CONTENT_CACHE_TTL.COMPLETE_CONTENT);
    
    return completeContent;
  }

  async getAuthorContentSummary(authorId: string, token: JwtToken): Promise<{
    totalContent: number;
    publishedContent: number;
    draftContent: number;
    scheduledContent: number;
    totalViews: number;
    totalEngagement: number;
    recentContent: ContentEntity[];
  }> {
    const cacheKey = CONTENT_CACHE_KEYS.AUTHOR_CONTENT_SUMMARY(authorId);
    
    let data = this.cache.get(cacheKey);
    if (data) return data;
    
    // Get author statistics and recent content
    const [stats, drafts, scheduled, recent] = await Promise.all([
      this.getContentStats(authorId, '30d', token),
      this.getContentDrafts(authorId, token),
      this.getScheduledContentByAuthor(authorId, token),
      this.getContentByAuthor(authorId, 0, 5, token)
    ]);
    
    const summary = {
      totalContent: stats.totalContent || 0,
      publishedContent: stats.publishedContent || 0,
      draftContent: drafts.length,
      scheduledContent: scheduled.length,
      totalViews: stats.totalViews || 0,
      totalEngagement: stats.totalEngagement || 0,
      recentContent: recent
    };
    
    this.cache.set(cacheKey, summary, CONTENT_CACHE_TTL.AUTHOR_CONTENT_SUMMARY);
    
    return summary;
  }

  // Cache management utilities
  invalidateContentCache(contentId: string): void {
    CONTENT_CACHE_INVALIDATION.CONTENT_UPDATE(contentId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
  }

  invalidateAuthorCache(authorId: string): void {
    CONTENT_CACHE_INVALIDATION.AUTHOR_UPDATE(authorId).forEach(key => {
      this.cache.invalidatePattern(key);
    });
  }

  invalidateSearchCache(): void {
    CONTENT_CACHE_INVALIDATION.SEARCH_UPDATE().forEach(key => {
      this.cache.invalidatePattern(key);
    });
  }

  clearAllContentCache(): void {
    this.cache.invalidatePattern(CONTENT_CACHE_KEYS.ALL_CONTENT_PATTERN());
  }

  // Performance monitoring
  getCacheStats() {
    return this.cache.getStats();
  }

  // Prefetching for better UX
  async prefetchContent(contentId: string, token: JwtToken): Promise<void> {
    // Prefetch commonly accessed content data
    await Promise.all([
      this.getContent(contentId, token),
      this.getContentAnalytics(contentId, token),
      this.getContentMedia(contentId, token)
    ]);
  }

  async prefetchAuthorContent(authorId: string, token: JwtToken): Promise<void> {
    // Prefetch author-specific data
    await Promise.all([
      this.getContentByAuthor(authorId, 0, 5, token),
      this.getContentStats(authorId, '7d', token),
      this.getContentDrafts(authorId, token)
    ]);
  }
}
