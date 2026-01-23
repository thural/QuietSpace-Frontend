import {PostRepository} from '@feed/data/repositories/PostRepository';
import {CommentRepository} from '../data/repositories/CommentRepository';
import {PostPage, PostRequest, PostResponse, RepostRequest} from '../data/models/post';
import {ReactionRequest} from '../data/models/reaction';
import {ResId} from '@/shared/api/models/common';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';

/**
 * Enhanced Post Service - Provides high-level post operations
 * Wraps repository calls with business logic and coordination
 */
@Injectable()
export class PostService {
    constructor(
        @Inject(TYPES.POST_REPOSITORY) private postRepository: PostRepository,
        @Inject(TYPES.COMMENT_REPOSITORY) private commentRepository: CommentRepository
    ) {}

    async getFeedPosts(pageParams?: string): Promise<PostPage> {
        return await this.postRepository.getPosts(pageParams);
    }

    async createPostWithComments(postData: PostRequest): Promise<PostResponse> {
        const post = await this.postRepository.createPost(postData);
        
        // Business logic: could trigger notifications, update cache, etc.
        console.log(`Post created: ${post.id}`);
        
        return post;
    }

    async deletePostWithComments(postId: ResId): Promise<Response> {
        // In a real implementation, this might cascade delete comments
        const [postResponse] = await Promise.all([
            this.postRepository.deletePost(postId)
            // Could also delete related comments here
        ]);

        return postResponse;
    }

    async interactWithPost(postId: ResId, interaction: {
        type: 'like' | 'comment' | 'share' | 'repost';
        data?: any;
    }): Promise<any> {
        switch (interaction.type) {
            case 'like':
                return await this.postRepository.reaction({
                    postId,
                    reactionType: interaction.data?.reactionType || 'LIKE'
                } as ReactionRequest);
            
            case 'repost':
                return await this.postRepository.createRepost({
                    originalPostId: postId,
                    ...interaction.data
                } as RepostRequest);
            
            case 'comment':
                return await this.commentRepository.createComment({
                    postId,
                    text: interaction.data?.content || ''
                });
            
            default:
                throw new Error(`Unsupported interaction type: ${interaction.type}`);
        }
    }

    async savePostForLater(postId: ResId): Promise<Response> {
        return await this.postRepository.savePost(postId);
    }

    // Business logic methods
    async isPostOwnedByUser(postId: ResId, userId: ResId): Promise<boolean> {
        try {
            const post = await this.postRepository.getPostById(postId);
            return post.userId === userId;
        } catch {
            return false;
        }
    }

    async getPostEngagementStats(): Promise<{
        likes: number;
        comments: number;
        shares: number;
        reposts: number;
    }> {
        // Business logic: Calculate engagement metrics
        // TODO: Use postId parameter to fetch actual engagement data from API
        // This would typically come from the API or be calculated
        return {
            likes: 0,
            comments: 0,
            shares: 0,
            reposts: 0
        };
    }
}
