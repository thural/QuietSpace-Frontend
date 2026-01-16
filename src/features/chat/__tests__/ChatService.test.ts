/**
 * Chat Service Unit Tests.
 * 
 * Unit tests for ChatService implementation.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ChatService } from '../../application/services/ChatService';
import type { IChatService } from '../../application/services/ChatService';
import type { IChatRepository } from '../../domain/entities/IChatRepository';
import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from '@/api/schemas/inferred/chat';
import type { ResId } from '@/api/schemas/inferred/common';

// Mock repository
const mockChatRepository: jest.Mocked<IChatRepository> = {
    getChats: jest.fn(),
    createChat: jest.fn(),
    deleteChat: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    getChatDetails: jest.fn(),
    updateChatSettings: jest.fn(),
    searchChats: jest.fn(),
    getChatParticipants: jest.fn(),
    addParticipant: jest.fn(),
    removeParticipant: jest.fn(),
    markMessagesAsRead: jest.fn(),
    getUnreadCount: jest.fn()
};

describe('ChatService', () => {
    let chatService: IChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        chatService = new ChatService(mockChatRepository);
    });

    describe('getChats', () => {
        it('should get chats successfully', async () => {
            // Arrange
            const userId = 'user1';
            const token = 'token123';
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

            mockChatRepository.getChats.mockResolvedValue(mockChats);

            // Act
            const result = await chatService.getChats(userId, token);

            // Assert
            expect(mockChatRepository.getChats).toHaveBeenCalledWith(userId, token);
            expect(result).toEqual(mockChats);
        });

        it('should handle getChats error', async () => {
            // Arrange
            const userId = 'user1';
            const token = 'token123';
            const error = new Error('Repository error');
            mockChatRepository.getChats.mockRejectedValue(error);

            // Act & Assert
            await expect(chatService.getChats(userId, token)).rejects.toThrow('Repository error');
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
            const token = 'token123';
            const mockResponse: ChatResponse = {
                id: '1',
                version: 1,
                createDate: '2023-01-01',
                updateDate: '2023-01-01',
                userIds: ['user1', 'user2'],
                members: [],
                recentMessage: undefined
            };

            mockChatRepository.createChat.mockResolvedValue(mockResponse);

            // Act
            const result = await chatService.createChat(chatData, token);

            // Assert
            expect(mockChatRepository.createChat).toHaveBeenCalledWith(chatData, token);
            expect(result).toEqual(mockResponse);
        });

        it('should validate chat data before creating', async () => {
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

    describe('deleteChat', () => {
        it('should delete chat successfully', async () => {
            // Arrange
            const chatId = 'chat1';
            const token = 'token123';
            mockChatRepository.deleteChat.mockResolvedValue({} as Response);

            // Act
            const result = await chatService.deleteChat(chatId, token);

            // Assert
            expect(mockChatRepository.deleteChat).toHaveBeenCalledWith(chatId, token);
            expect(result).toBeDefined();
        });

        it('should validate chat ID before deleting', async () => {
            // Arrange
            const invalidChatId = '';
            const token = 'token123';

            // Act & Assert
            await expect(chatService.deleteChat(invalidChatId, token)).rejects.toThrow();
        });
    });

    describe('sendMessage', () => {
        it('should send message successfully', async () => {
            // Arrange
            const chatId = 'chat1';
            const messageData = {
                content: 'Hello',
                type: 'TEXT'
            };
            const token = 'token123';
            mockChatRepository.sendMessage.mockResolvedValue({ id: 'msg1' });

            // Act
            const result = await chatService.sendMessage(chatId, messageData, token);

            // Assert
            expect(mockChatRepository.sendMessage).toHaveBeenCalledWith(chatId, messageData, token);
            expect(result).toBeDefined();
        });

        it('should validate message data before sending', async () => {
            // Arrange
            const chatId = 'chat1';
            const invalidMessageData = {
                content: '',
                type: 'TEXT'
            };
            const token = 'token123';

            // Act & Assert
            await expect(chatService.sendMessage(chatId, invalidMessageData, token)).rejects.toThrow();
        });
    });

    describe('searchChats', () => {
        it('should search chats successfully', async () => {
            // Arrange
            const query = 'hello';
            const userId = 'user1';
            const token = 'token123';
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

            mockChatRepository.searchChats.mockResolvedValue(mockChats);

            // Act
            const result = await chatService.searchChats(query, userId, token);

            // Assert
            expect(mockChatRepository.searchChats).toHaveBeenCalledWith(query, userId, token);
            expect(result).toEqual(mockChats);
        });

        it('should validate search query', async () => {
            // Arrange
            const invalidQuery = '';
            const userId = 'user1';
            const token = 'token123';

            // Act & Assert
            await expect(chatService.searchChats(invalidQuery, userId, token)).rejects.toThrow();
        });
    });

    describe('updateChatSettings', () => {
        it('should update chat settings successfully', async () => {
            // Arrange
            const chatId = 'chat1';
            const settings = {
                muteNotifications: true,
                theme: 'dark'
            };
            const token = 'token123';
            const mockResponse: ChatResponse = {
                id: '1',
                version: 1,
                createDate: '2023-01-01',
                updateDate: '2023-01-01',
                userIds: ['user1', 'user2'],
                members: [],
                recentMessage: undefined
            };

            mockChatRepository.updateChatSettings.mockResolvedValue(mockResponse);

            // Act
            const result = await chatService.updateChatSettings(chatId, settings, token);

            // Assert
            expect(mockChatRepository.updateChatSettings).toHaveBeenCalledWith(chatId, settings, token);
            expect(result).toEqual(mockResponse);
        });

        it('should validate settings object', async () => {
            // Arrange
            const chatId = 'chat1';
            const invalidSettings = null;
            const token = 'token123';

            // Act & Assert
            await expect(chatService.updateChatSettings(chatId, invalidSettings, token)).rejects.toThrow();
        });
    });
});
