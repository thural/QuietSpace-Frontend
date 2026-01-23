import type {AxiosInstance} from 'axios';
import {Inject, Injectable} from '@/core/di';
import {TYPES} from '@/core/di/types';
import {MESSAGE_PATH} from "@/shared/constants/apiPath";
import {ResId} from "@/shared/api/models/common";
import {MessageRequest, MessageResponse, PagedMessage} from "@/features/chat/data/models/chat";

/**
 * Message Repository - Handles message-related API operations
 */
@Injectable()
export class MessageRepository {
    constructor(@Inject(TYPES.API_CLIENT) private apiClient: AxiosInstance) {}

    async getMessages(chatId: ResId, pageParams?: string): Promise<PagedMessage> {
        const { data } = await this.apiClient.get(MESSAGE_PATH + `/chat/${chatId}` + (pageParams || ""));
        return data;
    }

    async createMessage(body: MessageRequest): Promise<MessageResponse> {
        const { data } = await this.apiClient.post(MESSAGE_PATH, body);
        return data;
    }

    async deleteMessage(messageId: ResId): Promise<Response> {
        return await this.apiClient.delete(MESSAGE_PATH + `/${messageId}`);
    }
}
