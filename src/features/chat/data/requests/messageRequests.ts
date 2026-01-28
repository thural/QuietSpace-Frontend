import { MESSAGE_PATH } from "@/core/shared/apiPath";
import { createApiClient, type IApiClient } from "@/core/network";
import { JwtToken, ResId } from "@/shared/api/models/common";
import { MessageRequest, MessageResponse, PagedMessage } from "@/features/chat/data/models/chat";

// Create authenticated API client
const apiClient: IApiClient = createApiClient();

export const fetchMessages = async (chatId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedMessage> => {
    apiClient.setAuth(token);
    const response = await apiClient.get(MESSAGE_PATH + `/chat/${chatId}` + (pageParams || ""));
    return response.data;
};

export const fetchCreateMessage = async (body: MessageRequest, token: JwtToken): Promise<MessageResponse> => {
    apiClient.setAuth(token);
    const response = await apiClient.post(MESSAGE_PATH, body);
    return response.data;
};

export const fetchDeleteMessage = async (token: JwtToken, messageId: ResId): Promise<void> => {
    apiClient.setAuth(token);
    await apiClient.delete(MESSAGE_PATH + `/${messageId}`);
};