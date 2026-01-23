import {MESSAGE_PATH} from "@/shared/constants/apiPath";
import {apiClient} from "@/core/network/rest/apiClient";
import {JwtToken, ResId} from "@/shared/api/models/common";
import {MessageRequest, MessageResponse, PagedMessage} from "@/features/chat/data/models/chat";

export const fetchMessages = async (chatId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedMessage> => {
    const { data } = await apiClient.get(MESSAGE_PATH + `/chat/${chatId}` + (pageParams || ""));
    return data;
};

export const fetchCreateMessage = async (body: MessageRequest, token: JwtToken): Promise<MessageResponse> => {
    const { data } = await apiClient.post(MESSAGE_PATH, body);
    return data;
};

export const fetchDeleteMessage = async (token: JwtToken, messageId: ResId): Promise<Response> => (
    await apiClient.delete(MESSAGE_PATH + `/${messageId}`)
);