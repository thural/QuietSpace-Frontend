/**
 * Comment Domain Entities.
 * 
 * Core business entities and types for the Comment sub-feature.
 * These entities represent the domain model and contain business logic.
 */

import type { ResId } from '@/shared/api/models/common';
import type {
    CommentResponse,
    CommentRequest
} from '../../../data/models/comment';

/**
 * Comment engagement metrics
 */
export interface CommentEngagement {
    likesCount: number;
    repliesCount: number;
}

/**
 * Comment visibility settings
 */
export interface CommentVisibility {
    isDeleted: boolean;
    isHidden: boolean;
    isEdited: boolean;
}

/**
 * Enhanced Comment entity with business logic
 */
export class Comment {
    constructor(
        public readonly id: ResId,
        public readonly content: string,
        public readonly authorId: ResId,
        public readonly authorName: string,
        public readonly postId: ResId,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly visibility: CommentVisibility,
        public readonly engagement: CommentEngagement,
        public readonly parentId?: ResId,
        public readonly mentions?: string[]
    ) {}

    /**
     * Check if user can edit this comment
     */
    canUserEdit(userId: ResId): boolean {
        return this.authorId === userId && !this.visibility.isDeleted;
    }

    /**
     * Check if user can delete this comment
     */
    canUserDelete(userId: ResId): boolean {
        return this.authorId === userId && !this.visibility.isDeleted;
    }

    /**
     * Check if comment is visible
     */
    isVisible(): boolean {
        return !this.visibility.isDeleted && !this.visibility.isHidden;
    }

    /**
     * Get engagement summary
     */
    getEngagementSummary(): string {
        return `${this.engagement.likesCount} likes, ${this.engagement.repliesCount} replies`;
    }
}

/**
 * Comment Query for filtering and pagination
 */
export interface CommentQuery {
    postId?: ResId;
    authorId?: ResId;
    parentId?: ResId;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'likesCount';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Comment Update payload
 */
export interface CommentUpdate {
    content?: string;
    visibility?: Partial<CommentVisibility>;
}

/**
 * Comment Factory for creating Comment instances
 */
export class CommentFactory {
    static fromResponse(response: CommentResponse): Comment {
        return new Comment(
            response.id,
            response.content,
            response.authorId,
            response.authorName,
            response.postId,
            new Date(response.createdAt),
            new Date(response.updatedAt || response.createdAt),
            {
                isDeleted: false,
                isHidden: false,
                isEdited: response.updatedAt !== undefined
            },
            {
                likesCount: 0,
                repliesCount: 0
            }
        );
    }

    static create(request: CommentRequest, authorName: string): Comment {
        const now = new Date();
        return new Comment(
            `temp-${Date.now()}`, // Temporary ID until server response
            request.content,
            request.authorId,
            authorName,
            request.postId,
            now,
            now,
            {
                isDeleted: false,
                isHidden: false,
                isEdited: false
            },
            {
                likesCount: 0,
                repliesCount: 0
            }
        );
    }
}

// Re-export types for convenience
export type { CommentRequest, CommentResponse };
