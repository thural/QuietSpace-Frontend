/**
 * Chat Repository Unit Tests.
 * 
 * Unit tests for ChatRepository implementation.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ChatRepository } from "@chat/data/repositories/ChatRepository";
import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from '@/features/chat/data/models/chat';
import type { ResId } from '@/shared/api/models/common';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('ChatRepository', () => {
    let chatRepository: IChatRepository;
    let mockFetch: jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
        chatRepository = new ChatRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getChats', () => {
        it('should fetch chats successfully', async () => {
            // Arrange
            const mockChats: ChatList = {
                content: [
                    {
                        id: '1',
                        version: 1,
                        createDate: '2023-01-01',
                        updateDate: '2023-01-01',
                        userIds: ['user1', 'user2'],
                        members: [],
                        recentMessage: undefined
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

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockChats
            } as Response);

            // Act
            const result = await chatRepository.getChats('user1', 'token123');

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/user1'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
            expect(result).toEqual(mockChats);
        });

        it('should handle fetch error', async () => {
            // Arrange
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            // Act & Assert
            await expect(chatRepository.getChats('user1', 'token123')).rejects.toThrow('Network error');
        });
    });

    describe('createChat', () => {
        it('should create chat successfully', async () => {
            // Arrange
            const chatData: CreateChatRequest = {
                userIds: ['user1', 'user2'],
                recipientId: 'user2',
                text: 'Hello',
                isGroupChat: false
            };

            const mockResponse: ChatResponse = {
                id: '1',
                version: 1,
                createDate: '2023-01-01',
                updateDate: '2023-01-01',
                userIds: ['user1', 'user2'],
                members: [],
                recentMessage: undefined
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            } as Response);

            // Act
            const result = await chatRepository.createChat(chatData, 'token123');

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123',
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(chatData)
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteChat', () => {
        it('should delete chat successfully', async () => {
            // Arrange
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 204
            } as Response);

            // Act
            const result = await chatRepository.deleteChat('chat1', 'token123');

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/chat1'),
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
            expect(result).toBeDefined();
        });
    });

    describe('getMessages', () => {
        it('should fetch messages successfully', async () => {
            // Arrange
            const mockMessages: PagedMessage = {
                content: [
                    {
                        id: '1',
                        version: 1,
                        createDate: '2023-01-01',
                        updateDate: '2023-01-01',
                        senderId: 'user1',
                        chatId: 'chat1',
                        content: 'Hello',
                        type: 'TEXT',
                        isRead: false,
                        isSeen: false,
                        attachments: []
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

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockMessages
            } as Response);

            // Act
            const result = await chatRepository.getMessages('chat1', '?page=0&size=10', 'token123');

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/chat1/messages?page=0&size=10'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
            expect(result).toEqual(mockMessages);
        });
    });

    describe('sendMessage', () => {
        it('should send message successfully', async () => {
            // Arrange
            const messageData = {
                content: 'Hello',
                type: 'TEXT'
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'msg1', content: 'Hello' })
            } as Response);

            // Act
            const result = await chatRepository.sendMessage('chat1', messageData, 'token123');

            // Assert
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
            expect(result).toBeDefined();
        });
    });

    describe('searchChats', () => {
        it('should search chats successfully', async () => {
            // Arrange
            const mockChats: ChatList = {
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
                json: async () => mockChats
            } as Response);

            // Act
            const result = await chatRepository.searchChats('hello', 'user1', 'token123');

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/chats/search/hello/user1'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token123'
                    })
                })
            );
            expect(result).toEqual(mockChats);
        });
    });
});
