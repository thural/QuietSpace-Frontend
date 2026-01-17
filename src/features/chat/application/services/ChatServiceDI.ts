import 'reflect-metadata';
import * as React from 'react';
import { Injectable, Inject, useService } from '../../../../core/di';

// Chat service interfaces
interface IChatService {
  getChats(): Promise<any[]>;
  sendMessage(chatId: string, message: string): Promise<void>;
  markAsRead(chatId: string): Promise<void>;
}

interface IChatRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  save(chat: any): Promise<any>;
}

// Mock chat repository
@Injectable({ lifetime: 'singleton' })
export class ChatRepository implements IChatRepository {
  private chats = new Map<string, any>();

  async findAll(): Promise<any[]> {
    return Array.from(this.chats.values());
  }

  async findById(id: string): Promise<any> {
    return this.chats.get(id);
  }

  async save(chat: any): Promise<any> {
    this.chats.set(chat.id, chat);
    return chat;
  }
}

// DI-enabled Chat Service
@Injectable({ lifetime: 'singleton' })
export class ChatService implements IChatService {
  constructor(
    @Inject(ChatRepository) private chatRepository: IChatRepository
  ) {}

  async getChats(): Promise<any[]> {
    return await this.chatRepository.findAll();
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    console.log(`Sending message to chat ${chatId}: ${message}`);
    // In real app, this would use WebSocket service
  }

  async markAsRead(chatId: string): Promise<void> {
    console.log(`Marking chat ${chatId} as read`);
    // In real app, this would update chat status
  }
}

// DI-enabled Chat Hook
export const useChatDI = () => {
  const chatService = useService(ChatService);
  const [chats, setChats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchChats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const chatData = await chatService.getChats();
      setChats(chatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  }, [chatService]);

  const sendMessage = React.useCallback(async (chatId: string, message: string) => {
    try {
      await chatService.sendMessage(chatId, message);
      // Update local state optimistically
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: message, updatedAt: new Date() }
          : chat
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [chatService]);

  const markAsRead = React.useCallback(async (chatId: string) => {
    try {
      await chatService.markAsRead(chatId);
      // Update local state
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 }
          : chat
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, [chatService]);

  return {
    chats,
    loading,
    error,
    fetchChats,
    sendMessage,
    markAsRead
  };
};
