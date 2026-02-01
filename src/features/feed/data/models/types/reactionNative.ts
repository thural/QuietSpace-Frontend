/**
 * Reaction Types - Native Definitions
 * 
 * Defines reaction types for compatibility with existing code
 */

export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    LOVE = 'love',
    LAUGH = 'laugh',
    ANGRY = 'angry',
    SAD = 'sad',
    WOW = 'wow'
}

export interface UserReaction {
    userId: string;
    contentId: string;
    reactionType: ReactionType;
    contentType: string;
    username?: string;
    createdAt?: string;
    updatedAt?: string;
}
