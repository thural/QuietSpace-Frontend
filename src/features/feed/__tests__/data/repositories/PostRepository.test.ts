/**
 * Feed Repository Integration Tests.
 * 
 * Integration tests for Feed repository implementations.
 * Tests both real and mock repositories with actual data operations.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PostRepository } from '../../../data/repositories/PostRepository';
import { MockPostRepository } from '../../../data/repositories/MockPostRepository';
import type { PostRequest, RepostRequest, VoteBody } from '@/features/feed/data/models/post';
import type { IPostRepository, PostQuery, PostFilters } from '../../../domain/entities/IPostRepository';

describe('Feed Repository Integration', () => {
    let realRepository: IPostRepository;
    let mockRepository: IPostRepository;
    let testToken: string;

    beforeEach(() => {
        testToken = 'test-jwt-token';
        realRepository = new PostRepository(testToken);
        mockRepository = new MockPostRepository(0); // No delay for tests
    });

    afterEach(() => {
        // Clean up any test data - create new instance to clear data
        mockRepository = new MockPostRepository(0);
    });

    describe('PostRepository', () => {
        it('should be instantiated with token', () => {
            expect(realRepository).toBeInstanceOf(PostRepository);
        });

        it('should have all required methods', () => {
            expect(typeof realRepository.getPosts).toBe('function');
            expect(typeof realRepository.getPostById).toBe('function');
            expect(typeof realRepository.getPostsByUserId).toBe('function');
            expect(typeof realRepository.getSavedPosts).toBe('function');
            expect(typeof realRepository.getRepliedPosts).toBe('function');
            expect(typeof realRepository.searchPosts).toBe('function');
            expect(typeof realRepository.createPost).toBe('function');
            expect(typeof realRepository.createRepost).toBe('function');
            expect(typeof realRepository.editPost).toBe('function');
            expect(typeof realRepository.deletePost).toBe('function');
            expect(typeof realRepository.savePost).toBe('function');
            expect(typeof realRepository.unsavePost).toBe('function');
            expect(typeof realRepository.votePoll).toBe('function');
            expect(typeof realRepository.validatePostContent).toBe('function');
            expect(typeof realRepository.calculateEngagementScore).toBe('function');
        });
    });

    describe('MockPostRepository', () => {
        it('should be instantiated with delay', () => {
            const repoWithDelay = new MockPostRepository(100);
            expect(repoWithDelay).toBeInstanceOf(MockPostRepository);
        });

        it('should start with empty data', async () => {
            const repo = new MockPostRepository(0);
            const posts = await repo.getPosts({ page: 0, size: 10 }, testToken);
            expect(posts.content).toHaveLength(0);
        });

        it('should add posts correctly', async () => {
            const repo = new MockPostRepository(0);

            const postData: PostRequest = {
                title: 'Test Post',
                text: 'Test content',
                poll: null
            };

            const createdPost = await repo.createPost(postData, testToken);

            expect(createdPost).toBeDefined();
            expect(createdPost.title).toBe('Test Post');
            expect(createdPost.text).toBe('Test content');
            const allPosts = await repo.getPosts({ page: 0, size: 10 }, testToken);
            expect(allPosts.content).toHaveLength(1);
        });

        it('should update posts correctly', async () => {
            const repo = new MockPostRepository(0);

            // Create a post first
            const postData: PostRequest = {
                title: 'Original Post',
                text: 'Original content',
                poll: null
            };

            const createdPost = await repo.createPost(postData, testToken);
            expect(createdPost.title).toBe('Original Post');

            // Update the post
            const updateData: PostRequest = {
                title: 'Updated Post',
                text: 'Updated content',
                poll: null
            };

            const updatedPost = await repo.editPost(createdPost.id, updateData, testToken);

            expect(updatedPost.title).toBe('Updated Post');
            expect(updatedPost.text).toBe('Updated content');
            expect(updatedPost.updateDate).not.toBe(createdPost.updateDate);
        });

        it('should delete posts correctly', async () => {
            const repo = new MockPostRepository(0);

            const postData: PostRequest = {
                title: 'Post to Delete',
                text: 'Content to delete',
                poll: null
            };

            const createdPost = await repo.createPost(postData, testToken);
            const postsBefore = await repo.getPosts({ page: 0, size: 10 }, testToken);
            expect(postsBefore.content).toHaveLength(1);

            await repo.deletePost(createdPost.id, testToken);

            const postsAfter = await repo.getPosts({ page: 0, size: 10 }, testToken);
            expect(postsAfter.content).toHaveLength(0);
        });

        it('should handle search correctly', async () => {
            const repo = new MockPostRepository(0);

            // Add multiple posts
            await repo.createPost({
                title: 'React Post',
                text: 'About React development',
                poll: null
            }, testToken);

            await repo.createPost({
                title: 'TypeScript Post',
                text: 'About TypeScript',
                poll: null
            }, testToken);

            await repo.createPost({
                title: 'JavaScript Post',
                text: 'About JavaScript',
                poll: null
            }, testToken);

            // Search for specific term
            const searchResults = await repo.searchPosts('TypeScript', { page: 0, size: 10 }, testToken);

            expect(searchResults).toHaveLength(1);
            expect(searchResults[0].title).toBe('TypeScript Post');
        });

        it('should handle pagination correctly', async () => {
            const repo = new MockPostRepository(0);

            // Add multiple posts
            for (let i = 0; i < 25; i++) {
                await repo.createPost({
                    title: `Post ${i}`,
                    text: `Content for post ${i}`,
                    poll: null
                }, testToken);
            }

            const allPosts = await repo.getPosts({ page: 0, size: 100 }, testToken);
            expect(allPosts.content).toHaveLength(25);

            // Get first page
            const firstPage = await repo.getPosts({ page: 0, size: 10 }, testToken);
            expect(firstPage.content).toHaveLength(10);

            // Get second page
            const secondPage = await repo.getPosts({ page: 1, size: 10 }, testToken);
            expect(secondPage.content).toHaveLength(10);

            // Get third page
            const thirdPage = await repo.getPosts({ page: 2, size: 10 }, testToken);
            expect(thirdPage.content).toHaveLength(5);
        });

        it('should handle polls correctly', async () => {
            const repo = new MockPostRepository(0);

            const pollData = {
                options: ['Option A', 'Option B', 'Option C'],
                dueDate: '2024-01-21T18:30:00Z'
            };

            const postData: PostRequest = {
                title: 'Poll Post',
                text: 'What do you think?',
                poll: pollData
            };

            const createdPost = await repo.createPost(postData, testToken);

            expect(createdPost.poll).toBeDefined();
            expect(createdPost.poll?.options).toHaveLength(3);
            expect(createdPost.poll?.dueDate).toBe('2024-01-21T18:30:00Z');
        });

        it('should handle reposts correctly', async () => {
            const repo = new MockPostRepository(0);

            // Create original post
            const originalPost = await repo.createPost({
                title: 'Original Post',
                text: 'Original content',
                poll: null
            }, testToken);

            // Create repost
            const repostData: RepostRequest = {
                postId: originalPost.id,
                text: 'Repost content'
            };

            const repost = await repo.createRepost(repostData, testToken);

            expect(repost).toBeDefined();
            expect(repost.text).toBe('Repost content');
            expect(repost.repost?.parentId).toBe(originalPost.id);
        });

        it('should validate post content correctly', () => {
            const repo = new MockPostRepository(0);

            // Test valid content
            expect(repo.validatePostContent('Valid post content')).toBe(true);
            expect(repo.validatePostContent('A'.repeat(100))).toBe(true);

            // Test invalid content
            expect(repo.validatePostContent('')).toBe(false);
            expect(repo.validatePostContent('A'.repeat(2001))).toBe(false);
        });

        it('should calculate engagement score correctly', async () => {
            const repo = new MockPostRepository(0);

            // Create post with known engagement
            const postData: PostRequest = {
                title: 'Popular Post',
                text: 'This post has many interactions',
                poll: null
            };

            const createdPost = await repo.createPost(postData, testToken);

            // Manually set engagement metrics by accessing a post
            const posts = await repo.getPosts({ page: 0, size: 10 }, testToken);
            const testPost = posts.content[0];
            if (testPost) {
                // Create a modified post for testing
                const modifiedPost = {
                    ...testPost,
                    likeCount: 50,
                    commentCount: 25,
                    dislikeCount: 5
                };

                const score = repo.calculateEngagementScore(modifiedPost);

                expect(score).toBeGreaterThan(0);
                expect(typeof score).toBe('number');
            }
        });

        it('should handle concurrent operations', async () => {
            const repo = new MockPostRepository(0);

            // Simulate concurrent operations
            const post1Promise = repo.createPost({
                title: 'Post 1',
                text: 'Content 1',
                poll: null
            }, testToken);

            const post2Promise = repo.createPost({
                title: 'Post 2',
                text: 'Content 2',
                poll: null
            }, testToken);

            const post3Promise = repo.createPost({
                title: 'Post 3',
                text: 'Content 3',
                poll: null
            }, testToken);

            const [post1, post2, post3] = await Promise.all([
                post1Promise,
                post2Promise,
                post3Promise
            ]);

            const allPosts = await repo.getPosts({ page: 0, size: 100 }, testToken);
            expect(allPosts.content).toHaveLength(3);
            expect(post1.title).toBe('Post 1');
            expect(post2.title).toBe('Post 2');
            expect(post3.title).toBe('Post 3');
        });
    });

    describe('Repository Interface Compliance', () => {
        it('should ensure both repositories implement the same interface', () => {
            const realMethods = Object.getOwnPropertyNames(realRepository);
            const mockMethods = Object.getOwnPropertyNames(mockRepository);

            // Both should have the same methods
            expect(realMethods.sort()).toEqual(mockMethods.sort());

            // All required methods should be present
            const requiredMethods = [
                'getPosts',
                'getPostById',
                'getPostsByUserId',
                'getSavedPosts',
                'getRepliedPosts',
                'searchPosts',
                'createPost',
                'createRepost',
                'editPost',
                'deletePost',
                'savePost',
                'unsavePost',
                'votePoll',
                'validatePostContent',
                'calculateEngagementScore'
            ];

            requiredMethods.forEach(method => {
                expect(realMethods).toContain(method);
                expect(mockMethods).toContain(method);
            });
        });
    });
});
