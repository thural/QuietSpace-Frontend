import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {CHAT_PATH, CHAT_PATH_BY_MEMBER} from "@/shared/constants/apiPath";
import {ChatList, ChatResponse, CreateChatRequest} from "../models/chat";
import {ResId} from "@/shared/api/models/common";
import {UserResponse} from "@profile/data/models/user";

/**
 * Chat Repository - Handles chat-related API operations
 */
@Injectable()
export class ChatRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getChatByUserId(userId: ResId): Promise<ChatList> {
        const { data } = await this.apiClient.get(CHAT_PATH_BY_MEMBER + `/${userId}`);
        return data;
    }

    async getChatById(chatId: ResId): Promise<ChatResponse> {
        const { data } = await this.apiClient.get(CHAT_PATH + `/${chatId}`);
        return data;
    }

    async createChat(body: CreateChatRequest): Promise<ChatResponse> {
        const { data } = await this.apiClient.post(CHAT_PATH, body);
        return data;
    }

    async addMemberWithId(chatId: ResId, userId: ResId): Promise<UserResponse> {
        const { data } = await this.apiClient.patch(CHAT_PATH + `/${chatId}/members/add/${userId}`);
        return data;
    }

    async popMemberWithId(chatId: ResId, userId: ResId): Promise<UserResponse> {
        const { data } = await this.apiClient.patch(CHAT_PATH + `/${chatId}/members/remove/${userId}`);
        return data;
    }

    async deleteChat(chatId: ResId): Promise<Response> {
        return await this.apiClient.delete(CHAT_PATH + `/${chatId}`);
    }
}
