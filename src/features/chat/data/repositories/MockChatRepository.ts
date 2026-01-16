/**
 * Mock Chat Repository.
 * 
 * Mock implementation of chat repository for testing and UI development.
 * Provides in-memory data storage and simulated API responses.
 */

import type { ChatList, ChatResponse, CreateChatRequest, PagedMessage } from "@/api/schemas/inferred/chat";
import type { ResId } from "@/api/schemas/inferred/common";
import type { JwtToken } from "@/api/schemas/inferred/common";
import type { IChatRepository } from "../../../domain/entities/ChatRepository";
import type { 
    ChatMessage, 
    ChatAttachment, 
    ChatReaction,
    ChatSettings,
    ChatParticipant,
    ChatStatus,
    ChatTypingIndicator,
    ChatNotification
} from "../../../domain/entities/ChatEntities";

/**
 * Mock Chat Repository implementation.
 */
export class MockChatRepository implements IChatRepository {
    private token: JwtToken | null;
    private mockData: Map<string, any> = new Map();

    constructor(token: JwtToken | null = null) {
        this.token = token;
        this.initializeMockData();
    }

    /**
     * Initialize mock data for testing.
     */
    private initializeMockData(): void {
        // Mock chat data
        this.mockData.set('chats', {
            content: [
                {
                    id: 'chat-1',
                    name: 'General Chat',
                    userIds: ['user-1', 'user-2'],
                    members: [
                        { id: 'user-1', name: 'User 1', role: 'admin', isOnline: true },
                        { id: 'user-2', name: 'User 2', role: 'member', isOnline: false }
                    ],
                    recentMessage: {
                        id: 'msg-1',
                        chatId: 'chat-1',
                        senderId: 'user-1',
                        content: 'Hello everyone!',
                        timestamp: '2024-01-16T10:00:00Z',
                        isRead: false
                    },
                    createdAt: '2024-01-16T09:00:00Z',
                    updatedAt: '2024-01-16T10:00:00Z'
                },
                {
                    id: 'chat-2',
                    name: 'Support Chat',
                    userIds: ['user-1', 'support-1'],
                    members: [
                        { id: 'user-1', name: 'User 1', role: 'admin', isOnline: true },
                        { id: 'support-1', name: 'Support Agent', role: 'moderator', isOnline: true }
                    ],
                    recentMessage: {
                        id: 'msg-2',
                        chatId: 'chat-2',
                        senderId: 'support-1',
                        content: 'How can I help you today?',
                        timestamp: '2024-01-16T11:00:00Z',
                        isRead: true
                    },
                    createdAt: '2024-01-15T14:00:00Z',
                    updatedAt: '2024-01-16T11:00:00Z'
                }
            ],
            pageable: {
                pageNumber: 1,
                pageSize: 10,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            totalPages: 1,
            totalElements: 2,
            last: false,
            first: true,
            size: 2,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            numberOfElements: 2,
            empty: false
        });

        // Mock messages data
        this.mockData.set('messages', {
            content: [
                {
                    id: 'msg-1',
                    chatId: 'chat-1',
                    senderId: 'user-1',
                    senderName: 'User 1',
                    content: 'Hello everyone!',
                    timestamp: '2024-01-16T10:00:00Z',
                    isRead: false,
                    messageType: 'text',
                    attachments: [],
                    reactions: []
                },
                {
                    id: 'msg-2',
                    chatId: 'chat-1',
                    senderId: 'user-2',
                    senderName: 'User 2',
                    content: 'Hi there!',
                    timestamp: '2024-01-16T10:30:00Z',
                    isRead: true,
                    messageType: 'text',
                    attachments: [],
                    reactions: []
                }
            ],
            pageable: {
                pageNumber: 1,
                pageSize: 9,
                sort: { sorted: false, unsorted: true, empty: false },
                offset: 0,
                paged: true,
                unpaged: false
            },
            totalPages: 1,
            totalElements: 2,
            last: false,
            first: true,
            size: 2,
            number: 0,
            sort: { sorted: false, unsorted: true, empty: false },
            numberOfElements: 2,
            empty: false
        });
    }

    /**
     * Get all chats for a user.
     */
    async getChats(userId: string, token: JwtToken): Promise<ChatList> {
        console.log('MockChatRepository: Getting chats for user:', userId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const chats = this.mockData.get('chats');
        console.log('MockChatRepository: Chats retrieved successfully');
        return chats;
    }

    /**
     * Create a new chat.
     */
    async createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse> {
        console.log('MockChatRepository: Creating chat with data:', chatData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const response = {
            id: `chat-${Date.now()}`,
            name: chatData.text ? `Chat about ${chatData.text}` : 'New Chat',
            userIds: chatData.userIds,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Chat created successfully');
        return response;
    }

    /**
     * Delete a chat.
     */
    async deleteChat(chatId: ResId, token: JwtToken): Promise<Response> {
        console.log('MockChatRepository: Deleting chat:', chatId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const response = new Response(JSON.stringify({ success: true }), { status: 200 });
        console.log('MockChatRepository: Chat deleted successfully');
        return response;
    }

    /**
     * Get messages for a specific chat.
     */
    async getMessages(chatId: ResId, page: number, token: JwtToken): Promise<PagedMessage> {
        console.log('MockChatRepository: Getting messages for chat:', chatId, 'page:', page);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const messages = this.mockData.get('messages');
        console.log('MockChatRepository: Messages retrieved successfully');
        return messages;
    }

    /**
     * Send a message in a chat.
     */
    async sendMessage(chatId: ResId, messageData: any, token: JwtToken): Promise<any> {
        console.log('MockChatRepository: Sending message to chat:', chatId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const response = {
            id: `msg-${Date.now()}`,
            chatId,
            senderId: messageData.senderId,
            content: messageData.content,
            timestamp: new Date().toISOString(),
            isRead: false
        };
        
        console.log('MockChatRepository: Message sent successfully');
        return response;
    }

    /**
     * Get chat details.
     */
    async getChatDetails(chatId: ResId, token: JwtToken): Promise<ChatResponse> {
        console.log('MockChatRepository: Getting chat details for:', chatId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = {
            id: chatId,
            name: `Chat ${chatId}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Chat details retrieved successfully');
        return response;
    }

    /**
     * Update chat settings.
     */
    async updateChatSettings(chatId: ResId, settings: any, token: JwtToken): Promise<ChatResponse> {
        console.log('MockChatRepository: Updating chat settings for:', chatId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const response = {
            id: chatId,
            settings,
            updatedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Chat settings updated successfully');
        return response;
    }

    /**
     * Search chats.
     */
    async searchChats(query: string, userId: string, token: JwtToken): Promise<ChatList> {
        console.log('MockChatRepository: Searching chats with query:', query, 'for user:', userId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Filter mock chats based on query
        const allChats = this.mockData.get('chats');
        const filteredChats = allChats.content.filter((chat: any) => 
            chat.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const response = {
            ...allChats,
            content: filteredChats,
            totalElements: filteredChats.length,
            numberOfElements: filteredChats.length,
            empty: filteredChats.length === 0
        };
        
        console.log('MockChatRepository: Chat search completed successfully');
        return response;
    }

    /**
     * Get chat participants.
     */
    async getChatParticipants(chatId: ResId, token: JwtToken): Promise<any[]> {
        console.log('MockChatRepository: Getting participants for chat:', chatId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const allChats = this.mockData.get('chats');
        const chat = allChats.content.find((c: any) => c.id === chatId);
        const participants = chat?.members || [];
        
        console.log('MockChatRepository: Participants retrieved successfully');
        return participants;
    }

    /**
     * Add participant to chat.
     */
    async addParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
        console.log('MockChatRepository: Adding participant to chat:', chatId, 'participant:', participantId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const response = {
            id: chatId,
            participantId,
            addedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Participant added successfully');
        return response;
    }

    /**
     * Remove participant from chat.
     */
    async removeParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
        console.log('MockChatRepository: Removing participant from chat:', chatId, 'participant:', participantId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const response = {
            id: chatId,
            participantId,
            removedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Participant removed successfully');
        return response;
    }

    /**
     * Mark messages as read.
     */
    async markMessagesAsRead(chatId: ResId, messageIds: string[], token: JwtToken): Promise<any> {
        console.log('MockChatRepository: Marking messages as read for chat:', chatId, 'messages:', messageIds);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = {
            chatId,
            messageIds,
            markedAt: new Date().toISOString()
        };
        
        console.log('MockChatRepository: Messages marked as read successfully');
        return response;
    }

    /**
     * Get unread message count.
     */
    async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
        console.log('MockChatRepository: Getting unread count for user:', userId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Count unread messages from all chats
        const allChats = this.mockData.get('chats');
        const allMessages = this.mockData.get('messages');
        let unreadCount = 0;
        
        allMessages.content.forEach((msg: ChatMessage) => {
            if (!msg.isRead) {
                unreadCount++;
            }
        });
        
        console.log('MockChatRepository: Unread count retrieved successfully');
        return unreadCount;
    }
}
