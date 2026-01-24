import { Injectable, Inject } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { ContentDataService } from '@features/content/data/services/ContentDataService';
import { 
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
 * Content Feature Service
 * 
 * Provides business logic and validation for content operations
 * Implements enterprise-grade validation with content management features
 */
@Injectable()
export class ContentFeatureService {
  constructor(
    @Inject(TYPES.CONTENT_DATA_SERVICE) private dataService: ContentDataService
  ) {}

  // Content Validation Business Logic
  async validateContentCreation(contentData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Title validation
    if (!contentData.title || contentData.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (contentData.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    // Content validation
    if (!contentData.content || contentData.content.trim().length === 0) {
      errors.push('Content is required');
    } else if (contentData.content.length < 50) {
      errors.push('Content must be at least 50 characters');
    } else if (contentData.content.length > 50000) {
      errors.push('Content must be less than 50,000 characters');
    }

    // Author validation
    if (!contentData.authorId) {
      errors.push('Author ID is required');
    }

    // Content type validation
    if (!contentData.contentType) {
      errors.push('Content type is required');
    }

    // Category validation
    if (!contentData.category) {
      errors.push('Category is required');
    }

    // Tags validation
    if (contentData.tags && contentData.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    // SEO validation
    if (contentData.seo) {
      if (contentData.seo.description && contentData.seo.description.length > 300) {
        errors.push('SEO description must be less than 300 characters');
      }
      
      if (contentData.seo.keywords && contentData.seo.keywords.length > 20) {
        errors.push('Maximum 20 SEO keywords allowed');
      }
    }

    // Media validation
    if (contentData.hasMedia && !contentData.mediaFiles) {
      errors.push('Media files are marked as present but not provided');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async createContentWithValidation(
    contentData: Omit<ContentEntity, 'id' | 'createdAt' | 'updatedAt' | 'version'>, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: ContentEntity; errors?: string[] }> {
    // Validate content data first
    const validation = await this.validateContentCreation(contentData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const data = await this.dataService.createContent(contentData, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to create content']
      };
    }
  }

  async validateContentUpdate(contentData: Partial<ContentEntity>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Title validation
    if (contentData.title !== undefined) {
      if (!contentData.title || contentData.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      } else if (contentData.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    // Content validation
    if (contentData.content !== undefined) {
      if (!contentData.content || contentData.content.trim().length === 0) {
        errors.push('Content cannot be empty');
      } else if (contentData.content.length < 50) {
        errors.push('Content must be at least 50 characters');
      } else if (contentData.content.length > 50000) {
        errors.push('Content must be less than 50,000 characters');
      }
    }

    // Status validation
    if (contentData.status !== undefined) {
      const validStatuses = ['draft', 'published', 'archived', 'deleted'];
      if (!validStatuses.includes(contentData.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Tags validation
    if (contentData.tags !== undefined && contentData.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async updateContentWithValidation(
    contentId: string, 
    updates: Partial<ContentEntity>, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: ContentEntity; errors?: string[] }> {
    const validation = await this.validateContentUpdate(updates);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      const data = await this.dataService.updateContent(contentId, updates, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to update content']
      };
    }
  }

  // Content Publishing Business Logic
  async validateContentPublishing(contentId: string, token: JwtToken): Promise<{ canPublish: boolean; reason?: string }> {
    try {
      const content = await this.dataService.getContent(contentId, token);
      
      if (!content) {
        return { canPublish: false, reason: 'Content not found' };
      }

      // Check if content is already published
      if (content.status === 'published') {
        return { canPublish: false, reason: 'Content is already published' };
      }

      // Check if content has required fields
      if (!content.title || content.title.trim().length === 0) {
        return { canPublish: false, reason: 'Title is required for publishing' };
      }

      if (!content.content || content.content.trim().length === 0) {
        return { canPublish: false, reason: 'Content is required for publishing' };
      }

      // Check moderation status
      const moderation = await this.dataService.getContentModeration(contentId, token);
      if (moderation && moderation.status === 'flagged') {
        return { canPublish: false, reason: 'Content is flagged for moderation' };
      }

      // Check scheduled publishing
      if (content.publishDate && content.publishDate > new Date()) {
        return { canPublish: false, reason: 'Content is scheduled for future publishing' };
      }

      return { canPublish: true };
    } catch (error) {
      return { canPublish: false, reason: 'Unable to validate content for publishing' };
    }
  }

  async publishContent(contentId: string, token: JwtToken): Promise<{ success: boolean; message?: string }> {
    const validation = await this.validateContentPublishing(contentId, token);
    
    if (!validation.canPublish) {
      return {
        success: false,
        message: validation.reason
      };
    }

    try {
      await this.dataService.updateContent(contentId, {
        status: 'published',
        publishedAt: new Date()
      }, token);
      
      return {
        success: true,
        message: 'Content published successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to publish content'
      };
    }
  }

  async scheduleContent(contentId: string, publishDate: Date, token: JwtToken): Promise<{ success: boolean; message?: string }> {
    try {
      const content = await this.dataService.getContent(contentId, token);
      
      if (!content) {
        return {
          success: false,
          message: 'Content not found'
        };
      }

      const result = await this.dataService.scheduleContent(contentId, publishDate, token);
      
      return {
        success: true,
        message: `Content scheduled for ${publishDate.toLocaleString()}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to schedule content'
      };
    }
  }

  // Media Management Business Logic
  async validateMediaUpload(contentId: string, file: File, token: JwtToken): Promise<{ canUpload: boolean; reason?: string; allowedTypes?: string[] }> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'application/pdf'];
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return { canUpload: false, reason: 'File size exceeds 50MB limit' };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { 
        canUpload: false, 
        reason: `File type ${file.type} is not allowed`,
        allowedTypes
      };
    }

    // Check content exists
    const content = await this.dataService.getContent(contentId, token);
    if (!content) {
      return { canUpload: false, reason: 'Content not found' };
    }

    // Check if content allows media
    if (!content.hasMedia) {
      return { canUpload: false, reason: 'Content does not support media' };
    }

    return { canUpload: true };
  }

  async uploadMediaWithValidation(contentId: string, file: File, token: JwtToken): Promise<{ success: boolean; data?: MediaFile; errors?: string[] }> {
    const validation = await this.validateMediaUpload(contentId, file, token);
    
    if (!validation.canUpload) {
      return {
        success: false,
        errors: [validation.reason || 'Media upload validation failed']
      };
    }

    try {
      const data = await this.dataService.uploadMedia(contentId, file, token);
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to upload media']
      };
    }
  }

  // Content Moderation Business Logic
  async validateModerationAction(contentId: string, action: 'approve' | 'reject' | 'flag', reason?: string, token: JwtToken): Promise<{ canModerate: boolean; reason?: string }> {
    try {
      const content = await this.dataService.getContent(contentId, token);
      const moderation = await this.dataService.getContentModeration(contentId, token);
      
      if (!content) {
        return { canModerate: false, reason: 'Content not found' };
      }

      // Check current moderation status
      if (moderation.status === 'approved' && action === 'approve') {
        return { canModerate: false, reason: 'Content is already approved' };
      }

      if (moderation.status === 'rejected' && action === 'reject') {
        return { canModerate: false, reason: 'Content is already rejected' };
      }

      if (moderation.status === 'flagged' && action === 'flag') {
        return { canModerate: false, reason: 'Content is already flagged' };
      }

      // Check if reason is provided for reject/flag actions
      if ((action === 'reject' || action === 'flag') && !reason) {
        return { canModerate: false, reason: 'Reason is required for this moderation action' };
      }

      return { canModerate: true };
    } catch (error) {
      return { canModerate: false, reason: 'Unable to validate moderation action' };
    }
  }

  async moderateContentWithValidation(
    contentId: string, 
    action: 'approve' | 'reject' | 'flag', 
    reason: string, 
    token: JwtToken
  ): Promise<{ success: boolean; data?: ModerationData; message?: string }> {
    const validation = await this.validateModerationAction(contentId, action, reason, token);
    
    if (!validation.canModerate) {
      return {
        success: false,
        message: validation.reason
      };
    }

    try {
      const moderationData = {
        status: action,
        moderatedBy: 'current_user', // Would get from auth context
        moderatedAt: new Date(),
        reason: reason
      };

      const data = await this.dataService.moderateContent(contentId, moderationData, token);
      
      return {
        success: true,
        data,
        message: `Content ${action} successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to ${action} content`
      };
    }
  }

  // Content Analytics Business Logic
  async calculateEngagementScore(contentId: string, token: JwtToken): Promise<{
    score: number;
    factors: {
      views: number;
      likes: number;
      shares: number;
      comments: number;
      readTime: number;
      bounceRate: number;
    };
  }> {
    try {
      const analytics = await this.dataService.getContentAnalytics(contentId, token);
      
      if (!analytics) {
        return {
          score: 0,
          factors: {
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0,
            readTime: 0,
            bounceRate: 0
          }
        };
      }

      // Calculate engagement score based on multiple factors
      const viewsWeight = 0.1;
      const likesWeight = 0.3;
      const sharesWeight = 0.4;
      const commentsWeight = 0.2;
      
      const score = Math.min(100, (
        analytics.views * viewsWeight +
        analytics.likes * likesWeight +
        analytics.shares * sharesWeight +
        analytics.comments * commentsWeight
      )) / Math.max(1, analytics.views || 1);

      return {
        score: Math.round(score),
        factors: {
          views: analytics.views || 0,
          likes: analytics.likes || 0,
          shares: analytics.shares || 0,
          comments: analytics.comments || 0,
          readTime: analytics.averageReadTime || 0,
          bounceRate: analytics.bounceRate || 0
        }
      };
    } catch (error) {
      return {
        score: 0,
        factors: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          readTime: 0,
          bounceRate: 0
        }
      };
    }
  }

  async generateContentInsights(contentId: string, token: JwtToken): Promise<{
    performance: {
      engagementRate: number;
      averageReadTime: number;
      bounceRate: number;
      peakEngagementTime: string;
    };
    audience: {
      demographics: any;
      interests: string[];
      behavior: {
        mostEngagingTime: string;
        peakDay: string;
        deviceBreakdown: any;
      };
    };
    recommendations: string[];
  }> {
    try {
      const analytics = await this.dataService.getContentAnalytics(contentId, token);
      const content = await this.dataService.getContent(contentId, token);
      
      if (!analytics || !content) {
        return {
          performance: {
            engagementRate: 0,
            averageReadTime: 0,
            bounceRate: 0,
            peakEngagementTime: 'N/A'
          },
          audience: {
            demographics: {},
            interests: [],
            behavior: {
              mostEngagingTime: 'N/A',
              peakDay: 'N/A',
              deviceBreakdown: {}
            }
          },
          recommendations: []
        };
      }

      // Calculate performance metrics
      const engagementRate = analytics.engagementRate || 0;
      const averageReadTime = analytics.averageReadTime || 0;
      const bounceRate = analytics.bounceRate || 0;

      // Generate recommendations based on performance
      const recommendations: string[] = [];
      
      if (engagementRate < 0.1) {
        recommendations.push('Consider adding more engaging elements like images or videos');
      }
      
      if (averageReadTime < 60) {
        recommendations.push('Content may be too short, consider adding more depth');
      }
      
      if (bounceRate > 0.8) {
        recommendations.push('High bounce rate suggests content may not match audience expectations');
      }

      return {
        performance: {
          engagementRate,
          averageReadTime,
          bounceRate,
          peakEngagementTime: analytics.peakEngagementTime || 'N/A'
        },
        audience: {
          demographics: analytics.audienceDemographics || {},
          interests: content.tags || [],
          behavior: {
            mostEngagingTime: analytics.mostEngagingTime || 'N/A',
            peakDay: analytics.peakDay || 'N/A',
            deviceBreakdown: analytics.deviceBreakdown || {}
          }
        },
        recommendations
      };
    } catch (error) {
      return {
        performance: {
          engagementRate: 0,
          averageReadTime: 0,
          bounceRate: 0,
          peakEngagementTime: 'N/A'
        },
        audience: {
          demographics: {},
          interests: [],
          behavior: {
            mostEngagingTime: 'N/A',
            peakDay: 'N/A',
            deviceBreakdown: {}
          }
        },
        recommendations: ['Unable to generate insights']
      };
    }
  }

  // Content Search Business Logic
  async enhanceSearchQuery(query: string, token: JwtToken): Promise<{
    enhancedQuery: string;
    suggestions: string[];
    filters: {
      contentType: string[];
      category: string[];
      dateRange: string[];
      author: string[];
    };
  }> {
    try {
      // Get search suggestions
      const suggestions = await this.dataService.getContentSuggestions(query, token);
      
      // Generate enhanced query with additional terms
      const enhancedQuery = `${query} ${suggestions.slice(0, 3).join(' ')}`.trim();
      
      // Generate filters based on common content patterns
      const filters = {
        contentType: ['article', 'video', 'image', 'audio', 'document'],
        category: ['technology', 'business', 'lifestyle', 'entertainment', 'education'],
        dateRange: ['today', 'week', 'month', 'year'],
        author: [] // Would fetch from user data
      };

      return {
        enhancedQuery,
        suggestions,
        filters
      };
    } catch (error) {
      return {
        enhancedQuery: query,
        suggestions: [],
        filters: {
          contentType: [],
          category: [],
          dateRange: [],
          author: []
        }
      };
    }
  }

  // Content Health Check
  async getContentHealthCheck(contentId: string, token: JwtToken): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    issues: Array<{
      type: 'content' | 'seo' | 'media' | 'moderation' | 'analytics';
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation: string;
    }>;
  }> {
    const issues: Array<{
      type: 'content' | 'seo' | 'media' | 'moderation' | 'analytics';
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation: string;
    }> = [];

    try {
      const content = await this.dataService.getContent(contentId, token);
      const analytics = await this.dataService.getContentAnalytics(contentId, token);
      const moderation = await this.dataService.getContentModeration(contentId, token);

      // Check content quality
      if (content.content && content.content.length < 100) {
        issues.push({
          type: 'content',
          severity: 'medium',
          message: 'Content is too short',
          recommendation: 'Add more substantial content to improve engagement'
        });
      }

      if (!content.title || content.title.length < 10) {
        issues.push({
          type: 'content',
          severity: 'high',
          message: 'Title is too short or missing',
          recommendation: 'Add a descriptive title for better SEO'
        });
      }

      // Check SEO optimization
      if (!content.seo || !content.seo.description) {
        issues.push({
          type: 'seo',
          severity: 'medium',
          message: 'SEO description is missing',
          recommendation: 'Add SEO description to improve search visibility'
        });
      }

      if (content.seo && content.seo.keywords && content.seo.keywords.length < 3) {
        issues.push({
          type: 'seo',
          severity: 'low',
          message: 'Limited SEO keywords',
          recommendation: 'Add more relevant keywords for better search ranking'
        });
      }

      // Check media optimization
      if (content.hasMedia && (!content.mediaFiles || content.mediaFiles.length === 0)) {
        issues.push({
          type: 'media',
          severity: 'medium',
          message: 'Media marked as present but no files found',
          recommendation: 'Upload media files or disable media flag'
        });
      }

      // Check moderation status
      if (moderation && moderation.status === 'flagged') {
        issues.push({
          type: 'moderation',
          severity: 'high',
          message: 'Content is flagged for moderation',
          recommendation: 'Review and address moderation issues'
        });
      }

      // Check analytics performance
      if (analytics && analytics.engagementRate < 0.05) {
        issues.push({
          type: 'analytics',
          severity: 'medium',
          message: 'Low engagement rate',
          recommendation: 'Improve content quality and add engaging elements'
        });
      }

      const overall = issues.length === 0 ? 'healthy' : 
                     issues.some(i => i.severity === 'high') ? 'critical' : 'warning';

      return {
        overall,
        issues
      };
    } catch (error) {
      return {
        overall: 'critical',
        issues: [{
          type: 'content',
          severity: 'high',
          message: 'Unable to perform health check',
          recommendation: 'Please try again later'
        }]
      };
    }
  }
}
