/**
 * Enterprise Content Example Component
 * 
 * Demonstrates the usage of enterprise content hooks
 * Shows best practices for content management with custom query system
 */

import React from 'react';
import { useEnterpriseContent } from '../hooks/useEnterpriseContent';
import type { ContentEntity, ContentTemplate, MediaFile } from '@features/content/domain/entities/ContentEntity';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Content Tab type
 */
export type ContentTab = 'create' | 'edit' | 'list' | 'analytics';

/**
 * Content Analytics interface
 */
export interface IContentAnalytics {
  totalViews: number;
  uniqueViews: number;
  averageReadTime: number;
  engagementRate: number;
  shares: number;
  likes: number;
  comments: number;
  bounceRate: number;
  conversionRate: number;
}

/**
 * Content Status interface
 */
export interface IContentStatus {
  isPublished: boolean;
  isScheduled: boolean;
  isDraft: boolean;
  isModerated: boolean;
  publishDate?: Date;
  scheduledDate?: Date;
  lastModified: Date;
}

/**
 * Enterprise Content Example Props
 */
export interface IEnterpriseContentExampleProps extends IBaseComponentProps {
  contentId?: string;
  initialTab?: ContentTab;
  enableRealTimeUpdates?: boolean;
}

/**
 * Enterprise Content Example State
 */
export interface IEnterpriseContentExampleState extends IBaseComponentState {
  activeTab: ContentTab;
  selectedContentId: string | undefined;
  content: ContentEntity | null;
  contentList: ContentEntity[];
  authorContent: ContentEntity[];
  searchResults: ContentEntity[];
  trending: ContentEntity[];
  featured: ContentEntity[];
  media: MediaFile[];
  analytics: IContentAnalytics | null;
  moderation: any;
  templates: ContentTemplate[];
  drafts: ContentEntity[];
  scheduled: ContentEntity[];
  isLoading: boolean;
  errorMessage: string | null;
  hasUnsavedChanges: boolean;
  isRealTimeEnabled: boolean;
  lastUpdate: Date | null;
}

/**
 * Enterprise Content Example Component
 * 
 * Demonstrates enterprise content management with:
 * - Multi-tab content interface (create/edit/list/analytics)
 * - Real-time content updates and analytics
 * - Media management and template system
 * - Content moderation and scheduling
 * - Search and filtering capabilities
 * - Draft management and publishing workflow
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseContentExample extends BaseClassComponent<IEnterpriseContentExampleProps, IEnterpriseContentExampleState> {
  private updateTimer: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseContentExampleState> {
    const { 
      contentId,
      initialTab = 'list',
      enableRealTimeUpdates = true
    } = this.props;

    return {
      activeTab: initialTab,
      selectedContentId: contentId,
      content: null,
      contentList: [],
      authorContent: [],
      searchResults: [],
      trending: [],
      featured: [],
      media: [],
      analytics: null,
      moderation: null,
      templates: [],
      drafts: [],
      scheduled: [],
      isLoading: false,
      errorMessage: null,
      hasUnsavedChanges: false,
      isRealTimeEnabled: enableRealTimeUpdates,
      lastUpdate: null
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeContent();
    this.startRealTimeUpdates();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupContent();
  }

  /**
   * Initialize content system
   */
  private initializeContent(): void {
    console.log('📝 Enterprise content example initialized');
    this.loadContent();
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    if (!this.state.isRealTimeEnabled) return;

    this.updateTimer = window.setInterval(() => {
      this.refreshContent();
    }, 15000); // Update every 15 seconds
  }

  /**
   * Cleanup content
   */
  private cleanupContent(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  /**
   * Load content from enterprise hook
   */
  private loadContent = (): void => {
    const contentData = this.getEnterpriseContentData();

    this.safeSetState({
      content: contentData.content,
      contentList: contentData.contentList,
      authorContent: contentData.authorContent,
      searchResults: contentData.searchResults,
      trending: contentData.trending,
      featured: contentData.featured,
      media: contentData.media,
      analytics: contentData.analytics,
      moderation: contentData.moderation,
      templates: contentData.templates,
      drafts: contentData.drafts,
      scheduled: contentData.scheduled,
      isLoading: contentData.isLoading,
      errorMessage: contentData.error
    });
  };

  /**
   * Get enterprise content data
   */
  private getEnterpriseContentData() {
    const { selectedContentId } = this.state;

    // Mock implementation that matches the hook interface
    return {
      content: selectedContentId ? this.generateMockContent(selectedContentId) : null,
      contentList: this.generateMockContentList(),
      authorContent: this.generateMockContentList(),
      searchResults: [],
      trending: this.generateMockContentList().slice(0, 5),
      featured: this.generateMockContentList().slice(0, 3),
      media: this.generateMockMedia(),
      analytics: this.generateMockAnalytics(),
      moderation: { pending: 2, approved: 15, rejected: 1 },
      templates: this.generateMockTemplates(),
      drafts: this.generateMockContentList().slice(0, 3),
      scheduled: this.generateMockContentList().slice(3, 5),
      isLoading: false,
      error: null,
      hasUnsavedChanges: false,
      createContent: this.createContent,
      updateContent: this.updateContent,
      deleteContent: this.deleteContent,
      publishContent: this.publishContent,
      scheduleContent: this.scheduleContent,
      uploadMedia: this.uploadMedia,
      moderateContent: this.moderateContent,
      searchContent: this.searchContent,
      getTrendingContent: this.getTrendingContent,
      getFeaturedContent: this.getFeaturedContent,
      loadCompleteContent: this.loadCompleteContent,
      refreshContent: this.refreshContent,
      invalidateContentCache: this.invalidateContentCache
    };
  }

  /**
   * Generate mock content
   */
  private generateMockContent(id: string): ContentEntity {
    return {
      id,
      title: `Sample Content ${id}`,
      content: 'This is a sample content item for demonstration purposes.',
      authorId: 'author-123',
      authorName: 'John Doe',
      categoryId: 'category-456',
      categoryName: 'Technology',
      tags: ['react', 'typescript', 'enterprise'],
      status: 'published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      updatedAt: new Date(),
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      shareCount: Math.floor(Math.random() * 25),
      featured: Math.random() > 0.8,
      trending: Math.random() > 0.7,
      metadata: {
        readTime: Math.floor(Math.random() * 10) + 1,
        difficulty: 'intermediate',
        wordCount: Math.floor(Math.random() * 2000) + 500
      }
    };
  }

  /**
   * Generate mock content list
   */
  private generateMockContentList(): ContentEntity[] {
    return Array.from({ length: 10 }, (_, index) => 
      this.generateMockContent(`content-${index + 1}`)
    );
  }

  /**
   * Generate mock media files
   */
  private generateMockMedia(): MediaFile[] {
    return [
      {
        id: 'media-1',
        filename: 'image-1.jpg',
        originalName: 'sample-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        url: 'https://example.com/image-1.jpg',
        thumbnailUrl: 'https://example.com/thumb-1.jpg',
        uploadedAt: new Date(),
        metadata: { width: 1920, height: 1080 }
      },
      {
        id: 'media-2',
        filename: 'video-1.mp4',
        originalName: 'sample-video.mp4',
        mimeType: 'video/mp4',
        size: 5120000,
        url: 'https://example.com/video-1.mp4',
        thumbnailUrl: 'https://example.com/thumb-video-1.jpg',
        uploadedAt: new Date(),
        metadata: { duration: 120, resolution: '1920x1080' }
      }
    ];
  }

  /**
   * Generate mock analytics
   */
  private generateMockAnalytics(): IContentAnalytics {
    return {
      totalViews: Math.floor(Math.random() * 10000) + 1000,
      uniqueViews: Math.floor(Math.random() * 5000) + 500,
      averageReadTime: Math.random() * 300 + 60,
      engagementRate: Math.random() * 0.3 + 0.4,
      shares: Math.floor(Math.random() * 500) + 50,
      likes: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 200) + 20,
      bounceRate: Math.random() * 0.3 + 0.2,
      conversionRate: Math.random() * 0.1 + 0.02
    };
  }

  /**
   * Generate mock templates
   */
  private generateMockTemplates(): ContentTemplate[] {
    return [
      {
        id: 'template-1',
        name: 'Blog Post Template',
        description: 'Standard blog post template with sections',
        content: '<h1>{{title}}</h1><p>{{content}}</p>',
        variables: ['title', 'content'],
        category: 'blog',
        createdAt: new Date()
      },
      {
        id: 'template-2',
        name: 'Article Template',
        description: 'Professional article template',
        content: '<article><header>{{title}}</header><section>{{content}}</section></article>',
        variables: ['title', 'content'],
        category: 'article',
        createdAt: new Date()
      }
    ];
  }

  /**
   * Handle tab change
   */
  private handleTabChange = (tab: ContentTab): void => {
    this.safeSetState({ activeTab: tab });
  };

  /**
   * Handle content selection
   */
  private handleContentSelection = (contentId: string): void => {
    this.safeSetState({ selectedContentId: contentId });
    this.loadCompleteContent(contentId);
  };

  /**
   * Create content
   */
  private createContent = async (content: Partial<ContentEntity>): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newContent: ContentEntity = {
        id: Date.now().toString(),
        title: content.title || 'New Content',
        content: content.content || '',
        authorId: 'author-123',
        authorName: 'John Doe',
        categoryId: content.categoryId || 'category-456',
        categoryName: content.categoryName || 'Technology',
        tags: content.tags || [],
        status: 'draft',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        featured: false,
        trending: false,
        metadata: content.metadata || {}
      };

      this.safeSetState(prev => ({
        contentList: [newContent, ...prev.contentList],
        drafts: [newContent, ...prev.drafts],
        isLoading: false
      }));
      
      console.log('📝 Content created:', newContent);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to create content'
      });
    }
  };

  /**
   * Update content
   */
  private updateContent = async (id: string, updates: Partial<ContentEntity>): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState(prev => ({
        contentList: prev.contentList.map(content =>
          content.id === id ? { ...content, ...updates, updatedAt: new Date() } : content
        ),
        isLoading: false
      }));
      
      console.log('✏️ Content updated:', id);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to update content'
      });
    }
  };

  /**
   * Delete content
   */
  private deleteContent = async (id: string): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState(prev => ({
        contentList: prev.contentList.filter(content => content.id !== id),
        drafts: prev.drafts.filter(content => content.id !== id),
        scheduled: prev.scheduled.filter(content => content.id !== id),
        isLoading: false
      }));
      
      console.log('🗑️ Content deleted:', id);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to delete content'
      });
    }
  };

  /**
   * Publish content
   */
  private publishContent = async (id: string): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState(prev => ({
        contentList: prev.contentList.map(content =>
          content.id === id 
            ? { ...content, status: 'published', publishedAt: new Date() }
            : content
        ),
        drafts: prev.drafts.filter(content => content.id !== id),
        isLoading: false
      }));
      
      console.log('📢 Content published:', id);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to publish content'
      });
    }
  };

  /**
   * Schedule content
   */
  private scheduleContent = async (id: string, scheduledDate: Date): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState(prev => ({
        contentList: prev.contentList.map(content =>
          content.id === id 
            ? { ...content, status: 'scheduled', publishedAt: scheduledDate }
            : content
        ),
        scheduled: [...prev.scheduled, prev.contentList.find(c => c.id === id)!],
        drafts: prev.drafts.filter(content => content.id !== id),
        isLoading: false
      }));
      
      console.log('⏰ Content scheduled:', id);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to schedule content'
      });
    }
  };

  /**
   * Upload media
   */
  private uploadMedia = async (file: File): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedia: MediaFile = {
        id: Date.now().toString(),
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        uploadedAt: new Date(),
        metadata: {}
      };

      this.safeSetState(prev => ({
        media: [newMedia, ...prev.media],
        isLoading: false
      }));
      
      console.log('📸 Media uploaded:', file.name);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to upload media'
      });
    }
  };

  /**
   * Moderate content
   */
  private moderateContent = async (id: string, action: 'approve' | 'reject'): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState(prev => ({
        contentList: prev.contentList.map(content =>
          content.id === id 
            ? { ...content, status: action === 'approve' ? 'published' : 'rejected' }
            : content
        ),
        isLoading: false
      }));
      
      console.log('🔍 Content moderated:', id, action);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to moderate content'
      });
    }
  };

  /**
   * Search content
   */
  private searchContent = async (query: string): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate search
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = this.state.contentList.filter(content =>
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.content.toLowerCase().includes(query.toLowerCase())
      );

      this.safeSetState({ 
        searchResults: results,
        isLoading: false
      });
      
      console.log('🔍 Content searched:', query);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to search content'
      });
    }
  };

  /**
   * Get trending content
   */
  private getTrendingContent = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const trending = this.state.contentList
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);

      this.safeSetState({ 
        trending,
        isLoading: false
      });
      
      console.log('📈 Trending content loaded');
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to load trending content'
      });
    }
  };

  /**
   * Get featured content
   */
  private getFeaturedContent = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const featured = this.state.contentList.filter(content => content.featured);

      this.safeSetState({ 
        featured,
        isLoading: false
      });
      
      console.log('⭐ Featured content loaded');
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to load featured content'
      });
    }
  };

  /**
   * Load complete content
   */
  private loadCompleteContent = async (id: string): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const content = this.generateMockContent(id);
      this.safeSetState({ 
        content,
        isLoading: false
      });
      
      console.log('📄 Complete content loaded:', id);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to load content'
      });
    }
  };

  /**
   * Refresh content
   */
  private refreshContent = (): void => {
    this.loadContent();
    this.safeSetState({ lastUpdate: new Date() });
  };

  /**
   * Invalidate content cache
   */
  private invalidateContentCache = (): void => {
    console.log('🗑️ Content cache invalidated');
    this.loadContent();
  };

  /**
   * Toggle real-time updates
   */
  private toggleRealTimeUpdates = (): void => {
    const newEnabled = !this.state.isRealTimeEnabled;
    this.safeSetState({ isRealTimeEnabled: newEnabled });
    
    if (newEnabled) {
      this.startRealTimeUpdates();
    } else {
      this.cleanupContent();
    }
  };

  /**
   * Render tab navigation
   */
  private renderTabNavigation(): React.ReactNode {
    const { activeTab } = this.state;

    return (
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['create', 'edit', 'list', 'analytics'] as ContentTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => this.handleTabChange(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render content list
   */
  private renderContentList(): React.ReactNode {
    const { contentList, isLoading, errorMessage } = this.state;

    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      );
    }

    if (errorMessage) {
      return (
        <ErrorMessage
          error={errorMessage}
          onRetry={() => this.refreshContent()}
          onClear={() => this.safeSetState({ errorMessage: null })}
          variant="default"
        />
      );
    }

    return (
      <div className="space-y-4">
        {contentList.map((content) => (
          <div
            key={content.id}
            onClick={() => this.handleContentSelection(content.id)}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{content.title}</h3>
                <p className="text-gray-600 mt-1">{content.content.substring(0, 150)}...</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>By {content.authorName}</span>
                  <span>•</span>
                  <span>{content.categoryName}</span>
                  <span>•</span>
                  <span>{content.publishedAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  content.status === 'published' ? 'bg-green-100 text-green-800' :
                  content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {content.status}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👁️ {content.viewCount}</span>
                  <span>❤️ {content.likeCount}</span>
                  <span>💬 {content.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render analytics
   */
  private renderAnalytics(): React.ReactNode {
    const { analytics } = this.state;

    if (!analytics) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No analytics data available</div>
          <div className="text-sm">Select a content item to view analytics</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-medium text-blue-800">Total Views</h4>
            <div className="text-2xl font-bold text-blue-600">{analytics.totalViews.toLocaleString()}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-medium text-green-800">Unique Views</h4>
            <div className="text-2xl font-bold text-green-600">{analytics.uniqueViews.toLocaleString()}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-medium text-purple-800">Engagement Rate</h4>
            <div className="text-2xl font-bold text-purple-600">{(analytics.engagementRate * 100).toFixed(1)}%</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-medium text-yellow-800">Avg Read Time</h4>
            <div className="text-2xl font-bold text-yellow-600">{analytics.averageReadTime.toFixed(0)}s</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-4 rounded">
            <h4 className="font-medium text-indigo-800">Shares</h4>
            <div className="text-2xl font-bold text-indigo-600">{analytics.shares.toLocaleString()}</div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded">
            <h4 className="font-medium text-pink-800">Likes</h4>
            <div className="text-2xl font-bold text-pink-600">{analytics.likes.toLocaleString()}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded">
            <h4 className="font-medium text-red-800">Comments</h4>
            <div className="text-2xl font-bold text-red-600">{analytics.comments.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-800">Bounce Rate</h4>
            <div className="text-2xl font-bold text-gray-600">{(analytics.bounceRate * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', activeTab, lastUpdate, isRealTimeEnabled } = this.state;

    return (
      <div className={`enterprise-content-example p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise Content Management
          </h1>
          <p className="text-gray-600">
            Advanced content management with real-time updates and analytics
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isRealTimeEnabled ? 'Real-time Active' : 'Real-time Paused'}
              </span>
              <span className="text-sm text-gray-600">
                Active Tab: {activeTab}
              </span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          {this.renderTabNavigation()}
        </div>

        {/* Content Based on Active Tab */}
        <div className="bg-white p-6 rounded-lg shadow">
          {activeTab === 'list' && this.renderContentList()}
          {activeTab === 'analytics' && this.renderAnalytics()}
          
          {activeTab === 'create' && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">Create Content</div>
              <div className="text-sm">Content creation interface would go here</div>
            </div>
          )}
          
          {activeTab === 'edit' && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">Edit Content</div>
              <div className="text-sm">Content editing interface would go here</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EnterpriseContentExample;
