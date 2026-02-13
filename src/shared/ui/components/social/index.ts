/**
 * Social Components Index
 * 
 * Exports all social-related UI components from the shared UI library.
 * These components provide reusable social media patterns with enterprise patterns.
 */

// Social components
export { default as PostCard } from './PostCard';
export { default as MessageCard } from './MessageCard';
export { default as CommentCard } from './CommentCard';

// Component types
export type { IPostCardProps } from './PostCard';
export type { IMessageCardProps } from './MessageCard';
export type { ICommentCardProps } from './CommentCard';

// Styles
export * from './PostCard.styles';
export * from './MessageCard.styles';
export * from './CommentCard.styles';
