/**
 * Post Domain Entities.
 * 
 * Core business entities and types for the Post sub-feature.
 * These entities represent the domain model and contain business logic.
 */

import type { ResId } from '@/shared/api/models/common';
import type {
    PostResponse,
    PollOption,
    ContentPrivacy,
    PollResponse
} from '../../../data/models/post';

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
        public readonly authorName: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly visibility: PostVisibility,
        public readonly engagement: PostEngagement,
        public readonly media?: string[],
        public readonly poll?: PollResponse,
        public readonly tags?: string[],
        public readonly contentType: ContentType = ContentType.TEXT
    ) { }

    /**
     * Check if post is visible to user
     */
    isVisibleToUser(userId: ResId): boolean {
        if (this.visibility.privacy === 'anyone') return true;
        if (this.visibility.privacy === 'friends') {
            return this.visibility.allowedUsers?.includes(userId) || this.authorId === userId;
        }
        return false;
    }

    /**
     * Check if user can edit this post
     */
    canUserEdit(userId: ResId): boolean {
        return this.authorId === userId;
    }

    /**
     * Check if user can delete this post
     */
    canUserDelete(userId: ResId): boolean {
        return this.authorId === userId;
    }

    /**
     * Get engagement rate
     */
    getEngagementRate(): number {
        const totalEngagement = this.engagement.likesCount +
            this.engagement.commentsCount +
            this.engagement.repostsCount +
            this.engagement.sharesCount;
        return totalEngagement;
    }

    /**
     * Check if post has media
     */
    hasMedia(): boolean {
        return this.media && this.media.length > 0;
    }

    /**
     * Check if post has poll
     */
    hasPoll(): boolean {
        return this.poll !== undefined;
    }

    /**
     * Get post age in days
     */
    getAgeInDays(): number {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Validate post content
     */
    validateContent(validation: PostContentValidation): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (this.content.length > validation.maxLength) {
            errors.push(`Content exceeds maximum length of ${validation.maxLength}`);
        }

        if (validation.hasMediaLimit && this.hasMedia() && this.media!.length > validation.maxMediaCount) {
            errors.push(`Media count exceeds maximum of ${validation.maxMediaCount}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

/**
 * Post factory for creating Post instances from API responses
 */
export class PostFactory {
    static fromApiResponse(response: PostResponse): Post {
        return new Post(
            response.id,
            response.content,
            response.authorId,
            response.authorName,
            new Date(response.createdAt),
            new Date(response.updatedAt),
            {
                privacy: response.privacy || 'anyone',
                allowedUsers: response.allowedUsers,
                isPinned: response.isPinned || false,
                isFeatured: response.isFeatured || false
            },
            {
                likesCount: response.likesCount || 0,
                commentsCount: response.commentsCount || 0,
                repostsCount: response.repostsCount || 0,
                sharesCount: response.sharesCount || 0,
                pollVotesCount: response.poll?.totalVotes || 0
            },
            response.media,
            response.poll,
            response.tags,
            response.contentType as ContentType
        );
    }

    static createNewPost(
        content: string,
        authorId: ResId,
        authorName: string,
        options: {
            visibility?: PostVisibility;
            media?: string[];
            poll?: PollResponse;
            tags?: string[];
            contentType?: ContentType;
        } = {}
    ): Post {
        const now = new Date();
        return new Post(
            0, // Temporary ID, will be set by server
            content,
            authorId,
            authorName,
            now,
            now,
            options.visibility || { privacy: 'anyone', isPinned: false, isFeatured: false },
            {
                likesCount: 0,
                commentsCount: 0,
                repostsCount: 0,
                sharesCount: 0
            },
            options.media,
            options.poll,
            options.tags,
            options.contentType || ContentType.TEXT
        );
    }
}

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
    VOTE = 'vote'
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
    LINK = 'link',
    MIXED = 'mixed'
}

/**
 * Post status
 */
export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    DELETED = 'deleted',
    HIDDEN = 'hidden'
}

/**
 * Post query options
 */
export interface PostQuery {
    page?: number;
    limit?: number;
    userId?: ResId;
    tags?: string[];
    contentType?: ContentType;
    status?: PostStatus;
    sortBy?: 'createdAt' | 'updatedAt' | 'likesCount' | 'commentsCount';
    sortDirection?: 'asc' | 'desc';
    search?: string;
}

/**
 * Post creation request
 */
export interface PostCreateRequest {
    content: string;
    visibility: PostVisibility;
    media?: string[];
    poll?: {
        question: string;
        options: PollOption[];
        multipleChoice: boolean;
        expiresAt?: Date;
    };
    tags?: string[];
    contentType: ContentType;
}

/**
 * Post update request
 */
export interface PostUpdateRequest {
    content?: string;
    visibility?: PostVisibility;
    tags?: string[];
    status?: PostStatus;
}

/**
 * Post interaction request
 */
export interface PostInteractionRequest {
    type: PostInteractionType;
    data?: any;
}

// Re-export commonly used types
export type { ResId };
export { ContentPrivacy, PollOption, PollResponse, PostResponse };
