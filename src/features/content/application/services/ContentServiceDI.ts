import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '../../../../core/di';
import type { 
  ContentEntity, 
  ContentMetadata, 
  MediaFile, 
  ContentVersion, 
  ContentTemplate,
  ContentAnalytics,
  ModerationData,
  ModerationFlag
} from '../domain';
import { ContentRepository } from '../data';

@Injectable({ lifetime: 'singleton' })
export class ContentService {
  constructor(
    @Inject(ContentRepository) private contentRepository: ContentRepository
  ) {}

  // Content CRUD operations
  async createContent(data: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'analytics'>): Promise<ContentEntity> {
    // Process content metadata
    const metadata = await this.processContentMetadata(data.content);
    
    const content = {
      ...data,
      metadata,
      seo: await this.generateSEO(data.title, data.content),
      moderation: {
        status: 'pending',
        flags: [],
        autoModeration: true
      }
    };

    return await this.contentRepository.createContent(content);
  }

  async getContent(id: string): Promise<ContentEntity | null> {
    const content = await this.contentRepository.getContentById(id);
    
    if (content && content.status === 'published') {
      // Increment view count
      await this.contentRepository.incrementViews(id);
    }
    
    return content;
  }

  async updateContent(id: string, updates: Partial<ContentEntity>): Promise<ContentEntity> {
    const existing = await this.contentRepository.getContentById(id);
    if (!existing) {
      throw new Error(`Content ${id} not found`);
    }

    // Process updated content metadata
    if (updates.content) {
      const metadata = await this.processContentMetadata(updates.content);
      updates.metadata = { ...existing.metadata, ...metadata };
    }

    // Update SEO if title or content changed
    if (updates.title || updates.content) {
      const title = updates.title || existing.title;
      const content = updates.content || existing.content;
      updates.seo = await this.generateSEO(title, content);
    }

    return await this.contentRepository.updateContent(id, updates);
  }

  async deleteContent(id: string): Promise<void> {
    await this.contentRepository.deleteContent(id);
  }

  async publishContent(id: string): Promise<ContentEntity> {
    return await this.contentRepository.publishContent(id);
  }

  async archiveContent(id: string): Promise<ContentEntity> {
    return await this.contentRepository.archiveContent(id);
  }

  // Content search and filtering
  async searchContent(query: string, filters: {
    authorId?: string;
    contentType?: ContentEntity['contentType'];
    status?: ContentEntity['status'];
    tags?: string[];
    categories?: string[];
  } = {}): Promise<ContentEntity[]> {
    return await this.contentRepository.searchContent(query, filters);
  }

  async getContentsByAuthor(authorId: string, options: {
    limit?: number;
    offset?: number;
    status?: ContentEntity['status'];
    contentType?: ContentEntity['contentType'];
  } = {}): Promise<ContentEntity[]> {
    return await this.contentRepository.getContentsByAuthor(authorId, options);
  }

  // Media management
  async uploadMedia(file: File, metadata?: Partial<MediaFile['metadata']>): Promise<MediaFile> {
    // Simulate file upload and processing
    const processedFile = await this.processMediaFile(file, metadata);
    
    return await this.contentRepository.uploadMedia(processedFile);
  }

  async getMediaByContent(contentId: string): Promise<MediaFile[]> {
    return await this.contentRepository.getMediaByContent(contentId);
  }

  async deleteMedia(id: string): Promise<void> {
    await this.contentRepository.deleteMedia(id);
  }

  // Version management
  async getVersions(contentId: string): Promise<ContentVersion[]> {
    return await this.contentRepository.getVersions(contentId);
  }

  async getVersion(contentId: string, version: number): Promise<ContentVersion | null> {
    return await this.contentRepository.getVersion(contentId, version);
  }

  async revertToVersion(contentId: string, version: number): Promise<ContentEntity> {
    return await this.contentRepository.revertToVersion(contentId, version);
  }

  // Template management
  async createTemplate(template: Omit<ContentTemplate, 'id' | 'createdAt'>): Promise<ContentTemplate> {
    return await this.contentRepository.createTemplate(template);
  }

  async getTemplates(contentType?: ContentEntity['contentType']): Promise<ContentTemplate[]> {
    return await this.contentRepository.getTemplates(contentType);
  }

  async getTemplateById(id: string): Promise<ContentTemplate | null> {
    return await this.contentRepository.getTemplateById(id);
  }

  async updateTemplate(id: string, updates: Partial<ContentTemplate>): Promise<ContentTemplate> {
    return await this.contentRepository.updateTemplate(id, updates);
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.contentRepository.deleteTemplate(id);
  }

  // Analytics
  async getAnalytics(contentId: string): Promise<ContentAnalytics | null> {
    return await this.contentRepository.getAnalytics(contentId);
  }

  async updateAnalytics(contentId: string, updates: Partial<ContentAnalytics>): Promise<ContentAnalytics> {
    return await this.contentRepository.updateAnalytics(contentId, updates);
  }

  async incrementLikes(contentId: string): Promise<void> {
    await this.contentRepository.incrementLikes(contentId);
  }

  // Content processing utilities
  private async processContentMetadata(content: string): Promise<ContentMetadata> {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
    
    // Extract media URLs (simplified regex)
    const imageRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi;
    const videoRegex = /https?:\/\/[^\s]+\.(mp4|webm|ogg)/gi;
    const docRegex = /https?:\/\/[^\s]+\.(pdf|doc|docx)/gi;
    
    const images = content.match(imageRegex) || [];
    const videos = content.match(videoRegex) || [];
    const documents = content.match(docRegex) || [];

    return {
      wordCount,
      readingTime,
      language: 'en', // Would use language detection in real implementation
      images: images.map((url, index) => ({
        id: `img_${index}`,
        filename: `image_${index}`,
        originalName: `image_${index}`,
        mimeType: 'image/jpeg',
        size: 0,
        url,
        metadata: {
          alt: `Image ${index + 1}`,
          tags: []
        },
        uploadedAt: new Date()
      })),
      videos: videos.map((url, index) => ({
        id: `vid_${index}`,
        filename: `video_${index}`,
        originalName: `video_${index}`,
        mimeType: 'video/mp4',
        size: 0,
        url,
        metadata: {
          duration: 0,
          tags: []
        },
        uploadedAt: new Date()
      })),
      documents: documents.map((url, index) => ({
        id: `doc_${index}`,
        filename: `document_${index}`,
        originalName: `document_${index}`,
        mimeType: 'application/pdf',
        size: 0,
        url,
        metadata: {
          tags: []
        },
        uploadedAt: new Date()
      })),
      links: [],
      customFields: {}
    };
  }

  private async generateSEO(title: string, content: string): Promise<ContentEntity['seo']> {
    // Extract keywords (simplified)
    const words = content.toLowerCase().split(/\s+/);
    const wordFreq = words.reduce((freq, word) => {
      if (word.length > 3) {
        freq[word] = (freq[word] || 0) + 1;
      }
      return freq;
    }, {} as Record<string, number>);
    
    const keywords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    // Generate description
    const description = content.length > 160 
      ? content.substring(0, 157) + '...'
      : content;

    return {
      title,
      description,
      keywords,
      metaRobots: 'index, follow',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        author: 'QuietSpace User'
      }
    };
  }

  private async processMediaFile(file: File, metadata?: Partial<MediaFile['metadata']>): Promise<Omit<MediaFile, 'id' | 'uploadedAt'>> {
    // Simulate file processing
    const processedMetadata: MediaFile['metadata'] = {
      alt: metadata?.alt || file.name,
      caption: metadata?.caption,
      tags: metadata?.tags || []
    };

    // For images, simulate dimension extraction
    if (file.type.startsWith('image/')) {
      processedMetadata.width = 1920;
      processedMetadata.height = 1080;
      processedMetadata.format = file.type.split('/')[1];
    }

    // For videos, simulate duration extraction
    if (file.type.startsWith('video/')) {
      processedMetadata.duration = 120; // 2 minutes
      processedMetadata.format = file.type.split('/')[1];
    }

    return {
      filename: `processed_${Date.now()}_${file.name}`,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // In real app, this would be a cloud storage URL
      metadata: processedMetadata
    };
  }

  // Content moderation
  async getPendingModeration(): Promise<ContentEntity[]> {
    return await this.contentRepository.getPendingModeration();
  }

  async updateModeration(contentId: string, moderation: Partial<ModerationData>): Promise<ContentEntity> {
    return await this.contentRepository.updateModeration(contentId, moderation);
  }

  async autoModerateContent(content: ContentEntity): Promise<ModerationFlag[]> {
    const flags: ModerationFlag[] = [];
    const contentText = content.content.toLowerCase();

    // Simple keyword-based moderation (in real app, would use AI/ML)
    const spamKeywords = ['spam', 'scam', 'fake', 'clickbait'];
    const hateKeywords = ['hate', 'racist', 'discriminatory'];
    const adultKeywords = ['adult', 'explicit', 'nsfw'];

    if (spamKeywords.some(keyword => contentText.includes(keyword))) {
      flags.push({
        type: 'spam',
        severity: 'medium',
        confidence: 0.8,
        description: 'Potential spam content detected',
        flaggedBy: 'ai',
        flaggedAt: new Date()
      });
    }

    if (hateKeywords.some(keyword => contentText.includes(keyword))) {
      flags.push({
        type: 'hate',
        severity: 'high',
        confidence: 0.9,
        description: 'Potential hate speech detected',
        flaggedBy: 'ai',
        flaggedAt: new Date()
      });
    }

    if (adultKeywords.some(keyword => contentText.includes(keyword))) {
      flags.push({
        type: 'adult',
        severity: 'high',
        confidence: 0.85,
        description: 'Potential adult content detected',
        flaggedBy: 'ai',
        flaggedAt: new Date()
      });
    }

    return flags;
  }

  // Batch operations
  async createBatchContents(contents: Array<Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'analytics'>>): Promise<ContentEntity[]> {
    return await this.contentRepository.createBatchContents(contents);
  }
}

// DI-enabled Hook
export const useContentDI = (authorId?: string) => {
  const contentService = useService(ContentService);
  const [contents, setContents] = React.useState<ContentEntity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch contents
  const fetchContents = React.useCallback(async (options: {
    limit?: number;
    offset?: number;
    status?: ContentEntity['status'];
    contentType?: ContentEntity['contentType'];
  } = {}) => {
    if (!authorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await contentService.getContentsByAuthor(authorId, options);
      setContents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  }, [contentService, authorId]);

  // Create content
  const createContent = React.useCallback(async (data: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'analytics'>) => {
    try {
      const newContent = await contentService.createContent(data);
      setContents(prev => [newContent, ...prev]);
      return newContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
      throw err;
    }
  }, [contentService]);

  // Update content
  const updateContent = React.useCallback(async (id: string, updates: Partial<ContentEntity>) => {
    try {
      const updatedContent = await contentService.updateContent(id, updates);
      setContents(prev => prev.map(content =>
        content.id === id ? updatedContent : content
      ));
      return updatedContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    }
  }, [contentService]);

  // Delete content
  const deleteContent = React.useCallback(async (id: string) => {
    try {
      await contentService.deleteContent(id);
      setContents(prev => prev.filter(content => content.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
    }
  }, [contentService]);

  // Publish content
  const publishContent = React.useCallback(async (id: string) => {
    try {
      const publishedContent = await contentService.publishContent(id);
      setContents(prev => prev.map(content =>
        content.id === id ? publishedContent : content
      ));
      return publishedContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish content');
      throw err;
    }
  }, [contentService]);

  // Search content
  const searchContent = React.useCallback(async (query: string, filters: {
    authorId?: string;
    contentType?: ContentEntity['contentType'];
    status?: ContentEntity['status'];
    tags?: string[];
    categories?: string[];
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await contentService.searchContent(query, filters);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search content');
      return [];
    } finally {
      setLoading(false);
    }
  }, [contentService]);

  // Initial fetch
  React.useEffect(() => {
    if (authorId) {
      fetchContents();
    }
  }, [fetchContents, authorId]);

  return {
    contents,
    loading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    searchContent
  };
};
