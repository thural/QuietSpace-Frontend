import {ChatRepository} from '@chat/data/repositories/ChatRepository';
import {MessageRepository} from '@chat/data/repositories/MessageRepository';
import {ChatList, ChatResponse, CreateChatRequest, MessageRequest, PagedMessage} from '../data/models/chat';
import {ResId} from '@/shared/api/models/common';
import { Container } from '@/core/di';

/**
 * Helper function to get DI container instance
 */
const getContainer = () => {
    // Try to get the global app container, fallback to creating a new one
    return (globalThis as any).__appContainer || Container.create();
};

/**
 * Enhanced Chat Service - Provides high-level chat operations
 * Wraps repository calls with business logic and coordination
 */
export class ChatService {
    constructor(private chatRepository: ChatRepository, private messageRepository: MessageRepository) {}

    static async getChatsForUser(userId: ResId): Promise<ChatList> {
        const container = getContainer();
        const chatRepository = container.get(ChatRepository);
        return await chatRepository.getChatByUserId(userId);
    }

    static async createChatWithMessage(chatData: CreateChatRequest, messageData?: MessageRequest): Promise<ChatResponse> {
        const container = getContainer();
        const chatRepository = container.get(ChatRepository);
        const messageRepository = container.get(MessageRepository);
        
        const chat = await chatRepository.createChat(chatData);
        
        // If initial message provided, send it
        if (messageData && chat.id) {
            await messageRepository.createMessage({
                ...messageData,
                chatId: chat.id
            });
        }
        
        return chat;
    }

    static async getChatWithMessages(chatId: ResId, pageParams?: string): Promise<{
        chat: ChatResponse;
        messages: PagedMessage;
    }> {
        const container = getContainer();
        const chatRepository = container.get(ChatRepository);
        const messageRepository = container.get(MessageRepository);
        
        const [chat, messages] = await Promise.all([
            chatRepository.getChatById(chatId),
            messageRepository.getMessages(chatId, pageParams)
        ]);

        return { chat, messages };
    }

    static async deleteChatAndHistory(chatId: ResId): Promise<Response> {
        // In a real implementation, this might cascade delete messages
        const container = getContainer();
        const chatRepository = container.get(ChatRepository);
        return await chatRepository.deleteChat(chatId);
    }

    // Business logic methods
    static async canUserAccessChat(userId: ResId, chatId: ResId): Promise<boolean> {
        try {
            const container = getContainer();
            const chatRepository = container.get(ChatRepository);
            const chat = await chatRepository.getChatById(chatId);
            // Add business logic for access control
            return true; // Simplified for example
        } catch {
            return false;
        }
    }

    static async getUnreadMessageCount(chatId: ResId): Promise<number> {
        const container = getContainer();
        const messageRepository = container.get(MessageRepository);
        const messages = await messageRepository.getMessages(chatId);
        // Count unread messages (business logic)
        return messages.content.filter(msg => !msg.isRead).length;
    }
}
