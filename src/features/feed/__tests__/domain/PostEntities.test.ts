/**
 * Feed Domain Unit Tests.
 * 
 * Comprehensive unit tests for Feed domain entities and business logic.
 * Tests Post entities, PostFactory, and domain validation.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { Post, PostFactory, POST_VALIDATION, PostStatus, PostSortOption } from '../../domain/entities/PostEntities';
import type { PostResponse } from '../../../../api/schemas/inferred/post';

describe('Post Domain Entities', () => {
    describe('Post Class', () => {
        let post: Post;
        let mockPostData: PostResponse;

        beforeEach(() => {
            mockPostData = {
                id: '1',
                userId: 'user-1',
                username: 'test_user',
                title: 'Test Post',
                text: 'This is a test post',
                createDate: '2024-01-15T10:00:00Z',
                updateDate: '2024-01-15T10:00:00Z',
                likeCount: 10,
                dislikeCount: 1,
                commentCount: 5,
                poll: null,
                repost: null,
                photo: null,
                userReaction: null
            };

            post = PostFactory.fromApiResponse(mockPostData);
        });

        it('should create post with correct properties', () => {
            expect(post.getId()).toBe('1');
            expect(post.getContent()).toBe('This is a test post');
            expect(post.getAuthorId()).toBe('user-1');
            expect(post.getCreatedAt()).toBeInstanceOf(Date);
            expect(post.getUpdatedAt()).toBeInstanceOf(Date);
        });

        it('should calculate engagement score correctly', () => {
            const score = post.calculateEngagementScore();
            expect(score).toBeGreaterThan(0);
            expect(typeof score).toBe('number');
        });

        it('should validate post content correctly', () => {
            const validContent = 'This is a valid post content';
            expect(post.validateContent(validContent)).toBe(true);
        });

        it('should reject invalid post content', () => {
            const invalidContent = '';
            expect(post.validateContent(invalidContent)).toBe(false);
        });

        it('should check if post is pinned', () => {
            expect(post.isPinned()).toBe(false);
        });

        it('should check if post is featured', () => {
            expect(post.isFeatured()).toBe(false);
        });

        it('should update post content', () => {
            const newContent = 'Updated post content';
            post.updateContent(newContent);
            expect(post.getContent()).toBe(newContent);
            expect(post.getUpdatedAt()).toBeInstanceOf(Date);
        });

        it('should toggle pin status', () => {
            expect(post.isPinned()).toBe(false);
            post.togglePin();
            expect(post.isPinned()).toBe(true);
            post.togglePin();
            expect(post.isPinned()).toBe(false);
        });

        it('should get engagement metrics', () => {
            const engagement = post.getEngagement();
            expect(engagement).toHaveProperty('likesCount');
            expect(engagement).toHaveProperty('commentsCount');
            expect(engagement).toHaveProperty('repostsCount');
            expect(engagement).toHaveProperty('sharesCount');
        });

        it('should handle poll data', () => {
            const postWithPoll = PostFactory.fromApiResponse({
                ...mockPostData,
                poll: {
                    votedOption: 'Option A',
                    voteCount: 25,
                    options: [
                        { label: 'Option A', voteShare: '60%' },
                        { label: 'Option B', voteShare: '40%' }
                    ],
                    dueDate: '2024-01-21T18:30:00Z'
                }
            });

            expect(postWithPoll.hasPoll()).toBe(true);
            expect(postWithPoll.getPoll()).toBeDefined();
            expect(postWithPoll.getPoll()?.options).toHaveLength(2);
        });

        it('should handle media attachments', () => {
            const postWithMedia = PostFactory.fromApiResponse({
                ...mockPostData,
                photo: {
                    type: 'image',
                    id: 'photo-1',
                    version: 1,
                    createDate: '2024-01-15T09:30:00Z',
                    updateDate: '2024-01-15T09:30:00Z',
                    name: 'test.jpg',
                    data: 'https://example.com/photo1.jpg'
                }
            });

            expect(postWithMedia.hasMedia()).toBe(true);
            expect(postWithMedia.getMedia()).toHaveLength(1);
            expect(postWithMedia.getMedia()?.[0]).toBe('https://example.com/photo1.jpg');
        });
    });

    describe('PostFactory', () => {
        it('should create Post from API response', () => {
            const apiResponse: PostResponse = {
                id: '123',
                userId: 'user-456',
                username: 'test_user',
                title: 'Test Post',
                text: 'Test content',
                createDate: '2024-01-15T10:00:00Z',
                updateDate: '2024-01-15T10:00:00Z',
                likeCount: 15,
                dislikeCount: 2,
                commentCount: 8,
                poll: null,
                repost: null,
                photo: null,
                userReaction: null
            };

            const post = PostFactory.fromApiResponse(apiResponse);

            expect(post.getId()).toBe('123');
            expect(post.getContent()).toBe('Test content');
            expect(post.getAuthorId()).toBe('user-456');
        });

        it('should handle posts with polls', () => {
            const apiResponseWithPoll: PostResponse = {
                id: '456',
                userId: 'user-789',
                username: 'poll_user',
                title: 'Poll Post',
                text: 'What do you think?',
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
            };

            const post = PostFactory.fromApiResponse(apiResponseWithPoll);

            expect(post.hasPoll()).toBe(true);
            expect(post.getPoll()?.votedOption).toBe('Option A');
            expect(post.getPoll()?.voteCount).toBe(25);
        });

        it('should handle posts with media', () => {
            const apiResponseWithMedia: PostResponse = {
                id: '789',
                userId: 'user-101',
                username: 'media_user',
                title: 'Media Post',
                text: 'Check out this photo!',
                createDate: '2024-01-13T14:20:00Z',
                updateDate: '2024-01-13T14:20:00Z',
                likeCount: 89,
                dislikeCount: 2,
                commentCount: 34,
                poll: null,
                repost: null,
                photo: {
                    type: 'image',
                    id: 'photo-1',
                    version: 1,
                    createDate: '2024-01-13T14:15:00Z',
                    updateDate: '2024-01-13T14:15:00Z',
                    name: 'photo.jpg',
                    data: 'https://example.com/photo.jpg'
                },
                userReaction: null
            };

            const post = PostFactory.fromApiResponse(apiResponseWithMedia);

            expect(post.hasMedia()).toBe(true);
            expect(post.getMedia()).toHaveLength(1);
            expect(post.getMedia()?.[0]).toBe('https://example.com/photo.jpg');
        });

        it('should handle minimal post data', () => {
            const minimalResponse: PostResponse = {
                id: '999',
                userId: 'user-999',
                username: 'minimal_user',
                title: '',
                text: 'Minimal post',
                createDate: '2024-01-01T00:00:00Z',
                updateDate: '2024-01-01T00:00:00Z',
                likeCount: 0,
                dislikeCount: 0,
                commentCount: 0,
                poll: null,
                repost: null,
                photo: null,
                userReaction: null
            };

            const post = PostFactory.fromApiResponse(minimalResponse);

            expect(post.getId()).toBe('999');
            expect(post.getContent()).toBe('Minimal post');
            expect(post.getEngagement().likesCount).toBe(0);
            expect(post.getEngagement().commentsCount).toBe(0);
        });
    });

    describe('POST_VALIDATION Constants', () => {
        it('should have correct validation rules', () => {
            expect(POST_VALIDATION.MIN_LENGTH).toBe(1);
            expect(POST_VALIDATION.MAX_LENGTH).toBe(2000);
            expect(POST_VALIDATION.MIN_TITLE_LENGTH).toBe(1);
            expect(POST_VALIDATION.MAX_TITLE_LENGTH).toBe(200);
            expect(POST_VALIDATION.ALLOWED_TAGS).toContain('general');
            expect(POST_VALIDATION.ALLOWED_TAGS).toContain('tech');
            expect(POST_VALIDATION.ALLOWED_TAGS).toContain('lifestyle');
        });

        it('should validate content length', () => {
            const validContent = 'a'.repeat(50); // 50 chars
            const invalidContent = 'a'.repeat(2001); // 2001 chars

            expect(POST_VALIDATION.MIN_LENGTH).toBeLessThanOrEqual(validContent.length);
            expect(POST_VALIDATION.MAX_LENGTH).toBeLessThan(invalidContent.length);
        });
    });

    describe('PostStatus Enum', () => {
        it('should have correct status values', () => {
            expect(PostStatus.DRAFT).toBe('draft');
            expect(PostStatus.PUBLISHED).toBe('published');
            expect(PostStatus.ARCHIVED).toBe('archived');
            expect(PostStatus.DELETED).toBe('deleted');
        });
    });

    describe('PostSortOption Enum', () => {
        it('should have correct sort options', () => {
            expect(PostSortOption.LATEST).toBe('createdAt');
            expect(PostSortOption.POPULAR).toBe('likesCount');
            expect(PostSortOption.DISCUSSED).toBe('commentsCount');
        });
    });
});
