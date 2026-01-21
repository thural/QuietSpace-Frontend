/**
 * Chat Feature Integration Tests.
 * 
 * End-to-end integration tests for Chat feature with DI container and React Query.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ChatDIContainer } from "@chat/di/ChatDIContainer";
import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import type { IChatService } from "@chat/application/services/ChatService";
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from '@/features/chat/data/models/chat';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('Chat Feature Integration', () => {
    let diContainer: ChatDIContainer;
    let chatRepository: IChatRepository;
    let chatService: IChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        diContainer = new ChatDIContainer();
        chatRepository = diContainer.getChatRepository();
        chatService = diContainer.getChatService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('DI Container Integration', () => {
        it('should provide all required dependencies', () => {
            // Assert
            expect(chatRepository).toBeDefined();
            expect(chatService).toBeDefined();
            expect(diContainer.getConfig()).toBeDefined();
        });

        it('should use mock repository in test environment', () => {
            // Act
            const config = diContainer.getConfig();

            // Assert
            expect(config.useMockRepositories).toBe(true);
        });
    });

    describe('End-to-End Chat Flow', () => {
        it('should complete full chat workflow', async () => {
            // Arrange
            const userId = 'user1';
            const token = 'token123';
            const chatData: CreateChatRequest = {
                userIds: ['user1', 'user2'],
                recipientId: 'user2',
                text: 'Hello',
                isGroupChat: false
            };

            const mockChatResponse: ChatResponse = {
                id: 'chat1',
                version: 1,
                createDate: '2023-01-01',
                updateDate: '2023-01-01',
                userIds: ['user1', 'user2'],
                members: [],
                recentMessage: undefined
            };

            const mockChats: ChatList = {
                content: [mockChatResponse],
                totalPages: 1,
                totalElements: 1,
                size: 10,
                number: 0,
                first: true,
                last: true,
                numberOfElements: 1,
                empty: false,
                pageable: {
                    pageNumber: 0,
                    pageSize: 10,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: 0,
                    paged: true,
                    unpaged: false
                },
                sort: { sorted: false, unsorted: true, empty: false }
            };

            // Mock fetch responses
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockChatResponse
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockChats
                } as Response);

            // Act & Assert - Create chat
            const createdChat = await chatService.createChat(chatData, token);
            expect(createdChat).toEqual(mockChatResponse);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123',
                        'Content-Type': 'application/json'
                    })
                })
            );

            // Act & Assert - Get chats
            const chats = await chatService.getChats(userId, token);
            expect(chats).toEqual(mockChats);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/user1'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
        });

        it('should handle search workflow', async () => {
            // Arrange
            const query = 'hello';
            const userId = 'user1';
            const token = 'token123';
            const mockSearchResults: ChatList = {
                content: [],
                totalPages: 0,
                totalElements: 0,
                size: 10,
                number: 0,
                first: true,
                last: true,
                numberOfElements: 0,
                empty: true,
                pageable: {
                    pageNumber: 0,
                    pageSize: 10,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: 0,
                    paged: true,
                    unpaged: false
                },
                sort: { sorted: false, unsorted: true, empty: false }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResults
            } as Response);

            // Act
            const searchResults = await chatService.searchChats(query, userId, token);

            // Assert
            expect(searchResults).toEqual(mockSearchResults);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/search/hello/user1'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
        });

        it('should handle message workflow', async () => {
            // Arrange
            const chatId = 'chat1';
            const messageData = {
                content: 'Hello world',
                type: 'TEXT'
            };
            const token = 'token123';

            const mockMessages: PagedMessage = {
                content: [
                    {
                        id: 'msg1',
                        version: 1,
                        createDate: '2023-01-01',
                        updateDate: '2023-01-01',
                        chatId: 'chat1',
                        senderId: 'user1',
                        recipientId: 'user2',
                        text: 'Hello world',
                        senderName: 'User One',
                        isSeen: false
                    }
                ],
                totalPages: 1,
                totalElements: 1,
                size: 10,
                number: 0,
                first: true,
                last: true,
                numberOfElements: 1,
                empty: false,
                pageable: {
                    pageNumber: 0,
                    pageSize: 10,
                    sort: { sorted: false, unsorted: true, empty: false },
                    offset: 0,
                    paged: true,
                    unpaged: false
                },
                sort: { sorted: false, unsorted: true, empty: false }
            };

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ id: 'msg1' })
                } as Response)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockMessages
                } as Response);

            // Act & Assert - Send message
            const sentMessage = await chatService.sendMessage(chatId, messageData, token);
            expect(sentMessage).toBeDefined();
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/chat1/messages'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123',
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(messageData)
                })
            );

            // Act & Assert - Get messages
            const messages = await chatRepository.getMessages(chatId, '?page=0&size=10', token);
            expect(messages).toEqual(mockMessages);
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/chat1/messages?page=0&size=10'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle network errors gracefully', async () => {
            // Arrange
            const userId = 'user1';
            const token = 'token123';
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            // Act & Assert
            await expect(chatService.getChats(userId, token)).rejects.toThrow('Network error');
        });

        it('should handle API errors gracefully', async () => {
            // Arrange
            const userId = 'user1';
            const token = 'token123';
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Internal server error' })
            } as Response);

            // Act & Assert
            await expect(chatService.getChats(userId, token)).rejects.toThrow();
        });

        it('should handle validation errors', async () => {
            // Arrange
            const invalidChatData = {
                userIds: [],
                recipientId: '',
                text: '',
                isGroupChat: false
            } as CreateChatRequest;
            const token = 'token123';

            // Act & Assert
            await expect(chatService.createChat(invalidChatData, token)).rejects.toThrow();
        });
    });

    describe('Configuration Integration', () => {
        it('should respect environment configuration', () => {
            // Act
            const config = diContainer.getConfig();

            // Assert
            expect(config).toBeDefined();
            expect(typeof config.useMockRepositories).toBe('boolean');
            expect(typeof config.useReactQuery).toBe('boolean');
        });

        it('should provide consistent repository instance', () => {
            // Act
            const repo1 = diContainer.getChatRepository();
            const repo2 = diContainer.getChatRepository();

            // Assert
            expect(repo1).toBe(repo2); // Same instance
        });

        it('should provide consistent service instance', () => {
            // Act
            const service1 = diContainer.getChatService();
            const service2 = diContainer.getChatService();

            // Assert
            expect(service1).toBe(service2); // Same instance
        });
    });
});
