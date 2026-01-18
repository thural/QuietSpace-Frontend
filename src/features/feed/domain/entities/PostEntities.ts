/**
 * Post Domain Entities.
 * 
 * Core business entities and types for the Feed feature.
 * These entities represent the domain model and contain business logic.
 */

import type { ResId } from '@api/schemas/inferred/common';
import type { 
    PostResponse, 
    PollOption, 
    ContentPrivacy,
    PollResponse
} from '@api/schemas/inferred/post';

/**
 * Post engagement metrics
 */
export interface PostEngagement {
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    sharesCount: number;
    pollVotesCount?: number;
}

/**
 * Post content validation rules
 */
export interface PostContentValidation {
    maxLength: number;
    allowedFormats: string[];
    hasMediaLimit: boolean;
    maxMediaCount: number;
}

/**
 * Post visibility settings
 */
export interface PostVisibility {
    privacy: ContentPrivacy;
    allowedUsers?: ResId[];
    isPinned: boolean;
    isFeatured: boolean;
}

/**
 * Enhanced Post entity with business logic
 */
export class Post {
    constructor(
        public readonly id: ResId,
        public readonly content: string,
        public readonly authorId: ResId,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly visibility: PostVisibility,
        public readonly engagement: PostEngagement,
        public readonly poll?: PollResponse,
        public readonly media?: string[],
        public readonly tags?: string[]
    ) {}

    // Getter methods
    getId(): ResId {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    getAuthorId(): ResId {
        return this.authorId;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getEngagement(): PostEngagement {
        return this.engagement;
    }

    getPoll(): PollResponse | undefined {
        return this.poll;
    }

    getMedia(): string[] | undefined {
        return this.media;
    }

    getTags(): string[] | undefined {
        return this.tags;
    }

    getVisibility(): PostVisibility {
        return this.visibility;
    }

    /**
     * Calculate engagement score based on various metrics
     */
    calculateEngagementScore(): number {
        return this.engagement.likesCount + 
               (this.engagement.commentsCount * 2) + 
               (this.engagement.repostsCount * 3) + 
               (this.engagement.sharesCount * 1.5) +
               (this.engagement.pollVotesCount || 0);
    }

    /**
     * Validate post content
     */
    validateContent(content: string): boolean {
        return content.length >= POST_VALIDATION.MIN_LENGTH && content.length <= POST_VALIDATION.MAX_LENGTH;
    }

    /**
     * Check if post is pinned
     */
    isPinned(): boolean {
        return this.visibility.isPinned;
    }

    /**
     * Check if post is featured
     */
    isFeatured(): boolean {
        return this.visibility.isFeatured;
    }

    /**
     * Update post content (modifies and returns same instance)
     */
    updateContent(newContent: string): Post {
        (this as any).content = newContent;
        (this as any).updatedAt = new Date();
        return this;
    }

    /**
     * Toggle pin status (modifies and returns same instance)
     */
    togglePin(): Post {
        (this as any).visibility = {
            ...this.visibility,
            isPinned: !this.visibility.isPinned
        };
        return this;
    }

    /**
     * Check if post has poll (alias for isPoll)
     */
    hasPoll(): boolean {
        return this.isPoll();
    }

    /**
     * Check if post is currently trending
     */
    isTrending(): boolean {
        return this.engagement.likesCount > 100 || 
               this.engagement.commentsCount > 50 ||
               this.engagement.sharesCount > 25;
    }

    /**
     * Check if post is editable by user
     */
    isEditableBy(userId: ResId): boolean {
        return this.authorId === userId;
    }

    /**
     * Check if post has media content
     */
    hasMedia(): boolean {
        return this.media && this.media.length > 0;
    }

    /**
     * Check if post is a poll
     */
    isPoll(): boolean {
        return this.poll !== undefined;
    }

    /**
     * Get engagement rate (engagement per hour since creation)
     */
    getEngagementRate(): number {
        const hoursSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);
        const totalEngagement = this.engagement.likesCount + 
                             this.engagement.commentsCount + 
                             this.engagement.repostsCount + 
                             this.engagement.sharesCount;
        return hoursSinceCreation > 0 ? totalEngagement / hoursSinceCreation : totalEngagement;
    }

    /**
     * Validate post content against business rules
     */
    static validateContent(content: string, validation: PostContentValidation): boolean {
        if (content.length > validation.maxLength) return false;
        if (validation.hasMediaLimit && content.includes('media') && 
            (content.match(/media/g) || []).length > validation.maxMediaCount) {
            return false;
        }
        return true;
    }
}

/**
 * Post factory for creating Post instances from API responses
 */
export class PostFactory {
    static fromApiResponse(response: PostResponse): Post {
        return new Post(
            response.id,
            response.text,
            response.userId,
            new Date(response.createDate || ''),
            new Date(response.updateDate || ''),
            {
                privacy: 'anyone', // Default since viewAccess not in API
                allowedUsers: undefined, // Not in current API response
                isPinned: false, // Not in current API response
                isFeatured: false // Not in current API response
            },
            {
                likesCount: response.likeCount || 0,
                commentsCount: response.commentCount || 0,
                repostsCount: 0, // Not in current API response
                sharesCount: 0, // Not in current API response
                pollVotesCount: response.poll?.voteCount || 0
            },
            response.poll,
            response.photo ? [response.photo.data] : undefined,
            undefined // Tags not in current API response
        );
    }
}

/**
 * Post content validation rules
 */
export const POST_VALIDATION = {
    maxLength: 2000,
    allowedFormats: ['text', 'markdown', 'html'],
    hasMediaLimit: true,
    maxMediaCount: 10,
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
    MIN_TITLE_LENGTH: 1,
    MAX_TITLE_LENGTH: 200,
    ALLOWED_TAGS: ['general', 'tech', 'lifestyle']
};

/**
 * Post interaction types
 */
export enum PostInteractionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    COMMENT = 'comment',
    REPOST = 'repost',
    SHARE = 'share',
    SAVE = 'save',
    POLL_VOTE = 'poll_vote'
}

/**
 * Post status types
 */
export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    DELETED = 'deleted'
}

/**
 * Post sort options
 */
export enum PostSortOption {
    LATEST = 'createdAt',
    POPULAR = 'likesCount',
    TRENDING = 'engagementRate',
    DISCUSSED = 'commentsCount'
}

/**
 * Vote types
 */
export enum VoteType {
    UP = 'up',
    DOWN = 'down'
}

/**
 * Content types
 */
export enum ContentType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    POLL = 'poll',
    LINK = 'link'
}
