import 'reflect-metadata';
import { Injectable } from '../../../core/di';
import type { 
  ContentEntity, 
  ContentMetadata, 
  MediaFile, 
  ContentVersion, 
  ContentTemplate,
  ContentAnalytics,
  ModerationData 
} from '../domain';

@Injectable({ lifetime: 'singleton' })
export class ContentRepository {
  private contents = new Map<string, ContentEntity>();
  private mediaFiles = new Map<string, MediaFile>();
  private versions = new Map<string, ContentVersion[]>();
  private templates = new Map<string, ContentTemplate>();
  private analytics = new Map<string, ContentAnalytics>();

  // Content operations
  async createContent(content: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<ContentEntity> {
    const newContent: ContentEntity = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      analytics: {
        views: 0,
        uniqueViews: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        averageReadTime: 0,
        bounceRate: 0,
        engagementScore: 0,
        lastUpdated: new Date()
      }
    };

    this.contents.set(newContent.id, newContent);
    
    // Create initial version
    await this.createVersion(newContent.id, newContent, 'create');
    
    return newContent;
  }

  async getContentById(id: string): Promise<ContentEntity | null> {
    return this.contents.get(id) || null;
  }

  async getContentsByAuthor(authorId: string, options: {
    limit?: number;
    offset?: number;
    status?: ContentEntity['status'];
    contentType?: ContentEntity['contentType'];
  } = {}): Promise<ContentEntity[]> {
    const authorContents = Array.from(this.contents.values())
      .filter(content => content.authorId === authorId)
      .filter(content => !options.status || content.status === options.status)
      .filter(content => !options.contentType || content.contentType === options.contentType)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const offset = options.offset || 0;
    const limit = options.limit || 20;
    
    return authorContents.slice(offset, offset + limit);
  }

  async updateContent(id: string, updates: Partial<ContentEntity>): Promise<ContentEntity> {
    const existing = this.contents.get(id);
    if (!existing) {
      throw new Error(`Content ${id} not found`);
    }

    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date(),
      version: existing.version + 1
    };

    this.contents.set(id, updated);
    
    // Create version for the update
    await this.createVersion(id, updated, 'update');
    
    return updated;
  }

  async deleteContent(id: string): Promise<void> {
    const content = this.contents.get(id);
    if (content) {
      // Soft delete
      await this.updateContent(id, { status: 'deleted' });
    }
  }

  async publishContent(id: string): Promise<ContentEntity> {
    return await this.updateContent(id, { 
      status: 'published', 
      publishedAt: new Date() 
    });
  }

  async archiveContent(id: string): Promise<ContentEntity> {
    return await this.updateContent(id, { status: 'archived' });
  }

  // Search and filtering
  async searchContent(query: string, filters: {
    authorId?: string;
    contentType?: ContentEntity['contentType'];
    status?: ContentEntity['status'];
    tags?: string[];
    categories?: string[];
  } = {}): Promise<ContentEntity[]> {
    let results = Array.from(this.contents.values());

    // Text search
    if (query) {
      const searchQuery = query.toLowerCase();
      results = results.filter(content =>
        content.title.toLowerCase().includes(searchQuery) ||
        content.content.toLowerCase().includes(searchQuery)
      );
    }

    // Apply filters
    if (filters.authorId) {
      results = results.filter(content => content.authorId === filters.authorId);
    }
    if (filters.contentType) {
      results = results.filter(content => content.contentType === filters.contentType);
    }
    if (filters.status) {
      results = results.filter(content => content.status === filters.status);
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(content =>
        filters.tags!.some(tag => content.tags.includes(tag))
      );
    }
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(content =>
        filters.categories!.some(category => content.categories.includes(category))
      );
    }

    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Media operations
  async uploadMedia(file: Omit<MediaFile, 'id' | 'uploadedAt'>): Promise<MediaFile> {
    const mediaFile: MediaFile = {
      ...file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date()
    };

    this.mediaFiles.set(mediaFile.id, mediaFile);
    return mediaFile;
  }

  async getMediaById(id: string): Promise<MediaFile | null> {
    return this.mediaFiles.get(id) || null;
  }

  async getMediaByContent(contentId: string): Promise<MediaFile[]> {
    const content = await this.getContentById(contentId);
    if (!content) return [];

    return [
      ...content.metadata.images,
      ...content.metadata.videos,
      ...content.metadata.documents
    ];
  }

  async deleteMedia(id: string): Promise<void> {
    this.mediaFiles.delete(id);
  }

  // Version management
  async createVersion(contentId: string, content: ContentEntity, changeType: ContentVersion['changes'][0]['type']): Promise<ContentVersion> {
    const versions = this.versions.get(contentId) || [];
    const newVersion: ContentVersion = {
      id: Date.now().toString(),
      contentId,
      version: content.version,
      title: content.title,
      content: content.content,
      changes: [{
        type: changeType,
        field: 'content',
        newValue: content.content,
        timestamp: new Date(),
        authorId: content.authorId
      }],
      authorId: content.authorId,
      createdAt: new Date()
    };

    versions.push(newVersion);
    this.versions.set(contentId, versions);
    return newVersion;
  }

  async getVersions(contentId: string): Promise<ContentVersion[]> {
    return this.versions.get(contentId) || [];
  }

  async getVersion(contentId: string, version: number): Promise<ContentVersion | null> {
    const versions = await this.getVersions(contentId);
    return versions.find(v => v.version === version) || null;
  }

  async revertToVersion(contentId: string, version: number): Promise<ContentEntity> {
    const versionData = await this.getVersion(contentId, version);
    if (!versionData) {
      throw new Error(`Version ${version} not found for content ${contentId}`);
    }

    return await this.updateContent(contentId, {
      title: versionData.title,
      content: versionData.content
    });
  }

  // Template operations
  async createTemplate(template: Omit<ContentTemplate, 'id' | 'createdAt'>): Promise<ContentTemplate> {
    const newTemplate: ContentTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getTemplates(contentType?: ContentEntity['contentType']): Promise<ContentTemplate[]> {
    const allTemplates = Array.from(this.templates.values());
    
    if (contentType) {
      return allTemplates.filter(template => template.contentType === contentType);
    }
    
    return allTemplates;
  }

  async getTemplateById(id: string): Promise<ContentTemplate | null> {
    return this.templates.get(id) || null;
  }

  async updateTemplate(id: string, updates: Partial<ContentTemplate>): Promise<ContentTemplate> {
    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error(`Template ${id} not found`);
    }

    const updated = { ...existing, ...updates };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: string): Promise<void> {
    this.templates.delete(id);
  }

  // Analytics operations
  async updateAnalytics(contentId: string, updates: Partial<ContentAnalytics>): Promise<ContentAnalytics> {
    const existing = this.analytics.get(contentId) || {
      views: 0,
      uniqueViews: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      averageReadTime: 0,
      bounceRate: 0,
      engagementScore: 0,
      lastUpdated: new Date()
    };

    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date()
    };

    this.analytics.set(contentId, updated);
    return updated;
  }

  async getAnalytics(contentId: string): Promise<ContentAnalytics | null> {
    return this.analytics.get(contentId) || null;
  }

  async incrementViews(contentId: string, count = 1): Promise<void> {
    const analytics = await this.getAnalytics(contentId);
    if (analytics) {
      await this.updateAnalytics(contentId, {
        views: analytics.views + count
      });
    }
  }

  async incrementLikes(contentId: string, count = 1): Promise<void> {
    const analytics = await this.getAnalytics(contentId);
    if (analytics) {
      await this.updateAnalytics(contentId, {
        likes: analytics.likes + count
      });
    }
  }

  // Batch operations
  async createBatchContents(contents: Array<Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>>): Promise<ContentEntity[]> {
    const createdContents = await Promise.all(
      contents.map(content => this.createContent(content))
    );
    return createdContents;
  }

  async updateAnalyticsBatch(updates: Array<{ contentId: string; updates: Partial<ContentAnalytics> }>): Promise<void> {
    await Promise.all(
      updates.map(({ contentId, updates }) => this.updateAnalytics(contentId, updates))
    );
  }

  // Content moderation
  async getPendingModeration(): Promise<ContentEntity[]> {
    return Array.from(this.contents.values())
      .filter(content => content.moderation.status === 'pending');
  }

  async updateModeration(contentId: string, moderation: Partial<ModerationData>): Promise<ContentEntity> {
    const content = await this.getContentById(contentId);
    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }

    const updatedModeration = {
      ...content.moderation,
      ...moderation,
      moderatedAt: new Date()
    };

    return await this.updateContent(contentId, { moderation: updatedModeration });
  }
}
