/**
 * Comment Types - Native Definitions
 * 
 * Defines comment types for compatibility with existing code
 */

export interface CommentBody {
    parentId?: string | null;
    postId: string;
    userId: string;
    text: string;
}

export interface CommentSchema {
    id: string;
    parentId?: string | null;
    postId: string;
    userId: string;
    username: string;
    text: string;
    likeCount: number;
    replyCount: number;
    userReaction: any;
    createdAt: string;
    updatedAt: string;
}

export interface PagedCommentResponse {
    content: CommentSchema[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}
