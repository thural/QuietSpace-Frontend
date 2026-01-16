/**
 * Feed E2E Tests.
 * 
 * End-to-end tests for Feed feature user flows.
 * Tests complete user journeys from post creation to interaction.
 */

import { test, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock page data
const mockUserData = {
    id: 'user-123',
    username: 'testuser',
    accessToken: 'mock-jwt-token'
};

describe('Feed E2E Tests', () => {
    beforeEach(() => {
        // Mock localStorage for auth
        localStorage.setItem('auth', JSON.stringify(mockUserData));
        
        // Mock fetch API
        global.fetch = jest.fn();
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('Post Creation Flow', () => {
        it('should create a new post successfully', async () => {
            // Mock successful API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    id: 'post-123',
                    userId: 'user-123',
                    username: 'testuser',
                    title: 'Test Post',
                    text: 'This is a test post created via E2E test',
                    createDate: '2024-01-15T10:00:00Z',
                    updateDate: '2024-01-15T10:00:00Z',
                    likeCount: 0,
                    dislikeCount: 0,
                    commentCount: 0,
                    poll: null,
                    repost: null,
                    photo: null,
                    userReaction: null
                })
            });

            // Visit feed page
            window.location.href = '/feed';
            
            // Wait for page to load
            await waitFor(() => {
                expect(screen.getByText('Feed')).toBeInTheDocument();
            });

            // Find create post button
            const createPostButton = screen.getByRole('button', { name: /create post/i });
            expect(createPostButton).toBeInTheDocument();

            // Click create post button
            await userEvent.click(createPostButton);

            // Wait for form to appear
            await waitFor(() => {
                expect(screen.getByLabelText(/post title/i)).toBeInTheDocument();
            });

            // Fill out form
            const titleInput = screen.getByLabelText(/post title/i);
            const contentInput = screen.getByLabelText(/post content/i);
            
            await userEvent.type(titleInput, 'E2E Test Post');
            await userEvent.type(contentInput, 'This post was created via end-to-end testing');

            // Submit form
            const submitButton = screen.getByRole('button', { name: /submit/i });
            await userEvent.click(submitButton);

            // Wait for success message
            await waitFor(() => {
                expect(screen.getByText(/post created successfully/i)).toBeInTheDocument();
            });

            // Verify post appears in feed
            await waitFor(() => {
                expect(screen.getByText('E2E Test Post')).toBeInTheDocument();
            });
        });

        it('should handle validation errors', async () => {
            // Mock validation error response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => ({
                    error: 'Title is required'
                })
            });

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getByText('Feed')).toBeInTheDocument();
            });

            const createPostButton = screen.getByRole('button', { name: /create post/i });
            await userEvent.click(createPostButton);

            await waitFor(() => {
                expect(screen.getByLabelText(/post title/i)).toBeInTheDocument();
            });

            const titleInput = screen.getByLabelText(/post title/i);
            await userEvent.type(titleInput, ''); // Empty title

            const submitButton = screen.getByRole('button', { name: /submit/i });
            await userEvent.click(submitButton);

            // Wait for error message
            await waitFor(() => {
                expect(screen.getByText(/title is required/i)).toBeInTheDocument();
            });
        });

        it('should handle network errors', async () => {
            // Mock network error
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getByText('Feed')).toBeInTheDocument();
            });

            const createPostButton = screen.getByRole('button', { name: /create post/i });
            await userEvent.click(createPostButton);

            await waitFor(() => {
                expect(screen.getByText(/failed to create post/i)).toBeInTheDocument();
            });
        });
    });

    describe('Post Interaction Flow', () => {
        beforeEach(() => {
            // Mock feed with posts
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: [
                        {
                            id: 'post-1',
                            userId: 'user-123',
                            username: 'testuser',
                            title: 'Test Post 1',
                            text: 'This is test post 1',
                            createDate: '2024-01-15T10:00:00Z',
                            updateDate: '2024-01-15T10:00:00Z',
                            likeCount: 5,
                            dislikeCount: 0,
                            commentCount: 2,
                            poll: null,
                            repost: null,
                            photo: null,
                            userReaction: null
                        },
                        {
                            id: 'post-2',
                            userId: 'user-456',
                            username: 'otheruser',
                            title: 'Test Post 2',
                            text: 'This is test post 2',
                            createDate: '2024-01-14T18:30:00Z',
                            updateDate: '2024-01-14T18:30:00Z',
                            likeCount: 10,
                            dislikeCount: 1,
                            commentCount: 3,
                            poll: null,
                            repost: null,
                            photo: null,
                            userReaction: null
                        }
                    ],
                    hasNext: false,
                    pageSize: 10
                })
            });

            window.location.href = '/feed';
        });

        it('should like a post', async () => {
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            });

            // Find like button for first post
            const likeButtons = screen.getAllByRole('button', { name: /like/i });
            expect(likeButtons[0]).toBeInTheDocument();

            // Mock like API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({ success: true })
            });

            // Click like button
            await userEvent.click(likeButtons[0]);

            // Wait for like to be reflected
            await waitFor(() => {
                expect(likeButtons[0]).toHaveClass(/liked/i);
            });
        });

        it('should comment on a post', async () => {
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            });

            // Find comment button for first post
            const commentButtons = screen.getAllByRole('button', { name: /comment/i });
            expect(commentButtons[0]).toBeInTheDocument();

            // Click comment button
            await userEvent.click(commentButtons[0]);

            // Wait for comment form
            await waitFor(() => {
                expect(screen.getByLabelText(/comment content/i)).toBeInTheDocument();
            });

            // Fill comment
            const commentInput = screen.getByLabelText(/comment content/i);
            await userEvent.type(commentInput, 'Great post!');

            // Submit comment
            const submitCommentButton = screen.getByRole('button', { name: /submit/i });
            await userEvent.click(submitCommentButton);

            // Mock comment API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    id: 'comment-123',
                    postId: 'post-1',
                    userId: 'user-123',
                    content: 'Great post!',
                    createDate: '2024-01-15T11:00:00Z'
                })
            });

            // Wait for comment to appear
            await waitFor(() => {
                expect(screen.getByText('Great post!')).toBeInTheDocument();
            });
        });

        it('should share a post', async () => {
            await waitFor(() => {
                expect(screen.getByText('Test Post 1')).toBeInTheDocument();
            });

            // Find share button for first post
            const shareButtons = screen.getAllByRole('button', { name: /share/i });
            expect(shareButtons[0]).toBeInTheDocument();

            // Mock share API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({ success: true, shareUrl: 'https://example.com/share/post-1' })
            });

            // Click share button
            await userEvent.click(shareButtons[0]);

            // Wait for share confirmation
            await waitFor(() => {
                expect(screen.getByText(/post shared successfully/i)).toBeInTheDocument();
            });
        });
    });

    describe('Post Management Flow', () => {
        beforeEach(() => {
            // Mock user's posts
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: [
                        {
                            id: 'post-1',
                            userId: 'user-123',
                            username: 'testuser',
                            title: 'My Test Post',
                            text: 'This is my post to edit',
                            createDate: '2024-01-15T10:00:00Z',
                            updateDate: '2024-01-15T10:00:00Z',
                            likeCount: 5,
                            dislikeCount: 0,
                            commentCount: 2,
                            poll: null,
                            repost: null,
                            photo: null,
                            userReaction: null
                        }
                    ],
                    hasNext: false,
                    pageSize: 10
                })
            });

            window.location.href = '/feed';
        });

        it('should edit own post', async () => {
            await waitFor(() => {
                expect(screen.getByText('My Test Post')).toBeInTheDocument();
            });

            // Find edit button for user's post
            const editButtons = screen.getAllByRole('button', { name: /edit/i });
            const userPostEditButton = editButtons.find(button => 
                button.closest('[data-post-id="post-1"]')
            );
            expect(userPostEditButton).toBeInTheDocument();

            // Click edit button
            await userEvent.click(userPostEditButton);

            // Wait for edit form
            await waitFor(() => {
                expect(screen.getByDisplayValue(/my test post/i)).toBeInTheDocument();
            });

            // Update title
            const titleInput = screen.getByLabelText(/post title/i);
            await userEvent.clear(titleInput);
            await userEvent.type(titleInput, 'My Updated Test Post');

            // Submit edit
            const submitButton = screen.getByRole('button', { name: /save/i });
            await userEvent.click(submitButton);

            // Mock update API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    id: 'post-1',
                    userId: 'user-123',
                    username: 'testuser',
                    title: 'My Updated Test Post',
                    text: 'This is my post to edit',
                    createDate: '2024-01-15T10:00:00Z',
                    updateDate: '2024-01-15T11:00:00Z',
                    likeCount: 5,
                    dislikeCount: 0,
                    commentCount: 2,
                    poll: null,
                    repost: null,
                    photo: null,
                    userReaction: null
                })
            });

            // Wait for update to reflect
            await waitFor(() => {
                expect(screen.getByText('My Updated Test Post')).toBeInTheDocument();
            });
        });

        it('should delete own post', async () => {
            await waitFor(() => {
                expect(screen.getByText('My Test Post')).toBeInTheDocument();
            });

            // Find delete button for user's post
            const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
            const userPostDeleteButton = deleteButtons.find(button => 
                button.closest('[data-post-id="post-1"]')
            );
            expect(userPostDeleteButton).toBeInTheDocument();

            // Click delete button
            await userEvent.click(userPostDeleteButton);

            // Wait for confirmation dialog
            await waitFor(() => {
                expect(screen.getByText(/delete this post/i)).toBeInTheDocument();
            });

            // Confirm deletion
            const confirmButton = screen.getByRole('button', { name: /confirm/i });
            await userEvent.click(confirmButton);

            // Mock delete API response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({ success: true })
            });

            // Wait for post to be removed
            await waitFor(() => {
                expect(screen.queryByText('My Test Post')).toBeNull();
            });
        });
    });

    describe('Feed Navigation Flow', () => {
        it('should navigate between feed sections', async () => {
            // Mock feed with different post types
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: [
                        {
                            id: 'post-1',
                            title: 'Regular Post',
                            text: 'Regular content',
                            poll: null
                        },
                        {
                            id: 'post-2',
                            title: 'Poll Post',
                            text: 'What do you think?',
                            poll: {
                                options: ['Option A', 'Option B'],
                                dueDate: '2024-01-21T18:30:00Z'
                            }
                        }
                    ],
                    hasNext: false,
                    pageSize: 10
                })
            });

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getByText('Regular Post')).toBeInTheDocument();
                expect(screen.getByText('Poll Post')).toBeInTheDocument();
            });

            // Test filter tabs
            const allTab = screen.getByRole('tab', { name: /all posts/i });
            const pollTab = screen.getByRole('tab', { name: /polls/i });
            
            expect(allTab).toBeInTheDocument();
            expect(pollTab).toBeInTheDocument();

            // Click on polls tab
            await userEvent.click(pollTab);

            // Wait for filter to apply
            await waitFor(() => {
                expect(screen.queryByText('Regular Post')).toBeNull();
                expect(screen.getByText('Poll Post')).toBeInTheDocument();
            });
        });

        it('should handle pagination', async () => {
            // Mock paginated feed
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: Array.from({ length: 15 }, (_, i) => ({
                        id: `post-${i}`,
                        title: `Post ${i}`,
                        text: `Content for post ${i}`,
                        poll: null
                    })),
                    hasNext: true,
                    pageSize: 10
                })
            });

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getAllByRole('article')).toHaveLength(10);
            });

            // Find and click load more button
            const loadMoreButton = screen.getByRole('button', { name: /load more/i });
            expect(loadMoreButton).toBeInTheDocument();

            // Mock next page response
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: Array.from({ length: 5 }, (_, i) => ({
                        id: `post-${i + 10}`,
                        title: `Post ${i + 10}`,
                        text: `Content for post ${i + 10}`,
                        poll: null
                    })),
                    hasNext: false,
                    pageSize: 10
                })
            });

            // Click load more
            await userEvent.click(loadMoreButton);

            // Wait for next page to load
            await waitFor(() => {
                expect(screen.getAllByRole('article')).toHaveLength(15);
            });
        });
    });

    describe('Real-time Updates Flow', () => {
        it('should show real-time indicators', async () => {
            // Mock WebSocket connection
            const mockWebSocket = {
                readyState: WebSocket.OPEN,
                send: jest.fn(),
                close: jest.fn(),
                addEventListener: jest.fn()
            };
            
            const mockWebSocketConstructor = jest.fn(() => mockWebSocket) as any;
            mockWebSocketConstructor.CONNECTING = 0;
            mockWebSocketConstructor.OPEN = 1;
            mockWebSocketConstructor.CLOSING = 2;
            mockWebSocketConstructor.CLOSED = 3;
            
            global.WebSocket = mockWebSocketConstructor;

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getByTestId('connection-status')).toHaveTextContent('connected');
                expect(screen.getByTestId('last-sync')).toBeInTheDocument();
            });
        });

        it('should handle live post updates', async () => {
            // Mock initial feed
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => ({
                    content: [
                        {
                            id: 'post-1',
                            title: 'Original Post',
                            text: 'Original content',
                            poll: null
                        }
                    ],
                    hasNext: false,
                    pageSize: 10
                })
            });

            // Mock WebSocket message
            const mockWebSocket = {
                readyState: WebSocket.OPEN,
                send: jest.fn(),
                close: jest.fn(),
                addEventListener: jest.fn((event, callback) => {
                    if (event === 'message') {
                        setTimeout(() => {
                            callback({
                                data: JSON.stringify({
                                    type: 'post_created',
                                    postId: 'post-2',
                                    data: {
                                        id: 'post-2',
                                        title: 'New Live Post',
                                        text: 'This post was created in real-time',
                                        poll: null
                                    }
                                })
                            });
                        }, 100);
                    }
                })
            };
            
            const mockWebSocketConstructor = jest.fn(() => mockWebSocket) as any;
            mockWebSocketConstructor.CONNECTING = 0;
            mockWebSocketConstructor.OPEN = 1;
            mockWebSocketConstructor.CLOSING = 2;
            mockWebSocketConstructor.CLOSED = 3;
            
            global.WebSocket = mockWebSocketConstructor;

            window.location.href = '/feed';
            
            await waitFor(() => {
                expect(screen.getByText('Original Post')).toBeInTheDocument();
            });

            // Wait for real-time update
            await waitFor(() => {
                expect(screen.getByText('New Live Post')).toBeInTheDocument();
            }, { timeout: 5000 });
        });
    });
});
