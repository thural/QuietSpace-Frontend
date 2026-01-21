/**
 * Feed Component Tests with Mocked Dependencies.
 * 
 * Component tests for Feed feature using mocked repositories and dependencies.
 * Tests UI components, hooks, and integration scenarios.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FeedDIProvider } from '../../di/useFeedDI';
import { useFeedDI } from '../../di/useFeedDI';
import { PostFactory } from '../../domain/entities/PostEntities';
import type { PostResponse } from '@/features/feed/data/models/post';
import type { IPostRepository } from '../../domain/entities/IPostRepository';

// Mock the dependencies
jest.mock('../../di/useFeedDI', () => ({
    useFeedDI: () => ({
        getPostRepository: () => mockRepository,
        getConfig: () => mockConfig
    })
}));

jest.mock('../../domain/entities/PostEntities', () => ({
    PostFactory: {
        fromApiResponse: jest.fn((response: PostResponse) => {
            return {
                id: response.id,
                getContent: () => response.text,
                getAuthorId: () => response.userId,
                getCreatedAt: () => new Date(response.createDate),
                getUpdatedAt: () => new Date(response.updateDate),
                calculateEngagementScore: () => (response.likeCount || 0) + (response.commentCount || 0),
                validateContent: () => response.text.length > 0,
                isPinned: () => false,
                isFeatured: () => false,
                updateContent: jest.fn(),
                togglePin: jest.fn(),
                getEngagement: () => ({
                    likesCount: response.likeCount || 0,
                    commentsCount: response.commentCount || 0,
                    repostsCount: 0,
                    sharesCount: 0,
                    pollVotesCount: response.poll?.voteCount || 0
                }),
                hasPoll: () => !!response.poll,
                getPoll: () => response.poll,
                hasMedia: () => !!response.photo,
                getMedia: () => response.photo ? [response.photo.data] : []
            };
        })
    }
}));

const mockRepository: jest.Mocked<IPostRepository> = {
    getPosts: jest.fn(),
    getPostById: jest.fn(),
    getPostsByUserId: jest.fn(),
    getSavedPosts: jest.fn(),
    getRepliedPosts: jest.fn(),
    searchPosts: jest.fn(),
    createPost: jest.fn(),
    createRepost: jest.fn(),
    editPost: jest.fn(),
    deletePost: jest.fn(),
    savePost: jest.fn(),
    unsavePost: jest.fn(),
    votePoll: jest.fn(),
    validatePostContent: jest.fn(),
    calculateEngagementScore: jest.fn()
} as any;

const mockConfig = {
    useMockRepositories: true,
    enableRealTimeUpdates: false,
    enableOptimisticUpdates: false,
    defaultPageSize: 10,
    enableCaching: true
};

// Mock post data
const mockPosts: PostResponse[] = [
    {
        id: '1',
        userId: 'user-1',
        username: 'test_user',
        title: 'Test Post 1',
        text: 'This is the first test post',
        createDate: '2024-01-15T10:00:00Z',
        updateDate: '2024-01-15T10:00:00Z',
        likeCount: 10,
        dislikeCount: 1,
        commentCount: 5,
        poll: null,
        repost: null,
        photo: null,
        userReaction: null
    },
    {
        id: '2',
        userId: 'user-2',
        username: 'test_user_2',
        title: 'Test Post 2',
        text: 'This is the second test post',
        createDate: '2024-01-14T18:30:00Z',
        updateDate: '2024-01-14T18:30:00Z',
        likeCount: 25,
        dislikeCount: 0,
        commentCount: 12,
        poll: {
            votedOption: 'Option A',
            voteCount: 15,
            options: [
                { label: 'Option A', voteShare: '60%' },
                { label: 'Option B', voteShare: '40%' }
            ],
            dueDate: '2024-01-21T18:30:00Z'
        },
        repost: null,
        photo: null,
        userReaction: null
    }
];

describe('Feed Component Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('FeedDIProvider', () => {
        it('should provide repository to children', () => {
            const TestComponent = () => {
                const { getPostRepository } = useFeedDI();
                const repository = getPostRepository();

                return <div data-testid="repository-provided">{repository ? 'yes' : 'no'}</div>;
            };

            render(
                <FeedDIProvider>
                    <TestComponent />
                </FeedDIProvider>
            );

            expect(screen.getByTestId('repository-provided')).toHaveTextContent('yes');
        });

        it('should provide config to children', () => {
            const TestComponent = () => {
                const { getConfig } = useFeedDI();
                const config = getConfig();

                return <div data-testid="config-provided">{JSON.stringify(config)}</div>;
            };

            render(
                <FeedDIProvider config={{ useMockRepositories: true }}>
                    <TestComponent />
                </FeedDIProvider>
            );

            const configElement = screen.getByTestId('config-provided');
            expect(configElement).toHaveTextContent(JSON.stringify({ useMockRepositories: true }));
        });
    });

    describe('PostFactory Integration', () => {
        it('should create post entities correctly', () => {
            const mockPost = mockPosts[0];
            const post = PostFactory.fromApiResponse(mockPost);

            expect(post.getContent()).toBe(mockPost.text);
            expect(post.getAuthorId()).toBe(mockPost.userId);
        });
    });

    describe('Feed Integration', () => {
        it('should handle post creation flow', async () => {
            // Mock successful post creation
            mockRepository.createPost.mockResolvedValue(mockPosts[0]);

            const TestComponent = () => {
                const { getPostRepository } = useFeedDI();
                const repository = getPostRepository();
                const [posts, setPosts] = React.useState(mockPosts);

                const handleCreatePost = async (postData: any) => {
                    try {
                        const newPost = await repository.createPost(postData, 'test-token');
                        setPosts(prev => [...prev, newPost]);
                    } catch (error) {
                        console.error('Failed to create post:', error);
                    }
                };

                return (
                    <div>
                        <button onClick={() => handleCreatePost({ title: 'New Post', text: 'New content' })}>
                            Create Post
                        </button>
                        <div data-testid="posts-count">
                            {posts.length} posts
                        </div>
                    </div>
                );
            };

            render(
                <FeedDIProvider>
                    <TestComponent />
                </FeedDIProvider>
            );

            const createButton = screen.getByText('Create Post');
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(screen.getByTestId('posts-count')).toHaveTextContent('1 posts');
            });

            expect(mockRepository.createPost).toHaveBeenCalledWith(
                { title: 'New Post', text: 'New content' },
                'test-token'
            );
        });

        it('should handle post deletion flow', async () => {
            mockRepository.getPosts.mockResolvedValue({ content: mockPosts });
            mockRepository.deletePost.mockResolvedValue(undefined);

            const TestComponent = () => {
                const { getPostRepository } = useFeedDI();
                const repository = getPostRepository();
                const [posts, setPosts] = React.useState(mockPosts);

                const handleDeletePost = async (postId: string) => {
                    try {
                        await repository.deletePost(postId, 'test-token');
                        setPosts(prev => prev.filter(post => post.id !== postId));
                    } catch (error) {
                        console.error('Failed to delete post:', error);
                    }
                };

                return (
                    <div>
                        {posts.map(post => (
                            <div key={post.id} data-testid={`post-${post.id}`}>
                                <span>{post.title}</span>
                                <button onClick={() => handleDeletePost(String(post.id))}>
                                    Delete
                                </button>
                            </div>
                        ))}
                        <div data-testid="posts-count">
                            {posts.length} posts
                        </div>
                    </div>
                );
            };

            render(
                <FeedDIProvider>
                    <TestComponent />
                </FeedDIProvider>
            );

            const deleteButton = screen.getByTestId('post-1').querySelector('button');
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(screen.getByTestId('posts-count')).toHaveTextContent('1 posts');
                expect(screen.queryByTestId('post-1')).toBeNull();
            });

            expect(mockRepository.deletePost).toHaveBeenCalledWith('1', 'test-token');
        });

        it('should handle error states', async () => {
            mockRepository.createPost.mockRejectedValue(new Error('Network error'));

            const TestComponent = () => {
                const { getPostRepository } = useFeedDI();
                const repository = getPostRepository();
                const [error, setError] = React.useState<string | null>(null);

                const handleCreatePost = async (postData: any) => {
                    try {
                        await repository.createPost(postData, 'test-token');
                    } catch (err) {
                        setError(err.message);
                    }
                };

                return (
                    <div>
                        <button onClick={() => handleCreatePost({ title: 'New Post', text: 'New content' })}>
                            Create Post
                        </button>
                        {error && <div data-testid="error-message">{error}</div>}
                    </div>
                );
            };

            render(
                <FeedDIProvider>
                    <TestComponent />
                </FeedDIProvider>
            );

            const createButton = screen.getByText('Create Post');
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');
            });
        });
    });
});
