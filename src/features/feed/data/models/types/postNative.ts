/**
 * Post Types - Native Definitions
 * 
 * Defines post types for compatibility with existing code
 */

export interface VoteBody {
    userId: string;
    postId: string;
    option: string;
}

export interface PollOptionSchema {
    label: string;
    voteShare: string;
}

export interface PollSchema {
    votedOption?: string;
    voteCount?: number;
    options?: PollOptionSchema[];
    dueDate?: string | null;
}

export interface PostSchema {
    id: string;
    userId: string;
    username: string;
    title: string;
    text: string;
    photo?: any;
    poll?: PollSchema;
    repost?: any;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    userReaction: any;
    createdAt: string;
    updatedAt: string;
}
