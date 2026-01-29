/**
 * Mock Post Repository Implementation.
 * 
 * Mock implementation of IPostRepository for testing and UI development.
 * Uses in-memory data storage and simulates API responses with realistic delays.
 */

import type { ResId } from '@/shared/api/models/common';
import type { PostPage, PostRequest, PostResponse, RepostRequest, VoteBody, PollRequest } from '../models/post';
import type { IPostRepository, PostQuery } from '../../domain/repositories/IPostRepository';
import type { ReactionRequest } from '@/features/feed/data/models/reaction';
import { PostFactory } from '../../domain/entities/PostEntities';
import { ReactionType } from '@/features/feed/data/models/types/reactionNative';

// Define ContentType enum locally since it's not available in the expected location
enum ContentType {
    POST = 'POST',
    COMMENT = 'COMMENT'
}

/**
 * Mock post data for testing
 */
const MOCK_POSTS: PostResponse[] = [
    {
        id: '1',
        userId: 'user-1',
        username: 'john_doe',
        title: 'Welcome to QuietSpace',
        text: 'This is my first post on this amazing platform! Excited to be here and connect with everyone.',
        createDate: '2024-01-15T10:00:00Z',
        updateDate: '2024-01-15T10:00:00Z',
        likeCount: 15,
        dislikeCount: 1,
        commentCount: 8,
        poll: null,
        repost: null,
        photo: {
            type: 'image',
            id: 'photo-1',
            version: 1,
            createDate: '2024-01-15T09:30:00Z',
            updateDate: '2024-01-15T09:30:00Z',
            name: 'welcome.jpg',
            data: 'https://example.com/photo1.jpg'
        },
        userReaction: { reactionType: ReactionType.LIKE, userId: 'user-1', contentId: '1', contentType: ContentType.POST }
    },
    {
        id: '2',
        userId: 'user-2',
        username: 'jane_smith',
        title: 'Beautiful sunset today',
        text: 'Had to share this amazing sunset I captured during my evening walk. Nature never disappoints!',
        createDate: '2024-01-14T18:30:00Z',
        updateDate: '2024-01-14T18:30:00Z',
        likeCount: 42,
        dislikeCount: 0,
        commentCount: 12,
        poll: {
            votedOption: 'Option A',
            voteCount: 25,
            options: [
                { label: 'Option A', voteShare: '60%' },
                { label: 'Option B', voteShare: '40%' }
            ],
            dueDate: '2024-01-21T18:30:00Z'
        },
        repost: null,
        photo: null,
        userReaction: null
    },
    {
        id: '3',
        userId: 'user-3',
        username: 'tech_guru',
        title: 'React 19 Released!',
        text: 'Just heard that React 19 has been released with some amazing new features. Can\'t wait to try them out in my projects!',
        createDate: '2024-01-13T14:20:00Z',
        updateDate: '2024-01-13T14:20:00Z',
        likeCount: 89,
        dislikeCount: 2,
        commentCount: 34,
        poll: null,
        repost: {
            id: 'repost-1',
            text: '3',
            userId: 'user-4',
            parentId: '3',
            username: 'developer123',
            isRepost: true
        },
        photo: null,
        userReaction: { reactionType: ReactionType.LIKE, userId: 'user-1', contentId: '3', contentType: ContentType.POST }
    }
];

/**
 * Mock implementation of post repository
 */
export class MockPostRepository implements IPostRepository {
    private readonly posts: PostResponse[];
    private readonly delay: number;

    constructor(delay: number = 100) {
        this.posts = [...MOCK_POSTS];
        this.delay = delay;
    }

    // Simulate network delay
    private async simulateNetworkCall<T>(result: T): Promise<T> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(result), this.delay);
        });
    }

    // Query operations
    async getPosts(query: PostQuery): Promise<PostPage> {
        let filteredPosts = [...this.posts];

        // Apply filters
        if (query.contentPrivacy) {
            // Mock filtering based on privacy
            filteredPosts = filteredPosts.filter(post =>
                Math.random() > 0.3 || post.userId === 'user-1' // Some posts are private
            );
        }

        // Apply sorting
        if (query.sortBy) {
            filteredPosts.sort((a, b) => {
                const aValue = a[query.sortBy as keyof PostResponse] as number;
                const bValue = b[query.sortBy as keyof PostResponse] as number;
                return query.sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
            });
        }

        // Apply pagination
        const pageSize = query.size || 10;
        const page = query.page || 0;
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        return this.simulateNetworkCall({
            content: paginatedPosts,
            totalElements: filteredPosts.length,
            numberOfElements: paginatedPosts.length,
            last: endIndex >= filteredPosts.length,
            first: page === 0,
            totalPages: Math.ceil(filteredPosts.length / pageSize),
            size: pageSize,
            number: page,
            sort: { sorted: true, unsorted: false, empty: false },
            pageable: {
                pageNumber: page,
                pageSize,
                sort: { sorted: true, unsorted: false, empty: false },
                offset: startIndex,
                paged: true,
                unpaged: false
            },
            empty: paginatedPosts.length === 0
        });
    }

    async getPostById(postId: ResId): Promise<PostResponse> {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return this.simulateNetworkCall(post);
    }

    async getPostsByUserId(userId: ResId, query: PostQuery): Promise<PostPage> {
        const userPosts = this.posts.filter(post => post.userId === userId);
        return this.simulateNetworkCall({
            content: userPosts,
            totalElements: userPosts.length,
            numberOfElements: userPosts.length,
            last: true,
            first: true,
            totalPages: 1,
            size: userPosts.length,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            pageable: {
                pageNumber: 0,
                pageSize: userPosts.length,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            empty: userPosts.length === 0
        });
    }

    async getSavedPosts(query: PostQuery): Promise<PostPage> {
        // Mock saved posts (first 2 posts)
        const savedPosts = this.posts.slice(0, 2);
        return this.simulateNetworkCall({
            content: savedPosts,
            totalElements: savedPosts.length,
            numberOfElements: savedPosts.length,
            last: true,
            first: true,
            totalPages: 1,
            size: savedPosts.length,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            pageable: {
                pageNumber: 0,
                pageSize: savedPosts.length,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            empty: savedPosts.length === 0
        });
    }

    async getRepliedPosts(userId: ResId, query: PostQuery): Promise<PostPage> {
        // Mock replied posts (posts with comments)
        const repliedPosts = this.posts.filter(post => post.commentCount > 0);
        return this.simulateNetworkCall({
            content: repliedPosts,
            totalElements: repliedPosts.length,
            numberOfElements: repliedPosts.length,
            last: true,
            first: true,
            totalPages: 1,
            size: repliedPosts.length,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            pageable: {
                pageNumber: 0,
                pageSize: repliedPosts.length,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            empty: repliedPosts.length === 0
        });
    }

    async searchPosts(queryText: string, query: PostQuery): Promise<PostPage> {
        const searchResults = this.posts.filter(post =>
            post.text.toLowerCase().includes(queryText.toLowerCase()) ||
            post.title?.toLowerCase().includes(queryText.toLowerCase())
        );

        return this.simulateNetworkCall({
            content: searchResults,
            totalElements: searchResults.length,
            numberOfElements: searchResults.length,
            last: true,
            first: true,
            totalPages: 1,
            size: searchResults.length,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            pageable: {
                pageNumber: 0,
                pageSize: searchResults.length,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            empty: searchResults.length === 0
        });
    }

    // Mutation operations
    async createPost(post: PostRequest): Promise<PostResponse> {
        const newPost: PostResponse = {
            id: String(Date.now()),
            userId: 'user-1', // Mock current user
            username: 'current_user',
            title: post.title,
            text: post.text,
            createDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            poll: post.poll ? {
                votedOption: null,
                voteCount: 0,
                options: (post.poll as PollRequest).options.map(opt => ({ label: opt, voteShare: '0%' })),
                dueDate: (post.poll as PollRequest).dueDate
            } : null,
            repost: null,
            photo: null,
            userReaction: null
        };

        this.posts.unshift(newPost);
        return this.simulateNetworkCall(newPost);
    }

    async createRepost(repost: RepostRequest): Promise<PostResponse> {
        const originalPost = this.posts.find(p => p.id === repost.postId);
        if (!originalPost) {
            throw new Error(`Original post ${repost.postId} not found`);
        }

        const repostResponse: PostResponse = {
            id: String(Date.now()),
            userId: 'user-1',
            username: 'current_user',
            title: `Repost: ${originalPost.title}`,
            text: repost.text,
            createDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            poll: null,
            repost: {
                id: String(Date.now()),
                text: repost.postId,
                userId: 'user-1',
                parentId: repost.postId,
                username: 'current_user',
                isRepost: true
            },
            photo: null,
            userReaction: null
        };

        this.posts.unshift(repostResponse);
        return this.simulateNetworkCall(repostResponse);
    }

    async editPost(postId: ResId, post: PostRequest): Promise<PostResponse> {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            throw new Error(`Post with id ${postId} not found`);
        }

        const updatedPost = {
            ...this.posts[postIndex],
            title: post.title,
            text: post.text,
            updateDate: new Date().toISOString(),
            poll: post.poll ? {
                votedOption: null,
                voteCount: 0,
                options: (post.poll as PollRequest).options.map(opt => ({ label: opt, voteShare: '0%' })),
                dueDate: (post.poll as PollRequest).dueDate
            } : undefined
        };

        this.posts[postIndex] = updatedPost;
        return this.simulateNetworkCall(updatedPost);
    }

    async deletePost(postId: ResId): Promise<void> {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            throw new Error(`Post with id ${postId} not found`);
        }

        this.posts.splice(postIndex, 1);
        return this.simulateNetworkCall(undefined);
    }

    // Interaction operations
    async savePost(postId: ResId): Promise<void> {
        // Mock save operation - in real implementation this would save to user's saved posts
        return this.simulateNetworkCall(undefined);
    }

    async unsavePost(postId: ResId): Promise<void> {
        // Mock unsave operation
        return this.simulateNetworkCall(undefined);
    }

    async votePoll(vote: VoteBody): Promise<void> {
        const post = this.posts.find(p => p.id === vote.postId);
        if (!post || !post.poll) {
            throw new Error(`Poll not found for post ${vote.postId}`);
        }

        // Mock poll voting
        return this.simulateNetworkCall(undefined);
    }

    async reaction(reaction: ReactionRequest): Promise<void> {
        const post = this.posts.find(p => p.id === reaction.contentId);
        if (!post) {
            throw new Error(`Post not found for reaction ${reaction.contentId}`);
        }

        // Mock reaction - update like/dislike counts based on reaction type
        if (reaction.reactionType === 'LIKE') {
            post.likeCount += 1;
            // Update user reaction
            post.userReaction = {
                reactionType: ReactionType.LIKE,
                userId: reaction.userId,
                contentId: reaction.contentId,
                contentType: ContentType.POST
            };
        } else if (reaction.reactionType === 'DISLIKE') {
            post.dislikeCount += 1;
            // Update user reaction
            post.userReaction = {
                reactionType: ReactionType.DISLIKE,
                userId: reaction.userId,
                contentId: reaction.contentId,
                contentType: ContentType.POST
            };
        }

        return this.simulateNetworkCall(undefined);
    }

    // Utility operations
    validatePostContent(content: string): boolean {
        return content.trim().length > 0 && content.trim().length <= 2000;
    }

    calculateEngagementScore(post: PostResponse): number {
        const domainPost = PostFactory.fromApiResponse(post);
        return domainPost.getEngagementRate();
    }
}
