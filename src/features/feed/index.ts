/**
 * Feed Feature Main Barrel Export
 * 
 * Exports working feed functionality
 */

// ===== NEW FEED COMPONENT =====
export { default as NewFeed } from './presentation/components/NewFeed';

// ===== INTEGRATION NOTES =====
/*
 * Post and Comment features are now separate features.
 * Import them directly when needed:
 * 
 * import { PostCard, PostResponse } from '@/features/post';
 * import { Comment, CommentResponse } from '@/features/comment';
 * 
 * NewFeed demonstrates how to use both features together.
 * 
 * Legacy feed functionality is being refactored.
 */
