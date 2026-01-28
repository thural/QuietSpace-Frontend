import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {CHAT_PATH, CHAT_PATH_BY_MEMBER} from "@/core/shared/apiPath";
import {ChatList, ChatResponse, CreateChatRequest, PagedMessage} from "../models/chat";
import {JwtToken, ResId} from "@/shared/api/models/common";
import type {IChatRepository} from "@chat/domain/entities/IChatRepository";

/**
 * Chat Repository - Handles chat-related API operations
 */
@Injectable()
export class ChatRepository implements IChatRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getChats(userId: string, token: JwtToken): Promise<ChatList> {
        const { data } = await this.apiClient.get(CHAT_PATH_BY_MEMBER + `/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getChatDetails(chatId: ResId, token: JwtToken): Promise<ChatResponse> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async createChat(chatData: CreateChatRequest, token: JwtToken): Promise<ChatResponse> {
        const { data } = await this.apiClient.post(CHAT_PATH, chatData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async addParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
        const { data } = await this.apiClient.patch(CHAT_PATH + `/${chatId}/members/add/${participantId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async removeParticipant(chatId: ResId, participantId: string, token: JwtToken): Promise<ChatResponse> {
        const { data } = await this.apiClient.patch(CHAT_PATH + `/${chatId}/members/remove/${participantId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async deleteChat(chatId: ResId, token: JwtToken): Promise<Response> {
        return await this.apiClient.delete(CHAT_PATH + `/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    async getMessages(chatId: ResId, page: number, token: JwtToken): Promise<PagedMessage> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/${chatId}/messages?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async sendMessage(chatId: ResId, messageData: any, token: JwtToken): Promise<any> {
        const { data } = await this.apiClient.post(CHAT_PATH + `/${chatId}/messages`, messageData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async updateChatSettings(chatId: ResId, settings: any, token: JwtToken): Promise<ChatResponse> {
        const { data } = await this.apiClient.put(CHAT_PATH + `/${chatId}/settings`, settings, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async searchChats(query: string, userId: string, token: JwtToken): Promise<ChatList> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/search?q=${encodeURIComponent(query)}&userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getChatParticipants(chatId: ResId, token: JwtToken): Promise<any[]> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/${chatId}/participants`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async markMessagesAsRead(chatId: ResId, messageIds: string[], token: JwtToken): Promise<any> {
        const { data } = await this.apiClient.post(CHAT_PATH + `/${chatId}/messages/read`, { messageIds }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }

    async getUnreadCount(userId: string, token: JwtToken): Promise<number> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/unread/count?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data.count || 0;
    }

    async deleteMessage(messageId: string, token: JwtToken): Promise<Response> {
        return await this.apiClient.delete(CHAT_PATH + `/messages/${messageId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}
